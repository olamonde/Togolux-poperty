import React, { useState } from 'react';
import { X, Wallet, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Owner } from '../../types';

interface OwnerPayoutModalProps {
  owner: Owner;
  onClose: () => void;
}

export const OwnerPayoutModal: React.FC<OwnerPayoutModalProps> = ({ owner, onClose }) => {
  const { formatPrice, recordOwnerPayout } = useApp();

  const [amount, setAmount] = useState<number>(owner.currentBalanceToPayout || 0);
  const [paymentMethod, setPaymentMethod] = useState('Virement bancaire');
  const [notes, setNotes] = useState('Reversement mensuel des loyers nets');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Veuillez spécifier un montant positif.');
      return;
    }

    recordOwnerPayout(owner.id, Number(amount), paymentMethod, notes);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reversement propriétaire</h3>
            <p className="text-xs text-slate-500">{owner.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Reversement enregistré !</h4>
            <p className="text-xs text-slate-500">
              L'ordre de virement de {formatPrice(amount)} a été déduit du solde du bailleur.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Solde net disponible
                </span>
                <span className="text-base font-bold text-slate-900">
                  {formatPrice(owner.currentBalanceToPayout || 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAmount(owner.currentBalanceToPayout || 0)}
                className="px-2 py-1 rounded bg-white text-slate-700 border border-slate-200 text-[11px] font-medium hover:bg-slate-100"
              >
                Tout reverser
              </button>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Montant du reversement *
              </label>
              <input
                type="number"
                required
                min="1"
                step="5000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Mode de règlement</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Chèque certifié">Chèque certifié</option>
                <option value="T-Money Pro">T-Money Pro</option>
                <option value="Moov Flooz">Moov Flooz</option>
                <option value="Espèces contre décharge">Espèces contre décharge</option>
              </select>
            </div>

            {owner.bankDetails && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                <div><b>Banque :</b> {owner.bankDetails.bankName}</div>
                <div><b>RIB :</b> {owner.bankDetails.accountNumber}</div>
              </div>
            )}

            <div>
              <label className="text-slate-700 font-medium block mb-1">Libellé / Note</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-2xs"
              >
                Confirmer le reversement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
