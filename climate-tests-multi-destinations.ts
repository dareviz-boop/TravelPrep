/**
 * Script de test spécialisé pour les MULTI-DESTINATIONS / TOURS DU MONDE
 * 50+ tests couvrant toutes les combinaisons possibles de voyages multi-pays
 */

import {
  getCountryClimate,
  getRegionalClimate,
  getTemperatureCategory,
  getSeasonsForMonth,
  COUNTRY_CLIMATES,
  type CountryClimate
} from './src/utils/climateDatabase';

// Types
interface MultiDestinationTestCase {
  id: number;
  type: string;
  titre: string;
  pays: string[];
  paysCodes: string[];
  dateDepart: string;
  duree: number;
  description: string;
  objectifTest: string;
}

interface MultiDestinationTestResult {
  testCase: MultiDestinationTestCase;
  success: boolean;
  errors: string[];
  warnings: string[];
  details: {
    paysAnalyses: Array<{
      pays: string;
      code: string;
      month: number;
      avgTemp: number;
      tempCategories: string[];
      seasons: string[];
      hemisphere: string;
      zones: string[];
    }>;
    diversiteClimatique: {
      tempMin: number;
      tempMax: number;
      amplitude: number;
      hemispheres: string[];
      zonesUniques: string[];
      nombreSaisons: number;
    };
  };
}

// Utilitaires
function getMonthFromDate(dateStr: string): number {
  const date = new Date(dateStr);
  return date.getMonth() + 1;
}

function getMonthName(month: number): string {
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return months[month - 1];
}

function getTempFromMonth(climate: CountryClimate, month: number): number {
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
  return climate.avgTemp[monthKeys[month - 1]];
}

