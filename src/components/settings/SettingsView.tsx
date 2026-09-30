import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Database,
  RefreshCw,
  Server,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    agencyConfig,
    updateAgencyConfig,
    resetAgencyConfig,
    staffUsers,
    currentUser,
    isFirestoreConnected,
    reseedFirestore,
    properties,
    owners,
    tenants,
    contracts,
    transactions,
    maintenanceTickets,
    documents,
    reports,
  } = useApp();

  const [companyName, setCompanyName] = useState(agencyConfig.companyName);
  const [legalName, setLegalName] = useState(agencyConfig.legalName);
  const [brandShort, setBrandShort] = useState(agencyConfig.brandShort);
  const [tagline, setTagline] = useState(agencyConfig.tagline);
  const [currency, setCurrency] = useState(agencyConfig.currency);
  const [currencySymbol, setCurrencySymbol] = useState(agencyConfig.currencySymbol);
  const [contactPhone, setContactPhone] = useState(agencyConfig.contactPhone);
  const [contactEmail, setContactEmail] = useState(agencyConfig.contactEmail);
  const [address, setAddress] = useState(agencyConfig.address);
  const [city, setCity] = useState(agencyConfig.city);
  const [country, setCountry] = useState(agencyConfig.country);
  const [rcm, setRcm] = useState(agencyConfig.rcm);
  const [nif, setNif] = useState(agencyConfig.nif);
  const [defaultCommissionRate, setDefaultCommissionRate] = useState(
    agencyConfig.defaultCommissionRate
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleResyncFirestore = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await reseedFirestore(true);
      setSyncFeedback(res.message);
    } catch (err) {
      setSyncFeedback(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyConfig({
      companyName,
      legalName,
      brandShort,
      tagline,
      currency,
      currencySymbol,
      contactPhone,
      contactEmail,
      address,
      city,
      country,
      rcm,
      nif,
      defaultCommissionRate: Number(defaultCommissionRate),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetToTogoLux = () => {
    if (confirm('Restaurer les paramètres d’origine de TogoLux Properties ?')) {
      resetAgencyConfig();
      setCompanyName('TogoLux Properties');
      setLegalName('TogoLux Properties S.A.R.L.');
      setBrandShort('TogoLux');
      setTagline('Gestion Immobilière Privée & Patrimoine d’Exception');
      setCurrency('FCFA');
      setCurrencySymbol('F CFA');
      setContactPhone('+228 90 24 55 60');
      setContactEmail('direction@togolux-properties.com');
      setCity('Lomé');
      setCountry('Togo');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Paramètres de l'entreprise
          </h2>
          <p className="text-xs text-slate-500">
            Identité visuelle, devise et coordonnées de l'agence.
          </p>
        </div>

        <button
          onClick={handleResetToTogoLux}
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Restaurer TogoLux</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Modifications enregistrées avec succès. L'ensemble du logiciel s'est actualisé.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Brand identity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            1. Identité commerciale
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Nom de l'agence *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Badge court *</label>
              <input
                type="text"
                required
                value={brandShort}
                onChange={(e) => setBrandShort(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Raison sociale légale</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-slate-600 font-medium block mb-1">Slogan</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Commission */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            2. Devise & Taux de gestion
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Devise principale *</label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Symbole affiché</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">
                Taux de gestion par défaut (%)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={defaultCommissionRate}
                onChange={(e) => setDefaultCommissionRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            3. Siège & Coordonnées
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Téléphone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Pays</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-600 font-medium block mb-1">Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Staff Profiles (Internal accounts) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4. Collaborateurs internes ({staffUsers.length})
            </h3>
            <span className="text-[11px] text-slate-500">Accès logiciel interne</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {staffUsers.map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2.5 text-xs"
              >
                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{u.fullName}</div>
                  <div className="text-[11px] text-slate-500 truncate capitalize">{u.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Base de Données & Sécurité Cloud Firestore */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  5. Base de Données & Architecture Relationnelle (Cloud Firestore)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Couche persistante sécurisée ABAC, collections synchronisées et traçabilité d'audit.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Firestore Connecté</span>
              </span>

              <button
                type="button"
                onClick={handleResyncFirestore}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Réinitialiser et peupler toutes les collections relationnelles Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser Firestore'}</span>
              </button>
            </div>
          </div>

          {syncFeedback && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Counts metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Biens (properties)</span>
              <span className="text-base font-bold text-slate-900">{properties.length}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Bailleurs (owners)</span>
              <span className="text-base font-bold text-slate-900">{owners.length}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Baux (contracts)</span>
              <span className="text-base font-bold text-slate-900">{contracts.length}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Paiements / Reçus</span>
              <span className="text-base font-bold text-slate-900">{transactions.length}</span>
            </div>
          </div>

          {/* Matrice des rôles */}
          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800">Matrice de contrôle d'accès (RBAC / ABAC) :</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="font-semibold text-slate-900">Admin & Manager :</span>
                <p className="text-slate-500">Accès total aux biens, bailleurs, baux, locataires, maintenance, documents et finances.</p>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="font-semibold text-slate-900">Comptable (Accountant) :</span>
                <p className="text-slate-500">Gestion des encaissements de loyer, dépenses, reversements propriétaires et rapports.</p>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="font-semibold text-slate-900">Agent Terrain :</span>
                <p className="text-slate-500">Gestion opérationnelle des biens, locataires, interventions et consultation des tiers.</p>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="font-semibold text-slate-900">Portail Propriétaire (Owner) :</span>
                <p className="text-slate-500">Isolation stricte : consultation uniquement de ses propres biens, contrats, paiements et travaux.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer les paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
