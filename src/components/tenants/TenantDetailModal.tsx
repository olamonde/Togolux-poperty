import React, { useState } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  Receipt,
  FileText,
  ShieldCheck,
  Edit,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant } from '../../types';

interface TenantDetailModalProps {
  tenant: Tenant;
  onClose: () => void;
  onEdit: (tenant: Tenant) => void;
  onPayRent: (tenant: Tenant) => void;
}

export const TenantDetailModal: React.FC<TenantDetailModalProps> = ({
  tenant,
  onClose,
  onEdit,
  onPayRent,
}) => {
  const { properties, transactions, documents, formatPrice, deleteTenant } = useApp();

  const property = properties.find((p) => p.id === tenant.propertyId);
  const tenantTransactions = transactions.filter((t) => t.tenantId === tenant.id);
  const tenantDocuments = documents.filter((d) => d.tenantId === tenant.id);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {tenant.ref}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  tenant.paymentStatus === 'A_JOUR'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {tenant.paymentStatus === 'A_JOUR' ? 'À jour' : `En retard (${tenant.lateDays}j)`}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{tenant.fullName}</h2>
            {tenant.company && (
              <div className="text-xs text-slate-500 font-medium">{tenant.company}</div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(tenant)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Modifier</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`Confirmez-vous la suppression du locataire ${tenant.fullName} ?`)) {
                  deleteTenant(tenant.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Supprimer locataire"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action strip */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Loyer mensuel
            </span>
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(tenant.monthlyRent)}
            </span>
          </div>

          <button
            onClick={() => onPayRent(tenant)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Encaisser un loyer</span>
          </button>
        </div>

        {/* Details Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Téléphone
              </span>
              <span className="font-semibold text-slate-900 text-xs block mt-0.5">
                {tenant.phone}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Email
              </span>
              <span className="font-semibold text-slate-900 text-xs block mt-0.5 truncate">
                {tenant.email}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Pièce d'identité / NIF
              </span>
              <span className="font-mono text-slate-900 text-[11px] block mt-0.5 truncate">
                {tenant.nationalIdNumber}
              </span>
            </div>
          </div>

          {/* Bien & Contrat */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-semibold text-slate-900 text-xs">Conditions du bail</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div>
                Bien loué : <b className="text-slate-900">{tenant.propertyName}</b>
              </div>
              <div>
                Caution déposée : <b className="text-slate-900">{formatPrice(tenant.depositPaid)}</b>
              </div>
              <div>
                Période : Du {tenant.leaseStartDate} au {tenant.leaseEndDate}
              </div>
              <div>
                Échéance : Le {tenant.paymentDayOfMonth} de chaque mois
              </div>
            </div>
          </div>

          {/* Historique des quittances */}
          <div className="space-y-2 pt-1">
            <h4 className="font-semibold text-slate-900 text-xs">
              Historique des règlements ({tenantTransactions.length})
            </h4>
            {tenantTransactions.length === 0 ? (
              <p className="text-slate-500 italic">Aucun règlement archivé.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {tenantTransactions.map((trx) => (
                  <div key={trx.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-slate-900">{trx.category}</div>
                      <div className="text-slate-500 text-[11px]">{trx.date} • {trx.description}</div>
                    </div>
                    <div className="text-right font-semibold text-slate-900">
                      {formatPrice(trx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
