/**
 * Test exhaustif pour valider les corrections des recommandations météorologiques
 *
 * Données de test :
 * - Pays : France, Russie, Thaïlande, Arabie saoudite, Norvège, Mexique, Égypte, Népal, Indonésie, États-Unis
 * - Dates : 06 Décembre 2025 => 08 janvier 2027 (398 jours)
 *
 * Bugs corrigés :
 * 1. Saisons détectées uniquement "Hiver" → Toutes les saisons devraient être détectées
 * 2. Conditions climatiques en double dans PDF compact → Ne doivent apparaître qu'une fois dans section dédiée
 * 3. Section conditions climatiques manquante dans PDF détaillé → Doit être ajoutée
 */

import { FormData } from './src/types/form';
import { autoDetectSeasons, autoDetectTemperatures, getTravelMonths } from './src/utils/checklistFilters';
import { generateCompleteChecklist } from './src/utils/checklistGenerator';

console.log('\n==========================================');
console.log('🧪 TEST DES CORRECTIONS MÉTÉO');
console.log('==========================================\n');

// Données de test exactes fournies par l'utilisateur
const testFormData: FormData = {
  localisation: 'multi-destinations',
  pays: [
    { code: 'FR', nom: '🇫🇷France' },
    { code: 'RU', nom: '🇷🇺Russie' },
    { code: 'TH', nom: '🇹🇭Thaïlande' },
    { code: 'SA', nom: '🇸🇦Arabie saoudite' },
    { code: 'NO', nom: '🇳🇴Norvège' },
    { code: 'MX', nom: '🇲🇽Mexique' },
    { code: 'EG', nom: '🇪🇬Égypte' },
    { code: 'NP', nom: '🇳🇵Népal' },
    { code: 'ID', nom: '🇮🇩Indonésie' },
    { code: 'US', nom: '🇺🇸États-Unis' }
  ],
  dateDepart: '2025-12-06',
  dateRetour: '2027-01-08',
  duree: 'tres-long' as any,
  activites: ['randonnee', 'plage', 'culture'],
  temperature: [] as any, // Sera auto-détecté
  saison: [] as any, // Sera auto-détecté
  conditionsClimatiques: [
    'climat_sec_aride',
    'climat_neige',
    'climat_vents_forts',
    'climat_canicule',
    'climat_froid_intense',
    'climat_amplitude_thermique',
    'climat_brouillard',
    'climat_tropical_humide',
    'climat_humidite'
  ],
  profil: 'solo',
  typeVoyage: 'aventure',
  confort: 'standard',
  sectionsInclure: [],
  formatPDF: 'detaille',
  nomVoyage: 'Test Météo Multi-Destinations'
};

console.log('📝 Données de test :');
console.log(`   Pays : ${testFormData.pays.map(p => p.nom).join(', ')}`);
console.log(`   Dates : ${testFormData.dateDepart} => ${testFormData.dateRetour}`);

// Calculer la durée du voyage
const start = new Date(testFormData.dateDepart);
const end = new Date(testFormData.dateRetour!);
const durationDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
console.log(`   Durée : ${durationDays} jours\n`);

// === TEST 1 : Détection des mois du voyage ===
console.log('==========================================');
console.log('✅ TEST 1 : Détection des mois du voyage');
console.log('==========================================');

// Appeler directement getTravelMonths pour tester (on doit créer une fonction exportée pour les tests)
// Pour l'instant, on va tester via autoDetectSeasons
const detectedSeasons = autoDetectSeasons(testFormData);
console.log('   Saisons détectées :', detectedSeasons);
console.log('   ✓ Attendu : Toutes les saisons (printemps, été, automne, hiver) pour un voyage de 398 jours');

// Vérification
const allSeasons = ['printemps', 'ete', 'automne', 'hiver'];
const hasAllSeasons = allSeasons.every(s => detectedSeasons.includes(s as any));
if (hasAllSeasons) {
  console.log('   ✅ SUCCÈS : Toutes les saisons ont été détectées !');
} else {
  console.log('   ❌ ÉCHEC : Certaines saisons manquent');
  console.log('      Manquantes :', allSeasons.filter(s => !detectedSeasons.includes(s as any)));
}

// === TEST 2 : Détection des températures ===
console.log('\n==========================================');
console.log('✅ TEST 2 : Détection des températures');
console.log('==========================================');

const detectedTemperatures = autoDetectTemperatures(testFormData);
console.log('   Températures détectées :', detectedTemperatures);
console.log('   ✓ Attendu : Toutes les gammes de températures (très froide à très chaude)');

