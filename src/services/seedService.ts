import { collection, doc, writeBatch, getDocs, limit, query } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import {
  INITIAL_PROPERTIES,
  INITIAL_OWNERS,
  INITIAL_TENANTS,
  INITIAL_TRANSACTIONS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_DOCUMENTS,
} from '../data/seedData';
import {
  ContractRecord,
  ExpenseRecord,
  OwnerPayoutRecord,
  VendorRecord,
  ReportRecord,
  NotificationRecord,
  UserRecord,
} from '../types';

export const INITIAL_VENDORS: VendorRecord[] = [
  {
    id: 'vnd-1',
    name: 'Gervais Koffi',
    companyName: 'Koffi & Fils Climatisation S.A.R.L.',
    phone: '+228 90 22 33 44',
    email: 'contact@koffi-clim.tg',
    address: 'Boulevard du 13 Janvier, Lomé',
    specialty: 'Climatisation & Froid Industriel',
    notes: 'Artisan certifié Daikin/Carrier. Grande réactivité et tarifs négociés.',
    status: 'active',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'vnd-2',
    name: 'Amavi Mensah',
    companyName: 'Lomé Énergie & Maintenance Générateur',
    phone: '+228 91 55 66 77',
    email: 'direction@lome-energie.tg',
    address: 'Zone Portuaire, Lomé',
    specialty: 'Électricité Bâtiment & Groupes Électrogènes',
    notes: 'Spécialiste maintenance groupes insonorisés Perkins et SDMO.',
    status: 'active',
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 'vnd-3',
    name: 'Paul Dosseh',
    companyName: 'Plomberie Sanitaire du Golfe',
    phone: '+228 92 11 00 22',
    email: 'plomberie.golfe@gmail.com',
    address: 'Quartier Tokoin Hôpital, Lomé',
    specialty: 'Plomberie, Forages & Surpresseurs',
    notes: 'Intervient 24/7 sur les fuites d’urgence et pannes de pompes immergées.',
    status: 'active',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'vnd-4',
    name: 'Kossi Agbodo',
    companyName: 'Prestige Peinture & Rénovation Lomé',
    phone: '+228 93 44 88 99',
    email: 'agbodo.peinture@yahoo.fr',
    address: 'Boulevard Circulaire, Agbalépédogan',
    specialty: 'Peinture, Ravalement & Revêtements de sol',
    notes: 'Finitions très soignées pour villas et appartements de standing.',
    status: 'active',
    createdAt: '2024-04-12T08:00:00Z',
    updatedAt: '2026-04-12T08:00:00Z',
  },
];