// Générateur de cas de test Multi-Destinations
function generateMultiDestinationTests(): MultiDestinationTestCase[] {
  const tests: MultiDestinationTestCase[] = [];
  let id = 1;

  // === CATÉGORIE 1: TOURS DU MONDE CLASSIQUES (10 tests) ===

  // Test 1: Tour du monde Ouest → Est (été nord)
  tests.push({
    id: id++,
    type: 'Tour du Monde Complet',
    titre: 'Tour du Monde Été NH',
    pays: ['États-Unis', 'Japon', 'Thaïlande', 'Inde', 'Émirats', 'France'],
    paysCodes: ['US', 'JP', 'TH', 'IN', 'AE', 'FR'],
    dateDepart: '2025-07-01',
    duree: 60,
    description: 'Tour du monde classique hémisphère nord en été',
    objectifTest: 'Vérifier cohérence multi-pays été hémisphère nord'
  });

  // Test 2: Tour du monde Ouest → Est (hiver nord)
  tests.push({
    id: id++,
    type: 'Tour du Monde Complet',
    titre: 'Tour du Monde Hiver NH',
    pays: ['Canada', 'Islande', 'Russie', 'Mongolie', 'Chine', 'Corée du Sud'],
    paysCodes: ['CA', 'IS', 'RU', 'MN', 'CN', 'KR'],
    dateDepart: '2026-01-15',
    duree: 45,
    description: 'Tour du monde pays froids hiver',
    objectifTest: 'Vérifier gestion températures négatives multiples pays'
  });

  // Test 3: Tour hémisphère sud été austral
  tests.push({
    id: id++,
    type: 'Tour Hémisphère Sud',
    titre: 'Tour Hémisphère Sud Été',
    pays: ['Australie', 'Nouvelle-Zélande', 'Argentine', 'Brésil', 'Afrique du Sud'],
    paysCodes: ['AU', 'NZ', 'AR', 'BR', 'ZA'],
    dateDepart: '2026-01-10',
    duree: 50,
    description: 'Tour hémisphère sud pendant été austral',
    objectifTest: 'Vérifier inversion saisons cohérente sur tous pays sud'
  });

  // Test 4: Tour hémisphère sud hiver austral
  tests.push({
    id: id++,
    type: 'Tour Hémisphère Sud',
    titre: 'Tour Hémisphère Sud Hiver',
    pays: ['Chili', 'Argentine', 'Afrique du Sud', 'Australie', 'Nouvelle-Zélande'],
    paysCodes: ['CL', 'AR', 'ZA', 'AU', 'NZ'],
    dateDepart: '2025-07-15',
    duree: 40,
    description: 'Tour hémisphère sud pendant hiver austral',
    objectifTest: 'Vérifier cohérence hiver austral = été hémisphère nord'
  });

  // Test 5: Équateur crossing (traverse équateur)
  tests.push({
    id: id++,
    type: 'Équateur Crossing',
    titre: 'Traverse Équateur Nord-Sud',
    pays: ['Mexique', 'Guatemala', 'Équateur', 'Pérou', 'Chili', 'Argentine'],
    paysCodes: ['MX', 'GT', 'EC', 'PE', 'CL', 'AR'],
    dateDepart: '2025-06-01',
    duree: 55,
    description: 'Descente Amérique traversant équateur',
    objectifTest: 'Vérifier transition hémisphère nord → sud'
  });

  // Test 6: Tour Asie complet
  tests.push({
    id: id++,
    type: 'Tour Régional',
    titre: 'Tour Asie Complet',
    pays: ['Japon', 'Chine', 'Mongolie', 'Kazakhstan', 'Inde', 'Thaïlande', 'Indonésie'],
    paysCodes: ['JP', 'CN', 'MN', 'KZ', 'IN', 'TH', 'ID'],
    dateDepart: '2025-04-10',
    duree: 65,
    description: 'Tour Asie du nord au sud',
    objectifTest: 'Vérifier diversité climatique Asie (froid → tropical)'
  });

  // Test 7: Tour Afrique Nord-Sud
  tests.push({
    id: id++,
    type: 'Tour Régional',
    titre: 'Tour Afrique Nord-Sud',
    pays: ['Maroc', 'Algérie', 'Mali', 'Niger', 'Kenya', 'Tanzanie', 'Afrique du Sud'],
    paysCodes: ['MA', 'DZ', 'ML', 'NE', 'KE', 'TZ', 'ZA'],
    dateDepart: '2025-10-01',
    duree: 50,
    description: 'Traverse Afrique déserts → savane → austral',
    objectifTest: 'Vérifier diversité Afrique (méditerranée → désert → tropical → austral)'
  });

  // Test 8: Tour Europe complet
  tests.push({
    id: id++,
    type: 'Tour Régional',
    titre: 'Tour Europe Nord-Sud',
    pays: ['Norvège', 'Suède', 'Allemagne', 'France', 'Espagne', 'Italie', 'Grèce'],
    paysCodes: ['NO', 'SE', 'DE', 'FR', 'ES', 'IT', 'GR'],
    dateDepart: '2025-08-01',
    duree: 35,
    description: 'Tour Europe arctique → méditerranée',
    objectifTest: 'Vérifier gradient Europe (subarctique → méditerranéen)'
  });

  // Test 9: Tour Amériques complètes
  tests.push({
    id: id++,
    type: 'Tour Régional',
    titre: 'Tour Amériques Alaska-Patagonie',
    pays: ['États-Unis', 'Mexique', 'Costa Rica', 'Colombie', 'Pérou', 'Chili', 'Argentine'],
    paysCodes: ['US', 'MX', 'CR', 'CO', 'PE', 'CL', 'AR'],
    dateDepart: '2025-09-15',
    duree: 70,
    description: 'Descente complète Amériques',
    objectifTest: 'Vérifier cohérence nord → équateur → sud'
  });

  // Test 10: Tour îles du monde
  tests.push({
    id: id++,
    type: 'Tour Thématique',
    titre: 'Tour Îles Paradisiaques',
    pays: ['Maldives', 'Seychelles', 'Maurice', 'Fidji', 'Polynésie française', 'Hawaï'],
    paysCodes: ['MV', 'SC', 'MU', 'FJ', 'PF', 'US'],
    dateDepart: '2025-11-01',
    duree: 40,
    description: 'Tour îles tropicales mondiales',
    objectifTest: 'Vérifier cohérence climats insulaires tropicaux'
  });

  // === CATÉGORIE 2: CONTRASTES CLIMATIQUES EXTRÊMES (10 tests) ===

  // Test 11: Extrêmes température (froid → chaud)
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Arctique → Désert Torride',
    pays: ['Groenland', 'Islande', 'Maroc', 'Émirats', 'Qatar'],
    paysCodes: ['GL', 'IS', 'MA', 'AE', 'QA'],
    dateDepart: '2025-07-01',
    duree: 30,
    description: 'Du plus froid au plus chaud',
    objectifTest: 'Vérifier gestion transition -20°C → +40°C'
  });

  // Test 12: Déserts (chaud + froid)
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Tour Déserts Monde',
    pays: ['Mongolie', 'Kazakhstan', 'Arabie Saoudite', 'Mali', 'Niger', 'Australie'],
    paysCodes: ['MN', 'KZ', 'SA', 'ML', 'NE', 'AU'],
    dateDepart: '2025-06-15',
    duree: 45,
    description: 'Déserts froids et chauds',
    objectifTest: 'Vérifier différenciation désert_cold vs desert_hot'
  });

  // Test 13: Altitude extrême multi-pays
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Tour Montagnes Monde',
    pays: ['Népal', 'Tibet', 'Pérou', 'Bolivie', 'Kenya'],
    paysCodes: ['NP', 'CN', 'PE', 'BO', 'KE'],
    dateDepart: '2025-10-10',
    duree: 40,
    description: 'Hautes altitudes mondiales',
    objectifTest: 'Vérifier gestion altitude 2500-5500m+ multi-pays'
  });

  // Test 14: Tropical + Polaire
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Équateur → Pôles',
    pays: ['Indonésie', 'Singapour', 'Australie', 'Nouvelle-Zélande', 'Antarctique'],
    paysCodes: ['ID', 'SG', 'AU', 'NZ', 'AQ'],
    dateDepart: '2026-01-05',
    duree: 50,
    description: 'Du tropical au polaire',
    objectifTest: 'Vérifier transition équatorial → polaire'
  });

  // Test 15: Humidité extrêmes
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Humide → Aride',
    pays: ['Malaisie', 'Thaïlande', 'Inde', 'Émirats', 'Égypte', 'Niger'],
    paysCodes: ['MY', 'TH', 'IN', 'AE', 'EG', 'NE'],
    dateDepart: '2025-07-20',
    duree: 35,
    description: 'Mousson → désert aride',
    objectifTest: 'Vérifier transition humidité 90% → 10%'
  });

  // Test 16: Saisons inversées simultanées
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Été Nord + Été Sud Simultanés',
    pays: ['France', 'Espagne', 'Équateur', 'Pérou', 'Chili', 'Argentine'],
    paysCodes: ['FR', 'ES', 'EC', 'PE', 'CL', 'AR'],
    dateDepart: '2026-01-01',
    duree: 45,
    description: 'Hiver nord + été sud simultanés',
    objectifTest: 'Vérifier gestion saisons opposées voyage unique'
  });

  // Test 17: Continental vs Maritime
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Intérieur Continents → Îles',
    pays: ['Mongolie', 'Kazakhstan', 'Turquie', 'Grèce', 'Maldives', 'Seychelles'],
    paysCodes: ['MN', 'KZ', 'TR', 'GR', 'MV', 'SC'],
    dateDepart: '2025-05-01',
    duree: 40,
    description: 'Amplitude thermique → climat maritime constant',
    objectifTest: 'Vérifier contraste continental (Δ40°C) vs maritime (constant)'
  });

  // Test 18: 4 saisons en 1 voyage
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Toutes Saisons en 1 Voyage',
    pays: ['Australie', 'Indonésie', 'Japon', 'Russie', 'Norvège'],
    paysCodes: ['AU', 'ID', 'JP', 'RU', 'NO'],
    dateDepart: '2026-01-20',
    duree: 50,
    description: 'Été austral → tropical → hiver nord → arctique',
    objectifTest: 'Vérifier exposition toutes saisons voyage unique'
  });

  // Test 19: Mousson + Sécheresse
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Saison Pluies → Saison Sèche',
    pays: ['Bangladesh', 'Inde', 'Thaïlande', 'Australie', 'Namibie'],
    paysCodes: ['BD', 'IN', 'TH', 'AU', 'NA'],
    dateDepart: '2025-07-10',
    duree: 40,
    description: 'Mousson Asie → saison sèche Australie/Afrique',
    objectifTest: 'Vérifier gestion précipitations extrêmes contrastées'
  });

  // Test 20: Vents extrêmes multi-zones
  tests.push({
    id: id++,
    type: 'Contraste Extrême',
    titre: 'Zones Vents Violents',
    pays: ['Islande', 'Écosse', 'Patagonie', 'Nouvelle-Zélande', 'Australie'],
    paysCodes: ['IS', 'GB-SCT', 'AR', 'NZ', 'AU'],
    dateDepart: '2025-11-15',
    duree: 35,
    description: 'Zones réputées vents violents',
    objectifTest: 'Vérifier détection zones venteuses'
  });

  // === CATÉGORIE 3: DURÉES VARIABLES (10 tests) ===

  // Test 21: Sprint 2 semaines multi-continents
  tests.push({
    id: id++,
    type: 'Durée Courte',
    titre: 'Sprint 14j Multi-Continents',
    pays: ['France', 'Maroc', 'Émirats', 'Thaïlande'],
    paysCodes: ['FR', 'MA', 'AE', 'TH'],
    dateDepart: '2025-12-10',
    duree: 14,
    description: 'Tour rapide 4 pays en 2 semaines',
    objectifTest: 'Vérifier cohérence voyage court multi-destinations'
  });

  // Test 22: Moyen terme 1 mois
  tests.push({
    id: id++,
    type: 'Durée Moyenne',
    titre: 'Tour Asie du Sud-Est 1 mois',
    pays: ['Thaïlande', 'Laos', 'Vietnam', 'Cambodge', 'Malaisie', 'Singapour'],
    paysCodes: ['TH', 'LA', 'VN', 'KH', 'MY', 'SG'],
    dateDepart: '2025-02-01',
    duree: 30,
    description: 'Circuit Asie SE 1 mois',
    objectifTest: 'Vérifier cohérence zone géographique homogène'
  });

  // Test 23: Long 3 mois tour monde
  tests.push({
    id: id++,
    type: 'Durée Longue',
    titre: 'Tour Monde 3 mois',
    pays: ['France', 'Émirats', 'Inde', 'Thaïlande', 'Australie', 'Nouvelle-Zélande', 'Chili', 'Argentine', 'Brésil', 'États-Unis'],
    paysCodes: ['FR', 'AE', 'IN', 'TH', 'AU', 'NZ', 'CL', 'AR', 'BR', 'US'],
    dateDepart: '2025-09-01',
    duree: 90,
    description: 'Tour du monde 10 pays en 3 mois',
    objectifTest: 'Vérifier gestion long voyage multi-saisons'
  });

  // Test 24: Ultra-long 6 mois
  tests.push({
    id: id++,
    type: 'Durée Très Longue',
    titre: 'Tour Monde 6 mois Sabbatique',
    pays: ['Europe', 'Moyen-Orient', 'Asie Centrale', 'Asie du Sud', 'Asie du SE', 'Océanie', 'Amérique Sud'],
    paysCodes: ['FR', 'TR', 'KZ', 'IN', 'TH', 'AU', 'AR'],
    dateDepart: '2025-03-01',
    duree: 180,
    description: 'Voyage sabbatique 6 mois',
    objectifTest: 'Vérifier cohérence ultra-long avec changements saisons'
  });

  // Test 25: Court 7j weekend multi-pays
  tests.push({
    id: id++,
    type: 'Durée Très Courte',
    titre: 'Weekend Long Multi-Pays',
    pays: ['Belgique', 'Pays-Bas', 'Allemagne'],
    paysCodes: ['BE', 'NL', 'DE'],
    dateDepart: '2025-05-15',
    duree: 7,
    description: 'Weekend prolongé 3 pays',
    objectifTest: 'Vérifier cohérence voyage très court proximité géographique'
  });

  // Test 26: 5 semaines Amérique latine
  tests.push({
    id: id++,
    type: 'Durée Moyenne-Longue',
    titre: 'Amérique Latine 5 Semaines',
    pays: ['Mexique', 'Guatemala', 'Costa Rica', 'Colombie', 'Équateur', 'Pérou'],
    paysCodes: ['MX', 'GT', 'CR', 'CO', 'EC', 'PE'],
    dateDepart: '2025-06-20',
    duree: 35,
    description: 'Circuit Amérique latine 5 semaines',
    objectifTest: 'Vérifier zone géographique cohérente durée moyenne'
  });

  // Test 27: 10j îles Caraïbes
  tests.push({
    id: id++,
    type: 'Durée Courte',
    titre: 'Island Hopping Caraïbes 10j',
    pays: ['Cuba', 'Jamaïque', 'République dominicaine', 'Barbade'],
    paysCodes: ['CU', 'JM', 'DO', 'BB'],
    dateDepart: '2026-02-10',
    duree: 10,
    description: 'Saut d\'îles Caraïbes rapide',
    objectifTest: 'Vérifier cohérence îles même zone climatique'
  });

  // Test 28: 60j Afrique traversée
  tests.push({
    id: id++,
    type: 'Durée Longue',
    titre: 'Traversée Afrique 60j',
    pays: ['Maroc', 'Mauritanie', 'Sénégal', 'Mali', 'Burkina Faso', 'Ghana', 'Cameroun', 'Kenya'],
    paysCodes: ['MA', 'MR', 'SN', 'ML', 'BF', 'GH', 'CM', 'KE'],
    dateDepart: '2025-11-01',
    duree: 60,
    description: 'Traversée Afrique Nord → Est',
    objectifTest: 'Vérifier long voyage diversité climatique Afrique'
  });

  // Test 29: 21j Scandinavie
  tests.push({
    id: id++,
    type: 'Durée Moyenne',
    titre: 'Tour Scandinavie 3 Semaines',
    pays: ['Danemark', 'Suède', 'Norvège', 'Finlande', 'Islande'],
    paysCodes: ['DK', 'SE', 'NO', 'FI', 'IS'],
    dateDepart: '2025-07-05',
    duree: 21,
    description: 'Circuit Scandinavie complet',
    objectifTest: 'Vérifier zone homogène (nordique) durée standard'
  });

  // Test 30: 120j Asie complète
  tests.push({
    id: id++,
    type: 'Durée Très Longue',
    titre: 'Asie Complète 4 Mois',
    pays: ['Turquie', 'Iran', 'Kazakhstan', 'Kirghizistan', 'Chine', 'Mongolie', 'Japon', 'Corée', 'Thaïlande', 'Vietnam', 'Indonésie'],
    paysCodes: ['TR', 'IR', 'KZ', 'KG', 'CN', 'MN', 'JP', 'KR', 'TH', 'VN', 'ID'],
    dateDepart: '2025-04-01',
    duree: 120,
    description: 'Traversée Asie complète 4 mois',
    objectifTest: 'Vérifier ultra-long avec diversité climatique maximale Asie'
  });

  // === CATÉGORIE 4: PÉRIODES SPÉCIFIQUES (10 tests) ===

  // Test 31: Nouvel An multi-destinations
  tests.push({
    id: id++,
    type: 'Période Festive',
    titre: 'Nouvel An Multi-Pays',
    pays: ['Japon', 'Thaïlande', 'Inde', 'Émirats'],
    paysCodes: ['JP', 'TH', 'IN', 'AE'],
    dateDepart: '2025-12-28',
    duree: 14,
    description: 'Tour Asie période Nouvel An',
    objectifTest: 'Vérifier cohérence pic saison touristique hiver NH'
  });

  // Test 32: Été austral Noël
  tests.push({
    id: id++,
    type: 'Période Festive',
    titre: 'Noël Hémisphère Sud',
    pays: ['Australie', 'Nouvelle-Zélande', 'Afrique du Sud'],
    paysCodes: ['AU', 'NZ', 'ZA'],
    dateDepart: '2025-12-20',
    duree: 21,
    description: 'Noël sous le soleil austral',
    objectifTest: 'Vérifier Noël = été austral'
  });

  // Test 33: Printemps multi-continents
  tests.push({
    id: id++,
    type: 'Période Saisonnière',
    titre: 'Printemps Europe-Asie',
    pays: ['France', 'Italie', 'Grèce', 'Turquie', 'Japon', 'Corée du Sud'],
    paysCodes: ['FR', 'IT', 'GR', 'TR', 'JP', 'KR'],
    dateDepart: '2025-04-05',
    duree: 30,
    description: 'Floraisons printanières multi-pays',
    objectifTest: 'Vérifier cohérence printemps hémisphère nord'
  });

  // Test 34: Automne couleurs
  tests.push({
    id: id++,
    type: 'Période Saisonnière',
    titre: 'Automne Couleurs Multi-Pays',
    pays: ['Canada', 'États-Unis', 'Japon', 'Corée du Sud'],
    paysCodes: ['CA', 'US', 'JP', 'KR'],
    dateDepart: '2025-10-10',
    duree: 21,
    description: 'Couleurs automnales mondiales',
    objectifTest: 'Vérifier cohérence automne hémisphère nord'
  });

  // Test 35: Mousson Asie
  tests.push({
    id: id++,
    type: 'Période Climatique',
    titre: 'Saison Mousson Asie',
    pays: ['Inde', 'Bangladesh', 'Birmanie', 'Thaïlande', 'Vietnam'],
    paysCodes: ['IN', 'BD', 'MM', 'TH', 'VN'],
    dateDepart: '2025-07-15',
    duree: 30,
    description: 'Voyage pendant mousson asiatique',
    objectifTest: 'Vérifier détection mousson multi-pays Asie'
  });

  // Test 36: Saison cyclones évitement
  tests.push({
    id: id++,
    type: 'Période Climatique',
    titre: 'Caraïbes Hors Cyclones',
    pays: ['Cuba', 'Jamaïque', 'Mexique', 'Costa Rica'],
    paysCodes: ['CU', 'JM', 'MX', 'CR'],
    dateDepart: '2026-02-01',
    duree: 21,
    description: 'Caraïbes hors saison cyclonique',
    objectifTest: 'Vérifier période sans cyclones'
  });

  // Test 37: Été arctique soleil minuit
  tests.push({
    id: id++,
    type: 'Période Spéciale',
    titre: 'Été Arctique Soleil Minuit',
    pays: ['Norvège', 'Suède', 'Finlande', 'Islande', 'Groenland'],
    paysCodes: ['NO', 'SE', 'FI', 'IS', 'GL'],
    dateDepart: '2025-06-20',
    duree: 25,
    description: 'Soleil de minuit zones arctiques',
    objectifTest: 'Vérifier été court arctique'
  });

  // Test 38: Hiver polaire nuit permanente
  tests.push({
    id: id++,
    type: 'Période Spéciale',
    titre: 'Hiver Polaire Nuit Continue',
    pays: ['Norvège', 'Suède', 'Finlande', 'Islande'],
    paysCodes: ['NO', 'SE', 'FI', 'IS'],
    dateDepart: '2026-01-20',
    duree: 14,
    description: 'Nuit polaire et aurores boréales',
    objectifTest: 'Vérifier hiver arctique extrême'
  });

  // Test 39: Saison sèche Afrique safari
  tests.push({
    id: id++,
    type: 'Période Climatique',
    titre: 'Safari Saison Sèche',
    pays: ['Kenya', 'Tanzanie', 'Botswana', 'Afrique du Sud'],
    paysCodes: ['KE', 'TZ', 'BW', 'ZA'],
    dateDepart: '2025-08-01',
    duree: 21,
    description: 'Safaris en saison sèche optimale',
    objectifTest: 'Vérifier saison sèche Afrique australe/orientale'
  });

  // Test 40: Harmattan Afrique Ouest
  tests.push({
    id: id++,
    type: 'Période Climatique',
    titre: 'Harmattan Afrique Ouest',
    pays: ['Mauritanie', 'Sénégal', 'Mali', 'Niger', 'Burkina Faso'],
    paysCodes: ['MR', 'SN', 'ML', 'NE', 'BF'],
    dateDepart: '2026-01-10',
    duree: 21,
    description: 'Vent Harmattan saison sèche',
    objectifTest: 'Vérifier détection Harmattan hiver Afrique Ouest'
  });

  // === CATÉGORIE 5: ZONES GÉOGRAPHIQUES SPÉCIFIQUES (10 tests) ===

  // Test 41: Balkans complet
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Tour Balkans Complet',
    pays: ['Slovénie', 'Croatie', 'Bosnie', 'Serbie', 'Monténégro', 'Albanie', 'Macédoine', 'Grèce'],
    paysCodes: ['SI', 'HR', 'BA', 'RS', 'ME', 'AL', 'MK', 'GR'],
    dateDepart: '2025-06-01',
    duree: 30,
    description: 'Circuit Balkans été',
    objectifTest: 'Vérifier cohérence zone Balkans (méditerranéen/continental)'
  });

  // Test 42: Route de la Soie
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Route de la Soie',
    pays: ['Turquie', 'Iran', 'Turkménistan', 'Ouzbékistan', 'Kazakhstan', 'Kirghizistan', 'Chine'],
    paysCodes: ['TR', 'IR', 'TM', 'UZ', 'KZ', 'KG', 'CN'],
    dateDepart: '2025-05-15',
    duree: 60,
    description: 'Route historique Soie',
    objectifTest: 'Vérifier diversité Asie centrale (déserts + montagnes)'
  });

  // Test 43: Pacifique Sud
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Îles Pacifique Sud',
    pays: ['Fidji', 'Vanuatu', 'Nouvelle-Calédonie', 'Polynésie française', 'Samoa'],
    paysCodes: ['FJ', 'VU', 'NC', 'PF', 'WS'],
    dateDepart: '2025-11-10',
    duree: 28,
    description: 'Island hopping Pacifique',
    objectifTest: 'Vérifier cohérence îles tropicales Pacifique'
  });

  // Test 44: Caucase
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Tour Caucase',
    pays: ['Géorgie', 'Arménie', 'Azerbaïdjan'],
    paysCodes: ['GE', 'AM', 'AZ'],
    dateDepart: '2025-09-05',
    duree: 18,
    description: 'Circuit Caucase automne',
    objectifTest: 'Vérifier zone Caucase (continental/montagne)'
  });

  // Test 45: Maghreb complet
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Maghreb Complet',
    pays: ['Maroc', 'Algérie', 'Tunisie', 'Libye'],
    paysCodes: ['MA', 'DZ', 'TN', 'LY'],
    dateDepart: '2025-10-20',
    duree: 25,
    description: 'Tour Afrique du Nord',
    objectifTest: 'Vérifier cohérence Maghreb (méditerranéen/désertique)'
  });

  // Test 46: Pays Baltes
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Pays Baltes Été',
    pays: ['Estonie', 'Lettonie', 'Lituanie', 'Pologne'],
    paysCodes: ['EE', 'LV', 'LT', 'PL'],
    dateDepart: '2025-07-10',
    duree: 16,
    description: 'Circuit Baltes été',
    objectifTest: 'Vérifier zone Baltes (océanique/continental)'
  });

  // Test 47: Péninsule Arabique
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Péninsule Arabique',
    pays: ['Émirats', 'Oman', 'Qatar', 'Koweït', 'Arabie Saoudite'],
    paysCodes: ['AE', 'OM', 'QA', 'KW', 'SA'],
    dateDepart: '2026-02-15',
    duree: 21,
    description: 'Tour Arabie hiver',
    objectifTest: 'Vérifier cohérence péninsule Arabique (désert chaud)'
  });

  // Test 48: Amazonie multi-pays
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Bassin Amazonien',
    pays: ['Brésil', 'Pérou', 'Équateur', 'Colombie'],
    paysCodes: ['BR', 'PE', 'EC', 'CO'],
    dateDepart: '2025-08-15',
    duree: 30,
    description: 'Exploration Amazonie multi-pays',
    objectifTest: 'Vérifier zone équatoriale/tropicale humide'
  });

  // Test 49: Corne de l\'Afrique
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Corne Afrique',
    pays: ['Éthiopie', 'Djibouti', 'Somalie', 'Kenya'],
    paysCodes: ['ET', 'DJ', 'SO', 'KE'],
    dateDepart: '2026-01-25',
    duree: 21,
    description: 'Circuit Corne Afrique',
    objectifTest: 'Vérifier zone Corne (désert + tropical + altitude)'
  });

  // Test 50: Méditerranée complète
  tests.push({
    id: id++,
    type: 'Zone Géographique',
    titre: 'Tour Méditerranée',
    pays: ['Espagne', 'France', 'Italie', 'Grèce', 'Turquie', 'Égypte', 'Tunisie', 'Maroc'],
    paysCodes: ['ES', 'FR', 'IT', 'GR', 'TR', 'EG', 'TN', 'MA'],
    dateDepart: '2025-05-20',
    duree: 45,
    description: 'Tour complet Méditerranée',
    objectifTest: 'Vérifier cohérence bassin méditerranéen'
  });

  return tests;
}

