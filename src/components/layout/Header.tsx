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
  Cloud,
  CloudOff,
  LogOut,
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
    authUser,
    loginWithGoogle,
    logout,
    isFirestoreConnected,
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

        {/* Firebase Authentication & Cloud Sync */}
        {authUser ? (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium truncate max-w-[120px]" title={authUser.email || ''}>
              {authUser.displayName || authUser.email?.split('@')[0]}
            </span>
            <button
              onClick={() => logout()}
              title="Se déconnecter"
              className="ml-1 p-0.5 rounded text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition-colors"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => loginWithGoogle()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs transition-all"
            title="Se connecter avec Google pour synchroniser avec Cloud Firestore"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden md:inline">Connexion Google</span>
          </button>
        )}

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
