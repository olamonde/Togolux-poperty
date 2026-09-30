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
import { TenantRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'tenants';

export function subscribeTenants(
  callback: (tenants: TenantRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: TenantRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as TenantRecord),
          id: d.id,
          ref: d.data().ref || d.id,
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

export async function getTenants(): Promise<TenantRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
    return snapshot.docs.map((d) => ({
      ...(d.data() as TenantRecord),
      id: d.id,
      ref: d.data().ref || d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function getTenantById(id: string): Promise<TenantRecord | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return {
      ...(snap.data() as TenantRecord),
      id: snap.id,
      ref: snap.data().ref || snap.id,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
}

export async function saveTenant(
  tenant: TenantRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = tenant.id || `ten-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: TenantRecord = {
    ...tenant,
    id,
    createdAt: tenant.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_tenant',
        'tenant',
        id,
        `Locataire « ${dataToSave.fullName} » enregistré ou mis à jour.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteTenant(
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
        'delete_tenant',
        'tenant',
        id,
        `Suppression du locataire ID ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