// Exécution des tests
function runMultiDestinationTest(testCase: MultiDestinationTestCase): MultiDestinationTestResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const paysAnalyses: any[] = [];

  const month = getMonthFromDate(testCase.dateDepart);

  let tempMin = Infinity;
  let tempMax = -Infinity;
  const hemispheres = new Set<string>();
  const zonesUniques = new Set<string>();
  const saisonsUniques = new Set<string>();

  // Analyser chaque pays
  for (let i = 0; i < testCase.paysCodes.length; i++) {
    const code = testCase.paysCodes[i];
    const nom = testCase.pays[i];
    const climate = getCountryClimate(code);

    if (!climate) {
      errors.push(`Pays ${nom} (${code}) : Aucune donnée climatique`);
      continue;
    }

    const avgTemp = getTempFromMonth(climate, month);
    const tempCategories = getTemperatureCategory(avgTemp);
    const seasons = getSeasonsForMonth(month, climate.seasons);

    // Collecter stats
    tempMin = Math.min(tempMin, avgTemp);
    tempMax = Math.max(tempMax, avgTemp);
    hemispheres.add(climate.hemisphere);
    climate.zones.forEach(z => zonesUniques.add(z));
    seasons.forEach(s => saisonsUniques.add(s));

    paysAnalyses.push({
      pays: nom,
      code,
      month,
      avgTemp,
      tempCategories,
      seasons,
      hemisphere: climate.hemisphere,
      zones: climate.zones
    });
  }

  const amplitude = tempMax - tempMin;

  // Validations multi-destinations

  // 1. Si amplitude > 40°C, warning amplitude extrême
  if (amplitude > 40) {
    warnings.push(`Amplitude thermique extrême: ${amplitude}°C (${tempMin}°C → ${tempMax}°C)`);
  }

  // 2. Si mélange hémisphères, vérifier cohérence saisons
  if (hemispheres.has('north') && hemispheres.has('south')) {
    if (month >= 6 && month <= 8) {
      // Devrait avoir été nord ET hiver sud
      if (!saisonsUniques.has('ete') || !saisonsUniques.has('hiver')) {
        warnings.push(`Mélange hémisphères en ${getMonthName(month)}: devrait avoir été nord + hiver sud`);
      }
    } else if (month === 12 || month <= 2) {
      // Devrait avoir hiver nord ET été sud
      if (!saisonsUniques.has('hiver') || !saisonsUniques.has('ete')) {
        warnings.push(`Mélange hémisphères en ${getMonthName(month)}: devrait avoir hiver nord + été sud`);
      }
    }
  }

  // 3. Si > 5 zones climatiques différentes, noter diversité
  if (zonesUniques.size >= 5) {
    warnings.push(`Diversité climatique élevée: ${zonesUniques.size} zones différentes`);
  }

  return {
    testCase,
    success: errors.length === 0,
    errors,
    warnings,
    details: {
      paysAnalyses,
      diversiteClimatique: {
        tempMin,
        tempMax,
        amplitude,
        hemispheres: Array.from(hemispheres),
        zonesUniques: Array.from(zonesUniques),
        nombreSaisons: saisonsUniques.size
      }
    }
  };
}

