import React, { useState } from 'react';
import {
  X,
  Building2,
  Receipt,
  FileText,
  Phone,
  Mail,
  MapPin,
  Wallet,
  Edit,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Owner } from '../../types';

interface OwnerDetailModalProps {
  owner: Owner;
  onClose: () => void;
  onEdit: (owner: Owner) => void;
  onOpenPayout: (owner: Owner) => void;
  onOpenPropertyDetail: (propId: string) => void;
}

export const OwnerDetailModal: React.FC<OwnerDetailModalProps> = ({
  owner,
  onClose,
  onEdit,
  onOpenPayout,
  onOpenPropertyDetail,
}) => {
  const { properties, transactions, documents, formatPrice } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'biens' | 'comptabilite' | 'docs'>('biens');

  const ownedProperties = properties.filter((p) => p.ownerId === owner.id);
  const ownerTransactions = transactions.filter((t) => t.ownerId === owner.id);
  const ownerDocuments = documents.filter((d) => d.ownerId === owner.id);

  const totalRents = ownerTransactions
    .filter((t) => t.type === 'loyer' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCommissions = ownerTransactions
    .filter((t) => t.type === 'commission_agence' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = ownerTransactions
    .filter((t) => t.type === 'depense_travaux' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPayoutsDone = ownerTransactions
    .filter((t) => t.type === 'reversement_proprietaire' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {owner.ref}
              </span>
              {owner.company && (
                <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {owner.company}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{owner.fullName}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {owner.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {owner.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {owner.city} ({owner.country})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(owner)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Modifier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance Strip */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Solde net disponible à reverser
            </span>
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(owner.currentBalanceToPayout || 0)}
            </span>
          </div>

          <button
            onClick={() => onOpenPayout(owner)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs flex items-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Effectuer un reversement</span>
          </button>
        </div>

        {/* KPI Mini-cards */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white border-b border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Loyers bruts
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalRents)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Commissions TogoLux
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalCommissions)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Dépenses travaux
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalExpenses)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Déjà reversé
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {formatPrice(totalPayoutsDone)}
            </span>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-4 px-5 border-b border-slate-100 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('biens')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeSubTab === 'biens'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Biens sous mandat ({ownedProperties.length})
          </button>
          <button
            onClick={() => setActiveSubTab('comptabilite')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeSubTab === 'comptabilite'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Grand livre ({ownerTransactions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeSubTab === 'docs'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Documents ({ownerDocuments.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {activeSubTab === 'biens' && (
            <div className="space-y-2">
              {ownedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{prop.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {prop.neighborhood} • {prop.surface} m² • Loyer : {formatPrice(prop.monthlyRent)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200">
                      {prop.status}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPropertyDetail(prop.id);
                      }}
                      className="block text-[11px] text-slate-700 underline font-medium mt-1"
                    >
                      Ouvrir fiche
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'comptabilite' && (
            <div className="divide-y divide-slate-100">
              {ownerTransactions.map((trx) => (
                <div key={trx.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{trx.category}</div>
                    <div className="text-slate-500 text-[11px]">{trx.date} • {trx.description}</div>
                  </div>
                  <div className="text-right font-medium text-slate-900">
                    {trx.type === 'loyer' ? '+' : '-'} {formatPrice(trx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'docs' && (
            <div className="space-y-2">
              {ownerDocuments.map((doc) => (
                <div key={doc.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-900">{doc.title}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{doc.dateAdded}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
