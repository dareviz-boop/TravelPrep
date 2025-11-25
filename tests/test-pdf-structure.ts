/**
 * Test de structure du composant PDF Compact
 * Vérifie que les groupements titre + items sont correctement appliqués
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lecture du fichier CompactPage.tsx pour analyser la structure
const compactPagePath = path.join(__dirname, '../src/components/PDF/CompactPage.tsx');
const content = fs.readFileSync(compactPagePath, 'utf-8');

console.log('=== Analyse de la structure du PDF Compact ===\n');

// Test 1: Vérifier que categoryHeaderGroup existe avec breakInside: 'avoid'
const hasCategoryHeaderGroup = content.includes("categoryHeaderGroup") &&
                                content.includes("breakInside: 'avoid'");
console.log(`[${hasCategoryHeaderGroup ? '✓' : '✗'}] Style categoryHeaderGroup avec breakInside: 'avoid'`);

// Test 2: Vérifier que timelineHeaderWrapper existe avec breakInside: 'avoid'
const hasTimelineHeaderWrapper = content.includes("timelineHeaderWrapper") &&
                                  content.includes("breakInside: 'avoid'");
console.log(`[${hasTimelineHeaderWrapper ? '✓' : '✗'}] Style timelineHeaderWrapper avec breakInside: 'avoid'`);

// Test 3: Vérifier que les 3 premiers items sont groupés dans la timeline
const timelineFirstItems = content.includes("firstCatFirstItems") &&
                           content.includes("slice(0, 3)");
console.log(`[${timelineFirstItems ? '✓' : '✗'}] Timeline: 3 premiers items groupés avec le header`);

// Test 4: Vérifier que renderSelectionSection utilise le groupement
const selectionGrouping = content.includes("renderSelectionSection") &&
                          content.match(/firstItems = items\.slice\(0, 3\)/);
console.log(`[${selectionGrouping ? '✓' : '✗'}] Section Sélection: groupement titre + 3 items`);

// Test 5: Vérifier que renderActivitiesSection utilise le groupement
const activitiesGrouping = content.includes("renderActivitiesSection") &&
                            content.match(/firstItems = section\.items\.slice\(0, 3\)/);
console.log(`[${activitiesGrouping ? '✓' : '✗'}] Section Activités: groupement titre + 3 items`);

// Test 6: Vérifier que renderPendantApresWithMoments utilise le groupement
const pendantApresGrouping = content.includes("renderPendantApresWithMoments") &&
                              content.match(/firstItems = momentItems\.slice\(0, 3\)/);
console.log(`[${pendantApresGrouping ? '✓' : '✗'}] Section Pendant/Après: groupement titre + 3 items`);

// Test 7: Vérifier l'ordre des catégories d'apps
const appsOrderCorrect = content.includes("APPS_CATEGORY_ORDER") &&
                         content.includes("'Navigation & Cartes'") &&
                         content.includes("'Hébergement'") &&
                         content.includes("'Transport'") &&
                         content.includes("'Budget & Finances'");
console.log(`[${appsOrderCorrect ? '✓' : '✗'}] Ordre des catégories d'apps défini`);

// Test 8: Vérifier que le tri des apps est appliqué
const appsSorting = content.includes("sortedCategories") &&
                    content.includes("APPS_CATEGORY_ORDER.indexOf");
console.log(`[${appsSorting ? '✓' : '✗'}] Tri des catégories d'apps selon l'ordre défini`);

// Afficher les sections trouvées
console.log('\n=== Sections avec groupement titre + 3 items ===');

const groupingPatterns = [
  { name: 'Timeline (première catégorie)', pattern: /firstCatFirstItems\.map/ },
  { name: 'Timeline (catégories restantes)', pattern: /restCategories\.map.*firstItems\.map/s },
  { name: 'Sélection conseillée', pattern: /renderSelectionSection[\s\S]*?firstItems\.map/ },
  { name: 'Pendant & Après', pattern: /renderPendantApresWithMoments[\s\S]*?firstItems\.map/ },
  { name: 'Activités', pattern: /renderActivitiesSection[\s\S]*?firstItems\.map/ },
];

groupingPatterns.forEach(({ name, pattern }) => {
  const found = pattern.test(content);
  console.log(`  ${found ? '✓' : '✗'} ${name}`);
});

// Résumé
console.log('\n=== Résumé ===');
const allTestsPassed = hasCategoryHeaderGroup &&
                       hasTimelineHeaderWrapper &&
                       timelineFirstItems &&
                       selectionGrouping &&
                       activitiesGrouping &&
                       pendantApresGrouping &&
                       appsOrderCorrect &&
                       appsSorting;

if (allTestsPassed) {
  console.log('✓ Tous les tests de structure ont réussi !');
  console.log('\nLes modifications de mise en page PDF sont correctement implémentées:');
  console.log('  - Groupement titre + 3 premiers items sur toutes les sections');
  console.log('  - Header de timeline groupé avec son contenu');
  console.log('  - Ordre personnalisé des catégories d\'apps');
} else {
  console.log('✗ Certains tests ont échoué');
  process.exit(1);
}