export const INITIAL_CONTRACTS: ContractRecord[] = [
  {
    id: 'ctr-1',
    reference: 'CTR-2025-014',
    propertyId: 'prop-1',
    propertyName: 'Villa Royale Palm Grove',
    ownerId: 'owner-1',
    ownerName: 'M. Jean-Luc Amégavi',
    tenantId: 'tenant-1',
    tenantName: 'M. David Kpodar',
    type: 'residential',
    startDate: '2025-02-01',
    endDate: '2027-01-31',
    monthlyRent: 1500000,
    securityDeposit: 4500000,
    paymentFrequency: 'monthly',
    currency: 'XOF',
    status: 'active',
    signedAt: '2025-01-28',
    documentId: 'doc-1',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'ctr-2',
    reference: 'CTR-2025-022',
    propertyId: 'prop-2',
    propertyName: 'Résidence Le Baobab - Apt 3B',
    ownerId: 'owner-2',
    ownerName: 'Dr. Mawunyo Kodjovi',
    tenantId: 'tenant-2',
    tenantName: 'Mme Fatoumata Diallo',
    type: 'residential',
    startDate: '2025-02-15',
    endDate: '2026-02-14',
    monthlyRent: 480000,
    securityDeposit: 1440000,
    paymentFrequency: 'monthly',
    currency: 'XOF',
    status: 'active',
    signedAt: '2025-02-10',
    documentId: 'doc-2',
    createdAt: '2025-02-05T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'ctr-3',
    reference: 'CTR-2024-008',
    propertyId: 'prop-3',
    propertyName: 'Immeuble Marina Plaza - Plateau Bureaux 2e',
    ownerId: 'owner-1',
    ownerName: 'M. Jean-Luc Amégavi',
    tenantId: 'tenant-3',
    tenantName: 'SAHEL LOGISTICS S.A.',
    type: 'commercial',
    startDate: '2024-11-01',
    endDate: '2027-10-31',
    monthlyRent: 2200000,
    securityDeposit: 6600000,
    paymentFrequency: 'monthly',
    currency: 'XOF',
    status: 'active',
    signedAt: '2024-10-25',
    documentId: 'doc-3',
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'ctr-4',
    reference: 'CTR-2025-039',
    propertyId: 'prop-4',
    propertyName: 'Duplex Les Orchidées',
    ownerId: 'owner-3',
    ownerName: 'Mme Edwige Tossou',
    tenantId: 'tenant-4',
    tenantName: 'M. Eric Hounsinou',
    type: 'residential',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    monthlyRent: 750000,
    securityDeposit: 2250000,
    paymentFrequency: 'monthly',
    currency: 'XOF',
    status: 'active',
    signedAt: '2025-02-27',
    documentId: 'doc-4',
    createdAt: '2025-02-25T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    reference: 'DEP-2026-0901',
    propertyId: 'prop-1',
    propertyName: 'Villa Royale Palm Grove',
    ownerId: 'owner-1',
    ownerName: 'M. Jean-Luc Amégavi',
    category: 'maintenance',
    description: 'Vidange et révision groupe électrogène 30 kVA (Huile 15W40 + filtres)',
    amount: 95000,
    currency: 'XOF',
    expenseDate: '2026-09-12',
    vendorId: 'vnd-2',
    vendorName: 'Lomé Énergie & Maintenance Générateur',
    status: 'paid',
    notes: 'Facture acquittée par T-Money Pro.',
    createdAt: '2026-09-12T14:00:00Z',
    updatedAt: '2026-09-12T14:00:00Z',
    createdBy: 'staff-2',
  },
  {
    id: 'exp-2',
    reference: 'DEP-2026-0902',
    propertyId: 'prop-2',
    propertyName: 'Résidence Le Baobab - Apt 3B',
    ownerId: 'owner-2',
    ownerName: 'Dr. Mawunyo Kodjovi',
    category: 'repair',
    description: 'Remplacement détendeur et recharge fréon R410A climatiseur split chambre parentale',
    amount: 45000,
    currency: 'XOF',
    expenseDate: '2026-09-18',
    vendorId: 'vnd-1',
    vendorName: 'Koffi & Fils Climatisation S.A.R.L.',
    status: 'paid',
    notes: 'Intervention validée par le bailleur.',
    createdAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-18T11:00:00Z',
    createdBy: 'staff-2',
  },
  {
    id: 'exp-3',
    reference: 'DEP-2026-0903',
    propertyId: 'prop-6',
    propertyName: 'Appartement Horizon Lagune',
    ownerId: 'owner-3',
    ownerName: 'Mme Edwige Tossou',
    category: 'renovation',
    description: 'Acompte travaux peinture satinée et réfection faïence cuisine',
    amount: 180000,
    currency: 'XOF',
    expenseDate: '2026-09-22',
    vendorId: 'vnd-4',
    vendorName: 'Prestige Peinture & Rénovation Lomé',
    status: 'approved',
    notes: 'Rénovation en cours pour relocation au tarif meublé.',
    createdAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-09-22T09:00:00Z',
    createdBy: 'staff-1',
  },
];

export const INITIAL_OWNER_PAYOUTS: OwnerPayoutRecord[] = [
  {
    id: 'payout-1',
    reference: 'REV-2026-0801',
    ownerId: 'owner-1',
    ownerName: 'M. Jean-Luc Amégavi',
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    totalIncome: 3700000,
    totalExpenses: 120000,
    managementFees: 326000,
    otherDeductions: 0,
    netAmount: 3254000,
    currency: 'XOF',
    status: 'paid',
    paymentDate: '2026-09-08',
    paymentMethod: 'Virement bancaire Société Générale',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-08T15:00:00Z',
    createdBy: 'staff-3',
  },
  {
    id: 'payout-2',
    reference: 'REV-2026-0901',
    ownerId: 'owner-1',
    ownerName: 'M. Jean-Luc Amégavi',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    totalIncome: 3700000,
    totalExpenses: 95000,
    managementFees: 326000,
    otherDeductions: 0,
    netAmount: 3279000,
    currency: 'XOF',
    status: 'pending',
    paymentDate: '2026-10-05',
    paymentMethod: 'Virement bancaire Société Générale',
    createdAt: '2026-09-30T10:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z',
    createdBy: 'staff-3',
  },
];

