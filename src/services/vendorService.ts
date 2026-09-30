import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { VendorRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'vendors';

export async function getVendors(): Promise<VendorRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(query(colRef, orderBy('name', 'asc')));
    return snapshot.docs.map((d) => ({
      ...(d.data() as VendorRecord),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function saveVendor(
  vendor: VendorRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = vendor.id || `vnd-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: VendorRecord = {
    ...vendor,
    id,
    createdAt: vendor.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_vendor',
        'vendor',
        id,
        `Prestataire « ${dataToSave.name} » (${dataToSave.specialty}) enregistré.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteVendor(
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
        'delete_vendor',
        'vendor',
        id,
        `Suppression du prestataire ID ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
