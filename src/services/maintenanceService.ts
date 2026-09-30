import {
  collection,
  doc,
  setDoc,
  updateDoc,
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
import { MaintenanceRequestRecord, MaintenanceStatus } from '../types';
import { logAuditEvent } from './auditService';

const COLLECTION_NAME = 'maintenanceRequests';

export function subscribeMaintenance(
  callback: (tickets: MaintenanceRequestRecord[]) => void,
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
        const list: MaintenanceRequestRecord[] = snapshot.docs.map((d) => {
          const data = d.data() as MaintenanceRequestRecord;
          return {
            ...data,
            id: d.id,
            ref: data.reference || data.ref || d.id,
            problemTitle: data.title || data.problemTitle || 'Intervention',
            quoteAmount: data.estimatedCost || data.quoteAmount,
            finalCost: data.actualCost || data.finalCost,
            dateReported: data.reportedAt || data.dateReported || data.createdAt,
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

export async function getMaintenanceRequests(ownerId?: string): Promise<MaintenanceRequestRecord[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = ownerId
      ? query(colRef, where('ownerId', '==', ownerId))
      : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data() as MaintenanceRequestRecord;
      return {
        ...data,
        id: d.id,
        ref: data.reference || data.ref || d.id,
        problemTitle: data.title || data.problemTitle || 'Intervention',
        quoteAmount: data.estimatedCost || data.quoteAmount,
        finalCost: data.actualCost || data.finalCost,
        dateReported: data.reportedAt || data.dateReported || data.createdAt,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function saveMaintenanceRequest(
  ticket: MaintenanceRequestRecord,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const id = ticket.id || `mnt-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();

  const dataToSave: MaintenanceRequestRecord = {
    ...ticket,
    id,
    reference: ticket.reference || ticket.ref || `WRK-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: ticket.title || ticket.problemTitle || 'Intervention',
    reportedAt: ticket.reportedAt || ticket.dateReported || now,
    createdAt: ticket.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'save_maintenance',
        'maintenanceRequest',
        id,
        `Ticket de travaux ${dataToSave.reference} : « ${dataToSave.title} » enregistré.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function updateMaintenanceStatus(
  id: string,
  status: MaintenanceStatus,
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
        'update_maintenance_status',
        'maintenanceRequest',
        id,
        `Changement de statut intervention: ${status}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function approveMaintenanceByOwner(
  id: string,
  user?: { uid: string; displayName: string }
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const now = new Date().toISOString();
  try {
    await updateDoc(docRef, {
      ownerApproved: true,
      ownerApprovedAt: now,
      status: 'scheduled',
      updatedAt: now,
    });
    if (user) {
      await logAuditEvent(
        user.uid,
        user.displayName,
        'owner_approved_maintenance',
        'maintenanceRequest',
        id,
        `Validation des travaux accordée par le propriétaire.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteMaintenanceRequest(
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
        'delete_maintenance',
        'maintenanceRequest',
        id,
        `Suppression de l'intervention ${id}`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
