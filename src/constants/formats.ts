/**
 * Format constants for labels, displays, and translations
 */

export const DURATION_LABELS = {
  court: 'Courte (moins d\'une semaine)',
  moyen: 'Moyenne (1 à 2 semaines)',
  long: 'Longue (1 à 3 mois)',
  'tres-long': 'Très longue (plus de 3 mois)',
} as const;

export const DURATION_LABELS_SHORT = {
  court: '≤ 7 jours',
  moyen: '8-29 jours',
  long: '30-90 jours',
  'tres-long': '> 90 jours',
} as const;

export const DURATION_ESTIMATES = {
  court: 'entre 1 & 7 jours',
  moyen: 'entre 8 & 29 jours',
  long: 'entre 30 & 90 jours',
  'tres-long': 'plus de 90 jours',
} as const;

export const DURATION_VALUES = ['court', 'moyen', 'long', 'tres-long'] as const;

export const AGE_GROUPS = {
  '0-2-ans': '0-2 ans',
  '3-5-ans': '3-5 ans',
  '6-12-ans': '6-12 ans',
  '13+-ans': '13+ ans',
} as const;

export const AGE_GROUP_VALUES = ['0-2-ans', '3-5-ans', '6-12-ans', '13+-ans'] as const;

export const TEMPERATURE_ALL = [
  'tres-froide',
  'froide',
  'temperee',
  'chaude',
  'tres-chaude',
] as const;

export const SEASON_ALL = ['ete', 'hiver', 'printemps', 'automne'] as const;

export const PRIORITY_LABELS = {
  high: 'Fortement recommandé',
  medium: 'Recommandé',
  low: 'Optionnel',
} as const;

export const LOCALE_FR = 'fr-FR' as const;

export const STEP_TITLES = [
  'Destination',
  'Informations',
  'Activités',
  'Profil',
  'Récapitulatif',
  'Checkout',
] as const;
