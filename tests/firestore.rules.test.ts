/**
 * firestore.rules.test.ts
 * Suite de vérification des règles de sécurité Firestore ABAC pour ImmoPilot / TogoLux Properties.
 * Valide les 12 cas d'exploitation de 'The Dirty Dozen'.
 */

export interface RuleTestScenario {
  id: string;
  name: string;
  actor: {
    uid: string;
    email: string;
    role?: 'admin' | 'manager' | 'accountant' | 'agent' | 'owner';
  };
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  collection: string;
  docId: string;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_SECURITY_TESTS: RuleTestScenario[] = [
  {
    id: 'SEC-01',
    name: 'Privilege Escalation : Un agent ne peut pas modifier son rôle vers admin',
    actor: { uid: 'staff-4', email: 'elom.koudou@togolux.tg', role: 'agent' },
    operation: 'update',
    collection: 'users',
    docId: 'staff-4',
    payload: { role: 'admin' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-02',
    name: 'Cross-Owner Property Read : Un propriétaire A ne peut pas lister les biens du propriétaire B',
    actor: { uid: 'owner-2', email: 'dr.kodjovi@cliniquegrace.tg', role: 'owner' },
    operation: 'list',
    collection: 'properties',
    docId: '',
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-03',
    name: 'Cross-Owner Payment Sniffing : Un bailleur ne peut pas lire les quittances de tiers',
    actor: { uid: 'owner-2', email: 'dr.kodjovi@cliniquegrace.tg', role: 'owner' },
    operation: 'get',
    collection: 'payments',
    docId: 'trx-1', // Propriété de owner-1
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-04',
    name: 'Audit Log Immutability : La mise à jour d’une trace d’audit est strictement interdite',
    actor: { uid: 'staff-1', email: 'koffi.mensah@togolux.tg', role: 'admin' },
    operation: 'update',
    collection: 'auditLogs',
    docId: 'log-1',
    payload: { action: 'falsified' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-05',
    name: 'Audit Log Deletion : La suppression d’une trace d’audit est interdite à quiconque',
    actor: { uid: 'staff-1', email: 'koffi.mensah@togolux.tg', role: 'admin' },
    operation: 'delete',
    collection: 'auditLogs',
    docId: 'log-1',
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-06',
    name: 'Payout Approval by Non-Accountant : Un agent simple ne peut pas approuver un reversement',
    actor: { uid: 'staff-4', email: 'elom.koudou@togolux.tg', role: 'agent' },
    operation: 'update',
    collection: 'ownerPayouts',
    docId: 'payout-2',
    payload: { status: 'paid' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-07',
    name: 'Identity Document Snooping : Un propriétaire ne peut pas consulter le dossier d’un locataire d’un tiers',
    actor: { uid: 'owner-1', email: 'jl.amegavi@heritage-holding.com', role: 'owner' },
    operation: 'get',
    collection: 'tenants',
    docId: 'tenant-4',
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-08',
    name: 'Shadow Field Injection : Refus des champs non contrôlés lors d’une mise à jour',
    actor: { uid: 'staff-4', email: 'elom.koudou@togolux.tg', role: 'agent' },
    operation: 'update',
    collection: 'properties',
    docId: 'prop-1',
    payload: { __shadowField: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-09',
    name: 'Unauthenticated Read : Tout accès non identifié est rejeté',
    actor: { uid: '', email: '' },
    operation: 'get',
    collection: 'documents',
    docId: 'doc-1',
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-10',
    name: 'Completed Maintenance Modification : Un propriétaire ne peut pas modifier un ticket déjà terminé',
    actor: { uid: 'owner-1', email: 'jl.amegavi@heritage-holding.com', role: 'owner' },
    operation: 'update',
    collection: 'maintenanceRequests',
    docId: 'mtn-1',
    payload: { status: 'reopened' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-11',
    name: 'Self Role Creation : Un nouvel utilisateur ne peut pas s’auto-déclarer admin',
    actor: { uid: 'new-user', email: 'pirate@extern.tg' },
    operation: 'create',
    collection: 'users',
    docId: 'new-user',
    payload: { role: 'admin' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 'SEC-12',
    name: 'Denial of Wallet : Tentative d’injection d’un ID corrompu ou surdimensionné (>128 chars)',
    actor: { uid: 'staff-1', email: 'koffi.mensah@togolux.tg', role: 'admin' },
    operation: 'get',
    collection: 'properties',
    docId: 'a'.repeat(200),
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
