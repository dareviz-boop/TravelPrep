/**
 * Système de filtrage intelligent pour checklists climatiques
 * Adapte automatiquement les équipements selon les conditions du voyage
 *
 * @module checklistFilters
 * @version 3.0
 * @author TravelPrep Team
 */

import { FormData } from '@/types/form';
import climatData from '@/data/checklist_climat_meteo.json';
import {
  getCountryClimate,
  getRegionalClimate,
  getTemperatureCategory,
  getSeasonsForMonth,
  COUNTRY_CLIMATES,
  type CountryClimate
} from './climateDatabase';

// ==========================================
// TYPES ET INTERFACES
// ==========================================

export interface ClimatItem {
  id: string;
  nom: string;
  emoji: string;
  priorite: string;
  delai?: string;
  equipement: string[];
  filtres?: {
    destinations?: string[];
    activites?: string[];
    periode?: Array<{
      debut: number;
      fin: number;
      region?: string;
    }>;
  };
  suggestions?: {
    temperature?: string[];
    saison?: string[];
    description?: string;
  };
  conseils: string;
}

export interface DestinationSpecifiqueItem {
  id: string;
  item: string;
  priorite: string;
  delai?: string;
  quantite?: string;
  specifications?: string[];
  conseils: string;
  filtres?: {
    activites?: string[];
  };
}

export interface ChecklistSection {
  id: string;
  nom: string;
  items: Array<string | DestinationSpecifiqueItem>;
  source: 'climat' | 'destination_specifique' | 'suggestion_auto';
  conseils?: string;
}

