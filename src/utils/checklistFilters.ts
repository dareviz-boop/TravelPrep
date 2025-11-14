/**
 * Système de filtrage intelligent pour checklists climatiques
 * Adapte automatiquement les équipements selon les conditions du voyage
 *
 * @module checklistFilters
 * @version 3.0
 * @author TravelPrep Team
 */

import { FormData } from '@/types/form';
import climatDataV3 from '@/data/checklist_climat_meteo_v3.json';

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
  const data = climatDataV3 as any;

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
    if (['afrique', 'asie', 'oceanie'].includes(formData.localisation)) {
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
      if (['europe', 'amerique-nord', 'asie'].includes(formData.localisation)) {
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
  if (saisons.includes('ete') && formData.localisation === 'asie') {
    if (!formData.conditionsClimatiques?.includes('climat_mousson')) {
      const month = new Date(formData.dateDepart).getMonth() + 1;
      // Mousson Asie: mai-octobre (5-10)
      if (month >= 5 && month <= 10) {
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
  if (formData.localisation === 'amerique-centrale-caraibes') {
    const month = new Date(formData.dateDepart).getMonth() + 1;
    if (month >= 6 && month <= 11) {
      if (!formData.conditionsClimatiques?.includes('climat_cyclones')) {
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
    ['amerique-centrale-caraibes', 'oceanie', 'asie', 'afrique'].includes(formData.localisation)
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
    if (['amerique-sud', 'asie', 'afrique'].includes(formData.localisation)) {
      if (!formData.conditionsClimatiques?.some(c => c.startsWith('climat_altitude_'))) {
        suggestions.push({
          conditionId: 'climat_altitude_moderee',
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
    ['amerique-sud', 'afrique', 'asie', 'oceanie'].includes(formData.localisation) &&
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
  const data = climatDataV3 as any;
  const allItems: DestinationSpecifiqueItem[] = [];

  if (!data.destinationsSpecifiques) return allItems;

  // === DÉSERT ===
  const desertTrigger = data.destinationsSpecifiques.desert.trigger;
  if (
    desertTrigger.destinations.includes(formData.localisation) &&
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
    jungleTrigger.destinations.includes(formData.localisation) &&
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
    montagneTrigger.destinations.includes(formData.localisation) &&
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
  getSuggestionDetails,
  acceptSuggestion,
  getFilterSummary
};
