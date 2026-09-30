import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  FileText,
  FileCheck,
  Building2,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentType } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, properties, addDocument, deleteDocument, globalSearch } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DocumentType>('bail');
  const [newCategory, setNewCategory] = useState('Contrats de bail');
  const [newPropertyId, setNewPropertyId] = useState(properties[0]?.id || '');

  const effectiveSearch = searchTerm || globalSearch;

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      d.ref.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (d.propertyName && d.propertyName.toLowerCase().includes(effectiveSearch.toLowerCase())) ||
      (d.ownerName && d.ownerName.toLowerCase().includes(effectiveSearch.toLowerCase()));

    const matchType = typeFilter === 'all' || d.type === typeFilter;

    return matchSearch && matchType;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const prop = properties.find((p) => p.id === newPropertyId);

    addDocument({
      title: newTitle,
      type: newType,
      category: newCategory,
      propertyId: prop?.id,
      propertyName: prop?.name,
      ownerId: prop?.ownerId,
      ownerName: prop?.ownerName,
      fileSize: '1.4 Mo',
      fileType: 'PDF',
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16">
      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher document, bien..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'bail', label: 'Baux' },
              { id: 'quittance', label: 'Quittances' },
              { id: 'titre_foncier', label: 'Titres fonciers' },
              { id: 'devis', label: 'Devis & Travaux' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  typeFilter === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter document</span>
        </button>
      </div>

      {/* Structured Document Table as requested */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nom du document</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Associé à</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Taille</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Nom */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900 line-clamp-1">{doc.title}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4 capitalize text-slate-600">
                    {doc.type.replace('_', ' ')}
                  </td>

                  {/* Associé à */}
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {doc.propertyName || doc.ownerName || '-'}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {doc.dateAdded}
                  </td>

                  {/* Taille */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {doc.fileSize}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => alert(`Consultation : ${doc.title}`)}
                        className="px-2 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium text-[11px]"
                      >
                        Consulter
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer le document ${doc.title} ?`)) {
                            deleteDocument(doc.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Document */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">Ajouter un document</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Titre du document *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Copie Titre Foncier, Bail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Type de document</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DocumentType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                >
                  <option value="bail">Contrat de bail</option>
                  <option value="quittance">Quittance officielle</option>
                  <option value="titre_foncier">Titre foncier</option>
                  <option value="etat_lieux">État des lieux</option>
                  <option value="facture">Facture / Devis</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Bien associé</label>
                <select
                  value={newPropertyId}
                  onChange={(e) => setNewPropertyId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-2xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
