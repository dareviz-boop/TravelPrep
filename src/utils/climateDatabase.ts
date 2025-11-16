/**
 * Base de données climatique mondiale
 * Mapping de tous les pays vers leurs caractéristiques climatiques
 * @module climateDatabase
 */

// Types de zones climatiques
export type ClimateZone =
  | 'arctic'           // Arctique/Polaire
  | 'subarctic'        // Sub-arctique
  | 'continental'      // Continental tempéré
  | 'oceanic'          // Océanique tempéré
  | 'mediterranean'    // Méditerranéen
  | 'subtropical'      // Subtropical
  | 'tropical'         // Tropical
  | 'desert_hot'       // Désertique chaud
  | 'desert_cold'      // Désertique froid
  | 'highland'         // Montagne/Altitude
  | 'equatorial';      // Équatorial

export type Hemisphere = 'north' | 'south' | 'both';

export interface CountryClimate {
  code: string;
  hemisphere: Hemisphere;
  zones: ClimateZone[];
  // Températures moyennes par mois (°C) - représentatives
  avgTemp: {
    jan: number; feb: number; mar: number; apr: number;
    may: number; jun: number; jul: number; aug: number;
    sep: number; oct: number; nov: number; dec: number;
  };
  // Saisons principales
  seasons: {
    summer: number[];  // Mois d'été (1-12)
    winter: number[];  // Mois d'hiver
    spring: number[];  // Printemps
    autumn: number[];  // Automne
  };
}

/**
 * Base de données climatique par pays
 * Températures moyennes et saisons
 */
