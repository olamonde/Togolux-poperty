import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { PropertiesView } from './components/properties/PropertiesView';
import { PropertyDetailModal } from './components/properties/PropertyDetailModal';
import { PropertyFormModal } from './components/properties/PropertyFormModal';

import { OwnersView } from './components/owners/OwnersView';
import { OwnerDetailModal } from './components/owners/OwnerDetailModal';
import { OwnerFormModal } from './components/owners/OwnerFormModal';
import { OwnerPayoutModal } from './components/owners/OwnerPayoutModal';
import { OwnerPortalView } from './components/portal/OwnerPortalView';

import { TenantsView } from './components/tenants/TenantsView';
import { TenantDetailModal } from './components/tenants/TenantDetailModal';
import { TenantFormModal } from './components/tenants/TenantFormModal';
import { RentPaymentModal } from './components/tenants/RentPaymentModal';

import { FinancesView } from './components/finances/FinancesView';
import { TransactionFormModal } from './components/finances/TransactionFormModal';
import { ReceiptPrintModal } from './components/finances/ReceiptPrintModal';

import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { MaintenanceModal } from './components/maintenance/MaintenanceModal';

import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { SettingsView } from './components/settings/SettingsView';

import { Property, Owner, Tenant, Transaction, MaintenanceTicket } from './types';

