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
import checklistCompleteData from '@/data/checklistComplete.json';

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

  return destinations.includes(localisation);
}

/**
 * Vérifie si au moins une activité correspond
 */
function matchesActivites(
  activitesFiltre: string[] | undefined,
  activitesUser: string[]
): boolean {
  if (!activitesFiltre || activitesFiltre.length === 0) return true;
  if (!activitesUser || activitesUser.length === 0) return true;

  return activitesUser.some((act) => activitesFiltre.includes(act));
}

/**
 * Déduplique un tableau d'items
 */
function deduplicate<T>(items: T[]): T[] {
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
  if (formData.conditionsClimatiques && formData.conditionsClimatiques.length > 0) {
    formData.conditionsClimatiques.forEach((conditionId) => {
      if (conditionId === 'climat_aucune') {
        // Si "aucune", on n'ajoute rien
        return;
      }

      const condition = findConditionById(conditionId);
      if (!condition) {
        console.warn(`⚠️ Condition climatique non trouvée: ${conditionId}`);
        return;
      }

      // Vérifier les filtres
      const matchesDest = matchesDestination(
        condition.filtres?.destinations,
        formData.localisation
      );

      const matchesAct = matchesActivites(
        condition.filtres?.activites,
        formData.activites
      );

      const matchesPer = matchesPeriode(
        condition.filtres?.periode || [],
        formData.dateDepart,
        formData.localisation
      );

      // Si tous les filtres correspondent, ajouter les équipements
      if (matchesDest && matchesAct && matchesPer) {
        allItems.push(...condition.equipement);
        conseils.push(`${condition.nom}: ${condition.conseils}`);
      }
    });
  }

  // === 2. AJOUTER LES SUGGESTIONS AUTOMATIQUES (NON FORCÉES) ===
  const suggestions = generateAutoSuggestions(formData);

  // On n'ajoute PAS automatiquement les équipements suggérés
  // On retourne juste les suggestions pour que l'UI puisse les afficher
  // L'utilisateur devra les accepter manuellement

  // === 3. AJOUTER LES ITEMS DESTINATIONS SPÉCIFIQUES (BACKEND) ===
  const destSpecificItems = getDestinationSpecificItems(formData);

  // === 4. CONSTRUIRE LES SECTIONS ===
  if (allItems.length > 0) {
    sections.push({
      id: 'climat_conditions_selectionnees',
      nom: '🌦️ Adaptations Climatiques',
      items: deduplicate(allItems),
      source: 'climat',
      conseils: conseils.join('\n\n')
    });
  }

  if (destSpecificItems.length > 0) {
    sections.push({
      id: 'destinations_specifiques',
      nom: '🗺️ Équipements Environnement Spécifique',
      items: destSpecificItems,
      source: 'destination_specifique',
      conseils: 'Équipements adaptés à l\'environnement spécifique de votre destination'
    });
  }

  return sections;
}

// ==========================================
// AUTO-ATTRIBUTION DES SAISONS
// ==========================================

/**
 * Détermine automatiquement les saisons appropriées selon les pays et les dates de voyage
 * Prend en compte toute la période du voyage (pas juste la date de départ)
 * @param formData - Données du formulaire
 * @returns Array de saisons applicables (printemps, ete, automne, hiver)
 */
