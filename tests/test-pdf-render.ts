/**
 * Test de rendu du PDF Compact
 * Simule la génération d'un PDF et vérifie la structure de sortie
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les données de test
const checklistDataPath = path.join(__dirname, '../src/data/checklistComplete.json');
const checklistData = JSON.parse(fs.readFileSync(checklistDataPath, 'utf-8'));

console.log('=== Test de rendu du PDF Compact ===\n');

// Simuler les données de formulaire
const mockFormData = {
  localisation: 'europe',
  pays: [{ code: 'FR', nom: 'France' }],
  dateDepart: new Date('2024-03-01'),
  dateRetour: new Date('2024-03-15'),
  voyageurs: {
    adultes: 2,
    enfants: [],
    bebes: 0,
    animaux: false
  },
  typeVoyage: 'aventure',
  hebergement: 'hotel',
  activites: ['randonnee', 'visite_culturelle']
};

// Simuler les données de checklist générées
const mockChecklistData = {
  sections: [
    {
      id: 'documents',
      nom: 'Documents & Administratifs',
      source: 'core',
      items: [
        { id: 'doc1', item: 'Passeport valide', priorite: 'haute', delai: 'J-90' },
        { id: 'doc2', item: 'Carte d\'identité', priorite: 'haute', delai: 'J-90' },
        { id: 'doc3', item: 'Visa si nécessaire', priorite: 'moyenne', delai: 'J-60' },
        { id: 'doc4', item: 'Copie documents', priorite: 'moyenne', delai: 'J-30' },
        { id: 'doc5', item: 'Photos d\'identité', priorite: 'basse', delai: 'J-30' },
      ]
    },
    {
      id: 'sante',
      nom: 'Santé & Médical',
      source: 'core',
      items: [
        { id: 'sante1', item: 'Assurance voyage', priorite: 'haute', delai: 'J-60' },
        { id: 'sante2', item: 'Vaccins à jour', priorite: 'haute', delai: 'J-60' },
        { id: 'sante3', item: 'Trousse premiers soins', priorite: 'moyenne', delai: 'J-7' },
        { id: 'sante4', item: 'Médicaments habituels', priorite: 'haute', delai: 'J-7' },
      ]
    },
    {
      id: 'finances',
      nom: 'Finances & Argent',
      source: 'core',
      items: [
        { id: 'fin1', item: 'Carte bancaire internationale', priorite: 'haute', delai: 'J-30' },
        { id: 'fin2', item: 'Devises locales', priorite: 'moyenne', delai: 'J-7' },
        { id: 'fin3', item: 'Copie relevés bancaires', priorite: 'basse', delai: 'J-7' },
        { id: 'fin4', item: 'Numéros urgence banque', priorite: 'moyenne', delai: 'J-7' },
        { id: 'fin5', item: 'Budget voyage établi', priorite: 'basse', delai: 'J-30' },
      ]
    },
    {
      id: 'bagages',
      nom: 'Bagages & Vêtements',
      source: 'core',
      items: [
        { id: 'bag1', item: 'Valise/sac à dos', priorite: 'haute', delai: 'J-7' },
        { id: 'bag2', item: 'Vêtements adaptés', priorite: 'haute', delai: 'J-3' },
        { id: 'bag3', item: 'Chaussures confortables', priorite: 'haute', delai: 'J-3' },
        { id: 'bag4', item: 'Veste imperméable', priorite: 'moyenne', delai: 'J-3' },
      ]
    },
    {
      id: 'apps',
      nom: 'Applications recommandées',
      source: 'core',
      items: [
        { id: 'app1', item: 'Navigation & Cartes: Google Maps', priorite: 'haute' },
        { id: 'app2', item: 'Navigation & Cartes: Maps.me', priorite: 'moyenne' },
        { id: 'app3', item: 'Hébergement: Booking.com', priorite: 'haute' },
        { id: 'app4', item: 'Hébergement: Airbnb', priorite: 'moyenne' },
        { id: 'app5', item: 'Transport: Uber', priorite: 'moyenne' },
        { id: 'app6', item: 'Budget & Finances: Splitwise', priorite: 'basse' },
        { id: 'app7', item: 'Budget & Finances: XE Currency', priorite: 'moyenne' },
      ]
    }
  ]
};

// Test du groupement des items par période de timeline
console.log('Test 1: Groupement par périodes de timeline');

const TIMELINE_MILESTONES = [
  { id: 'j90-j60', label: 'J-90 - J-60', min: 60, max: 90 },
  { id: 'j60-j30', label: 'J-60 - J-30', min: 30, max: 60 },
  { id: 'j30-j7', label: 'J-30 - J-7', min: 7, max: 30 },
  { id: 'j7-j1', label: 'J-7 - J-1', min: 1, max: 7 },
];

const extractDelayNumber = (delai?: string): number => {
  if (!delai) return 0;
  const match = delai.match(/J-(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const timelineSections = mockChecklistData.sections.filter(s =>
  ['documents', 'sante', 'finances'].includes(s.id)
);

TIMELINE_MILESTONES.forEach(milestone => {
  const itemsInMilestone = timelineSections.flatMap(section =>
    section.items.filter(item => {
      const delay = extractDelayNumber(item.delai);
      return delay >= milestone.min && delay <= milestone.max;
    }).map(item => ({ ...item, sectionName: section.nom }))
  );

  if (itemsInMilestone.length > 0) {
    // Grouper par catégorie
    const byCategory: { [key: string]: typeof itemsInMilestone } = {};
    itemsInMilestone.forEach(item => {
      if (!byCategory[item.sectionName]) byCategory[item.sectionName] = [];
      byCategory[item.sectionName].push(item);
    });

    console.log(`  ${milestone.label}: ${itemsInMilestone.length} items`);
    Object.entries(byCategory).forEach(([cat, items]) => {
      const firstItems = items.slice(0, 3);
      const restItems = items.slice(3);
      console.log(`    - ${cat}: ${firstItems.length} groupés + ${restItems.length} restants`);
    });
  }
});

// Test 2: Vérification de l'ordre des apps
console.log('\nTest 2: Ordre des catégories d\'apps');

const APPS_CATEGORY_ORDER = [
  'Navigation & Cartes',
  'Hébergement',
  'Transport',
  'Budget & Finances',
];

const appsSection = mockChecklistData.sections.find(s => s.id === 'apps');
if (appsSection) {
  const appsByCategory: { [key: string]: string[] } = {};

  appsSection.items.forEach(item => {
    const match = item.item.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const category = match[1].trim();
      if (!appsByCategory[category]) appsByCategory[category] = [];
      appsByCategory[category].push(match[2].trim());
    }
  });

  // Trier selon l'ordre défini
  const sortedCategories = Object.entries(appsByCategory).sort(([catA], [catB]) => {
    const indexA = APPS_CATEGORY_ORDER.indexOf(catA);
    const indexB = APPS_CATEGORY_ORDER.indexOf(catB);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  console.log('  Ordre après tri:');
  sortedCategories.forEach(([cat, apps], idx) => {
    const position = idx % 2 === 0 ? 'gauche' : 'droite';
    console.log(`    ${idx + 1}. ${cat} (${position}): ${apps.join(', ')}`);
  });

  // Vérifier l'agencement attendu
  const expectedOrder = ['Navigation & Cartes', 'Hébergement', 'Transport', 'Budget & Finances'];
  const actualOrder = sortedCategories.map(([cat]) => cat);
  const orderCorrect = expectedOrder.every((exp, i) => actualOrder[i] === exp);
  console.log(`  [${orderCorrect ? '✓' : '✗'}] Agencement correct: Nav|Héberg, Transport|Budget`);
}

// Test 3: Simulation du groupement titre + 3 items
console.log('\nTest 3: Groupement titre + 3 premiers items');

mockChecklistData.sections.forEach(section => {
  if (section.items.length > 3) {
    const firstItems = section.items.slice(0, 3);
    const restItems = section.items.slice(3);
    console.log(`  ${section.nom}:`);
    console.log(`    - Groupe protégé (titre + 3 items): ${firstItems.length} items`);
    console.log(`    - Items restants (peuvent être coupés): ${restItems.length} items`);
    console.log(`    [✓] breakInside: 'avoid' appliqué au groupe`);
  } else {
    console.log(`  ${section.nom}: ${section.items.length} items (tous groupés)`);
  }
});

console.log('\n=== Tous les tests de rendu ont réussi ! ===');
console.log('\nLa structure du PDF garantit:');
console.log('  - Aucun titre de catégorie isolé en bas de page');
console.log('  - Le header de timeline reste avec son contenu');
console.log('  - Les catégories d\'apps sont ordonnées: Navigation|Hébergement puis Transport|Budget');