function AppContent() {
  const { activeTab, properties, owners, tenants, currentPortalView } = useApp();

  // Modals state
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);

  const [selectedOwnerForDetail, setSelectedOwnerForDetail] = useState<Owner | null>(null);
  const [ownerToEdit, setOwnerToEdit] = useState<Owner | null>(null);
  const [isNewOwnerOpen, setIsNewOwnerOpen] = useState(false);
  const [ownerForPayout, setOwnerForPayout] = useState<Owner | null>(null);

  const [selectedTenantForDetail, setSelectedTenantForDetail] = useState<Tenant | null>(null);
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null);
  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false);
  const [tenantForRentPayment, setTenantForRentPayment] = useState<Tenant | null>(null);

  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<Transaction | null>(null);

  const [ticketToEdit, setTicketToEdit] = useState<MaintenanceTicket | null>(null);
  const [isNewMaintenanceOpen, setIsNewMaintenanceOpen] = useState(false);

  const handleOpenPropertyById = (propId: string) => {
    const p = properties.find((item) => item.id === propId);
    if (p) setSelectedPropertyForDetail(p);
  };

  const handleOpenRentPaymentByTenantId = (tenantId: string) => {
    const t = tenants.find((item) => item.id === tenantId);
    if (t) setTenantForRentPayment(t);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenNewProperty={() => setIsNewPropertyOpen(true)}
          onOpenNewOwner={() => setIsNewOwnerOpen(true)}
          onOpenNewTenant={() => setIsNewTenantOpen(true)}
          onOpenNewTransaction={() => setIsNewTransactionOpen(true)}
          onOpenNewMaintenance={() => setIsNewMaintenanceOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8">
          {currentPortalView === 'owner_portal' ? (
            <OwnerPortalView />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  onOpenRentPayment={handleOpenRentPaymentByTenantId}
                  onOpenPropertyDetail={handleOpenPropertyById}
                  onOpenMaintenanceModal={() => setIsNewMaintenanceOpen(true)}
                />
              )}

              {activeTab === 'properties' && (
                <PropertiesView
                  onOpenDetail={(prop) => setSelectedPropertyForDetail(prop)}
                  onOpenNewProperty={() => setIsNewPropertyOpen(true)}
                  onEditProperty={(prop) => setPropertyToEdit(prop)}
                />
              )}

              {activeTab === 'owners' && (
                <OwnersView
                  onOpenDetail={(own) => setSelectedOwnerForDetail(own)}
                  onOpenNewOwner={() => setIsNewOwnerOpen(true)}
                  onEditOwner={(own) => setOwnerToEdit(own)}
                  onOpenPayout={(own) => setOwnerForPayout(own)}
                />
              )}

              {activeTab === 'tenants' && (
                <TenantsView
                  onOpenDetail={(t) => setSelectedTenantForDetail(t)}
                  onOpenNewTenant={() => setIsNewTenantOpen(true)}
                  onEditTenant={(t) => setTenantToEdit(t)}
                  onOpenPayRent={(t) => setTenantForRentPayment(t)}
                />
              )}

              {activeTab === 'finances' && (
                <FinancesView
                  onOpenNewTransaction={() => setIsNewTransactionOpen(true)}
                  onPrintReceipt={(trx) => setReceiptToPrint(trx)}
                />
              )}

              {activeTab === 'maintenance' && (
                <MaintenanceView
                  onOpenNewTicket={() => setIsNewMaintenanceOpen(true)}
                  onEditTicket={(ticket) => setTicketToEdit(ticket)}
                />
              )}

              {activeTab === 'documents' && <DocumentsView />}

              {activeTab === 'reports' && <ReportsView />}

              {activeTab === 'ai' && <AIAssistantView />}

              {activeTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Property Detail Modal */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          onClose={() => setSelectedPropertyForDetail(null)}
          onEdit={(prop) => {
            setSelectedPropertyForDetail(null);
            setPropertyToEdit(prop);
          }}
        />
      )}

      {/* 2. Property Add/Edit Modal */}
      {(isNewPropertyOpen || propertyToEdit) && (
        <PropertyFormModal
          initialProperty={propertyToEdit || undefined}
          onClose={() => {
            setIsNewPropertyOpen(false);
            setPropertyToEdit(null);
          }}
        />
      )}

      {/* 3. Owner Detail Modal */}
      {selectedOwnerForDetail && (
        <OwnerDetailModal
          owner={selectedOwnerForDetail}
          onClose={() => setSelectedOwnerForDetail(null)}
          onEdit={(own) => {
            setSelectedOwnerForDetail(null);
            setOwnerToEdit(own);
          }}
          onOpenPayout={(own) => setOwnerForPayout(own)}
          onOpenPropertyDetail={handleOpenPropertyById}
        />
      )}

      {/* 4. Owner Add/Edit Modal */}
      {(isNewOwnerOpen || ownerToEdit) && (
        <OwnerFormModal
          initialOwner={ownerToEdit || undefined}
          onClose={() => {
            setIsNewOwnerOpen(false);
            setOwnerToEdit(null);
          }}
        />
      )}

      {/* 5. Owner Payout Modal */}
      {ownerForPayout && (
        <OwnerPayoutModal
          owner={ownerForPayout}
          onClose={() => setOwnerForPayout(null)}
        />
      )}

      {/* 6. Tenant Detail Modal */}
      {selectedTenantForDetail && (
        <TenantDetailModal
          tenant={selectedTenantForDetail}
          onClose={() => setSelectedTenantForDetail(null)}
          onEdit={(t) => {
            setSelectedTenantForDetail(null);
            setTenantToEdit(t);
          }}
          onPayRent={(t) => {
            setSelectedTenantForDetail(null);
            setTenantForRentPayment(t);
          }}
        />
      )}

      {/* 7. Tenant Add/Edit Modal */}
      {(isNewTenantOpen || tenantToEdit) && (
        <TenantFormModal
          initialTenant={tenantToEdit || undefined}
          onClose={() => {
            setIsNewTenantOpen(false);
            setTenantToEdit(null);
          }}
        />
      )}

      {/* 8. Rent Payment Modal */}
      {tenantForRentPayment && (
        <RentPaymentModal
          tenant={tenantForRentPayment}
          onClose={() => setTenantForRentPayment(null)}
        />
      )}

      {/* 9. Finance Transaction Modal */}
      {isNewTransactionOpen && (
        <TransactionFormModal onClose={() => setIsNewTransactionOpen(false)} />
      )}

      {/* 10. Receipt Print Modal */}
      {receiptToPrint && (
        <ReceiptPrintModal
          transaction={receiptToPrint}
          onClose={() => setReceiptToPrint(null)}
        />
      )}

      {/* 11. Maintenance Ticket Modal */}
      {(isNewMaintenanceOpen || ticketToEdit) && (
        <MaintenanceModal
          initialTicket={ticketToEdit || undefined}
          onClose={() => {
            setIsNewMaintenanceOpen(false);
            setTicketToEdit(null);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
