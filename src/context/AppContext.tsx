import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AgencyConfig,
  Property,
  Owner,
  Tenant,
  Transaction,
  MaintenanceTicket,
  DocumentItem,
  StaffUser,
  ContractRecord,
  ExpenseRecord,
  OwnerPayoutRecord,
  ReportRecord,
  NotificationRecord,
  VendorRecord,
  AuditLogRecord,
} from '../types';
import {
  DEFAULT_AGENCY_CONFIG,
  STAFF_USERS,
  formatCurrency,
} from '../config/agency';
import {
  INITIAL_PROPERTIES,
  INITIAL_OWNERS,
  INITIAL_TENANTS,
  INITIAL_TRANSACTIONS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_DOCUMENTS,
} from '../data/seedData';
import {
  subscribeProperties,
  saveProperty,
  deleteProperty as removePropertyService,
} from '../services/propertyService';
import {
  subscribeOwners,
  saveOwner,
  deleteOwner as removeOwnerService,
} from '../services/ownerService';
import {
  subscribeTenants,
  saveTenant,
  deleteTenant as removeTenantService,
} from '../services/tenantService';
import {
  subscribeContracts,
  saveContract as saveContractService,
  deleteContract as removeContractService,
} from '../services/contractService';
import {
  subscribePayments,
  savePayment,
  deletePayment as removePaymentService,
} from '../services/paymentService';
import {
  subscribeExpenses,
  saveExpense as saveExpenseService,
  deleteExpense as removeExpenseService,
} from '../services/expenseService';
import {
  subscribeOwnerPayouts,
  saveOwnerPayout as saveOwnerPayoutService,
} from '../services/payoutService';
import {
  subscribeMaintenance,
  saveMaintenanceRequest,
  updateMaintenanceStatus as updateMaintenanceStatusService,
  deleteMaintenanceRequest as removeMaintenanceService,
} from '../services/maintenanceService';
import {
  subscribeDocuments,
  saveDocument as saveDocumentService,
  deleteDocument as removeDocumentService,
} from '../services/documentService';
import {
  subscribeReports,
  saveReport as saveReportService,
} from '../services/reportService';
import {
  subscribeNotifications,
  markNotificationAsRead,
} from '../services/notificationService';
import { getRecentAuditLogs, logAuditEvent } from '../services/auditService';
import { getVendors } from '../services/vendorService';
import {
  loginWithGoogle,
  logoutUser,
  subscribeAuthState,
  syncUserRecord,
} from '../services/authService';
import { User } from 'firebase/auth';
import {
  seedFirestoreIfEmpty,
  INITIAL_CONTRACTS,
  INITIAL_EXPENSES,
  INITIAL_OWNER_PAYOUTS,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_VENDORS,
} from '../services/seedService';

export type NavigationTab =
  | 'dashboard'
  | 'properties'
  | 'owners'
  | 'tenants'
  | 'finances'
  | 'maintenance'
  | 'documents'
  | 'reports'
  | 'ai'
  | 'settings';

interface AppContextType {
  agencyConfig: AgencyConfig;
  updateAgencyConfig: (newConfig: Partial<AgencyConfig>) => void;
  resetAgencyConfig: () => void;
  currentUser: StaffUser;
  setCurrentUser: (user: StaffUser) => void;
  staffUsers: StaffUser[];

  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  selectedOwnerId: string | null;
  setSelectedOwnerId: (id: string | null) => void;
  selectedTenantId: string | null;
  setSelectedTenantId: (id: string | null) => void;

  // Portal View (Agency ERP vs Espace Propriétaire)
  currentPortalView: 'agency' | 'owner_portal';
  setCurrentPortalView: (view: 'agency' | 'owner_portal') => void;
  portalOwnerId: string;
  setPortalOwnerId: (id: string) => void;

  // Mobile menu open state
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Search & Filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Data Collections (Firestore + Local fallback)
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'ref' | 'dateAdded'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  owners: Owner[];
  addOwner: (
    owner: Omit<
      Owner,
      | 'id'
      | 'ref'
      | 'dateAdded'
      | 'totalRevenueGenerated'
      | 'totalExpensesIncurred'
      | 'currentBalanceToPayout'
    >
  ) => void;
  updateOwner: (id: string, updates: Partial<Owner>) => void;
  deleteOwner: (id: string) => void;
  recordOwnerPayout: (
    ownerId: string,
    amount: number,
    paymentMethod: string,
    notes?: string
  ) => void;

