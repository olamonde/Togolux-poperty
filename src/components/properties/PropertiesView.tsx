import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyStatus, PropertyType } from '../../types';

interface PropertiesViewProps {
  onOpenDetail: (property: Property) => void;
  onOpenNewProperty: () => void;
  onEditProperty: (property: Property) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  onOpenDetail,
  onOpenNewProperty,
  onEditProperty,
}) => {
  const { properties, formatPrice, globalSearch, setGlobalSearch } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const effectiveSearch = searchTerm || globalSearch;

  // Filter properties
  const filtered = properties.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (p.ref || p.reference || '').toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (p.ownerName || '').toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (p.currentTenantName && p.currentTenantName.toLowerCase().includes(effectiveSearch.toLowerCase()));

    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchType = typeFilter === 'all' || p.type === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'Occupé':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Disponible':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'En maintenance':
      case 'En rénovation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Vendu':
      case 'Archivé':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16">
      {/* Controls & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer par nom, quartier..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Status chips */}
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs">
            {['all', 'Disponible', 'Occupé', 'En maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'Tous' : st}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-400"
          >
            <option value="all">Tous les types</option>
            <option value="villa">Villas</option>
            <option value="appartement">Appartements</option>
            <option value="duplex">Duplex</option>
            <option value="bureau">Bureaux</option>
          </select>
        </div>

        {/* Right: Add button */}
        <button
          onClick={onOpenNewProperty}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un bien</span>
        </button>
      </div>

      {/* Counter */}
      <div className="text-xs text-slate-500 px-1">
        Affichage de <b>{filtered.length}</b> bien(s) sous mandat
      </div>

      {/* Clean Professional Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bien</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Propriétaire</th>
                <th className="py-3 px-4">Locataire</th>
                <th className="py-3 px-4 text-right">Loyer mensuel</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Bien name & address */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onOpenDetail(prop)}
                      className="font-semibold text-slate-900 hover:text-amber-700 text-left block line-clamp-1"
                    >
                      {prop.name}
                    </button>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="font-mono text-slate-500">{prop.ref}</span>
                      <span>•</span>
                      <span>{prop.neighborhood}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 capitalize text-slate-600">
                    {prop.type} ({prop.surface} m²)
                  </td>

                  {/* Propriétaire */}
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {prop.ownerName}
                  </td>

                  {/* Locataire */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {prop.currentTenantName || (
                      <span className="text-slate-400 italic">Aucun (vacant)</span>
                    )}
                  </td>

                  {/* Loyer */}
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900 tabular-nums">
                    {formatPrice(prop.monthlyRent)}
                  </td>

                  {/* Statut Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(
                        prop.status
                      )}`}
                    >
                      {prop.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenDetail(prop)}
                        className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium text-[11px]"
                      >
                        Consulter
                      </button>
                      <button
                        onClick={() => onEditProperty(prop)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="p-10 bg-white border border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-xs text-slate-500">Aucun bien ne correspond aux filtres.</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchTerm('');
            }}
            className="text-xs text-slate-900 underline font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
