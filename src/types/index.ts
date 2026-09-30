export type UserRole = 'admin' | 'manager' | 'accountant' | 'agent' | 'owner';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  ownerId?: string; // Lié à l'identifiant du propriétaire lorsque role === 'owner'
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type PropertyType =
  | 'villa'
  | 'appartement'
  | 'duplex'
  | 'bureau'
  | 'commercial'
  | 'terrain'
  | 'apartment'
  | 'house'
  | 'office'
  | 'land'
  | 'other';

export type PropertyStatus =
  | 'Disponible'
  | 'Occupé'
  | 'En maintenance'
  | 'En rénovation'
  | 'Vendu'
  | 'Archivé'
  | 'available'
  | 'occupied'
  | 'maintenance'
  | 'renovation'
  | 'sold'
  | 'archived';

export type TenantPaymentStatus =
  | 'A_JOUR'
  | 'RETARD_LEGER'
  | 'RETARD_CRITIQUE'
  | 'AVANCE'
  | 'active'
  | 'late'
  | 'notice'
  | 'former';

export type MaintenanceStatus =
  | 'Nouveau'
  | 'À valider'
  | 'Planifié'
  | 'En cours'
  | 'Terminé'
  | 'Annulé'
  | 'reported'
  | 'review'
  | 'awaiting_approval'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type MaintenancePriority =
  | 'Basse'
  | 'Moyenne'
  | 'Haute'
  | 'Urgente'
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type TransactionType =
  | 'loyer'
  | 'depense_travaux'
  | 'commission_agence'
  | 'reversement_proprietaire'
  | 'caution'
  | 'charge_locative'
  | 'rent'
  | 'deposit'
  | 'other';

export type TransactionStatus =
  | 'payé'
  | 'en_attente'
  | 'en_retard'
  | 'annulé'
  | 'pending'
  | 'paid'
  | 'partial'
  | 'late'
  | 'cancelled';

export type DocumentType =
  | 'bail'
  | 'quittance'
  | 'titre_foncier'
  | 'facture'
  | 'devis'
  | 'etat_lieux'
  | 'autre'
  | 'contract'
  | 'identity'
  | 'property'
  | 'invoice'
  | 'receipt'
  | 'quote'
  | 'report'
  | 'other';

export type StaffRole = 'admin' | 'manager' | 'accountant' | 'agent' | 'gestionnaire' | 'comptable';

export interface AgencyConfig {
  companyName: string;
  legalName: string;
  brandShort: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  currencySymbol: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  country: string;
  rcm: string;
  nif: string;
  defaultCommissionRate: number;
  bankDetails: {
    bankName: string;
    iban: string;
    bic: string;
    mobileMoneyNumber: string;
  };
}

export interface StaffUser {
  id: string;
  fullName: string;
  title: string;
  email: string;
  role: StaffRole;
  phone: string;
  avatar: string;
}

export interface PropertyRecord {
  id: string;
  name: string;
  reference?: string;
  type: PropertyType;
  status: PropertyStatus;
  description: string;
  address: string;
  city: string;
  neighborhood: string;
  country: string;
  latitude?: number;
  longitude?: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  livingRooms?: number;
  amenities: string[];
  photos: string[];
  ownerId: string;
  currentTenantId?: string;
  currentContractId?: string;
  monthlyRent: number;
  securityDeposit?: number;
  currency?: string;
  availableFrom?: string;
  createdAt?: string;
  updatedAt?: string;

  // Compatibilité UI existante
  ref?: string;
  ownerName?: string;
  currentTenantName?: string;
  chargesAmount?: number;
  depositAmount?: number;
  commissionRate?: number;
  dateAdded?: string;
}

export interface OwnerRecord {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  country: string;
  city: string;
  address: string;
  photoURL?: string;
  notes?: string;
  status?: 'active' | 'inactive';
  userId?: string;
  createdAt?: string;
  updatedAt?: string;

  // Compatibilité UI existante
  ref?: string;
  company?: string;
  propertyIds?: string[];
  totalRevenueGenerated?: number;
  totalExpensesIncurred?: number;
  currentBalanceToPayout?: number;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    mobileMoney?: string;
  };
  dateAdded?: string;
}

export interface TenantRecord {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  nationality?: string;
  dateOfBirth?: string;
  address?: string;
  idDocumentType?: string;
  idDocumentNumber?: string;
  idDocumentFile?: string;
  photoURL?: string;
  status?: TenantPaymentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

  // Compatibilité UI existante
  ref?: string;
  company?: string;
  nationalIdNumber?: string;
  propertyId?: string;
  propertyName?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  monthlyRent?: number;
  depositPaid?: number;
  paymentDayOfMonth?: number;
  paymentStatus?: TenantPaymentStatus;
  lateDays?: number;
  dateAdded?: string;
}

