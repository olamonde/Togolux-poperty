import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Building2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceTicket, MaintenanceStatus, MaintenancePriority } from '../../types';

interface MaintenanceViewProps {
  onOpenNewTicket: () => void;
  onEditTicket: (ticket: MaintenanceTicket) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  onOpenNewTicket,
  onEditTicket,
}) => {
  const { maintenanceTickets, formatPrice, globalSearch } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  const effectiveSearch = searchTerm || globalSearch;

  const filteredTickets = maintenanceTickets.filter((t) => {
    const matchSearch =
      (t.problemTitle || t.title || '').toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (t.propertyName || '').toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (t.contractorName && t.contractorName.toLowerCase().includes(effectiveSearch.toLowerCase()));

    const matchStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getPriorityBadge = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'Urgente':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Haute':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Moyenne':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Terminé':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'En cours':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Planifié':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'À valider':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
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
              placeholder="Rechercher problème, bien, artisan..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
            {['all', 'Nouveau', 'À valider', 'En cours', 'Terminé'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'Tous' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenNewTicket}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau ticket</span>
        </button>
      </div>

      {/* Structured Clean Table as specified */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Problème</th>
                <th className="py-3 px-4">Bien</th>
                <th className="py-3 px-4">Propriétaire</th>
                <th className="py-3 px-4">Prestataire</th>
                <th className="py-3 px-4 text-right">Coût</th>
                <th className="py-3 px-4 text-center">Priorité</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Problème */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="font-semibold text-slate-900 hover:text-amber-700 text-left block line-clamp-1"
                    >
                      {ticket.problemTitle}
                    </button>
                    <span className="text-[11px] text-slate-400 font-mono">{ticket.ref}</span>
                  </td>

                  {/* Bien */}
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {ticket.propertyName}
                  </td>

                  {/* Propriétaire */}
                  <td className="py-3 px-4 text-slate-600">
                    {ticket.ownerName}
                  </td>

                  {/* Prestataire */}
                  <td className="py-3 px-4 text-slate-600">
                    {ticket.contractorName || <span className="text-slate-400 italic">Non assigné</span>}
                  </td>

                  {/* Coût */}
                  <td className="py-3 px-4 text-right font-medium text-slate-900 tabular-nums">
                    {ticket.finalCost
                      ? formatPrice(ticket.finalCost)
                      : ticket.quoteAmount
                      ? formatPrice(ticket.quoteAmount)
                      : '-'}
                  </td>

                  {/* Priorité */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {ticket.dateReported}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-2 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium text-[11px]"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => onEditTicket(ticket)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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

      {/* Ticket Details Lightbox Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  {selectedTicket.ref} • {selectedTicket.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedTicket.problemTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div><b>Bien :</b> {selectedTicket.propertyName}</div>
                <div><b>Propriétaire :</b> {selectedTicket.ownerName}</div>
                <div><b>Prestataire :</b> {selectedTicket.contractorName} ({selectedTicket.contractorPhone || 'N/A'})</div>
                <div><b>Coût estimé / réel :</b> {selectedTicket.quoteAmount ? formatPrice(selectedTicket.quoteAmount) : 'N/A'}</div>
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-1">Description</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Photos Avant / Après */}
              {(selectedTicket.photoBefore || selectedTicket.photoAfter) && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Avant intervention
                    </span>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {selectedTicket.photoBefore ? (
                        <img src={selectedTicket.photoBefore} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 text-[10px] flex items-center justify-center h-full">N/A</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Après intervention
                    </span>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {selectedTicket.photoAfter ? (
                        <img src={selectedTicket.photoAfter} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 text-[10px] flex items-center justify-center h-full">En cours</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const t = selectedTicket;
                  setSelectedTicket(null);
                  onEditTicket(t);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs"
              >
                Modifier le ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
