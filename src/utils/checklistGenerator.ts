/**
 * Générateur de checklist complet
 * Combine tous les items : activités + climat + essentiels
 */

import { FormData } from '@/types/form';
import { getClimatEquipment, ChecklistSection, DestinationSpecifiqueItem } from '@/utils/checklistFilters';
import activitesData from '@/data/checklist_activites.json';
import checklistData from '@/data/checklistComplete.json';
import coreSectionsData from '@/data/checklist_core_sections.json';
import profilVoyageursData from '@/data/checklist_profil_voyageurs.json';

// ==========================================
// TYPES
// ==========================================

// Type pour les filtres d'items
interface ItemFiltres {
  typeVoyageur?: string[];
  niveauConfort?: string[];
  activites?: string[];
  ageEnfants?: string[];
  destinations?: string[];
  duree?: string[];
  typeVoyage?: string[];
  profil?: string[];
}

// Type pour un item brut venant des fichiers JSON
interface RawChecklistItem {
  id?: string;
  item: string;
  priorite?: string;
  delai?: string;
  moment?: string;
  quantite?: string;
  specifications?: string[];
  conseils?: string;
  filtres?: ItemFiltres;
}

// Type pour une section de profil voyageur
interface ProfilVoyageurSection {
  description?: string;
  filtres?: {
    typeVoyageur?: string[];
    ageEnfants?: string[];
  };
  items: RawChecklistItem[];
}

// Type pour le fichier JSON profil voyageurs
interface ProfilVoyageursData {
  [key: string]: ProfilVoyageurSection;
}

// Type pour une app dans la section apps
interface AppItem {
  nom: string;
  usage: string;
  prix: string;
  priorite?: string;
  conseils?: string;
}

// Type pour une catégorie d'apps
interface AppCategory {
  nom: string;
  apps: AppItem[];
}

// Type pour une section core (documents, santé, etc.)
interface CoreSection {
  id: string;
  nom: string;
  description?: string;
  obligatoire?: boolean;
  note?: string;
  items?: RawChecklistItem[];
  categories?: { [key: string]: AppCategory };
}

// Type pour le fichier JSON core sections
interface CoreSectionsData {
  [key: string]: CoreSection;
}

// Type pour une activité
interface ActivityData {
  activity_id: string;
  nom: string;
  items: RawChecklistItem[];
}

// Type pour le fichier JSON activités
interface ActivitesData {
  activites: ActivityData[];
}

