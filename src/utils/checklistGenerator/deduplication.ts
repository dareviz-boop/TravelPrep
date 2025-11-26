/**
 * Fonctions et constantes pour la déduplication des items de checklist
 *
 * IMPORTANT: Ne regrouper QUE les items interchangeables !
 * - "Appareil photo" générique vs "Appareil photo compact" = MÊME CHOSE (dédupliquer)
 * - "Casque vélo" vs "Casque ski" = DIFFÉRENT (ne PAS dédupliquer)
 * - "Paracétamol" vs "Ibuprofène" = DIFFÉRENT (ne PAS dédupliquer)
 */

import { ChecklistItem, GeneratedChecklistSection } from './types';

// Dictionnaire de mots-clés pour la déduplication
export const DEDUP_KEYWORDS: { [key: string]: string[] } = {
  // === ÉLECTRONIQUE / TECH ===
  'appareil_photo': ['appareil photo', 'camera photo'],
  'gopro': ['gopro', 'camera action', 'action cam'],
  'trepied': ['trepied', 'tripod'],
  'batterie_externe': ['batterie externe', 'powerbank', 'power bank'],
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
  'veste_impermeable': ['veste impermeable', 'veste pluie', 'coupe-vent impermeable'],
  'kway': ['k-way', 'kway'],
  'veste_polaire': ['veste polaire', 'fleece jacket'],
  'doudoune': ['doudoune', 'veste doudoune'],
  'combinaison_neoprene': ['combinaison neoprene', 'shorty neoprene', 'wetsuit'],
  'maillot_bain': ['maillot de bain', 'maillot bain'],
  'sous_vetements_thermiques': ['sous-vetements thermiques', 'sous vetements thermiques', 'base layer thermique'],
  'bonnet_froid': ['bonnet chaud', 'bonnet hiver', 'bonnet ski'],
  'buff_tour_cou': ['buff', 'tour de cou multifonction'],

  // === CHAUSSURES ===
  'chaussures_rando': ['chaussures randonnee', 'chaussures marche', 'chaussures trek'],
  'chaussures_eau': ['chaussures aquatiques', 'chaussures eau'],

  // === HYGIÈNE ===
  'creme_solaire': ['creme solaire', 'protection solaire', 'ecran solaire'],
  'anti_moustiques': ['anti-moustiques', 'repulsif moustiques', 'spray anti-moustiques'],
  'serviette_microfibre': ['serviette microfibre', 'serviette voyage'],
  'trousse_toilette': ['trousse toilette', 'trousse de toilette'],
  'baume_levres': ['baume levres', 'stick levres'],

  // === SANTÉ / PHARMACIE ===
  'trousse_secours': ['trousse secours', 'trousse premiers soins', 'kit premiers secours'],
  'pansements': ['pansements varies', 'pansements assortiment'],
  'antiseptique': ['antiseptique', 'desinfectant'],
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
  'sifflet_urgence': ['sifflet survie', 'sifflet 120db', 'sifflet urgence'],
  'masque_sommeil': ['masque sommeil', 'masque yeux'],

  // === GUIDES / LIVRES ===
  'guide_voyage': ['guide voyage', 'lonely planet', 'routard'],
  'carnet_notes_voyage': ['carnet notes voyage', 'journal voyage'],

  // === SNORKELING ===
  'masque_tuba': ['masque + tuba', 'masque tuba'],
  'palmes': ['palmes'],

  // === DIVERS ===
  'sac_shopping': ['sac shopping', 'tote bag'],
  'carte_sim': ['carte sim locale', 'esim voyage'],
  'lingettes': ['lingettes humides', 'lingettes voyage'],
  'disque_dur': ['disque dur externe', 'ssd externe'],
  'glaciere': ['glaciere souple', 'glaciere portable']
};

/**
 * Extrait le mot-clé principal d'un item pour la déduplication
 */
export function extractDeduplicationKey(itemText: string): string | null {
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
export function deduplicateCrossSections(sections: GeneratedChecklistSection[]): GeneratedChecklistSection[] {
  const seenKeys = new Map<string, { sectionId: string; itemText: string }>();

  return sections.map((section) => {
    const dedupedItems: ChecklistItem[] = [];

    for (const item of section.items) {
      const key = extractDeduplicationKey(item.item);

      if (!key) {
        dedupedItems.push(item);
        continue;
      }

      const existing = seenKeys.get(key);

      if (!existing) {
        seenKeys.set(key, { sectionId: section.id, itemText: item.item });
        dedupedItems.push(item);
      } else {
        // Doublon détecté : ne pas ajouter cet item
        // console.log(`❌ Doublon supprimé: "${item.item}" (section: ${section.id}, déjà présent dans: ${existing.sectionId})`);
      }
    }

    return {
      ...section,
      items: dedupedItems
    };
  });
}

/**
 * Déduplique les items au sein d'une même section
 */
export function deduplicateSections(sections: GeneratedChecklistSection[]): GeneratedChecklistSection[] {
  return sections.map((section) => {
    const seenKeys = new Map<string, ChecklistItem>();

    section.items.forEach((item) => {
      const key = extractDeduplicationKey(item.item);

      if (!key) {
        seenKeys.set(item.item, item);
        return;
      }

      if (!seenKeys.has(key)) {
        seenKeys.set(key, item);
      }
    });

    return {
      ...section,
      items: Array.from(seenKeys.values())
    };
  });
}
