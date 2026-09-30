import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Eye,
  Edit,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant } from '../../types';

interface TenantsViewProps {
  onOpenDetail: (tenant: Tenant) => void;
  onOpenNewTenant: () => void;
  onEditTenant: (tenant: Tenant) => void;
  onOpenPayRent: (tenant: Tenant) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  onOpenDetail,
  onOpenNewTenant,
  onEditTenant,
  onOpenPayRent,
}) => {
  const { tenants, formatPrice, globalSearch } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const effectiveSearch = searchTerm || globalSearch;

  const filtered = tenants.filter((t) => {
    const matchSearch =
      t.fullName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (t.propertyName || '').toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      t.phone.includes(effectiveSearch) ||
      (t.ref || '').toLowerCase().includes(effectiveSearch.toLowerCase());

    const matchStatus = filterStatus === 'all' || t.paymentStatus === filterStatus;

    return matchSearch && matchStatus;
  });

  const lateCount = tenants.filter(
    (t) => t.paymentStatus === 'RETARD_LEGER' || t.paymentStatus === 'RETARD_CRITIQUE'
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16">
      {/* 3 Simple stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total locataires actifs</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {tenants.length} occupants
          </span>
          <span className="text-[11px] text-slate-500">Baux d'habitation & commerciaux</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Loyers à jour</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {tenants.length - lateCount} dossiers
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Recouvrement régulier</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Retards de règlement</span>
          <span className="text-xl font-bold text-rose-700 mt-1 block">
            {lateCount} dossier(s)
          </span>
          <span className="text-[11px] text-slate-500">Nécessite relance</span>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher locataire, bien..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatus('A_JOUR')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterStatus === 'A_JOUR'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              À jour
            </button>
            <button
              onClick={() => setFilterStatus('RETARD_LEGER')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterStatus === 'RETARD_LEGER'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              En retard
            </button>
          </div>
        </div>

        <button
          onClick={onOpenNewTenant}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau locataire</span>
        </button>
      </div>

      {/* Clean Tenants Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Locataire</th>
                <th className="py-3 px-4">Bien loué</th>
                <th className="py-3 px-4">Statut paiement</th>
                <th className="py-3 px-4 text-right">Loyer mensuel</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onOpenDetail(tenant)}
                      className="font-semibold text-slate-900 hover:text-amber-700 text-left block"
                    >
                      {tenant.fullName}
                    </button>
                    <div className="text-[11px] text-slate-400">
                      {tenant.company ? `${tenant.company} • ` : ''}
                      {tenant.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {tenant.propertyName}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        tenant.paymentStatus === 'A_JOUR'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {tenant.paymentStatus === 'A_JOUR'
                        ? 'À jour'
                        : `Retard (${tenant.lateDays}j)`}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900 tabular-nums">
                    {formatPrice(tenant.monthlyRent || 0)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    Le {tenant.paymentDayOfMonth} du mois
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenPayRent(tenant)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] shadow-2xs"
                        title="Encaisser loyer"
                      >
                        Encaisser
                      </button>
                      <button
                        onClick={() => onOpenDetail(tenant)}
                        className="px-2 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium text-[11px]"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => onEditTenant(tenant)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
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