export interface ChecklistItem {
  id?: string;
  item: string;
  priorite: string;
  delai?: string;
  moment?: string; // Pour items "Pendant & Après" (Arrivée, Quotidien, etc.)
  quantite?: string;
  specifications?: string[];
  conseils?: string;
  filtres?: ItemFiltres;
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

/**
 * Normalise un âge enfant pour la comparaison
 * Enlève le suffixe "-ans" si présent
 * Ex: "0-2-ans" -> "0-2", "3-5-ans" -> "3-5"
 */
function normalizeAge(age: string): string {
  return age.replace(/-ans$/, '');
}

/**
 * Vérifie si un âge enfant du formulaire correspond à un filtre âge
 * @param formAge - Âge du formulaire (ex: "0-2-ans")
 * @param filterAge - Âge du filtre JSON (ex: "0-2")
 */
function ageMatches(formAge: string, filterAge: string): boolean {
  return normalizeAge(formAge) === filterAge;
}

/**
 * Détermine dans quelle section core un item climatique devrait être placé
 * Basé sur des mots-clés dans le nom de l'item
 */
function mapClimatItemToSection(itemName: string): string {
  const itemLower = itemName.toLowerCase();

  // HYGIÈNE : crèmes, protections solaires, produits de soin
  if (itemLower.match(/crème|baume|protection (uv|solaire)|spf|hydratant|déodorant|shampooing|savon|gel douche|dentifrice|brosse|rasoir|coupe-ongles|pince|sérum|lotion|talc/)) {
    return 'hygiene';
  }

  // SANTÉ : médicaments, premiers soins, traitement médical, équipements médicaux
  if (itemLower.match(/médicament|paracétamol|ibuprofène|antihistaminique|antibiotique|pansement|désinfectant|thermomètre|antifongique|électrolytes|trousse (premiers secours|médicale)|comprimés|gélules|purification eau|traitement|sels? réhydratation|pastilles? sel|oxymètre|oxygen|oxygène|aspirine|diamox|acétazolamide|dexaméthasone|antipaludique|malarone|doxycycline|coca tea|sorochi|gingko|vinagre|masque oxygène|régulateur|caisson hyperbare/)) {
    return 'sante';
  }

  // TECH : électronique, batteries, chargeurs, appareils
  if (itemLower.match(/batterie|chargeur|câble|adaptateur|électronique|lampe (frontale|torche)|power ?bank|solaire (panneau|chargeur)|gps|téléphone|appareil photo|ordinateur|tablette|e-reader|radio|ventilateur|balise|brumisateur|monitoring|spo2/)) {
    return 'tech';
  }

  // BAGAGES : vêtements, sacs, accessoires de voyage
  // Par défaut, tout le reste va dans bagages
  return 'bagages';
}

/**
 * Vérifie si deux items sont similaires (pour éviter les doublons)
 * Utilise une similarité basique : mots-clés communs
 */
function areItemsSimilar(item1: string, item2: string): boolean {
  const normalize = (str: string) => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^\w\s]/g, ' ') // Enlever la ponctuation
    .trim();

  const normalized1 = normalize(item1);
  const normalized2 = normalize(item2);

  // Si exactement identiques après normalisation
  if (normalized1 === normalized2) return true;

  // Extraire les mots principaux (>3 caractères)
  const words1 = new Set(normalized1.split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(normalized2.split(/\s+/).filter(w => w.length > 3));

  // Si aucun mot significatif
  if (words1.size === 0 || words2.size === 0) return false;

  // Calculer l'intersection
  const intersection = new Set([...words1].filter(w => words2.has(w)));

  // Similarité : au moins 60% de mots en commun
  const similarity = intersection.size / Math.min(words1.size, words2.size);

  return similarity >= 0.6;
}

/**
 * Fusionne les items climatiques dans une section existante en évitant les doublons
 */
function mergeClimatItemsIntoSection(
  section: GeneratedChecklistSection,
  climatItems: ChecklistItem[]
): GeneratedChecklistSection {
  const mergedItems = [...section.items];

  climatItems.forEach(climatItem => {
    // Vérifier si un item similaire existe déjà
    const isDuplicate = mergedItems.some(existingItem =>
      areItemsSimilar(existingItem.item, climatItem.item)
    );

    // Ajouter seulement si pas de doublon
    if (!isDuplicate) {
      mergedItems.push(climatItem);
    }
  });

  return {
    ...section,
    items: mergedItems
  };
}

export interface GeneratedChecklistSection {
  id: string;
  nom: string;
  emoji?: string;
  items: ChecklistItem[];
  source: 'core' | 'activite' | 'climat' | 'destination_specifique';
  category?: 'must-have' | 'interesting';
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
  let coreSections = getCoreSections(formData);

  // === 2. FUSIONNER LES ITEMS CLIMATIQUES DANS LES SECTIONS CORE ===
  const climatItems = getClimatItemsGroupedBySection(formData);
  coreSections = coreSections.map(section => {
    const sectionClimatItems = climatItems[section.id] || [];
    if (sectionClimatItems.length > 0) {
      return mergeClimatItemsIntoSection(section, sectionClimatItems);
    }
    return section;
  });

  sections.push(...coreSections);

  // === 3. ITEMS PAR ACTIVITÉS SÉLECTIONNÉES ===
  const activitesSections = getActivitesSections(formData);
  sections.push(...activitesSections);

  // === 4. ITEMS PAR PROFIL VOYAGEUR (solo, couple, famille avec âges, groupe, professionnel) ===
  const profilVoyageursSections = getProfilVoyageursSections(formData);
  sections.push(...profilVoyageursSections);

  // === 5. FILTRER SELON PROFIL/CONFORT/DURÉE ===
  const filteredSections = filterByProfile(sections, formData);

  // === 6. DÉDUPLICATION CROSS-SECTIONS (activités vs core) ===
  // Supprime les items génériques des sections core quand un item spécifique existe dans une activité
  const crossDedupedSections = deduplicateCrossSections(filteredSections);

