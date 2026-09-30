export type PropertyType =
  | 'villa'
  | 'appartement'
  | 'duplex'
  | 'bureau'
  | 'commercial'
  | 'terrain';

export type PropertyStatus =
  | 'Disponible'
  | 'Occupé'
  | 'En maintenance'
  | 'En rénovation'
  | 'Vendu'
  | 'Archivé';

export type TenantPaymentStatus =
  | 'A_JOUR'
  | 'RETARD_LEGER'
  | 'RETARD_CRITIQUE'
  | 'AVANCE';

export type MaintenanceStatus =
  | 'Nouveau'
  | 'À valider'
  | 'Planifié'
  | 'En cours'
  | 'Terminé'
  | 'Annulé';

export type MaintenancePriority = 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';

export type TransactionType =
  | 'loyer'
  | 'depense_travaux'
  | 'commission_agence'
  | 'reversement_proprietaire'
  | 'caution'
  | 'charge_locative';

export type TransactionStatus = 'payé' | 'en_attente' | 'en_retard' | 'annulé';

export type DocumentType =
  | 'bail'
  | 'quittance'
  | 'titre_foncier'
  | 'facture'
  | 'devis'
  | 'etat_lieux'
  | 'autre';

export type StaffRole = 'admin' | 'gestionnaire' | 'comptable';

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
  defaultCommissionRate: number; // e.g. 10%
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

export interface Property {
  id: string;
  ref: string;
  name: string;
  type: PropertyType;
  address: string;
  neighborhood: string;
  city: string;
  country: string;
  description: string;
  photos: string[];
  surface: number; // in m²
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  amenities: string[];
  ownerId: string;
  ownerName: string;
  currentTenantId?: string;
  currentTenantName?: string;
  monthlyRent: number; // in FCFA
  chargesAmount: number; // in FCFA
  depositAmount: number; // Caution
  status: PropertyStatus;
  commissionRate: number; // percentage, e.g. 10%
  dateAdded: string;
}

export interface Owner {
  id: string;
  ref: string;
  fullName: string;
  company?: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  propertyIds: string[];
  totalRevenueGenerated: number;
  totalExpensesIncurred: number;
  currentBalanceToPayout: number; // Solde net à lui reverser
  bankDetails: {
    bankName: string;
    accountNumber: string;
    mobileMoney?: string;
  };
  notes?: string;
  dateAdded: string;
}

export interface Tenant {
  id: string;
  ref: string;
  fullName: string;
  company?: string;
  phone: string;
  email: string;
  nationalIdNumber: string;
  propertyId: string;
  propertyName: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: number;
  depositPaid: number;
  paymentDayOfMonth: number;
  paymentStatus: TenantPaymentStatus;
  lateDays: number;
  dateAdded: string;
}

export interface Transaction {
  id: string;
  ref: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  propertyId?: string;
  propertyName?: string;
  ownerId?: string;
  ownerName?: string;
  tenantId?: string;
  tenantName?: string;
  status: TransactionStatus;
  paymentMethod: string;
  description: string;
  receiptNumber?: string;
  createdByUser: string;
}

export interface MaintenanceTicket {
  id: string;
  ref: string;
  propertyId: string;
  propertyName: string;
  ownerId: string;
  ownerName: string;
  tenantName?: string;
  problemTitle: string;
  description: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  contractorName?: string;
  contractorPhone?: string;
  quoteAmount?: number;
  finalCost?: number;
  dateReported: string;
  dateScheduled?: string;
  dateResolved?: string;
  photoBefore?: string;
  photoAfter?: string;
  notes?: string;
}

export interface DocumentItem {
  id: string;
  ref: string;
  title: string;
  type: DocumentType;
  category: string;
  propertyId?: string;
  propertyName?: string;
  ownerId?: string;
  ownerName?: string;
  tenantId?: string;
  tenantName?: string;
  dateAdded: string;
  fileSize: string;
  fileType: string;
}
