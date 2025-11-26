/**
 * Fonctions utilitaires pour le générateur de checklist
 */

import { ChecklistItem, GeneratedChecklistSection } from './types';

/**
 * Convertit les priorités étoiles en priorité textuelle
 * @param stars - Priorité en étoiles (⭐⭐⭐, ⭐⭐, ⭐)
 * @returns Priorité textuelle (haute, moyenne, basse)
 */
export function mapStarsToPriority(stars: string): string {
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
export function normalizeAge(age: string): string {
  return age.replace(/-ans$/, '');
}

/**
 * Vérifie si un âge enfant du formulaire correspond à un filtre âge
 * @param formAge - Âge du formulaire (ex: "0-2-ans")
 * @param filterAge - Âge du filtre JSON (ex: "0-2")
 */
export function ageMatches(formAge: string, filterAge: string): boolean {
  return normalizeAge(formAge) === filterAge;
}

/**
 * Détermine dans quelle section core un item climatique devrait être placé
 * Basé sur des mots-clés dans le nom de l'item
 */
export function mapClimatItemToSection(itemName: string): string {
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
export function areItemsSimilar(item1: string, item2: string): boolean {
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
export function mergeClimatItemsIntoSection(
  section: GeneratedChecklistSection,
  climatItems: ChecklistItem[]
): GeneratedChecklistSection {
  const mergedItems = [...section.items];

  for (const climatItem of climatItems) {
    // Vérifier si un item similaire existe déjà
    const isDuplicate = mergedItems.some(existingItem =>
      areItemsSimilar(existingItem.item, climatItem.item)
    );

    if (!isDuplicate) {
      mergedItems.push(climatItem);
    }
  }

  return {
    ...section,
    items: mergedItems
  };
}

/**
 * Calcule les statistiques de la checklist
 */
export function calculateStats(sections: GeneratedChecklistSection[]) {
  let totalItems = 0;
  let itemsEssentiels = 0;
  let itemsImportants = 0;
  let itemsOptionnels = 0;

  for (const section of sections) {
    totalItems += section.items.length;

    for (const item of section.items) {
      if (item.priorite === 'essentiel' || item.priorite === 'haute') {
        itemsEssentiels++;
      } else if (item.priorite === 'important' || item.priorite === 'moyenne') {
        itemsImportants++;
      } else {
        itemsOptionnels++;
      }
    }
  }

  return {
    totalItems,
    totalSections: sections.length,
    itemsEssentiels,
    itemsImportants,
    itemsOptionnels
  };
}