export interface SuggestionItem {
  conditionId: string;
  nom: string;
  emoji: string;
  raison: string;
  priorite: 'haute' | 'moyenne' | 'basse';
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Trouve une condition climatique par son ID dans la structure V3
 */
function findConditionById(conditionId: string): ClimatItem | null {
  const data = climatData as any;

  // Cas spécial: climat_aucune
  if (conditionId === 'climat_aucune') {
    return data.conditionsClimatiques.aucune_condition;
  }

  // Parcourir toutes les catégories
  const categories = [
    'precipitations',
    'temperatures_extremes',
    'altitude',
    'conditions_speciales',
    'vents',
    'humidite'
  ];

  for (const category of categories) {
    const categoryData = data.conditionsClimatiques[category];
    if (categoryData && categoryData.items) {
      const found = categoryData.items.find((item: ClimatItem) => item.id === conditionId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Vérifie si une période correspond au mois de départ
 */
function matchesPeriode(
  periodes: Array<{ debut: number; fin: number; region?: string }>,
  dateDepart: string,
  localisation: string
): boolean {
  if (!periodes || periodes.length === 0) return true;
  if (!dateDepart) return true;

  const month = new Date(dateDepart).getMonth() + 1; // 1-12

  return periodes.some((periode) => {
    // Si la période a une région spécifique, vérifier la correspondance
    if (periode.region && !localisation.toLowerCase().includes(periode.region.toLowerCase())) {
      return false;
    }

    // Gérer les périodes qui traversent l'année (ex: nov-avril = 11-4)
    if (periode.debut > periode.fin) {
      return month >= periode.debut || month <= periode.fin;
    }

    return month >= periode.debut && month <= periode.fin;
  });
}

/**
 * Vérifie si la destination correspond
 */
function matchesDestination(
  destinations: string[] | undefined,
  localisation: string
): boolean {
  if (!destinations || destinations.length === 0) return true;
  if (localisation === 'multi-destinations') return true;

  return destinations.some((dest) =>
    localisation.toLowerCase().includes(dest.toLowerCase())
  );
}

/**
 * Vérifie si les activités correspondent
 */
function matchesActivites(
  activites: string[] | undefined,
  formActivites: string[] | undefined
): boolean {
  if (!activites || activites.length === 0) return true;
  if (!formActivites || formActivites.length === 0) return false;

  return activites.some((act) => formActivites.includes(act));
}

/**
 * Déduplique et tri les items
 */
function deduplicateItems(items: string[]): string[] {
  return Array.from(new Set(items));
}

// ==========================================
// FONCTION PRINCIPALE : FILTRAGE CLIMAT
// ==========================================

/**
 * Retourne les équipements climatiques adaptés au voyage
 * Applique tous les filtres intelligents
 */
export function getClimatEquipment(formData: FormData): ChecklistSection[] {
  const sections: ChecklistSection[] = [];
  const allItems: string[] = [];
  const conseils: string[] = [];

  // === 1. TRAITER LES CONDITIONS SÉLECTIONNÉES PAR L'UTILISATEUR ===

  const selectedConditions = formData.conditionsClimatiques || [];

  // Si "Aucune" est sélectionné, on ne retourne rien
  if (selectedConditions.includes('climat_aucune')) {
    return [];
  }

  // Traiter chaque condition climatique sélectionnée
  selectedConditions.forEach((conditionId) => {
    const condition = findConditionById(conditionId);
    if (!condition) return;

    // === FILTRES : Vérifier si la condition est applicable ===

    // 1. Filtre destination
    const matchesDest = matchesDestination(
      condition.filtres?.destinations,
      formData.localisation
    );

    // 2. Filtre période
    const matchesPeriod = matchesPeriode(
      condition.filtres?.periode || [],
      formData.dateDepart,
      formData.localisation
    );

    // 3. Filtre activités
    const matchesAct = matchesActivites(
      condition.filtres?.activites,
      formData.activites
    );

    // === APPLICATION DES FILTRES ===
    if (matchesDest && matchesPeriod && matchesAct) {
      allItems.push(...condition.equipement);
      if (condition.conseils) {
        conseils.push(condition.conseils);
      }
    }
  });

  // Dédupliquer les items
  const uniqueItems = deduplicateItems(allItems);

  // Créer la section si on a des items
  if (uniqueItems.length > 0) {
    sections.push({
      id: 'climat_meteo',
      nom: 'Équipements climatiques',
      items: uniqueItems,
      source: 'climat',
      conseils: conseils.join('\n\n')
    });
  }

  return sections;
}

// ==========================================
// AUTO-ATTRIBUTION DES SAISONS
// ==========================================

/**
 * Détermine automatiquement les saisons appropriées selon les pays et les dates de voyage
 * Utilise la base de données climatique mondiale pour des résultats précis
 * Prend en compte toute la période du voyage (pas juste la date de départ)
 * @param formData - Données du formulaire
 * @returns Array de saisons applicables (printemps, ete, automne, hiver)
 */
export function autoDetectSeasons(formData: FormData): string[] {
  if (!formData.dateDepart) return [];

  const seasons: Set<string> = new Set();

  // Collecter les mois du voyage
  const travelMonths: number[] = [];
  const startDate = new Date(formData.dateDepart);
  const startMonth = startDate.getMonth() + 1; // 1-12

  travelMonths.push(startMonth);

  // Si date de retour définie, ajouter tous les mois intermédiaires
  if (formData.dateRetour) {
    const endDate = new Date(formData.dateRetour);
    const endMonth = endDate.getMonth() + 1;

    let currentMonth = startMonth;
    while (currentMonth !== endMonth) {
      currentMonth++;
      if (currentMonth > 12) currentMonth = 1;
      if (!travelMonths.includes(currentMonth)) {
        travelMonths.push(currentMonth);
      }
      // Sécurité: max 12 itérations
      if (travelMonths.length > 12) break;
    }
  }

  // === STRATÉGIE 1: PAYS SPÉCIFIQUES (données précises) ===
  if (formData.pays && formData.pays.length > 0) {
    let hasFoundCountry = false;

    formData.pays.forEach((pays: any) => {
      const countryCode = pays.code?.toUpperCase();
      const climate = countryCode ? getCountryClimate(countryCode) : null;

      if (climate) {
        hasFoundCountry = true;
        travelMonths.forEach(month => {
          const monthSeasons = getSeasonsForMonth(month, climate.seasons);
          monthSeasons.forEach(s => seasons.add(s));
        });
      }
    });

    // Si on a trouvé au moins un pays dans la base, utiliser ces données
    if (hasFoundCountry && seasons.size > 0) {
      return Array.from(seasons);
    }
  }

  // === STRATÉGIE 2: ZONE GÉOGRAPHIQUE (fallback régional) ===
  if (formData.localisation) {
    const regionalClimate = getRegionalClimate(formData.localisation);

    if (regionalClimate?.seasons) {
      travelMonths.forEach(month => {
        const monthSeasons = getSeasonsForMonth(month, regionalClimate.seasons as any);
        monthSeasons.forEach(s => seasons.add(s));
      });

      if (seasons.size > 0) {
        return Array.from(seasons);
      }
    }
  }

  // === STRATÉGIE 3: FALLBACK GÉNÉRIQUE (si aucune donnée trouvée) ===
  // Hémisphère nord par défaut
  travelMonths.forEach(month => {
    if (month >= 3 && month <= 5) seasons.add('printemps');
    else if (month >= 6 && month <= 8) seasons.add('ete');
    else if (month >= 9 && month <= 11) seasons.add('automne');
    else seasons.add('hiver');
  });

  return Array.from(seasons);
}

// ==========================================
// AUTO-ATTRIBUTION DES TEMPÉRATURES
// ==========================================

/**
 * Détermine automatiquement les températures probables selon les pays et date
 * Utilise la base de données climatique mondiale pour des résultats précis
 * @param formData - Données du formulaire
 * @returns Array de températures applicables (tres-froide, froide, temperee, chaude, tres-chaude)
 */
export function autoDetectTemperatures(formData: FormData): string[] {
  if (!formData.pays || formData.pays.length === 0 || !formData.dateDepart) return [];

  const temperatures: Set<string> = new Set();
  const month = new Date(formData.dateDepart).getMonth() + 1; // 1-12

  // Mapper les mois aux propriétés de avgTemp
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthKey = monthKeys[month - 1] as keyof CountryClimate['avgTemp'];

  // === STRATÉGIE 1: PAYS SPÉCIFIQUES (données précises) ===
  let hasFoundCountry = false;

  formData.pays.forEach((pays: any) => {
    const countryCode = pays.code?.toUpperCase();
    const climate = countryCode ? getCountryClimate(countryCode) : null;

    if (climate && climate.avgTemp) {
      hasFoundCountry = true;
      const avgTemp = climate.avgTemp[monthKey];
      const tempCategories = getTemperatureCategory(avgTemp);
      tempCategories.forEach(t => temperatures.add(t));
    }
  });

  // Si on a trouvé au moins un pays dans la base, utiliser ces données
  if (hasFoundCountry && temperatures.size > 0) {
    return Array.from(temperatures);
  }

  // === STRATÉGIE 2: ZONE GÉOGRAPHIQUE (fallback régional) ===
  if (formData.localisation) {
    const regionalClimate = getRegionalClimate(formData.localisation);

    if (regionalClimate?.avgTemp) {
      const avgTemp = regionalClimate.avgTemp[monthKey];
      if (avgTemp !== undefined) {
        const tempCategories = getTemperatureCategory(avgTemp);
        tempCategories.forEach(t => temperatures.add(t));

        if (temperatures.size > 0) {
          return Array.from(temperatures);
        }
      }
    }
  }

  // === STRATÉGIE 3: FALLBACK GÉNÉRIQUE (si aucune donnée trouvée) ===
  // Utiliser une estimation basique pour l'hémisphère nord tempéré
  if (month >= 6 && month <= 8) {
    temperatures.add('chaude'); // Été
  } else if (month >= 12 || month <= 2) {
    temperatures.add('froide'); // Hiver
  } else {
    temperatures.add('temperee'); // Printemps/automne
  }

  return Array.from(temperatures);
}

// ==========================================
// SUGGESTIONS AUTOMATIQUES (NON FORCÉES)
// ==========================================

/**
 * Génère des suggestions automatiques basées sur température/saison/destination
 * Utilise à la fois les suggestions du JSON ET une logique contextuelle intelligente
 */
export function generateAutoSuggestions(formData: FormData): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];
  const alreadySuggested = new Set<string>();

  // Normaliser temperature et saison en tableaux
  const temperatures = Array.isArray(formData.temperature)
    ? formData.temperature
    : [formData.temperature];

  const saisons = Array.isArray(formData.saison)
    ? formData.saison
    : [formData.saison];

  const month = formData.dateDepart ? new Date(formData.dateDepart).getMonth() + 1 : 0;

  // === PARTIE 1: LOGIQUE CONTEXTUELLE INTELLIGENTE (PRIORITAIRE) ===

  // Helper pour ajouter une suggestion
  const addSuggestion = (id: string, raison: string, priorite: 'haute' | 'moyenne' | 'basse' = 'moyenne') => {
    if (formData.conditionsClimatiques?.includes(id) || alreadySuggested.has(id)) return;

    // Trouver les détails dans le JSON
    const item = findConditionById(id);
    if (!item) return;

    suggestions.push({
      conditionId: id,
      nom: item.nom,
      emoji: item.emoji,
      raison,
      priorite
    });
    alreadySuggested.add(id);
  };

  // 🌧️ ASIE DU SUD-EST : Mousson + Climat tropical humide
  const seTropicalCountries = ['thailande', 'thailand', 'vietnam', 'indonesie', 'indonesia', 'cambodge', 'cambodia', 'laos', 'myanmar', 'birmanie', 'philippines', 'malaisie', 'malaysia'];
  const isSETropical = formData.pays?.some((p: any) =>
    seTropicalCountries.some(c => (p.code || p.nom || '').toLowerCase().includes(c))
  );

  if (isSETropical) {
    // Mousson (mai-octobre)
    if (month >= 5 && month <= 10) {
      addSuggestion('climat_mousson', 'Saison des pluies en Asie du Sud-Est (mai-octobre)', 'haute');
      addSuggestion('climat_tropical_humide', 'Climat tropical avec forte humidité', 'haute');
      addSuggestion('climat_humidite', 'Humidité très élevée pendant la mousson', 'moyenne');
    } else {
      // Saison sèche mais toujours tropical
      addSuggestion('climat_tropical_humide', 'Climat tropical toute l\'année', 'moyenne');
    }
  }

  // 🏜️ DÉSERTS : Chaleur extrême + Aridité
  const desertCountries = ['arabie', 'emirates', 'emirats', 'qatar', 'egypte', 'egypt', 'libye', 'libya', 'niger', 'tchad', 'chad', 'soudan', 'sudan', 'maroc', 'morocco', 'algerie', 'algeria'];
  const isDesert = formData.pays?.some((p: any) =>
    desertCountries.some(c => (p.code || p.nom || '').toLowerCase().includes(c))
  ) || formData.localisation === 'afrique';

  if (isDesert) {
    addSuggestion('climat_sec_aride', 'Climat désertique très sec', 'haute');
    if (month >= 5 && month <= 9 || temperatures.includes('tres-chaude')) {
      addSuggestion('climat_canicule', 'Chaleur extrême en période estivale', 'haute');
    }
  }

  // ❄️ ZONES FROIDES : Neige + Froid intense
  const coldCountries = ['groenland', 'greenland', 'islande', 'iceland', 'finlande', 'finland', 'norvege', 'norway', 'suede', 'sweden', 'alaska', 'canada', 'russie', 'russia'];
  const isCold = formData.pays?.some((p: any) =>
    coldCountries.some(c => (p.code || p.nom || '').toLowerCase().includes(c))
  );

  if (isCold) {
    if (month >= 11 || month <= 3 || saisons.includes('hiver')) {
      addSuggestion('climat_neige', 'Chutes de neige fréquentes en hiver', 'haute');
      addSuggestion('climat_froid_intense', 'Températures polaires en hiver', 'haute');
    }
  }

  // 🌀 CYCLONES : Zones à risque selon période
  const cycloneRegions = [
    { countries: ['philippines', 'taiwan', 'japon', 'japan'], months: [7, 8, 9, 10], id: 'climat_cyclones' },
    { countries: ['cuba', 'jamaique', 'jamaica', 'haiti', 'dominicaine', 'bahamas'], months: [6, 7, 8, 9, 10, 11], id: 'climat_cyclones' },
    { countries: ['madagascar', 'mozambique', 'maurice', 'mauritius'], months: [11, 12, 1, 2, 3, 4], id: 'climat_cyclones' }
  ];

  cycloneRegions.forEach(region => {
    const inRegion = formData.pays?.some((p: any) =>
      region.countries.some(c => (p.code || p.nom || '').toLowerCase().includes(c))
    );
    if (inRegion && region.months.includes(month)) {
      addSuggestion('climat_cyclones', 'Saison des cyclones/typhons/ouragans', 'haute');
    }
  });

  // 🏝️ ZONES CÔTIÈRES TROPICALES : Humidité
  const coastalTropical = ['bresil', 'brazil', 'colombie', 'colombia', 'costa rica', 'panama', 'seychelles', 'maldives', 'maurice', 'mauritius'];
  const isCoastalTropical = formData.pays?.some((p: any) =>
    coastalTropical.some(c => (p.code || p.nom || '').toLowerCase().includes(c))
  );

  if (isCoastalTropical) {
    addSuggestion('climat_tropical_humide', 'Climat côtier tropical', 'moyenne');
    addSuggestion('climat_humidite', 'Forte humidité côtière', 'basse');
  }

  // 🏔️ ALTITUDE : Recommandations selon activités
  // Note: climat_altitude_* pas encore dans checklistComplete.json
  // TODO: Ajouter ces conditions si besoin

  // === PARTIE 2: SUGGESTIONS DU JSON (COMPLÉMENTAIRES) ===

  const data = climatData as any;
  const categories = [
    'precipitations',
    'temperatures_extremes',
    'altitude',
    'conditions_speciales',
    'vents',
    'humidite'
  ];

  categories.forEach((category) => {
    const categoryData = data.conditionsClimatiques[category];
    if (!categoryData?.items) return;

    categoryData.items.forEach((item: ClimatItem) => {
      if (formData.conditionsClimatiques?.includes(item.id) || alreadySuggested.has(item.id)) return;
      if (!item.suggestions) return;

      const { temperature: suggestedTemps, saison: suggestedSeasons, description } = item.suggestions;

      let matches = false;
      let raison = '';
      let priorite: 'haute' | 'moyenne' | 'basse' = 'basse';

      if (suggestedTemps && suggestedTemps.length > 0) {
        const tempMatch = temperatures.some(t => suggestedTemps.includes(t));
        if (tempMatch) {
          matches = true;
          raison = description || `Température adaptée (${temperatures.join(', ')})`;
          priorite = 'moyenne';
        }
      }

      if (suggestedSeasons && suggestedSeasons.length > 0) {
        const seasonMatch = saisons.some(s => suggestedSeasons.includes(s));
        if (seasonMatch) {
          matches = true;
          if (!raison) raison = description || `Saison adaptée (${saisons.join(', ')})`;
          priorite = 'moyenne';
        }
      }

      if (item.filtres?.destinations && item.filtres.destinations.length > 0) {
        const destMatch = matchesDestination(item.filtres.destinations, formData.localisation);
        if (destMatch) {
          matches = true;
          if (!raison) raison = description || 'Destination adaptée';
        }
      }

      if (matches) {
        addSuggestion(item.id, raison, priorite);
      }
    });
  });

  // Trier par priorité
  const priorityOrder = { haute: 1, moyenne: 2, basse: 3 };
  suggestions.sort((a, b) => priorityOrder[a.priorite] - priorityOrder[b.priorite]);

  return suggestions;
}

// ==========================================
// EXPORTS SUPPLÉMENTAIRES
// ==========================================

/**
 * Retourne les détails d'une suggestion pour l'afficher dans l'UI
 */
export function getSuggestionDetails(conditionId: string): ClimatItem | null {
  return findConditionById(conditionId);
}

/**
 * Accepte une suggestion et retourne les équipements associés
 */
export function acceptSuggestion(conditionId: string, formData: FormData): string[] {
  const condition = findConditionById(conditionId);
  if (!condition) return [];

  // Vérifier les filtres comme pour les conditions normales
  const matchesDest = matchesDestination(
    condition.filtres?.destinations,
    formData.localisation
  );

  const matchesPeriod = matchesPeriode(
    condition.filtres?.periode || [],
    formData.dateDepart,
    formData.localisation
  );

  const matchesAct = matchesActivites(
    condition.filtres?.activites,
    formData.activites
  );

  if (matchesDest && matchesPeriod && matchesAct) {
    return condition.equipement;
  }

  return [];
}

/**
 * Retourne un résumé des filtres appliqués (pour debug/logging)
 */
export function getFilterSummary(formData: FormData): string {
  return `
🗺️ Destination: ${formData.localisation}
📍 Pays: ${formData.pays.map(p => p.nom).join(', ')}
📅 Date départ: ${formData.dateDepart}
🌡️ Températures: ${Array.isArray(formData.temperature) ? formData.temperature.join(', ') : formData.temperature}
🍂 Saisons: ${Array.isArray(formData.saison) ? formData.saison.join(', ') : formData.saison}
🏔️ Conditions: ${formData.conditionsClimatiques?.join(', ') || 'aucune'}
  `.trim();
}

/**
 * Exporte toutes les fonctions utiles
 */
export default {
  getClimatEquipment,
  generateAutoSuggestions,
  autoDetectSeasons,
  autoDetectTemperatures,
  getSuggestionDetails,
  acceptSuggestion,
  getFilterSummary
};
