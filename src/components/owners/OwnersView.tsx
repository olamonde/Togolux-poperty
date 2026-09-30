import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Building2,
  Wallet,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Owner } from '../../types';

interface OwnersViewProps {
  onOpenDetail: (owner: Owner) => void;
  onOpenNewOwner: () => void;
  onEditOwner: (owner: Owner) => void;
  onOpenPayout: (owner: Owner) => void;
}

export const OwnersView: React.FC<OwnersViewProps> = ({
  onOpenDetail,
  onOpenNewOwner,
  onEditOwner,
  onOpenPayout,
}) => {
  const { owners, properties, formatPrice, globalSearch } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const effectiveSearch = searchTerm || globalSearch;

  const filtered = owners.filter((o) => {
    return (
      o.fullName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      o.ref.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (o.company && o.company.toLowerCase().includes(effectiveSearch.toLowerCase())) ||
      o.city.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      o.phone.includes(effectiveSearch)
    );
  });

  const totalPayoutBalance = owners.reduce((acc, o) => acc + o.currentBalanceToPayout, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Propriétaires sous mandat</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {owners.length} bailleurs
          </span>
          <span className="text-[11px] text-slate-500">Comptes actifs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Solde total à reverser</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatPrice(totalPayoutBalance)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Fonds disponibles</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total biens sous gestion</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {properties.length} unités
          </span>
          <span className="text-[11px] text-slate-500">Parc immobilier global</span>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher bailleur, téléphone, ville..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        <button
          onClick={onOpenNewOwner}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau propriétaire</span>
        </button>
      </div>

      {/* Clean CRM Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nom du bailleur</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Biens gérés</th>
                <th className="py-3 px-4 text-right">Revenus cumulés</th>
                <th className="py-3 px-4 text-right">Solde à reverser</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((owner) => {
                const ownerProps = properties.filter((p) => p.ownerId === owner.id);
                const hasBalance = owner.currentBalanceToPayout > 0;

                return (
                  <tr key={owner.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nom */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onOpenDetail(owner)}
                        className="font-semibold text-slate-900 hover:text-amber-700 text-left block"
                      >
                        {owner.fullName}
                      </button>
                      <div className="text-[11px] text-slate-500">
                        {owner.company || `${owner.city} (${owner.country})`}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{owner.phone}</div>
                      <div className="text-[11px] text-slate-400">{owner.email}</div>
                    </td>

                    {/* Biens */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {ownerProps.length} bien(s)
                      </span>
                    </td>

                    {/* Revenus */}
                    <td className="py-3.5 px-4 text-right font-medium text-slate-800 tabular-nums">
                      {formatPrice(owner.totalRevenueGenerated)}
                    </td>

                    {/* Solde à reverser */}
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          hasBalance ? 'text-amber-800' : 'text-slate-400'
                        }`}
                      >
                        {formatPrice(owner.currentBalanceToPayout)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDetail(owner)}
                          className="px-2.5 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium text-[11px]"
                        >
                          Dossier
                        </button>

                        <button
                          onClick={() => onOpenPayout(owner)}
                          disabled={!hasBalance}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                            hasBalance
                              ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title="Effectuer un reversement"
                        >
                          Reverser
                        </button>

                        <button
                          onClick={() => onEditOwner(owner)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