export function autoDetectSeasons(formData: FormData): string[] {
  if (!formData.dateDepart) return [];

  const seasons: Set<string> = new Set();

  // Helper pour déterminer l'hémisphère d'un pays
  const getHemisphere = (countryCode: string): 'north' | 'south' | 'both' => {
    const southernCountries = [
      'australie', 'nouvelle-zelande', 'argentine', 'chili', 'uruguay', 'paraguay',
      'bolivie', 'perou', 'bresil', 'afrique-du-sud', 'namibie', 'botswana',
      'zimbabwe', 'mozambique', 'madagascar', 'maurice', 'reunion', 'indonesie'
    ];

    const equatorialCountries = [
      'colombie', 'equateur', 'kenya', 'ouganda', 'tanzanie', 'gabon',
      'congo', 'singapour', 'malaisie'
    ];

    const code = countryCode.toLowerCase();

    if (equatorialCountries.some(ec => code.includes(ec))) return 'both';
    if (southernCountries.some(sc => code.includes(sc))) return 'south';
    return 'north';
  };

  // Helper pour obtenir la saison selon l'hémisphère et le mois
  const getSeasonForHemisphere = (month: number, hemisphere: 'north' | 'south'): string => {
    if (hemisphere === 'north') {
      if (month >= 3 && month <= 5) return 'printemps';
      if (month >= 6 && month <= 8) return 'ete';
      if (month >= 9 && month <= 11) return 'automne';
      return 'hiver'; // 12, 1, 2
    } else {
      // Hémisphère sud : saisons inversées
      if (month >= 3 && month <= 5) return 'automne';
      if (month >= 6 && month <= 8) return 'hiver';
      if (month >= 9 && month <= 11) return 'printemps';
      return 'ete'; // 12, 1, 2
    }
  };

  // Générer tous les mois couverts par le voyage
  const tripMonths = new Set<number>();
  let currentDate = new Date(formData.dateDepart);
  const endDate = formData.dateRetour ? new Date(formData.dateRetour) : new Date(formData.dateDepart);

  while (currentDate <= endDate) {
    tripMonths.add(currentDate.getMonth() + 1); // 1-12
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Déterminer l'hémisphère applicable
  let hemisphere: 'north' | 'south' | 'both' = 'north';

  if (!formData.pays || formData.pays.length === 0) {
    // Par défaut, hémisphère nord pour la plupart des zones
    hemisphere = formData.localisation === 'oceanie' ? 'south' : 'north';
  } else {
    // Analyser chaque pays sélectionné
    const hemispheres = new Set<'north' | 'south' | 'both'>();
    formData.pays.forEach((pays: any) => {
      hemispheres.add(getHemisphere(pays.code));
    });

    // Si pays équatorial, utiliser 'both'
    if (hemispheres.has('both')) {
      hemisphere = 'both';
    }
    // Si mélange nord/sud, utiliser 'both' aussi
    else if (hemispheres.has('north') && hemispheres.has('south')) {
      hemisphere = 'both';
    }
    // Sinon, prendre le seul hémisphère présent
    else if (hemispheres.has('north')) {
      hemisphere = 'north';
    } else if (hemispheres.has('south')) {
      hemisphere = 'south';
    }
  }

  // Pour chaque mois du voyage, déterminer la saison
  tripMonths.forEach(month => {
    if (hemisphere === 'both') {
      // Pays équatorial : toutes les saisons peuvent s'appliquer
      // On ajoute la saison correspondante pour l'hémisphère nord et sud
      seasons.add(getSeasonForHemisphere(month, 'north'));
      seasons.add(getSeasonForHemisphere(month, 'south'));
    } else {
      seasons.add(getSeasonForHemisphere(month, hemisphere));
    }
  });

  return Array.from(seasons);
}

// ==========================================
// AUTO-ATTRIBUTION DES TEMPÉRATURES
// ==========================================

/**
 * Détermine automatiquement les plages de température appropriées selon les pays et les dates de voyage
 * @param formData - Données du formulaire
 * @returns Array de températures applicables (tres-froide, froide, temperee, chaude, tres-chaude)
 */
export function autoDetectTemperatures(formData: FormData): string[] {
  if (!formData.dateDepart) return [];

  const temperatures: Set<string> = new Set();

  // Helper pour obtenir la température selon le pays et le mois
  const getTemperatureForCountry = (countryCode: string, month: number): string[] => {
    const code = countryCode.toLowerCase();
    const temps: string[] = [];

    // Pays très froids (arctiques/subarctiques)
    const arcticCountries = ['groenland', 'islande', 'norvege', 'finlande', 'suede'];
    if (arcticCountries.some(c => code.includes(c))) {
      if (month >= 11 || month <= 3) {
        temps.push('tres-froide'); // Hiver arctique
        temps.push('froide');
      } else if (month >= 4 && month <= 5) {
        temps.push('froide');
        temps.push('temperee');
      } else {
        temps.push('temperee'); // Été arctique
      }
    }

    // Pays très chauds (désertiques/tropicaux)
    const veryHotCountries = ['egypte', 'arabie-saoudite', 'emirats', 'qatar', 'koweit', 'oman', 'yemen'];
    if (veryHotCountries.some(c => code.includes(c))) {
      if (month >= 5 && month <= 9) {
        temps.push('tres-chaude'); // Été désertique
        temps.push('chaude');
      } else {
        temps.push('chaude');
        temps.push('temperee');
      }
    }

    // Pays tropicaux (chauds toute l'année)
    const tropicalCountries = ['thailande', 'vietnam', 'cambodge', 'laos', 'philippines', 'indonesie',
                              'malaisie', 'singapour', 'sri-lanka', 'maldives', 'maurice', 'seychelles',
                              'nouvelle-caledonie', 'polynesie', 'martinique', 'guadeloupe', 'reunion'];
    if (tropicalCountries.some(c => code.includes(c))) {
      temps.push('chaude');
      temps.push('tres-chaude');
    }

    // Pays d'Afrique subsaharienne
    const africanCountries = ['kenya', 'tanzanie', 'ouganda', 'rwanda', 'malawi', 'zambie', 'zimbabwe',
                             'mozambique', 'madagascar', 'senegal', 'mali', 'niger', 'tchad', 'ethiopie'];
    if (africanCountries.some(c => code.includes(c))) {
      temps.push('chaude');
      if (month >= 3 && month <= 10) {
        temps.push('tres-chaude');
      } else {
        temps.push('temperee');
      }
    }

    // Pays d'Amérique du Sud (varie selon latitude)
    const southAmericaTropical = ['colombie', 'equateur', 'perou', 'bresil', 'venezuela', 'guyane'];
    if (southAmericaTropical.some(c => code.includes(c))) {
      temps.push('chaude');
      temps.push('tres-chaude');
    }

    const southAmericaTemperate = ['argentine', 'chili', 'uruguay', 'paraguay'];
    if (southAmericaTemperate.some(c => code.includes(c))) {
      // Été austral (décembre-février)
      if (month >= 12 || month <= 2) {
        temps.push('chaude');
        temps.push('temperee');
      }
      // Hiver austral (juin-août)
      else if (month >= 6 && month <= 8) {
        temps.push('froide');
        temps.push('temperee');
      }
      // Printemps/Automne
      else {
        temps.push('temperee');
      }
    }

    // Pays d'Océanie
    const oceaniaHot = ['australie', 'nouvelle-zelande'];
    if (oceaniaHot.some(c => code.includes(c))) {
      // Été austral (décembre-février)
      if (month >= 12 || month <= 2) {
        temps.push('chaude');
        if (code.includes('australie')) temps.push('tres-chaude');
        temps.push('temperee');
      }
      // Hiver austral (juin-août)
      else if (month >= 6 && month <= 8) {
        temps.push('froide');
        temps.push('temperee');
      }
      // Printemps/Automne
      else {
        temps.push('temperee');
      }
    }

    // Pays du Moyen-Orient (chauds)
    const middleEastCountries = ['israel', 'jordanie', 'liban', 'syrie', 'irak', 'iran', 'turquie'];
    if (middleEastCountries.some(c => code.includes(c))) {
      if (month >= 6 && month <= 9) {
        temps.push('tres-chaude');
        temps.push('chaude');
      } else if (month >= 11 || month <= 2) {
        temps.push('temperee');
        temps.push('froide');
      } else {
        temps.push('chaude');
        temps.push('temperee');
      }
    }

    // Amérique du Nord
    const northAmericaCold = ['canada', 'alaska'];
    if (northAmericaCold.some(c => code.includes(c))) {
      if (month >= 11 || month <= 3) {
        temps.push('tres-froide');
        temps.push('froide');
      } else if (month >= 6 && month <= 8) {
        temps.push('temperee');
        temps.push('chaude');
      } else {
        temps.push('froide');
        temps.push('temperee');
      }
    }

    const northAmericaTemperate = ['etats-unis', 'mexique'];
    if (northAmericaTemperate.some(c => code.includes(c))) {
      if (month >= 12 || month <= 2) {
        temps.push('froide');
        temps.push('temperee');
      } else if (month >= 6 && month <= 8) {
        temps.push('chaude');
        if (code.includes('mexique')) temps.push('tres-chaude');
        temps.push('temperee');
      } else {
        temps.push('temperee');
      }
    }

    // Europe
    const europeCountries = ['france', 'espagne', 'italie', 'portugal', 'grece', 'croatie', 'allemagne',
                            'autriche', 'suisse', 'belgique', 'pays-bas', 'royaume-uni', 'irlande',
                            'pologne', 'republique-tcheque', 'hongrie', 'roumanie', 'bulgarie'];
    if (europeCountries.some(c => code.includes(c))) {
      if (month >= 12 || month <= 2) {
        temps.push('froide');
        temps.push('temperee');
      } else if (month >= 6 && month <= 8) {
        temps.push('chaude');
        temps.push('temperee');
      } else {
        temps.push('temperee');
      }
    }

    // Asie tempérée
    const asiaTemperate = ['japon', 'coree', 'chine'];
    if (asiaTemperate.some(c => code.includes(c))) {
      if (month >= 12 || month <= 2) {
        temps.push('froide');
        temps.push('temperee');
      } else if (month >= 6 && month <= 8) {
        temps.push('chaude');
        temps.push('tres-chaude');
        temps.push('temperee');
      } else {
        temps.push('temperee');
      }
    }

    // Inde et sous-continent indien
    const indiaCountries = ['inde', 'pakistan', 'bangladesh', 'nepal', 'bhoutan'];
    if (indiaCountries.some(c => code.includes(c))) {
      if (month >= 4 && month <= 6) {
        temps.push('tres-chaude');
        temps.push('chaude');
      } else if (month >= 12 || month <= 2) {
        temps.push('temperee');
        if (code.includes('nepal') || code.includes('bhoutan')) {
          temps.push('froide');
        }
      } else {
        temps.push('chaude');
        temps.push('temperee');
      }
    }

    return temps;
  };

  // Générer tous les mois couverts par le voyage
  const tripMonths = new Set<number>();
  let currentDate = new Date(formData.dateDepart);
  const endDate = formData.dateRetour ? new Date(formData.dateRetour) : new Date(formData.dateDepart);

  while (currentDate <= endDate) {
    tripMonths.add(currentDate.getMonth() + 1); // 1-12
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Si aucun pays sélectionné, utiliser des températures par défaut basées sur la zone
  if (!formData.pays || formData.pays.length === 0) {
    const zoneTemps: Record<string, string[]> = {
      'europe': ['temperee', 'froide'],
      'asie': ['chaude', 'temperee'],
      'afrique': ['tres-chaude', 'chaude'],
      'amerique-nord': ['temperee', 'froide'],
      'amerique-sud': ['chaude', 'temperee'],
      'amerique-centrale-caraibes': ['tres-chaude', 'chaude'],
      'oceanie': ['chaude', 'temperee'],
      'multi-destinations': ['temperee', 'chaude', 'froide']
    };

    const defaultTemps = zoneTemps[formData.localisation] || ['temperee'];
    defaultTemps.forEach(t => temperatures.add(t));
  } else {
    // Analyser chaque pays pour chaque mois du voyage
    formData.pays.forEach((pays: any) => {
      tripMonths.forEach(month => {
        const temps = getTemperatureForCountry(pays.code, month);
        temps.forEach(t => temperatures.add(t));
      });
    });
  }

  // Si aucune température détectée, utiliser 'temperee' par défaut
  if (temperatures.size === 0) {
    temperatures.add('temperee');
  }

  return Array.from(temperatures);
}

// ==========================================
// SUGGESTIONS AUTOMATIQUES (NON FORCÉES)
// ==========================================

/**
 * Génère des suggestions automatiques basées sur température/saison/destination
 * Ces suggestions NE sont PAS ajoutées automatiquement
 */
export function generateAutoSuggestions(formData: FormData): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  // Normaliser temperature et saison en tableaux
  const temperatures = Array.isArray(formData.temperature)
    ? formData.temperature
    : [formData.temperature];

  const saisons = Array.isArray(formData.saison)
    ? formData.saison
    : [formData.saison];

  // Helper function pour déterminer les zones géographiques couvertes
  const getApplicableRegions = (): string[] => {
    if (formData.localisation !== 'multi-destinations') {
      return [formData.localisation];
    }

    // Pour multi-destinations, extraire les zones des pays sélectionnés
    const regions = new Set<string>();
    const data = checklistCompleteData as any;

    if (formData.pays && formData.pays.length > 0) {
      // Parcourir toutes les zones pour trouver les pays
      Object.entries(data.localisations || {}).forEach(([zoneCode, zoneData]: [string, any]) => {
        if (zoneCode === 'multi-destinations') return;

        const zonePays = zoneData.pays || [];
        // Vérifier si au moins un pays sélectionné appartient à cette zone
        const hasCountryInZone = formData.pays.some((selectedPays: any) =>
          zonePays.some((zonePay: any) => zonePay.code === selectedPays.code)
        );

        if (hasCountryInZone) {
          regions.add(zoneCode);
        }
      });
    }

    return Array.from(regions);
  };

  /**
   * Helper pour vérifier si la période de voyage (dateDepart -> dateRetour) chevauche une période donnée
   * @param periodStart - Mois de début de la période à vérifier (1-12)
   * @param periodEnd - Mois de fin de la période à vérifier (1-12)
   * @returns true si la période de voyage chevauche la période donnée
   */
  const tripOverlapsPeriod = (periodStart: number, periodEnd: number): boolean => {
    if (!formData.dateDepart) return false;

    const startMonth = new Date(formData.dateDepart).getMonth() + 1; // 1-12
    let endMonth = startMonth;

    // Si on a une date de retour, calculer le mois de fin
    if (formData.dateRetour) {
      endMonth = new Date(formData.dateRetour).getMonth() + 1;
    }

    // Générer tous les mois couverts par le voyage
    const tripMonths = new Set<number>();
    let currentDate = new Date(formData.dateDepart);
    const endDate = formData.dateRetour ? new Date(formData.dateRetour) : new Date(formData.dateDepart);

    while (currentDate <= endDate) {
      tripMonths.add(currentDate.getMonth() + 1); // 1-12
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Générer tous les mois de la période à vérifier
    const periodMonths = new Set<number>();
    if (periodStart > periodEnd) {
      // Période qui traverse l'année (ex: nov-avril = 11-4)
      for (let m = periodStart; m <= 12; m++) periodMonths.add(m);
      for (let m = 1; m <= periodEnd; m++) periodMonths.add(m);
    } else {
      for (let m = periodStart; m <= periodEnd; m++) periodMonths.add(m);
    }

    // Vérifier s'il y a un chevauchement
    return Array.from(tripMonths).some(m => periodMonths.has(m));
  };

  const applicableRegions = getApplicableRegions();

  // === RÈGLE 1 : Température très chaude → Canicule ===
  if (temperatures.includes('tres-chaude')) {
    // Vérifier si pas déjà sélectionné
    if (!formData.conditionsClimatiques?.includes('climat_canicule')) {
      suggestions.push({
        conditionId: 'climat_canicule',
        nom: '🔥 Chaleur extrême (>40°C)',
        emoji: '🔥',
        raison: 'Température très chaude sélectionnée - équipements chaleur extrême recommandés',
        priorite: 'haute'
      });
    }

    // Si destination désertique, suggérer aussi canicule désertique
    if (applicableRegions.some(r => ['afrique', 'asie', 'oceanie'].includes(r))) {
      if (!formData.conditionsClimatiques?.includes('climat_desert_extreme')) {
        suggestions.push({
          conditionId: 'climat_desert_extreme',
          nom: '🏜️ Canicule désertique (>45°C)',
          emoji: '🏜️',
          raison: 'Destination avec zones désertiques possibles en climat très chaud',
          priorite: 'moyenne'
        });
      }
    }
  }

  // === RÈGLE 2 : Température très froide → Froid polaire ===
  if (temperatures.includes('tres-froide')) {
    if (!formData.conditionsClimatiques?.includes('climat_froid_intense')) {
      suggestions.push({
        conditionId: 'climat_froid_intense',
        nom: '🥶 Froid polaire (<-20°C)',
        emoji: '🥶',
        raison: 'Température très froide sélectionnée - équipements grand froid essentiels',
        priorite: 'haute'
      });
    }
  }

  // === RÈGLE 3 : Hiver → Neige ===
  if (saisons.includes('hiver')) {
    if (!formData.conditionsClimatiques?.includes('climat_neige')) {
      // Seulement pour certaines destinations
      if (applicableRegions.some(r => ['europe', 'amerique-nord', 'asie'].includes(r))) {
        suggestions.push({
          conditionId: 'climat_neige',
          nom: '❄️ Neige / Blizzard',
          emoji: '❄️',
          raison: 'Saison hivernale dans une région avec risque de neige',
          priorite: 'haute'
        });
      }
    }
  }

  // === RÈGLE 4 : Été + Asie → Mousson ===
  if (applicableRegions.includes('asie')) {
    if (!formData.conditionsClimatiques?.includes('climat_mousson')) {
      // Mousson Asie: mai-octobre (5-10)
      // Vérifier si le voyage chevauche cette période
      if (tripOverlapsPeriod(5, 10)) {
        suggestions.push({
          conditionId: 'climat_mousson',
          nom: '🌧️ Saison des pluies / Mousson',
          emoji: '🌧️',
          raison: 'Période de mousson probable en Asie entre mai et octobre',
          priorite: 'haute'
        });
      }
    }
  }

  // === RÈGLE 5 : Caraïbes + Juin-Novembre → Cyclones ===
  if (applicableRegions.includes('amerique-centrale-caraibes')) {
    if (!formData.conditionsClimatiques?.includes('climat_cyclones')) {
      // Saison cyclonique: juin-novembre (6-11)
      if (tripOverlapsPeriod(6, 11)) {
        suggestions.push({
          conditionId: 'climat_cyclones',
          nom: '🌀 Cyclones / Ouragans',
          emoji: '🌀',
          raison: 'Saison cyclonique active dans les Caraïbes (juin à novembre)',
          priorite: 'haute'
        });
      }
    }
  }

  // === RÈGLE 6 : Activités plage/nautiques + zones tropicales → Climat marin ===
  if (
    (formData.activites.includes('plage') || formData.activites.includes('sports-nautiques')) &&
    applicableRegions.some(r => ['amerique-centrale-caraibes', 'oceanie', 'asie', 'afrique'].includes(r))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_marin')) {
      suggestions.push({
        conditionId: 'climat_marin',
        nom: '🌊 Environnement marin',
        emoji: '🌊',
        raison: 'Activités marines dans une région côtière',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 7 : Randonnée + Certaines destinations → Altitude ===
  if (formData.activites.includes('randonnee')) {
    if (applicableRegions.some(r => ['amerique-sud', 'asie', 'afrique'].includes(r))) {
      if (!formData.conditionsClimatiques?.some(c => c.startsWith('climat_altitude_'))) {
        suggestions.push({
          conditionId: 'climat_altitude_temperee',
          nom: '🏔️ Altitude modérée (2500-3500m)',
          emoji: '🏔️',
          raison: 'Randonnée dans une région avec possibilité d\'altitude significative',
          priorite: 'moyenne'
        });
      }
    }
  }

  // === RÈGLE 8 : Zones tropicales → Climat tropical humide ===
  if (
    applicableRegions.some(r => ['amerique-sud', 'afrique', 'asie', 'oceanie'].includes(r)) &&
    temperatures.some(t => ['chaude', 'tres-chaude'].includes(t))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_tropical_humide')) {
      suggestions.push({
        conditionId: 'climat_tropical_humide',
        nom: '🏝️ Climat tropical humide',
        emoji: '🏝️',
        raison: 'Zone tropicale avec chaleur et humidité élevées',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 9 : Zones équatoriales → Orages tropicaux ===
  if (applicableRegions.some(r => ['amerique-centrale-caraibes', 'afrique', 'asie', 'amerique-sud'].includes(r))) {
    if (!formData.conditionsClimatiques?.includes('climat_orages')) {
      // Orages fréquents mars-juillet zones tropicales
      if (tripOverlapsPeriod(3, 7)) {
        suggestions.push({
          conditionId: 'climat_orages',
          nom: '⛈️ Orages tropicaux fréquents',
          emoji: '⛈️',
          raison: 'Période d\'orages intenses dans les zones tropicales',
          priorite: 'moyenne'
        });
      }
    }
  }

  // === RÈGLE 10 : Harmattan (Afrique de l'Ouest) ===
  if (applicableRegions.includes('afrique')) {
    if (!formData.conditionsClimatiques?.includes('climat_harmattan')) {
      // Harmattan: novembre-mars (période qui traverse l'année)
      if (tripOverlapsPeriod(11, 3)) {
        suggestions.push({
          conditionId: 'climat_harmattan',
          nom: '🌬️ Harmattan (vent de sable)',
          emoji: '🌬️',
          raison: 'Saison de l\'Harmattan en Afrique de l\'Ouest',
          priorite: 'moyenne'
        });
      }
    }
  }

  // === RÈGLE 11 : Zones volcaniques actives ===
  const volcanicCountries = ['islande', 'indonesie', 'japon', 'philippines', 'equateur', 'guatemala', 'costa-rica', 'nouvelle-zelande'];
  const hasVolcanicCountry = formData.pays?.some((p: any) =>
    volcanicCountries.some(vc => p.code.toLowerCase().includes(vc))
  );

  if (hasVolcanicCountry && formData.activites.includes('randonnee')) {
    if (!formData.conditionsClimatiques?.includes('climat_volcanique')) {
      suggestions.push({
        conditionId: 'climat_volcanique',
        nom: '🌋 Zone volcanique active',
        emoji: '🌋',
        raison: 'Destination avec volcans actifs et activité randonnée',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 12 : Jungle dense ===
  if (
    (formData.activites.includes('randonnee') || formData.activites.includes('backpacking')) &&
    applicableRegions.some(r => ['amerique-sud', 'afrique', 'asie', 'oceanie'].includes(r))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_jungle_dense')) {
      suggestions.push({
        conditionId: 'climat_jungle_dense',
        nom: '🌲 Forêt dense / Jungle',
        emoji: '🌲',
        raison: 'Trekking dans des régions avec forêts tropicales denses',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 13 : Désert aride ===
  if (
    temperatures.some(t => ['chaude', 'tres-chaude'].includes(t)) &&
    applicableRegions.some(r => ['afrique', 'asie', 'oceanie'].includes(r))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_desert_aride')) {
      suggestions.push({
        conditionId: 'climat_desert_aride',
        nom: '🐫 Désert aride',
        emoji: '🐫',
        raison: 'Climat désertique avec températures élevées',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 14 : Amplitude thermique extrême (déserts) ===
  if (
    formData.conditionsClimatiques?.some(c => c.includes('desert') || c === 'climat_sec_aride') ||
    (temperatures.some(t => ['chaude', 'tres-chaude'].includes(t)) &&
     applicableRegions.some(r => ['afrique', 'asie'].includes(r)))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_amplitude_thermique')) {
      suggestions.push({
        conditionId: 'climat_amplitude_thermique',
        nom: '🌡️ Amplitude thermique extrême',
        emoji: '🌡️',
        raison: 'Grandes variations de température jour/nuit en zone désertique',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 15 : Humidité extrême (zones tropicales) ===
  if (
    applicableRegions.some(r => ['asie', 'amerique-sud', 'afrique', 'oceanie'].includes(r)) &&
    temperatures.some(t => ['chaude', 'tres-chaude'].includes(t))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_humidite')) {
      suggestions.push({
        conditionId: 'climat_humidite',
        nom: '💧 Humidité extrême (>85%)',
        emoji: '💧',
        raison: 'Zone tropicale avec humidité très élevée',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 16 : Sécheresse extrême ===
  if (
    temperatures.some(t => ['chaude', 'tres-chaude'].includes(t)) &&
    (formData.conditionsClimatiques?.includes('climat_desert_aride') ||
     formData.conditionsClimatiques?.includes('climat_sec_aride'))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_secheresse')) {
      suggestions.push({
        conditionId: 'climat_secheresse',
        nom: '🏜️ Sécheresse extrême (<20%)',
        emoji: '🏜️',
        raison: 'Humidité très basse en zone aride',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 17 : Vents forts (Patagonie, zones montagneuses) ===
  const windyCountries = ['argentine', 'chili', 'islande', 'nouvelle-zelande'];
  const hasWindyCountry = formData.pays?.some((p: any) =>
    windyCountries.some(wc => p.code.toLowerCase().includes(wc))
  );

  if (hasWindyCountry || (formData.activites.includes('randonnee') && applicableRegions.includes('amerique-sud'))) {
    if (!formData.conditionsClimatiques?.includes('climat_vents_forts')) {
      suggestions.push({
        conditionId: 'climat_vents_forts',
        nom: '💨 Vents violents / Tempêtes',
        emoji: '💨',
        raison: 'Région connue pour ses vents violents',
        priorite: 'moyenne'
      });
    }
  }

  // === RÈGLE 18 : Altitude haute (>3500m) pour trek avancé ===
  if (
    formData.activites.includes('randonnee') &&
    applicableRegions.some(r => ['asie', 'amerique-sud'].includes(r))
  ) {
    const highAltitudeCountries = ['nepal', 'tibet', 'perou', 'bolivie', 'equateur'];
    const hasHighAltitude = formData.pays?.some((p: any) =>
      highAltitudeCountries.some(hac => p.code.toLowerCase().includes(hac))
    );

    if (hasHighAltitude && !formData.conditionsClimatiques?.includes('climat_altitude_haute')) {
      suggestions.push({
        conditionId: 'climat_altitude_haute',
        nom: '⛰️ Haute altitude (3500-5500m)',
        emoji: '⛰️',
        raison: 'Trek en haute montagne dans une région d\'altitude extrême',
        priorite: 'haute'
      });
    }
  }

  // === RÈGLE 19 : Arctique / Banquise ===
  if (temperatures.includes('tres-froide')) {
    const arcticCountries = ['groenland', 'islande', 'norvege', 'finlande', 'canada', 'alaska'];
    const hasArcticCountry = formData.pays?.some((p: any) =>
      arcticCountries.some(ac => p.code.toLowerCase().includes(ac))
    );

    if (hasArcticCountry && tripOverlapsPeriod(11, 3)) {
      if (!formData.conditionsClimatiques?.includes('climat_arctique')) {
        suggestions.push({
          conditionId: 'climat_arctique',
          nom: '❄️ Banquise / Arctique',
          emoji: '❄️',
          raison: 'Région arctique en plein hiver avec conditions extrêmes',
          priorite: 'haute'
        });
      }
    }
  }

  // === RÈGLE 20 : Brouillard (côtes, montagnes) ===
  if (
    formData.activites.includes('randonnee') &&
    (applicableRegions.includes('europe') || applicableRegions.includes('amerique-nord'))
  ) {
    if (!formData.conditionsClimatiques?.includes('climat_brouillard')) {
      // Brouillard fréquent automne/hiver (octobre-mars)
      if (tripOverlapsPeriod(10, 3)) {
        suggestions.push({
          conditionId: 'climat_brouillard',
          nom: '🌫️ Brouillard dense',
          emoji: '🌫️',
          raison: 'Période propice au brouillard en zone montagneuse ou côtière',
          priorite: 'moyenne'
        });
      }
    }
  }

  return suggestions;
}

// ==========================================
// DESTINATIONS SPÉCIFIQUES (BACKEND)
// ==========================================

/**
 * Retourne les items de destinations spécifiques (désert, jungle, montagne)
 * Logique backend uniquement, pas visible dans le formulaire
 */
function getDestinationSpecificItems(formData: FormData): DestinationSpecifiqueItem[] {
  const data = climatData as any;
  const allItems: DestinationSpecifiqueItem[] = [];

  if (!data.destinationsSpecifiques) return allItems;

  // Helper function pour déterminer les zones géographiques couvertes (même que generateAutoSuggestions)
  const getApplicableRegions = (): string[] => {
    if (formData.localisation !== 'multi-destinations') {
      return [formData.localisation];
    }

    const regions = new Set<string>();
    const locData = checklistCompleteData as any;

    if (formData.pays && formData.pays.length > 0) {
      Object.entries(locData.localisations || {}).forEach(([zoneCode, zoneData]: [string, any]) => {
        if (zoneCode === 'multi-destinations') return;

        const zonePays = zoneData.pays || [];
        const hasCountryInZone = formData.pays.some((selectedPays: any) =>
          zonePays.some((zonePay: any) => zonePay.code === selectedPays.code)
        );

        if (hasCountryInZone) {
          regions.add(zoneCode);
        }
      });
    }

    return Array.from(regions);
  };

  const applicableRegions = getApplicableRegions();

  // === DÉSERT ===
  const desertTrigger = data.destinationsSpecifiques.desert.trigger;
  if (
    applicableRegions.some((r: string) => desertTrigger.destinations.includes(r)) &&
    (
      formData.activites.some((act: string) => desertTrigger.activites.includes(act)) ||
      formData.conditionsClimatiques?.some((c: string) =>
        desertTrigger.ou_conditions.includes(c)
      )
    )
  ) {
    const desertItems = data.destinationsSpecifiques.desert.items;
    desertItems.forEach((item: DestinationSpecifiqueItem) => {
      // Vérifier filtres activités si présents
      if (!item.filtres?.activites ||
          formData.activites.some(act => item.filtres!.activites!.includes(act))) {
        allItems.push(item);
      }
    });
  }

  // === JUNGLE ===
  const jungleTrigger = data.destinationsSpecifiques.jungle.trigger;
  if (
    applicableRegions.some((r: string) => jungleTrigger.destinations.includes(r)) &&
    (
      formData.activites.some((act: string) => jungleTrigger.activites.includes(act)) ||
      formData.conditionsClimatiques?.some((c: string) =>
        jungleTrigger.ou_conditions.includes(c)
      )
    )
  ) {
    const jungleItems = data.destinationsSpecifiques.jungle.items;
    jungleItems.forEach((item: DestinationSpecifiqueItem) => {
      if (!item.filtres?.activites ||
          formData.activites.some(act => item.filtres!.activites!.includes(act))) {
        allItems.push(item);
      }
    });
  }

  // === MONTAGNE ALTITUDE ===
  const montagneTrigger = data.destinationsSpecifiques.montagne_altitude.trigger;
  if (
    applicableRegions.some((r: string) => montagneTrigger.destinations.includes(r)) &&
    (
      formData.activites.some((act: string) => montagneTrigger.activites.includes(act)) ||
      formData.conditionsClimatiques?.some((c: string) =>
        montagneTrigger.ou_conditions.includes(c)
      )
    )
  ) {
    const montagneItems = data.destinationsSpecifiques.montagne_altitude.items;
    montagneItems.forEach((item: DestinationSpecifiqueItem) => {
      if (!item.filtres?.activites ||
          formData.activites.some(act => item.filtres!.activites!.includes(act))) {
        allItems.push(item);
      }
    });
  }

  return allItems;
}

// ==========================================
// HELPERS POUR UI
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

  const matchesAct = matchesActivites(
    condition.filtres?.activites,
    formData.activites
  );

  const matchesPer = matchesPeriode(
    condition.filtres?.periode || [],
    formData.dateDepart,
    formData.localisation
  );

  if (matchesDest && matchesAct && matchesPer) {
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
🗓️ Saisons: ${Array.isArray(formData.saison) ? formData.saison.join(', ') : formData.saison}
🎭 Activités: ${formData.activites.join(', ')}
🌦️ Conditions: ${formData.conditionsClimatiques?.join(', ') || 'Aucune'}
  `.trim();
}

/**
 * Exporte toutes les fonctions utiles
 */
export default {
  getClimatEquipment,
  generateAutoSuggestions,
  autoDetectSeasons,
  getSuggestionDetails,
  acceptSuggestion,
  getFilterSummary
};
