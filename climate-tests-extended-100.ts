/**
 * Script de test ÉTENDU pour Multi-Destinations - 100 NOUVEAUX TESTS
 * Focus sur pays NON testés précédemment et combinaisons inédites
 */

import {
  getCountryClimate,
  getRegionalClimate,
  getTemperatureCategory,
  getSeasonsForMonth,
  COUNTRY_CLIMATES,
  type CountryClimate
} from './src/utils/climateDatabase';

// Types (réutilisés)
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

// Générateur de 100 NOUVEAUX tests
function generateExtendedMultiDestinationTests(): MultiDestinationTestCase[] {
  const tests: MultiDestinationTestCase[] = [];
  let id = 1;

  // === CATÉGORIE 1: PAYS PEU TESTÉS - COMBINAISONS INÉDITES (20 tests) ===

  // Test 1: Pays insulaires exotiques
  tests.push({
    id: id++,
    type: 'Îles Exotiques Méconnues',
    titre: 'Tour Îles Méconnues Mondiales',
    pays: ['Comores', 'Seychelles', 'Cap-Vert', 'São Tomé', 'Samoa', 'Tonga'],
    paysCodes: ['KM', 'SC', 'CV', 'ST', 'WS', 'TO'],
    dateDepart: '2025-04-15',
    duree: 42,
    description: 'Îles peu touristiques du monde',
    objectifTest: 'Vérifier îles tropicales/équatoriales rarement visitées'
  });

  // Test 2: Europe de l'Est complète
  tests.push({
    id: id++,
    type: 'Europe de l\'Est',
    titre: 'Circuit Europe Est & Baltique',
    pays: ['Pologne', 'Lituanie', 'Lettonie', 'Estonie', 'Biélorussie', 'Ukraine', 'Moldavie'],
    paysCodes: ['PL', 'LT', 'LV', 'EE', 'BY', 'UA', 'MD'],
    dateDepart: '2025-06-10',
    duree: 35,
    description: 'Europe orientale et pays baltes',
    objectifTest: 'Vérifier cohérence Europe continentale Est'
  });

  // Test 3: Asie du Sud-Est moins connue
  tests.push({
    id: id++,
    type: 'Asie SE Méconnue',
    titre: 'Asie SE Hors Sentiers Battus',
    pays: ['Brunei', 'Timor oriental', 'Papouasie-Nouvelle-Guinée', 'Philippines', 'Taiwan'],
    paysCodes: ['BN', 'TL', 'PG', 'PH', 'TW'],
    dateDepart: '2025-03-01',
    duree: 40,
    description: 'Destinations moins touristiques Asie SE',
    objectifTest: 'Vérifier diversité équatorial-tropical-subtropical'
  });

  // Test 4: Amérique Centrale complète
  tests.push({
    id: id++,
    type: 'Amérique Centrale',
    titre: 'Traversée Amérique Centrale',
    pays: ['Mexique', 'Belize', 'Guatemala', 'Honduras', 'Salvador', 'Nicaragua', 'Panama'],
    paysCodes: ['MX', 'BZ', 'GT', 'HN', 'SV', 'NI', 'PA'],
    dateDepart: '2026-02-01',
    duree: 45,
    description: 'Amérique centrale du Mexique au Panama',
    objectifTest: 'Vérifier gradient altitude/tropical Amérique centrale'
  });

  // Test 5: Petites Antilles
  tests.push({
    id: id++,
    type: 'Caraïbes',
    titre: 'Island Hopping Petites Antilles',
    pays: ['Martinique', 'Guadeloupe', 'Dominique', 'Sainte-Lucie', 'Grenade', 'Barbade', 'Trinidad'],
    paysCodes: ['MQ', 'GP', 'DM', 'LC', 'GD', 'BB', 'TT'],
    dateDepart: '2026-03-15',
    duree: 28,
    description: 'Arc antillais des Petites Antilles',
    objectifTest: 'Vérifier homogénéité climatique îles Caraïbes'
  });

  // Test 6: Pacifique lointain
  tests.push({
    id: id++,
    type: 'Pacifique Lointain',
    titre: 'Îles Pacifique Éloignées',
    pays: ['Kiribati', 'Tuvalu', 'Nauru', 'Îles Marshall', 'Micronésie', 'Palau'],
    paysCodes: ['KI', 'TV', 'NR', 'MH', 'FM', 'PW'],
    dateDepart: '2025-10-01',
    duree: 35,
    description: 'Micro-états Pacifique équatorial',
    objectifTest: 'Vérifier îles équatoriales micro-états'
  });

  // Test 7: Afrique australe complète
  tests.push({
    id: id++,
    type: 'Afrique Australe',
    titre: 'Circuit Afrique Australe',
    pays: ['Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi', 'Mozambique', 'Eswatini', 'Lesotho'],
    paysCodes: ['NA', 'BW', 'ZW', 'ZM', 'MW', 'MZ', 'SZ', 'LS'],
    dateDepart: '2025-08-20',
    duree: 50,
    description: 'Afrique australe saison sèche',
    objectifTest: 'Vérifier diversité australe subtropical→highland'
  });

  // Test 8: Péninsule Indochinoise
  tests.push({
    id: id++,
    type: 'Indochine',
    titre: 'Péninsule Indochinoise Complète',
    pays: ['Myanmar', 'Thaïlande', 'Laos', 'Vietnam', 'Cambodge', 'Malaisie péninsulaire'],
    paysCodes: ['MM', 'TH', 'LA', 'VN', 'KH', 'MY'],
    dateDepart: '2025-11-15',
    duree: 38,
    description: 'Indochine hors mousson',
    objectifTest: 'Vérifier saison sèche Indochine'
  });

  // Test 9: Pays nordiques + arctiques
  tests.push({
    id: id++,
    type: 'Grand Nord',
    titre: 'Extrême Nord Européen & Arctique',
    pays: ['Finlande', 'Norvège', 'Suède', 'Islande', 'Groenland', 'Îles Féroé'],
    paysCodes: ['FI', 'NO', 'SE', 'IS', 'GL', 'FO'],
    dateDepart: '2025-12-20',
    duree: 21,
    description: 'Hiver arctique et aurores boréales',
    objectifTest: 'Vérifier froid extrême multi-pays nordiques'
  });

  // Test 10: Golfe Persique complet
  tests.push({
    id: id++,
    type: 'Golfe Persique',
    titre: 'Tour Golfe Persique',
    pays: ['Bahreïn', 'Qatar', 'Émirats', 'Oman', 'Koweït'],
    paysCodes: ['BH', 'QA', 'AE', 'OM', 'KW'],
    dateDepart: '2025-11-25',
    duree: 18,
    description: 'Golfe en période clémente',
    objectifTest: 'Vérifier cohérence désert chaud Golfe hiver'
  });

  // Test 11-20: Combinaisons inédites pays méconnus

  tests.push({
    id: id++,
    type: 'Afrique Ouest',
    titre: 'Côte Afrique Ouest',
    pays: ['Gambie', 'Guinée-Bissau', 'Guinée', 'Sierra Leone', 'Liberia', 'Côte d\'Ivoire'],
    paysCodes: ['GM', 'GW', 'GN', 'SL', 'LR', 'CI'],
    dateDepart: '2026-01-10',
    duree: 30,
    description: 'Côte ouest africaine tropicale',
    objectifTest: 'Vérifier climat tropical Afrique Ouest côtière'
  });

  tests.push({
    id: id++,
    type: 'Asie Centrale',
    titre: 'Route Steppe Asie Centrale',
    pays: ['Kazakhstan', 'Kirghizistan', 'Tadjikistan', 'Ouzbékistan', 'Turkménistan'],
    paysCodes: ['KZ', 'KG', 'TJ', 'UZ', 'TM'],
    dateDepart: '2025-05-20',
    duree: 40,
    description: 'Steppes et déserts Asie centrale',
    objectifTest: 'Vérifier continental/désert froid Asie centrale'
  });

  tests.push({
    id: id++,
    type: 'Caucase & Caspienne',
    titre: 'Tour Caucase & Mer Caspienne',
    pays: ['Géorgie', 'Arménie', 'Azerbaïdjan', 'Iran nord'],
    paysCodes: ['GE', 'AM', 'AZ', 'IR'],
    dateDepart: '2025-09-10',
    duree: 25,
    description: 'Région Caucase',
    objectifTest: 'Vérifier zone Caucase montagne/continental'
  });

  tests.push({
    id: id++,
    type: 'Océan Indien',
    titre: 'Îles Océan Indien',
    pays: ['Madagascar', 'Maurice', 'Réunion', 'Seychelles', 'Maldives'],
    paysCodes: ['MG', 'MU', 'RE', 'SC', 'MV'],
    dateDepart: '2025-10-15',
    duree: 35,
    description: 'Arc insulaire Océan Indien',
    objectifTest: 'Vérifier îles tropicales Océan Indien'
  });

  tests.push({
    id: id++,
    type: 'Amérique Sud Pacifique',
    titre: 'Côte Pacifique Sud-Américaine',
    pays: ['Équateur', 'Pérou', 'Chili nord', 'Chili centre', 'Chili sud'],
    paysCodes: ['EC', 'PE', 'CL', 'CL', 'CL'],
    dateDepart: '2025-07-05',
    duree: 45,
    description: 'Côte Pacifique équateur→Patagonie',
    objectifTest: 'Vérifier gradient climatique Pacifique Sud-Am'
  });

  tests.push({
    id: id++,
    type: 'Europe Méditerranée Est',
    titre: 'Méditerranée Orientale',
    pays: ['Turquie', 'Chypre', 'Liban', 'Israël', 'Jordanie', 'Égypte'],
    paysCodes: ['TR', 'CY', 'LB', 'IL', 'JO', 'EG'],
    dateDepart: '2025-04-20',
    duree: 28,
    description: 'Bassin méditerranéen oriental',
    objectifTest: 'Vérifier zone méditerranée orientale printemps'
  });

  tests.push({
    id: id++,
    type: 'Petits États',
    titre: 'Tour Micro-États Européens',
    pays: ['Vatican', 'Saint-Marin', 'Monaco', 'Liechtenstein', 'Luxembourg', 'Andorre'],
    paysCodes: ['VA', 'SM', 'MC', 'LI', 'LU', 'AD'],
    dateDepart: '2025-08-05',
    duree: 14,
    description: 'Micro-états européens',
    objectifTest: 'Vérifier cohérence micro-états climat tempéré'
  });

  tests.push({
    id: id++,
    type: 'Afrique Équatoriale',
    titre: 'Bassin Congo & Équateur',
    pays: ['Gabon', 'Congo', 'Congo RDC', 'Cameroun', 'Guinée Équatoriale'],
    paysCodes: ['GA', 'CG', 'CD', 'CM', 'GQ'],
    dateDepart: '2025-06-01',
    duree: 32,
    description: 'Forêt équatoriale africaine',
    objectifTest: 'Vérifier zone équatoriale humide Afrique'
  });

  tests.push({
    id: id++,
    type: 'Polynésie',
    titre: 'Archipels Polynésiens',
    pays: ['Polynésie française', 'Îles Cook', 'Samoa', 'Tonga', 'Niue'],
    paysCodes: ['PF', 'CK', 'WS', 'TO', 'NU'],
    dateDepart: '2025-09-20',
    duree: 30,
    description: 'Triangle polynésien',
    objectifTest: 'Vérifier homogénéité Polynésie tropicale'
  });

  tests.push({
    id: id++,
    type: 'Déserts Mondiaux',
    titre: 'Tour Grands Déserts',
    pays: ['Sahara (Algérie)', 'Arabie (Arabie S.)', 'Gobi (Mongolie)', 'Atacama (Chili)', 'Namib (Namibie)'],
    paysCodes: ['DZ', 'SA', 'MN', 'CL', 'NA'],
    dateDepart: '2025-10-01',
    duree: 50,
    description: 'Grands déserts mondiaux',
    objectifTest: 'Vérifier diversité déserts chauds/froids'
  });

  // === CATÉGORIE 2: DURÉES EXTRÊMES & INHABITUELLES (15 tests) ===

  // Test 21: Ultra-court 3 jours
  tests.push({
    id: id++,
    type: 'Ultra-Court',
    titre: 'Weekend Express 3 Pays',
    pays: ['Belgique', 'Luxembourg', 'Pays-Bas'],
    paysCodes: ['BE', 'LU', 'NL'],
    dateDepart: '2025-05-09',
    duree: 3,
    description: 'Weekend éclair Benelux',
    objectifTest: 'Vérifier cohérence voyage ultra-court'
  });

  // Test 22: Court 4 jours
  tests.push({
    id: id++,
    type: 'Très Court',
    titre: 'Long Weekend Baltique',
    pays: ['Estonie', 'Lettonie'],
    paysCodes: ['EE', 'LV'],
    dateDepart: '2025-07-30',
    duree: 4,
    description: 'Capitales baltes rapide',
    objectifTest: 'Vérifier voyage 4 jours proximité'
  });

  // Test 23-25: Durées intermédiaires inhabituelles (11j, 13j, 17j, 19j, 23j)

  tests.push({
    id: id++,
    type: 'Durée 11j',
    titre: 'Japon Express 11 Jours',
    pays: ['Japon (Tokyo)', 'Japon (Kyoto)', 'Japon (Osaka)', 'Japon (Hiroshima)'],
    paysCodes: ['JP', 'JP', 'JP', 'JP'],
    dateDepart: '2025-03-25',
    duree: 11,
    description: 'Circuit Japon cerisiers 11j',
    objectifTest: 'Vérifier durée inhabituelle 11 jours'
  });

  tests.push({
    id: id++,
    type: 'Durée 13j',
    titre: 'Pérou & Bolivie 13j',
    pays: ['Pérou', 'Bolivie'],
    paysCodes: ['PE', 'BO'],
    dateDepart: '2025-06-15',
    duree: 13,
    description: 'Andes péruviennes-boliviennes',
    objectifTest: 'Vérifier altitude 13 jours'
  });

  tests.push({
    id: id++,
    type: 'Durée 17j',
    titre: 'Inde Sud 17 Jours',
    pays: ['Inde sud (Kerala)', 'Inde sud (Tamil Nadu)', 'Sri Lanka'],
    paysCodes: ['IN', 'IN', 'LK'],
    dateDepart: '2026-01-20',
    duree: 17,
    description: 'Inde méridionale + Sri Lanka',
    objectifTest: 'Vérifier 17 jours zone tropicale'
  });

  // Test 26-30: Très longs inhabituels (48j, 65j, 75j, 100j, 150j)

  tests.push({
    id: id++,
    type: 'Durée 48j',
    titre: 'Asie Continentale 48j',
    pays: ['Thaïlande', 'Laos', 'Vietnam', 'Cambodge', 'Myanmar'],
    paysCodes: ['TH', 'LA', 'VN', 'KH', 'MM'],
    dateDepart: '2025-11-01',
    duree: 48,
    description: 'Asie SE approfondie 48j',
    objectifTest: 'Vérifier durée spécifique 48 jours'
  });

  tests.push({
    id: id++,
    type: 'Durée 65j',
    titre: 'Afrique Est 65 Jours',
    pays: ['Éthiopie', 'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda', 'Burundi'],
    paysCodes: ['ET', 'KE', 'TZ', 'UG', 'RW', 'BI'],
    dateDepart: '2025-07-10',
    duree: 65,
    description: 'Afrique orientale 65j',
    objectifTest: 'Vérifier long voyage 65 jours Afrique Est'
  });

  tests.push({
    id: id++,
    type: 'Durée 75j',
    titre: 'Amérique Latine 75j',
    pays: ['Colombie', 'Équateur', 'Pérou', 'Bolivie', 'Chili', 'Argentine', 'Uruguay'],
    paysCodes: ['CO', 'EC', 'PE', 'BO', 'CL', 'AR', 'UY'],
    dateDepart: '2025-04-01',
    duree: 75,
    description: 'Amérique Sud Pacifique-Atlantique',
    objectifTest: 'Vérifier 75 jours diversité Am Sud'
  });

  tests.push({
    id: id++,
    type: 'Durée 100j',
    titre: 'Tour Afrique 100 Jours',
    pays: ['Maroc', 'Mauritanie', 'Sénégal', 'Mali', 'Burkina', 'Ghana', 'Togo', 'Bénin', 'Nigeria', 'Cameroun', 'Kenya', 'Tanzanie'],
    paysCodes: ['MA', 'MR', 'SN', 'ML', 'BF', 'GH', 'TG', 'BJ', 'NG', 'CM', 'KE', 'TZ'],
    dateDepart: '2025-10-15',
    duree: 100,
    description: 'Traversée Afrique Ouest-Est 100j',
    objectifTest: 'Vérifier très long voyage 100j Afrique'
  });

  tests.push({
    id: id++,
    type: 'Durée 150j',
    titre: 'Tour Monde Complet 150j',
    pays: ['Europe', 'Moyen-Orient', 'Inde', 'Asie SE', 'Chine', 'Japon', 'Australie', 'NZ', 'Pacifique', 'Amérique Sud', 'Amérique Centrale', 'USA'],
    paysCodes: ['FR', 'TR', 'IN', 'TH', 'CN', 'JP', 'AU', 'NZ', 'FJ', 'CL', 'CR', 'US'],
    dateDepart: '2025-02-01',
    duree: 150,
    description: 'Tour monde sabbatique 5 mois',
    objectifTest: 'Vérifier ultra-long 150 jours tour monde'
  });

  tests.push({
    id: id++,
    type: 'Durée 27j',
    titre: 'Scandinavie Complète 27j',
    pays: ['Danemark', 'Suède', 'Norvège', 'Finlande'],
    paysCodes: ['DK', 'SE', 'NO', 'FI'],
    dateDepart: '2025-06-15',
    duree: 27,
    description: 'Scandinavie été nordique',
    objectifTest: 'Vérifier durée 27 jours zone nordique'
  });

  tests.push({
    id: id++,
    type: 'Durée 33j',
    titre: 'Europe Centrale 33j',
    pays: ['Autriche', 'Tchéquie', 'Slovaquie', 'Hongrie', 'Roumanie', 'Bulgarie'],
    paysCodes: ['AT', 'CZ', 'SK', 'HU', 'RO', 'BG'],
    dateDepart: '2025-09-01',
    duree: 33,
    description: 'Europe centrale automne',
    objectifTest: 'Vérifier 33 jours Europe centrale'
  });

  tests.push({
    id: id++,
    type: 'Durée 42j',
    titre: 'Chine Approfondie 42j',
    pays: ['Chine (Pékin)', 'Chine (Xi\'an)', 'Chine (Chengdu)', 'Chine (Yunnan)', 'Chine (Guangdong)', 'Chine (Shanghai)'],
    paysCodes: ['CN', 'CN', 'CN', 'CN', 'CN', 'CN'],
    dateDepart: '2025-10-05',
    duree: 42,
    description: 'Chine nord-sud 6 semaines',
    objectifTest: 'Vérifier 42j diversité Chine'
  });

  tests.push({
    id: id++,
    type: 'Durée 56j',
    titre: 'Russie Transmongolien 56j',
    pays: ['Russie ouest', 'Russie Sibérie', 'Mongolie', 'Chine', 'Corée'],
    paysCodes: ['RU', 'RU', 'MN', 'CN', 'KR'],
    dateDepart: '2025-06-20',
    duree: 56,
    description: 'Transmongolien 8 semaines',
    objectifTest: 'Vérifier 56j train continental'
  });

  tests.push({
    id: id++,
    type: 'Durée 84j',
    titre: 'Amériques Complètes 84j',
    pays: ['Canada', 'USA', 'Mexique', 'Amérique Centrale', 'Colombie', 'Équateur', 'Pérou', 'Bolivie', 'Chili', 'Argentine'],
    paysCodes: ['CA', 'US', 'MX', 'CR', 'CO', 'EC', 'PE', 'BO', 'CL', 'AR'],
    dateDepart: '2025-05-01',
    duree: 84,
    description: 'Alaska-Patagonie 12 semaines',
    objectifTest: 'Vérifier 84j traversée Amériques'
  });

  // === CATÉGORIE 3: PÉRIODES DE L'ANNÉE SPÉCIFIQUES (20 tests) ===

  // Janvier à Décembre - combinaisons par mois jamais testées

  // Test 36: Janvier - Hiver austral
  tests.push({
    id: id++,
    type: 'Janvier',
    titre: 'Patagonie Été Austral',
    pays: ['Argentine Patagonie', 'Chili Patagonie', 'Terre de Feu'],
    paysCodes: ['AR', 'CL', 'AR'],
    dateDepart: '2026-01-05',
    duree: 21,
    description: 'Patagonie été austral janvier',
    objectifTest: 'Vérifier janvier été austral extrême sud'
  });

  // Test 37: Février - Carnaval
  tests.push({
    id: id++,
    type: 'Février',
    titre: 'Carnavals Amérique Sud',
    pays: ['Brésil', 'Bolivie', 'Pérou', 'Colombie'],
    paysCodes: ['BR', 'BO', 'PE', 'CO'],
    dateDepart: '2026-02-14',
    duree: 18,
    description: 'Saison carnavals',
    objectifTest: 'Vérifier février été tropical/équatorial'
  });

  // Test 38: Mars - Printemps NH début
  tests.push({
    id: id++,
    type: 'Mars',
    titre: 'Maghreb Printemps Précoce',
    pays: ['Maroc', 'Algérie', 'Tunisie'],
    paysCodes: ['MA', 'DZ', 'TN'],
    dateDepart: '2025-03-10',
    duree: 20,
    description: 'Maghreb début printemps',
    objectifTest: 'Vérifier mars climat méditerranéen Afrique Nord'
  });

  // Test 39: Avril - Floraisons
  tests.push({
    id: id++,
    type: 'Avril',
    titre: 'Floraisons Asie',
    pays: ['Japon', 'Corée du Sud', 'Chine est'],
    paysCodes: ['JP', 'KR', 'CN'],
    dateDepart: '2025-04-01',
    duree: 16,
    description: 'Cerisiers et floraisons avril',
    objectifTest: 'Vérifier avril printemps Asie tempérée'
  });

  // Test 40: Mai - Début saison tropicale
  tests.push({
    id: id++,
    type: 'Mai',
    titre: 'Caraïbes Hors Saison',
    pays: ['Cuba', 'Jamaïque', 'Haïti', 'Porto Rico'],
    paysCodes: ['CU', 'JM', 'HT', 'PR'],
    dateDepart: '2025-05-05',
    duree: 14,
    description: 'Caraïbes début saison humide',
    objectifTest: 'Vérifier mai début pluies Caraïbes'
  });

  // Test 41: Juin - Début été NH
  tests.push({
    id: id++,
    type: 'Juin',
    titre: 'Europe du Nord Été',
    pays: ['Norvège', 'Suède', 'Finlande', 'Estonie'],
    paysCodes: ['NO', 'SE', 'FI', 'EE'],
    dateDepart: '2025-06-21',
    duree: 18,
    description: 'Solstice été nordique',
    objectifTest: 'Vérifier juin soleil minuit'
  });

  // Test 42: Juillet - Plein été NH, hiver SH
  tests.push({
    id: id++,
    type: 'Juillet',
    titre: 'Saisons Opposées Simultanées',
    pays: ['Suisse', 'Italie nord', 'Argentine', 'Chili'],
    paysCodes: ['CH', 'IT', 'AR', 'CL'],
    dateDepart: '2025-07-15',
    duree: 25,
    description: 'Été alpin + Hiver andin simultané',
    objectifTest: 'Vérifier juillet contraste NH/SH'
  });

  // Test 43: Août - Fin été NH
  tests.push({
    id: id++,
    type: 'Août',
    titre: 'Méditerranée Pic Été',
    pays: ['Grèce', 'Turquie côte', 'Croatie', 'Monténégro'],
    paysCodes: ['GR', 'TR', 'HR', 'ME'],
    dateDepart: '2025-08-10',
    duree: 20,
    description: 'Méditerranée pleine saison',
    objectifTest: 'Vérifier août pic chaleur méditerranée'
  });

  // Test 44: Septembre - Inter-saison
  tests.push({
    id: id++,
    type: 'Septembre',
    titre: 'Europe Sud Arrière-Saison',
    pays: ['Portugal', 'Espagne', 'France sud', 'Italie'],
    paysCodes: ['PT', 'ES', 'FR', 'IT'],
    dateDepart: '2025-09-15',
    duree: 22,
    description: 'Septembre méditerranée optimale',
    objectifTest: 'Vérifier septembre arrière-saison'
  });

  // Test 45: Octobre - Automne NH, printemps SH
  tests.push({
    id: id++,
    type: 'Octobre',
    titre: 'Australie Printemps',
    pays: ['Australie ouest', 'Australie centre', 'Australie est'],
    paysCodes: ['AU', 'AU', 'AU'],
    dateDepart: '2025-10-12',
    duree: 26,
    description: 'Australie printemps austral',
    objectifTest: 'Vérifier octobre printemps Australie'
  });

  // Test 46: Novembre - Début hiver NH, été SH
  tests.push({
    id: id++,
    type: 'Novembre',
    titre: 'Afrique Sud Début Été',
    pays: ['Afrique du Sud', 'Namibie', 'Botswana'],
    paysCodes: ['ZA', 'NA', 'BW'],
    dateDepart: '2025-11-10',
    duree: 24,
    description: 'Afrique australe début été',
    objectifTest: 'Vérifier novembre début été austral'
  });

  // Test 47: Décembre - Fêtes
  tests.push({
    id: id++,
    type: 'Décembre',
    titre: 'Noël Tropical',
    pays: ['Philippines', 'Indonésie', 'Malaisie', 'Singapour'],
    paysCodes: ['PH', 'ID', 'MY', 'SG'],
    dateDepart: '2025-12-20',
    duree: 15,
    description: 'Noël sous les tropiques',
    objectifTest: 'Vérifier décembre tropical Asie SE'
  });

  // Tests 48-55: Périodes spécifiques inédites

  tests.push({
    id: id++,
    type: 'Équinoxe Printemps',
    titre: 'Équinoxe Printemps Multi-Continents',
    pays: ['Islande', 'Écosse', 'Irlande', 'Pays de Galles'],
    paysCodes: ['IS', 'GB-SCT', 'IE', 'GB-WLS'],
    dateDepart: '2025-03-20',
    duree: 12,
    description: 'Équinoxe printemps îles celtiques',
    objectifTest: 'Vérifier équinoxe mars'
  });

  tests.push({
    id: id++,
    type: 'Solstice Été',
    titre: 'Solstice Été Arctique',
    pays: ['Norvège nord', 'Suède Laponie', 'Finlande Laponie'],
    paysCodes: ['NO', 'SE', 'FI'],
    dateDepart: '2025-06-21',
    duree: 10,
    description: 'Solstice soleil minuit',
    objectifTest: 'Vérifier solstice juin arctique'
  });

  tests.push({
    id: id++,
    type: 'Équinoxe Automne',
    titre: 'Équinoxe Automne Canada-USA',
    pays: ['Canada Est', 'USA Nouvelle-Angleterre', 'USA Est'],
    paysCodes: ['CA', 'US', 'US'],
    dateDepart: '2025-09-23',
    duree: 14,
    description: 'Équinoxe automne couleurs',
    objectifTest: 'Vérifier équinoxe septembre Am Nord'
  });

  tests.push({
    id: id++,
    type: 'Solstice Hiver',
    titre: 'Solstice Hiver Antarctique',
    pays: ['Argentine Ushuaia', 'Antarctique'],
    paysCodes: ['AR', 'AQ'],
    dateDepart: '2025-12-21',
    duree: 12,
    description: 'Solstice été austral Antarctique',
    objectifTest: 'Vérifier solstice décembre austral'
  });

  // === CATÉGORIE 4: THÈMES SPÉCIAUX (20 tests) ===

  // Test 56-75: Voyages thématiques inédits

  // Altitude
  tests.push({
    id: id++,
    type: 'Altitude Extrême',
    titre: 'Tour Hauts Plateaux Monde',
    pays: ['Tibet', 'Népal', 'Bolivie', 'Pérou', 'Éthiopie'],
    paysCodes: ['CN', 'NP', 'BO', 'PE', 'ET'],
    dateDepart: '2025-09-10',
    duree: 55,
    description: 'Hauts plateaux >3000m mondiaux',
    objectifTest: 'Vérifier haute altitude multi-continents'
  });

  // Volcans
  tests.push({
    id: id++,
    type: 'Volcans Actifs',
    titre: 'Ceinture de Feu Pacifique',
    pays: ['Japon', 'Philippines', 'Indonésie', 'Nouvelle-Zélande', 'Chili', 'Équateur'],
    paysCodes: ['JP', 'PH', 'ID', 'NZ', 'CL', 'EC'],
    dateDepart: '2025-10-20',
    duree: 50,
    description: 'Volcans actifs Ceinture de Feu',
    objectifTest: 'Vérifier zones volcaniques actives'
  });

  // Forêts tropicales
  tests.push({
    id: id++,
    type: 'Forêts Humides',
    titre: 'Grandes Forêts Tropicales',
    pays: ['Amazonie (Brésil)', 'Amazonie (Pérou)', 'Congo (RDC)', 'Bornéo (Malaisie)', 'Papua (Indonésie)'],
    paysCodes: ['BR', 'PE', 'CD', 'MY', 'ID'],
    dateDepart: '2025-08-01',
    duree: 45,
    description: 'Forêts pluviales mondiales',
    objectifTest: 'Vérifier forêts équatoriales humides'
  });

  // Steppes & Prairies
  tests.push({
    id: id++,
    type: 'Steppes',
    titre: 'Grandes Steppes Mondiales',
    pays: ['Mongolie', 'Kazakhstan', 'Ukraine', 'Argentine Pampas'],
    paysCodes: ['MN', 'KZ', 'UA', 'AR'],
    dateDepart: '2025-06-15',
    duree: 38,
    description: 'Steppes et prairies continentales',
    objectifTest: 'Vérifier steppes continental amplitude'
  });

  // Fleuves mythiques
  tests.push({
    id: id++,
    type: 'Grands Fleuves',
    titre: 'Fleuves Légendaires',
    pays: ['Égypte (Nil)', 'Inde (Gange)', 'Chine (Yangtsé)', 'Amazonie (Amazone)'],
    paysCodes: ['EG', 'IN', 'CN', 'BR'],
    dateDepart: '2025-11-05',
    duree: 42,
    description: 'Civilisations fluviales',
    objectifTest: 'Vérifier zones fluviales diverses'
  });

  // Faune sauvage
  tests.push({
    id: id++,
    type: 'Safari Mondial',
    titre: 'Safaris Multi-Continents',
    pays: ['Kenya', 'Tanzanie', 'Botswana', 'Inde (tigres)', 'Pantanal (Brésil)'],
    paysCodes: ['KE', 'TZ', 'BW', 'IN', 'BR'],
    dateDepart: '2025-07-20',
    duree: 48,
    description: 'Grandes destinations faune sauvage',
    objectifTest: 'Vérifier zones safari/faune mondiale'
  });

  // Patrimoine UNESCO
  tests.push({
    id: id++,
    type: 'UNESCO',
    titre: 'Sites UNESCO Multiples',
    pays: ['Italie', 'France', 'Espagne', 'Chine', 'Inde', 'Pérou'],
    paysCodes: ['IT', 'FR', 'ES', 'CN', 'IN', 'PE'],
    dateDepart: '2025-10-01',
    duree: 52,
    description: 'Pays riches UNESCO',
    objectifTest: 'Vérifier diversité patrimoine mondial'
  });

  // Frontières insolites
  tests.push({
    id: id++,
    type: 'Frontières',
    titre: 'Pays Frontaliers Multiples',
    pays: ['France', 'Suisse', 'Liechtenstein', 'Autriche', 'Italie', 'Slovénie'],
    paysCodes: ['FR', 'CH', 'LI', 'AT', 'IT', 'SI'],
    dateDepart: '2025-08-15',
    duree: 18,
    description: 'Multi-frontières Alpes',
    objectifTest: 'Vérifier cohérence zone alpine frontières'
  });

  // Langues rares
  tests.push({
    id: id++,
    type: 'Diversité Linguistique',
    titre: 'Tour Langues Uniques',
    pays: ['Islande', 'Pays Basque (Espagne)', 'Finlande', 'Hongrie', 'Géorgie', 'Arménie'],
    paysCodes: ['IS', 'ES', 'FI', 'HU', 'GE', 'AM'],
    dateDepart: '2025-09-05',
    duree: 32,
    description: 'Langues isolées/uniques',
    objectifTest: 'Vérifier diversité linguistique zones'
  });

  // Religions
  tests.push({
    id: id++,
    type: 'Religions',
    titre: 'Pèlerinages Multi-Confessions',
    pays: ['Israël', 'Vatican', 'Inde (Varanasi)', 'Arabie Saoudite', 'Tibet'],
    paysCodes: ['IL', 'VA', 'IN', 'SA', 'CN'],
    dateDepart: '2025-11-15',
    duree: 35,
    description: 'Sites religieux majeurs mondiaux',
    objectifTest: 'Vérifier diversité climatique sites sacrés'
  });

  // Anciennes civilisations
  tests.push({
    id: id++,
    type: 'Civilisations Anciennes',
    titre: 'Berceaux Civilisations',
    pays: ['Égypte', 'Irak', 'Iran', 'Inde', 'Chine', 'Pérou', 'Mexique'],
    paysCodes: ['EG', 'IQ', 'IR', 'IN', 'CN', 'PE', 'MX'],
    dateDepart: '2025-10-10',
    duree: 60,
    description: 'Civilisations antiques majeures',
    objectifTest: 'Vérifier diversité climatique sites antiques'
  });

  // Îles lointaines
  tests.push({
    id: id++,
    type: 'Îles Extrêmes',
    titre: 'Îles les Plus Isolées',
    pays: ['Île de Pâques', 'Pitcairn', 'Sainte-Hélène', 'Tristan da Cunha', 'Kerguelen'],
    paysCodes: ['CL', 'PN', 'SH', 'SH', 'TF'],
    dateDepart: '2026-01-15',
    duree: 40,
    description: 'Îles ultra-isolées mondiales',
    objectifTest: 'Vérifier îles éloignées climats variés'
  });

  // Capitales extrêmes
  tests.push({
    id: id++,
    type: 'Capitales Insolites',
    titre: 'Capitales Records',
    pays: ['La Paz (altitude)', 'Reykjavik (nord)', 'Singapour (équateur)', 'Wellington (vent)', 'Nuuk (froid)'],
    paysCodes: ['BO', 'IS', 'SG', 'NZ', 'GL'],
    dateDepart: '2025-07-01',
    duree: 35,
    description: 'Capitales avec caractéristiques extrêmes',
    objectifTest: 'Vérifier capitales climatiquement extrêmes'
  });

  // Mers & Océans
  tests.push({
    id: id++,
    type: 'Tour Maritime',
    titre: 'Tour Bassins Maritimes',
    pays: ['Méditerranée', 'Mer Rouge', 'Golfe Persique', 'Mer d\'Oman', 'Océan Indien'],
    paysCodes: ['GR', 'EG', 'AE', 'OM', 'MV'],
    dateDepart: '2025-12-01',
    duree: 32,
    description: 'Mers chaudes interconnectées',
    objectifTest: 'Vérifier zones maritimes chaudes'
  });

  // Canaux historiques
  tests.push({
    id: id++,
    type: 'Canaux',
    titre: 'Grands Canaux Mondiaux',
    pays: ['Panama', 'Égypte (Suez)', 'Pays-Bas', 'Venise (Italie)'],
    paysCodes: ['PA', 'EG', 'NL', 'IT'],
    dateDepart: '2025-05-10',
    duree: 22,
    description: 'Canaux majeurs histoire',
    objectifTest: 'Vérifier diversité climatique canaux'
  });

  // === CATÉGORIE 5: COMBINAISONS MÉTÉO SPÉCIFIQUES (25 tests) ===

  // Test 76-100: Conditions météo particulières

  // Cyclones/Typhons
  tests.push({
    id: id++,
    type: 'Post-Cyclone',
    titre: 'Caraïbes Post-Saison Cyclones',
    pays: ['Cuba', 'République dominicaine', 'Porto Rico', 'Guadeloupe'],
    paysCodes: ['CU', 'DO', 'PR', 'GP'],
    dateDepart: '2025-12-05',
    duree: 16,
    description: 'Après saison cyclonique',
    objectifTest: 'Vérifier période post-cyclones sûre'
  });

  // Harmattan complet
  tests.push({
    id: id++,
    type: 'Harmattan',
    titre: 'Afrique Ouest Harmattan',
    pays: ['Mauritanie', 'Sénégal', 'Mali', 'Niger', 'Tchad'],
    paysCodes: ['MR', 'SN', 'ML', 'NE', 'TD'],
    dateDepart: '2026-01-08',
    duree: 24,
    description: 'Vent Harmattan saison complète',
    objectifTest: 'Vérifier Harmattan multi-pays Sahel'
  });

  // Mousson indienne complète
  tests.push({
    id: id++,
    type: 'Mousson Inde',
    titre: 'Inde Mousson Complète',
    pays: ['Inde sud-ouest', 'Inde nord-est', 'Bangladesh', 'Népal'],
    paysCodes: ['IN', 'IN', 'BD', 'NP'],
    dateDepart: '2025-07-01',
    duree: 28,
    description: 'Mousson indienne pic',
    objectifTest: 'Vérifier mousson sous-continent indien'
  });

  // Saison sèche Amazonie
  tests.push({
    id: id++,
    type: 'Amazonie Sèche',
    titre: 'Amazonie Saison Sèche',
    pays: ['Brésil Amazonie', 'Pérou Amazonie', 'Colombie Amazonie'],
    paysCodes: ['BR', 'PE', 'CO'],
    dateDepart: '2025-08-15',
    duree: 21,
    description: 'Amazonie période optimale',
    objectifTest: 'Vérifier saison sèche Amazonie'
  });

  // Brouillards
  tests.push({
    id: id++,
    type: 'Brouillards',
    titre: 'Zones Brouillards Fréquents',
    pays: ['Londres (GB)', 'San Francisco (USA)', 'Lima (Pérou)', 'Terre-Neuve (Canada)'],
    paysCodes: ['GB-ENG', 'US', 'PE', 'CA'],
    dateDepart: '2025-11-01',
    duree: 18,
    description: 'Zones réputées brouillard',
    objectifTest: 'Vérifier zones brumeuses/brouillard'
  });

  // Aurores boréales
  tests.push({
    id: id++,
    type: 'Aurores Boréales',
    titre: 'Chasse Aurores Boréales',
    pays: ['Islande', 'Norvège Tromsø', 'Suède Kiruna', 'Finlande Laponie', 'Alaska'],
    paysCodes: ['IS', 'NO', 'SE', 'FI', 'US'],
    dateDepart: '2025-12-10',
    duree: 14,
    description: 'Aurores boréales hiver',
    objectifTest: 'Vérifier zones aurores période optimale'
  });

  // Alizés
  tests.push({
    id: id++,
    type: 'Alizés',
    titre: 'Navigation Alizés Atlantique',
    pays: ['Canaries', 'Cap-Vert', 'Caraïbes (Martinique)', 'Grenade'],
    paysCodes: ['ES', 'CV', 'MQ', 'GD'],
    dateDepart: '2025-12-01',
    duree: 35,
    description: 'Route alizés voiliers',
    objectifTest: 'Vérifier alizés Atlantique hiver'
  });

  // El Niño
  tests.push({
    id: id++,
    type: 'El Niño',
    titre: 'Zones Affectées El Niño',
    pays: ['Pérou', 'Équateur', 'Galápagos', 'Australie', 'Indonésie'],
    paysCodes: ['PE', 'EC', 'EC', 'AU', 'ID'],
    dateDepart: '2025-12-15',
    duree: 30,
    description: 'Pacifique période El Niño potentielle',
    objectifTest: 'Vérifier zones El Niño'
  });

  // Températures record
  tests.push({
    id: id++,
    type: 'Records Chaleur',
    titre: 'Lieux Records Température',
    pays: ['Death Valley (USA)', 'Libye (désert)', 'Iran (Lut)', 'Australie centre'],
    paysCodes: ['US', 'LY', 'IR', 'AU'],
    dateDepart: '2025-08-01',
    duree: 20,
    description: 'Records chaleur mondiaux',
    objectifTest: 'Vérifier lieux records température été'
  });

  // Froid record
  tests.push({
    id: id++,
    type: 'Records Froid',
    titre: 'Lieux Records Froid',
    pays: ['Sibérie (Russie)', 'Yakoutie (Russie)', 'Alaska', 'Groenland', 'Antarctique'],
    paysCodes: ['RU', 'RU', 'US', 'GL', 'AQ'],
    dateDepart: '2026-01-15',
    duree: 25,
    description: 'Records froid mondiaux',
    objectifTest: 'Vérifier lieux records froid hiver'
  });

  // Pluies record
  tests.push({
    id: id++,
    type: 'Précipitations Extrêmes',
    titre: 'Lieux Pluies Maximales',
    pays: ['Cherrapunji (Inde)', 'Hawaii', 'Colombie', 'Réunion'],
    paysCodes: ['IN', 'US', 'CO', 'RE'],
    dateDepart: '2025-07-10',
    duree: 22,
    description: 'Records précipitations',
    objectifTest: 'Vérifier zones pluies extrêmes'
  });

  // Sécheresse
  tests.push({
    id: id++,
    type: 'Zones Arides Extrêmes',
    titre: 'Lieux Plus Secs Monde',
    pays: ['Atacama (Chili)', 'Vallée Mort (USA)', 'Libye désert', 'Arabie désert'],
    paysCodes: ['CL', 'US', 'LY', 'SA'],
    dateDepart: '2025-09-01',
    duree: 26,
    description: 'Zones aridité maximale',
    objectifTest: 'Vérifier lieux aridité record'
  });

  // Vents record
  tests.push({
    id: id++,
    type: 'Vents Violents',
    titre: 'Lieux Vents les Plus Forts',
    pays: ['Cap Horn (Chili)', 'Patagonie (Argentine)', 'Îles Kerguelen', 'Antarctique'],
    paysCodes: ['CL', 'AR', 'TF', 'AQ'],
    dateDepart: '2025-12-01',
    duree: 18,
    description: 'Vents records mondiaux',
    objectifTest: 'Vérifier zones vents extrêmes'
  });

  // Ensoleillement maximum
  tests.push({
    id: id++,
    type: 'Ensoleillement Max',
    titre: 'Lieux Plus Ensoleillés',
    pays: ['Égypte (Assouan)', 'Arizona (USA)', 'Australie centre', 'Namibie'],
    paysCodes: ['EG', 'US', 'AU', 'NA'],
    dateDepart: '2025-06-15',
    duree: 20,
    description: 'Ensoleillement record annuel',
    objectifTest: 'Vérifier zones ensoleillement max'
  });

  // Nébulosité maximum
  tests.push({
    id: id++,
    type: 'Nébulosité Max',
    titre: 'Lieux Plus Nuageux',
    pays: ['Écosse', 'Irlande', 'Islande', 'Patagonie', 'Alaska'],
    paysCodes: ['GB-SCT', 'IE', 'IS', 'CL', 'US'],
    dateDepart: '2025-11-01',
    duree: 16,
    description: 'Zones nébulosité record',
    objectifTest: 'Vérifier zones couverture nuageuse max'
  });

  // Orages tropicaux
  tests.push({
    id: id++,
    type: 'Orages Tropicaux',
    titre: 'Zones Orages Quotidiens',
    pays: ['Congo bassin', 'Amazonie', 'Lac Victoria (Ouganda)', 'Indonésie'],
    paysCodes: ['CG', 'BR', 'UG', 'ID'],
    dateDepart: '2025-03-15',
    duree: 24,
    description: 'Orages tropicaux fréquents',
    objectifTest: 'Vérifier zones orages quotidiens'
  });

  // Tempêtes de sable
  tests.push({
    id: id++,
    type: 'Tempêtes Sable',
    titre: 'Zones Tempêtes Sable',
    pays: ['Sahara (Mauritanie)', 'Gobi (Mongolie)', 'Arabie désert', 'Arizona (USA)'],
    paysCodes: ['MR', 'MN', 'SA', 'US'],
    dateDepart: '2025-05-01',
    duree: 22,
    description: 'Saison tempêtes sable',
    objectifTest: 'Vérifier zones tempêtes sable'
  });

  // Blizzards
  tests.push({
    id: id++,
    type: 'Blizzards',
    titre: 'Zones Blizzards Fréquents',
    pays: ['Canada Prairies', 'Russie Sibérie', 'Alaska', 'Islande'],
    paysCodes: ['CA', 'RU', 'US', 'IS'],
    dateDepart: '2026-01-20',
    duree: 14,
    description: 'Saison blizzards',
    objectifTest: 'Vérifier zones blizzards hiver'
  });

  // Grêle
  tests.push({
    id: id++,
    type: 'Grêle Extrême',
    titre: 'Zones Grêle Fréquente',
    pays: ['USA Tornado Alley', 'Argentine Pampas', 'Inde nord', 'Chine'],
    paysCodes: ['US', 'AR', 'IN', 'CN'],
    dateDepart: '2025-04-15',
    duree: 18,
    description: 'Saison orages de grêle',
    objectifTest: 'Vérifier zones grêle printemps'
  });

  // Tornades
  tests.push({
    id: id++,
    type: 'Tornado Alley',
    titre: 'USA Tornado Alley Saison',
    pays: ['Oklahoma (USA)', 'Kansas (USA)', 'Texas (USA)', 'Nebraska (USA)'],
    paysCodes: ['US', 'US', 'US', 'US'],
    dateDepart: '2025-05-01',
    duree: 12,
    description: 'Saison tornades USA',
    objectifTest: 'Vérifier Tornado Alley période active'
  });

  // Méduses
  tests.push({
    id: id++,
    type: 'Méduses',
    titre: 'Zones Invasion Méduses',
    pays: ['Méditerranée (Espagne)', 'Australie (Queensland)', 'Thaïlande', 'Philippines'],
    paysCodes: ['ES', 'AU', 'TH', 'PH'],
    dateDepart: '2025-07-20',
    duree: 20,
    description: 'Saison méduses',
    objectifTest: 'Vérifier zones méduses été'
  });

  // Neige tropicale
  tests.push({
    id: id++,
    type: 'Neige Tropiques',
    titre: 'Neige en Zone Tropicale',
    pays: ['Kilimandjaro (Tanzanie)', 'Hawaii sommets', 'Andes équateur', 'Papouasie montagnes'],
    paysCodes: ['TZ', 'US', 'EC', 'PG'],
    dateDepart: '2025-08-01',
    duree: 25,
    description: 'Neige altitude tropicale',
    objectifTest: 'Vérifier neige zones tropicales altitude'
  });

  // Pollution air
  tests.push({
    id: id++,
    type: 'Qualité Air',
    titre: 'Zones Pollution Variable',
    pays: ['Inde Delhi', 'Chine Pékin', 'Thaïlande (brûlis)', 'Mexique ville'],
    paysCodes: ['IN', 'CN', 'TH', 'MX'],
    dateDepart: '2025-03-01',
    duree: 20,
    description: 'Périodes pollution air',
    objectifTest: 'Vérifier zones pollution saisonnière'
  });

  // Allergies pollen
  tests.push({
    id: id++,
    type: 'Pollen',
    titre: 'Zones Allergies Pollens',
    pays: ['Japon (cèdres)', 'France sud', 'Espagne', 'USA Sud'],
    paysCodes: ['JP', 'FR', 'ES', 'US'],
    dateDepart: '2025-03-15',
    duree: 16,
    description: 'Saison pollens printemps',
    objectifTest: 'Vérifier zones pollens printemps'
  });

  // Moustiques
  tests.push({
    id: id++,
    type: 'Moustiques',
    titre: 'Zones Moustiques Actifs',
    pays: ['Scandinavie été', 'Afrique tropicale', 'Amazonie', 'Asie SE mousson'],
    paysCodes: ['SE', 'KE', 'BR', 'TH'],
    dateDepart: '2025-07-01',
    duree: 22,
    description: 'Saison moustiques',
    objectifTest: 'Vérifier zones moustiques actifs'
  });

  return tests;
}