export const INITIAL_REPORTS: ReportRecord[] = [
  {
    id: 'rep-1',
    reference: 'RAP-2026-M09-01',
    type: 'owner_monthly',
    ownerId: 'owner-1',
    ownerName: 'M. Jean-Luc Amégavi',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    title: 'Bilan de Gestion Mensuel — Septembre 2026 (Amégavi Heritage)',
    summary:
      'Encaissement de 100% des loyers perçus sur la Villa Royale et le plateau de bureaux Marina Plaza. Entretien courant du groupe électrogène réalisé avec succès.',
    totalIncome: 3700000,
    totalExpenses: 95000,
    managementFees: 326000,
    netAmount: 3279000,
    maintenanceSummary: 'Révision semestrielle groupe 30 kVA effectuée par Lomé Énergie.',
    generatedBy: 'staff-3',
    generatedAt: '2026-09-30T12:00:00Z',
    status: 'published',
  },
  {
    id: 'rep-2',
    reference: 'RAP-2026-M09-02',
    type: 'owner_monthly',
    ownerId: 'owner-2',
    ownerName: 'Dr. Mawunyo Kodjovi',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    title: 'Bilan de Gestion Mensuel — Septembre 2026 (Dr. Kodjovi)',
    summary:
      'Loyer Appartement Le Baobab perçu sans retard. Villa Oasis Cité OUA proposée activement à la location avec plusieurs visites de diplomates programmées.',
    totalIncome: 480000,
    totalExpenses: 45000,
    managementFees: 48000,
    netAmount: 387000,
    maintenanceSummary: 'Recharge climatisation Baobab effectuée.',
    generatedBy: 'staff-3',
    generatedAt: '2026-09-30T12:00:00Z',
    status: 'published',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    recipientUserId: 'staff-1',
    type: 'payment_late',
    title: 'Retard de loyer détecté',
    message: 'M. Eric Hounsinou (Duplex Les Orchidées) a dépassé la date d’échéance du 5 septembre.',
    relatedEntityType: 'tenant',
    relatedEntityId: 'tenant-4',
    read: false,
    createdAt: '2026-09-15T09:30:00Z',
  },
  {
    id: 'notif-2',
    recipientUserId: 'staff-1',
    type: 'maintenance',
    title: 'Intervention validée par le propriétaire',
    message: 'Dr. Kodjovi a validé le devis pour la climatisation de la Résidence Le Baobab.',
    relatedEntityType: 'maintenanceRequest',
    relatedEntityId: 'mnt-2',
    read: false,
    createdAt: '2026-09-17T14:15:00Z',
  },
  {
    id: 'notif-3',
    recipientUserId: 'owner-1',
    type: 'report_available',
    title: 'Rapport mensuel de gestion disponible',
    message: 'Votre rapport de gérance pour le mois de septembre 2026 est consultable dans votre espace.',
    relatedEntityType: 'report',
    relatedEntityId: 'rep-1',
    read: false,
    createdAt: '2026-09-30T12:05:00Z',
  },
];

