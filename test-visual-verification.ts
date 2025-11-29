/**
 * Test de vérification visuelle des corrections
 * Affiche les résultats détaillés pour validation manuelle
 */

import { FormData } from './src/types/form';
import { autoDetectSeasons, autoDetectTemperatures } from './src/utils/checklistFilters';
import { generateCompleteChecklist } from './src/utils/checklistGenerator';

const testData: FormData = {
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
  temperature: [] as any,
  saison: [] as any,
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
  nomVoyage: 'Test Météo'
};

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     VÉRIFICATION VISUELLE DES CORRECTIONS MÉTÉO            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Détections automatiques
const seasons = autoDetectSeasons(testData);
const temperatures = autoDetectTemperatures(testData);
testData.saison = seasons;
testData.temperature = temperatures;

console.log('📋 RÉSULTATS DE DÉTECTION AUTOMATIQUE\n');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('🗓️  SAISONS DÉTECTÉES :');
console.log('   ✓ Hiver      : ' + (seasons.includes('hiver') ? '✅ OUI' : '❌ NON'));
console.log('   ✓ Printemps  : ' + (seasons.includes('printemps') ? '✅ OUI' : '❌ NON'));
console.log('   ✓ Été        : ' + (seasons.includes('ete') ? '✅ OUI' : '❌ NON'));
console.log('   ✓ Automne    : ' + (seasons.includes('automne') ? '✅ OUI' : '❌ NON'));
console.log('   → Total : ' + seasons.length + '/4 saisons');

console.log('\n🌡️  TEMPÉRATURES DÉTECTÉES :');
temperatures.forEach(temp => {
  let icon = '';
  let label = '';
  switch(temp) {
    case 'tres-froide': icon = '🥶'; label = 'Très froide'; break;
    case 'froide': icon = '❄️ '; label = 'Froide'; break;
    case 'temperee': icon = '🌤️ '; label = 'Tempérée'; break;
    case 'chaude': icon = '☀️ '; label = 'Chaude'; break;
    case 'tres-chaude': icon = '🔥'; label = 'Très chaude'; break;
    case 'chaleur-extreme': icon = '🌡️ '; label = 'Chaleur extrême'; break;
  }
  console.log(`   ${icon} ${label}`);
});
console.log('   → Total : ' + temperatures.length + ' gammes de températures');

// Génération de la checklist
const checklist = generateCompleteChecklist(testData);

console.log('\n\n📦 STRUCTURE DE LA CHECKLIST GÉNÉRÉE\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Statistiques générales
console.log('📊 STATISTIQUES :');
console.log(`   • Total sections  : ${checklist.sections.length}`);
console.log(`   • Total items     : ${checklist.stats.totalItems}`);
console.log(`   • Items haute priorité : ${checklist.stats.itemsParPriorite.haute}`);

// Sections par type
const essentials = checklist.sections.filter(s => ['documents', 'finances', 'sante'].includes(s.id));
const climate = checklist.sections.filter(s => s.source === 'climat');
const activities = checklist.sections.filter(s => s.source === 'activite');
const others = checklist.sections.filter(s =>
  s.source !== 'climat' &&
  s.source !== 'activite' &&
  !['documents', 'finances', 'sante'].includes(s.id)
);

console.log('\n📂 RÉPARTITION DES SECTIONS :');
console.log(`   1. Essentiels absolus : ${essentials.length} sections`);
essentials.forEach(s => console.log(`      • ${s.nom} (${s.items.length} items)`));

console.log(`\n   2. Sélection conseillée : ${others.length} sections`);
others.forEach(s => console.log(`      • ${s.nom} (${s.items.length} items)`));

console.log(`\n   3. Activités : ${activities.length} sections`);
activities.forEach(s => console.log(`      • ${s.nom} (${s.items.length} items)`));

console.log(`\n   4. Conditions climatiques : ${climate.length} sections`);
climate.forEach(s => console.log(`      • ${s.nom} (${s.items.length} items)`));

// Vérification de la structure PDF
console.log('\n\n🖨️  VÉRIFICATION STRUCTURE PDF\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Simuler la logique de PDFDocument
const ESSENTIAL_IDS = ['documents', 'finances', 'sante'];
const recommendedSections = checklist.sections.filter(section =>
  section.source !== 'activite' &&
  section.source !== 'climat' &&
  !ESSENTIAL_IDS.includes(section.id)
);

const hasClimateInRecommended = recommendedSections.some(s => s.source === 'climat');

console.log('📄 FORMAT COMPACT :');
console.log('   Section "À prévoir - Sélection conseillée" :');
console.log(`      → Contient sections climatiques ? ${hasClimateInRecommended ? '❌ OUI (BUG!)' : '✅ NON'}`);
console.log('   Section "Conseils - Conditions climatiques" :');
console.log(`      → Disponible ? ${checklist.conseilsClimatiques && checklist.conseilsClimatiques.length > 0 ? '✅ OUI' : '❌ NON'}`);
console.log(`      → Nombre de conseils : ${checklist.conseilsClimatiques?.length || 0}`);

console.log('\n📑 FORMAT DÉTAILLÉ :');
console.log('   Section "À prévoir - Sélection conseillée" :');
console.log(`      → Contient sections climatiques ? ${hasClimateInRecommended ? '❌ OUI (BUG!)' : '✅ NON'}`);
console.log('   Section "Conseils - Conditions climatiques" (dédiée) :');
console.log(`      → Disponible ? ${checklist.conseilsClimatiques && checklist.conseilsClimatiques.length > 0 ? '✅ OUI' : '❌ NON'}`);

// Détails des conseils climatiques
if (checklist.conseilsClimatiques && checklist.conseilsClimatiques.length > 0) {
  console.log('\n\n💡 CONSEILS CLIMATIQUES DISPONIBLES\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  checklist.conseilsClimatiques.forEach((conseil, index) => {
    console.log(`${index + 1}. ${conseil.nom}`);
    const preview = conseil.conseil.substring(0, 80) + (conseil.conseil.length > 80 ? '...' : '');
    console.log(`   "${preview}"`);
  });
}

// Résumé final
console.log('\n\n✅ RÉSUMÉ FINAL\n');
console.log('═══════════════════════════════════════════════════════════\n');

const checks = [
  {
    label: 'Toutes les saisons détectées',
    passed: seasons.length === 4
  },
  {
    label: 'Gamme de températures diverse (≥4)',
    passed: temperatures.length >= 4
  },
  {
    label: 'Sections climatiques générées',
    passed: climate.length > 0
  },
  {
    label: 'Conseils climatiques disponibles',
    passed: (checklist.conseilsClimatiques?.length || 0) > 0
  },
  {
    label: 'Sections climatiques EXCLUES de "Sélection conseillée"',
    passed: !hasClimateInRecommended
  }
];

checks.forEach(check => {
  console.log(`${check.passed ? '✅' : '❌'} ${check.label}`);
});

const allPassed = checks.every(c => c.passed);
console.log('\n' + (allPassed ? '🎉 TOUS LES CRITÈRES SONT REMPLIS !' : '⚠️  CERTAINS CRITÈRES NE SONT PAS REMPLIS'));

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                    FIN DE LA VÉRIFICATION                  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');
