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
import { PaymentRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'payments';

export function subscribePayments(
  callback: (payments: PaymentRecord[]) => void,
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
        const list: PaymentRecord[] = snapshot.docs.map((d) => {
          const data = d.data() as PaymentRecord;
          return {
            ...data,
            id: d.id,
            ref: data.reference || data.ref || d.id,
            date: data.paymentDate || data.date || data.createdAt,
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

export async function getPayments(ownerId?: string): Promise<PaymentRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data() as PaymentRecord;
      return {
        ...data,
        id: d.id,
        ref: data.reference || data.ref || d.id,
        date: data.paymentDate || data.date || data.createdAt,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function savePayment(
  payment: PaymentRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = payment.id || `pay-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: PaymentRecord = {
    ...payment,
    id,
    reference: payment.reference || payment.ref || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentDate: payment.paymentDate || payment.date || now.split('T')[0],
    createdAt: payment.createdAt || now,
    updatedAt: now,
    createdBy: user?.uid || payment.createdBy || 'system',
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_payment',
        'payment',
        id,
        `Paiement/Loyer enregistré: ${dataToSave.amount.toLocaleString('fr-FR')} FCFA (${dataToSave.reference}).`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deletePayment(
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
        'delete_payment',
        'payment',
        id,
        `Suppression de la transaction financière ID ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