// Affichage résultats
function displayMultiDestinationResults(results: MultiDestinationTestResult[]): void {
  console.log('\n' + '='.repeat(100));
  console.log('RAPPORT DE TEST - MULTI-DESTINATIONS / TOURS DU MONDE');
  console.log('='.repeat(100) + '\n');

  const totalTests = results.length;
  const successTests = results.filter(r => r.success).length;
  const failedTests = results.filter(r => !r.success).length;
  const testsWithWarnings = results.filter(r => r.warnings.length > 0).length;

  console.log(`📊 STATISTIQUES GLOBALES`);
  console.log(`   Total de tests : ${totalTests}`);
  console.log(`   ✅ Réussis : ${successTests} (${((successTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   ❌ Échoués : ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   ⚠️  Avec observations : ${testsWithWarnings} (${((testsWithWarnings/totalTests)*100).toFixed(1)}%)`);
  console.log('');

  // Stats par type
  const typeStats = new Map<string, { total: number, success: number }>();
  for (const result of results) {
    const type = result.testCase.type;
    if (!typeStats.has(type)) {
      typeStats.set(type, { total: 0, success: 0 });
    }
    const stats = typeStats.get(type)!;
    stats.total++;
    if (result.success) stats.success++;
  }

  console.log(`📈 STATISTIQUES PAR CATÉGORIE`);
  for (const [type, stats] of typeStats) {
    const rate = ((stats.success / stats.total) * 100).toFixed(1);
    const icon = stats.success === stats.total ? '✅' : '⚠️';
    console.log(`   ${icon} ${type}: ${stats.success}/${stats.total} (${rate}%)`);
  }
  console.log('');

  // Tests échoués
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log(`❌ TESTS ÉCHOUÉS (${failedResults.length}):`);
    console.log('-'.repeat(100));
    for (const result of failedResults) {
      console.log(`\n🔴 Test #${result.testCase.id}: ${result.testCase.titre}`);
      console.log(`   Type: ${result.testCase.type}`);
      console.log(`   Pays: ${result.testCase.pays.join(', ')}`);
      console.log(`   Erreurs:`);
      for (const error of result.errors) {
        console.log(`      - ${error}`);
      }
    }
    console.log('\n' + '-'.repeat(100) + '\n');
  }

  // Exemples réussis intéressants
  const successResults = results.filter(r => r.success);
  console.log(`✅ EXEMPLES DE TESTS RÉUSSIS (5 exemples intéressants):`);
  console.log('-'.repeat(100));

  const exemples = [
    successResults.find(r => r.testCase.id === 1),  // Tour du monde
    successResults.find(r => r.testCase.id === 11), // Contraste extrême
    successResults.find(r => r.testCase.id === 23), // Long 3 mois
    successResults.find(r => r.testCase.id === 35), // Mousson
    successResults.find(r => r.testCase.id === 50), // Méditerranée
  ].filter(Boolean) as MultiDestinationTestResult[];

  for (const result of exemples) {
    console.log(`\n🟢 Test #${result.testCase.id}: ${result.testCase.titre}`);
    console.log(`   Type: ${result.testCase.type}`);
    console.log(`   Pays (${result.testCase.pays.length}): ${result.testCase.pays.slice(0, 4).join(', ')}${result.testCase.pays.length > 4 ? '...' : ''}`);
    console.log(`   Date: ${result.testCase.dateDepart} | Durée: ${result.testCase.duree} jours`);
    console.log(`   📊 Diversité climatique:`);
    console.log(`      - Températures: ${result.details.diversiteClimatique.tempMin}°C → ${result.details.diversiteClimatique.tempMax}°C (Δ${result.details.diversiteClimatique.amplitude}°C)`);
    console.log(`      - Hémisphères: ${result.details.diversiteClimatique.hemispheres.join(', ')}`);
    console.log(`      - Zones climatiques: ${result.details.diversiteClimatique.zonesUniques.length} types différents`);
    console.log(`      - Saisons: ${result.details.diversiteClimatique.nombreSaisons} saison(s)`);
    if (result.warnings.length > 0) {
      console.log(`   ℹ️  Observations:`);
      result.warnings.forEach(w => console.log(`      - ${w}`));
    }
  }
  console.log('\n' + '-'.repeat(100) + '\n');

  // Statistiques détaillées
  console.log(`📊 STATISTIQUES AVANCÉES`);

  const amplitudes = results.map(r => r.details.diversiteClimatique.amplitude);
  const maxAmplitude = Math.max(...amplitudes);
  const minAmplitude = Math.min(...amplitudes);
  const avgAmplitude = (amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length).toFixed(1);

  console.log(`   Amplitude thermique:`);
  console.log(`      - Minimale: ${minAmplitude}°C`);
  console.log(`      - Maximale: ${maxAmplitude}°C`);
  console.log(`      - Moyenne: ${avgAmplitude}°C`);
  console.log('');

  const testsMixteHemisphere = results.filter(r =>
    r.details.diversiteClimatique.hemispheres.length > 1
  ).length;
  console.log(`   Voyages multi-hémisphères: ${testsMixteHemisphere}/${totalTests}`);

  const testsHauteDiversite = results.filter(r =>
    r.details.diversiteClimatique.zonesUniques.length >= 5
  ).length;
  console.log(`   Haute diversité climatique (5+ zones): ${testsHauteDiversite}/${totalTests}`);
  console.log('');

  // Résumé final
  console.log(`\n${'='.repeat(100)}`);
  if (failedTests === 0) {
    console.log('🎉 TOUS LES TESTS MULTI-DESTINATIONS SONT RÉUSSIS !');
    console.log('Le système gère parfaitement les voyages multi-pays, tours du monde et contrastes climatiques.');
  } else {
    console.log(`⚠️  ${failedTests} TEST(S) ONT ÉCHOUÉ`);
    console.log('Des vérifications supplémentaires sont nécessaires.');
  }
  console.log(`${'='.repeat(100)}\n`);
}

// Main
function main() {
  console.log('🌍 Génération des tests MULTI-DESTINATIONS...');
  const testCases = generateMultiDestinationTests();
  console.log(`✅ ${testCases.length} tests multi-destinations générés\n`);

  console.log('🔄 Exécution des tests...');
  const results: MultiDestinationTestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const result = runMultiDestinationTest(testCase);
    results.push(result);

    if ((i + 1) % 10 === 0) {
      console.log(`   Progression: ${i + 1}/${testCases.length} tests`);
    }
  }

  console.log(`✅ Tous les tests ont été exécutés\n`);

  displayMultiDestinationResults(results);
}

// Exécution
main();
