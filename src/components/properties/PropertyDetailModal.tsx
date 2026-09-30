import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building,
  BedDouble,
  Bath,
  Maximize2,
  Users2,
  KeyRound,
  FileText,
  Wrench,
  Receipt,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onEdit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onEdit,
}) => {
  const {
    formatPrice,
    deleteProperty,
    owners,
    tenants,
    transactions,
    maintenanceTickets,
    documents,
  } = useApp();

  const [activeTab, setActiveSubTab] = useState<'info' | 'finance' | 'maintenance' | 'docs'>('info');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const owner = owners.find((o) => o.id === property.ownerId);
  const tenant = tenants.find((t) => t.id === property.currentTenantId);

  const propTransactions = transactions.filter((t) => t.propertyId === property.id);
  const propTickets = maintenanceTickets.filter((m) => m.propertyId === property.id);
  const propDocs = documents.filter((d) => d.propertyId === property.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Occupé':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Disponible':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'En maintenance':
      case 'En rénovation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {property.ref}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(
                  property.status
                )}`}
              >
                {property.status}
              </span>
              <span className="text-[11px] text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                {property.type}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {property.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {property.address}, {property.neighborhood}, {property.city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(property)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modifier</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`Confirmez-vous la suppression de ${property.name} ?`)) {
                  deleteProperty(property.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Supprimer ce bien"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Sub-tabs */}
        <div className="flex items-center gap-4 px-5 border-b border-slate-100 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('info')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fiche & Galerie
          </button>
          <button
            onClick={() => setActiveSubTab('finance')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'finance'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Finances ({propTransactions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('maintenance')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'maintenance'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Travaux ({propTickets.length})
          </button>
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'docs'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Documents ({propDocs.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'info' && (
            <div className="space-y-5">
              {/* Photo Showcase */}
              {property.photos && property.photos.length > 0 && (
                <div className="space-y-2">
                  <div className="h-56 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <img
                      src={property.photos[activePhotoIdx] || property.photos[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {property.photos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {property.photos.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`h-12 w-20 shrink-0 rounded-lg overflow-hidden border transition-all ${
                            activePhotoIdx === idx
                              ? 'border-slate-900 ring-1 ring-slate-900'
                              : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={p} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Superficie
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {property.surface} m²
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Chambres
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {property.bedrooms > 0 ? `${property.bedrooms} ch.` : 'Plateau'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Salles d'eau
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {property.bathrooms} sdb
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Loyer mensuel
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {formatPrice(property.monthlyRent)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700">Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700">Équipements</h4>
                <div className="flex flex-wrap gap-1.5">
                  {property.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stakeholders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-medium">Propriétaire bailleur :</div>
                  <div className="font-bold text-slate-900 text-sm">{property.ownerName}</div>
                  {owner && (
                    <div className="text-slate-600 text-[11px]">
                      {owner.phone} • {owner.city}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-medium">Locataire actuel :</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {property.currentTenantName || 'Aucun (vacant)'}
                  </div>
                  {tenant && (
                    <div className="text-slate-600 text-[11px]">
                      Bail jusqu'au {tenant.leaseEndDate} • {tenant.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Écritures financières liées</h4>
              {propTransactions.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucune transaction enregistrée.</p>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {propTransactions.map((trx) => (
                    <div key={trx.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{trx.category}</div>
                        <div className="text-slate-500 text-[11px]">
                          {trx.date} • {trx.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">
                          {formatPrice(trx.amount)}
                        </span>
                        <span className="text-[10px] text-slate-500">{trx.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Interventions techniques</h4>
              {propTickets.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucun ticket technique.</p>
              ) : (
                <div className="space-y-2">
                  {propTickets.map((t) => (
                    <div key={t.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{t.problemTitle}</span>
                        <span className="text-[10px] uppercase font-semibold text-slate-600">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{t.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Documents rattachés</h4>
              {propDocs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucun document rattaché.</p>
              ) : (
                <div className="space-y-2">
                  {propDocs.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900">{doc.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{doc.dateAdded}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
