import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AgencyConfig,
  Property,
  Owner,
  Tenant,
  Transaction,
  MaintenanceTicket,
  DocumentItem,
  StaffUser,
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

  // Data Collections
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'ref' | 'dateAdded'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  owners: Owner[];
  addOwner: (owner: Omit<Owner, 'id' | 'ref' | 'dateAdded' | 'totalRevenueGenerated' | 'totalExpensesIncurred' | 'currentBalanceToPayout'>) => void;
  updateOwner: (id: string, updates: Partial<Owner>) => void;
  deleteOwner: (id: string) => void;
  recordOwnerPayout: (ownerId: string, amount: number, paymentMethod: string, notes?: string) => void;

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

  // Collections with localStorage persistence
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('immopilot_properties');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [owners, setOwners] = useState<Owner[]>(() => {
    try {
      const saved = localStorage.getItem('immopilot_owners');
      return saved ? JSON.parse(saved) : INITIAL_OWNERS;
    } catch {
      return INITIAL_OWNERS;
    }
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem('immopilot_tenants');
      return saved ? JSON.parse(saved) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('immopilot_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    try {
      const saved = localStorage.getItem('immopilot_maintenance');
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
    } catch {
      return INITIAL_MAINTENANCE_TICKETS;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('immopilot_documents');
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('immopilot_agency_config', JSON.stringify(agencyConfig));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [agencyConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('immopilot_properties', JSON.stringify(properties));
      localStorage.setItem('immopilot_owners', JSON.stringify(owners));
      localStorage.setItem('immopilot_tenants', JSON.stringify(tenants));
      localStorage.setItem('immopilot_transactions', JSON.stringify(transactions));
      localStorage.setItem('immopilot_maintenance', JSON.stringify(maintenanceTickets));
      localStorage.setItem('immopilot_documents', JSON.stringify(documents));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [properties, owners, tenants, transactions, maintenanceTickets, documents]);

  // Agency Config actions
  const updateAgencyConfig = (newConfig: Partial<AgencyConfig>) => {
    setAgencyConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetAgencyConfig = () => {
    setAgencyConfig(DEFAULT_AGENCY_CONFIG);
  };

  const formatPrice = (amount: number) => {
    return formatCurrency(amount, agencyConfig.currencySymbol || agencyConfig.currency);
  };

  // Property actions
  const addProperty = (newProp: Omit<Property, 'id' | 'ref' | 'dateAdded'>) => {
    const id = `prop-${Date.now()}`;
    const ref = `TL-${newProp.type.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const created: Property = { ...newProp, id, ref, dateAdded };
    setProperties((prev) => [created, ...prev]);

    // link to owner
    setOwners((prev) =>
      prev.map((o) => (o.id === newProp.ownerId ? { ...o, propertyIds: [...o.propertyIds, id] } : o))
    );
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // Owner actions
  const addOwner = (
    newOwner: Omit<Owner, 'id' | 'ref' | 'dateAdded' | 'totalRevenueGenerated' | 'totalExpensesIncurred' | 'currentBalanceToPayout'>
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
    };
    setOwners((prev) => [created, ...prev]);
  };

  const updateOwner = (id: string, updates: Partial<Owner>) => {
    setOwners((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOwner = (id: string) => {
    setOwners((prev) => prev.filter((o) => o.id !== id));
  };

  const recordOwnerPayout = (ownerId: string, amount: number, paymentMethod: string, notes?: string) => {
    const owner = owners.find((o) => o.id === ownerId);
    if (!owner) return;

    const trxId = `trx-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newTrx: Transaction = {
      id: trxId,
      ref: `REV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'reversement_proprietaire',
      category: 'Virement Propriétaire',
      amount,
      date,
      ownerId: owner.id,
      ownerName: owner.fullName,
      status: 'payé',
      paymentMethod,
      description: `Reversement de loyer à ${owner.fullName} ${notes ? `(${notes})` : ''}`,
      receiptNumber: `ORD-REV-${Date.now().toString().slice(-6)}`,
      createdByUser: currentUser.fullName,
    };

    setTransactions((prev) => [newTrx, ...prev]);
    setOwners((prev) =>
      prev.map((o) =>
        o.id === ownerId
          ? { ...o, currentBalanceToPayout: Math.max(0, o.currentBalanceToPayout - amount) }
          : o
      )
    );
  };

  // Tenant actions
  const addTenant = (newTenant: Omit<Tenant, 'id' | 'ref' | 'dateAdded' | 'lateDays'>) => {
    const id = `tenant-${Date.now()}`;
    const ref = `LOC-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const created: Tenant = {
      ...newTenant,
      id,
      ref,
      dateAdded,
      lateDays: 0,
    };
    setTenants((prev) => [created, ...prev]);

    // Update property with tenant
    setProperties((prev) =>
      prev.map((p) =>
        p.id === newTenant.propertyId
          ? {
              ...p,
              status: 'Occupé',
              currentTenantId: id,
              currentTenantName: newTenant.fullName,
            }
          : p
      )
    );
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTenant = (id: string) => {
    const tenant = tenants.find((t) => t.id === id);
    if (tenant) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === tenant.propertyId
            ? { ...p, status: 'Disponible', currentTenantId: undefined, currentTenantName: undefined }
            : p
        )
      );
    }
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const recordRentPayment = (tenantId: string, amount: number, paymentMethod: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;
    const property = properties.find((p) => p.id === tenant.propertyId);
    const owner = property ? owners.find((o) => o.id === property.ownerId) : undefined;

    const date = new Date().toISOString().split('T')[0];
    const receiptNum = `QUIT-${agencyConfig.brandShort.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Transaction Loyer
    const rentTrx: Transaction = {
      id: `trx-${Date.now()}`,
      ref: `ENC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'loyer',
      category: 'Encaissement Loyer',
      amount,
      date,
      propertyId: property?.id,
      propertyName: property?.name,
      ownerId: owner?.id,
      ownerName: owner?.fullName,
      tenantId: tenant.id,
      tenantName: tenant.fullName,
      status: 'payé',
      paymentMethod,
      description: `Règlement loyer ${property?.name || ''} - ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`,
      receiptNumber: receiptNum,
      createdByUser: currentUser.fullName,
    };

    // 2. Transaction Commission Agence (ex: 10%)
    const commissionRate = property?.commissionRate || agencyConfig.defaultCommissionRate;
    const commissionAmount = Math.round((amount * commissionRate) / 100);
    const commTrx: Transaction = {
      id: `trx-${Date.now() + 1}`,
      ref: `COM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'commission_agence',
      category: 'Honoraires Gestion',
      amount: commissionAmount,
      date,
      propertyId: property?.id,
      propertyName: property?.name,
      ownerId: owner?.id,
      ownerName: owner?.fullName,
      status: 'payé',
      paymentMethod: 'Prélèvement sur encaissement',
      description: `Honoraires de gestion (${commissionRate}%) sur encaissement loyer`,
      createdByUser: currentUser.fullName,
    };

    setTransactions((prev) => [rentTrx, commTrx, ...prev]);

    // 3. Update Tenant Status
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? {
              ...t,
              paymentStatus: 'A_JOUR',
              lateDays: 0,
            }
          : t
      )
    );

    // 4. Update Owner Balance (Loyer - Commission)
    if (owner) {
      const netToOwner = amount - commissionAmount;
      setOwners((prev) =>
        prev.map((o) =>
          o.id === owner.id
            ? {
                ...o,
                totalRevenueGenerated: o.totalRevenueGenerated + amount,
                currentBalanceToPayout: o.currentBalanceToPayout + netToOwner,
              }
            : o
        )
      );
    }

    // 5. Generate and store Quittance Document
    const quittanceDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      ref: receiptNum,
      title: `Quittance Officielle de Loyer - ${tenant.fullName} (${new Date().toLocaleDateString('fr-FR')})`,
      type: 'quittance',
      category: 'Quittances officielles',
      propertyId: property?.id,
      propertyName: property?.name,
      tenantId: tenant.id,
      tenantName: tenant.fullName,
      ownerId: owner?.id,
      ownerName: owner?.fullName,
      dateAdded: date,
      fileSize: '320 Ko',
      fileType: 'PDF',
    };
    setDocuments((prev) => [quittanceDoc, ...prev]);
  };

  // Transaction actions
  const addTransaction = (trx: Omit<Transaction, 'id' | 'ref' | 'createdByUser'>) => {
    const id = `trx-${Date.now()}`;
    const refPrefix =
      trx.type === 'loyer'
        ? 'ENC'
        : trx.type === 'depense_travaux'
        ? 'DEP'
        : trx.type === 'commission_agence'
        ? 'COM'
        : 'REV';
    const ref = `${refPrefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: Transaction = {
      ...trx,
      id,
      ref,
      createdByUser: currentUser.fullName,
    };
    setTransactions((prev) => [created, ...prev]);

    // If it's a maintenance expense, update owner balance
    if (trx.type === 'depense_travaux' && trx.ownerId) {
      setOwners((prev) =>
        prev.map((o) =>
          o.id === trx.ownerId
            ? {
                ...o,
                totalExpensesIncurred: o.totalExpensesIncurred + trx.amount,
                currentBalanceToPayout: Math.max(0, o.currentBalanceToPayout - trx.amount),
              }
            : o
        )
      );
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Maintenance actions
  const addMaintenanceTicket = (
    ticket: Omit<MaintenanceTicket, 'id' | 'ref' | 'dateReported'>
  ) => {
    const id = `mtn-${Date.now()}`;
    const ref = `INT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const dateReported = new Date().toISOString().split('T')[0];
    const created: MaintenanceTicket = { ...ticket, id, ref, dateReported };
    setMaintenanceTickets((prev) => [created, ...prev]);
  };

  const updateMaintenanceTicket = (id: string, updates: Partial<MaintenanceTicket>) => {
    setMaintenanceTickets((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteMaintenanceTicket = (id: string) => {
    setMaintenanceTickets((prev) => prev.filter((m) => m.id !== id));
  };

  // Documents
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'ref' | 'dateAdded'>) => {
    const id = `doc-${Date.now()}`;
    const ref = `DOC-${doc.type.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const created: DocumentItem = { ...doc, id, ref, dateAdded };
    setDocuments((prev) => [created, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const resetAllDemoData = () => {
    setAgencyConfig(DEFAULT_AGENCY_CONFIG);
    setProperties(INITIAL_PROPERTIES);
    setOwners(INITIAL_OWNERS);
    setTenants(INITIAL_TENANTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setMaintenanceTickets(INITIAL_MAINTENANCE_TICKETS);
    setDocuments(INITIAL_DOCUMENTS);
    localStorage.clear();
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
