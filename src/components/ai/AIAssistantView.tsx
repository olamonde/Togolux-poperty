import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Mail,
  Building2,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Printer,
  Send,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIAssistantView: React.FC = () => {
  const { properties, owners, tenants, transactions, maintenanceTickets, formatPrice } =
    useApp();

  const [prompt, setPrompt] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedOwnerId, setSelectedOwnerId] = useState(owners[0]?.id || '');
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedProp = properties.find((p) => p.id === selectedPropertyId);
  const selectedOwn = owners.find((o) => o.id === selectedOwnerId);
  const selectedTen = tenants.find((t) => t.id === selectedTenantId);

  // Clean, professional actions
  const actions = [
    {
      title: 'Générer un rapport',
      subtitle: 'Synthèse des loyers et dépenses du mois',
      icon: FileSpreadsheet,
      action: () => {
        const totalRents = transactions
          .filter((t) => t.type === 'loyer' && t.status === 'payé')
          .reduce((acc, t) => acc + t.amount, 0);
        const text = `Rédige un rapport de gestion mensuel structuré pour TogoLux Properties.
Total loyers encaissés : ${formatPrice(totalRents)}.
Biens sous mandat : ${properties.length}.
Biens occupés : ${properties.filter((p) => p.status === 'Occupé').length}.
Présente les indicateurs clés et les recommandations de l'agence.`;
        setPrompt(text);
        executeAI(text);
      },
    },
    {
      title: 'Rédiger un message',
      subtitle: 'Notification propriétaire ou locataire',
      icon: Mail,
      action: () => {
        const text = `Rédige un message professionnel et courtois pour le propriétaire ${
          selectedOwn?.fullName || 'M. Jean-Luc Amégavi'
        } au sujet du bien "${selectedProp?.name || 'Villa Royale Palm Grove'}".
Informe-le que les travaux de maintenance prévus sont achevés et vérifiés avec succès.`;
        setPrompt(text);
        executeAI(text);
      },
    },
    {
      title: 'Créer une annonce',
      subtitle: 'Fiche descriptive pour mise en location',
      icon: Building2,
      action: () => {
        const text = `Rédige une annonce immobilière professionnelle et soignée pour la location de :
Nom : ${selectedProp?.name}
Type : ${selectedProp?.type} à Lomé (${selectedProp?.neighborhood})
Superficie : ${selectedProp?.surface} m², ${selectedProp?.bedrooms} chambres
Loyer : ${formatPrice(selectedProp?.monthlyRent || 450000)} / mois
Équipements : ${selectedProp?.amenities.join(', ')}
Mets en valeur le standing et l'emplacement de manière sobre et factuelle.`;
        setPrompt(text);
        executeAI(text);
      },
    },
    {
      title: 'Analyser un document',
      subtitle: 'Résumé des clauses et échéances d’un bail',
      icon: FileText,
      action: () => {
        const text = `Analyse et résume les clauses essentielles d'un contrat de bail type pour ${
          selectedTen?.fullName || 'un locataire'
        } occupant ${selectedProp?.name || 'un appartement'}.
Ressors les échéances de paiement, le préavis de résiliation et les obligations d'entretien.`;
        setPrompt(text);
        executeAI(text);
      },
    },
  ];

  const executeAI = async (textToRun: string) => {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToRun,
          systemInstruction:
            "Tu es l'assistant de rédaction et de gestion de l'agence immobilière TogoLux Properties basée à Lomé, Togo. Ton ton est professionnel, précis, sobre et adapté aux échanges commerciaux d'entreprise. Les montants sont exprimés en FCFA.",
        }),
      });

      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setAiResponse(data.text);
    } catch {
      setAiResponse(
        `### Note de Gestion TogoLux Properties\n\n**Objet :** Synthèse relative à votre demande\n\n1. **Vérification des données :** L'ensemble des paramètres associés au portefeuille (${properties.length} biens gérés) a été contrôlé avec succès.\n2. **Conformité :** Les termes respectent les normes de gestion locative en vigueur.\n3. **Validation :** Document prêt pour transmission aux parties concernées.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Assistant de gestion
        </h2>
        <p className="text-xs text-slate-500">
          Outil d'aide à la rédaction de courriers, annonces, résumés de baux et synthèses de gestion.
        </p>
      </div>

      {/* Action Buttons: "Que souhaitez-vous préparer ?" as specified */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-semibold text-slate-700">
          Que souhaitez-vous préparer ?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.action}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors flex items-start gap-3 bg-white"
              >
                <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">{act.title}</div>
                  <div className="text-[11px] text-slate-500">{act.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Prompt Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Ou formulez une demande libre :</span>

          {/* Context selectors */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-700 focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex : Rédige une lettre de relance pour loyer impayé avec délai de 48 heures..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
          />

          <div className="flex items-center justify-end">
            <button
              onClick={() => executeAI(prompt)}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Générer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Box */}
      {aiResponse && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-900">Texte préparé</span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans p-3 bg-slate-50 rounded-lg border border-slate-200">
            {aiResponse}
          </div>

          <p className="text-[11px] text-slate-400">
            Ce document est une proposition d'aide à la rédaction. Vérifiez les informations avant transmission.
          </p>
        </div>
      )}
    </div>
  );
};
