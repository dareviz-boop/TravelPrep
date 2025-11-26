/**
 * Chargeur dynamique de localisations géographiques
 * Permet de charger uniquement les données nécessaires au lieu de tout le fichier checklistComplete.json
 *
 * @module locationLoader
 * @version 1.0
 */

import { Localisation } from '@/types/form';

// Imports statiques pour Vite
import europeData from '@/data/localisations-europe.json';
import asieData from '@/data/localisations-asie.json';
import afriqueData from '@/data/localisations-afrique.json';
import ameriqueNordData from '@/data/localisations-amerique-nord.json';
import ameriqueCentraleCaraibesData from '@/data/localisations-amerique-centrale-caraibes.json';
import ameriqueSudData from '@/data/localisations-amerique-sud.json';
import oceanieData from '@/data/localisations-oceanie.json';

// Types pour les localisations
export interface Pays {
  code: string;
  nom: string;
  nomEn: string;
  flag: string;
}

export interface LocalisationData {
  nom: string;
  code: string;
  pays: Pays[];
  texteSelection?: string;
}

export type LocalisationsMap = Record<string, LocalisationData>;

// Cache pour éviter de recharger les mêmes données
const localisationsCache: Map<string, LocalisationsMap> = new Map();

/**
 * Mapping des zones géographiques vers leurs fichiers JSON
 */
const LOCATION_FILES: Record<Localisation, string> = {
  'europe': '/src/data/localisations-europe.json',
  'asie': '/src/data/localisations-asie.json',
  'afrique': '/src/data/localisations-afrique.json',
  'amerique-nord': '/src/data/localisations-amerique-nord.json',
  'amerique-centrale-caraibes': '/src/data/localisations-amerique-centrale-caraibes.json',
  'amerique-sud': '/src/data/localisations-amerique-sud.json',
  'multi-destinations': '/src/data/localisations-amerique-sud.json', // Partagé avec amerique-sud
  'oceanie': '/src/data/localisations-oceanie.json'
};

/**
 * Charge dynamiquement les données d'une zone géographique
 * Utilise un cache pour éviter les rechargements
 *
 * @param localisation - Code de la zone géographique
 * @returns Promise avec les données de localisation
 */
export async function loadLocalisationData(localisation: Localisation): Promise<LocalisationsMap> {
  // Vérifier le cache
  if (localisationsCache.has(localisation)) {
    return localisationsCache.get(localisation)!;
  }

  const filePath = LOCATION_FILES[localisation];

  if (!filePath) {
    console.warn(`Aucun fichier trouvé pour la localisation: ${localisation}`);
    return {};
  }

  try {
    // Chargement dynamique du fichier JSON
    const data = await import(`@/data/localisations-${getFileKey(localisation)}.json`);

    // Mise en cache
    localisationsCache.set(localisation, data.default);

    return data.default;
  } catch (error) {
    console.error(`Erreur lors du chargement de ${localisation}:`, error);
    return {};
  }
}

/**
 * Charge TOUTES les localisations de manière synchrone
 * Utilisé pour les composants qui ne peuvent pas utiliser async (ex: PDF)
 */
export function getAllLocalisationsSync(): LocalisationsMap {
  const localisations: LocalisationsMap = {};

  try {
    // Combiner toutes les localisations
    localisations['europe'] = europeData;
    localisations['asie'] = asieData;
    localisations['afrique'] = afriqueData;
    localisations['amerique-nord'] = ameriqueNordData;
    localisations['amerique-centrale-caraibes'] = ameriqueCentraleCaraibesData;
    localisations['amerique-sud'] = ameriqueSudData['amerique-sud'];
    localisations['oceanie'] = oceanieData;
    localisations['multi-destinations'] = ameriqueSudData['multi-destinations'];

    return localisations;
  } catch (error) {
    console.error('Erreur lors du chargement synchrone des localisations:', error);
    return {};
  }
}

/**
 * Helper pour obtenir la clé du fichier à partir de la localisation
 */
function getFileKey(localisation: Localisation): string {
  // multi-destinations utilise le fichier amerique-sud
  if (localisation === 'multi-destinations') {
    return 'amerique-sud';
  }
  return localisation;
}

export default {
  loadLocalisationData,
  getAllLocalisationsSync
};
