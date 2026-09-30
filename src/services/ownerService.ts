import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { OwnerRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'owners';

export function subscribeOwners(
  callback: (owners: OwnerRecord[]) => void,
  ownerId?: string,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        let list: OwnerRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as OwnerRecord),
          id: d.id,
          ref: d.data().ref || d.id,
        }));
        if (ownerId) {
          list = list.filter((o) => o.id === ownerId || o.userId === ownerId);
        }
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

export async function getOwners(): Promise<OwnerRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
    return snapshot.docs.map((d) => ({
      ...(d.data() as OwnerRecord),
      id: d.id,
      ref: d.data().ref || d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function getOwnerById(id: string): Promise<OwnerRecord | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return {
      ...(snap.data() as OwnerRecord),
      id: snap.id,
      ref: snap.data().ref || snap.id,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
}

export async function saveOwner(
  owner: OwnerRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = owner.id || `own-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: OwnerRecord = {
    ...owner,
    id,
    createdAt: owner.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_owner',
        'owner',
        id,
        `Bailleur « ${dataToSave.fullName} » enregistré ou modifié.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteOwner(
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
        'delete_owner',
        'owner',
        id,
        `Suppression du bailleur ID ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
