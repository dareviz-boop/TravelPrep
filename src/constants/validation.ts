/**
 * Validation constants and limits
 */

export const LIMITS = {
  countries: {
    default: 3,
    multiDestinations: 10,
  },
  children: {
    min: 1,
    max: 99,
  },
  climateConditions: {
    max: 5,
  },
  temperatures: {
    max: 5,
  },
} as const;

export const DATE_LIMITS = {
  maxDate: new Date('9999-12-31'),
  midnightHours: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
  tomorrowOffset: 1, // days
} as const;

export const DURATION_THRESHOLDS = {
  veryLong: 90, // days
} as const;

export const PATTERNS = {
  email: /^\S+@\S+\.\S+$/,
  delayPrefix: 'J-',
  delaySuffix: 'J+',
} as const;

export const ESSENTIAL_SECTIONS = ['documents', 'finances', 'sante'] as const;

export const SPECIAL_CONDITIONS = {
  none: 'climat_aucune',
  unknown: 'inconnue',
} as const;

export const SPECIAL_LOCATIONS = {
  multiDestinations: 'multi-destinations',
  multiHemisphere: ['multi-destinations', 'amerique-centrale-caraibes'],
} as const;