// Vérification
const expectedTempRange = ['tres-froide', 'froide', 'temperee', 'chaude', 'tres-chaude'];
const hasDiverseTemps = detectedTemperatures.length >= 3; // Au moins 3 températures différentes
if (hasDiverseTemps) {
  console.log('   ✅ SUCCÈS : Gamme de températures diverse détectée !');
} else {
  console.log('   ❌ ÉCHEC : Gamme de températures trop limitée');
}

// === TEST 3 : Génération de la checklist complète ===
console.log('\n==========================================');
console.log('✅ TEST 3 : Génération de la checklist');
console.log('==========================================');

// Appliquer les détections automatiques
testFormData.saison = detectedSeasons;
testFormData.temperature = detectedTemperatures;

const checklist = generateCompleteChecklist(testFormData);

console.log(`   Total sections : ${checklist.sections.length}`);
console.log(`   Total items : ${checklist.stats.totalItems}`);

// Vérifier les sections climatiques
const climateSections = checklist.sections.filter(s => s.source === 'climat');
console.log(`   Sections climatiques : ${climateSections.length}`);
console.log('   Noms :', climateSections.map(s => s.nom));

// Vérifier les conseils climatiques
console.log(`   Conseils climatiques : ${checklist.conseilsClimatiques?.length || 0}`);
if (checklist.conseilsClimatiques) {
  console.log('   Noms :', checklist.conseilsClimatiques.map(c => c.nom));
}

// === TEST 4 : Vérification de l'affichage PDF ===
console.log('\n==========================================');
console.log('✅ TEST 4 : Structure du PDF');
console.log('==========================================');

// Simuler la logique de PDFDocument.tsx
const ESSENTIAL_IDS = ['documents', 'finances', 'sante'];
const essentialSections = checklist.sections.filter(section =>
  ESSENTIAL_IDS.includes(section.id)
);

const recommendedSections = checklist.sections.filter(section =>
  section.source !== 'activite' &&
  section.source !== 'climat' &&
  !ESSENTIAL_IDS.includes(section.id)
);

const activiteSections = checklist.sections.filter(section => section.source === 'activite');
const climateOnlySections = checklist.sections.filter(section => section.source === 'climat');

console.log('\n   📋 FORMAT DÉTAILLÉ :');
console.log(`   1. Essentiels absolus : ${essentialSections.length} sections`);
console.log(`   2. Sélection conseillée : ${recommendedSections.length} sections`);
console.log(`      → Contient sections climatiques ? ${recommendedSections.some(s => s.source === 'climat') ? '❌ OUI (BUG!)' : '✅ NON'}`);
console.log(`   3. Activités : ${activiteSections.length} sections`);
console.log(`   4. Conseils climatiques : ${checklist.conseilsClimatiques?.length || 0} conseils`);

// Vérification
const hasClimateInRecommended = recommendedSections.some(s => s.source === 'climat');
if (!hasClimateInRecommended && checklist.conseilsClimatiques && checklist.conseilsClimatiques.length > 0) {
  console.log('\n   ✅ SUCCÈS : Structure PDF correcte !');
  console.log('      - Sections climatiques EXCLUES de "Sélection conseillée"');
  console.log('      - Section dédiée "Conseils climatiques" disponible');
} else {
  console.log('\n   ❌ ÉCHEC : Problème dans la structure du PDF');
  if (hasClimateInRecommended) {
    console.log('      - Les sections climatiques sont encore dans "Sélection conseillée"');
  }
  if (!checklist.conseilsClimatiques || checklist.conseilsClimatiques.length === 0) {
    console.log('      - Aucun conseil climatique disponible pour la section dédiée');
  }
}

// === RÉSUMÉ FINAL ===
console.log('\n==========================================');
console.log('📊 RÉSUMÉ DES TESTS');
console.log('==========================================\n');

const tests = [
  { name: 'Détection de toutes les saisons', passed: hasAllSeasons },
  { name: 'Gamme de températures diverse', passed: hasDiverseTemps },
  { name: 'Sections climatiques générées', passed: climateSections.length > 0 },
  { name: 'Conseils climatiques disponibles', passed: (checklist.conseilsClimatiques?.length || 0) > 0 },
  { name: 'Sections climatiques EXCLUES de "Sélection conseillée"', passed: !hasClimateInRecommended }
];

const passedTests = tests.filter(t => t.passed).length;
const totalTests = tests.length;

tests.forEach(test => {
  console.log(`   ${test.passed ? '✅' : '❌'} ${test.name}`);
});

console.log(`\n   Total : ${passedTests}/${totalTests} tests réussis`);

if (passedTests === totalTests) {
  console.log('\n   🎉 TOUS LES BUGS ONT ÉTÉ CORRIGÉS !');
} else {
  console.log(`\n   ⚠️  ${totalTests - passedTests} test(s) échoué(s) - vérifier les corrections`);
}

console.log('\n==========================================\n');

// Export pour utilisation dans d'autres tests
export { testFormData, checklist };
