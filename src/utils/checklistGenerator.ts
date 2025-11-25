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
  moment?: string; // Pour items "Pendant & Après" (Arrivée, Quotidien, etc.)
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

  // === 4. FILTRER SELON PROFIL/CONFORT/DURÉE ===
  const filteredSections = filterByProfile(sections, formData);

  // === 5. DÉDUPLICATION CROSS-SECTIONS (activités vs core) ===
  // Supprime les items génériques des sections core quand un item spécifique existe dans une activité
  const crossDedupedSections = deduplicateCrossSections(filteredSections);

  // === 6. DÉDUPLIQUER LES ITEMS DANS CHAQUE SECTION ===
  const dedupedSections = deduplicateSections(crossDedupedSections);

  // === 7. CONSTRUIRE L'OBJET FINAL ===
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

    const section = (coreSectionsData as any)[sectionKey];

    // === TRAITEMENT SPÉCIAL POUR LA SECTION "apps" ===
    if (sectionKey === 'apps' && section.categories) {
      const shouldInclude =
        section.obligatoire ||
        shouldIncludeAll ||
        sectionsInclure.includes(sectionKey);

      if (shouldInclude) {
        // Convertir les categories en items
        const appItems: ChecklistItem[] = [];

        Object.entries(section.categories).forEach(([categoryKey, categoryData]: [string, any]) => {
          if (categoryData.apps && Array.isArray(categoryData.apps)) {
            categoryData.apps.forEach((app: any, index: number) => {
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
        const filteredItems = section.items.filter((item: any) => {
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
          if (item.filtres?.ageEnfants && item.filtres.ageEnfants.length > 0) {
            const hasMatchingAge = item.filtres.ageEnfants.some((age: string) =>
              formData.agesEnfants?.includes(age)
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
        const mappedItems: ChecklistItem[] = filteredItems.map((item: any) => ({
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
        category: 'interesting',
        conseils: `Équipements spécifiques pour ${activity.nom}`
      });
    }
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
 * Mots-clés principaux pour identifier les catégories d'items similaires
 * Utilisé pour la déduplication cross-sections
 * IMPORTANT: Liste exhaustive pour éviter les doublons
 */
const DEDUP_KEYWORDS: { [key: string]: string[] } = {
  // === ÉLECTRONIQUE / TECH ===
  'appareil_photo': ['appareil photo', 'camera', 'reflex', 'hybride', 'gopro', 'compact', 'objectif', 'photographie'],
  'trepied': ['trepied', 'tripod', 'monopode', 'stabilisateur'],
  'chargeur': ['chargeur', 'charging', 'recharge'],
  'batterie': ['batterie', 'powerbank', 'power bank', 'batterie externe', 'accumulateur'],
  'adaptateur': ['adaptateur', 'adapter', 'prise universelle', 'multiprise', 'convertisseur'],
  'telephone': ['telephone', 'smartphone', 'portable', 'mobile', 'iphone', 'android'],
  'lampe': ['lampe', 'frontale', 'torche', 'flashlight', 'lanterne', 'eclairage'],
  'carte_sd': ['carte sd', 'carte memoire', 'memory card', 'stockage', 'micro sd'],
  'cable': ['cable', 'usb', 'lightning', 'usb-c', 'hdmi', 'fil'],
  'ecouteurs': ['ecouteurs', 'casque audio', 'headphones', 'earbuds', 'airpods', 'reduction bruit'],
  'tablette': ['tablette', 'ipad', 'tab', 'liseuse', 'e-reader', 'kindle'],
  'gps': ['gps', 'navigation', 'localisation', 'traceur'],
  'drone': ['drone', 'quadcopter', 'dji', 'aerien'],
  'radio': ['radio', 'talkie', 'walkie', 'emetteur'],
  'balise': ['balise', 'plb', 'spot', 'detresse', 'sos'],

  // === BAGAGES / SACS ===
  'sac_dos': ['sac a dos', 'backpack', 'sac dos', 'daypack', 'sac randonnee', 'sac technique'],
  'sac_voyage': ['sac voyage', 'valise', 'bagage', 'sac transport', 'trolley'],
  'sac_etanche': ['sac etanche', 'dry bag', 'waterproof', 'imperméable sac'],
  'sac_compression': ['sac compression', 'compression bag', 'organisateur'],
  'sac_banane': ['sac banane', 'pochette', 'sacoche', 'tour de cou', 'ceinture'],
  'sac_photo': ['sac photo', 'insert photo', 'housse appareil'],
  'housse_pluie': ['housse pluie', 'rain cover', 'protection pluie'],
  'cadenas': ['cadenas', 'antivol', 'lock', 'securite bagage', 'tsa'],

  // === COUCHAGE / CAMPING ===
  'sac_couchage': ['sac de couchage', 'duvet', 'sleeping bag', 'couchage'],
  'tente': ['tente', 'tent', 'abri', 'bivouac'],
  'matelas': ['matelas', 'tapis sol', 'sleeping pad', 'isolant', 'thermarest'],
  'hamac': ['hamac', 'hammock'],
  'rechaud': ['rechaud', 'camping gaz', 'cartouche gaz', 'cuisiniere portable', 'bruleur'],
  'popote': ['popote', 'gamelle', 'ustensiles camping', 'couverts camping'],
  'gourde': ['gourde', 'bouteille', 'water bottle', 'thermos', 'isotherme', 'camelback'],
  'filtre_eau': ['filtre eau', 'purification', 'pastille', 'lifestraw', 'potabilisation'],
  'couverture_survie': ['couverture survie', 'couverture urgence', 'mylar'],
  'bache': ['bache', 'tarp', 'toile'],

  // === VÊTEMENTS ===
  'veste': ['veste', 'jacket', 'coupe-vent', 'polaire', 'doudoune', 'gore-tex', 'hardshell', 'softshell', 'anorak'],
  'k_way': ['k-way', 'kway', 'impermeable', 'poncho', 'rain jacket', 'pluie'],
  'pantalon': ['pantalon', 'pants', 'shorts', 'bermuda', 'pantacourt', 'legging'],
  'combinaison': ['combinaison', 'combi', 'neoprene', 'shorty', 'wetsuit'],
  'maillot': ['maillot', 'swimsuit', 'bikini', 'bain'],
  'sous_vetements': ['sous-vetements', 'sous vetements', 'thermique', 'merinos', 'base layer'],
  'chaussettes': ['chaussettes', 'socks', 'bas'],
  'chapeau': ['chapeau', 'casquette', 'bob', 'hat', 'cap', 'bonnet', 'couvre-chef'],
  'gants': ['gants', 'gloves', 'moufles', 'mitaines'],
  'echarpe': ['echarpe', 'foulard', 'buff', 'tour de cou vetement', 'cache-col'],
  'lunettes': ['lunettes', 'soleil', 'sunglasses', 'glacier', 'masque ski'],

  // === CHAUSSURES ===
  'chaussures_rando': ['chaussures randonnee', 'chaussures marche', 'boots', 'hiking', 'trek'],
  'chaussures_ville': ['baskets', 'sneakers', 'chaussures ville', 'chaussures confort'],
  'sandales': ['sandales', 'tongs', 'claquettes', 'aquatiques', 'chaussures eau'],
  'chaussons': ['chaussons', 'pantoufles', 'interieur'],

  // === HYGIÈNE ===
  'creme_solaire': ['creme solaire', 'protection solaire', 'ecran solaire', 'spf', 'sunscreen', 'uv'],
  'anti_moustiques': ['anti-moustiques', 'repulsif', 'deet', 'moustiquaire', 'insecte'],
  'serviette': ['serviette', 'towel', 'microfibre', 'drap bain'],
  'trousse_toilette': ['trousse toilette', 'trousse de toilette', 'necessaire toilette'],
  'savon': ['savon', 'gel douche', 'shampoing', 'shampooing'],
  'brosse_dents': ['brosse dents', 'dentifrice', 'fil dentaire'],
  'rasoir': ['rasoir', 'tondeuse', 'epilation'],
  'deodorant': ['deodorant', 'anti-transpirant'],
  'baume_levres': ['baume levres', 'lip balm', 'stick levres'],
  'creme_hydratante': ['creme hydratante', 'lotion', 'moisturizer'],

  // === SANTÉ / PHARMACIE ===
  'medicaments': ['medicaments', 'pharmacie', 'trousse secours', 'premiers soins', 'first aid'],
  'pansements': ['pansements', 'bandage', 'compresses', 'sparadrap'],
  'antiseptique': ['antiseptique', 'desinfectant', 'betadine'],
  'douleur': ['paracetamol', 'ibuprofene', 'aspirine', 'antalgique', 'anti-douleur'],
  'allergie': ['antihistaminique', 'allergie', 'cetirizine'],
  'digestion': ['anti-diarrhee', 'imodium', 'smecta', 'antispasmodique'],
  'thermometre': ['thermometre', 'temperature'],
  'collyre': ['collyre', 'gouttes yeux', 'serum physiologique'],
  'oxymetre': ['oxymetre', 'spo2', 'saturation'],

  // === DOCUMENTS / PAPIERS ===
  'passeport': ['passeport', 'passport'],
  'carte_identite': ['carte identite', 'carte d\'identite', 'id card'],
  'visa': ['visa', 'esta', 'eta', 'e-visa', 'autorisation'],
  'permis': ['permis', 'permis conduire', 'international', 'pci'],
  'assurance': ['assurance', 'rapatriement', 'annulation'],
  'billet': ['billet', 'ticket', 'reservation', 'confirmation'],
  'carnet_vaccination': ['carnet vaccination', 'vaccin', 'certificat'],

  // === ACCESSOIRES DIVERS ===
  'jumelles': ['jumelles', 'binoculars', 'longue-vue', 'optique'],
  'boussole': ['boussole', 'compass', 'orientation'],
  'couteau': ['couteau', 'opinel', 'multifonction', 'leatherman', 'suisse'],
  'corde': ['corde', 'cordage', 'paracorde', 'sangle'],
  'mousqueton': ['mousqueton', 'carabiner', 'attache'],
  'sifflet': ['sifflet', 'whistle', 'signal'],
  'miroir': ['miroir', 'signal', 'heliographe'],
  'briquet': ['briquet', 'allumettes', 'allume-feu', 'fire starter'],
  'couverture': ['couverture', 'plaid', 'blanket'],
  'oreiller': ['oreiller', 'coussin', 'pillow', 'appui-tete'],
  'bouchons_oreilles': ['bouchons oreilles', 'ear plugs', 'boules quies'],
  'masque_sommeil': ['masque yeux', 'masque sommeil', 'sleep mask'],
  'parapluie': ['parapluie', 'umbrella'],

  // === GUIDES / LIVRES ===
  'guide': ['guide', 'lonely planet', 'routard', 'guidebook', 'guide voyage'],
  'carnet': ['carnet', 'journal', 'notebook', 'cahier'],
  'stylo': ['stylo', 'pen', 'crayon', 'feutre'],
  'carte': ['carte', 'map', 'plan', 'topographique'],

  // === SPORTS SPÉCIFIQUES ===
  'masque_tuba': ['masque', 'tuba', 'snorkeling', 'palmes', 'plongee'],
  'ski': ['ski', 'snowboard', 'snow', 'neige', 'piste'],
  'velo': ['velo', 'bike', 'cyclisme', 'bicyclette', 'sacoche velo'],
  'escalade': ['escalade', 'climbing', 'baudrier', 'harnais', 'corde escalade'],
  'surf': ['surf', 'bodyboard', 'planche'],
  'casque_protection': ['casque ski', 'casque velo', 'casque certifie', 'en 1077', 'en 1078'],
  'batons_marche': ['batons', 'baton marche', 'batons telescopiques', 'trekking poles'],
  'guetres': ['guetres', 'guetre', 'gaiters'],

  // === ALIMENTATION ===
  'snacks': ['snacks', 'barres', 'cereales', 'fruits secs', 'encas', 'nourriture'],
  'gels': ['gels', 'energie', 'electrolytes', 'boisson isotonique'],
  'glaciere': ['glaciere', 'cooler', 'isotherme box', 'frigo portable'],

  // === DIVERS MANQUANTS ===
  'sac_shopping': ['sac shopping', 'tote bag', 'sac courses', 'sac pliable reutilisable'],
  'sim_esim': ['carte sim', 'esim', 'sim locale', 'sim internationale'],
  'lingettes': ['lingettes', 'wipes', 'lingette humide', 'lingette nettoyante'],
  'disque_dur': ['disque dur', 'ssd', 'stockage externe', 'hard drive'],
  'ordinateur': ['ordinateur portable', 'laptop', 'pc portable', 'macbook'],
  'kit_reparation': ['kit reparation', 'rustine', 'kit crevaison', 'kit urgence'],
  'polaire': ['polaire', 'fleece', 'couverture polaire', 'plaid polaire']
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
