import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { DocumentRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'documents';

export function subscribeDocuments(
  callback: (docs: DocumentRecord[]) => void,
  ownerId?: string,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'))
      : query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: DocumentRecord[] = snapshot.docs.map((d) => {
          const data = d.data() as DocumentRecord;
          return {
            ...data,
            id: d.id,
            ref: data.ref || d.id,
            title: data.name || data.title || 'Document',
            dateAdded: data.createdAt ? data.createdAt.split('T')[0] : '',
          };
        });
        callback(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function getDocuments(ownerId?: string): Promise<DocumentRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data() as DocumentRecord;
      return {
        ...data,
        id: d.id,
        ref: data.ref || d.id,
        title: data.name || data.title || 'Document',
        dateAdded: data.createdAt ? data.createdAt.split('T')[0] : '',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function saveDocument(
  docItem: DocumentRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = docItem.id || `doc-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: DocumentRecord = {
    ...docItem,
    id,
    name: docItem.name || docItem.title || 'Document sans titre',
    storagePath: docItem.storagePath || `/documents/${id}`,
    createdAt: docItem.createdAt || now,
    updatedAt: now,
    uploadedBy: user?.uid || docItem.uploadedBy || 'system',
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'upload_document',
        'document',
        id,
        `Document GED « ${dataToSave.name} » (${dataToSave.category}) enregistré.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function uploadFileToStorage(
  file: File,
  folder: string,
  entityId: string
): Promise<{ storagePath: string; downloadUrl: string }> {
  try {
    const path = `${folder}/${entityId}/${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return { storagePath: path, downloadUrl };
  } catch (error) {
    console.error('Erreur Firebase Storage:', error);
    throw error;
  }
}

export async function deleteDocument(
  id: string,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'delete_document',
        'document',
        id,
        `Suppression de la métadonnée documentaire ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
