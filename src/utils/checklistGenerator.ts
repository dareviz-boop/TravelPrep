/**
 * Générateur de checklist complet
 * Combine tous les items : activités + climat + essentiels
 */

import { FormData } from '@/types/form';
import { getClimatEquipment, ChecklistSection, DestinationSpecifiqueItem } from '@/utils/checklistFilters';
import activitesData from '@/data/checklist_activites.json';
import checklistData from '@/data/checklistComplete.json';
import coreSectionsData from '@/data/checklist_core_sections.json';

// ==========================================
// TYPES
// ==========================================

export interface ChecklistItem {
  id?: string;
  item: string;
  priorite: string;
  delai?: string;
  quantite?: string;
  specifications?: string[];
  conseils?: string;
  filtres?: any;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Convertit les priorités étoiles en priorité textuelle
 * @param stars - Priorité en étoiles (⭐⭐⭐, ⭐⭐, ⭐)
 * @returns Priorité textuelle (haute, moyenne, basse)
 */
function mapStarsToPriority(stars: string): string {
  const starCount = (stars.match(/⭐/g) || []).length;
  if (starCount >= 3) return 'haute';
  if (starCount === 2) return 'moyenne';
  return 'basse';
}

export interface GeneratedChecklistSection {
  id: string;
  nom: string;
  emoji?: string;
  items: ChecklistItem[];
  source: 'core' | 'activite' | 'climat' | 'destination_specifique';
  conseils?: string;
}

export interface GeneratedChecklist {
  metadata: {
    nomVoyage: string;
    destination: string;
    pays: string[];
    dateDepart: string;
    dateRetour?: string;
    duree: string;
    activites: string[];
    temperature: string[];
    saison: string[];
    conditionsClimatiques: string[];
    profil: string;
    typeVoyage: string;
    confort: string;
    generatedAt: string;
  };
  sections: GeneratedChecklistSection[];
  stats: {
    totalSections: number;
    totalItems: number;
    itemsParPriorite: {
      haute: number;
      moyenne: number;
      basse: number;
    };
  };
}

// ==========================================
// FONCTION PRINCIPALE
// ==========================================

/**
 * Génère la checklist complète personnalisée
 */
export function generateCompleteChecklist(formData: FormData): GeneratedChecklist {
  const sections: GeneratedChecklistSection[] = [];

  // === 1. SECTIONS PRINCIPALES depuis checklist_core_sections.json ===
  const coreSections = getCoreSections(formData);
  sections.push(...coreSections);

  // === 2. ITEMS PAR ACTIVITÉS SÉLECTIONNÉES ===
  const activitesSections = getActivitesSections(formData);
  sections.push(...activitesSections);

  // === 3. ITEMS CLIMATIQUES (filtrage intelligent) ===
  const climatSections = getClimatSections(formData);
  sections.push(...climatSections);

  // === 4. FILTRER SELON PROFIL/CONFORT/DURÉE ===
  const filteredSections = filterByProfile(sections, formData);

  // === 5. CONSTRUIRE L'OBJET FINAL ===
  const checklist: GeneratedChecklist = {
    metadata: {
      nomVoyage: formData.nomVoyage,
      destination: formData.localisation,
      pays: formData.pays.map(p => p.nom),
      dateDepart: formData.dateDepart,
      dateRetour: formData.dateRetour,
      duree: formData.duree,
      activites: formData.activites,
      temperature: formData.temperature,
      saison: formData.saison,
      conditionsClimatiques: formData.conditionsClimatiques || [],
      profil: formData.profil,
      typeVoyage: formData.typeVoyage,
      confort: formData.confort,
      generatedAt: new Date().toISOString()
    },
    sections: filteredSections,
    stats: calculateStats(filteredSections)
  };

  return checklist;
}

// ==========================================
// SECTIONS : PRINCIPALES (CORE)
// ==========================================

/**
 * Charge les sections principales depuis checklist_core_sections.json
 * Ces sections incluent : essentiels, documents, finances, sante, hygiene, etc.
 */
function getCoreSections(formData: FormData): GeneratedChecklistSection[] {
  const sections: GeneratedChecklistSection[] = [];

  // Récupérer les sections sélectionnées par l'utilisateur
  // (Pour l'instant on charge toutes les sections disponibles avec items)
  const sectionsInclure = formData.sectionsInclure || [];

  // Liste des sections à toujours inclure (essentiels obligatoire)
  const sectionsToLoad = ['essentiels', ...sectionsInclure];

  // Parcourir les sections du JSON
  Object.keys(coreSectionsData).forEach(sectionKey => {
    // Ignorer metadata et sections vides
    if (sectionKey === 'metadata') return;

    const section = (coreSectionsData as any)[sectionKey];

    // Vérifier si la section a des items et est sélectionnée
    if (section.items && section.items.length > 0) {
      // Charger si : obligatoire, ou dans sectionsInclure, ou essentiels
      const shouldInclude =
        section.obligatoire ||
        sectionsToLoad.includes(sectionKey) ||
        sectionKey === 'essentiels';

      if (shouldInclude) {
        // Mapper les items avec conversion de priorité
        const mappedItems: ChecklistItem[] = section.items.map((item: any) => ({
          id: item.id,
          item: item.item,
          priorite: mapStarsToPriority(item.priorite || '⭐⭐'),
          delai: item.delai,
          conseils: item.conseils || ''
        }));

        sections.push({
          id: section.id,
          nom: section.nom,
          emoji: section.nom.match(/^[\u{1F000}-\u{1F9FF}]/u)?.[0],
          items: mappedItems,
          source: 'core',
          conseils: section.description || ''
        });
      }
    }
  });

  return sections;
}

// ==========================================
// SECTIONS : ACTIVITÉS
// ==========================================

function getActivitesSections(formData: FormData): GeneratedChecklistSection[] {
  const sections: GeneratedChecklistSection[] = [];

  formData.activites.forEach(activityId => {
    const activity = activitesData.activites.find((a: any) => a.activity_id === activityId);

    if (activity) {
      // Filtrer les items selon destination/durée si filtres présents
      const filteredItems = activity.items.filter((item: any) => {
        // Si l'item a des filtres destinations
        if (item.filtres?.destinations) {
          if (!item.filtres.destinations.includes(formData.localisation)) {
            return false;
          }
        }

        // Si l'item a des filtres durée
        if (item.filtres?.duree) {
          if (!item.filtres.duree.includes(formData.duree)) {
            return false;
          }
        }

        // Si l'item a des filtres profil
        if (item.filtres?.profil) {
          if (!item.filtres.profil.includes(formData.profil)) {
            return false;
          }
        }

        return true;
      });

      sections.push({
        id: activity.activity_id,
        nom: activity.nom,
        emoji: '🎯',
        items: filteredItems,
        source: 'activite',
        conseils: `Équipements spécifiques pour ${activity.nom}`
      });
    }
  });

  return sections;
}

// ==========================================
// SECTIONS : CLIMAT
// ==========================================

function getClimatSections(formData: FormData): GeneratedChecklistSection[] {
  // Utiliser le système de filtrage intelligent
  const climatSections = getClimatEquipment(formData);

  // Convertir vers le format GeneratedChecklistSection
  return climatSections.map(section => {
    // Les items peuvent être des strings ou des objets DestinationSpecifiqueItem
    const formattedItems: ChecklistItem[] = section.items.map(item => {
      if (typeof item === 'string') {
        // Item climat simple (string)
        return {
          item: item,
          priorite: 'moyenne', // Priorité par défaut
          conseils: ''
        };
      } else {
        // Item destination spécifique (objet complet)
        return {
          id: item.id,
          item: item.item,
          priorite: item.priorite,
          delai: item.delai,
          quantite: item.quantite,
          specifications: item.specifications,
          conseils: item.conseils
        };
      }
    });

    return {
      id: section.id,
      nom: section.nom,
      emoji: '🌦️',
      items: formattedItems,
      source: section.source as 'climat' | 'destination_specifique',
      conseils: section.conseils
    };
  });
}

// ==========================================
// FILTRAGE PAR PROFIL
// ==========================================

function filterByProfile(
  sections: GeneratedChecklistSection[],
  formData: FormData
): GeneratedChecklistSection[] {
  // Filtrer les items selon le niveau de confort
  return sections.map(section => {
    let filteredItems = [...section.items];

    // Filtres selon confort
    switch (formData.confort) {
      case 'economique':
        // Garder seulement priorité haute et moyenne
        filteredItems = filteredItems.filter(item =>
          !item.priorite || item.priorite !== 'basse'
        );
        break;

      case 'confortable':
      case 'standard':
        // Garder tout sauf priorité très basse
        break;

      case 'premium':
      case 'luxe':
        // Garder absolument tout + ajouter items premium si disponibles
        break;
    }

    // Filtres selon type de voyage
    if (formData.typeVoyage === 'backpacker') {
      // Privilégier items légers et compacts
      // (À implémenter selon vos besoins)
    }

    return {
      ...section,
      items: filteredItems
    };
  });
}

// ==========================================
// STATISTIQUES
// ==========================================

function calculateStats(sections: GeneratedChecklistSection[]) {
  let totalItems = 0;
  let haute = 0;
  let moyenne = 0;
  let basse = 0;

  sections.forEach(section => {
    totalItems += section.items.length;

    section.items.forEach(item => {
      const priorite = item.priorite?.toLowerCase() || '';

      if (priorite.includes('haute') || priorite.includes('⭐⭐⭐')) {
        haute++;
      } else if (priorite.includes('moyenne') || priorite.includes('⭐⭐')) {
        moyenne++;
      } else if (priorite.includes('basse') || priorite.includes('⭐')) {
        basse++;
      } else {
        // Priorité non définie = moyenne par défaut
        moyenne++;
      }
    });
  });

  return {
    totalSections: sections.length,
    totalItems,
    itemsParPriorite: {
      haute,
      moyenne,
      basse
    }
  };
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Retourne un résumé textuel de la checklist générée
 */
export function getChecklistSummary(checklist: GeneratedChecklist): string {
  return `
📋 Checklist générée pour : ${checklist.metadata.nomVoyage}

🗺️ Destination : ${checklist.metadata.destination} (${checklist.metadata.pays.join(', ')})
📅 Dates : ${checklist.metadata.dateDepart}${checklist.metadata.dateRetour ? ' → ' + checklist.metadata.dateRetour : ''}
⏱️ Durée : ${checklist.metadata.duree}

🎭 Activités : ${checklist.metadata.activites.join(', ')}
🌡️ Température : ${checklist.metadata.temperature.join(', ')}
🗓️ Saison : ${checklist.metadata.saison.join(', ')}
🌦️ Conditions : ${checklist.metadata.conditionsClimatiques.join(', ') || 'Aucune'}

👤 Profil : ${checklist.metadata.profil}
🎒 Type : ${checklist.metadata.typeVoyage}
⭐ Confort : ${checklist.metadata.confort}

📊 STATISTIQUES :
- ${checklist.stats.totalSections} sections
- ${checklist.stats.totalItems} items au total
  - ⭐⭐⭐ Haute priorité : ${checklist.stats.itemsParPriorite.haute}
  - ⭐⭐ Moyenne priorité : ${checklist.stats.itemsParPriorite.moyenne}
  - ⭐ Basse priorité : ${checklist.stats.itemsParPriorite.basse}
  `.trim();
}

/**
 * Exporte la checklist au format JSON
 */
export function exportChecklistJSON(checklist: GeneratedChecklist): string {
  return JSON.stringify(checklist, null, 2);
}

/**
 * Exporte la checklist au format CSV simple
 */
export function exportChecklistCSV(checklist: GeneratedChecklist): string {
  let csv = 'Section,Item,Priorité,Délai,Quantité,Conseils\n';

  checklist.sections.forEach(section => {
    section.items.forEach(item => {
      const row = [
        `"${section.nom}"`,
        `"${item.item}"`,
        `"${item.priorite || ''}"`,
        `"${item.delai || ''}"`,
        `"${item.quantite || ''}"`,
        `"${item.conseils?.replace(/"/g, '""') || ''}"`
      ].join(',');

      csv += row + '\n';
    });
  });

  return csv;
}

export default {
  generateCompleteChecklist,
  getChecklistSummary,
  exportChecklistJSON,
  exportChecklistCSV
};
