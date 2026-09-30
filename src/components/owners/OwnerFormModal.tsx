import React, { useState } from 'react';
import { X, Users2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Owner } from '../../types';

interface OwnerFormModalProps {
  initialOwner?: Owner;
  onClose: () => void;
}

export const OwnerFormModal: React.FC<OwnerFormModalProps> = ({
  initialOwner,
  onClose,
}) => {
  const { addOwner, updateOwner, agencyConfig } = useApp();

  const [fullName, setFullName] = useState(initialOwner?.fullName || '');
  const [company, setCompany] = useState(initialOwner?.company || '');
  const [phone, setPhone] = useState(initialOwner?.phone || '+228 ');
  const [email, setEmail] = useState(initialOwner?.email || '');
  const [country, setCountry] = useState(initialOwner?.country || agencyConfig.country);
  const [city, setCity] = useState(initialOwner?.city || agencyConfig.city);
  const [address, setAddress] = useState(initialOwner?.address || '');
  const [bankName, setBankName] = useState(
    initialOwner?.bankDetails?.bankName || 'Ecobank Togo'
  );
  const [accountNumber, setAccountNumber] = useState(
    initialOwner?.bankDetails?.accountNumber || ''
  );
  const [mobileMoney, setMobileMoney] = useState(
    initialOwner?.bankDetails?.mobileMoney || ''
  );
  const [notes, setNotes] = useState(initialOwner?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      alert('Veuillez renseigner le nom complet, le téléphone et l’adresse email.');
      return;
    }

    if (initialOwner) {
      updateOwner(initialOwner.id, {
        fullName,
        company,
        phone,
        email,
        country,
        city,
        address,
        bankDetails: {
          bankName,
          accountNumber,
          mobileMoney,
        },
        notes,
      });
    } else {
      addOwner({
        fullName,
        company,
        phone,
        email,
        country,
        city,
        address,
        propertyIds: [],
        bankDetails: {
          bankName,
          accountNumber,
          mobileMoney,
        },
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialOwner ? 'Modifier propriétaire' : 'Nouveau propriétaire bailleur'}
            </h2>
            <p className="text-xs text-slate-500">Dossier mandat de gestion TogoLux</p>
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
              <label className="text-slate-700 font-medium block mb-1">Nom complet *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex : M. Jean-Luc Amégavi"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Société / Holding</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex : Amégavi Holdings"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Téléphone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+228 90 00 00 00"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bailleur@exemple.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Pays</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex : Boulevard de la Marina"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-700 block">
              Coordonnées bancaires pour reversement
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Banque</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ecobank, Orabank..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">RIB / N° de compte</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="TG024 01001..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white font-mono text-[11px]"
                />
              </div>
            </div>
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
              {initialOwner ? 'Enregistrer' : 'Créer propriétaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
