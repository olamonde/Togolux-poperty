import React from 'react';
import {
  Building2,
  Users2,
  KeyRound,
  ArrowUpRight,
  Clock,
  AlertCircle,
  FileCheck,
  Receipt,
  Wrench,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardViewProps {
  onOpenRentPayment?: (tenantId: string) => void;
  onOpenPropertyDetail?: (propertyId: string) => void;
  onOpenMaintenanceModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenRentPayment,
  onOpenPropertyDetail,
}) => {
  const {
    currentUser,
    properties,
    owners,
    tenants,
    transactions,
    maintenanceTickets,
    formatPrice,
    setActiveTab,
    setSelectedPropertyId,
  } = useApp();

  const totalProperties = properties.length;
  const totalOwners = owners.length;
  const totalTenants = tenants.length;

  const currentMonthRents = transactions
    .filter((t) => t.type === 'loyer' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const lateTenants = tenants.filter(
    (t) => t.paymentStatus === 'RETARD_LEGER' || t.paymentStatus === 'RETARD_CRITIQUE'
  );

  const pendingMaintenance = maintenanceTickets.filter(
    (m) => m.status === 'Nouveau' || m.status === 'À valider'
  );

  const firstName = currentUser.fullName.split(' ')[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Greeting */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Bonjour, {firstName}
        </h2>
        <p className="text-xs text-slate-500">
          Voici un aperçu de l'activité de votre agence aujourd'hui.
        </p>
      </div>

      {/* Row of simple stat blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Biens */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Biens</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {totalProperties}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {properties.filter((p) => p.status === 'Occupé').length} occupés
          </div>
        </div>

        {/* Propriétaires */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Propriétaires</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {totalOwners}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sous mandat actif</div>
        </div>

        {/* Locataires */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Locataires</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {totalTenants}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {totalTenants - lateTenants.length} à jour
          </div>
        </div>

        {/* Revenus du mois */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Revenus du mois</div>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {formatPrice(currentMonthRents)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Encaissements validés</div>
        </div>
      </div>

      {/* SECTION 1 : Revenus (Graphique simple et élégant) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Revenus & Encaissements
            </h3>
            <p className="text-xs text-slate-600">
              Évolution mensuelle des encaissements de loyers
            </p>
          </div>
          <button
            onClick={() => setActiveTab('finances')}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Voir le journal financier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Simple elegant bars */}
        <div className="pt-4 pb-2">
          <div className="h-32 flex items-end gap-4 sm:gap-6 justify-between border-b border-slate-100 pb-2">
            {[
              { month: 'Mai', amount: 3200000, height: '48%' },
              { month: 'Juin', amount: 3800000, height: '58%' },
              { month: 'Juil', amount: 3950000, height: '62%' },
              { month: 'Août', amount: 4100000, height: '65%' },
              { month: 'Sept', amount: currentMonthRents, height: '78%', current: true },
              { month: 'Oct (est.)', amount: 4800000, height: '75%', projected: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  {formatPrice(bar.amount).replace(' FCFA', '')}
                </span>
                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-sm overflow-hidden h-24 flex items-end">
                  <div
                    style={{ height: bar.height }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      bar.current
                        ? 'bg-slate-900'
                        : bar.projected
                        ? 'bg-slate-300 border-dashed border-t border-slate-400'
                        : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] ${
                    bar.current ? 'font-bold text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: SECTION 2 Alertes importantes + SECTION 3 Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 2 : Alertes importantes (Présentées sous forme de tableau sobre) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Alertes importantes
            </h3>
            <span className="text-[11px] font-medium text-slate-400">
              Actions requises
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Alert 1 : Loyer en retard */}
            <div className="py-3 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-900">Loyer en retard</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">M. Eric Hounsinou</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-3.5">
                  Duplex Les Orchidées • Retard de 9 jours
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-rose-600 block">750 000 FCFA</span>
                <button
                  onClick={() => onOpenRentPayment?.('tenant-4')}
                  className="text-[11px] text-slate-600 hover:text-slate-900 underline mt-0.5"
                >
                  Régulariser
                </button>
              </div>
            </div>

            {/* Alert 2 : Intervention en attente */}
            <div className="py-3 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-900">Intervention en attente</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">Immeuble Marina Plaza</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-3.5">
                  Sécurité incendie • Devis de 110 000 FCFA à valider
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  À valider
                </span>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className="block text-[11px] text-slate-600 hover:text-slate-900 underline mt-1"
                >
                  Examiner
                </button>
              </div>
            </div>

            {/* Alert 3 : Contrat arrivant à expiration */}
            <div className="py-3 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="font-semibold text-slate-900">Contrat à renouveler</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">Résidence Le Baobab</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-3.5">
                  Mme Fatoumata Diallo • Échéance dans 4 mois
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-500 text-[11px]">Bail annuel</span>
              </div>
            </div>

            {/* Alert 4 : Bien vacant */}
            <div className="py-3 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-900">Bien disponible</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">Villa Oasis Cité OUA</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-3.5">
                  Prêt pour nouvelle location • 950 000 FCFA / mois
                </p>
              </div>
              <div className="text-right shrink-0">
                <button
                  onClick={() => {
                    setSelectedPropertyId('prop-5');
                    onOpenPropertyDetail?.('prop-5');
                  }}
                  className="text-[11px] text-slate-600 hover:text-slate-900 underline"
                >
                  Voir fiche
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 : Activité récente (Timeline simple) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Activité récente
            </h3>
            <button
              onClick={() => setActiveTab('finances')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Historique
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            {transactions.slice(0, 5).map((trx) => (
              <div key={trx.id} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    {trx.type === 'loyer' ? (
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    ) : trx.type === 'depense_travaux' ? (
                      <Wrench className="w-3.5 h-3.5 text-slate-600" />
                    ) : (
                      <Users2 className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">
                      {trx.category}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {trx.propertyName || trx.ownerName || trx.description}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-semibold ${
                      trx.type === 'loyer' ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {trx.type === 'loyer' ? '+' : '-'} {formatPrice(trx.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{trx.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
