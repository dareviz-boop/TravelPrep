/**
 * Chargeur dynamique de localisations géographiques
 * Permet de charger uniquement les données nécessaires au lieu de tout le fichier checklistComplete.json
 *
 * @module locationLoader
 * @version 1.0
 */

import { Localisation } from '@/types/form';

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
  'oceanie': '/src/data/localisations-oceanie.json',
  'multi-destinations': '/src/data/localisations-amerique-sud.json' // Partagé avec amerique-sud
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
 * Charge TOUTES les localisations (pour les cas où on en a besoin)
 * À utiliser avec parcimonie pour éviter de charger trop de données
 */
export async function loadAllLocalisations(): Promise<LocalisationsMap> {
  const allLocalisations: LocalisationsMap = {};

  // Charger tous les fichiers en parallèle
  const loadPromises = Object.keys(LOCATION_FILES).map(async (loc) => {
    // Éviter les doublons (multi-destinations et amerique-sud partagent le même fichier)
    if (loc === 'multi-destinations') return;

    const data = await loadLocalisationData(loc as Localisation);
    Object.assign(allLocalisations, data);
  });

  await Promise.all(loadPromises);

  return allLocalisations;
}

/**
 * Charge les données d'une zone géographique de manière synchrone (imports statiques)
 * Utilisé pour les composants qui ne peuvent pas utiliser async
 */
export function getLocalisationDataSync(localisation: Localisation): LocalisationData | null {
  try {
    let data;

    switch (localisation) {
      case 'europe':
        data = require('@/data/localisations-europe.json');
        return data;
      case 'asie':
        data = require('@/data/localisations-asie.json');
        return data;
      case 'afrique':
        data = require('@/data/localisations-afrique.json');
        return data;
      case 'amerique-nord':
        data = require('@/data/localisations-amerique-nord.json');
        return data;
      case 'amerique-centrale-caraibes':
        data = require('@/data/localisations-amerique-centrale-caraibes.json');
        return data;
      case 'amerique-sud':
        data = require('@/data/localisations-amerique-sud.json');
        return data['amerique-sud'];
      case 'multi-destinations':
        data = require('@/data/localisations-amerique-sud.json');
        return data['multi-destinations'];
      case 'oceanie':
        data = require('@/data/localisations-oceanie.json');
        return data;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Erreur lors du chargement synchrone de ${localisation}:`, error);
    return null;
  }
}

/**
 * Charge TOUTES les localisations de manière synchrone
 * Utilisé pour les composants qui ne peuvent pas utiliser async (ex: PDF)
 */
export function getAllLocalisationsSync(): LocalisationsMap {
  const localisations: LocalisationsMap = {};

  try {
    // Charger tous les fichiers
    const europe = require('@/data/localisations-europe.json');
    const asie = require('@/data/localisations-asie.json');
    const afrique = require('@/data/localisations-afrique.json');
    const ameriqueNord = require('@/data/localisations-amerique-nord.json');
    const ameriqueCentraleCaraibes = require('@/data/localisations-amerique-centrale-caraibes.json');
    const ameriqueSud = require('@/data/localisations-amerique-sud.json');
    const oceanie = require('@/data/localisations-oceanie.json');

    // Combiner toutes les localisations
    localisations['europe'] = europe;
    localisations['asie'] = asie;
    localisations['afrique'] = afrique;
    localisations['amerique-nord'] = ameriqueNord;
    localisations['amerique-centrale-caraibes'] = ameriqueCentraleCaraibes;
    localisations['amerique-sud'] = ameriqueSud['amerique-sud'];
    localisations['multi-destinations'] = ameriqueSud['multi-destinations'];
    localisations['oceanie'] = oceanie;

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

/**
 * Vide le cache des localisations
 * Utile pour les tests ou pour forcer un rechargement
 */
export function clearLocalisationsCache(): void {
  localisationsCache.clear();
}

export default {
  loadLocalisationData,
  loadAllLocalisations,
  getLocalisationDataSync,
  getAllLocalisationsSync,
  clearLocalisationsCache
};
