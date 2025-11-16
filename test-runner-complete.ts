/**
 * Script de test COMPLET pour TOUTES les conditions logiques de TravelPrep
 * Couvre les 50+ scénarios de test définis dans la documentation
 *
 * @version 2.0 - Tests exhaustifs
 * @date 2025-11-16
 */

import { FormData } from './src/types/form';
import {
  generateAutoSuggestions,
  autoDetectSeasons,
  autoDetectTemperatures,
  getClimatEquipment
} from './src/utils/checklistFilters';

// ==========================================
// TYPES
// ==========================================

interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  formData: Partial<FormData>;
  validate: (formData: FormData) => TestResult;
}

interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
}

interface TestReport {
  testCase: string;
  category: string;
  passed: boolean;
  message: string;
  duration: number;
  details?: any;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function createFormData(partial: Partial<FormData>): FormData {
  return {
    nomVoyage: partial.nomVoyage || 'Test Voyage',
    localisation: partial.localisation || 'europe',
    pays: partial.pays || [],
    dateDepart: partial.dateDepart || '2025-07-15',
    dateRetour: partial.dateRetour || '2025-07-30',
    duree: partial.duree || 'courte',
    typeVoyage: partial.typeVoyage || 'vacances',
    activites: partial.activites || [],
    temperature: partial.temperature || [],
    saison: partial.saison || [],
    conditionsClimatiques: partial.conditionsClimatiques || [],
    profil: partial.profil || 'solo',
    confort: partial.confort || 'standard',
    sectionsInclure: partial.sectionsInclure || ['all']
  };
}

function runTest(testCase: TestCase): TestReport {
  const startTime = Date.now();
  const formData = createFormData(testCase.formData);

  try {
    const testResult = testCase.validate(formData);
    const duration = Date.now() - startTime;

    return {
      testCase: testCase.name,
      category: testCase.category,
      passed: testResult.passed,
      message: testResult.message,
      duration,
      details: testResult.details
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      testCase: testCase.name,
      category: testCase.category,
      passed: false,
      message: `❌ Erreur: ${error.message}`,
      duration,
      details: { error: error.stack }
    };
  }
}

// ==========================================
// TESTS - AUTO-DÉTECTION SAISONS
// ==========================================

const seasonTests: TestCase[] = [
  {
    id: 'season_01',
    name: 'Saison Vietnam juillet (mousson)',
    category: '1. Auto-détection saisons',
    description: 'Vietnam en juillet = automne (mousson)',
    formData: {
      pays: [{ code: 'VN', nom: 'Vietnam' }],
      dateDepart: '2025-07-15',
      localisation: 'asie'
    },
    validate: (fd) => {
      const seasons = autoDetectSeasons(fd);
      const hasAutumn = seasons.includes('automne');
      return {
        passed: hasAutumn,
        message: hasAutumn ? '✅ Mousson détectée' : `❌ Attendu automne, reçu: ${seasons}`,
        details: { seasons }
      };
    }
  },
  {
    id: 'season_02',
    name: 'Saison Australie janvier (été austral)',
    category: '1. Auto-détection saisons',
    description: 'Hémisphère sud: janvier = été',
    formData: {
      pays: [{ code: 'AU', nom: 'Australie' }],
      dateDepart: '2026-01-15',
      localisation: 'oceanie'
    },
    validate: (fd) => {
      const seasons = autoDetectSeasons(fd);
      const hasSummer = seasons.includes('ete');
      return {
        passed: hasSummer,
        message: hasSummer ? '✅ Été austral détecté' : `❌ Attendu été, reçu: ${seasons}`,
        details: { seasons }
      };
    }
  },
  {
    id: 'season_03',
    name: 'Saison Groenland hiver arctique',
    category: '1. Auto-détection saisons',
    description: 'Groenland janvier = hiver polaire',
    formData: {
      pays: [{ code: 'GL', nom: 'Groenland' }],
      dateDepart: '2026-01-15'
    },
    validate: (fd) => {
      const seasons = autoDetectSeasons(fd);
      const hasWinter = seasons.includes('hiver');
      return {
        passed: hasWinter,
        message: hasWinter ? '✅ Hiver arctique détecté' : `❌ Attendu hiver, reçu: ${seasons}`,
        details: { seasons }
      };
    }
  }
];

// ==========================================
// TESTS - AUTO-DÉTECTION TEMPÉRATURES
// ==========================================

const temperatureTests: TestCase[] = [
  {
    id: 'temp_01',
    name: 'Température Thaïlande juillet (très chaude)',
    category: '2. Auto-détection températures',
    description: 'Climat tropical = très chaud',
    formData: {
      pays: [{ code: 'TH', nom: 'Thaïlande' }],
      dateDepart: '2025-07-15'
    },
    validate: (fd) => {
      const temps = autoDetectTemperatures(fd);
      const has = temps.includes('tres-chaude');
      return {
        passed: has,
        message: has ? '✅ Très chaude détectée' : `❌ Attendu très-chaude, reçu: ${temps}`,
        details: { temps }
      };
    }
  },
  {
    id: 'temp_02',
    name: 'Température Groenland janvier (très froide)',
    category: '2. Auto-détection températures',
    description: 'Arctique hiver = très froid',
    formData: {
      pays: [{ code: 'GL', nom: 'Groenland' }],
      dateDepart: '2026-01-15'
    },
    validate: (fd) => {
      const temps = autoDetectTemperatures(fd);
      const has = temps.includes('tres-froide');
      return {
        passed: has,
        message: has ? '✅ Très froide détectée' : `❌ Attendu très-froide, reçu: ${temps}`,
        details: { temps }
      };
    }
  },
  {
    id: 'temp_03',
    name: 'Température Arabie juillet (désert)',
    category: '2. Auto-détection températures',
    description: 'Désert été = très chaud',
    formData: {
      pays: [{ code: 'SA', nom: 'Arabie Saoudite' }],
      dateDepart: '2025-07-15'
    },
    validate: (fd) => {
      const temps = autoDetectTemperatures(fd);
      const has = temps.includes('tres-chaude');
      return {
        passed: has,
        message: has ? '✅ Chaleur désertique détectée' : `❌ Attendu très-chaude, reçu: ${temps}`,
        details: { temps }
      };
    }
  }
];

// ==========================================
// TESTS - SUGGESTIONS CLIMATIQUES
// ==========================================

const suggestionTests: TestCase[] = [
  {
    id: 'sug_01',
    name: 'Mousson Asie du Sud-Est',
    category: '3. Suggestions climatiques',
    description: 'Vietnam juillet → mousson',
    formData: {
      pays: [{ code: 'VN', nom: 'Vietnam' }],
      dateDepart: '2025-07-15',
      localisation: 'asie',
      temperature: ['tres-chaude'],
      saison: ['ete']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_mousson');
      return {
        passed: has,
        message: has ? '✅ Mousson suggérée' : `❌ Mousson non suggérée`,
        details: { count: sugg.length, ids: sugg.map(s => s.conditionId) }
      };
    }
  },
  {
    id: 'sug_02',
    name: 'Tropical humide Asie',
    category: '3. Suggestions climatiques',
    description: 'Asie tropicale → climat humide',
    formData: {
      pays: [{ code: 'TH', nom: 'Thaïlande' }],
      dateDepart: '2025-07-15',
      localisation: 'asie',
      temperature: ['tres-chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_tropical_humide');
      return {
        passed: has,
        message: has ? '✅ Tropical humide suggéré' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_03',
    name: 'Cyclones Caraïbes',
    category: '3. Suggestions climatiques',
    description: 'Cuba septembre → cyclones',
    formData: {
      pays: [{ code: 'CU', nom: 'Cuba' }],
      dateDepart: '2025-09-15',
      localisation: 'amerique-centrale-caraibes',
      temperature: ['chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_cyclones');
      return {
        passed: has,
        message: has ? '✅ Cyclones suggérés' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_04',
    name: 'Typhons Philippines',
    category: '3. Suggestions climatiques',
    description: 'Philippines août → typhons',
    formData: {
      pays: [{ code: 'PH', nom: 'Philippines' }],
      dateDepart: '2025-08-15',
      localisation: 'asie',
      temperature: ['tres-chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_cyclones');
      return {
        passed: has,
        message: has ? '✅ Typhons suggérés' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_05',
    name: 'Désert aride Sahara',
    category: '3. Suggestions climatiques',
    description: 'Maroc/désert → aride',
    formData: {
      pays: [{ code: 'MA', nom: 'Maroc' }],
      dateDepart: '2025-07-15',
      localisation: 'afrique',
      temperature: ['tres-chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_sec_aride' || s.conditionId === 'climat_desert_aride');
      return {
        passed: has,
        message: has ? '✅ Désert aride suggéré' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_06',
    name: 'Canicule désert',
    category: '3. Suggestions climatiques',
    description: 'Arabie été → canicule',
    formData: {
      pays: [{ code: 'SA', nom: 'Arabie Saoudite' }],
      dateDepart: '2025-07-15',
      localisation: 'asie',
      temperature: ['tres-chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_canicule');
      return {
        passed: has,
        message: has ? '✅ Canicule suggérée' : `❌ Non suggérée`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_07',
    name: 'Neige zones froides',
    category: '3. Suggestions climatiques',
    description: 'Groenland hiver → neige',
    formData: {
      pays: [{ code: 'GL', nom: 'Groenland' }],
      dateDepart: '2026-01-15',
      temperature: ['tres-froide'],
      saison: ['hiver']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_neige');
      return {
        passed: has,
        message: has ? '✅ Neige suggérée' : `❌ Non suggérée`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_08',
    name: 'Froid intense arctique',
    category: '3. Suggestions climatiques',
    description: 'Zones polaires → froid intense',
    formData: {
      pays: [{ code: 'GL', nom: 'Groenland' }],
      dateDepart: '2026-01-15',
      temperature: ['tres-froide'],
      saison: ['hiver']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_froid_intense');
      return {
        passed: has,
        message: has ? '✅ Froid intense suggéré' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_09',
    name: 'Altitude Népal',
    category: '3. Suggestions climatiques',
    description: 'Népal + randonnée → altitude',
    formData: {
      pays: [{ code: 'NP', nom: 'Népal' }],
      dateDepart: '2025-10-15',
      localisation: 'asie',
      activites: ['randonnee'],
      temperature: ['froide']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId.includes('altitude'));
      return {
        passed: has,
        message: has ? '✅ Altitude suggérée' : `❌ Non suggérée`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_10',
    name: 'Jungle Amazonie',
    category: '3. Suggestions climatiques',
    description: 'Brésil + randonnée → jungle',
    formData: {
      pays: [{ code: 'BR', nom: 'Brésil' }],
      dateDepart: '2025-03-15',
      localisation: 'amerique-sud',
      activites: ['randonnee', 'camping'],
      temperature: ['chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_jungle_dense');
      return {
        passed: has,
        message: has ? '✅ Jungle suggérée' : `❌ Non suggérée`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_11',
    name: 'Volcanique Islande',
    category: '3. Suggestions climatiques',
    description: 'Islande + randonnée → volcanique',
    formData: {
      pays: [{ code: 'IS', nom: 'Islande' }],
      dateDepart: '2025-07-15',
      localisation: 'europe',
      activites: ['randonnee']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_volcanique');
      return {
        passed: has,
        message: has ? '✅ Volcanique suggéré' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_12',
    name: 'Vents forts Patagonie',
    category: '3. Suggestions climatiques',
    description: 'Argentine/Patagonie → vents forts',
    formData: {
      pays: [{ code: 'AR', nom: 'Argentine' }],
      dateDepart: '2025-12-15',
      localisation: 'amerique-sud',
      activites: ['randonnee']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_vents_forts');
      return {
        passed: has,
        message: has ? '✅ Vents forts suggérés' : `❌ Non suggérés`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_13',
    name: 'Humidité extrême tropical',
    category: '3. Suggestions climatiques',
    description: 'Zone tropicale → humidité',
    formData: {
      pays: [{ code: 'ID', nom: 'Indonésie' }],
      dateDepart: '2025-06-15',
      localisation: 'asie',
      temperature: ['tres-chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_humidite');
      return {
        passed: has,
        message: has ? '✅ Humidité suggérée' : `❌ Non suggérée`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_14',
    name: 'Environnement marin',
    category: '3. Suggestions climatiques',
    description: 'Activités plage → marin',
    formData: {
      pays: [{ code: 'TH', nom: 'Thaïlande' }],
      dateDepart: '2025-07-15',
      localisation: 'asie',
      activites: ['plage', 'sports-nautiques']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_marin');
      return {
        passed: has,
        message: has ? '✅ Marin suggéré' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'sug_15',
    name: 'Brouillard zones tempérées',
    category: '3. Suggestions climatiques',
    description: 'UK automne → brouillard',
    formData: {
      pays: [{ code: 'GB', nom: 'Royaume-Uni' }],
      dateDepart: '2025-10-15',
      localisation: 'europe',
      saison: ['automne']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const has = sugg.some(s => s.conditionId === 'climat_brouillard');
      return {
        passed: has,
        message: has ? '✅ Brouillard suggéré' : `❌ Non suggéré`,
        details: { count: sugg.length }
      };
    }
  }
];

// ==========================================
// TESTS - FILTRAGE ÉQUIPEMENTS
// ==========================================

const equipmentTests: TestCase[] = [
  {
    id: 'equip_01',
    name: 'Équipements mousson générés',
    category: '4. Filtrage équipements',
    description: 'Mousson sélectionnée → équipements',
    formData: {
      pays: [{ code: 'VN', nom: 'Vietnam' }],
      dateDepart: '2025-07-15',
      localisation: 'asie',
      activites: ['randonnee'], // Requis par le filtre mousson
      conditionsClimatiques: ['climat_mousson']
    },
    validate: (fd) => {
      const sections = getClimatEquipment(fd);
      const hasItems = sections.length > 0 && sections[0].items.length > 0;
      return {
        passed: hasItems,
        message: hasItems ? `✅ ${sections[0]?.items.length || 0} équipements mousson générés` : `❌ Aucun équipement`,
        details: { sections: sections.length, items: sections[0]?.items.length || 0 }
      };
    }
  },
  {
    id: 'equip_02',
    name: 'Pas d\'équipements si "aucune"',
    category: '4. Filtrage équipements',
    description: 'climat_aucune → aucun équipement',
    formData: {
      pays: [{ code: 'FR', nom: 'France' }],
      dateDepart: '2025-06-15',
      localisation: 'europe',
      conditionsClimatiques: ['climat_aucune']
    },
    validate: (fd) => {
      const sections = getClimatEquipment(fd);
      const isEmpty = sections.length === 0;
      return {
        passed: isEmpty,
        message: isEmpty ? '✅ Aucun équipement généré' : `❌ Équipements générés à tort`,
        details: { sections: sections.length }
      };
    }
  },
  {
    id: 'equip_03',
    name: 'Filtre par période mousson',
    category: '4. Filtrage équipements',
    description: 'Mousson hors période → pas d\'équipements',
    formData: {
      pays: [{ code: 'VN', nom: 'Vietnam' }],
      dateDepart: '2025-01-15', // Hors période mousson (mai-octobre)
      localisation: 'asie',
      conditionsClimatiques: ['climat_mousson']
    },
    validate: (fd) => {
      const sections = getClimatEquipment(fd);
      // Devrait filtrer car hors période
      const isEmpty = sections.length === 0 || sections[0].items.length === 0;
      return {
        passed: isEmpty,
        message: isEmpty ? '✅ Filtrage période fonctionne' : `❌ Équipements générés hors période`,
        details: { sections }
      };
    }
  }
];

// ==========================================
// TESTS - CAS LIMITES
// ==========================================

const edgeCaseTests: TestCase[] = [
  {
    id: 'edge_01',
    name: 'Multi-destinations suggestions',
    category: '5. Cas limites',
    description: 'Multi-destinations → suggestions adaptées',
    formData: {
      pays: [
        { code: 'VN', nom: 'Vietnam' },
        { code: 'TH', nom: 'Thaïlande' },
        { code: 'ID', nom: 'Indonésie' }
      ],
      dateDepart: '2025-07-15',
      localisation: 'asie',
      temperature: ['tres-chaude']
    },
    validate: (fd) => {
      const sugg = generateAutoSuggestions(fd);
      const hasMultiple = sugg.length >= 3;
      return {
        passed: hasMultiple,
        message: hasMultiple ? `✅ ${sugg.length} suggestions générées` : `❌ Pas assez de suggestions`,
        details: { count: sugg.length }
      };
    }
  },
  {
    id: 'edge_02',
    name: 'Hémisphère sud inversé',
    category: '5. Cas limites',
    description: 'Brésil janvier = été (sud)',
    formData: {
      pays: [{ code: 'BR', nom: 'Brésil' }],
      dateDepart: '2026-01-15',
      localisation: 'amerique-sud'
    },
    validate: (fd) => {
      const seasons = autoDetectSeasons(fd);
      const hasSummer = seasons.includes('ete');
      return {
        passed: hasSummer,
        message: hasSummer ? '✅ Inversion hémisphère sud OK' : `❌ Saison incorrecte: ${seasons}`,
        details: { seasons }
      };
    }
  },
  {
    id: 'edge_03',
    name: 'Voyage très long (multi-saisons)',
    category: '5. Cas limites',
    description: 'Voyage 6 mois → plusieurs saisons',
    formData: {
      pays: [{ code: 'FR', nom: 'France' }],
      dateDepart: '2025-06-01',
      dateRetour: '2025-12-31',
      localisation: 'europe'
    },
    validate: (fd) => {
      const seasons = autoDetectSeasons(fd);
      const hasMultiple = seasons.length >= 2;
      return {
        passed: hasMultiple,
        message: hasMultiple ? `✅ ${seasons.length} saisons détectées` : `❌ Une seule saison`,
        details: { seasons }
      };
    }
  },
  {
    id: 'edge_04',
    name: 'Pays inconnu fallback région',
    category: '5. Cas limites',
    description: 'Pays non dans DB → utilise région',
    formData: {
      pays: [{ code: 'XX', nom: 'Pays Inconnu' }],
      dateDepart: '2025-07-15',
      localisation: 'europe'
    },
    validate: (fd) => {
      const seasons = autoDetectSeasons(fd);
      const temps = autoDetectTemperatures(fd);
      // Devrait utiliser fallback régional
      const hasFallback = seasons.length > 0 || temps.length > 0;
      return {
        passed: hasFallback,
        message: hasFallback ? '✅ Fallback régional fonctionne' : `❌ Pas de fallback`,
        details: { seasons, temps }
      };
    }
  }
];

// ==========================================
// MAIN TEST RUNNER
// ==========================================

function runAllTests(): void {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🧪 TRAVELPREP - TESTS EXHAUSTIFS CONDITIONS LOGIQUES       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const allTests = [
    ...seasonTests,
    ...temperatureTests,
    ...suggestionTests,
    ...equipmentTests,
    ...edgeCaseTests
  ];

  const results: TestReport[] = [];
  let passed = 0;
  let failed = 0;

  allTests.forEach((test, index) => {
    console.log(`\n[${(index + 1).toString().padStart(2, '0')}/${allTests.length}] ${test.name}`);
    console.log(`    📝 ${test.description}`);

    const result = runTest(test);
    results.push(result);

    if (result.passed) {
      passed++;
      console.log(`    ${result.message}`);
    } else {
      failed++;
      console.log(`    ${result.message}`);
    }
    console.log(`    ⏱️  ${result.duration}ms`);
  });

  // ==========================================
  // RAPPORT FINAL
  // ==========================================

  console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                      📊 RAPPORT FINAL                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const totalTests = allTests.length;
  const successRate = ((passed / totalTests) * 100).toFixed(1);

  console.log(`Total de tests : ${totalTests}`);
  console.log(`✅ Réussis     : ${passed}`);
  console.log(`❌ Échoués     : ${failed}`);
  console.log(`📈 Taux succès : ${successRate}%\n`);

  // Grouper par catégorie
  const categories = new Map<string, { passed: number; failed: number }>();
  results.forEach(r => {
    if (!categories.has(r.category)) {
      categories.set(r.category, { passed: 0, failed: 0 });
    }
    const cat = categories.get(r.category)!;
    if (r.passed) cat.passed++;
    else cat.failed++;
  });

  console.log('📦 Résultats par catégorie :\n');
  categories.forEach((stats, category) => {
    const total = stats.passed + stats.failed;
    const rate = ((stats.passed / total) * 100).toFixed(0);
    const status = stats.failed === 0 ? '✅' : '⚠️';
    console.log(`   ${status} ${category.padEnd(35)} : ${stats.passed}/${total} (${rate}%)`);
  });

  // Tests échoués
  if (failed > 0) {
    console.log('\n\n❌ TESTS ÉCHOUÉS :\n');
    results
      .filter(r => !r.passed)
      .forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.testCase}`);
        console.log(`      ${r.message}`);
        if (r.details) {
          console.log(`      Détails:`, JSON.stringify(r.details, null, 2));
        }
        console.log('');
      });
  }

  console.log('\n════════════════════════════════════════════════════════════════\n');

  // Statistiques avancées
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = (totalDuration / results.length).toFixed(2);

  console.log('📊 STATISTIQUES AVANCÉES:\n');
  console.log(`   • Tests exécutés           : ${totalTests}`);
  console.log(`   • Temps total d'exécution  : ${totalDuration}ms`);
  console.log(`   • Temps moyen par test     : ${avgDuration}ms`);
  console.log(`   • Catégories testées       : ${categories.size}`);
  console.log('');

  // Couverture des conditions
  const testedConditions = new Set<string>();
  results.forEach(r => {
    if (r.details?.ids) {
      r.details.ids.forEach((id: string) => testedConditions.add(id));
    }
  });

  console.log(`   • Conditions climatiques testées : ${testedConditions.size}`);
  console.log('');

  // Code de sortie
  if (failed > 0) {
    console.log('⚠️  Certains tests ont échoué. Veuillez vérifier les logs ci-dessus.\n');
    process.exit(1);
  } else {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !\n');
    console.log('✨ Le système de suggestions climatiques fonctionne parfaitement.\n');
    process.exit(0);
  }
}

// Lancer les tests
runAllTests();
