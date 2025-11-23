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
  'GB-ENG': { code: 'GB-ENG', hemisphere: 'north', zones: ['oceanic'],
    avgTemp: { jan: 5, feb: 5, mar: 7, apr: 10, may: 13, jun: 16, jul: 18, aug: 18, sep: 15, oct: 12, nov: 8, dec: 6 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'GB-SCT': { code: 'GB-SCT', hemisphere: 'north', zones: ['oceanic'],
    avgTemp: { jan: 3, feb: 3, mar: 5, apr: 7, may: 10, jun: 13, jul: 14, aug: 14, sep: 12, oct: 9, nov: 6, dec: 4 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'GB-WLS': { code: 'GB-WLS', hemisphere: 'north', zones: ['oceanic'],
    avgTemp: { jan: 5, feb: 5, mar: 7, apr: 9, may: 12, jun: 15, jul: 16, aug: 16, sep: 14, oct: 11, nov: 8, dec: 6 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'GB-NIR': { code: 'GB-NIR', hemisphere: 'north', zones: ['oceanic'],
    avgTemp: { jan: 4, feb: 4, mar: 6, apr: 8, may: 11, jun: 13, jul: 15, aug: 15, sep: 13, oct: 10, nov: 7, dec: 5 },
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
    seasons: { summer: [4,5,6,7,8,9,10], winter: [11,12,1,2,3], spring: [], autumn: [] } // Saison sèche (avr-oct) / humide (nov-mar)
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
  'CG': { code: 'CG', hemisphere: 'both', zones: ['tropical', 'equatorial'], // Congo (République du)
    avgTemp: { jan: 26, feb: 27, mar: 27, apr: 27, may: 27, jun: 25, jul: 24, aug: 25, sep: 26, oct: 26, nov: 26, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'CD': { code: 'CD', hemisphere: 'both', zones: ['tropical', 'equatorial'], // Congo (RDC)
    avgTemp: { jan: 26, feb: 26, mar: 27, apr: 26, may: 26, jun: 24, jul: 24, aug: 25, sep: 26, oct: 26, nov: 26, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'ER': { code: 'ER', hemisphere: 'north', zones: ['desert_hot', 'tropical', 'highland'], // Érythrée
    avgTemp: { jan: 22, feb: 23, mar: 25, apr: 27, may: 29, jun: 32, jul: 34, aug: 33, sep: 31, oct: 28, nov: 25, dec: 23 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'EG': { code: 'EG', hemisphere: 'north', zones: ['desert_hot', 'mediterranean'],
    avgTemp: { jan: 14, feb: 16, mar: 20, apr: 24, may: 28, jun: 30, jul: 31, aug: 31, sep: 29, oct: 26, nov: 21, dec: 16 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2], spring: [3,4], autumn: [10,11] }
  },
  'MA': { code: 'MA', hemisphere: 'north', zones: ['mediterranean', 'desert_hot'],
    avgTemp: { jan: 12, feb: 13, mar: 15, apr: 17, may: 20, jun: 23, jul: 26, aug: 26, sep: 24, oct: 20, nov: 16, dec: 13 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'EH': { code: 'EH', hemisphere: 'north', zones: ['desert_hot'], // Sahara Occidental
    avgTemp: { jan: 20, feb: 21, mar: 23, apr: 25, may: 27, jun: 30, jul: 32, aug: 33, sep: 31, oct: 28, nov: 24, dec: 21 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3,4], spring: [], autumn: [10] }
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
    avgTemp: { jan: 27, feb: 27, mar: 25, apr: 22, may: 18, jun: 15, jul: 14, aug: 16, sep: 19, oct: 22, nov: 25, dec: 27 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] } // Moyenne nationale incluant régions tempérées
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

  // === TERRITOIRES FRANÇAIS D'OUTRE-MER ===
  'PF': { code: 'PF', hemisphere: 'south', zones: ['tropical'], // Polynésie Française (Tahiti)
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 26, jun: 25, jul: 25, aug: 25, sep: 25, oct: 26, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'NC': { code: 'NC', hemisphere: 'south', zones: ['tropical'], // Nouvelle-Calédonie
    avgTemp: { jan: 27, feb: 27, mar: 26, apr: 25, may: 23, jun: 21, jul: 21, aug: 21, sep: 22, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'RE': { code: 'RE', hemisphere: 'south', zones: ['tropical'], // Réunion
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 26, may: 24, jun: 22, jul: 21, aug: 21, sep: 22, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'GP': { code: 'GP', hemisphere: 'north', zones: ['tropical'], // Guadeloupe
    avgTemp: { jan: 25, feb: 25, mar: 25, apr: 26, may: 27, jun: 28, jul: 28, aug: 28, sep: 28, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'MQ': { code: 'MQ', hemisphere: 'north', zones: ['tropical'], // Martinique
    avgTemp: { jan: 25, feb: 25, mar: 25, apr: 26, may: 27, jun: 28, jul: 28, aug: 28, sep: 28, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'GF': { code: 'GF', hemisphere: 'north', zones: ['equatorial'], // Guyane Française
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 27, jul: 27, aug: 28, sep: 28, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [7,8,9,10,11], winter: [12,1,2,3,4,5,6], spring: [], autumn: [] } // Saison sèche (jul-nov) / humide (déc-jun)
  },

  // === OCÉANIE - ÎLES DU PACIFIQUE ===
  'PN': { code: 'PN', hemisphere: 'south', zones: ['subtropical'], // Pitcairn
    avgTemp: { jan: 25, feb: 26, mar: 25, apr: 24, may: 22, jun: 21, jul: 20, aug: 20, sep: 21, oct: 22, nov: 23, dec: 24 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'PG': { code: 'PG', hemisphere: 'both', zones: ['tropical', 'equatorial'], // Papouasie-Nouvelle-Guinée
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 26, jul: 26, aug: 26, sep: 26, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] }
  },
  'FM': { code: 'FM', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Micronésie (États fédérés)
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Tropical constant
  },
  'WS': { code: 'WS', hemisphere: 'south', zones: ['tropical'], // Samoa
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 26, jun: 26, jul: 25, aug: 25, sep: 26, oct: 26, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'TO': { code: 'TO', hemisphere: 'south', zones: ['tropical'], // Tonga
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 25, may: 24, jun: 23, jul: 22, aug: 22, sep: 23, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'CK': { code: 'CK', hemisphere: 'south', zones: ['tropical'], // Îles Cook
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 26, may: 25, jun: 24, jul: 23, aug: 23, sep: 24, oct: 25, nov: 26, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },

  // === AFRIQUE (pays supplémentaires) ===
  'TN': { code: 'TN', hemisphere: 'north', zones: ['mediterranean', 'desert_hot'], // Tunisie
    avgTemp: { jan: 11, feb: 12, mar: 14, apr: 17, may: 21, jun: 25, jul: 28, aug: 28, sep: 26, oct: 21, nov: 16, dec: 12 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'DZ': { code: 'DZ', hemisphere: 'north', zones: ['mediterranean', 'desert_hot'], // Algérie
    avgTemp: { jan: 11, feb: 12, mar: 14, apr: 17, may: 21, jun: 25, jul: 28, aug: 28, sep: 25, oct: 20, nov: 15, dec: 12 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'SN': { code: 'SN', hemisphere: 'north', zones: ['tropical'], // Sénégal
    avgTemp: { jan: 25, feb: 26, mar: 27, apr: 28, may: 29, jun: 30, jul: 29, aug: 28, sep: 29, oct: 29, nov: 28, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'TZ': { code: 'TZ', hemisphere: 'south', zones: ['tropical', 'equatorial'], // Tanzanie
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 25, may: 24, jun: 23, jul: 22, aug: 22, sep: 23, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'UG': { code: 'UG', hemisphere: 'both', zones: ['equatorial', 'tropical'], // Ouganda
    avgTemp: { jan: 24, feb: 25, mar: 25, apr: 24, may: 24, jun: 23, jul: 23, aug: 23, sep: 24, oct: 24, nov: 24, dec: 24 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] }
  },
  'RW': { code: 'RW', hemisphere: 'south', zones: ['tropical', 'highland'], // Rwanda
    avgTemp: { jan: 20, feb: 20, mar: 20, apr: 20, may: 20, jun: 19, jul: 19, aug: 20, sep: 20, oct: 20, nov: 20, dec: 20 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'MU': { code: 'MU', hemisphere: 'south', zones: ['tropical'], // Maurice
    avgTemp: { jan: 27, feb: 27, mar: 26, apr: 25, may: 23, jun: 22, jul: 21, aug: 21, sep: 22, oct: 23, nov: 25, dec: 26 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'SC': { code: 'SC', hemisphere: 'south', zones: ['tropical'], // Seychelles
    avgTemp: { jan: 27, feb: 28, mar: 28, apr: 28, may: 28, jun: 27, jul: 26, aug: 26, sep: 27, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'MZ': { code: 'MZ', hemisphere: 'south', zones: ['tropical'], // Mozambique
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 26, may: 24, jun: 22, jul: 21, aug: 22, sep: 24, oct: 25, nov: 26, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },

  // === ASIE (pays supplémentaires) ===
  'TW': { code: 'TW', hemisphere: 'north', zones: ['subtropical'], // Taiwan
    avgTemp: { jan: 16, feb: 16, mar: 19, apr: 23, may: 26, jun: 28, jul: 29, aug: 29, sep: 27, oct: 24, nov: 21, dec: 17 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'KR': { code: 'KR', hemisphere: 'north', zones: ['continental'], // Corée du Sud
    avgTemp: { jan: -2, feb: 0, mar: 6, apr: 13, may: 18, jun: 22, jul: 25, aug: 26, sep: 21, oct: 14, nov: 7, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'NP': { code: 'NP', hemisphere: 'north', zones: ['highland', 'subtropical'], // Népal
    avgTemp: { jan: 10, feb: 12, mar: 16, apr: 20, may: 23, jun: 25, jul: 25, aug: 25, sep: 23, oct: 19, nov: 14, dec: 11 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'BT': { code: 'BT', hemisphere: 'north', zones: ['highland'], // Bhoutan
    avgTemp: { jan: 8, feb: 10, mar: 14, apr: 18, may: 21, jun: 23, jul: 23, aug: 23, sep: 21, oct: 17, nov: 13, dec: 9 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'LK': { code: 'LK', hemisphere: 'north', zones: ['tropical'], // Sri Lanka
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 29, may: 29, jun: 28, jul: 27, aug: 27, sep: 27, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [3,4,5], winter: [12,1,2], spring: [], autumn: [6,7,8,9,10,11] }
  },
  'MV': { code: 'MV', hemisphere: 'north', zones: ['tropical'], // Maldives
    avgTemp: { jan: 28, feb: 28, mar: 29, apr: 29, may: 29, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 28, dec: 28 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] }
  },

  // === EUROPE (pays supplémentaires) ===
  'PT': { code: 'PT', hemisphere: 'north', zones: ['mediterranean', 'oceanic'], // Portugal
    avgTemp: { jan: 11, feb: 12, mar: 14, apr: 16, may: 18, jun: 21, jul: 23, aug: 23, sep: 22, oct: 18, nov: 14, dec: 12 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'IE': { code: 'IE', hemisphere: 'north', zones: ['oceanic'], // Irlande
    avgTemp: { jan: 6, feb: 6, mar: 7, apr: 9, may: 11, jun: 14, jul: 15, aug: 15, sep: 13, oct: 11, nov: 8, dec: 7 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'CH': { code: 'CH', hemisphere: 'north', zones: ['continental', 'highland'], // Suisse
    avgTemp: { jan: 0, feb: 1, mar: 5, apr: 9, may: 13, jun: 17, jul: 19, aug: 18, sep: 15, oct: 10, nov: 5, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'AT': { code: 'AT', hemisphere: 'north', zones: ['continental', 'highland'], // Autriche
    avgTemp: { jan: -1, feb: 1, mar: 6, apr: 11, may: 16, jun: 19, jul: 21, aug: 20, sep: 16, oct: 11, nov: 5, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'NL': { code: 'NL', hemisphere: 'north', zones: ['oceanic'], // Pays-Bas
    avgTemp: { jan: 4, feb: 4, mar: 7, apr: 10, may: 13, jun: 16, jul: 18, aug: 18, sep: 15, oct: 12, nov: 8, dec: 5 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'BE': { code: 'BE', hemisphere: 'north', zones: ['oceanic'], // Belgique
    avgTemp: { jan: 4, feb: 4, mar: 7, apr: 10, may: 14, jun: 16, jul: 18, aug: 18, sep: 15, oct: 12, nov: 7, dec: 5 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'PL': { code: 'PL', hemisphere: 'north', zones: ['continental'], // Pologne
    avgTemp: { jan: -2, feb: -1, mar: 3, apr: 9, may: 14, jun: 17, jul: 19, aug: 18, sep: 14, oct: 9, nov: 4, dec: 0 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'CZ': { code: 'CZ', hemisphere: 'north', zones: ['continental'], // République Tchèque
    avgTemp: { jan: -1, feb: 0, mar: 5, apr: 10, may: 15, jun: 18, jul: 20, aug: 19, sep: 15, oct: 10, nov: 4, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'TR': { code: 'TR', hemisphere: 'north', zones: ['mediterranean', 'continental'], // Turquie
    avgTemp: { jan: 7, feb: 8, mar: 11, apr: 16, may: 20, jun: 25, jul: 28, aug: 28, sep: 24, oct: 18, nov: 13, dec: 9 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },

  // === AMÉRIQUE CENTRALE ET CARAÏBES (pays supplémentaires) ===
  'CR': { code: 'CR', hemisphere: 'north', zones: ['tropical'], // Costa Rica
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 26, jun: 26, jul: 25, aug: 25, sep: 25, oct: 25, nov: 24, dec: 24 },
    seasons: { summer: [12,1,2,3,4], winter: [5,6,7,8,9,10,11], spring: [], autumn: [] }
  },
  'PA': { code: 'PA', hemisphere: 'north', zones: ['tropical'], // Panama
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 28, may: 27, jun: 27, jul: 27, aug: 27, sep: 27, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [12,1,2,3], winter: [5,6,7,8,9,10,11], spring: [], autumn: [4] }
  },
  'BS': { code: 'BS', hemisphere: 'north', zones: ['tropical', 'subtropical'], // Bahamas
    avgTemp: { jan: 21, feb: 21, mar: 22, apr: 24, may: 26, jun: 28, jul: 29, aug: 29, sep: 28, oct: 26, nov: 24, dec: 22 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'HT': { code: 'HT', hemisphere: 'north', zones: ['tropical'], // Haïti
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },

  // === AMÉRIQUE DU SUD (pays supplémentaires) ===
  'VE': { code: 'VE', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Venezuela
    avgTemp: { jan: 26, feb: 26, mar: 27, apr: 27, may: 27, jun: 26, jul: 26, aug: 26, sep: 26, oct: 26, nov: 26, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'EC': { code: 'EC', hemisphere: 'both', zones: ['equatorial', 'highland'], // Équateur
    avgTemp: { jan: 23, feb: 23, mar: 23, apr: 23, may: 23, jun: 22, jul: 22, aug: 22, sep: 22, oct: 23, nov: 23, dec: 23 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] }
  },
  'UY': { code: 'UY', hemisphere: 'south', zones: ['subtropical', 'oceanic'], // Uruguay
    avgTemp: { jan: 24, feb: 23, mar: 21, apr: 17, may: 14, jun: 11, jul: 10, aug: 11, sep: 13, oct: 16, nov: 19, dec: 22 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'PY': { code: 'PY', hemisphere: 'south', zones: ['subtropical'], // Paraguay
    avgTemp: { jan: 28, feb: 27, mar: 26, apr: 23, may: 20, jun: 18, jul: 18, aug: 20, sep: 22, oct: 24, nov: 26, dec: 27 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'BO': { code: 'BO', hemisphere: 'south', zones: ['tropical', 'highland'], // Bolivie
    avgTemp: { jan: 19, feb: 19, mar: 18, apr: 17, may: 15, jun: 14, jul: 14, aug: 15, sep: 16, oct: 17, nov: 18, dec: 19 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },

  // === EUROPE ADDITIONNELLE (destinations touristiques majeures) ===
  'HR': { code: 'HR', hemisphere: 'north', zones: ['mediterranean', 'continental'], // Croatie
    avgTemp: { jan: 6, feb: 7, mar: 10, apr: 14, may: 19, jun: 23, jul: 26, aug: 26, sep: 22, oct: 17, nov: 12, dec: 8 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'SI': { code: 'SI', hemisphere: 'north', zones: ['continental', 'highland'], // Slovénie
    avgTemp: { jan: 0, feb: 2, mar: 7, apr: 11, may: 16, jun: 19, jul: 21, aug: 21, sep: 17, oct: 12, nov: 6, dec: 2 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'MT': { code: 'MT', hemisphere: 'north', zones: ['mediterranean'], // Malte
    avgTemp: { jan: 12, feb: 12, mar: 14, apr: 16, may: 20, jun: 24, jul: 27, aug: 28, sep: 25, oct: 21, nov: 17, dec: 14 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'CY': { code: 'CY', hemisphere: 'north', zones: ['mediterranean'], // Chypre
    avgTemp: { jan: 12, feb: 12, mar: 14, apr: 18, may: 22, jun: 26, jul: 29, aug: 29, sep: 26, oct: 22, nov: 17, dec: 14 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'DK': { code: 'DK', hemisphere: 'north', zones: ['oceanic'], // Danemark
    avgTemp: { jan: 2, feb: 2, mar: 4, apr: 8, may: 12, jun: 16, jul: 18, aug: 17, sep: 14, oct: 10, nov: 6, dec: 3 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'RO': { code: 'RO', hemisphere: 'north', zones: ['continental'], // Roumanie
    avgTemp: { jan: -2, feb: 1, mar: 6, apr: 12, may: 17, jun: 21, jul: 23, aug: 23, sep: 18, oct: 12, nov: 6, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'BG': { code: 'BG', hemisphere: 'north', zones: ['continental', 'mediterranean'], // Bulgarie
    avgTemp: { jan: 1, feb: 3, mar: 8, apr: 13, may: 18, jun: 22, jul: 24, aug: 24, sep: 20, oct: 14, nov: 8, dec: 3 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'ME': { code: 'ME', hemisphere: 'north', zones: ['mediterranean'], // Monténégro
    avgTemp: { jan: 7, feb: 8, mar: 11, apr: 15, may: 19, jun: 23, jul: 26, aug: 26, sep: 22, oct: 17, nov: 12, dec: 9 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'RS': { code: 'RS', hemisphere: 'north', zones: ['continental'], // Serbie
    avgTemp: { jan: 1, feb: 3, mar: 8, apr: 14, may: 19, jun: 22, jul: 24, aug: 24, sep: 19, oct: 14, nov: 8, dec: 3 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'BA': { code: 'BA', hemisphere: 'north', zones: ['continental'], // Bosnie-Herzégovine
    avgTemp: { jan: 2, feb: 4, mar: 8, apr: 13, may: 18, jun: 21, jul: 23, aug: 23, sep: 19, oct: 14, nov: 8, dec: 4 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'AL': { code: 'AL', hemisphere: 'north', zones: ['mediterranean'], // Albanie
    avgTemp: { jan: 8, feb: 9, mar: 12, apr: 16, may: 20, jun: 24, jul: 27, aug: 27, sep: 23, oct: 18, nov: 13, dec: 10 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'EE': { code: 'EE', hemisphere: 'north', zones: ['continental'], // Estonie
    avgTemp: { jan: -5, feb: -5, mar: -1, apr: 5, may: 11, jun: 15, jul: 17, aug: 16, sep: 11, oct: 6, nov: 1, dec: -3 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'LV': { code: 'LV', hemisphere: 'north', zones: ['continental'], // Lettonie
    avgTemp: { jan: -4, feb: -4, mar: 0, apr: 6, may: 12, jun: 16, jul: 18, aug: 17, sep: 12, oct: 7, nov: 2, dec: -2 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'LT': { code: 'LT', hemisphere: 'north', zones: ['continental'], // Lituanie
    avgTemp: { jan: -3, feb: -3, mar: 1, apr: 7, may: 13, jun: 16, jul: 18, aug: 17, sep: 13, oct: 8, nov: 3, dec: -1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'SK': { code: 'SK', hemisphere: 'north', zones: ['continental'], // Slovaquie
    avgTemp: { jan: -2, feb: 0, mar: 5, apr: 10, may: 15, jun: 18, jul: 20, aug: 20, sep: 15, oct: 10, nov: 4, dec: 0 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'AD': { code: 'AD', hemisphere: 'north', zones: ['highland'], // Andorre
    avgTemp: { jan: -1, feb: 0, mar: 3, apr: 6, may: 10, jun: 14, jul: 17, aug: 17, sep: 14, oct: 9, nov: 4, dec: 1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'MC': { code: 'MC', hemisphere: 'north', zones: ['mediterranean'], // Monaco
    avgTemp: { jan: 9, feb: 9, mar: 11, apr: 13, may: 17, jun: 20, jul: 23, aug: 23, sep: 20, oct: 16, nov: 12, dec: 10 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },

  // === ASIE ADDITIONNELLE ===
  'HK': { code: 'HK', hemisphere: 'north', zones: ['subtropical'], // Hong Kong
    avgTemp: { jan: 16, feb: 17, mar: 19, apr: 23, may: 26, jun: 28, jul: 29, aug: 29, sep: 28, oct: 25, nov: 21, dec: 18 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2], spring: [3,4], autumn: [10,11] }
  },
  'MO': { code: 'MO', hemisphere: 'north', zones: ['subtropical'], // Macao
    avgTemp: { jan: 15, feb: 16, mar: 19, apr: 23, may: 26, jun: 28, jul: 29, aug: 29, sep: 27, oct: 25, nov: 21, dec: 17 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2], spring: [3,4], autumn: [10,11] }
  },
  'JO': { code: 'JO', hemisphere: 'north', zones: ['desert_hot', 'mediterranean', 'highland'], // Jordanie
    avgTemp: { jan: 9, feb: 11, mar: 14, apr: 19, may: 24, jun: 27, jul: 29, aug: 29, sep: 27, oct: 23, nov: 17, dec: 12 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'IL': { code: 'IL', hemisphere: 'north', zones: ['mediterranean', 'desert_hot'], // Israël
    avgTemp: { jan: 12, feb: 13, mar: 15, apr: 19, may: 23, jun: 26, jul: 28, aug: 28, sep: 27, oct: 24, nov: 18, dec: 14 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'OM': { code: 'OM', hemisphere: 'north', zones: ['desert_hot'], // Oman
    avgTemp: { jan: 21, feb: 23, mar: 26, apr: 30, may: 35, jun: 37, jul: 36, aug: 34, sep: 33, oct: 30, nov: 26, dec: 23 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'GE': { code: 'GE', hemisphere: 'north', zones: ['subtropical', 'highland'], // Géorgie
    avgTemp: { jan: 2, feb: 3, mar: 7, apr: 12, may: 17, jun: 21, jul: 24, aug: 24, sep: 20, oct: 14, nov: 8, dec: 4 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'AM': { code: 'AM', hemisphere: 'north', zones: ['highland', 'continental'], // Arménie
    avgTemp: { jan: -3, feb: -1, mar: 5, apr: 12, may: 17, jun: 21, jul: 25, aug: 25, sep: 20, oct: 13, nov: 6, dec: 0 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'AZ': { code: 'AZ', hemisphere: 'north', zones: ['subtropical', 'continental'], // Azerbaïdjan
    avgTemp: { jan: 4, feb: 5, mar: 9, apr: 14, may: 19, jun: 24, jul: 27, aug: 27, sep: 23, oct: 17, nov: 11, dec: 7 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'UZ': { code: 'UZ', hemisphere: 'north', zones: ['continental', 'desert_cold'], // Ouzbékistan
    avgTemp: { jan: 0, feb: 2, mar: 9, apr: 16, may: 22, jun: 27, jul: 29, aug: 27, sep: 22, oct: 15, nov: 8, dec: 3 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },

  // === AFRIQUE ADDITIONNELLE ===
  'ET': { code: 'ET', hemisphere: 'north', zones: ['highland', 'tropical'], // Éthiopie
    avgTemp: { jan: 16, feb: 17, mar: 19, apr: 19, may: 19, jun: 18, jul: 17, aug: 17, sep: 17, oct: 17, nov: 17, dec: 16 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'NA': { code: 'NA', hemisphere: 'south', zones: ['desert_hot', 'subtropical'], // Namibie
    avgTemp: { jan: 28, feb: 27, mar: 26, apr: 24, may: 21, jun: 18, jul: 18, aug: 20, sep: 23, oct: 25, nov: 27, dec: 28 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'BW': { code: 'BW', hemisphere: 'south', zones: ['subtropical', 'desert_hot'], // Botswana
    avgTemp: { jan: 27, feb: 26, mar: 25, apr: 23, may: 20, jun: 17, jul: 17, aug: 20, sep: 24, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'ZW': { code: 'ZW', hemisphere: 'south', zones: ['subtropical', 'tropical'], // Zimbabwe
    avgTemp: { jan: 24, feb: 23, mar: 23, apr: 22, may: 19, jun: 17, jul: 17, aug: 19, sep: 22, oct: 24, nov: 24, dec: 24 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'ZM': { code: 'ZM', hemisphere: 'south', zones: ['tropical', 'subtropical'], // Zambie
    avgTemp: { jan: 24, feb: 23, mar: 23, apr: 23, may: 21, jun: 19, jul: 19, aug: 21, sep: 24, oct: 26, nov: 25, dec: 24 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'GH': { code: 'GH', hemisphere: 'north', zones: ['tropical'], // Ghana
    avgTemp: { jan: 27, feb: 28, mar: 28, apr: 28, may: 27, jun: 26, jul: 25, aug: 25, sep: 26, oct: 26, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3,4], winter: [5,6,7,8,9,10], spring: [], autumn: [] }
  },

  // === AMÉRIQUES ADDITIONNELLES ===
  'BZ': { code: 'BZ', hemisphere: 'north', zones: ['tropical'], // Belize
    avgTemp: { jan: 24, feb: 25, mar: 27, apr: 28, may: 29, jun: 28, jul: 28, aug: 28, sep: 28, oct: 27, nov: 25, dec: 24 },
    seasons: { summer: [3,4,5,6,7,8,9,10], winter: [11,12,1,2], spring: [], autumn: [] }
  },
  'GT': { code: 'GT', hemisphere: 'north', zones: ['tropical', 'highland'], // Guatemala
    avgTemp: { jan: 19, feb: 20, mar: 21, apr: 22, may: 22, jun: 21, jul: 21, aug: 21, sep: 21, oct: 20, nov: 20, dec: 19 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] }
  },
  'BB': { code: 'BB', hemisphere: 'north', zones: ['tropical'], // Barbade
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 27, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'AW': { code: 'AW', hemisphere: 'north', zones: ['tropical', 'desert_hot'], // Aruba
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 29, jun: 29, jul: 29, aug: 30, sep: 30, oct: 29, nov: 28, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Climat constant très sec
  },
  'BM': { code: 'BM', hemisphere: 'north', zones: ['subtropical'], // Bermudes
    avgTemp: { jan: 18, feb: 18, mar: 18, apr: 20, may: 23, jun: 26, jul: 28, aug: 29, sep: 27, oct: 24, nov: 21, dec: 19 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2,3], spring: [4], autumn: [10,11] }
  },

  // === EUROPE NORDIQUE & EST (22 nouvelles destinations pour 148 total) ===
  // Note: NO (Norvège) et SE (Suède) sont déjà définis plus haut dans le fichier
  'HU': { code: 'HU', hemisphere: 'north', zones: ['continental'], // Hongrie
    avgTemp: { jan: 0, feb: 2, mar: 7, apr: 12, may: 17, jun: 20, jul: 22, aug: 22, sep: 17, oct: 11, nov: 5, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'LU': { code: 'LU', hemisphere: 'north', zones: ['oceanic'], // Luxembourg
    avgTemp: { jan: 2, feb: 3, mar: 6, apr: 9, may: 13, jun: 16, jul: 18, aug: 18, sep: 14, oct: 10, nov: 6, dec: 3 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'MD': { code: 'MD', hemisphere: 'north', zones: ['continental'], // Moldavie
    avgTemp: { jan: -3, feb: -1, mar: 5, apr: 11, may: 17, jun: 21, jul: 23, aug: 22, sep: 17, oct: 11, nov: 4, dec: 0 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'UA': { code: 'UA', hemisphere: 'north', zones: ['continental'], // Ukraine
    avgTemp: { jan: -4, feb: -3, mar: 2, apr: 9, may: 15, jun: 19, jul: 21, aug: 20, sep: 15, oct: 9, nov: 3, dec: -1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },

  // === CARAÏBES ADDITIONNELLES ===
  'GD': { code: 'GD', hemisphere: 'north', zones: ['tropical'], // Grenade
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'LC': { code: 'LC', hemisphere: 'north', zones: ['tropical'], // Sainte-Lucie
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'AG': { code: 'AG', hemisphere: 'north', zones: ['tropical'], // Antigua-et-Barbuda
    avgTemp: { jan: 26, feb: 26, mar: 27, apr: 27, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'TT': { code: 'TT', hemisphere: 'north', zones: ['tropical'], // Trinidad-et-Tobago
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 28, may: 28, jun: 27, jul: 27, aug: 27, sep: 28, oct: 28, nov: 28, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Tropical constant
  },
  'VC': { code: 'VC', hemisphere: 'north', zones: ['tropical'], // Saint-Vincent-et-les-Grenadines
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'DM': { code: 'DM', hemisphere: 'north', zones: ['tropical'], // Dominique
    avgTemp: { jan: 26, feb: 26, mar: 27, apr: 27, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },

  // === ASIE CENTRALE & SUD-EST ===
  'KZ': { code: 'KZ', hemisphere: 'north', zones: ['continental', 'desert_cold'], // Kazakhstan
    avgTemp: { jan: -10, feb: -9, mar: -1, apr: 10, may: 17, jun: 23, jul: 25, aug: 23, sep: 17, oct: 9, nov: 0, dec: -7 },
    seasons: { summer: [6,7,8], winter: [10,11,12,1,2,3,4], spring: [5], autumn: [9] }
  },
  'KG': { code: 'KG', hemisphere: 'north', zones: ['continental', 'highland'], // Kirghizistan
    avgTemp: { jan: -6, feb: -4, mar: 3, apr: 11, may: 16, jun: 21, jul: 23, aug: 22, sep: 17, oct: 10, nov: 3, dec: -3 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'TJ': { code: 'TJ', hemisphere: 'north', zones: ['continental', 'highland'], // Tadjikistan
    avgTemp: { jan: -1, feb: 1, mar: 8, apr: 14, may: 19, jun: 24, jul: 26, aug: 25, sep: 20, oct: 13, nov: 7, dec: 2 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'BN': { code: 'BN', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Brunei
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },

  // === AFRIQUE ADDITIONNELLE ===
  'CV': { code: 'CV', hemisphere: 'north', zones: ['tropical', 'desert_hot'], // Cap-Vert
    avgTemp: { jan: 23, feb: 23, mar: 23, apr: 24, may: 25, jun: 26, jul: 27, aug: 28, sep: 28, oct: 27, nov: 26, dec: 24 },
    seasons: { summer: [6,7,8,9,10], winter: [12,1,2,3], spring: [4,5], autumn: [11] }
  },
  'KM': { code: 'KM', hemisphere: 'south', zones: ['tropical'], // Comores
    avgTemp: { jan: 28, feb: 28, mar: 28, apr: 27, may: 26, jun: 25, jul: 24, aug: 24, sep: 25, oct: 26, nov: 27, dec: 28 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'ST': { code: 'ST', hemisphere: 'north', zones: ['equatorial'], // São Tomé-et-Príncipe
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 26, jul: 25, aug: 25, sep: 26, oct: 26, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },
  'MW': { code: 'MW', hemisphere: 'south', zones: ['tropical', 'subtropical'], // Malawi
    avgTemp: { jan: 24, feb: 24, mar: 23, apr: 22, may: 20, jun: 18, jul: 17, aug: 19, sep: 22, oct: 25, nov: 25, dec: 24 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'LS': { code: 'LS', hemisphere: 'south', zones: ['highland'], // Lesotho
    avgTemp: { jan: 20, feb: 19, mar: 18, apr: 14, may: 10, jun: 7, jul: 7, aug: 10, sep: 14, oct: 17, nov: 18, dec: 19 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'SZ': { code: 'SZ', hemisphere: 'south', zones: ['subtropical'], // Eswatini (Swaziland)
    avgTemp: { jan: 23, feb: 23, mar: 22, apr: 19, may: 16, jun: 13, jul: 13, aug: 15, sep: 18, oct: 20, nov: 21, dec: 22 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },

  // === AMÉRIQUE DU SUD ADDITIONNELLE ===
  'GY': { code: 'GY', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Guyana
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 27, jul: 27, aug: 28, sep: 28, oct: 28, nov: 28, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },
  'SR': { code: 'SR', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Suriname
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 27, jul: 27, aug: 28, sep: 28, oct: 28, nov: 28, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },

  // === CARAÏBES & AMÉRIQUE CENTRALE ADDITIONNELLES (13 destinations majeures) ===
  'PR': { code: 'PR', hemisphere: 'north', zones: ['tropical'], // Puerto Rico
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 27, jun: 28, jul: 29, aug: 29, sep: 28, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'KY': { code: 'KY', hemisphere: 'north', zones: ['tropical'], // Îles Caïmans
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'TC': { code: 'TC', hemisphere: 'north', zones: ['tropical'], // Turks-et-Caïcos
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 28, jun: 29, jul: 30, aug: 30, sep: 29, oct: 28, nov: 26, dec: 25 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'VG': { code: 'VG', hemisphere: 'north', zones: ['tropical'], // Îles Vierges britanniques
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'VI': { code: 'VI', hemisphere: 'north', zones: ['tropical'], // Îles Vierges américaines
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'CW': { code: 'CW', hemisphere: 'north', zones: ['tropical', 'desert_hot'], // Curaçao
    avgTemp: { jan: 26, feb: 26, mar: 27, apr: 28, may: 28, jun: 28, jul: 28, aug: 29, sep: 29, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Climat constant très sec
  },
  'SX': { code: 'SX', hemisphere: 'north', zones: ['tropical'], // Sint Maarten
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'KN': { code: 'KN', hemisphere: 'north', zones: ['tropical'], // Saint-Kitts-et-Nevis
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 27, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'AI': { code: 'AI', hemisphere: 'north', zones: ['tropical'], // Anguilla
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'NI': { code: 'NI', hemisphere: 'north', zones: ['tropical'], // Nicaragua
    avgTemp: { jan: 26, feb: 27, mar: 28, apr: 29, may: 28, jun: 27, jul: 27, aug: 27, sep: 27, oct: 27, nov: 26, dec: 26 },
    seasons: { summer: [12,1,2,3,4], winter: [5,6,7,8,9,10,11], spring: [], autumn: [] }
  },
  'HN': { code: 'HN', hemisphere: 'north', zones: ['tropical'], // Honduras
    avgTemp: { jan: 23, feb: 24, mar: 26, apr: 27, may: 27, jun: 26, jul: 26, aug: 26, sep: 26, oct: 25, nov: 24, dec: 23 },
    seasons: { summer: [11,12,1,2,3,4], winter: [5,6,7,8,9,10], spring: [], autumn: [] }
  },
  'SV': { code: 'SV', hemisphere: 'north', zones: ['tropical'], // El Salvador
    avgTemp: { jan: 23, feb: 24, mar: 26, apr: 27, may: 27, jun: 26, jul: 26, aug: 26, sep: 25, oct: 25, nov: 24, dec: 23 },
    seasons: { summer: [11,12,1,2,3,4], winter: [5,6,7,8,9,10], spring: [], autumn: [] }
  },
  'MS': { code: 'MS', hemisphere: 'north', zones: ['tropical'], // Montserrat
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 27, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },

  // === ASIE & MOYEN-ORIENT ADDITIONNELS (7 destinations) ===
  'PK': { code: 'PK', hemisphere: 'north', zones: ['subtropical', 'highland', 'desert_hot'], // Pakistan
    avgTemp: { jan: 12, feb: 15, mar: 20, apr: 26, may: 31, jun: 34, jul: 32, aug: 30, sep: 29, oct: 24, nov: 18, dec: 13 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'BD': { code: 'BD', hemisphere: 'north', zones: ['tropical', 'subtropical'], // Bangladesh
    avgTemp: { jan: 19, feb: 22, mar: 27, apr: 29, may: 29, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 24, dec: 20 },
    seasons: { summer: [3,4,5], winter: [11,12,1,2], spring: [], autumn: [6,7,8,9,10] }
  },
  'MN': { code: 'MN', hemisphere: 'north', zones: ['continental', 'desert_cold'], // Mongolie
    avgTemp: { jan: -20, feb: -15, mar: -5, apr: 5, may: 13, jun: 18, jul: 20, aug: 18, sep: 12, oct: 3, nov: -8, dec: -17 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'BH': { code: 'BH', hemisphere: 'north', zones: ['desert_hot'], // Bahreïn
    avgTemp: { jan: 17, feb: 18, mar: 21, apr: 26, may: 31, jun: 34, jul: 36, aug: 36, sep: 34, oct: 30, nov: 25, dec: 20 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'KW': { code: 'KW', hemisphere: 'north', zones: ['desert_hot'], // Koweït
    avgTemp: { jan: 13, feb: 15, mar: 20, apr: 27, may: 34, jun: 38, jul: 40, aug: 40, sep: 36, oct: 30, nov: 22, dec: 16 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'LB': { code: 'LB', hemisphere: 'north', zones: ['mediterranean', 'highland'], // Liban
    avgTemp: { jan: 11, feb: 12, mar: 14, apr: 18, may: 22, jun: 25, jul: 28, aug: 28, sep: 26, oct: 23, nov: 17, dec: 13 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'TL': { code: 'TL', hemisphere: 'south', zones: ['tropical'], // Timor-Leste
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 26, jun: 25, jul: 24, aug: 25, sep: 26, oct: 27, nov: 28, dec: 28 },
    seasons: { summer: [11,12,1,2,3], winter: [5,6,7,8], spring: [9,10], autumn: [4] }
  },

  // === OCÉANIE & PACIFIQUE ADDITIONNELS (8 destinations) ===
  'VU': { code: 'VU', hemisphere: 'south', zones: ['tropical'], // Vanuatu
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 26, may: 25, jun: 24, jul: 23, aug: 23, sep: 24, oct: 25, nov: 26, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'SB': { code: 'SB', hemisphere: 'south', zones: ['tropical', 'equatorial'], // Îles Salomon
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 26, jul: 26, aug: 26, sep: 26, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [], spring: [9,10], autumn: [4,5,6,7,8] }
  },
  'PW': { code: 'PW', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Palau
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 28, jul: 27, aug: 27, sep: 27, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },
  'GU': { code: 'GU', hemisphere: 'north', zones: ['tropical'], // Guam
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 28, dec: 27 },
    seasons: { summer: [12,1,2,3,4,5], winter: [6,7,8,9,10,11], spring: [], autumn: [] }
  },
  'KI': { code: 'KI', hemisphere: 'both', zones: ['equatorial'], // Kiribati
    avgTemp: { jan: 28, feb: 28, mar: 28, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 28, dec: 28 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },
  'MH': { code: 'MH', hemisphere: 'north', zones: ['tropical'], // Îles Marshall
    avgTemp: { jan: 27, feb: 27, mar: 28, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 28, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Tropical constant
  },
  'TV': { code: 'TV', hemisphere: 'south', zones: ['equatorial'], // Tuvalu
    avgTemp: { jan: 29, feb: 29, mar: 29, apr: 29, may: 29, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 29, dec: 29 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },
  'NU': { code: 'NU', hemisphere: 'south', zones: ['tropical'], // Niue
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 25, may: 24, jun: 23, jul: 22, aug: 22, sep: 23, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },

  // === AFRIQUE ADDITIONNELLE (6 destinations) ===
  'NG': { code: 'NG', hemisphere: 'north', zones: ['tropical', 'subtropical'], // Nigeria
    avgTemp: { jan: 27, feb: 29, mar: 30, apr: 30, may: 28, jun: 27, jul: 26, aug: 25, sep: 26, oct: 27, nov: 28, dec: 27 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'CI': { code: 'CI', hemisphere: 'north', zones: ['tropical'], // Côte d'Ivoire
    avgTemp: { jan: 27, feb: 28, mar: 29, apr: 28, may: 28, jun: 26, jul: 25, aug: 25, sep: 26, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [12,1,2,3], winter: [6,7,8], spring: [9,10,11], autumn: [4,5] }
  },
  'CM': { code: 'CM', hemisphere: 'north', zones: ['tropical', 'equatorial'], // Cameroun
    avgTemp: { jan: 26, feb: 27, mar: 27, apr: 27, may: 27, jun: 26, jul: 25, aug: 25, sep: 25, oct: 26, nov: 26, dec: 26 },
    seasons: { summer: [3,4,5,6,7,8], winter: [11,12,1,2], spring: [], autumn: [9,10] }
  },
  'GA': { code: 'GA', hemisphere: 'both', zones: ['tropical', 'equatorial'], // Gabon
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 27, jun: 26, jul: 25, aug: 25, sep: 26, oct: 26, nov: 26, dec: 27 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'AO': { code: 'AO', hemisphere: 'south', zones: ['tropical', 'subtropical'], // Angola
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 25, may: 23, jun: 20, jul: 19, aug: 21, sep: 24, oct: 26, nov: 26, dec: 26 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'DJ': { code: 'DJ', hemisphere: 'north', zones: ['desert_hot'], // Djibouti
    avgTemp: { jan: 25, feb: 26, mar: 28, apr: 30, may: 32, jun: 35, jul: 38, aug: 37, sep: 34, oct: 31, nov: 28, dec: 26 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2], spring: [3,4], autumn: [10] }
  },

  // === EUROPE ADDITIONNELLE (9 destinations) ===
  'FO': { code: 'FO', hemisphere: 'north', zones: ['oceanic', 'subarctic'], // Îles Féroé
    avgTemp: { jan: 3, feb: 3, mar: 4, apr: 5, may: 7, jun: 10, jul: 11, aug: 11, sep: 10, oct: 8, nov: 5, dec: 4 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'GI': { code: 'GI', hemisphere: 'north', zones: ['mediterranean'], // Gibraltar
    avgTemp: { jan: 13, feb: 13, mar: 15, apr: 16, may: 19, jun: 22, jul: 25, aug: 25, sep: 23, oct: 20, nov: 16, dec: 14 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'LI': { code: 'LI', hemisphere: 'north', zones: ['continental', 'highland'], // Liechtenstein
    avgTemp: { jan: -1, feb: 0, mar: 4, apr: 8, may: 13, jun: 16, jul: 18, aug: 17, sep: 14, oct: 9, nov: 4, dec: 0 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'SM': { code: 'SM', hemisphere: 'north', zones: ['mediterranean'], // San Marino
    avgTemp: { jan: 4, feb: 5, mar: 8, apr: 12, may: 16, jun: 20, jul: 23, aug: 23, sep: 19, oct: 14, nov: 9, dec: 5 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'VA': { code: 'VA', hemisphere: 'north', zones: ['mediterranean'], // Vatican
    avgTemp: { jan: 8, feb: 9, mar: 12, apr: 15, may: 19, jun: 23, jul: 26, aug: 26, sep: 22, oct: 17, nov: 12, dec: 9 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'BY': { code: 'BY', hemisphere: 'north', zones: ['continental'], // Bélarus
    avgTemp: { jan: -6, feb: -5, mar: 0, apr: 8, may: 15, jun: 18, jul: 20, aug: 19, sep: 14, oct: 8, nov: 2, dec: -3 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'MK': { code: 'MK', hemisphere: 'north', zones: ['continental', 'mediterranean'], // Macédoine du Nord
    avgTemp: { jan: 1, feb: 3, mar: 8, apr: 13, may: 18, jun: 22, jul: 24, aug: 24, sep: 19, oct: 13, nov: 7, dec: 2 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'XK': { code: 'XK', hemisphere: 'north', zones: ['continental', 'mediterranean'], // Kosovo
    avgTemp: { jan: 0, feb: 2, mar: 7, apr: 12, may: 17, jun: 21, jul: 23, aug: 23, sep: 18, oct: 12, nov: 6, dec: 1 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'NR': { code: 'NR', hemisphere: 'south', zones: ['tropical'], // Nauru
    avgTemp: { jan: 28, feb: 28, mar: 28, apr: 28, may: 28, jun: 28, jul: 28, aug: 28, sep: 28, oct: 28, nov: 28, dec: 28 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },

  // === DESTINATIONS ADDITIONNELLES POUR 100% COUVERTURE (10 pays) ===
  'PS': { code: 'PS', hemisphere: 'north', zones: ['mediterranean', 'desert_hot'], // Palestine
    avgTemp: { jan: 12, feb: 13, mar: 15, apr: 19, may: 23, jun: 26, jul: 28, aug: 28, sep: 27, oct: 24, nov: 18, dec: 14 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'TM': { code: 'TM', hemisphere: 'north', zones: ['desert_hot', 'desert_cold', 'continental'], // Turkménistan
    avgTemp: { jan: 0, feb: 3, mar: 10, apr: 18, may: 25, jun: 31, jul: 33, aug: 31, sep: 25, oct: 16, nov: 9, dec: 3 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'YT': { code: 'YT', hemisphere: 'south', zones: ['tropical'], // Mayotte
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 26, jun: 25, jul: 24, aug: 24, sep: 25, oct: 26, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [5,6,7,8], spring: [9,10], autumn: [4] }
  },
  'BL': { code: 'BL', hemisphere: 'north', zones: ['tropical'], // Saint-Barthélemy
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'MF': { code: 'MF', hemisphere: 'north', zones: ['tropical'], // Saint-Martin (France)
    avgTemp: { jan: 25, feb: 25, mar: 26, apr: 27, may: 28, jun: 29, jul: 29, aug: 29, sep: 29, oct: 28, nov: 27, dec: 26 },
    seasons: { summer: [5,6,7,8,9,10], winter: [11,12,1,2,3,4], spring: [], autumn: [] }
  },
  'WF': { code: 'WF', hemisphere: 'south', zones: ['tropical'], // Wallis-et-Futuna
    avgTemp: { jan: 27, feb: 27, mar: 27, apr: 27, may: 26, jun: 25, jul: 24, aug: 24, sep: 25, oct: 26, nov: 27, dec: 27 },
    seasons: { summer: [11,12,1,2,3], winter: [5,6,7,8], spring: [9,10], autumn: [4] }
  },
  'PM': { code: 'PM', hemisphere: 'north', zones: ['oceanic', 'subarctic'], // Saint-Pierre-et-Miquelon
    avgTemp: { jan: -3, feb: -4, mar: -2, apr: 2, may: 6, jun: 11, jul: 15, aug: 16, sep: 12, oct: 7, nov: 3, dec: -1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'AX': { code: 'AX', hemisphere: 'north', zones: ['oceanic', 'continental'], // Îles Åland
    avgTemp: { jan: -3, feb: -4, mar: -1, apr: 4, may: 10, jun: 14, jul: 17, aug: 16, sep: 11, oct: 6, nov: 2, dec: -1 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
  'IM': { code: 'IM', hemisphere: 'north', zones: ['oceanic'], // Île de Man
    avgTemp: { jan: 5, feb: 5, mar: 6, apr: 8, may: 11, jun: 13, jul: 15, aug: 15, sep: 13, oct: 10, nov: 7, dec: 6 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'JE': { code: 'JE', hemisphere: 'north', zones: ['oceanic'], // Jersey
    avgTemp: { jan: 6, feb: 6, mar: 8, apr: 10, may: 13, jun: 16, jul: 18, aug: 18, sep: 16, oct: 13, nov: 9, dec: 7 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },

  // === COUVERTURE MAXIMALE MONDIALE - 19 DESTINATIONS ADDITIONNELLES ===

  // HAUTE PRIORITÉ - Destinations viables (7)
  'IR': { code: 'IR', hemisphere: 'north', zones: ['desert_hot', 'continental', 'highland'], // Iran
    avgTemp: { jan: 7, feb: 10, mar: 15, apr: 21, may: 27, jun: 32, jul: 35, aug: 34, sep: 30, oct: 23, nov: 15, dec: 9 },
    seasons: { summer: [5,6,7,8,9], winter: [11,12,1,2,3], spring: [4], autumn: [10] }
  },
  'TG': { code: 'TG', hemisphere: 'north', zones: ['tropical'], // Togo
    avgTemp: { jan: 27, feb: 28, mar: 29, apr: 28, may: 28, jun: 26, jul: 25, aug: 25, sep: 26, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'BJ': { code: 'BJ', hemisphere: 'north', zones: ['tropical'], // Bénin
    avgTemp: { jan: 27, feb: 29, mar: 29, apr: 29, may: 28, jun: 27, jul: 26, aug: 25, sep: 26, oct: 27, nov: 28, dec: 27 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'GM': { code: 'GM', hemisphere: 'north', zones: ['tropical', 'subtropical'], // Gambie
    avgTemp: { jan: 24, feb: 25, mar: 27, apr: 28, may: 29, jun: 29, jul: 28, aug: 28, sep: 28, oct: 29, nov: 27, dec: 25 },
    seasons: { summer: [11,12,1,2,3,4], winter: [6,7,8,9], spring: [], autumn: [5,10] }
  },
  'GG': { code: 'GG', hemisphere: 'north', zones: ['oceanic'], // Guernesey
    avgTemp: { jan: 7, feb: 7, mar: 8, apr: 10, may: 13, jun: 15, jul: 17, aug: 17, sep: 16, oct: 13, nov: 10, dec: 8 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'BF': { code: 'BF', hemisphere: 'north', zones: ['tropical', 'subtropical'], // Burkina Faso
    avgTemp: { jan: 25, feb: 28, mar: 32, apr: 34, may: 33, jun: 31, jul: 28, aug: 27, sep: 28, oct: 30, nov: 28, dec: 26 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'GB': { code: 'GB', hemisphere: 'north', zones: ['oceanic'], // Royaume-Uni (global)
    avgTemp: { jan: 5, feb: 5, mar: 7, apr: 9, may: 12, jun: 15, jul: 17, aug: 17, sep: 14, oct: 11, nov: 7, dec: 5 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },

  // MOYENNE PRIORITÉ - Petites destinations (12)
  'GN': { code: 'GN', hemisphere: 'north', zones: ['tropical'], // Guinée
    avgTemp: { jan: 26, feb: 27, mar: 28, apr: 28, may: 28, jun: 26, jul: 25, aug: 25, sep: 25, oct: 26, nov: 27, dec: 26 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'BI': { code: 'BI', hemisphere: 'south', zones: ['tropical', 'highland'], // Burundi
    avgTemp: { jan: 23, feb: 23, mar: 23, apr: 23, may: 23, jun: 22, jul: 22, aug: 23, sep: 24, oct: 24, nov: 23, dec: 23 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'SL': { code: 'SL', hemisphere: 'north', zones: ['tropical'], // Sierra Leone
    avgTemp: { jan: 27, feb: 28, mar: 28, apr: 28, may: 28, jun: 27, jul: 26, aug: 25, sep: 26, oct: 27, nov: 27, dec: 27 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'ML': { code: 'ML', hemisphere: 'north', zones: ['desert_hot', 'tropical'], // Mali
    avgTemp: { jan: 25, feb: 28, mar: 32, apr: 35, may: 36, jun: 34, jul: 31, aug: 29, sep: 31, oct: 32, nov: 29, dec: 26 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'NE': { code: 'NE', hemisphere: 'north', zones: ['desert_hot'], // Niger
    avgTemp: { jan: 23, feb: 26, mar: 31, apr: 35, may: 37, jun: 36, jul: 33, aug: 31, sep: 33, oct: 33, nov: 29, dec: 24 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'LR': { code: 'LR', hemisphere: 'north', zones: ['tropical'], // Liberia
    avgTemp: { jan: 26, feb: 27, mar: 28, apr: 27, may: 27, jun: 26, jul: 25, aug: 25, sep: 25, oct: 26, nov: 27, dec: 26 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'MR': { code: 'MR', hemisphere: 'north', zones: ['desert_hot'], // Mauritanie
    avgTemp: { jan: 22, feb: 24, mar: 27, apr: 30, may: 32, jun: 33, jul: 32, aug: 32, sep: 33, oct: 32, nov: 28, dec: 23 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'GW': { code: 'GW', hemisphere: 'north', zones: ['tropical'], // Guinée-Bissau
    avgTemp: { jan: 26, feb: 27, mar: 28, apr: 28, may: 29, jun: 28, jul: 27, aug: 27, sep: 27, oct: 28, nov: 28, dec: 26 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'TD': { code: 'TD', hemisphere: 'north', zones: ['desert_hot', 'tropical'], // Tchad
    avgTemp: { jan: 24, feb: 27, mar: 31, apr: 34, may: 35, jun: 34, jul: 31, aug: 30, sep: 31, oct: 32, nov: 29, dec: 25 },
    seasons: { summer: [4,5,6,7,8,9], winter: [11,12,1,2,3], spring: [], autumn: [10] }
  },
  'GQ': { code: 'GQ', hemisphere: 'both', zones: ['equatorial'], // Guinée Équatoriale
    avgTemp: { jan: 26, feb: 26, mar: 26, apr: 26, may: 26, jun: 25, jul: 24, aug: 24, sep: 25, oct: 25, nov: 25, dec: 26 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Équatorial constant
  },
  'BQ': { code: 'BQ', hemisphere: 'north', zones: ['tropical'], // Bonaire, Sint Eustatius et Saba
    avgTemp: { jan: 26, feb: 26, mar: 27, apr: 27, may: 28, jun: 28, jul: 28, aug: 29, sep: 29, oct: 28, nov: 27, dec: 27 },
    seasons: { summer: [], winter: [], spring: [], autumn: [] } // Climat constant
  },
  'KP': { code: 'KP', hemisphere: 'north', zones: ['continental'], // Corée du Nord
    avgTemp: { jan: -8, feb: -5, mar: 2, apr: 10, may: 16, jun: 21, jul: 24, aug: 24, sep: 18, oct: 11, nov: 2, dec: -5 },
    seasons: { summer: [6,7,8], winter: [11,12,1,2,3], spring: [4,5], autumn: [9,10] }
  },
};

/**
 * Climat moyen par zone géographique (fallback si pas de pays spécifique)
 */
export const REGIONAL_CLIMATES: Record<string, Partial<CountryClimate>> = {
  'europe': {
    hemisphere: 'north', // Europe entière dans hémisphère nord
    zones: ['oceanic', 'continental', 'mediterranean'],
    avgTemp: { jan: 3, feb: 4, mar: 8, apr: 11, may: 15, jun: 18, jul: 20, aug: 20, sep: 16, oct: 12, nov: 7, dec: 4 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'asie': {
    hemisphere: 'both', // Asie chevauche l'équateur (Indonésie, Malaisie)
    zones: ['tropical', 'subtropical', 'continental'],
    avgTemp: { jan: 15, feb: 17, mar: 21, apr: 25, may: 27, jun: 28, jul: 28, aug: 27, sep: 26, oct: 23, nov: 19, dec: 16 },
    seasons: { summer: [5,6,7,8,9], winter: [12,1,2], spring: [3,4], autumn: [10,11] }
  },
  'afrique': {
    hemisphere: 'both', // Afrique traversée par l'équateur
    zones: ['tropical', 'desert_hot', 'equatorial'],
    avgTemp: { jan: 25, feb: 26, mar: 27, apr: 27, may: 27, jun: 26, jul: 25, aug: 25, sep: 26, oct: 27, nov: 26, dec: 25 },
    seasons: { summer: [11,12,1,2,3], winter: [6,7,8], spring: [9,10], autumn: [4,5] }
  },
  'amerique-nord': {
    hemisphere: 'north', // Amérique du Nord entière dans hémisphère nord
    zones: ['continental', 'subtropical'],
    avgTemp: { jan: 0, feb: 2, mar: 7, apr: 13, may: 18, jun: 23, jul: 26, aug: 25, sep: 20, oct: 14, nov: 7, dec: 2 },
    seasons: { summer: [6,7,8], winter: [12,1,2], spring: [3,4,5], autumn: [9,10,11] }
  },
  'amerique-centrale-caraibes': {
    hemisphere: 'north', // Amérique centrale et Caraïbes dans hémisphère nord
    zones: ['tropical'],
    avgTemp: { jan: 24, feb: 24, mar: 25, apr: 26, may: 27, jun: 27, jul: 28, aug: 28, sep: 27, oct: 27, nov: 26, dec: 24 },
    seasons: { summer: [3,4,5,6,7,8,9,10], winter: [11,12,1,2], spring: [], autumn: [] }
  },
  'amerique-sud': {
    hemisphere: 'both', // Amérique du Sud traversée par l'équateur (Équateur, Colombie, Brésil)
    zones: ['tropical', 'equatorial', 'subtropical'],
    avgTemp: { jan: 26, feb: 26, mar: 25, apr: 24, may: 22, jun: 21, jul: 21, aug: 22, sep: 23, oct: 24, nov: 25, dec: 26 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'oceanie': {
    hemisphere: 'both', // Océanie chevauche l'équateur (Papouasie-Nouvelle-Guinée nord, Australie sud)
    zones: ['tropical', 'subtropical', 'oceanic'],
    avgTemp: { jan: 25, feb: 25, mar: 24, apr: 22, may: 19, jun: 17, jul: 16, aug: 17, sep: 19, oct: 21, nov: 23, dec: 24 },
    seasons: { summer: [12,1,2], winter: [6,7,8], spring: [9,10,11], autumn: [3,4,5] }
  },
  'multi-destinations': {
    hemisphere: 'both', // Multi-destinations peut couvrir les deux hémisphères
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
 * Catégories de température :
 * - Très Froide : < 0°C
 * - Froide : 0-10°C
 * - Tempérée : 10-20°C
 * - Chaude : 20-30°C
 * - Très Chaude : 30-38°C (Chaleur intense)
 * - Chaleur Extrême : > 38°C (Zone torride)
 */
export function getTemperatureCategory(avgTemp: number): string[] {
  const temps: string[] = [];

  // Catégorie principale basée sur la température
  if (avgTemp < 0) {
    temps.push('tres-froide');
  } else if (avgTemp < 10) {
    temps.push('froide');
  } else if (avgTemp < 20) {
    temps.push('temperee');
  } else if (avgTemp < 30) {
    temps.push('chaude');
  } else if (avgTemp < 38) {
    temps.push('tres-chaude');
  } else {
    temps.push('chaleur-extreme');
  }

  // Ajouter des catégories adjacentes pour la flexibilité du filtrage
  // Températures très froides incluent aussi froide
  if (avgTemp < 0) {
    temps.push('froide');
  }

  // Zone de transition tempérée-chaude (15-25°C)
  if (avgTemp >= 15 && avgTemp < 25) {
    if (!temps.includes('temperee')) temps.push('temperee');
    if (!temps.includes('chaude')) temps.push('chaude');
  }

  // Zone de transition chaude-très chaude (28-33°C)
  if (avgTemp >= 28 && avgTemp < 33) {
    if (!temps.includes('chaude')) temps.push('chaude');
    if (!temps.includes('tres-chaude')) temps.push('tres-chaude');
  }

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