export const INITIAL_USERS: UserRecord[] = [
  {
    uid: 'staff-1',
    firstName: 'Koffi',
    lastName: 'Mensah',
    displayName: 'Koffi Mensah',
    email: 'koffi.mensah@togolux.tg',
    phone: '+228 90 01 23 45',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    uid: 'staff-2',
    firstName: 'Amina',
    lastName: 'Lawson',
    displayName: 'Amina Lawson',
    email: 'amina.lawson@togolux.tg',
    phone: '+228 91 12 34 56',
    role: 'manager',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    uid: 'staff-3',
    firstName: 'Kodjo',
    lastName: 'Agbeko',
    displayName: 'Kodjo Agbeko',
    email: 'kodjo.agbeko@togolux.tg',
    phone: '+228 92 23 45 67',
    role: 'accountant',
    status: 'active',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    uid: 'staff-4',
    firstName: 'Elom',
    lastName: 'Koudou',
    displayName: 'Elom Koudou',
    email: 'elom.koudou@togolux.tg',
    phone: '+228 93 34 56 78',
    role: 'agent',
    status: 'active',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    uid: 'owner-1',
    firstName: 'Jean-Luc',
    lastName: 'Amégavi',
    displayName: 'Jean-Luc Amégavi (Bailleur)',
    email: 'jl.amegavi@heritage-holding.com',
    phone: '+33 6 42 18 90 12',
    role: 'owner',
    ownerId: 'owner-1',
    status: 'active',
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
];

/**
 * Fonction maîtresse de synchronisation et d'initialisation de la base Firestore.
 * Écrit toutes les entités de manière relationnelle et cohérente.
 */
export async function seedFirestoreIfEmpty(force = false): Promise<{ seeded: boolean; message: string }> {
  try {
    if (!auth.currentUser) {
      return { seeded: false, message: 'Non authentifié. Connexion requise pour initialiser Firestore.' };
    }

    const propertiesSnap = await getDocs(query(collection(db, 'properties'), limit(1)));
    if (!force && !propertiesSnap.empty) {
      return { seeded: false, message: 'La base Firestore contient déjà des données.' };
    }

    console.log('Démarrage du peuplement relationnel de Cloud Firestore pour TogoLux Properties...');

    // Batch 1: Users, Owners, Vendors
    const batch1 = writeBatch(db);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const isBootstrapped = currentUser.email === 'olamonde7@gmail.com';
      batch1.set(
        doc(db, 'users', currentUser.uid),
        {
          uid: currentUser.uid,
          firstName: currentUser.displayName?.split(' ')[0] || 'Admin',
          lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || 'TogoLux',
          displayName: currentUser.displayName || currentUser.email || 'Admin',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || '',
          photoURL: currentUser.photoURL || undefined,
          role: isBootstrapped ? 'admin' : 'agent',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    INITIAL_USERS.forEach((u) => batch1.set(doc(db, 'users', u.uid), u, { merge: true }));
    INITIAL_OWNERS.forEach((o) => batch1.set(doc(db, 'owners', o.id), o, { merge: true }));
    INITIAL_VENDORS.forEach((v) => batch1.set(doc(db, 'vendors', v.id), v, { merge: true }));
    await batch1.commit();

    // Batch 2: Properties & Tenants
    const batch2 = writeBatch(db);
    INITIAL_PROPERTIES.forEach((p) => batch2.set(doc(db, 'properties', p.id), p));
    INITIAL_TENANTS.forEach((t) => batch2.set(doc(db, 'tenants', t.id), t));
    await batch2.commit();

    // Batch 3: Contracts, Payments & Expenses
    const batch3 = writeBatch(db);
    INITIAL_CONTRACTS.forEach((c) => batch3.set(doc(db, 'contracts', c.id), c));
    INITIAL_TRANSACTIONS.forEach((t) => batch3.set(doc(db, 'payments', t.id), t));
    INITIAL_EXPENSES.forEach((e) => batch3.set(doc(db, 'expenses', e.id), e));
    await batch3.commit();

    // Batch 4: Maintenance, Documents, Reports, Notifications, Payouts
    const batch4 = writeBatch(db);
    INITIAL_MAINTENANCE_TICKETS.forEach((m) => batch4.set(doc(db, 'maintenanceRequests', m.id), m));
    INITIAL_DOCUMENTS.forEach((d) => batch4.set(doc(db, 'documents', d.id), d));
    INITIAL_REPORTS.forEach((r) => batch4.set(doc(db, 'reports', r.id), r));
    INITIAL_NOTIFICATIONS.forEach((n) => batch4.set(doc(db, 'notifications', n.id), n));
    INITIAL_OWNER_PAYOUTS.forEach((p) => batch4.set(doc(db, 'ownerPayouts', p.id), p));
    await batch4.commit();

    console.log('Peuplement relationnel Cloud Firestore terminé avec succès.');
    return { seeded: true, message: 'Base Cloud Firestore initialisée avec toutes les données relationnelles.' };
  } catch (error) {
    console.error('Erreur lors du peuplement Firestore:', error);
    return { seeded: false, message: `Échec d'initialisation: ${error instanceof Error ? error.message : String(error)}` };
  }
}
