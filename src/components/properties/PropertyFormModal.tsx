import React, { useState } from 'react';
import { X, Building2, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, PropertyStatus } from '../../types';

interface PropertyFormModalProps {
  initialProperty?: Property;
  onClose: () => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  initialProperty,
  onClose,
}) => {
  const { addProperty, updateProperty, owners, agencyConfig } = useApp();

  const [name, setName] = useState(initialProperty?.name || '');
  const [type, setType] = useState<PropertyType>(initialProperty?.type || 'appartement');
  const [address, setAddress] = useState(initialProperty?.address || '');
  const [neighborhood, setNeighborhood] = useState(initialProperty?.neighborhood || 'Lomé 2');
  const [city, setCity] = useState(initialProperty?.city || agencyConfig.city);
  const [country, setCountry] = useState(initialProperty?.country || agencyConfig.country);
  const [description, setDescription] = useState(initialProperty?.description || '');
  const [surface, setSurface] = useState<number>(initialProperty?.surface || 120);
  const [bedrooms, setBedrooms] = useState<number>(initialProperty?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState<number>(initialProperty?.bathrooms || 2);
  const [livingRooms, setLivingRooms] = useState<number>(initialProperty?.livingRooms || 1);
  const [monthlyRent, setMonthlyRent] = useState<number>(initialProperty?.monthlyRent || 450000);
  const [chargesAmount, setChargesAmount] = useState<number>(initialProperty?.chargesAmount || 30000);
  const [depositAmount, setDepositAmount] = useState<number>(
    initialProperty?.depositAmount || 1350000
  );
  const [status, setStatus] = useState<PropertyStatus>(initialProperty?.status || 'Disponible');
  const [ownerId, setOwnerId] = useState(initialProperty?.ownerId || (owners[0]?.id ?? ''));
  const [commissionRate, setCommissionRate] = useState<number>(
    initialProperty?.commissionRate || agencyConfig.defaultCommissionRate
  );

  const [amenities, setAmenities] = useState<string[]>(
    initialProperty?.amenities || [
      'Climatisation split',
      'Groupe électrogène',
      'Forage eau',
      'Gardiennage 24/7',
      'Parking intérieur',
    ]
  );
  const [newAmenity, setNewAmenity] = useState('');

  const [photos, setPhotos] = useState<string[]>(
    initialProperty?.photos || [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ]
  );
  const [photoInput, setPhotoInput] = useState('');

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setPhotos([...photos, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !ownerId) {
      alert('Veuillez remplir les champs obligatoires (Nom, Adresse, Propriétaire).');
      return;
    }

    const selectedOwner = owners.find((o) => o.id === ownerId);
    const ownerName = selectedOwner?.fullName || 'Propriétaire Inconnu';

    if (initialProperty) {
      updateProperty(initialProperty.id, {
        name,
        type,
        address,
        neighborhood,
        city,
        country,
        description,
        surface: Number(surface),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        livingRooms: Number(livingRooms),
        monthlyRent: Number(monthlyRent),
        chargesAmount: Number(chargesAmount),
        depositAmount: Number(depositAmount),
        status,
        ownerId,
        ownerName,
        commissionRate: Number(commissionRate),
        amenities,
        photos,
      });
    } else {
      addProperty({
        name,
        type,
        address,
        neighborhood,
        city,
        country,
        description,
        surface: Number(surface),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        livingRooms: Number(livingRooms),
        monthlyRent: Number(monthlyRent),
        chargesAmount: Number(chargesAmount),
        depositAmount: Number(depositAmount),
        status,
        ownerId,
        ownerName,
        commissionRate: Number(commissionRate),
        amenities,
        photos,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialProperty ? 'Modifier le bien' : 'Nouveau bien immobilier'}
            </h2>
            <p className="text-xs text-slate-500">
              Enregistrement dans le portefeuille de l'agence
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Nom du bien *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Villa Royale Palm Grove"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Type de bien</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="villa">Villa</option>
                <option value="appartement">Appartement</option>
                <option value="duplex">Duplex</option>
                <option value="bureau">Bureau / Tertiaire</option>
                <option value="commercial">Local Commercial</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Adresse *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex : Rue de la Paix"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Quartier *</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex : Lomé 2, Tokoin..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Superficie (m²)</label>
              <input
                type="number"
                min="1"
                value={surface}
                onChange={(e) => setSurface(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Statut initial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="Disponible">Disponible</option>
                <option value="Occupé">Occupé</option>
                <option value="En maintenance">En maintenance</option>
                <option value="En rénovation">En rénovation</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Loyer mensuel ({agencyConfig.currency}) *
              </label>
              <input
                type="number"
                required
                step="5000"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Propriétaire mandant *
              </label>
              <select
                required
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.fullName} ({o.ref})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentation générale du bien..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs"
            >
              {initialProperty ? 'Enregistrer' : 'Créer le bien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