export const COUNTRY_CLIMATES: Record<string, CountryClimate> = {
  // === EUROPE ===
  'FR': { code: 'FR', hemisphere: 'north', zones: ['oceanic', 'mediterranean'],
    avgTemp: { jan: 5, feb: 6, mar: 9, apr: 12, may: 16, jun: 19, jul: 21, aug: 21, sep: 18, oct: 14, nov: 9, dec: 6 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'ES': { code: 'ES', hemisphere: 'north', zones: ['mediterranean'],
    avgTemp: { jan: 10, feb: 11, mar: 13, apr: 15, may: 19, jun: 23, jul: 26, aug: 26, sep: 23, oct: 18, nov: 13, dec: 10 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'IT': { code: 'IT', hemisphere: 'north', zones: ['mediterranean'],
    avgTemp: { jan: 8, feb: 9, mar: 12, apr: 15, may: 19, jun: 23, jul: 26, aug: 26, sep: 22, oct: 17, nov: 12, dec: 9 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'DE': { code: 'DE', hemisphere: 'north', zones: ['oceanic', 'continental'],
    avgTemp: { jan: 1, feb: 2, mar: 6, apr: 10, may: 14, jun: 17, jul: 19, aug: 19, sep: 15, oct: 10, nov: 5, dec: 2 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'GB': { code: 'GB', hemisphere: 'north', zones: ['oceanic'],
    avgTemp: { jan: 5, feb: 5, mar: 7, apr: 9, may: 12, jun: 15, jul: 17, aug: 17, sep: 15, oct: 11, nov: 8, dec: 6 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'GR': { code: 'GR', hemisphere: 'north', zones: ['mediterranean'],
    avgTemp: { jan: 10, feb: 11, mar: 13, apr: 17, may: 22, jun: 26, jul: 29, aug: 29, sep: 25, oct: 20, nov: 15, dec: 12 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'IS': { code: 'IS', hemisphere: 'north', zones: ['subarctic'],
    avgTemp: { jan: -1, feb: 0, mar: 1, apr: 3, may: 7, jun: 10, jul: 12, aug: 11, sep: 8, oct: 4, nov: 1, dec: -1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'NO': { code: 'NO', hemisphere: 'north', zones: ['subarctic', 'oceanic'],
    avgTemp: { jan: -4, feb: -3, mar: 0, apr: 4, may: 9, jun: 13, jul: 15, aug: 14, sep: 10, oct: 5, nov: 0, dec: -3 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'SE': { code: 'SE', hemisphere: 'north', zones: ['subarctic', 'continental'],
    avgTemp: { jan: -3, feb: -3, mar: 1, apr: 6, may: 11, jun: 15, jul: 17, aug: 16, sep: 12, oct: 7, nov: 2, dec: -1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'FI': { code: 'FI', hemisphere: 'north', zones: ['subarctic', 'continental'],
    avgTemp: { jan: -6, feb: -7, mar: -3, apr: 3, may: 10, jun: 14, jul: 17, aug: 15, sep: 10, oct: 5, nov: 0, dec: -4 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'RU': { code: 'RU', hemisphere: 'north', zones: ['continental', 'subarctic', 'arctic'],
    avgTemp: { jan: -10, feb: -9, mar: -3, apr: 5, may: 13, jun: 17, jul: 19, aug: 17, sep: 11, oct: 4, nov: -3, dec: -8 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },

  // === ASIE ===
  'TH': { code: 'TH', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 27, feb: 28, mar: 30, apr: 31, may: 30, jun: 29, jul: 29, aug: 29, sep: 28, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] } // Mousson = automne
  },
  'VN': { code: 'VN', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 24, feb: 25, mar: 27, apr: 29, may: 29, jun: 29, jul: 28, aug: 28, sep: 28, oct: 27, nov: 26, dec: 24 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] }
  },
  'ID': { code: 'ID', hemisphere: 'both', zones: ['equatorial'],
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 27, jul: 27, aug: 27, sep: 28, oct: 28, nov: 28, dec: 27 },
    seasons: { summer: [4,5,6,7,8,9,10], winter: [11,12,1,2,3], spring: [], autumn: [] } // Saison sèche/humide
  },
  'MY': { code: 'MY', hemisphere: 'north', zones: ['equatorial'],
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 28, may: 28, jun: 28, jul: 27, aug: 27, sep: 27, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial = pas de saisons marquées
  },
  'SG': { code: 'SG', hemisphere: 'north', zones: ['equatorial'],
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 28, may: 29, jun: 28, jul: 28, aug: 28, sep: 27, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] }
  },
  'PH': { code: 'PH', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 26, feb: 27, mar: 28, apr: 29, may: 29, jun: 28, jul: 28, aug: 27, sep: 27, oct: 27, nov: 27, dec: 26 },
    seasons: { summer: [3,4,5], winter: [12,1,2], spring: [], autumn: [6,7,8,9,10,11] }
  },
  'JP': { code: 'JP', hemisphere: 'north', zones: ['oceanic', 'subtropical'],
    avgTemp: { jan: 5, feb: 6, mar: 10, apr: 15, may: 19, jun: 23, jul: 27, aug: 28, sep: 24, oct: 18, nov: 12, dec: 7 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'CN': { code: 'CN', hemisphere: 'north', zones: ['continental', 'subtropical', 'highland'],
    avgTemp: { jan: 2, feb: 4, mar: 10, apr: 16, may: 21, jun: 25, jul: 27, aug: 26, sep: 22, oct: 16, nov: 9, dec: 3 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'IN': { code: 'IN', hemisphere: 'north', zones: ['tropical', 'subtropical', 'desert_hot'],
    avgTemp: { jan: 20, feb: 23, mar: 28, apr: 32, may: 35, jun: 33, jul: 30, aug: 29, sep: 29, oct: 28, nov: 24, dec: 20 },
    seasons: { summer: [3,4,5], winter: [12,1,2], spring: [], autumn: [6,7,8,9,10,11] } // Mousson
  },
  'KH': { code: 'KH', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 26, feb: 28, mar: 29, apr: 30, may: 29, jun: 28, jul: 28, aug: 28, sep: 27, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] }
  },
  'LA': { code: 'LA', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 23, feb: 26, mar: 28, apr: 30, may: 29, jun: 28, jul: 28, aug: 28, sep: 27, oct: 26, nov: 24, dec: 22 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] }
  },
  'MM': { code: 'MM', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 25, feb: 27, mar: 30, apr: 32, may: 30, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 26, dec: 24 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] }
  },

  // === MOYEN-ORIENT ===
  'SA': { code: 'SA', hemisphere: 'north', zones: ['desert_hot'],
    avgTemp: { jan: 20, feb: 22, mar: 26, apr: 31, may: 36, jun: 39, jul: 40, aug: 39, sep: 37, oct: 32, nov: 26, dec: 21 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'AE': { code: 'AE', hemisphere: 'north', zones: ['desert_hot'],
    avgTemp: { jan: 19, feb: 20, mar: 23, apr: 28, may: 33, jun: 35, jul: 37, aug: 37, sep: 34, oct: 30, nov: 25, dec: 21 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'QA': { code: 'QA', hemisphere: 'north', zones: ['desert_hot'],
    avgTemp: { jan: 18, feb: 19, mar: 23, apr: 28, may: 34, jun: 37, jul: 39, aug: 38, sep: 35, oct: 31, nov: 26, dec: 21 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },

  // === AFRIQUE ===
  'EG': { code: 'EG', hemisphere: 'north', zones: ['desert_hot'],
    avgTemp: { jan: 14, feb: 16, mar: 20, apr: 24, may: 28, jun: 30, jul: 31, aug: 31, sep: 29, oct: 26, nov: 21, dec: 16 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2], spring: [3,4], autumn: [10,11] }
  },
  'MA': { code: 'MA', hemisphere: 'north', zones: ['mediterranean', 'desert_hot'],
    avgTemp: { jan: 12, feb: 13, mar: 15, apr: 17, may: 20, jun: 23, jul: 26, aug: 26, sep: 24, oct: 20, nov: 16, dec: 13 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'ZA': { code: 'ZA', hemisphere: 'south', zones: ['subtropical', 'mediterranean'],
    avgTemp: { jan: 24, feb: 24, mar: 22, apr: 19, may: 16, jun: 13, jul: 13, aug: 14, sep: 17, oct: 19, nov: 21, dec: 23 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'KE': { code: 'KE', hemisphere: 'both', zones: ['equatorial', 'tropical'],
    avgTemp: { jan: 25, feb: 26, mar: 26, apr: 25, may: 24, jun: 23, jul: 22, aug: 22, sep: 23, oct: 24, nov: 24, dec: 24 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'MG': { code: 'MG', hemisphere: 'south', zones: ['tropical'],
    avgTemp: { jan: 27, feb: 27, mar: 26, apr: 25, may: 23, jun: 21, jul: 20, aug: 21, sep: 22, oct: 24, nov: 26, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },

  // === AMÉRIQUES ===
  'US': { code: 'US', hemisphere: 'north', zones: ['continental', 'subtropical', 'desert_hot', 'oceanic'],
    avgTemp: { jan: 5, feb: 7, mar: 11, apr: 16, may: 21, jun: 26, jul: 28, aug: 27, sep: 23, oct: 17, nov: 11, dec: 6 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'CA': { code: 'CA', hemisphere: 'north', zones: ['continental', 'subarctic'],
    avgTemp: { jan: -10, feb: -8, mar: -2, apr: 6, may: 13, jun: 18, jul: 21, aug: 19, sep: 14, oct: 7, nov: 0, dec: -7 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'MX': { code: 'MX', hemisphere: 'north', zones: ['subtropical', 'tropical', 'desert_hot'],
    avgTemp: { jan: 19, feb: 20, mar: 23, apr: 25, may: 26, jun: 25, jul: 24, aug: 24, sep: 24, oct: 23, nov: 21, dec: 19 },
    seasons: { summer: [6,7,8,9], winter: [12,1,2], spring: [3,4,5], autumn: [10,11] }
  },
  'BR': { code: 'BR', hemisphere: 'south', zones: ['tropical', 'equatorial', 'subtropical'],
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 26, may: 24, jun: 23, jul: 23, aug: 24, sep: 25, oct: 26, nov: 26, dec: 27 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'AR': { code: 'AR', hemisphere: 'south', zones: ['subtropical', 'oceanic'],
    avgTemp: { jan: 25, feb: 24, mar: 22, apr: 18, may: 14, jun: 11, jul: 10, aug: 12, sep: 14, oct: 17, nov: 20, dec: 23 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'CL': { code: 'CL', hemisphere: 'south', zones: ['mediterranean', 'oceanic', 'desert_cold'],
    avgTemp: { jan: 20, feb: 20, mar: 18, apr: 15, may: 12, jun: 9, jul: 9, aug: 10, sep: 12, oct: 14, nov: 16, dec: 18 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'PE': { code: 'PE', hemisphere: 'south', zones: ['tropical', 'highland', 'desert_hot'],
    avgTemp: { jan: 23, feb: 24, mar: 24, apr: 22, may: 20, jun: 18, jul: 17, aug: 17, sep: 18, oct: 19, nov: 20, dec: 22 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'CO': { code: 'CO', hemisphere: 'north', zones: ['tropical', 'equatorial'],
    avgTemp: { jan: 24, feb: 24, mar: 24, apr: 24, may: 24, jun: 23, jul: 23, aug: 23, sep: 23, oct: 23, nov: 23, dec: 24 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },

  // === OCÉANIE ===
  'AU': { code: 'AU', hemisphere: 'south', zones: ['subtropical', 'desert_hot', 'mediterranean'],
    avgTemp: { jan: 27, feb: 27, mar: 25, apr: 22, may: 18, jun: 15, jul: 14, aug: 15, sep: 18, oct: 21, nov: 23, dec: 25 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'NZ': { code: 'NZ', hemisphere: 'south', zones: ['oceanic'],
    avgTemp: { jan: 19, feb: 19, mar: 17, apr: 15, may: 12, jun: 10, jul: 9, aug: 10, sep: 12, oct: 14, nov: 16, dec: 18 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'FJ': { code: 'FJ', hemisphere: 'south', zones: ['tropical'],
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 26, may: 25, jun: 24, jul: 23, aug: 23, sep: 24, oct: 25, nov: 26, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },

  // === CARAÏBES ===
  'CU': { code: 'CU', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 22, feb: 23, mar: 24, apr: 25, may: 26, jun: 27, jul: 28, aug: 28, sep: 27, oct: 26, nov: 24, dec: 23 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'DO': { code: 'DO', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 27, jun: 27, jul: 28, aug: 28, sep: 28, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'JM': { code: 'JM', hemisphere: 'north', zones: ['tropical'],
    avgTemp: { jan: 25, feb: 25, mar: 25, apr: 26, may: 27, jun: 28, jul: 28, aug: 28, sep: 28, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },

  // === RÉGIONS POLAIRES ===
  'GL': { code: 'GL', hemisphere: 'north', zones: ['arctic'],
    avgTemp: { jan: -20, feb: -21, mar: -20, apr: -13, may: -4, jun: 2, jul: 5, aug: 4, sep: -1, oct: -8, nov: -14, dec: -18 },
    seasons: { summer: [6,7,8], winter: [10,11,12,1,2,3,4,5], spring: [], autumn: [9] }
  },
};

/**
 * Climat moyen par zone géographique (fallback si pas de pays spécifique)
 */
export const REGIONAL_CLIMATES: Record<string, Partial<CountryClimate>> = {
  'europe': {
    hemisphere: 'north',
    zones: ['oceanic', 'continental', 'mediterranean'],
    avgTemp: { jan: 3, feb: 4, mar: 8, apr: 11, may: 15, jun: 18, jul: 20, aug: 20, sep: 16, oct: 12, nov: 7, dec: 4 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'asie': {
    hemisphere: 'north',
    zones: ['tropical', 'subtropical', 'continental'],
    avgTemp: { jan: 15, feb: 17, mar: 21, apr: 25, may: 27, jun: 28, jul: 28, aug: 27, sep: 26, oct: 23, nov: 19, dec: 16 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2], spring: [3,4], autumn: [10,11] }
  },
  'afrique': {
    hemisphere: 'both',
    zones: ['tropical', 'desert_hot', 'equatorial'],
    avgTemp: { jan: 25, feb: 26, mar: 27, apr: 27, may: 27, jun: 26, jul: 25, aug: 25, sep: 26, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'amerique-nord': {
    hemisphere: 'north',
    zones: ['continental', 'subtropical'],
    avgTemp: { jan: 0, feb: 2, mar: 7, apr: 13, may: 18, jun: 23, jul: 26, aug: 25, sep: 20, oct: 14, nov: 7, dec: 2 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'amerique-centrale-caraibes': {
    hemisphere: 'north',
    zones: ['tropical'],
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 27, jun: 27, jul: 28, aug: 28, sep: 27, oct: 27, nov: 26, dec: 24 },
    seasons: { summer: [3,4,5,6,7,8,9,10], winter: [11,12,1,2], spring: [], autumn: [] }
  },
  'amerique-sud': {
    hemisphere: 'south',
    zones: ['tropical', 'equatorial', 'subtropical'],
    avgTemp: { jan: 26, feb: 26, mar: 25, apr: 24, may: 22, jun: 21, jul: 21, aug: 22, sep: 23, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'oceanie': {
    hemisphere: 'south',
    zones: ['tropical', 'subtropical', 'oceanic'],
    avgTemp: { jan: 25, feb: 25, mar: 24, apr: 22, may: 19, jun: 17, jul: 16, aug: 17, sep: 19, oct: 21, nov: 23, dec: 24 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'multi-destinations': {
    hemisphere: 'both',
    zones: ['continental', 'tropical'],
    avgTemp: { jan: 15, feb: 16, mar: 18, apr: 20, may: 22, jun: 24, jul: 25, aug: 25, sep: 23, oct: 21, nov: 18, dec: 16 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  }
};

/**
 * Obtient le climat d'un pays par son code
 */
export function getCountryClimate(countryCode: string): CountryClimate | null {
  return COUNTRY_CLIMATES[countryCode] || null;
}

/**
 * Obtient le climat d'une région
 */
export function getRegionalClimate(regionCode: string): Partial<CountryClimate> | null {
  return REGIONAL_CLIMATES[regionCode] || null;
}

/**
 * Détermine la température pour un mois donné
 */
export function getTemperatureCategory(avgTemp: number): string[] {
  const temps: string[] = [];

  if (avgTemp < -5) temps.push('tres-froide');
  else if (avgTemp < 10) temps.push('froide');
  else if (avgTemp < 20) temps.push('temperee');
  else if (avgTemp < 30) temps.push('chaude');
  else temps.push('tres-chaude');

  // Ajouter des températures adjacentes pour plus de flexibilité
  if (avgTemp >= -5 && avgTemp < 5) temps.push('froide');
  if (avgTemp >= 15 && avgTemp < 25) temps.push('temperee', 'chaude');
  if (avgTemp >= 28) temps.push('chaude', 'tres-chaude');

  return [...new Set(temps)]; // Dédupliquer
}

/**
 * Détermine les saisons pour un mois donné
 */
export function getSeasonsForMonth(month: number, seasons: CountryClimate['seasons']): string[] {
  const result: string[] = [];

  if (seasons.summer.includes(month)) result.push('ete');
  if (seasons.winter.includes(month)) result.push('hiver');
  if (seasons.spring.includes(month)) result.push('printemps');
  if (seasons.autumn.includes(month)) result.push('automne');

  return result;
}
