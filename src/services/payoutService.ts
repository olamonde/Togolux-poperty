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
import { OwnerPayoutRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'ownerPayouts';

export function subscribeOwnerPayouts(
  callback: (payouts: OwnerPayoutRecord[]) => void,
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
        const list: OwnerPayoutRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as OwnerPayoutRecord),
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

export async function getOwnerPayouts(ownerId?: string): Promise<OwnerPayoutRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      ...(d.data() as OwnerPayoutRecord),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function saveOwnerPayout(
  payout: OwnerPayoutRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = payout.id || `payo-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: OwnerPayoutRecord = {
    ...payout,
    id,
    reference: payout.reference || `REV-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: payout.createdAt || now,
    updatedAt: now,
    createdBy: user?.uid || payout.createdBy || 'system',
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_owner_payout',
        'ownerPayout',
        id,
        `Reversement de ${dataToSave.netAmount.toLocaleString('fr-FR')} FCFA enregistré pour le propriétaire ID ${dataToSave.ownerId}.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}
