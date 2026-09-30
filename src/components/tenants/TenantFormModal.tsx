import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant, TenantPaymentStatus } from '../../types';

interface TenantFormModalProps {
  initialTenant?: Tenant;
  onClose: () => void;
}

export const TenantFormModal: React.FC<TenantFormModalProps> = ({
  initialTenant,
  onClose,
}) => {
  const { addTenant, updateTenant, properties, agencyConfig } = useApp();

  const [fullName, setFullName] = useState(initialTenant?.fullName || '');
  const [company, setCompany] = useState(initialTenant?.company || '');
  const [phone, setPhone] = useState(initialTenant?.phone || '+228 ');
  const [email, setEmail] = useState(initialTenant?.email || '');
  const [nationalIdNumber, setNationalIdNumber] = useState(
    initialTenant?.nationalIdNumber || ''
  );
  const [propertyId, setPropertyId] = useState(
    initialTenant?.propertyId || (properties[0]?.id ?? '')
  );

  const selectedProp = properties.find((p) => p.id === propertyId);

  const [monthlyRent, setMonthlyRent] = useState<number>(
    initialTenant?.monthlyRent || (selectedProp?.monthlyRent ?? 450000)
  );
  const [depositPaid, setDepositPaid] = useState<number>(
    initialTenant?.depositPaid || (selectedProp?.depositAmount ?? 1350000)
  );
  const [paymentDayOfMonth, setPaymentDayOfMonth] = useState<number>(
    initialTenant?.paymentDayOfMonth || 5
  );
  const [leaseStartDate, setLeaseStartDate] = useState(
    initialTenant?.leaseStartDate || new Date().toISOString().split('T')[0]
  );
  const [leaseEndDate, setLeaseEndDate] = useState(
    initialTenant?.leaseEndDate ||
      new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [paymentStatus, setPaymentStatus] = useState<TenantPaymentStatus>(
    initialTenant?.paymentStatus || 'A_JOUR'
  );

  const handlePropertyChange = (newPropId: string) => {
    setPropertyId(newPropId);
    const prop = properties.find((p) => p.id === newPropId);
    if (prop) {
      setMonthlyRent(prop.monthlyRent);
      setDepositPaid(prop.depositAmount || prop.monthlyRent * 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !propertyId) {
      alert('Veuillez remplir les informations obligatoires (Nom, Téléphone, Bien).');
      return;
    }

    const prop = properties.find((p) => p.id === propertyId);
    const propertyName = prop?.name || 'Bien Inconnu';

    if (initialTenant) {
      updateTenant(initialTenant.id, {
        fullName,
        company,
        phone,
        email,
        nationalIdNumber,
        propertyId,
        propertyName,
        leaseStartDate,
        leaseEndDate,
        monthlyRent: Number(monthlyRent),
        depositPaid: Number(depositPaid),
        paymentDayOfMonth: Number(paymentDayOfMonth),
        paymentStatus,
      });
    } else {
      addTenant({
        fullName,
        company,
        phone,
        email,
        nationalIdNumber,
        propertyId,
        propertyName,
        leaseStartDate,
        leaseEndDate,
        monthlyRent: Number(monthlyRent),
        depositPaid: Number(depositPaid),
        paymentDayOfMonth: Number(paymentDayOfMonth),
        paymentStatus,
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
              {initialTenant ? 'Modifier locataire' : 'Nouveau locataire & bail'}
            </h2>
            <p className="text-xs text-slate-500">Enregistrement du locataire et des clauses du bail</p>
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
                placeholder="Ex : M. David Kpodar"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Société / Employeur</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex : BOAD, PNUD..."
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
                placeholder="locataire@mail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-medium block mb-1">N° CNI / Passeport *</label>
              <input
                type="text"
                required
                value={nationalIdNumber}
                onChange={(e) => setNationalIdNumber(e.target.value)}
                placeholder="TG-CNI-2022-948291"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-semibold text-slate-700 block">
              Bien loué & Conditions contractuelles
            </span>

            <div>
              <label className="text-slate-600 block mb-1">Bien à attribuer *</label>
              <select
                required
                value={propertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.neighborhood}) - {p.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">
                  Loyer mensuel ({agencyConfig.currency})
                </label>
                <input
                  type="number"
                  required
                  step="5000"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Caution versée</label>
                <input
                  type="number"
                  value={depositPaid}
                  onChange={(e) => setDepositPaid(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Jour d'échéance</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={paymentDayOfMonth}
                  onChange={(e) => setPaymentDayOfMonth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
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
              {initialTenant ? 'Enregistrer' : 'Créer le locataire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
