/**
 * Default values for form initialization
 */

import { FormData } from '../types/form';
import { ESSENTIAL_SECTIONS, SPECIAL_CONDITIONS, SPECIAL_LOCATIONS } from '../constants/validation';

export const DEFAULT_FORM_DATA: FormData = {
  nomVoyage: '',
  dateDepart: '',
  duree: 'moyen',
  localisation: SPECIAL_LOCATIONS.multiDestinations,
  pays: [],
  temperature: [SPECIAL_CONDITIONS.unknown],
  saison: [SPECIAL_CONDITIONS.unknown],
  conditionsClimatiques: [],
  recommendedConditions: [],
  activites: [],
  profil: 'couple',
  agesEnfants: [],
  typeVoyage: 'flexible',
  confort: 'standard',
  sectionsInclure: [...ESSENTIAL_SECTIONS],
  formatPDF: 'detaille',
  formatFichier: 'pdf',
  nomClient: '',
  prenomClient: '',
  email: '',
};
