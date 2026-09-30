import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { NotificationRecord } from '../types';

const COLLECTION_NAME = 'notifications';

export function subscribeNotifications(
  userId: string,
  callback: (notifications: NotificationRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(
      colRef,
      where('recipientUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const list: NotificationRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as NotificationRecord),
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

export async function createNotification(notif: NotificationRecord): Promise<void> {
  const id = notif.id || `notif-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await setDoc(docRef, {
      ...notif,
      id,
      createdAt: notif.createdAt || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
