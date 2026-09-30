import React, { useState } from 'react';
import { X, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceTicket, MaintenancePriority, MaintenanceStatus } from '../../types';

interface MaintenanceModalProps {
  initialTicket?: MaintenanceTicket;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  initialTicket,
  onClose,
}) => {
  const { addMaintenanceTicket, updateMaintenanceTicket, properties, owners, agencyConfig } = useApp();

  const [problemTitle, setProblemTitle] = useState(initialTicket?.problemTitle || '');
  const [description, setDescription] = useState(initialTicket?.description || '');
  const [propertyId, setPropertyId] = useState(initialTicket?.propertyId || properties[0]?.id || '');
  const [category, setCategory] = useState(initialTicket?.category || 'Plomberie');
  const [priority, setPriority] = useState<MaintenancePriority>(
    initialTicket?.priority || 'Moyenne'
  );
  const [status, setStatus] = useState<MaintenanceStatus>(
    initialTicket?.status || 'Nouveau'
  );
  const [contractorName, setContractorName] = useState(
    initialTicket?.contractorName || 'Plomberie Moderne Lomé'
  );
  const [contractorPhone, setContractorPhone] = useState(
    initialTicket?.contractorPhone || '+228 90 00 00 00'
  );
  const [quoteAmount, setQuoteAmount] = useState<number>(initialTicket?.quoteAmount || 45000);
  const [finalCost, setFinalCost] = useState<number | undefined>(initialTicket?.finalCost);
  const [dateScheduled, setDateScheduled] = useState(initialTicket?.dateScheduled || '');
  const [photoBefore, setPhotoBefore] = useState(
    initialTicket?.photoBefore ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  );
  const [photoAfter, setPhotoAfter] = useState(initialTicket?.photoAfter || '');
  const [notes, setNotes] = useState(initialTicket?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim() || !propertyId) {
      alert('Veuillez renseigner le titre du problème et sélectionner le bien.');
      return;
    }

    const prop = properties.find((p) => p.id === propertyId);
    const owner = owners.find((o) => o.id === prop?.ownerId);

    if (initialTicket) {
      updateMaintenanceTicket(initialTicket.id, {
        problemTitle,
        description,
        propertyId,
        propertyName: prop?.name || 'Bien Inconnu',
        ownerId: owner?.id || prop?.ownerId || '',
        ownerName: owner?.fullName || prop?.ownerName || '',
        category,
        priority,
        status,
        contractorName,
        contractorPhone,
        quoteAmount: quoteAmount ? Number(quoteAmount) : undefined,
        finalCost: finalCost ? Number(finalCost) : undefined,
        dateScheduled,
        dateResolved: status === 'Terminé' ? new Date().toISOString().split('T')[0] : undefined,
        photoBefore,
        photoAfter,
        notes,
      });
    } else {
      addMaintenanceTicket({
        problemTitle,
        description,
        propertyId,
        propertyName: prop?.name || 'Bien Inconnu',
        ownerId: owner?.id || prop?.ownerId || '',
        ownerName: owner?.fullName || prop?.ownerName || '',
        category,
        priority,
        status,
        contractorName,
        contractorPhone,
        quoteAmount: quoteAmount ? Number(quoteAmount) : undefined,
        finalCost: finalCost ? Number(finalCost) : undefined,
        dateScheduled,
        photoBefore,
        photoAfter,
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialTicket ? 'Modifier le ticket d’intervention' : 'Nouveau ticket de maintenance'}
            </h2>
            <p className="text-xs text-slate-500">Suivi technique et prestataires</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          <div>
            <label className="text-slate-700 font-medium block mb-1">
              Titre du problème *
            </label>
            <input
              type="text"
              required
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="Ex : Réparation climatiseur split séjour"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Bien concerné *</label>
              <select
                required
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="Plomberie">Plomberie</option>
                <option value="Électricité & Climatisation">Électricité & Climatisation</option>
                <option value="Gros œuvre / Toiture">Gros œuvre / Toiture</option>
                <option value="Peinture / Finitions">Peinture / Finitions</option>
                <option value="Sécurité & Incendie">Sécurité & Incendie</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="Nouveau">Nouveau</option>
                <option value="À valider">À valider (Devis)</option>
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails techniques du dysfonctionnement..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Prestataire / Artisan</label>
              <input
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Coût / Devis ({agencyConfig.currency})
              </label>
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
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
              {initialTicket ? 'Enregistrer' : 'Créer le ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