  tenants: Tenant[];
  addTenant: (tenant: Omit<Tenant, 'id' | 'ref' | 'dateAdded' | 'lateDays'>) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  recordRentPayment: (tenantId: string, amount: number, paymentMethod: string) => void;

  transactions: Transaction[];
  addTransaction: (trx: Omit<Transaction, 'id' | 'ref' | 'createdByUser'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  maintenanceTickets: MaintenanceTicket[];
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'ref' | 'dateReported'>) => void;
  updateMaintenanceTicket: (id: string, updates: Partial<MaintenanceTicket>) => void;
  deleteMaintenanceTicket: (id: string) => void;

  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'ref' | 'dateAdded'>) => void;
  deleteDocument: (id: string) => void;

  // Relational Collections & Advanced State
  contracts: ContractRecord[];
  addContract: (contract: ContractRecord) => Promise<void>;
  expenses: ExpenseRecord[];
  addExpense: (expense: ExpenseRecord) => Promise<void>;
  ownerPayouts: OwnerPayoutRecord[];
  reports: ReportRecord[];
  addReport: (report: ReportRecord) => Promise<void>;
  notifications: NotificationRecord[];
  vendors: VendorRecord[];
  auditLogs: AuditLogRecord[];
  markNotificationRead: (id: string) => Promise<void>;

  // Status & Synchronization
  isFirestoreConnected: boolean;
  isLoadingData: boolean;
  reseedFirestore: (force?: boolean) => Promise<{ seeded: boolean; message: string }>;

  // Authentication
  authUser: User | null;
  isAuthReady: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // Helpers
  formatPrice: (amount: number) => string;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load agency config
  const [agencyConfig, setAgencyConfig] = useState<AgencyConfig>(() => {
    try {
      const saved = localStorage.getItem('immopilot_agency_config');
      return saved ? JSON.parse(saved) : DEFAULT_AGENCY_CONFIG;
    } catch {
      return DEFAULT_AGENCY_CONFIG;
    }
  });

  // Current Staff User
  const [currentUser, setCurrentUser] = useState<StaffUser>(STAFF_USERS[0]);

  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Portal & Mobile state
  const [currentPortalView, setCurrentPortalView] = useState<'agency' | 'owner_portal'>('agency');
  const [portalOwnerId, setPortalOwnerId] = useState<string>('owner-1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Authentication State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Firestore & local state
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [owners, setOwners] = useState<Owner[]>(INITIAL_OWNERS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [contracts, setContracts] = useState<ContractRecord[]>(INITIAL_CONTRACTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [ownerPayouts, setOwnerPayouts] = useState<OwnerPayoutRecord[]>(INITIAL_OWNER_PAYOUTS);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [vendors, setVendors] = useState<VendorRecord[]>(INITIAL_VENDORS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [reports, setReports] = useState<ReportRecord[]>(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  // 1. Firebase Authentication Lifecycle & Session Tracking
  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (user) => {
      setAuthUser(user);
      setIsAuthReady(true);

      if (user) {
        try {
          await syncUserRecord(user);
          if (user.email === 'olamonde7@gmail.com') {
            setCurrentUser((prev) => ({
              ...prev,
              fullName: user.displayName || 'Admin Olé',
              email: user.email || 'olamonde7@gmail.com',
              avatar: user.photoURL || prev.avatar,
              role: 'admin',
              title: 'Directeur Général & Fondateur',
            }));
          }
          const seedResult = await seedFirestoreIfEmpty(false);
          setIsFirestoreConnected(true);
          if (seedResult.seeded) {
            console.log('Base Firestore initialisée:', seedResult.message);
          }
        } catch (err) {
          console.warn('Initialisation Firestore:', err);
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setIsFirestoreConnected(false);
        setIsLoadingData(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Subscriptions to Firestore
  // In strict compliance with skill rules: ONLY attach listeners if auth is ready and user is authenticated
  useEffect(() => {
    if (!isAuthReady || !authUser) {
      return;
    }

    const ownerFilter = currentPortalView === 'owner_portal' ? portalOwnerId : undefined;
    const unsubs: Array<() => void> = [];

    // Properties subscription
    try {
      const unsubProps = subscribeProperties(
        (list) => {
          if (list && list.length > 0) {
            setProperties(list);
            setIsFirestoreConnected(true);
          }
        },
        ownerFilter,
        (err) => console.warn('Props Firestore notice:', err.message)
      );
      unsubs.push(unsubProps);
    } catch (e) {
      console.warn('Subscription properties fallback:', e);
    }

    // Owners subscription
    try {
      const unsubOwners = subscribeOwners(
        (list) => {
          if (list && list.length > 0) setOwners(list);
        },
        ownerFilter
      );
      unsubs.push(unsubOwners);
    } catch (e) {
      console.warn('Subscription owners fallback:', e);
    }

    // Tenants subscription
    try {
      const unsubTenants = subscribeTenants((list) => {
        if (list && list.length > 0) {
          if (ownerFilter) {
            setTenants((prev) => {
              const currentProps = properties.map((p) => p.id);
              return list.filter((t) => t.propertyId && currentProps.includes(t.propertyId));
            });
          } else {
            setTenants(list);
          }
        }
      });
      unsubs.push(unsubTenants);
    } catch (e) {
      console.warn('Subscription tenants fallback:', e);
    }

    // Contracts subscription
    try {
      const unsubContracts = subscribeContracts(
        (list) => {
          if (list && list.length > 0) setContracts(list);
        },
        ownerFilter
      );
      unsubs.push(unsubContracts);
    } catch (e) {
      console.warn('Subscription contracts fallback:', e);
    }

    // Payments subscription
    try {
      const unsubPayments = subscribePayments(
        (list) => {
          if (list && list.length > 0) setTransactions(list);
        },
        ownerFilter
      );
      unsubs.push(unsubPayments);
    } catch (e) {
      console.warn('Subscription payments fallback:', e);
    }

    // Expenses subscription
    try {
      const unsubExpenses = subscribeExpenses(
        (list) => {
          if (list && list.length > 0) setExpenses(list);
        },
        ownerFilter
      );
      unsubs.push(unsubExpenses);
    } catch (e) {
      console.warn('Subscription expenses fallback:', e);
    }

    // Owner payouts subscription
    try {
      const unsubPayouts = subscribeOwnerPayouts(
        (list) => {
          if (list && list.length > 0) setOwnerPayouts(list);
        },
        ownerFilter
      );
      unsubs.push(unsubPayouts);
    } catch (e) {
      console.warn('Subscription payouts fallback:', e);
    }

    // Maintenance subscription
    try {
      const unsubMaintenance = subscribeMaintenance(
        (list) => {
          if (list && list.length > 0) setMaintenanceTickets(list);
        },
        ownerFilter
      );
      unsubs.push(unsubMaintenance);
    } catch (e) {
      console.warn('Subscription maintenance fallback:', e);
    }

    // Documents subscription
    try {
      const unsubDocs = subscribeDocuments(
        (list) => {
          if (list && list.length > 0) setDocuments(list);
        },
        ownerFilter
      );
      unsubs.push(unsubDocs);
    } catch (e) {
      console.warn('Subscription documents fallback:', e);
    }

    // Reports subscription
    try {
      const unsubReports = subscribeReports(
        (list) => {
          if (list && list.length > 0) setReports(list);
        },
        ownerFilter
      );
      unsubs.push(unsubReports);
    } catch (e) {
      console.warn('Subscription reports fallback:', e);
    }

    // Fetch vendors & audit logs
    getVendors()
      .then((v) => v && v.length > 0 && setVendors(v))
      .catch((e) => console.warn('Vendors fetch notice:', e));

    getRecentAuditLogs()
      .then((logs) => logs && setAuditLogs(logs))
      .catch((e) => console.warn('Audit fetch notice:', e));

    return () => {
      unsubs.forEach((u) => u && typeof u === 'function' && u());
    };
  }, [isAuthReady, authUser, currentPortalView, portalOwnerId]);

  // Notifications subscription
  useEffect(() => {
    if (!isAuthReady || !authUser) {
      return;
    }
    const targetUserId = currentPortalView === 'owner_portal' ? portalOwnerId : (authUser.uid || currentUser.id);
    try {
      const unsubNotifs = subscribeNotifications(targetUserId, (list) => {
        if (list && list.length > 0) setNotifications(list);
      });
      return () => unsubNotifs && unsubNotifs();
    } catch (e) {
      console.warn('Notifications subscription fallback:', e);
    }
  }, [isAuthReady, authUser, currentPortalView, portalOwnerId, currentUser.id]);

  // Auth actions
  const handleLoginWithGoogle = async () => {
    try {
      setIsLoadingData(true);
      const user = await loginWithGoogle();
      setAuthUser(user);
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAuthUser(null);
      setIsFirestoreConnected(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Agency Config actions
  const updateAgencyConfig = (newConfig: Partial<AgencyConfig>) => {
    setAgencyConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('immopilot_agency_config', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const resetAgencyConfig = () => {
    setAgencyConfig(DEFAULT_AGENCY_CONFIG);
    try {
      localStorage.setItem('immopilot_agency_config', JSON.stringify(DEFAULT_AGENCY_CONFIG));
    } catch (e) {
      console.warn(e);
    }
  };

  const formatPrice = useCallback(
    (amount: number) => {
      return formatCurrency(amount, agencyConfig.currencySymbol || agencyConfig.currency);
    },
    [agencyConfig.currencySymbol, agencyConfig.currency]
  );

  // Property actions
  const addProperty = async (newProp: Omit<Property, 'id' | 'ref' | 'dateAdded'>) => {
    const id = `prop-${Date.now()}`;
    const ref = `TL-${newProp.type.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const created: Property = {
      ...newProp,
      id,
      ref,
      reference: ref,
      dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currency: 'XOF',
      securityDeposit: newProp.depositAmount || (newProp.monthlyRent ? newProp.monthlyRent * 3 : 0),
    };

    // Optimistic UI update
    setProperties((prev) => [created, ...prev]);

    // Firestore async persist
    saveProperty(created, { uid: currentUser.id, displayName: currentUser.fullName }).catch((err) =>
      console.warn('Firestore save property notice:', err)
    );
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) => {
      const updatedList = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const target = updatedList.find((p) => p.id === id);
      if (target) {
        saveProperty(target, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
          console.warn(e)
        );
      }
      return updatedList;
    });
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    removePropertyService(id, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  // Owner actions
  const addOwner = (
    newOwner: Omit<
      Owner,
      | 'id'
      | 'ref'
      | 'dateAdded'
      | 'totalRevenueGenerated'
      | 'totalExpensesIncurred'
      | 'currentBalanceToPayout'
    >
  ) => {
    const id = `owner-${Date.now()}`;
    const ref = `OW-LOM-${Math.floor(100 + Math.random() * 900)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const created: Owner = {
      ...newOwner,
      id,
      ref,
      dateAdded,
      totalRevenueGenerated: 0,
      totalExpensesIncurred: 0,
      currentBalanceToPayout: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOwners((prev) => [created, ...prev]);
    saveOwner(created, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  const updateOwner = (id: string, updates: Partial<Owner>) => {
    setOwners((prev) => {
      const updatedList = prev.map((o) => (o.id === id ? { ...o, ...updates } : o));
      const target = updatedList.find((o) => o.id === id);
      if (target) {
        saveOwner(target, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
          console.warn(e)
        );
      }
      return updatedList;
    });
  };

  const deleteOwner = (id: string) => {
    setOwners((prev) => prev.filter((o) => o.id !== id));
    removeOwnerService(id, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  const recordOwnerPayout = (
    ownerId: string,
    amount: number,
    paymentMethod: string,
    notes?: string
  ) => {
    const targetOwner = owners.find((o) => o.id === ownerId);
    const ownerName = targetOwner ? targetOwner.fullName : 'Propriétaire';

    const payoutRecord: OwnerPayoutRecord = {
      id: `payout-${Date.now()}`,
      reference: `REV-2026-${Math.floor(100 + Math.random() * 900)}`,
      ownerId,
      ownerName,
      periodStart: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      periodEnd: new Date().toISOString().split('T')[0],
      totalIncome: amount,
      totalExpenses: 0,
      managementFees: 0,
      otherDeductions: 0,
      netAmount: amount,
      currency: 'XOF',
      status: 'paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id,
    };

    setOwnerPayouts((prev) => [payoutRecord, ...prev]);
    saveOwnerPayoutService(payoutRecord, { uid: currentUser.id, displayName: currentUser.fullName }).catch(
      (e) => console.warn(e)
    );

    // Also record in transactions
    const trx: Transaction = {
      id: `trx-${Date.now()}`,
      ref: payoutRecord.reference,
      type: 'reversement_proprietaire',
      category: 'Reversement Bailleur',
      amount,
      date: new Date().toISOString().split('T')[0],
      ownerId,
      ownerName,
      status: 'payé',
      paymentMethod,
      description: `Reversement bancaire net : ${amount.toLocaleString('fr-FR')} FCFA. ${notes || ''}`,
      createdByUser: currentUser.fullName,
      currency: 'XOF',
      reference: payoutRecord.reference,
      paymentDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      propertyId: targetOwner?.propertyIds?.[0] || 'prop-1',
      tenantId: 'system',
    };

    setTransactions((prev) => [trx, ...prev]);
    savePayment(trx, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  // Tenant actions
  const addTenant = (tenant: Omit<Tenant, 'id' | 'ref' | 'dateAdded' | 'lateDays'>) => {
    const id = `tenant-${Date.now()}`;
    const ref = `LOC-2026-${Math.floor(10 + Math.random() * 90)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const created: Tenant = {
      ...tenant,
      id,
      ref,
      dateAdded,
      lateDays: 0,
      status: tenant.paymentStatus || 'A_JOUR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTenants((prev) => [created, ...prev]);
    saveTenant(created, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );

    // Update property occupancy if assigned
    if (tenant.propertyId) {
      updateProperty(tenant.propertyId, {
        currentTenantId: id,
        currentTenantName: tenant.fullName,
        status: 'Occupé',
      });
    }
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) => {
      const updatedList = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const target = updatedList.find((t) => t.id === id);
      if (target) {
        saveTenant(target, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
          console.warn(e)
        );
      }
      return updatedList;
    });
  };

  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
    removeTenantService(id, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  const recordRentPayment = (tenantId: string, amount: number, paymentMethod: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    const property = properties.find((p) => p.id === tenant.propertyId);
    const ref = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      ref,
      reference: ref,
      type: 'loyer',
      category: 'Encaissement Loyer',
      amount,
      currency: 'XOF',
      paymentDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      propertyId: tenant.propertyId,
      propertyName: tenant.propertyName,
      ownerId: property?.ownerId || 'owner-1',
      ownerName: property?.ownerName || 'Propriétaire',
      tenantId: tenant.id,
      tenantName: tenant.fullName,
      status: 'payé',
      paymentMethod,
      description: `Paiement loyer mensuel - ${new Date().toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })}`,
      receiptNumber: `QUIT-TL-${Date.now().toString().slice(-4)}`,
      createdByUser: currentUser.fullName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTrx, ...prev]);
    savePayment(newTrx, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );

    // Update tenant payment status to A_JOUR
    updateTenant(tenantId, {
      paymentStatus: 'A_JOUR',
      lateDays: 0,
    });
  };

  // Transaction actions
  const addTransaction = (trx: Omit<Transaction, 'id' | 'ref' | 'createdByUser'>) => {
    const id = `trx-${Date.now()}`;
    const ref = `TRX-${Date.now().toString().slice(-6)}`;
    const created: Transaction = {
      ...trx,
      id,
      ref,
      reference: ref,
      createdByUser: currentUser.fullName,
      currency: trx.currency || 'XOF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [created, ...prev]);
    savePayment(created, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => {
      const updatedList = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const target = updatedList.find((t) => t.id === id);
      if (target) {
        savePayment(target, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
          console.warn(e)
        );
      }
      return updatedList;
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    removePaymentService(id, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  // Maintenance actions
  const addMaintenanceTicket = (
    ticket: Omit<MaintenanceTicket, 'id' | 'ref' | 'dateReported'>
  ) => {
    const id = `mnt-${Date.now()}`;
    const ref = `WRK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const created: MaintenanceTicket = {
      ...ticket,
      id,
      ref,
      reference: ref,
      title: ticket.problemTitle || ticket.title || 'Intervention',
      problemTitle: ticket.problemTitle || 'Intervention',
      dateReported: now.split('T')[0],
      reportedAt: now,
      currency: 'XOF',
      createdAt: now,
      updatedAt: now,
    };

    setMaintenanceTickets((prev) => [created, ...prev]);
    saveMaintenanceRequest(created, { uid: currentUser.id, displayName: currentUser.fullName }).catch(
      (e) => console.warn(e)
    );
  };

  const updateMaintenanceTicket = (id: string, updates: Partial<MaintenanceTicket>) => {
    setMaintenanceTickets((prev) => {
      const updatedList = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      const target = updatedList.find((m) => m.id === id);
      if (target) {
        if (updates.status) {
          updateMaintenanceStatusService(id, updates.status, {
            uid: currentUser.id,
            displayName: currentUser.fullName,
          }).catch((e) => console.warn(e));
        } else {
          saveMaintenanceRequest(target, {
            uid: currentUser.id,
            displayName: currentUser.fullName,
          }).catch((e) => console.warn(e));
        }
      }
      return updatedList;
    });
  };

  const deleteMaintenanceTicket = (id: string) => {
    setMaintenanceTickets((prev) => prev.filter((m) => m.id !== id));
    removeMaintenanceService(id, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  // Document actions
  const addDocument = (docItem: Omit<DocumentItem, 'id' | 'ref' | 'dateAdded'>) => {
    const id = `doc-${Date.now()}`;
    const ref = `DOC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const created: DocumentItem = {
      ...docItem,
      id,
      ref,
      name: docItem.title || 'Document',
      title: docItem.title || 'Document',
      category: docItem.category || 'other',
      dateAdded: now.split('T')[0],
      createdAt: now,
      updatedAt: now,
      storagePath: `/documents/${id}`,
    };

    setDocuments((prev) => [created, ...prev]);
    saveDocumentService(created, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    removeDocumentService(id, { uid: currentUser.id, displayName: currentUser.fullName }).catch((e) =>
      console.warn(e)
    );
  };

  // Contract actions
  const addContract = async (contract: ContractRecord) => {
    setContracts((prev) => [contract, ...prev]);
    await saveContractService(contract, { uid: currentUser.id, displayName: currentUser.fullName });
  };

  // Expense actions
  const addExpense = async (expense: ExpenseRecord) => {
    setExpenses((prev) => [expense, ...prev]);
    await saveExpenseService(expense, { uid: currentUser.id, displayName: currentUser.fullName });
  };

  // Report actions
  const addReport = async (report: ReportRecord) => {
    setReports((prev) => [report, ...prev]);
    await saveReportService(report, { uid: currentUser.id, displayName: currentUser.fullName });
  };

  // Notification action
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markNotificationAsRead(id);
  };

  // Reseed Firestore on demand
  const reseedFirestore = async (force = true) => {
    const result = await seedFirestoreIfEmpty(force);
    if (result.seeded) {
      setProperties(INITIAL_PROPERTIES);
      setOwners(INITIAL_OWNERS);
      setTenants(INITIAL_TENANTS);
      setContracts(INITIAL_CONTRACTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setExpenses(INITIAL_EXPENSES);
      setOwnerPayouts(INITIAL_OWNER_PAYOUTS);
      setMaintenanceTickets(INITIAL_MAINTENANCE_TICKETS);
      setVendors(INITIAL_VENDORS);
      setDocuments(INITIAL_DOCUMENTS);
      setReports(INITIAL_REPORTS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setIsFirestoreConnected(true);
      await logAuditEvent(
        currentUser.id,
        currentUser.fullName,
        'reseed_firestore',
        'database',
        'cloud_firestore',
        'Réinitialisation complète de la base de données relationnelle Cloud Firestore.'
      );
    }
    return result;
  };

  const resetAllDemoData = () => {
    reseedFirestore(true);
  };

  return (
    <AppContext.Provider
      value={{
        agencyConfig,
        updateAgencyConfig,
        resetAgencyConfig,
        currentUser,
        setCurrentUser,
        staffUsers: STAFF_USERS,
        activeTab,
        setActiveTab,
        selectedPropertyId,
        setSelectedPropertyId,
        selectedOwnerId,
        setSelectedOwnerId,
        selectedTenantId,
        setSelectedTenantId,
        currentPortalView,
        setCurrentPortalView,
        portalOwnerId,
        setPortalOwnerId,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        globalSearch,
        setGlobalSearch,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        owners,
        addOwner,
        updateOwner,
        deleteOwner,
        recordOwnerPayout,
        tenants,
        addTenant,
        updateTenant,
        deleteTenant,
        recordRentPayment,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        maintenanceTickets,
        addMaintenanceTicket,
        updateMaintenanceTicket,
        deleteMaintenanceTicket,
        documents,
        addDocument,
        deleteDocument,
        contracts,
        addContract,
        expenses,
        addExpense,
        ownerPayouts,
        reports,
        addReport,
        notifications,
        vendors,
        auditLogs,
        markNotificationRead,
        isFirestoreConnected,
        isLoadingData,
        reseedFirestore,
        authUser,
        isAuthReady,
        loginWithGoogle: handleLoginWithGoogle,
        logout: handleLogout,
        formatPrice,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé à l’intérieur de AppProvider');
  }
  return context;
}
