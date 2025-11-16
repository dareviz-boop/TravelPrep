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
      'zimbabwe', 'mozambique', 'madagascar'
    ];
    
    const code = countryCode.toLowerCase();
    if (southernCountries.some(country => code.includes(country))) {
      return 'south';
    }
    
    return 'north';
  };

  // Helper pour obtenir la saison selon l'hémisphère et le mois
  const getSeasonForMonth = (month: number, hemisphere: 'north' | 'south'): string => {
    // Hémisphère nord
    if (hemisphere === 'north') {
      if (month >= 3 && month <= 5) return 'printemps';
      if (month >= 6 && month <= 8) return 'ete';
      if (month >= 9 && month <= 11) return 'automne';
      return 'hiver'; // Décembre-Février
    }
    
    // Hémisphère sud (saisons inversées)
    if (month >= 3 && month <= 5) return 'automne';
    if (month >= 6 && month <= 8) return 'hiver';
    if (month >= 9 && month <= 11) return 'printemps';
    return 'ete'; // Décembre-Février
  };

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

  // Déterminer les saisons pour chaque pays et chaque mois
  if (formData.pays && formData.pays.length > 0) {
    formData.pays.forEach((pays: any) => {
      const hemisphere = getHemisphere(pays.code || pays.nom);
      
      travelMonths.forEach(month => {
        const season = getSeasonForMonth(month, hemisphere);
        seasons.add(season);
      });
    });
  }

  return Array.from(seasons);
}

// ==========================================
// AUTO-ATTRIBUTION DES TEMPÉRATURES
// ==========================================

/**
 * Détermine automatiquement les températures probables selon les pays, saisons et date
 * @param formData - Données du formulaire
 * @returns Array de températures applicables (tres-froide, froide, temperee, chaude, tres-chaude)
 */
export function autoDetectTemperatures(formData: FormData): string[] {
  if (!formData.pays || formData.pays.length === 0 || !formData.dateDepart) return [];

  const temperatures: Set<string> = new Set();
  const month = new Date(formData.dateDepart).getMonth() + 1; // 1-12

  // Pays très froids (arctiques/polaires)
  const coldCountries = ['groenland', 'islande', 'finlande', 'norvege', 'suede', 'alaska', 'canada'];

  // Pays très chauds (désertiques/tropicaux)
  const hotCountries = ['arabie', 'emirats', 'qatar', 'egypte', 'libye', 'niger', 'tchad', 'soudan', 'australie', 'inde'];

  // Pays tropicaux chauds (Asie du Sud-Est et autres)
  const tropicalCountries = ['thailande', 'thailand', 'vietnam', 'indonesie', 'indonesia', 'philippines', 'malaisie', 'malaysia', 'singapour', 'singapore', 'bresil', 'brazil', 'colombie', 'colombia', 'cambodge', 'cambodia', 'laos', 'myanmar', 'birmanie'];

  formData.pays.forEach((pays: any) => {
    const code = (pays.code || pays.nom || '').toLowerCase();
    const nom = (pays.nom || '').toLowerCase();

    // Pays très froids
    if (coldCountries.some(cc => code.includes(cc) || nom.includes(cc))) {
      if (month >= 11 || month <= 3) {
        temperatures.add('tres-froide'); // Hiver arctique
      } else if ((month >= 4 && month <= 5) || (month >= 9 && month <= 10)) {
        temperatures.add('froide'); // Printemps/automne
      } else {
        temperatures.add('temperee'); // Été court
      }
    }
    // Pays très chauds (déserts)
    else if (hotCountries.some(hc => code.includes(hc) || nom.includes(hc))) {
      if (month >= 5 && month <= 9) {
        temperatures.add('tres-chaude'); // Été désertique
      } else {
        temperatures.add('chaude'); // Hiver plus doux
      }
    }
    // Pays tropicaux (Asie du Sud-Est, Amérique Latine tropicale)
    else if (tropicalCountries.some(tc => code.includes(tc) || nom.includes(tc))) {
      // Toute l'année : chaude ou très chaude
      temperatures.add('chaude'); // Base minimale

      // Asie du Sud-Est : pic de chaleur avant la mousson (mars-mai)
      // + mousson chaude et humide (mai-octobre)
      if ((month >= 3 && month <= 5) || (month >= 6 && month <= 10)) {
        temperatures.add('tres-chaude'); // Saison chaude/mousson
      }
    }
    // Hémisphère nord tempéré (Europe, Amérique du Nord, Asie tempérée)
    else if (month >= 6 && month <= 8) {
      temperatures.add('chaude'); // Été
    } else if (month >= 12 || month <= 2) {
      temperatures.add('froide'); // Hiver
    } else {
      temperatures.add('temperee'); // Printemps/automne
    }
  });

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

  // Parcourir toutes les conditions climatiques
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
      // Skip si déjà sélectionné
      if (formData.conditionsClimatiques?.includes(item.id)) return;

      // Vérifier si l'item a des suggestions
      if (!item.suggestions) return;

      const { temperature: suggestedTemps, saison: suggestedSeasons, description } = item.suggestions;

      let matches = false;
      let raison = '';
      let priorite: 'haute' | 'moyenne' | 'basse' = 'moyenne';

      // Correspondance température
      if (suggestedTemps && suggestedTemps.length > 0) {
        const tempMatch = temperatures.some(t => suggestedTemps.includes(t));
        if (tempMatch) {
          matches = true;
          raison = `Température adaptée (${temperatures.join(', ')})`;
          priorite = 'haute';
        }
      }

      // Correspondance saison
      if (suggestedSeasons && suggestedSeasons.length > 0) {
        const seasonMatch = saisons.some(s => suggestedSeasons.includes(s));
        if (seasonMatch) {
          matches = true;
          if (raison) {
            raison += ` et saison (${saisons.join(', ')})`;
          } else {
            raison = `Saison adaptée (${saisons.join(', ')})`;
            priorite = 'moyenne';
          }
        }
      }

      // Correspondance destination
      if (item.filtres?.destinations && item.filtres.destinations.length > 0) {
        const destMatch = matchesDestination(item.filtres.destinations, formData.localisation);
        if (destMatch) {
          matches = true;
          if (raison) {
            raison += ' et destination';
          } else {
            raison = 'Destination adaptée';
            priorite = 'basse';
          }
        }
      }

      // Ajouter à la liste des suggestions si match
      if (matches) {
        suggestions.push({
          conditionId: item.id,
          nom: item.nom,
          emoji: item.emoji,
          raison: description || raison,
          priorite
        });
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
