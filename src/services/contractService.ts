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
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { ContractRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'contracts';

export function subscribeContracts(
  callback: (contracts: ContractRecord[]) => void,
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
        const list: ContractRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as ContractRecord),
          id: d.id,
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

export async function getContracts(ownerId?: string): Promise<ContractRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      ...(d.data() as ContractRecord),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function saveContract(
  contract: ContractRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = contract.id || `ctr-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: ContractRecord = {
    ...contract,
    id,
    reference: contract.reference || `CTR-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: contract.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_contract',
        'contract',
        id,
        `Contrat de bail ${dataToSave.reference} enregistré pour le bien ${dataToSave.propertyName || dataToSave.propertyId}.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteContract(
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
        'delete_contract',
        'contract',
        id,
        `Suppression du contrat réf ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
