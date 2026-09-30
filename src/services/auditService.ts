import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { AuditLogRecord } from '../types';

const COLLECTION_NAME = 'auditLogs';

export async function logAuditEvent(
  userId: string,
  userName: string,
  action: string,
  entityType: string,
  entityId: string,
  description: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const auditItem: AuditLogRecord = {
    id: logId,
    userId,
    userName,
    action,
    entityType,
    entityId,
    description,
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, COLLECTION_NAME, logId), auditItem);
  } catch (error) {
    // Non-bloquant mais tracé
    console.error('Erreur audit log:', error);
  }
}

export async function getRecentAuditLogs(max = 50): Promise<AuditLogRecord[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as AuditLogRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}