export interface ContractRecord {
  id: string;
  reference: string;
  propertyId: string;
  ownerId: string;
  tenantId: string;
  type: 'residential' | 'commercial' | 'professional' | 'temporary';
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  currency: string;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'cancelled';
  signedAt?: string;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;

  // Champs de commodité résolus
  propertyName?: string;
  ownerName?: string;
  tenantName?: string;
}

export interface PaymentRecord {
  id: string;
  reference?: string;
  propertyId?: string;
  ownerId?: string;
  tenantId?: string;
  contractId?: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  paymentDate?: string;
  periodStart?: string;
  periodEnd?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'other' | string;
  status: TransactionStatus;
  description: string;
  receiptDocumentId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;

  // Compatibilité UI
  ref?: string;
  category?: string;
  date?: string;
  propertyName?: string;
  ownerName?: string;
  tenantName?: string;
  receiptNumber?: string;
  createdByUser?: string;
}

export interface ExpenseRecord {
  id: string;
  reference?: string;
  propertyId: string;
  ownerId: string;
  category:
    | 'maintenance'
    | 'repair'
    | 'utilities'
    | 'tax'
    | 'management_fee'
    | 'renovation'
    | 'purchase'
    | 'other';
  description: string;
  amount: number;
  currency?: string;
  expenseDate: string;
  vendorId?: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  invoiceDocumentId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;

  // Résolus pour affichage
  propertyName?: string;
  ownerName?: string;
  vendorName?: string;
}

export interface OwnerPayoutRecord {
  id: string;
  reference?: string;
  ownerId: string;
  periodStart: string;
  periodEnd: string;
  totalIncome: number;
  totalExpenses: number;
  managementFees: number;
  otherDeductions: number;
  netAmount: number;
  currency?: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  ownerName?: string;
}

export interface MaintenanceRequestRecord {
  id: string;
  reference?: string;
  propertyId: string;
  ownerId: string;
  reportedBy?: string;
  assignedTo?: string;
  title?: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  estimatedCost?: number;
  actualCost?: number;
  currency?: string;
  vendorId?: string;
  reportedAt?: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  quoteDocumentId?: string;
  invoiceDocumentId?: string;
  ownerApprovalRequired?: boolean;
  ownerApproved?: boolean;
  ownerApprovedAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;

  // Compatibilité UI
  ref?: string;
  propertyName?: string;
  ownerName?: string;
  tenantName?: string;
  contractorName?: string;
  contractorPhone?: string;
  problemTitle?: string;
  category?: string;
  quoteAmount?: number;
  finalCost?: number;
  dateReported?: string;
  dateScheduled?: string;
  dateResolved?: string;
  photoBefore?: string;
  photoAfter?: string;
}

export interface VendorRecord {
  id: string;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  address?: string;
  specialty: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentRecord {
  id: string;
  name?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string | number;
  storagePath?: string;
  category: DocumentType | string;
  propertyId?: string;
  ownerId?: string;
  tenantId?: string;
  contractId?: string;
  paymentId?: string;
  expenseId?: string;
  maintenanceRequestId?: string;
  reportId?: string;
  uploadedBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // Compatibilité UI
  ref?: string;
  title?: string;
  type?: DocumentType | string;
  propertyName?: string;
  ownerName?: string;
  tenantName?: string;
  dateAdded?: string;
}

export interface ReportRecord {
  id: string;
  reference: string;
  type: 'owner_monthly' | 'property' | 'financial' | 'maintenance' | 'custom';
  ownerId?: string;
  propertyId?: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  summary: string;
  totalIncome: number;
  totalExpenses: number;
  managementFees: number;
  netAmount: number;
  maintenanceSummary?: string;
  generatedBy?: string;
  generatedAt: string;
  status: 'draft' | 'published' | 'archived';
  documentId?: string;
  ownerName?: string;
  propertyName?: string;
}

export interface NotificationRecord {
  id: string;
  recipientUserId: string;
  type:
    | 'payment_late'
    | 'payment_received'
    | 'maintenance'
    | 'contract_expiring'
    | 'report_available'
    | 'document'
    | 'system';
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Aliases de type transparents pour compatibilité avec l'interface existante
export type Property = PropertyRecord;
export type Owner = OwnerRecord;
export type Tenant = TenantRecord;
export type Transaction = PaymentRecord;
export type MaintenanceTicket = MaintenanceRequestRecord;
export type DocumentItem = DocumentRecord;
export type Contract = ContractRecord;
export type Expense = ExpenseRecord;
export type OwnerPayout = OwnerPayoutRecord;
export type Vendor = VendorRecord;
export type Report = ReportRecord;
export type Notification = NotificationRecord;
export type AuditLog = AuditLogRecord;
