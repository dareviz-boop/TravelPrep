/**
 * Système de filtrage intelligent pour checklists climatiques
 * Adapte automatiquement les équipements selon les conditions du voyage
 *
 * @module checklistFilters
 * @version 3.0
 * @author TravelPrep Team
 */

import { FormData, Saison, Temperature } from '@/types/form';
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
 * Détecte l'hémisphère d'un voyage en fonction des pays ou de la zone géographique
 * @returns 'north' | 'south' | 'both' | null
 */
function detectHemisphere(
  pays: Array<{ code?: string; nom?: string }> | undefined,
  localisation: string
): 'north' | 'south' | 'both' | null {
  // PRIORITÉ 1 : Détecter via les pays sélectionnés
  if (pays && pays.length > 0) {
    const hemispheres = new Set<string>();

    pays.forEach((p: any) => {
      const countryCode = p.code?.toUpperCase();
      const climate = countryCode ? getCountryClimate(countryCode) : null;

      if (climate?.hemisphere) {
        hemispheres.add(climate.hemisphere);
      }
    });

    // Si on a trouvé des hémisphères
    if (hemispheres.size > 0) {
      // Si on a les deux hémisphères ou un pays "both"
      if (hemispheres.has('both') || hemispheres.size > 1) {
        return 'both';
      }
      // Sinon retourner l'unique hémisphère trouvé
      return hemispheres.values().next().value as 'north' | 'south';
    }
  }

  // PRIORITÉ 2 (FALLBACK) : Utiliser l'hémisphère de la zone géographique
  const regionalClimate = getRegionalClimate(localisation);
  if (regionalClimate?.hemisphere) {
    return regionalClimate.hemisphere as 'north' | 'south' | 'both';
  }

  // PRIORITÉ 3 : Fallback par défaut selon localisation (basique)
  const loc = localisation.toLowerCase();
  if (loc.includes('europe') || loc.includes('amerique-nord') || loc.includes('asie')) {
    return 'north';
  }
  if (loc.includes('oceanie') || loc.includes('amerique-sud')) {
    return 'south';
  }
  if (loc.includes('afrique')) {
    return 'both';
  }

  return null;
}

/**
 * Vérifie si une période correspond au mois de départ
 * Avec fallback intelligent basé sur l'hémisphère
 */
