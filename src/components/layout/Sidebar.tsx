import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users2,
  KeyRound,
  Wallet,
  Wrench,
  FolderOpen,
  FileSpreadsheet,
  Sparkles,
  Settings,
  ChevronRight,
  Building,
  UserCheck,
  ExternalLink,
  X,
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    agencyConfig,
    currentUser,
    setCurrentUser,
    staffUsers,
    maintenanceTickets,
    tenants,
    currentPortalView,
    setCurrentPortalView,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const pendingTicketsCount = maintenanceTickets.filter(
    (t) => t.status === 'Nouveau' || t.status === 'À valider'
  ).length;

  const lateTenantsCount = tenants.filter(
    (t) => t.paymentStatus === 'RETARD_LEGER' || t.paymentStatus === 'RETARD_CRITIQUE'
  ).length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'properties', label: 'Biens immobiliers', icon: Building2 },
    { id: 'owners', label: 'Propriétaires', icon: Users2 },
    {
      id: 'tenants',
      label: 'Locataires',
      icon: KeyRound,
      badge: lateTenantsCount > 0 ? lateTenantsCount : undefined,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
    { id: 'finances', label: 'Finances', icon: Wallet },
    {
      id: 'maintenance',
      label: 'Maintenance & Travaux',
      icon: Wrench,
      badge: pendingTicketsCount > 0 ? pendingTicketsCount : undefined,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'reports', label: 'Rapports', icon: FileSpreadsheet },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: Sparkles,
    },
  ];

  const handleNavClick = (id: NavigationTab) => {
    setActiveTab(id);
    setCurrentPortalView('agency');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Agency Header */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm tracking-tight shadow-xs">
                TL
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-slate-900 truncate">
                  {agencyConfig.companyName}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {agencyConfig.city} • Logiciel Interne
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Gestion Immobilière
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && currentPortalView === 'agency';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-amber-700' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Owner Portal Dedicated Link */}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Espace Propriétaire
              </div>
              <button
                onClick={() => {
                  setCurrentPortalView('owner_portal');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPortalView === 'owner_portal'
                    ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Portail Bailleurs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom User & Settings Section */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'settings' && currentPortalView === 'agency'
                ? 'bg-slate-200/70 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Paramètres Agence</span>
          </button>

          {/* Active staff selector */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-500 capitalize truncate">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <select
              value={currentUser.id}
              onChange={(e) => {
                const u = staffUsers.find((user) => user.id === e.target.value);
                if (u) setCurrentUser(u);
              }}
              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-600 focus:outline-none focus:border-slate-400 cursor-pointer"
              title="Changer de collaborateur"
            >
              {staffUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>
    </>
  );
};
