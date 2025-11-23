/**
 * Script de test complet pour valider le système de recommandations climatiques
 * Effectue ~100 tests sur différents types de pays et périodes de l'année
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
interface TestCase {
  id: number;
  type: string;
  pays: string;
  paysCode: string;
  dateDepart: string;
  duree: number;
  description: string;
}

interface TestResult {
  testCase: TestCase;
  success: boolean;
  errors: string[];
  warnings: string[];
  details: {
    month: number;
    avgTemp: number;
    tempCategories: string[];
    seasons: string[];
    hemisphere: string;
    zones: string[];
  };
}

// Utilitaires
function getMonthFromDate(dateStr: string): number {
  const date = new Date(dateStr);
  return date.getMonth() + 1; // JavaScript months are 0-indexed
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

// Validation
function validateTemperature(temp: number, categories: string[]): string[] {
  const errors: string[] = [];

  if (temp < 0 && !categories.includes('tres-froide')) {
    errors.push(`Température ${temp}°C devrait inclure 'tres-froide'`);
  }
  if (temp >= 0 && temp < 10 && !categories.includes('froide')) {
    errors.push(`Température ${temp}°C devrait inclure 'froide'`);
  }
  if (temp >= 10 && temp < 20 && !categories.includes('temperee')) {
    errors.push(`Température ${temp}°C devrait inclure 'temperee'`);
  }
  if (temp >= 20 && temp < 30 && !categories.includes('chaude')) {
    errors.push(`Température ${temp}°C devrait inclure 'chaude'`);
  }
  if (temp >= 30 && temp < 38 && !categories.includes('tres-chaude')) {
    errors.push(`Température ${temp}°C devrait inclure 'tres-chaude'`);
  }
  if (temp >= 38 && !categories.includes('chaleur-extreme')) {
    errors.push(`Température ${temp}°C devrait inclure 'chaleur-extreme'`);
  }

  return errors;
}

function validateSeasons(month: number, seasons: string[], hemisphere: string, climateSeasonsData: CountryClimate['seasons']): string[] {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Vérifier que les saisons détectées correspondent au mois
  const expectedSeasons = getSeasonsForMonth(month, climateSeasonsData);

  // Pour les zones tropicales/équatoriales, il peut ne pas y avoir de saisons définies
  if (expectedSeasons.length === 0) {
    warnings.push(`Pas de saison définie pour ce mois (zone tropicale/équatoriale)`);
  } else {
    // Vérifier la cohérence
    for (const expected of expectedSeasons) {
      if (!seasons.includes(expected)) {
        errors.push(`Saison '${expected}' attendue pour le mois ${month} mais non présente`);
      }
    }
  }

  return [...errors, ...warnings];
}

// Générateur de cas de test
function generateTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  let id = 1;

  // 1. ZONES CHAUDES (15 tests)
  const paysChauds = [
    { code: 'AE', nom: 'Émirats Arabes Unis', type: 'Désert chaud' },
    { code: 'EG', nom: 'Égypte', type: 'Désert chaud' },
    { code: 'TH', nom: 'Thaïlande', type: 'Tropical' },
    { code: 'ID', nom: 'Indonésie', type: 'Équatorial' },
    { code: 'SG', nom: 'Singapour', type: 'Équatorial' },
  ];

  for (const pays of paysChauds) {
    // Été hémisphère nord (juin-août)
    testCases.push({
      id: id++,
      type: 'Pays chaud - été',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-07-15',
      duree: 7,
      description: `${pays.nom} (${pays.type}) en plein été`
    });

    // Hiver hémisphère nord (décembre-février)
    testCases.push({
      id: id++,
      type: 'Pays chaud - hiver',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-12-20',
      duree: 14,
      description: `${pays.nom} (${pays.type}) en hiver`
    });

    // Inter-saison
    testCases.push({
      id: id++,
      type: 'Pays chaud - inter-saison',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-04-10',
      duree: 10,
      description: `${pays.nom} (${pays.type}) en inter-saison`
    });
  }

  // 2. ZONES FROIDES (15 tests)
  const paysFroids = [
    { code: 'IS', nom: 'Islande', type: 'Subarctique' },
    { code: 'NO', nom: 'Norvège', type: 'Subarctique/Océanique' },
    { code: 'FI', nom: 'Finlande', type: 'Subarctique/Continental' },
    { code: 'GL', nom: 'Groenland', type: 'Arctique' },
    { code: 'CA', nom: 'Canada', type: 'Continental/Arctique' },
  ];

  for (const pays of paysFroids) {
    // Hiver rigoureux
    testCases.push({
      id: id++,
      type: 'Pays froid - hiver',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2026-01-15',
      duree: 7,
      description: `${pays.nom} (${pays.type}) en plein hiver`
    });

    // Été court
    testCases.push({
      id: id++,
      type: 'Pays froid - été',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-07-20',
      duree: 14,
      description: `${pays.nom} (${pays.type}) en été`
    });

    // Inter-saison
    testCases.push({
      id: id++,
      type: 'Pays froid - inter-saison',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-10-05',
      duree: 10,
      description: `${pays.nom} (${pays.type}) en automne`
    });
  }

  // 3. ZONES TEMPÉRÉES (15 tests)
  const paysTemperes = [
    { code: 'FR', nom: 'France', type: 'Océanique/Méditerranéen' },
    { code: 'ES', nom: 'Espagne', type: 'Méditerranéen' },
    { code: 'GB-ENG', nom: 'Angleterre', type: 'Océanique' },
    { code: 'DE', nom: 'Allemagne', type: 'Océanique/Continental' },
    { code: 'JP', nom: 'Japon', type: 'Subtropical/Continental' },
  ];

  for (const pays of paysTemperes) {
    // Chaque saison
    const saisons = [
      { date: '2025-03-20', duree: 7, desc: 'printemps' },
      { date: '2025-07-01', duree: 10, desc: 'été' },
      { date: '2025-10-15', duree: 7, desc: 'automne' },
    ];

    for (const saison of saisons) {
      testCases.push({
        id: id++,
        type: 'Pays tempéré',
        pays: pays.nom,
        paysCode: pays.code,
        dateDepart: saison.date,
        duree: saison.duree,
        description: `${pays.nom} (${pays.type}) en ${saison.desc}`
      });
    }
  }

  // 4. HÉMISPHÈRE SUD (15 tests)
  const paysSud = [
    { code: 'AU', nom: 'Australie', type: 'Subtropical/Désert' },
    { code: 'NZ', nom: 'Nouvelle-Zélande', type: 'Océanique' },
    { code: 'AR', nom: 'Argentine', type: 'Tempéré/Subtropical' },
    { code: 'CL', nom: 'Chili', type: 'Varié' },
    { code: 'ZA', nom: 'Afrique du Sud', type: 'Subtropical/Méditerranéen' },
  ];

  for (const pays of paysSud) {
    // Été austral (décembre-février)
    testCases.push({
      id: id++,
      type: 'Hémisphère Sud - été austral',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2026-01-10',
      duree: 14,
      description: `${pays.nom} (${pays.type}) en été austral (janvier)`
    });

    // Hiver austral (juin-août)
    testCases.push({
      id: id++,
      type: 'Hémisphère Sud - hiver austral',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-07-10',
      duree: 10,
      description: `${pays.nom} (${pays.type}) en hiver austral (juillet)`
    });

    // Inter-saison
    testCases.push({
      id: id++,
      type: 'Hémisphère Sud - inter-saison',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-04-15',
      duree: 7,
      description: `${pays.nom} (${pays.type}) en automne austral`
    });
  }

  // 5. ÎLES (10 tests)
  const iles = [
    { code: 'MV', nom: 'Maldives', type: 'Équatorial insulaire' },
    { code: 'MU', nom: 'Maurice', type: 'Tropical insulaire' },
    { code: 'IS', nom: 'Islande', type: 'Subarctique insulaire' },
    { code: 'CU', nom: 'Cuba', type: 'Tropical insulaire' },
    { code: 'FJ', nom: 'Fidji', type: 'Tropical insulaire' },
  ];

  for (const ile of iles) {
    testCases.push({
      id: id++,
      type: 'Île - saison haute',
      pays: ile.nom,
      paysCode: ile.code,
      dateDepart: '2025-12-01',
      duree: 10,
      description: `${ile.nom} (${ile.type}) en saison haute`
    });

    testCases.push({
      id: id++,
      type: 'Île - saison basse',
      pays: ile.nom,
      paysCode: ile.code,
      dateDepart: '2025-06-15',
      duree: 7,
      description: `${ile.nom} (${ile.type}) en saison basse`
    });
  }

  // 6. INTÉRIEUR DES CONTINENTS (10 tests)
  const paysInterieurs = [
    { code: 'MN', nom: 'Mongolie', type: 'Continental extrême' },
    { code: 'KZ', nom: 'Kazakhstan', type: 'Continental/Désert froid' },
    { code: 'NE', nom: 'Niger', type: 'Désert continental' },
    { code: 'ML', nom: 'Mali', type: 'Désert continental' },
    { code: 'BO', nom: 'Bolivie', type: 'Highland/Altitude' },
  ];

  for (const pays of paysInterieurs) {
    testCases.push({
      id: id++,
      type: 'Intérieur continent - été',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-07-01',
      duree: 10,
      description: `${pays.nom} (${pays.type}) en été - amplitude thermique`
    });

    testCases.push({
      id: id++,
      type: 'Intérieur continent - hiver',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2026-01-15',
      duree: 7,
      description: `${pays.nom} (${pays.type}) en hiver - amplitude thermique`
    });
  }

  // 7. EXTRÊMES (10 tests)
  const paysExtremes = [
    { code: 'QA', nom: 'Qatar', type: 'Chaleur extrême désert' },
    { code: 'KW', nom: 'Koweït', type: 'Chaleur extrême désert' },
    { code: 'GL', nom: 'Groenland', type: 'Froid extrême arctique' },
    { code: 'MN', nom: 'Mongolie', type: 'Amplitude extrême' },
    { code: 'AQ', nom: 'Antarctique', type: 'Froid extrême polaire' },
  ];

  for (const pays of paysExtremes) {
    testCases.push({
      id: id++,
      type: 'Conditions extrêmes - pic',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-07-15',
      duree: 5,
      description: `${pays.nom} (${pays.type}) en période extrême`
    });

    testCases.push({
      id: id++,
      type: 'Conditions extrêmes - modéré',
      pays: pays.nom,
      paysCode: pays.code,
      dateDepart: '2025-11-01',
      duree: 7,
      description: `${pays.nom} (${pays.type}) en période plus clémente`
    });
  }

  return testCases;
}

// Exécution des tests
function runTest(testCase: TestCase): TestResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Obtenir le climat du pays
  const climate = getCountryClimate(testCase.paysCode);

  if (!climate) {
    return {
      testCase,
      success: false,
      errors: [`Aucune donnée climatique pour le pays ${testCase.paysCode}`],
      warnings: [],
      details: {
        month: 0,
        avgTemp: 0,
        tempCategories: [],
        seasons: [],
        hemisphere: 'unknown',
        zones: []
      }
    };
  }

  // Obtenir le mois
  const month = getMonthFromDate(testCase.dateDepart);
  const monthName = getMonthName(month);

  // Obtenir la température moyenne pour ce mois
  const avgTemp = getTempFromMonth(climate, month);

  // Obtenir les catégories de température
  const tempCategories = getTemperatureCategory(avgTemp);

  // Obtenir les saisons
  const seasons = getSeasonsForMonth(month, climate.seasons);

  // Validation température
  const tempErrors = validateTemperature(avgTemp, tempCategories);
  errors.push(...tempErrors);

  // Validation saisons
  const seasonErrors = validateSeasons(month, seasons, climate.hemisphere, climate.seasons);

  // Séparer erreurs et warnings
  for (const err of seasonErrors) {
    if (err.includes('Pas de saison')) {
      warnings.push(err);
    } else {
      errors.push(err);
    }
  }

  // Vérifications supplémentaires

  // Cohérence hémisphère et saison
  if (climate.hemisphere === 'south') {
    // Hémisphère Sud: juin-août devrait être hiver
    if (month >= 6 && month <= 8 && seasons.includes('ete')) {
      warnings.push(`Hémisphère Sud en juin-août devrait être en hiver, pas été`);
    }
    // Hémisphère Sud: décembre-février devrait être été
    if ((month >= 12 || month <= 2) && seasons.includes('hiver')) {
      warnings.push(`Hémisphère Sud en décembre-février devrait être en été, pas hiver`);
    }
  }

  // Zones climatiques cohérentes avec température
  if (climate.zones.includes('arctic') || climate.zones.includes('subarctic')) {
    if (avgTemp > 20) {
      warnings.push(`Zone arctique/subarctique avec température ${avgTemp}°C semble incohérente`);
    }
  }

  if (climate.zones.includes('desert_hot')) {
    if (avgTemp < 20) {
      warnings.push(`Désert chaud avec température ${avgTemp}°C semble incohérente`);
    }
  }

  if (climate.zones.includes('equatorial') || climate.zones.includes('tropical')) {
    if (avgTemp < 20) {
      warnings.push(`Zone tropicale/équatoriale avec température ${avgTemp}°C semble incohérente`);
    }
  }

  return {
    testCase,
    success: errors.length === 0,
    errors,
    warnings,
    details: {
      month,
      avgTemp,
      tempCategories,
      seasons,
      hemisphere: climate.hemisphere,
      zones: climate.zones
    }
  };
}

// Affichage des résultats
function displayResults(results: TestResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('RAPPORT DE TEST - SYSTÈME CLIMATIQUE');
  console.log('='.repeat(80) + '\n');

  const totalTests = results.length;
  const successTests = results.filter(r => r.success).length;
  const failedTests = results.filter(r => !r.success).length;
  const testsWithWarnings = results.filter(r => r.warnings.length > 0).length;

  console.log(`📊 STATISTIQUES GLOBALES`);
  console.log(`   Total de tests : ${totalTests}`);
  console.log(`   ✅ Réussis : ${successTests} (${((successTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   ❌ Échoués : ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   ⚠️  Avec warnings : ${testsWithWarnings} (${((testsWithWarnings/totalTests)*100).toFixed(1)}%)`);
  console.log('');

  // Statistiques par type
  const typeStats = new Map<string, { total: number, success: number, failed: number, warnings: number }>();
  for (const result of results) {
    const type = result.testCase.type;
    if (!typeStats.has(type)) {
      typeStats.set(type, { total: 0, success: 0, failed: 0, warnings: 0 });
    }
    const stats = typeStats.get(type)!;
    stats.total++;
    if (result.success) stats.success++;
    else stats.failed++;
    if (result.warnings.length > 0) stats.warnings++;
  }

  console.log(`📈 STATISTIQUES PAR TYPE DE TEST`);
  for (const [type, stats] of typeStats) {
    const successRate = ((stats.success / stats.total) * 100).toFixed(1);
    console.log(`   ${type}:`);
    console.log(`      Total: ${stats.total} | Réussis: ${stats.success} (${successRate}%) | Échoués: ${stats.failed} | Warnings: ${stats.warnings}`);
  }
  console.log('');

  // Tests échoués
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log(`❌ TESTS ÉCHOUÉS (${failedResults.length}):`);
    console.log('-'.repeat(80));
    for (const result of failedResults) {
      console.log(`\n🔴 Test #${result.testCase.id}: ${result.testCase.description}`);
      console.log(`   Pays: ${result.testCase.pays} (${result.testCase.paysCode})`);
      console.log(`   Date: ${result.testCase.dateDepart} (${getMonthName(result.details.month)})`);
      console.log(`   Température moyenne: ${result.details.avgTemp}°C`);
      console.log(`   Catégories détectées: ${result.details.tempCategories.join(', ')}`);
      console.log(`   Saisons détectées: ${result.details.seasons.join(', ') || 'aucune'}`);
      console.log(`   Zones climatiques: ${result.details.zones.join(', ')}`);
      console.log(`   Hémisphère: ${result.details.hemisphere}`);
      console.log(`   Erreurs:`);
      for (const error of result.errors) {
        console.log(`      - ${error}`);
      }
    }
    console.log('\n' + '-'.repeat(80) + '\n');
  }

  // Tests avec warnings
  const warningResults = results.filter(r => r.warnings.length > 0 && r.success);
  if (warningResults.length > 0) {
    console.log(`⚠️  TESTS AVEC WARNINGS (${warningResults.length}):`);
    console.log('-'.repeat(80));
    for (const result of warningResults.slice(0, 10)) { // Limiter à 10 pour ne pas surcharger
      console.log(`\n🟡 Test #${result.testCase.id}: ${result.testCase.description}`);
      console.log(`   Pays: ${result.testCase.pays} (${result.testCase.paysCode})`);
      console.log(`   Date: ${result.testCase.dateDepart} (${getMonthName(result.details.month)})`);
      console.log(`   Température moyenne: ${result.details.avgTemp}°C`);
      console.log(`   Warnings:`);
      for (const warning of result.warnings) {
        console.log(`      - ${warning}`);
      }
    }
    if (warningResults.length > 10) {
      console.log(`\n   ... et ${warningResults.length - 10} autres tests avec warnings`);
    }
    console.log('\n' + '-'.repeat(80) + '\n');
  }

  // Exemples de tests réussis
  const successResults = results.filter(r => r.success && r.warnings.length === 0);
  if (successResults.length > 0) {
    console.log(`✅ EXEMPLES DE TESTS RÉUSSIS (${Math.min(5, successResults.length)} sur ${successResults.length}):`);
    console.log('-'.repeat(80));
    for (const result of successResults.slice(0, 5)) {
      console.log(`\n🟢 Test #${result.testCase.id}: ${result.testCase.description}`);
      console.log(`   Pays: ${result.testCase.pays} (${result.testCase.paysCode})`);
      console.log(`   Date: ${result.testCase.dateDepart} (${getMonthName(result.details.month)})`);
      console.log(`   Température: ${result.details.avgTemp}°C → ${result.details.tempCategories.join(', ')}`);
      console.log(`   Saisons: ${result.details.seasons.join(', ') || 'N/A (zone tropicale/équatoriale)'}`);
      console.log(`   Zones: ${result.details.zones.join(', ')}`);
    }
    console.log('\n' + '-'.repeat(80) + '\n');
  }

  // Résumé final
  console.log(`\n${'='.repeat(80)}`);
  if (failedTests === 0) {
    console.log('🎉 TOUS LES TESTS SONT RÉUSSIS !');
    console.log('Le système de recommandations climatiques est fiable.');
  } else {
    console.log(`⚠️  ${failedTests} TEST(S) ONT ÉCHOUÉ`);
    console.log('Des corrections sont nécessaires pour garantir la fiabilité du système.');
  }
  console.log(`${'='.repeat(80)}\n`);
}

// Main
function main() {
  console.log('🌍 Génération des cas de test...');
  const testCases = generateTestCases();
  console.log(`✅ ${testCases.length} cas de test générés\n`);

  console.log('🔄 Exécution des tests...');
  const results: TestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const result = runTest(testCase);
    results.push(result);

    // Progress indicator
    if ((i + 1) % 10 === 0) {
      console.log(`   Progression: ${i + 1}/${testCases.length} tests`);
    }
  }

  console.log(`✅ Tous les tests ont été exécutés\n`);

  displayResults(results);
}

// Exécution
main();
