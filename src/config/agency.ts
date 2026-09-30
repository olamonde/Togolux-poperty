import { AgencyConfig, StaffUser } from '../types';

export const DEFAULT_AGENCY_CONFIG: AgencyConfig = {
  companyName: 'TogoLux Properties',
  legalName: 'TogoLux Properties S.A.R.L.',
  brandShort: 'TogoLux',
  tagline: 'Gestion Immobilière Privée & Patrimoine d’Exception',
  primaryColor: '#0F172A', // Slate 900
  secondaryColor: '#D97706', // Amber 600 / Warm Gold
  currency: 'FCFA',
  currencySymbol: 'F CFA',
  contactPhone: '+228 90 24 55 60',
  contactEmail: 'direction@togolux-properties.com',
  address: '145 Boulevard de la Marina, Immeuble Marina Plaza, 4e étage',
  city: 'Lomé',
  country: 'Togo',
  rcm: 'TG-LOM-2021-B-2904',
  nif: '1001594830',
  defaultCommissionRate: 10,
  bankDetails: {
    bankName: 'Ecobank Togo - Agence Principale Lomé',
    iban: 'TG53 TG05 4010 0100 2345 6789 0142',
    bic: 'ECOCTGTG',
    mobileMoneyNumber: '+228 90 24 55 60 (T-Money / Moov Flooz)',
  },
};

export const STAFF_USERS: StaffUser[] = [
  {
    id: 'user-1',
    fullName: 'Koffi Mensah',
    title: 'Directeur Général & Fondateur',
    email: 'k.mensah@togolux-properties.com',
    role: 'admin',
    phone: '+228 90 24 55 01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-2',
    fullName: 'Amina Lawson',
    title: 'Responsable Gestion Locative & Biens',
    email: 'a.lawson@togolux-properties.com',
    role: 'gestionnaire',
    phone: '+228 91 33 44 12',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-3',
    fullName: 'Kodjo Agbeko',
    title: 'Responsable Financier & Comptable',
    email: 'k.agbeko@togolux-properties.com',
    role: 'comptable',
    phone: '+228 92 11 88 45',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

/**
 * Format currency amount into clean FCFA string: e.g. "1 250 000 FCFA"
 */
export function formatCurrency(amount: number, symbol: string = 'FCFA'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `0 ${symbol}`;
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${symbol}`;
}
