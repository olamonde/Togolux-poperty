import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Printer,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';

interface FinancesViewProps {
  onOpenNewTransaction: () => void;
  onPrintReceipt: (trx: Transaction) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  onOpenNewTransaction,
  onPrintReceipt,
}) => {
  const { transactions, formatPrice, deleteTransaction, globalSearch } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const effectiveSearch = searchTerm || globalSearch;

  // KPIs
  const totalRents = transactions
    .filter((t) => t.type === 'loyer' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCommissions = transactions
    .filter((t) => t.type === 'commission_agence' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'depense_travaux' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPayouts = transactions
    .filter((t) => t.type === 'reversement_proprietaire' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  // Filtered list
  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      t.ref.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (t.propertyName && t.propertyName.toLowerCase().includes(effectiveSearch.toLowerCase())) ||
      (t.ownerName && t.ownerName.toLowerCase().includes(effectiveSearch.toLowerCase())) ||
      (t.tenantName && t.tenantName.toLowerCase().includes(effectiveSearch.toLowerCase()));

    const matchType = activeFilter === 'all' || t.type === activeFilter;

    return matchSearch && matchType;
  });

  const exportCSV = () => {
    const headers = ['Ref', 'Date', 'Type', 'Categorie', 'Montant', 'Bien', 'Proprietaire', 'Locataire', 'Mode'];
    const rows = filtered.map((t) => [
      t.ref,
      t.date,
      t.type,
      `"${t.category}"`,
      t.amount,
      `"${t.propertyName || ''}"`,
      `"${t.ownerName || ''}"`,
      `"${t.tenantName || ''}"`,
      `"${t.paymentMethod}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finances_togolux_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Loyers encaissés</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatPrice(totalRents)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Recettes locatives</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Commissions agence</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatPrice(totalCommissions)}
          </span>
          <span className="text-[11px] text-slate-500">Chiffre d'affaires TogoLux</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Dépenses & travaux</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatPrice(totalExpenses)}
          </span>
          <span className="text-[11px] text-slate-500">Imputées aux comptes</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Reversements bailleurs</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatPrice(totalPayouts)}
          </span>
          <span className="text-[11px] text-slate-500">Virés aux propriétaires</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter chips & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
            {[
              { id: 'all', label: 'Toutes les opérations' },
              { id: 'loyer', label: 'Loyers' },
              { id: 'depense_travaux', label: 'Dépenses' },
              { id: 'commission_agence', label: 'Commissions' },
              { id: 'reversement_proprietaire', label: 'Reversements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher écriture..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle écriture</span>
          </button>
        </div>
      </div>

      {/* Clean Stripe-inspired Financial Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Bien</th>
                <th className="py-3 px-4">Propriétaire</th>
                <th className="py-3 px-4 text-right">Montant (FCFA)</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium">
                    {trx.date}
                  </td>

                  {/* Description & Category */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{trx.category}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                      {trx.description}
                    </span>
                  </td>

                  {/* Bien */}
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {trx.propertyName || '-'}
                  </td>

                  {/* Propriétaire */}
                  <td className="py-3 px-4 text-slate-600">
                    {trx.ownerName || '-'}
                  </td>

                  {/* Montant (parfaitement aligné, right-aligned) */}
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                    {trx.type === 'loyer' || trx.type === 'commission_agence' ? '+' : '-'} {formatPrice(trx.amount)}
                  </td>

                  {/* Statut Badge */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        trx.status === 'payé'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : trx.status === 'en_retard'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPrintReceipt(trx)}
                        className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1"
                        title="Imprimer quittance / reçu"
                      >
                        <Printer className="w-3 h-3 text-slate-500" />
                        <span>Reçu</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer cette écriture comptable ?')) {
                            deleteTransaction(trx.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