function matchesPeriode(
  periodes: Array<{ debut: number; fin: number; region?: string }>,
  dateDepart: string,
  localisation: string,
  pays?: Array<{ code?: string; nom?: string }>
): boolean {
  if (!periodes || periodes.length === 0) return true;
  if (!dateDepart) return true;

  const month = new Date(dateDepart).getMonth() + 1; // 1-12

  return periodes.some((periode) => {
    // Vérifier d'abord si le mois correspond
    let monthMatches = false;

    // Gérer les périodes qui traversent l'année (ex: nov-avril = 11-4)
    if (periode.debut > periode.fin) {
      monthMatches = month >= periode.debut || month <= periode.fin;
    } else {
      monthMatches = month >= periode.debut && month <= periode.fin;
    }

    // Si le mois ne correspond pas, on sort
    if (!monthMatches) return false;

    // Si pas de région spécifique, accepter
    if (!periode.region) return true;

    // === LOGIQUE DE MATCHING RÉGION AVEC FALLBACK ===

    const regionFilter = periode.region.toLowerCase();
    const locLower = localisation.toLowerCase();

    // TENTATIVE 1 : Match direct avec localisation
    if (locLower.includes(regionFilter)) {
      return true;
    }

    // TENTATIVE 2 : Match avec variantes connues
    // Ex: "Afrique Ouest" → "afrique", "Tornado Alley USA" → "amerique-nord"
    const regionMappings: Record<string, string[]> = {
      'afrique ouest': ['afrique'],
      'afrique australe': ['afrique'],
      'tornado alley usa': ['amerique-nord', 'usa', 'etats-unis'],
      'atlantique': ['amerique-centrale-caraibes', 'amerique-nord'],
      'pacifique': ['asie', 'oceanie', 'amerique-centrale-caraibes'],
      'océan indien': ['afrique', 'asie', 'oceanie'],
      'sahara': ['afrique'],
      'australie centre': ['oceanie'],
      'arctique': ['europe', 'amerique-nord', 'groenland', 'islande', 'norvege', 'canada', 'russie'],
      'antarctique': ['antarctique']
    };

    for (const [key, values] of Object.entries(regionMappings)) {
      if (regionFilter.includes(key)) {
        if (values.some(v => locLower.includes(v))) {
          return true;
        }
      }
    }

    // TENTATIVE 3 (FALLBACK) : Match basé sur l'hémisphère
    const detectedHemisphere = detectHemisphere(pays, localisation);

    if (regionFilter.includes('hémisphère nord') || regionFilter === 'hémisphère nord') {
      return detectedHemisphere === 'north' || detectedHemisphere === 'both';
    }

    if (regionFilter.includes('hémisphère sud') || regionFilter === 'hémisphère sud') {
      return detectedHemisphere === 'south' || detectedHemisphere === 'both';
    }

    // TENTATIVE 4 : Match zones spécifiques pour l'arctique
    if (regionFilter === 'arctique') {
      // Vérifier si un des pays est arctique
      const arcticCountries = ['gl', 'is', 'no', 'se', 'fi', 'ru', 'ca'];
      const hasArcticCountry = pays?.some((p: any) =>
        arcticCountries.includes(p.code?.toLowerCase())
      );
      if (hasArcticCountry) return true;
    }

    // TENTATIVE 5 : Match zones tropicales
    if (regionFilter.includes('zones tropicales') || regionFilter === 'zones tropicales') {
      const regionalClimate = getRegionalClimate(localisation);
      if (regionalClimate?.zones?.some(z => ['tropical', 'equatorial'].includes(z))) {
        return true;
      }
    }

    // Si aucun match, on bloque
    return false;
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
      formData.localisation,
      formData.pays
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
export function autoDetectSeasons(formData: FormData): Saison[] {
  if (!formData.dateDepart) return [];

  const seasons: Set<string> = new Set();

  // Collecter les mois du voyage
  const travelMonths: number[] = [];
  const startDate = new Date(formData.dateDepart);
  const startMonth = startDate.getMonth() + 1; // 1-12

  travelMonths.push(startMonth);

  // Si date de retour définie, ajouter tous les mois intermédiaires ET le mois de fin
  if (formData.dateRetour) {
    const endDate = new Date(formData.dateRetour);
    const endMonth = endDate.getMonth() + 1;

    // Ajouter le mois de fin d'abord
    if (!travelMonths.includes(endMonth)) {
      travelMonths.push(endMonth);
    }

    // Puis ajouter tous les mois intermédiaires
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
      return Array.from(seasons) as Saison[];
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
        return Array.from(seasons) as Saison[];
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

  return Array.from(seasons) as Saison[];
}

// ==========================================
// AUTO-ATTRIBUTION DES TEMPÉRATURES
// ==========================================

/**
 * Détermine automatiquement les températures probables selon les pays et date
 * Utilise la base de données climatique mondiale pour des résultats précis
 * Prend en compte toute la période du voyage (pas juste la date de départ)
 * @param formData - Données du formulaire
 * @returns Array de températures applicables (tres-froide, froide, temperee, chaude, tres-chaude)
 */
export function autoDetectTemperatures(formData: FormData): Temperature[] {
  if (!formData.pays || formData.pays.length === 0 || !formData.dateDepart) return [];

  const temperatures: Set<string> = new Set();

  // Collecter les mois du voyage
  const travelMonths: number[] = [];
  const startDate = new Date(formData.dateDepart);
  const startMonth = startDate.getMonth() + 1; // 1-12

  travelMonths.push(startMonth);

  // Si date de retour définie, ajouter tous les mois intermédiaires ET le mois de fin
  if (formData.dateRetour) {
    const endDate = new Date(formData.dateRetour);
    const endMonth = endDate.getMonth() + 1;

    // Ajouter le mois de fin d'abord
    if (!travelMonths.includes(endMonth)) {
      travelMonths.push(endMonth);
    }

    // Puis ajouter tous les mois intermédiaires
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

  // Mapper les mois aux propriétés de avgTemp
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // === STRATÉGIE 1: PAYS SPÉCIFIQUES (données précises) ===
  let hasFoundCountry = false;

  formData.pays.forEach((pays: any) => {
    const countryCode = pays.code?.toUpperCase();
    const climate = countryCode ? getCountryClimate(countryCode) : null;

    if (climate && climate.avgTemp) {
      hasFoundCountry = true;
      // Parcourir tous les mois du voyage
      travelMonths.forEach(month => {
        const monthKey = monthKeys[month - 1] as keyof CountryClimate['avgTemp'];
        const avgTemp = climate.avgTemp[monthKey];
        const tempCategories = getTemperatureCategory(avgTemp);
        tempCategories.forEach(t => temperatures.add(t));
      });
    }
  });

  // Si on a trouvé au moins un pays dans la base, utiliser ces données
  if (hasFoundCountry && temperatures.size > 0) {
    return Array.from(temperatures) as Temperature[];
  }

  // === STRATÉGIE 2: ZONE GÉOGRAPHIQUE (fallback régional) ===
  if (formData.localisation) {
    const regionalClimate = getRegionalClimate(formData.localisation);

    if (regionalClimate?.avgTemp) {
      travelMonths.forEach(month => {
        const monthKey = monthKeys[month - 1] as keyof CountryClimate['avgTemp'];
        const avgTemp = regionalClimate.avgTemp[monthKey];
        if (avgTemp !== undefined) {
          const tempCategories = getTemperatureCategory(avgTemp);
          tempCategories.forEach(t => temperatures.add(t));
        }
      });

      if (temperatures.size > 0) {
        return Array.from(temperatures) as Temperature[];
      }
    }
  }

  // === STRATÉGIE 3: FALLBACK GÉNÉRIQUE (si aucune donnée trouvée) ===
  // Utiliser une estimation basique pour l'hémisphère nord tempéré
  travelMonths.forEach(month => {
    if (month >= 6 && month <= 8) {
      temperatures.add('chaude'); // Été
    } else if (month >= 12 || month <= 2) {
      temperatures.add('froide'); // Hiver
    } else {
      temperatures.add('temperee'); // Printemps/automne
    }
  });

  return Array.from(temperatures) as Temperature[];
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
    // Ne pas ajouter si déjà suggéré (éviter les doublons)
    if (alreadySuggested.has(id)) return;

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
  const seTropicalCountryCodes = ['TH', 'VN', 'ID', 'KH', 'LA', 'MM', 'PH', 'MY', 'BN', 'TL', 'SG'];
  const isSETropical = formData.pays?.some((p: any) =>
    seTropicalCountryCodes.includes(p.code?.toUpperCase())
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
  const desertCountryCodes = ['SA', 'AE', 'QA', 'EG', 'LY', 'NE', 'TD', 'SD', 'MA', 'DZ', 'TN', 'EH', 'KW', 'IQ', 'IR', 'BW', 'NA', 'PK', 'MN', 'UZ', 'TM', 'KZ'];
  const isDesert = formData.pays?.some((p: any) =>
    desertCountryCodes.includes(p.code?.toUpperCase())
  );

  if (isDesert) {
    addSuggestion('climat_sec_aride', 'Climat désertique très sec', 'haute');
    if (temperatures.includes('chaleur-extreme')) {
      addSuggestion('climat_chaleur_extreme', 'Chaleur extrême >38°C en zones désertiques', 'haute');
    } else if (month >= 5 && month <= 9 || temperatures.includes('tres-chaude')) {
      addSuggestion('climat_canicule', 'Chaleur intense en période estivale', 'haute');
    }
  }

  // 🌡️ AUSTRALIE EN ÉTÉ : Canicule et forte chaleur
  const isAustralia = formData.pays?.some((p: any) => p.code?.toUpperCase() === 'AU');
  if (isAustralia) {
    // Été austral : décembre, janvier, février
    if (temperatures.includes('chaleur-extreme')) {
      addSuggestion('climat_chaleur_extreme', 'Chaleur extrême dans les déserts australiens', 'haute');
    } else if ((month >= 12 || month <= 2) || temperatures.includes('tres-chaude')) {
      addSuggestion('climat_canicule', 'Vagues de chaleur fréquentes en été australien', 'haute');
    }
  }

  // ❄️ ZONES FROIDES : Neige + Froid intense
  const coldCountryCodes = ['GL', 'IS', 'FI', 'NO', 'SE', 'CA', 'RU', 'AD', 'CH', 'AT', 'LI', 'EE', 'LV', 'LT', 'BY', 'UA', 'PL', 'KZ', 'MN', 'KG'];
  const isCold = formData.pays?.some((p: any) =>
    coldCountryCodes.includes(p.code?.toUpperCase())
  );

  if (isCold) {
    if (month >= 11 || month <= 3 || saisons.includes('hiver')) {
      // Pays polaires (GL, IS, FI, NO, SE, CA, RU) = froid intense
      const polarCountries = ['GL', 'IS', 'FI', 'NO', 'SE', 'CA', 'RU'];
      const isPolar = formData.pays?.some((p: any) =>
        polarCountries.includes(p.code?.toUpperCase())
      );

      addSuggestion('climat_neige', 'Chutes de neige fréquentes en hiver', 'haute');

      // Froid intense seulement pour zones polaires, pas pour pays alpins
      if (isPolar) {
        addSuggestion('climat_froid_intense', 'Températures polaires en hiver', 'haute');
      }
    }
  }

  // 🌀 CYCLONES : Zones à risque selon période
  const cycloneRegions = [
    // Asie-Pacifique : Typhons (juillet-octobre)
    { countryCodes: ['PH', 'TW', 'JP', 'CN', 'VN', 'KR'], months: [7, 8, 9, 10], id: 'climat_cyclones' },
    // Caraïbes : Ouragans (juin-novembre)
    { countryCodes: ['CU', 'JM', 'HT', 'DO', 'BS', 'GP', 'MQ', 'AG', 'LC', 'GD', 'VC', 'TT', 'DM', 'BB', 'AW', 'BM', 'BZ', 'MX', 'GT', 'HN', 'NI', 'CR', 'PA', 'VE', 'CO', 'KY', 'TC', 'VG', 'VI', 'PR', 'SX', 'MF', 'BL', 'KN', 'AI', 'MS', 'CW'], months: [6, 7, 8, 9, 10, 11], id: 'climat_cyclones' },
    // Océan Indien : Cyclones (novembre-avril)
    { countryCodes: ['MG', 'MZ', 'MU', 'RE', 'SC', 'KM', 'TZ', 'ZA', 'MW'], months: [11, 12, 1, 2, 3, 4], id: 'climat_cyclones' },
    // Pacifique Sud : Cyclones tropicaux (novembre-avril)
    { countryCodes: ['FJ', 'VU', 'NC', 'PF', 'TO', 'WS', 'AS', 'CK', 'TV', 'KI', 'SB', 'PG'], months: [11, 12, 1, 2, 3, 4], id: 'climat_cyclones' },
    // Golfe du Bengale : Cyclones (avril-juin, septembre-novembre)
    { countryCodes: ['BD', 'IN', 'MM', 'LK', 'PK'], months: [4, 5, 6, 9, 10, 11], id: 'climat_cyclones' },
    // Australie Nord : Cyclones tropicaux (novembre-avril)
    { countryCodes: ['AU'], months: [11, 12, 1, 2, 3, 4], id: 'climat_cyclones' }
  ];

  cycloneRegions.forEach(region => {
    const inRegion = formData.pays?.some((p: any) =>
      region.countryCodes.includes(p.code?.toUpperCase())
    );
    if (inRegion && region.months.includes(month)) {
      addSuggestion('climat_cyclones', 'Saison des cyclones/typhons/ouragans', 'haute');
    }
  });

  // 🏝️ ZONES CÔTIÈRES TROPICALES : Humidité
  const coastalTropicalCodes = ['BR', 'CO', 'CR', 'PA', 'SC', 'MV', 'MU', 'GF', 'SR', 'GY', 'VE', 'NI', 'HN', 'BZ', 'MX', 'CU', 'JM', 'HT', 'DO', 'SG', 'BN', 'TL', 'PG', 'SB', 'VU', 'FJ', 'PF', 'NC', 'LK', 'BD'];
  const isCoastalTropical = formData.pays?.some((p: any) =>
    coastalTropicalCodes.includes(p.code?.toUpperCase())
  );

  if (isCoastalTropical) {
    addSuggestion('climat_tropical_humide', 'Climat côtier tropical', 'moyenne');
    addSuggestion('climat_humidite', 'Forte humidité côtière', 'basse');
  }

  // 🌊 ENVIRONNEMENT MARIN : Activités nautiques/plage
  if (formData.activites?.some(act => ['plage', 'sports-nautiques'].includes(act))) {
    addSuggestion('climat_marin', 'Activités maritimes ou côtières', 'moyenne');
  }

  // 🏔️ ALTITUDE : Recommandations selon pays montagneux
  const altitudeCountries: Record<string, { moderate?: boolean; high?: boolean; extreme?: boolean }> = {
    'PE': { moderate: true, high: true }, // Pérou (Cusco, Machu Picchu)
    'BO': { moderate: true, high: true }, // Bolivie (La Paz)
    'NP': { high: true, extreme: true }, // Népal (Everest)
    'BT': { moderate: true, high: true }, // Bhoutan
    'EC': { moderate: true }, // Équateur (Quito)
    'CL': { moderate: true, extreme: true }, // Chili (Atacama, Ojos del Salado 6893m)
    'CN': { high: true, extreme: true }, // Chine (Tibet)
    'KE': { moderate: true }, // Kenya (Kilimandjaro)
    'TZ': { moderate: true }, // Tanzanie (Kilimandjaro)
    'CO': { moderate: true, high: true }, // Colombie (Bogotá 2640m, sommets andins)
    'GT': { moderate: true }, // Guatemala (Antigua, hauts plateaux)
    'MX': { moderate: true }, // Mexique (Mexico City)
    'AF': { moderate: true, high: true }, // Afghanistan (Kaboul, Hindu Kush)
    'PK': { moderate: true, high: true, extreme: true }, // Pakistan (Hunza, K2 8611m)
    'IN': { moderate: true, high: true, extreme: true }, // Inde (Ladakh, Kangchenjunga)
    'KG': { moderate: true, high: true }, // Kirghizistan (Pamir)
    'TJ': { moderate: true, high: true }, // Tadjikistan (Pamir)
    'AM': { moderate: true }, // Arménie (Erevan, montagnes)
    'GE': { moderate: true }, // Géorgie (Caucase)
    'ET': { moderate: true }, // Éthiopie (Addis-Abeba 2355m)
    'RW': { moderate: true }, // Rwanda (pays des mille collines)
    'UG': { moderate: true }, // Ouganda (régions montagneuses)
    'LS': { moderate: true }, // Lesotho (entièrement en altitude >1400m)
    'AR': { moderate: true, high: true, extreme: true } // Argentine (Andes, Aconcagua 6962m)
  };

  const hasAltitude = formData.pays?.some((p: any) => {
    const code = p.code?.toUpperCase();
    return code && altitudeCountries[code];
  });

  if (hasAltitude && formData.activites?.includes('randonnee')) {
    const altitudeInfo = formData.pays?.find((p: any) => {
      const code = p.code?.toUpperCase();
      return code && altitudeCountries[code];
    });

    if (altitudeInfo) {
      const code = altitudeInfo.code?.toUpperCase();
      const info = altitudeCountries[code];

      if (info?.moderate) {
        addSuggestion('climat_altitude_moderee', 'Destination en altitude modérée (2500-3500m)', 'haute');
      }
      if (info?.high) {
        addSuggestion('climat_altitude_haute', 'Destination en haute altitude (3500-5500m)', 'haute');
      }
      if (info?.extreme) {
        addSuggestion('climat_altitude_extreme', 'Destination en très haute altitude (>5500m)', 'haute');
      }
    }
  }

  // 🏜️ DÉSERTS ARIDES : Climats très secs
  const aridDesertCodes = ['MA', 'DZ', 'LY', 'EG', 'JO', 'IL', 'SA', 'AE', 'OM', 'YE', 'TD', 'NE', 'ML', 'MR', 'TN', 'EH', 'KW', 'IQ', 'IR', 'BW', 'NA', 'PK', 'MN', 'UZ', 'TM', 'KZ'];
  const isAridDesert = formData.pays?.some((p: any) =>
    aridDesertCodes.includes(p.code?.toUpperCase())
  );

  if (isAridDesert) {
    addSuggestion('climat_desert_aride', 'Désert aride avec conditions extrêmes', 'haute');
    addSuggestion('climat_canicule', 'Canicule / Vague de chaleur dans les zones arides', 'moyenne');
    addSuggestion('climat_amplitude_thermique', 'Forte amplitude thermique jour/nuit', 'moyenne');
  }

  // 🌬️ HARMATTAN : Vent de sable du Sahara (novembre-mars)
  const harmattanCountries = ['MA', 'DZ', 'EH', 'MR', 'ML', 'NE', 'TD', 'SD', 'NG', 'BF', 'GH', 'BJ', 'TG', 'CI', 'SN', 'GM'];
  const isHarmattanZone = formData.pays?.some((p: any) =>
    harmattanCountries.includes(p.code?.toUpperCase())
  );

  if (isHarmattanZone && (month >= 11 || month <= 3)) {
    addSuggestion('climat_harmattan', 'Vent de sable du Sahara (novembre-mars)', 'haute');
  }

  // 🌡️ AMPLITUDE THERMIQUE : Déserts et montagnes
  if (temperatures.includes('tres-chaude') || temperatures.includes('tres-froide') || hasAltitude) {
    // Ajouter seulement si pas déjà ajouté par désert aride
    if (!isAridDesert) {
      addSuggestion('climat_amplitude_thermique', 'Variations de température importantes', 'moyenne');
    }
  }

  // 🌫️ BROUILLARD : Zones maritimes tempérées
  const fogProneCountries = ['GB-ENG', 'GB-SCT', 'GB-WLS', 'GB-NIR', 'IE', 'NZ', 'US', 'CA', 'CL', 'AR', 'PT', 'ES', 'FR', 'BE', 'NL', 'DE', 'DK', 'NO', 'SE', 'FI', 'PE', 'EC', 'UY', 'ZA', 'AU', 'JP', 'CN'];
  const isFogProne = formData.pays?.some((p: any) =>
    fogProneCountries.includes(p.code?.toUpperCase())
  );

  if (isFogProne && (saisons.includes('automne') || saisons.includes('hiver'))) {
    addSuggestion('climat_brouillard', 'Brouillard fréquent en cette saison', 'basse');
  }

  // 💨 VENTS FORTS : Zones venteuses connues
  const windyCountries = ['IS', 'NZ', 'AR', 'CL', 'GB-ENG', 'GB-SCT', 'GB-WLS', 'GB-NIR', 'IE', 'GL', 'FK', 'UY', 'ZA', 'NA', 'FR', 'ES', 'PT', 'MN', 'KZ', 'NO', 'DK', 'NL', 'AU', 'US', 'CA'];
  const isWindy = formData.pays?.some((p: any) =>
    windyCountries.includes(p.code?.toUpperCase())
  );

  if (isWindy) {
    addSuggestion('climat_vents_forts', 'Vents violents fréquents', 'moyenne');
  }

  // 🌋 ZONES VOLCANIQUES : Pays avec volcans actifs
  const volcanicCountries = ['IS', 'ID', 'PH', 'JP', 'IT', 'CR', 'GT', 'NZ', 'CL', 'EC', 'MX', 'NI', 'SV', 'PA', 'CO', 'PE', 'BO', 'AR', 'VU', 'PG', 'SB', 'TO', 'KI', 'US', 'RU', 'ET', 'CD', 'RW', 'UG', 'KE', 'TZ', 'DJ', 'ER', 'YE', 'SA', 'TR', 'GR', 'FR'];
  const isVolcanic = formData.pays?.some((p: any) =>
    volcanicCountries.includes(p.code?.toUpperCase())
  );

  if (isVolcanic && formData.activites?.includes('randonnee')) {
    addSuggestion('climat_volcanique', 'Zones volcaniques actives', 'moyenne');
  }

  // 🌲 JUNGLE DENSE : Forêts tropicales
  const jungleCountries = ['BR', 'PE', 'CO', 'EC', 'VE', 'GY', 'SR', 'GF', 'MY', 'ID', 'PG', 'CG', 'GA', 'BO', 'PA', 'CR', 'NI', 'HN', 'BZ', 'GT', 'MX', 'TH', 'VN', 'LA', 'KH', 'MM', 'BN', 'PH', 'IN', 'LK', 'BD', 'CM', 'GQ', 'CD', 'CF', 'AO', 'MG', 'SB', 'VU', 'FJ'];
  const isJungle = formData.pays?.some((p: any) =>
    jungleCountries.includes(p.code?.toUpperCase())
  );

  if (isJungle && formData.activites?.some(act => ['randonnee', 'camping', 'backpacking'].includes(act))) {
    addSuggestion('climat_jungle_dense', 'Forêt dense / Jungle équatoriale', 'haute');
  }

  // 💧 HUMIDITÉ EXTRÊME : Régions très humides
  if ((isSETropical || isCoastalTropical || isJungle) && !alreadySuggested.has('climat_humidite')) {
    addSuggestion('climat_humidite', 'Humidité très élevée (>85%)', 'moyenne');
  }

  // 🌡️ CANICULE : Régions très sèches et chaudes
  if ((isDesert || isAridDesert) && !alreadySuggested.has('climat_canicule')) {
    addSuggestion('climat_canicule', 'Canicule / Vague de chaleur dans les déserts', 'moyenne');
  }

  // === PARTIE 2: SUGGESTIONS DU JSON (COMPLÉMENTAIRES) ===
  // ⚠️ Pour multi-destinations avec pays spécifiques, on privilégie la logique contextuelle (PARTIE 1)
  // et on ignore les suggestions génériques du JSON qui seraient trop larges

  const isMultiDestinationWithCountries = formData.localisation === 'multi-destinations' && formData.pays && formData.pays.length > 0;

  // Ne pas appliquer les suggestions génériques du JSON si on est en multi-destinations avec pays
  if (!isMultiDestinationWithCountries) {
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
        // Ne pas ajouter si déjà suggéré (éviter les doublons)
        if (alreadySuggested.has(item.id)) return;
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
  }

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
    formData.localisation,
    formData.pays
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
