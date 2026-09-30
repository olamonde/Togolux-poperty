import React, { useState } from 'react';
import {
  Search,
  Plus,
  Building2,
  Users2,
  KeyRound,
  Wallet,
  Wrench,
  ChevronDown,
  Menu,
  Bell,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenNewProperty?: () => void;
  onOpenNewOwner?: () => void;
  onOpenNewTenant?: () => void;
  onOpenNewTransaction?: () => void;
  onOpenNewMaintenance?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewProperty,
  onOpenNewOwner,
  onOpenNewTenant,
  onOpenNewTransaction,
  onOpenNewMaintenance,
}) => {
  const {
    activeTab,
    agencyConfig,
    globalSearch,
    setGlobalSearch,
    currentUser,
    currentPortalView,
    setCurrentPortalView,
    setIsMobileMenuOpen,
    maintenanceTickets,
    tenants,
  } = useApp();

  const [isQuickOpen, setIsQuickOpen] = useState(false);

  const getPageInfo = () => {
    if (currentPortalView === 'owner_portal') {
      return { title: 'Espace Propriétaire', subtitle: 'Portail privé de consultation pour les bailleurs' };
    }
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Tableau de bord', subtitle: "Aperçu de l'activité de l'agence" };
      case 'properties':
        return { title: 'Biens immobiliers', subtitle: 'Gestion du patrimoine et des mandats' };
      case 'owners':
        return { title: 'Propriétaires', subtitle: 'Comptes bailleurs et reversements' };
      case 'tenants':
        return { title: 'Locataires', subtitle: 'Suivi des baux et encaissements' };
      case 'finances':
        return { title: 'Finances', subtitle: 'Comptabilité, loyers et dépenses' };
      case 'maintenance':
        return { title: 'Maintenance & Travaux', subtitle: 'Interventions techniques et prestataires' };
      case 'documents':
        return { title: 'Documents', subtitle: 'Gestion électronique des documents' };
      case 'reports':
        return { title: 'Rapports & Bilans', subtitle: 'États mensuels et reddition de comptes' };
      case 'ai':
        return { title: 'Assistant IA', subtitle: 'Assistance documentaire et rédactionnelle' };
      case 'settings':
        return { title: 'Paramètres', subtitle: "Configuration et identité de l'agence" };
      default:
        return { title: 'ImmoPilot', subtitle: 'Gestion immobilière' };
    }
  };

  const { title, subtitle } = getPageInfo();

  const alertsCount =
    maintenanceTickets.filter((t) => t.status === 'À valider').length +
    tenants.filter((t) => t.paymentStatus !== 'A_JOUR').length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          title="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block leading-tight">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Subtle Search Bar */}
        <div className="relative w-44 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Currency badge */}
        <div className="hidden md:flex items-center px-2 py-1 rounded bg-slate-100 text-[11px] font-semibold text-slate-600">
          {agencyConfig.currency}
        </div>

        {/* Mode Toggle: Agency ERP vs Owner Portal */}
        <button
          onClick={() =>
            setCurrentPortalView(currentPortalView === 'agency' ? 'owner_portal' : 'agency')
          }
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            currentPortalView === 'owner_portal'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Basculer entre la vue Agence et la vue Propriétaire"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>{currentPortalView === 'agency' ? 'Espace Propriétaire' : 'Vue Agence'}</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={`${alertsCount} alertes actives`}
          >
            <Bell className="w-4 h-4" />
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        </div>

        {/* Quick Add Dropdown */}
        {currentPortalView === 'agency' && (
          <div className="relative">
            <button
              onClick={() => setIsQuickOpen(!isQuickOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ajouter</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isQuickOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsQuickOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1 space-y-0.5 animate-in fade-in">
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onOpenNewProperty?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nouveau bien</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onOpenNewTenant?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nouveau locataire</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onOpenNewOwner?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                  >
                    <Users2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nouveau propriétaire</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onOpenNewTransaction?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Écriture financière</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onOpenNewMaintenance?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ticket maintenance</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
