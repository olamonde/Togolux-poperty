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
import { ExpenseRecord } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'expenses';

export function subscribeExpenses(
  callback: (expenses: ExpenseRecord[]) => void,
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
        const list: ExpenseRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as ExpenseRecord),
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

export async function getExpenses(ownerId?: string): Promise<ExpenseRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      ...(d.data() as ExpenseRecord),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function saveExpense(
  expense: ExpenseRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = expense.id || `exp-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: ExpenseRecord = {
    ...expense,
    id,
    reference: expense.reference || `DEP-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: expense.createdAt || now,
    updatedAt: now,
    createdBy: user?.uid || expense.createdBy || 'system',
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_expense',
        'expense',
        id,
        `Dépense enregistrée: ${dataToSave.amount.toLocaleString('fr-FR')} FCFA (${dataToSave.description}).`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteExpense(
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
        'delete_expense',
        'expense',
        id,
        `Suppression de la dépense ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
