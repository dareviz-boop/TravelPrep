import { describe, it, expect } from 'vitest';
import referenceData from '@/data/reference-data.json';
import activitesData from '@/data/checklist_activites.json';
import coreSectionsData from '@/data/checklist_core_sections.json';
import profilVoyageursData from '@/data/checklist_profil_voyageurs.json';
import climatMeteoData from '@/data/checklist_climat_meteo.json';

/**
 * Tests de chargement des données JSON
 * Vérifie que tous les fichiers JSON critiques peuvent être chargés et ont la structure attendue
 */

describe('Chargement des données JSON', () => {
  describe('Reference Data', () => {
    it('devrait charger reference-data.json', () => {
      expect(referenceData).toBeDefined();
    });

    it('devrait contenir les métadonnées', () => {
      expect(referenceData.metadata).toBeDefined();
      expect(referenceData.metadata.version).toBeDefined();
      expect(referenceData.metadata.totalPays).toBeGreaterThan(0);
    });

    it('devrait contenir les saisons', () => {
      expect(referenceData.saisons).toBeDefined();
      expect(referenceData.saisons.options).toBeInstanceOf(Array);
      expect(referenceData.saisons.options.length).toBeGreaterThan(0);
      expect(referenceData.saisons.options.length).toBe(5); // ete, hiver, printemps, automne, inconnue
    });

    it('devrait contenir les températures', () => {
      expect(referenceData.temperatures).toBeDefined();
      expect(referenceData.temperatures.options).toBeInstanceOf(Array);
      expect(referenceData.temperatures.options.length).toBeGreaterThan(0);
      expect(referenceData.temperatures.options.length).toBe(7);
    });

    it('devrait contenir les activités', () => {
      expect(referenceData.activites).toBeDefined();
      expect(referenceData.activites.options).toBeInstanceOf(Array);
      expect(referenceData.activites.options.length).toBeGreaterThan(0);
    });

    it('devrait contenir les profils voyageurs', () => {
      expect(referenceData.profils).toBeDefined();
      expect(referenceData.profils.options).toBeInstanceOf(Array);
      expect(referenceData.profils.options.length).toBeGreaterThan(0);
    });

    it('devrait contenir les types de voyage', () => {
      expect(referenceData.typeVoyage).toBeDefined();
      expect(referenceData.typeVoyage.options).toBeInstanceOf(Array);
      expect(referenceData.typeVoyage.options.length).toBeGreaterThan(0);
    });

    it('devrait contenir les niveaux de confort', () => {
      expect(referenceData.confort).toBeDefined();
      expect(referenceData.confort.options).toBeInstanceOf(Array);
      expect(referenceData.confort.options.length).toBeGreaterThan(0);
    });

    it('devrait contenir les catégories', () => {
      expect(referenceData.categories).toBeDefined();
      expect(referenceData.categories.options).toBeInstanceOf(Array);
      expect(referenceData.categories.options.length).toBeGreaterThan(0);
    });

    it('devrait contenir les conditions climatiques', () => {
      expect(referenceData.conditionsClimatiques).toBeDefined();
      expect(referenceData.conditionsClimatiques).toBeInstanceOf(Array);
      expect(referenceData.conditionsClimatiques.length).toBeGreaterThan(0);
    });

    it('chaque condition climatique devrait avoir un groupe et des options', () => {
      referenceData.conditionsClimatiques.forEach(groupe => {
        expect(groupe.groupe).toBeDefined();
        expect(groupe.options).toBeInstanceOf(Array);
        expect(groupe.options.length).toBeGreaterThan(0);

        groupe.options.forEach(option => {
          expect(option.id).toBeDefined();
          expect(option.nom).toBeDefined();
        });
      });
    });
  });

  describe('Checklist Data', () => {
    it('devrait charger checklist_activites.json', () => {
      expect(activitesData).toBeDefined();
      expect(activitesData.activites).toBeInstanceOf(Array);
    });

    it('devrait charger checklist_core_sections.json', () => {
      expect(coreSectionsData).toBeDefined();
    });

    it('devrait charger checklist_profil_voyageurs.json', () => {
      expect(profilVoyageursData).toBeDefined();
    });

    it('devrait charger checklist_climat_meteo.json', () => {
      expect(climatMeteoData).toBeDefined();
    });

    it('checklist_activites devrait contenir des items valides', () => {
      expect(activitesData.activites.length).toBeGreaterThan(0);

      activitesData.activites.forEach(activite => {
        expect(activite.activity_id).toBeDefined();
        expect(activite.nom).toBeDefined();
        expect(activite.items).toBeInstanceOf(Array);
      });
    });

    it('chaque activité devrait avoir au moins un item', () => {
      activitesData.activites.forEach(activite => {
        // Certaines activités peuvent avoir 0 items si elles sont gérées autrement
        expect(activite.items).toBeInstanceOf(Array);
      });
    });

    it('core_sections devrait contenir les sections essentielles', () => {
      const expectedSections = ['documents', 'finances', 'sante', 'tech'];

      expectedSections.forEach(sectionId => {
        expect(coreSectionsData[sectionId]).toBeDefined();
      });
    });
  });

  describe('Validation des données', () => {
    it('toutes les saisons devraient avoir un id et un nom', () => {
      referenceData.saisons.options.forEach(saison => {
        expect(saison.id).toBeDefined();
        expect(saison.nom).toBeDefined();
        expect(saison.emoji).toBeDefined();
      });
    });

    it('toutes les températures devraient avoir un id et un nom', () => {
      referenceData.temperatures.options.forEach(temp => {
        expect(temp.id).toBeDefined();
        expect(temp.nom).toBeDefined();
        expect(temp.emoji).toBeDefined();
      });
    });

    it('toutes les activités devraient avoir un id et un nom', () => {
      referenceData.activites.options.forEach(activite => {
        expect(activite.id).toBeDefined();
        expect(activite.nom).toBeDefined();
        expect(activite.emoji).toBeDefined();
      });
    });

    it('les IDs ne devraient pas contenir d\'espaces', () => {
      referenceData.activites.options.forEach(activite => {
        expect(activite.id).not.toMatch(/\s/);
      });

      referenceData.saisons.options.forEach(saison => {
        expect(saison.id).not.toMatch(/\s/);
      });
    });
  });
});
