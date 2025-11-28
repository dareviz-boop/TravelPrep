/**
 * User-facing messages and text constants
 */

import { LIMITS } from './validation';

export const ERROR_MESSAGES = {
  maxCountriesPerZone: `❌ Vous ne pouvez sélectionner que ${LIMITS.countries.default} pays maximum par zone.`,
  missingNameAndZone: 'Veuillez remplir le nom du voyage et la zone géographique.',
  missingReturnOrDuration: 'Veuillez renseigner la date de retour OU la durée estimée du voyage.',
  missingTemperatureAndSeason: 'Veuillez sélectionner au moins une température et une saison pour votre voyage.',
  exclusiveUnknown: 'L\'option \'Inconnue\' est exclusive et ne peut être sélectionnée avec d\'autres saisons ou températures.',
  missingActivities: 'Veuillez choisir au moins un thème d\'activités pour générer la checklist.',
} as const;

export const PLACEHOLDERS = {
  tripName: 'Ex: Voyage au pays des pandas - 2028',
  firstName: 'Jack',
  lastName: 'Williams',
  email: 'jack.williams@email.com',
} as const;

export const TITLES = {
  app: 'TravelPrep',
  destinationQuestion: '✈️ Où pars-tu en voyage ?',
  tagline: '3 minutes de formulaire = Une checklist complète pour tout votre voyage',
} as const;

export const GRADIENT_STYLES = {
  suggestion: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  suggestionTextPrimary: 'text-blue-600',
  suggestionTextSecondary: 'text-blue-900',
} as const;
