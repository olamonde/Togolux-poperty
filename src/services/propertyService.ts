import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { PropertyRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'properties';

export function subscribeProperties(
  callback: (properties: PropertyRecord[]) => void,
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
        const list: PropertyRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as PropertyRecord),
          id: d.id,
          ref: d.data().reference || d.data().ref || d.id,
        }));
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

export async function getProperties(ownerId?: string): Promise<PropertyRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      ...(d.data() as PropertyRecord),
      id: d.id,
      ref: d.data().reference || d.data().ref || d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function getPropertyById(id: string): Promise<PropertyRecord | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return {
      ...(snap.data() as PropertyRecord),
      id: snap.id,
      ref: snap.data().reference || snap.data().ref || snap.id,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
}

export async function saveProperty(
  property: PropertyRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = property.id || `prop-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: PropertyRecord = {
    ...property,
    id,
    reference: property.reference || property.ref || `TL-PRP-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: property.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_property',
        'property',
        id,
        `Bien « ${dataToSave.name} » (${dataToSave.reference}) enregistré ou mis à jour.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function updatePropertyStatus(
  id: string,
  status: PropertyRecord['status'],
  user?: { uid: string; displayName: string }
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'update_property_status',
        'property',
        id,
        `Statut du bien mis à jour: ${status}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteProperty(
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
        'delete_property',
        'property',
        id,
        `Suppression du bien immobilier réf. ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
