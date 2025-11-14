/**
 * Générateur de checklist complet
 * Combine tous les items : activités + climat + essentiels
 */

import { FormData } from '@/types/form';
import { getClimatEquipment, ChecklistSection, DestinationSpecifiqueItem } from '@/utils/checklistFilters';
import activitesData from '@/data/checklist_activites.json';
import checklistData from '@/data/checklistComplete.json';

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

  // === 1. ITEMS ESSENTIELS (toujours inclus) ===
  const essentielsSection = getEssentielsSection(formData);
  if (essentielsSection) {
    sections.push(essentielsSection);
  }

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
// SECTIONS : ESSENTIELS
// ==========================================

function getEssentielsSection(formData: FormData): GeneratedChecklistSection | null {
  // Récupérer les items essentiels depuis checklistComplete.json
  // (À adapter selon la structure exacte de votre JSON)

  // Exemple basique d'items essentiels toujours inclus
  const essentielsItems: ChecklistItem[] = [
    {
      id: 'ESS001',
      item: 'Passeport valide (validité 6 mois minimum)',
      priorite: 'haute',
      delai: 'J-90',
      conseils: 'Vérifier la date d\'expiration immédiatement'
    },
    {
      id: 'ESS002',
      item: 'Photocopies passeport (x2)',
      priorite: 'haute',
      delai: 'J-7',
      conseils: 'Conserver séparément de l\'original'
    },
    {
      id: 'ESS003',
      item: 'Cartes bancaires (x2 minimum)',
      priorite: 'haute',
      delai: 'J-7',
      conseils: 'Visa ET Mastercard pour sécurité'
    },
    {
      id: 'ESS004',
      item: 'Assurance voyage / rapatriement',
      priorite: 'haute',
      delai: 'J-30',
      conseils: 'Vérifier couvertures : santé, annulation, bagages'
    },
    {
      id: 'ESS005',
      item: 'Téléphone portable débloqué',
      priorite: 'haute',
      delai: 'J-14',
      conseils: 'Vérifier compatibilité réseaux internationaux'
    },
    {
      id: 'ESS006',
      item: 'Chargeurs + adaptateurs universels',
      priorite: 'haute',
      delai: 'J-3',
      conseils: 'Adaptateur universel couvre 150+ pays'
    },
    {
      id: 'ESS007',
      item: 'Trousse pharmacie de base',
      priorite: 'haute',
      delai: 'J-14',
      conseils: 'Paracétamol, Imodium, pansements, désinfectant'
    }
  ];

  return {
    id: 'essentiels',
    nom: '🔑 Essentiels Absolus',
    emoji: '🔑',
    items: essentielsItems,
    source: 'core',
    conseils: 'Ces éléments sont indispensables pour tout voyage, quelle que soit la destination'
  };
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
