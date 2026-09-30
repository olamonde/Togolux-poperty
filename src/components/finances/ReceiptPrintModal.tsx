import React from 'react';
import { X, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';

interface ReceiptPrintModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  transaction,
  onClose,
}) => {
  const { agencyConfig, formatPrice } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between no-print">
          <span className="text-xs font-semibold text-slate-800">
            Document officiel de l'agence
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 bg-white text-slate-900 overflow-y-auto font-sans leading-relaxed">
          {/* Header Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                  TL
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {agencyConfig.companyName}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {agencyConfig.tagline}
              </p>
              <p className="text-[10px] text-slate-400 max-w-sm">
                {agencyConfig.address} • {agencyConfig.city} ({agencyConfig.country})
                <br />
                Tél : {agencyConfig.contactPhone} • Email : {agencyConfig.contactEmail}
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px] uppercase border border-slate-200">
                {transaction.type === 'loyer'
                  ? 'Quittance de loyer'
                  : transaction.type === 'reversement_proprietaire'
                  ? 'Reçu de reversement'
                  : 'Reçu financier'}
              </span>
              <div className="text-[11px] font-mono text-slate-600 font-bold mt-1.5">
                Réf : {transaction.receiptNumber || transaction.ref}
              </div>
              <div className="text-[10px] text-slate-400">Date : {transaction.date}</div>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-5">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                Émetteur
              </span>
              <div className="font-bold text-slate-900">{agencyConfig.legalName}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Service Gestion Locative
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                Partie prenante
              </span>
              <div className="font-bold text-slate-900">
                {transaction.tenantName || transaction.ownerName || 'Client de l’agence'}
              </div>
              {transaction.propertyName && (
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Bien : {transaction.propertyName}
                </div>
              )}
            </div>
          </div>

          {/* Statement details */}
          <table className="w-full text-xs text-left mb-6 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                <th className="py-2">Désignation</th>
                <th className="py-2">Motif</th>
                <th className="py-2">Règlement</th>
                <th className="py-2 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-slate-900">{transaction.category}</td>
                <td className="py-3 text-slate-600">{transaction.description}</td>
                <td className="py-3 text-slate-600">{transaction.paymentMethod}</td>
                <td className="py-3 text-right font-bold text-slate-900">
                  {formatPrice(transaction.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total box */}
          <div className="flex justify-end mb-6">
            <div className="w-56 p-3 rounded-lg bg-slate-50 border border-slate-200 text-right space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Total réglé
              </span>
              <div className="text-base font-bold text-slate-900">
                {formatPrice(transaction.amount)}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                ✓ Règlement validé
              </span>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <p className="text-[10px] text-slate-400 italic max-w-xs">
              Document officiel généré sous réserve d'encaissement effectif.
            </p>
            <div className="text-right">
              <div className="font-semibold text-slate-800 text-[11px]">
                Pour {agencyConfig.companyName}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Visa de direction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