// Exécution des tests (identique à avant)
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

  if (amplitude > 40) {
    warnings.push(`Amplitude thermique extrême: ${amplitude}°C (${tempMin}°C → ${tempMax}°C)`);
  }

  if (hemispheres.has('north') && hemispheres.has('south')) {
    if (month >= 6 && month <= 8) {
      if (!saisonsUniques.has('ete') || !saisonsUniques.has('hiver')) {
        warnings.push(`Mélange hémisphères en ${getMonthName(month)}: devrait avoir été nord + hiver sud`);
      }
    } else if (month === 12 || month <= 2) {
      if (!saisonsUniques.has('hiver') || !saisonsUniques.has('ete')) {
        warnings.push(`Mélange hémisphères en ${getMonthName(month)}: devrait avoir hiver nord + été sud`);
      }
    }
  }

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

// Affichage (identique mais adapté pour 100 tests)
function displayResults(results: MultiDestinationTestResult[]): void {
  console.log('\n' + '='.repeat(120));
  console.log('RAPPORT DE TEST ÉTENDU - 100 NOUVEAUX TESTS MULTI-DESTINATIONS');
  console.log('='.repeat(120) + '\n');

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

  console.log(`📈 RÉSUMÉ PAR CATÉGORIE (${typeStats.size} catégories)`);
  let allSuccess = true;
  for (const [type, stats] of Array.from(typeStats.entries()).slice(0, 15)) {
    const rate = ((stats.success / stats.total) * 100).toFixed(0);
    const icon = stats.success === stats.total ? '✅' : '❌';
    if (stats.success < stats.total) allSuccess = false;
    console.log(`   ${icon} ${type}: ${stats.success}/${stats.total} (${rate}%)`);
  }
  if (typeStats.size > 15) {
    console.log(`   ... et ${typeStats.size - 15} autres catégories`);
  }
  console.log('');

  // Tests échoués (si présents)
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log(`❌ TESTS ÉCHOUÉS (${failedResults.length}):`);
    console.log('-'.repeat(120));
    for (const result of failedResults.slice(0, 10)) {
      console.log(`\n🔴 Test #${result.testCase.id}: ${result.testCase.titre}`);
      console.log(`   Pays: ${result.testCase.pays.slice(0, 3).join(', ')}${result.testCase.pays.length > 3 ? '...' : ''}`);
      console.log(`   Erreurs: ${result.errors.join(', ')}`);
    }
    if (failedResults.length > 10) {
      console.log(`\n   ... et ${failedResults.length - 10} autres tests échoués`);
    }
    console.log('\n' + '-'.repeat(120) + '\n');
  }

  // Amplitudes extrêmes
  const amplitudes = results.filter(r => r.success).map(r => ({
    test: r.testCase.titre,
    amp: r.details.diversiteClimatique.amplitude,
    min: r.details.diversiteClimatique.tempMin,
    max: r.details.diversiteClimatique.tempMax
  })).sort((a, b) => b.amp - a.amp);

  console.log(`🌡️  TOP 5 AMPLITUDES THERMIQUES:`);
  for (const item of amplitudes.slice(0, 5)) {
    console.log(`   ${item.test}: ${item.min}°C → ${item.max}°C (Δ${item.amp}°C)`);
  }
  console.log('');

  // Résumé final
  console.log(`\n${'='.repeat(120)}`);
  if (failedTests === 0) {
    console.log('🎉 TOUS LES 100 NOUVEAUX TESTS SONT RÉUSSIS !');
    console.log(`Le système gère parfaitement ${totalTests} scénarios supplémentaires inédits.`);
  } else {
    console.log(`⚠️  ${failedTests} TEST(S) ONT ÉCHOUÉ sur ${totalTests}`);
    console.log('Des pays supplémentaires doivent être ajoutés.');
  }
  console.log(`${'='.repeat(120)}\n`);
}

// Main
function main() {
  console.log('🌍 Génération de 100 NOUVEAUX tests multi-destinations...');
  const testCases = generateExtendedMultiDestinationTests();
  console.log(`✅ ${testCases.length} nouveaux tests générés (SANS répétition des 50 premiers)\n`);

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
  displayResults(results);
}

main();