  // === 7. DÉDUPLIQUER LES ITEMS DANS CHAQUE SECTION ===
  const dedupedSections = deduplicateSections(crossDedupedSections);

  // === 8. CONSTRUIRE L'OBJET FINAL ===
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
    sections: dedupedSections,
    stats: calculateStats(dedupedSections)
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
  // Si undefined ou tableau vide, inclure TOUTES les sections
  const sectionsInclure = formData.sectionsInclure;
  const shouldIncludeAll = !sectionsInclure || sectionsInclure.length === 0;

  // Parcourir les sections du JSON
  Object.keys(coreSectionsData).forEach(sectionKey => {
    // Ignorer metadata et sections vides
    if (sectionKey === 'metadata') return;

    const section = (coreSectionsData as CoreSectionsData)[sectionKey];

    // === TRAITEMENT SPÉCIAL POUR LA SECTION "apps" ===
    if (sectionKey === 'apps' && section.categories) {
      const shouldInclude =
        section.obligatoire ||
        shouldIncludeAll ||
        sectionsInclure.includes(sectionKey);

      if (shouldInclude) {
        // Convertir les categories en items
        const appItems: ChecklistItem[] = [];

        Object.entries(section.categories).forEach(([categoryKey, categoryData]: [string, AppCategory]) => {
          if (categoryData.apps && Array.isArray(categoryData.apps)) {
            categoryData.apps.forEach((app: AppItem, index: number) => {
              appItems.push({
                id: `APP-${categoryKey}-${index}`,
                item: `${categoryData.nom}: ${app.nom}`,
                priorite: mapStarsToPriority(app.priorite || '⭐⭐'),
                delai: 'J-14', // Par défaut, à installer 2 semaines avant
                conseils: `${app.usage}. ${app.prix}. ${app.conseils || ''}`
              });
            });
          }
        });

        if (appItems.length > 0) {
          sections.push({
            id: section.id,
            nom: section.nom,
            emoji: section.nom.match(/^[\u{1F000}-\u{1F9FF}]/u)?.[0],
            items: appItems,
            source: 'core',
            category: 'interesting',
            conseils: section.description || ''
          });
        }
      }
      return; // Ne pas continuer avec le traitement normal
    }

    // Vérifier si la section a des items et est sélectionnée
    if (section.items && section.items.length > 0) {
      // Charger si : obligatoire OU toutes les sections OU dans sectionsInclure
      const shouldInclude =
        section.obligatoire ||
        shouldIncludeAll ||
        sectionsInclure.includes(sectionKey);

      if (shouldInclude) {
        // Filtrer les items selon leurs filtres
        const filteredItems = section.items.filter((item: RawChecklistItem) => {
          // Filtre typeVoyageur (Solo, Couple, Groupe, Famille, Pro)
          if (item.filtres?.typeVoyageur) {
            if (!item.filtres.typeVoyageur.includes(formData.profil)) {
              return false;
            }
          }

          // Filtre niveauConfort (routard, standard, premium, luxe)
          if (item.filtres?.niveauConfort) {
            if (!item.filtres.niveauConfort.includes(formData.confort)) {
              return false;
            }
          }

          // Filtre activités
          if (item.filtres?.activites && item.filtres.activites.length > 0) {
            const hasMatchingActivity = item.filtres.activites.some((act: string) =>
              formData.activites?.includes(act)
            );
            if (!hasMatchingActivity) {
              return false;
            }
          }

          // Filtre âge enfants (pour profil famille)
          // Note: Les filtres utilisent "0-2", le formulaire utilise "0-2-ans"
          if (item.filtres?.ageEnfants && item.filtres.ageEnfants.length > 0) {
            const hasMatchingAge = item.filtres.ageEnfants.some((filterAge: string) =>
              formData.agesEnfants?.some(formAge => ageMatches(formAge, filterAge))
            );
            if (!hasMatchingAge) {
              return false;
            }
          }

          // Filtre destinations
          if (item.filtres?.destinations) {
            if (!item.filtres.destinations.includes(formData.localisation)) {
              return false;
            }
          }

          // Filtre durée
          if (item.filtres?.duree) {
            if (!item.filtres.duree.includes(formData.duree)) {
              return false;
            }
          }

          // Filtre typeVoyage (loisirs, aventure, culture, etc.)
          if (item.filtres?.typeVoyage) {
            if (!item.filtres.typeVoyage.includes(formData.typeVoyage)) {
              return false;
            }
          }

          return true;
        });

        // Mapper les items filtrés avec conversion de priorité
        const mappedItems: ChecklistItem[] = filteredItems.map((item: RawChecklistItem) => ({
          id: item.id,
          item: item.item,
          priorite: mapStarsToPriority(item.priorite || '⭐⭐'),
          delai: item.delai,
          moment: item.moment, // Gérer items "Pendant & Après"
          conseils: item.conseils || ''
        }));

        // Déterminer la catégorie : Must-Haves ou Intéressants
        const mustHaveIds = ['documents', 'finances', 'sante'];
        const category = mustHaveIds.includes(sectionKey) ? 'must-have' : 'interesting';

        sections.push({
          id: section.id,
          nom: section.nom,
          emoji: section.nom.match(/^[\u{1F000}-\u{1F9FF}]/u)?.[0],
          items: mappedItems,
          source: 'core',
          category: category,
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
    const activity = (activitesData as ActivitesData).activites.find((a: ActivityData) => a.activity_id === activityId);

    if (activity) {
      // Filtrer les items selon destination/durée si filtres présents
      const filteredItems = activity.items.filter((item: RawChecklistItem) => {
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
        category: 'interesting',
        conseils: `Équipements spécifiques pour ${activity.nom}`
      });
    }
  });

  return sections;
}

// ==========================================
// SECTIONS : PROFIL VOYAGEURS
// ==========================================

/**
 * Charge les sections spécifiques au profil du voyageur (solo, couple, famille, groupe, professionnel)
 * Pour le profil famille, filtre également selon les âges des enfants
 */
function getProfilVoyageursSections(formData: FormData): GeneratedChecklistSection[] {
  const sections: GeneratedChecklistSection[] = [];
  const profil = formData.profil;

  // Mapping des profils vers les clés des sections dans le JSON
  const profilMapping: { [key: string]: string[] } = {
    'solo': ['voyageSolo'],
    'couple': ['voyageCouple'],
    'groupe': ['voyageGroupeAmis'],
    'pro': ['voyageProfessionnel'],
    'famille': ['voyageFamilleBebe', 'voyageFamilleEnfant3a5', 'voyageFamilleEnfant6a12', 'voyageFamilleAdo13plus']
  };

  const sectionKeys = profilMapping[profil] || [];

  sectionKeys.forEach(sectionKey => {
    const sectionData = (profilVoyageursData as ProfilVoyageursData)[sectionKey];
    if (!sectionData || !sectionData.items || sectionData.items.length === 0) return;

    // Pour le profil famille, vérifier les filtres d'âge
    if (profil === 'famille') {
      const filtres = sectionData.filtres;
      if (filtres?.ageEnfants && filtres.ageEnfants.length > 0) {
        // Vérifier si au moins un âge du formulaire correspond aux filtres de cette section
        const hasMatchingAge = filtres.ageEnfants.some((filterAge: string) =>
          formData.agesEnfants?.some(formAge => ageMatches(formAge, filterAge))
        );

        // Si aucun âge ne correspond, ne pas inclure cette section
        if (!hasMatchingAge) return;
      }
    }

    // Mapper les items avec conversion de priorité
    const mappedItems: ChecklistItem[] = sectionData.items.map((item: RawChecklistItem) => ({
      id: item.id,
      item: item.item,
      priorite: mapStarsToPriority(item.priorite || '⭐⭐'),
      delai: item.delai || 'J-7',
      quantite: item.quantite,
      specifications: item.specifications,
      conseils: item.conseils || ''
    }));

    sections.push({
      id: sectionKey,
      nom: `👨‍👩‍👧‍👦 ${sectionData.description || 'Items profil voyageur'}`,
      emoji: '👤',
      items: mappedItems,
      source: 'core',
      category: 'interesting',
      conseils: sectionData.description || ''
    });
  });

  return sections;
}

// ==========================================
// SECTIONS : CLIMAT (FUSION DANS SECTIONS CORE)
// ==========================================

/**
 * Récupère les items climatiques et les groupe par section de destination
 * @returns Un objet avec les items climatiques groupés par section (hygiene, sante, bagages, tech)
 */
function getClimatItemsGroupedBySection(formData: FormData): Record<string, ChecklistItem[]> {
  // Utiliser le système de filtrage intelligent
  const climatSections = getClimatEquipment(formData);

  const groupedItems: Record<string, ChecklistItem[]> = {
    hygiene: [],
    sante: [],
    bagages: [],
    tech: []
  };

  climatSections.forEach(section => {
    section.items.forEach(item => {
      let climatItem: ChecklistItem;

      if (typeof item === 'string') {
        // Item climat simple (string)
        // NE PAS ajouter les conseils de section (trop longs, concaténés)
        // Les conseils spécifiques aux items seront ajoutés via la structure complète
        climatItem = {
          item: item,
          priorite: 'moyenne', // Priorité par défaut
          conseils: '' // Pas de conseils pour les items simples
        };
      } else {
        // Item destination spécifique (objet complet)
        climatItem = {
          id: item.id,
          item: item.item,
          priorite: item.priorite,
          delai: item.delai,
          quantite: item.quantite,
          specifications: item.specifications,
          conseils: item.conseils || '' // Uniquement les conseils spécifiques à l'item
        };
      }

      // Déterminer dans quelle section mettre cet item
      const targetSection = mapClimatItemToSection(climatItem.item);
      if (groupedItems[targetSection]) {
        groupedItems[targetSection].push(climatItem);
      }
    });
  });

  return groupedItems;
}

// ==========================================
// DÉDUPLICATION
// ==========================================

/**
 * Mots-clés principaux pour identifier les items VRAIMENT IDENTIQUES
 * Utilisé pour la déduplication cross-sections
 *
 * IMPORTANT: Ne regrouper QUE les items interchangeables !
 * - "Appareil photo" générique vs "Appareil photo compact" = MÊME CHOSE (dédupliquer)
 * - "Casque vélo" vs "Casque ski" = DIFFÉRENT (ne PAS dédupliquer)
 * - "Paracétamol" vs "Ibuprofène" = DIFFÉRENT (ne PAS dédupliquer)
 */
const DEDUP_KEYWORDS: { [key: string]: string[] } = {
  // === ÉLECTRONIQUE / TECH ===
  // Appareil photo : toutes les variantes sont le même besoin (prendre des photos)
  'appareil_photo': ['appareil photo', 'camera photo'],
  'gopro': ['gopro', 'camera action', 'action cam'],
  'trepied': ['trepied', 'tripod'],
  'batterie_externe': ['batterie externe', 'powerbank', 'power bank'],
  // Adaptateur : être TRÈS spécifique (adaptateur prise ≠ adaptateur USB)
  'adaptateur_prise_voyage': ['adaptateur universel', 'prise universelle', 'multiprise voyage'],
  'lampe_frontale': ['lampe frontale', 'frontale led'],
  'lampe_torche': ['lampe torche', 'torche led'],
  'carte_memoire': ['carte sd', 'carte memoire', 'micro sd'],
  'gps_rando': ['gps randonnee', 'gps rando', 'gps portable'],

  // === BAGAGES / SACS ===
  'sac_dos_voyage': ['sac a dos voyage', 'sac dos voyage', 'backpack voyage'],
  'sac_dos_journee': ['sac a dos journee', 'daypack', 'sac dos journee'],
  'sac_etanche': ['sac etanche', 'dry bag'],
  'sac_banane': ['sac banane', 'pochette ceinture'],
  'cadenas_tsa': ['cadenas tsa'],
  'housse_pluie_sac': ['housse pluie sac', 'rain cover sac'],

  // === COUCHAGE / CAMPING ===
  'sac_couchage': ['sac de couchage', 'sac couchage', 'duvet camping'],
  // Tente : être spécifique (tente camping ≠ tente plage ≠ parasol)
  'tente_camping': ['tente camping', 'tente randonnee', 'tente bivouac'],
  'matelas_camping': ['matelas gonflable camping', 'matelas camping', 'sleeping pad'],
  'rechaud_camping': ['rechaud camping', 'rechaud gaz', 'camping gaz'],
  'gourde_rando': ['gourde', 'bouteille eau reutilisable'],
  'thermos': ['thermos', 'bouteille isotherme', 'mug isotherme'],
  'filtre_eau': ['filtre eau', 'purificateur eau', 'lifestraw'],
  'couverture_survie': ['couverture survie', 'couverture urgence'],
  'bache_tarp': ['bache tarp', 'tarp camping'],
  'gamelle_camping': ['gamelle camping', 'popote camping', 'kit cuisine camping'],

  // === VÊTEMENTS ===
  // Vestes : différencier par usage
  'veste_impermeable': ['veste impermeable', 'veste pluie', 'coupe-vent impermeable'],
  'kway': ['k-way', 'kway'],
  'veste_polaire': ['veste polaire', 'fleece jacket'],
  'doudoune': ['doudoune', 'veste doudoune'],
  'combinaison_neoprene': ['combinaison neoprene', 'shorty neoprene', 'wetsuit'],
  'maillot_bain': ['maillot de bain', 'maillot bain'],
  'sous_vetements_thermiques': ['sous-vetements thermiques', 'sous vetements thermiques', 'base layer thermique'],
  // Couvre-chef : NE PAS regrouper (chapeau ≠ casquette ≠ bob)
  'bonnet_froid': ['bonnet chaud', 'bonnet hiver', 'bonnet ski'],
  'buff_tour_cou': ['buff', 'tour de cou multifonction'],

  // === CHAUSSURES ===
  'chaussures_rando': ['chaussures randonnee', 'chaussures marche', 'chaussures trek'],
  // Sandales et tongs : NE PAS regrouper (usages différents)
  'chaussures_eau': ['chaussures aquatiques', 'chaussures eau'],

  // === HYGIÈNE ===
  'creme_solaire': ['creme solaire', 'protection solaire', 'ecran solaire'],
  'anti_moustiques': ['anti-moustiques', 'repulsif moustiques', 'spray anti-moustiques'],
  'serviette_microfibre': ['serviette microfibre', 'serviette voyage'],
  'trousse_toilette': ['trousse toilette', 'trousse de toilette'],
  'baume_levres': ['baume levres', 'stick levres'],

  // === SANTÉ / PHARMACIE ===
  // NE PAS regrouper les médicaments différents !
  'trousse_secours': ['trousse secours', 'trousse premiers soins', 'kit premiers secours'],
  // Pansements et antiseptique : items génériques OK à dédupliquer
  'pansements': ['pansements varies', 'pansements assortiment'],
  'antiseptique': ['antiseptique', 'desinfectant'],
  // Antifongiques : séparer par type (crème ≠ poudre ≠ spray)
  'antifongique_creme': ['antifongique', 'antifongique mycoses pieds', 'creme antifongique'],
  'poudre_antifongique': ['poudre antifongique'],
  'spray_antifongique_vetement': ['spray antifongique vetement', 'spray antifongique'],

  // === DOCUMENTS ===
  'copies_documents': ['copies documents', 'photocopies documents'],

  // === ACCESSOIRES DIVERS ===
  'jumelles': ['jumelles', 'binoculars'],
  'boussole': ['boussole', 'compass'],
  'couteau_multifonction': ['couteau multifonction', 'couteau suisse', 'leatherman'],
  'paracorde': ['paracorde', 'corde paracorde'],
  // Sifflet : tous les sifflets d'urgence/survie sont le même besoin
  'sifflet_urgence': ['sifflet survie', 'sifflet 120db', 'sifflet urgence'],
  // Bouchons : NE PAS regrouper (natation ≠ sommeil ≠ concert)
  'masque_sommeil': ['masque sommeil', 'masque yeux'],

  // === GUIDES / LIVRES ===
  // Carnet : être spécifique (carnet notes ≠ carnet vaccination ≠ carnet plongée)
  'guide_voyage': ['guide voyage', 'lonely planet', 'routard'],
  'carnet_notes_voyage': ['carnet notes voyage', 'journal voyage'],

  // === SNORKELING (items SÉPARÉS car différents) ===
  // Masque+tuba souvent ensemble, mais palmes séparées
  'masque_tuba': ['masque + tuba', 'masque tuba'],
  'palmes': ['palmes'],

  // === DIVERS ===
  // Sac shopping / tote bag : même besoin (sac courses pliable)
  'sac_shopping': ['sac shopping', 'tote bag'],
  'carte_sim': ['carte sim locale', 'esim voyage'],
  'lingettes': ['lingettes humides', 'lingettes voyage'],
  'disque_dur': ['disque dur externe', 'ssd externe'],
  'glaciere': ['glaciere souple', 'glaciere portable']
};

/**
 * Extrait le mot-clé principal d'un item pour la déduplication
 */
function extractDeduplicationKey(itemText: string): string | null {
  const normalizedText = itemText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .trim();

  for (const [key, keywords] of Object.entries(DEDUP_KEYWORDS)) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      if (normalizedText.includes(normalizedKeyword)) {
        return key;
      }
    }
  }

  return null;
}

/**
 * Déduplication cross-sections :
 * 1. Supprime les items génériques des sections core quand un équivalent existe dans une activité
 * 2. Ne garde qu'un seul exemplaire parmi les sections d'activités pour chaque type d'item
 *
 * Logique : Les items d'activité sont plus spécifiques, on garde le premier trouvé
 * et on supprime les doublons dans les autres activités + les items génériques des sections core
 */
function deduplicateCrossSections(
  sections: GeneratedChecklistSection[]
): GeneratedChecklistSection[] {
  // 1. Collecter tous les mots-clés des items d'activités et identifier le premier de chaque type
  const activityKeywords = new Map<string, { item: ChecklistItem; sectionId: string; sectionName: string }>();

  sections
    .filter(s => s.source === 'activite')
    .forEach(section => {
      section.items.forEach(item => {
        const key = extractDeduplicationKey(item.item);
        if (key) {
          // Garder seulement le premier item trouvé pour chaque clé
          if (!activityKeywords.has(key)) {
            activityKeywords.set(key, { item, sectionId: section.id, sectionName: section.nom });
          }
        }
      });
    });

  // 2. Parcourir toutes les sections et filtrer les doublons
  return sections.map(section => {
    // Pour les sections core : supprimer les items qui ont un équivalent dans une activité
    if (section.source !== 'activite') {
      const filteredItems = section.items.filter(item => {
        const key = extractDeduplicationKey(item.item);
        // Supprimer si un item d'activité existe avec la même clé
        if (key && activityKeywords.has(key)) {
          return false;
        }
        return true;
      });

      return {
        ...section,
        items: filteredItems
      };
    }

    // Pour les sections d'activités : ne garder l'item que dans la première activité qui l'a
    const filteredItems = section.items.filter(item => {
      const key = extractDeduplicationKey(item.item);
      if (key && activityKeywords.has(key)) {
        const firstOccurrence = activityKeywords.get(key)!;
        // Garder l'item seulement si c'est la première section qui l'a
        return firstOccurrence.sectionId === section.id;
      }
      // Si pas de clé de déduplication, garder l'item
      return true;
    });

    return {
      ...section,
      items: filteredItems
    };
  });
}

/**
 * Supprime tous les doublons dans chaque section
 * Un item est considéré comme doublon si son texte est identique (normalisé)
 */
function deduplicateSections(
  sections: GeneratedChecklistSection[]
): GeneratedChecklistSection[] {
  return sections.map(section => {
    const uniqueItems: ChecklistItem[] = [];
    const seenItems = new Set<string>();

    section.items.forEach(item => {
      // Créer une clé unique basée sur le texte normalisé de l'item
      const normalizedText = item.item
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .replace(/[^\w\s]/g, '') // Enlever la ponctuation
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .trim();

      // Si cet item n'a pas encore été vu, l'ajouter
      if (!seenItems.has(normalizedText)) {
        seenItems.add(normalizedText);
        uniqueItems.push(item);
      }
    });

    return {
      ...section,
      items: uniqueItems
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
