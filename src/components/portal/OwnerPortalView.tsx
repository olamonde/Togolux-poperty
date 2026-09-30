import React, { useState } from 'react';
import {
  Building2,
  Users2,
  Wallet,
  Receipt,
  Wrench,
  FileText,
  Calendar,
  KeyRound,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Home,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

export const OwnerPortalView: React.FC = () => {
  const {
    owners,
    portalOwnerId,
    setPortalOwnerId,
    properties,
    tenants,
    transactions,
    maintenanceTickets,
    documents,
    formatPrice,
    agencyConfig,
    setCurrentPortalView,
  } = useApp();

  const currentOwner = owners.find((o) => o.id === portalOwnerId) || owners[0];

  // Specific owner properties & data
  const ownerProperties = properties.filter((p) => p.ownerId === currentOwner.id);
  const ownerPropertyIds = ownerProperties.map((p) => p.id);

  const ownerTenants = tenants.filter((t) => t.propertyId && ownerPropertyIds.includes(t.propertyId));
  const occupiedCount = ownerProperties.filter((p) => p.status === 'Occupé').length;

  const ownerTransactions = transactions.filter((t) => t.ownerId === currentOwner.id);

  // Month revenues
  const monthRevenues = ownerTransactions
    .filter((t) => t.type === 'loyer' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthExpenses = ownerTransactions
    .filter((t) => t.type === 'depense_travaux' && t.status === 'payé')
    .reduce((acc, t) => acc + t.amount, 0);

  const ownerTickets = maintenanceTickets.filter((m) =>
    ownerPropertyIds.includes(m.propertyId)
  );

  const ownerDocs = documents.filter(
    (d) => d.ownerId === currentOwner.id || (d.propertyId && ownerPropertyIds.includes(d.propertyId))
  );

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    ownerProperties[0] || null
  );

  const firstName = currentOwner.fullName.replace(/^(M\.|Mme|Dr\.)\s*/, '').split(' ')[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Bar Switcher between owners (for testing/demo) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">Portail Propriétaire Sécurisé</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">Vue client de l'agence {agencyConfig.companyName}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-medium">Bailleur connecté :</label>
          <select
            value={currentOwner.id}
            onChange={(e) => {
              setPortalOwnerId(e.target.value);
              const found = properties.find((p) => p.ownerId === e.target.value);
              setSelectedProperty(found || null);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.fullName} ({o.city})
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentPortalView('agency')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
          >
            Retour Agence
          </button>
        </div>
      </div>

      {/* Greeting and simple stats row */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Bonjour {firstName}
          </h2>
          <p className="text-xs text-slate-600">
            Voici la synthèse de votre portefeuille immobilier géré par {agencyConfig.companyName}.
          </p>
        </div>

        {/* 3 Simple stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Biens en gestion</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {ownerProperties.length}
            </span>
            <span className="text-[11px] text-slate-500">Unités immobilières</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Occupants actuels</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {occupiedCount} / {ownerProperties.length}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Baux actifs</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Revenus encaissés ce mois</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {formatPrice(monthRevenues)}
            </span>
            <span className="text-[11px] text-slate-500">Loyers bruts</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Solde net à vous reverser</span>
            <span className="text-2xl font-bold text-amber-700 mt-1 block">
              {formatPrice(currentOwner.currentBalanceToPayout || 0)}
            </span>
            <span className="text-[11px] text-slate-500">Prêt pour virement</span>
          </div>
        </div>
      </div>

      {/* Main Section: Mes biens */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Mes biens en portefeuille
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ownerProperties.map((prop) => {
            const isSelected = selectedProperty?.id === prop.id;
            return (
              <button
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between space-y-3 bg-white ${
                  isSelected
                    ? 'border-slate-900 ring-1 ring-slate-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-slate-500">
                      {prop.ref}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        prop.status === 'Occupé'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{prop.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {prop.neighborhood}, {prop.city}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between w-full text-xs">
                  <span className="text-slate-500">Loyer mensuel :</span>
                  <span className="font-bold text-slate-900">
                    {formatPrice(prop.monthlyRent)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Property Deep Detail (Occupant, Contrat, Paiements, Travaux, Documents) */}
      {selectedProperty && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500">
                Fiche détaillée du bien sélectionné
              </span>
              <h3 className="text-base font-bold text-slate-900">{selectedProperty.name}</h3>
              <p className="text-xs text-slate-500">
                {selectedProperty.address}, {selectedProperty.neighborhood}, {selectedProperty.city}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">
                Superficie : <b>{selectedProperty.surface} m²</b>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">
                Pièces : <b>{selectedProperty.bedrooms} ch.</b>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Occupant & Contrat */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-700" />
                <span>Occupant actuel & Contrat</span>
              </h4>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                {selectedProperty.currentTenantName ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Locataire :</span>
                      <span className="font-bold text-slate-900">
                        {selectedProperty.currentTenantName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Loyer mensuel perçu :</span>
                      <span className="font-bold text-emerald-800">
                        {formatPrice(selectedProperty.monthlyRent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Caution de garantie :</span>
                      <span className="font-medium text-slate-800">
                        {formatPrice(selectedProperty.depositAmount || selectedProperty.securityDeposit || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Situation financière :</span>
                      <span className="font-semibold text-emerald-700">✓ À jour de règlement</span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic py-2">
                    Bien actuellement vacant. L'agence TogoLux prépare les visites.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Dépenses & Travaux récents */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-slate-700" />
                <span>Interventions & Travaux</span>
              </h4>

              <div className="space-y-2">
                {ownerTickets
                  .filter((t) => t.propertyId === selectedProperty.id)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{ticket.problemTitle}</div>
                        <div className="text-[11px] text-slate-500">
                          {ticket.category} • Prestataire : {ticket.contractorName || 'Assigné'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800 block">
                          {ticket.finalCost
                            ? formatPrice(ticket.finalCost)
                            : ticket.quoteAmount
                            ? formatPrice(ticket.quoteAmount)
                            : '-'}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">{ticket.status}</span>
                      </div>
                    </div>
                  ))}
                {ownerTickets.filter((t) => t.propertyId === selectedProperty.id).length === 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 italic">
                    Aucun incident technique signalé sur ce bien.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Documents & Baux associés */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>Documents, Quittances & Rapports téléchargeables</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ownerDocs
                .filter(
                  (d) =>
                    !d.propertyId ||
                    d.propertyId === selectedProperty.id ||
                    d.ownerId === currentOwner.id
                )
                .slice(0, 4)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 block truncate">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{doc.dateAdded}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Téléchargement sécurisé : ${doc.title}`)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
