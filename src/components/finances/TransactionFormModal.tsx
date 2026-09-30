import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';

interface TransactionFormModalProps {
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ onClose }) => {
  const { addTransaction, properties, owners, agencyConfig } = useApp();

  const [type, setType] = useState<TransactionType>('depense_travaux');
  const [category, setCategory] = useState('Entretien & Réparations');
  const [amount, setAmount] = useState<number>(85000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [ownerId, setOwnerId] = useState(owners[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('Virement bancaire');
  const [description, setDescription] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'loyer') {
      setCategory('Encaissement Loyer');
    } else if (newType === 'depense_travaux') {
      setCategory('Entretien & Réparations');
    } else if (newType === 'commission_agence') {
      setCategory('Honoraires Gestion');
    } else if (newType === 'reversement_proprietaire') {
      setCategory('Virement Propriétaire');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description.trim()) {
      alert('Veuillez renseigner un montant valide et une description.');
      return;
    }

    const prop = properties.find((p) => p.id === propertyId);
    const owner = owners.find((o) => o.id === ownerId || o.id === prop?.ownerId);

    addTransaction({
      type,
      category,
      amount: Number(amount),
      date,
      propertyId: prop?.id,
      propertyName: prop?.name,
      ownerId: owner?.id,
      ownerName: owner?.fullName,
      status: 'payé',
      paymentMethod,
      description,
      receiptNumber: receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">Nouvelle écriture financière</h2>
            <p className="text-xs text-slate-500">Enregistrement au grand livre de l'agence</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Type d'opération *</label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="depense_travaux">Dépense / Travaux d'entretien</option>
                <option value="loyer">Encaissement de Loyer</option>
                <option value="commission_agence">Honoraires de gestion agence</option>
                <option value="reversement_proprietaire">Reversement au propriétaire</option>
                <option value="charge_locative">Charges / Gardiennage</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Catégorie *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Montant ({agencyConfig.currency}) *
              </label>
              <input
                type="number"
                required
                min="500"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Bien concerné</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="">-- Aucun particulier --</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Propriétaire</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="">-- Aucun particulier --</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Mode de règlement</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="T-Money">T-Money</option>
                <option value="Moov Flooz">Moov Flooz</option>
                <option value="Espèces">Espèces en caisse</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                N° de facture / Justificatif
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Ex : FAC-2026-489"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez la nature de la dépense ou de l'encaissement..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-2xs"
            >
              Enregistrer l'opération
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
