import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building2,
  Receipt,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const {
    agencyConfig,
    properties,
    tenants,
    transactions,
    formatPrice,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('09');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Filter transactions for period
  const periodTransactions = transactions.filter((t) => {
    const transactionDate = t.paymentDate || t.date || t.createdAt || '';
    return transactionDate.startsWith(`${selectedYear}-${selectedMonth}`);
  });

  const totalRents = periodTransactions
    .filter((t) => t.type === 'loyer' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCommissions = periodTransactions
    .filter((t) => t.type === 'commission_agence' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = periodTransactions
    .filter((t) => t.type === 'depense_travaux' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalRents - totalExpenses - totalCommissions;

  const lateTenants = tenants.filter(
    (t) => t.paymentStatus === 'RETARD_LEGER' || t.paymentStatus === 'RETARD_CRITIQUE'
  );

  const monthName = new Date(Number(selectedYear), Number(selectedMonth) - 1).toLocaleString(
    'fr-FR',
    { month: 'long', year: 'numeric' }
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Période du rapport :</span>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-400"
          >
            <option value="01">Janvier</option>
            <option value="02">Février</option>
            <option value="03">Mars</option>
            <option value="04">Avril</option>
            <option value="05">Mai</option>
            <option value="06">Juin</option>
            <option value="07">Juillet</option>
            <option value="08">Août</option>
            <option value="09">Septembre</option>
            <option value="10">Octobre</option>
            <option value="11">Novembre</option>
            <option value="12">Décembre</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-400"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimer / Exporter PDF</span>
        </button>
      </div>

      {/* Clean Formal Document */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs space-y-6">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                TL
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {agencyConfig.companyName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {agencyConfig.tagline}
            </p>
            <p className="text-[11px] text-slate-400">
              {agencyConfig.address} • {agencyConfig.city}
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 uppercase">
              Rapport mensuel de gestion
            </span>
            <div className="text-sm font-bold text-slate-900 capitalize mt-1">
              {monthName}
            </div>
            <div className="text-[11px] text-slate-400">
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Loyers perçus
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalRents)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Commissions agence
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalCommissions)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Travaux & Dépenses
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalExpenses)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Solde net bailleurs
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {formatPrice(Math.max(0, netBalance))}
            </span>
          </div>
        </div>

        {/* État locatif */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            État locatif du parc
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bien</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 px-3">Propriétaire</th>
                  <th className="py-2.5 px-3">Occupant</th>
                  <th className="py-2.5 px-3 text-right">Loyer mensuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-2.5 px-3">{p.status}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.ownerName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.currentTenantName || 'Vacant'}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                      {formatPrice(p.monthlyRent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-900 block mb-0.5">Responsable comptable</span>
            <div>Kodjo Agbeko</div>
          </div>

          <div className="text-right">
            <span className="font-semibold text-slate-900 block mb-0.5">Directeur Général</span>
            <div>Koffi Mensah</div>
          </div>
        </div>
      </div>
    </div>
  );
};
