import React, { useState } from 'react';
import { X, Receipt, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant } from '../../types';

interface RentPaymentModalProps {
  tenant: Tenant;
  onClose: () => void;
  onReceiptReady?: (receiptRef: string) => void;
}

export const RentPaymentModal: React.FC<RentPaymentModalProps> = ({
  tenant,
  onClose,
}) => {
  const { formatPrice, recordRentPayment, agencyConfig } = useApp();

  const [amount, setAmount] = useState<number>(tenant.monthlyRent || 0);
  const [paymentMethod, setPaymentMethod] = useState('Virement bancaire');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Veuillez spécifier un montant positif.');
      return;
    }

    recordRentPayment(tenant.id, Number(amount), paymentMethod);
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
            <h3 className="text-sm font-bold text-slate-900">Encaisser loyer</h3>
            <p className="text-xs text-slate-500">{tenant.fullName}</p>
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
            <h4 className="text-sm font-bold text-slate-900">Loyer encaissé avec succès !</h4>
            <p className="text-xs text-slate-500">
              Le paiement de {formatPrice(amount)} a été enregistré et la quittance est prête.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Bien :</span>
                <span className="font-semibold text-slate-900">{tenant.propertyName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Loyer contractuel :</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(tenant.monthlyRent || 0)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Montant encaissé ({agencyConfig.currency}) *
              </label>
              <input
                type="number"
                required
                min="1000"
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
                <option value="T-Money (Togo)">T-Money (Togo)</option>
                <option value="Moov Flooz (Togo)">Moov Flooz (Togo)</option>
                <option value="Espèces en agence">Espèces en agence</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              💡 L'enregistrement régularise le locataire, crédite le compte du bailleur et génère la quittance officielle.
            </p>

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
                Valider encaissement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
