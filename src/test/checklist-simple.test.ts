import { describe, it, expect } from 'vitest';
import { generateCompleteChecklist } from '@/utils/checklistGenerator';
import { FormData } from '@/types/form';

/**
 * Tests simplifiés du générateur de checklist
 * Vérifie que la génération fonctionne correctement
 */

describe('Générateur de Checklist - Tests de non-régression', () => {
  describe('Génération de checklist', () => {
    it('devrait générer une checklist pour un voyage basique en France', () => {
      const formData: FormData = {
        nomVoyage: 'Voyage en France',
        dateDepart: '2025-06-01',
        dateRetour: '2025-06-07',
        duree: 'court',
        localisation: 'europe',
        pays: [{ code: 'FR', nom: 'France', nomEn: 'France', flag: '🇫🇷' }],
        temperature: ['chaude'],
        saison: ['ete'],
        conditionsClimatiques: [],
        activites: ['plage'],
        profil: 'solo',
        typeVoyage: 'flexible',
        confort: 'standard',
        nombreEnfants: 0,
        ageEnfants: [],
        formatFichier: 'pdf'
      };

      const checklist = generateCompleteChecklist(formData);

      expect(checklist).toBeDefined();
      expect(checklist.sections).toBeInstanceOf(Array);
      expect(checklist.sections.length).toBeGreaterThan(0);
    });

    it('devrait générer une checklist avec plusieurs destinations', () => {
      const formData: FormData = {
        nomVoyage: 'Tour d\'Europe',
        dateDepart: '2025-07-01',
        dateRetour: '2025-07-15',
        duree: 'moyen',
        localisation: 'europe',
        pays: [
          { code: 'FR', nom: 'France', nomEn: 'France', flag: '🇫🇷' },
          { code: 'ES', nom: 'Espagne', nomEn: 'Spain', flag: '🇪🇸' }
        ],
        temperature: ['chaude'],
        saison: ['ete'],
        conditionsClimatiques: [],
        activites: ['city-trip'],
        profil: 'couple',
        typeVoyage: 'flexible',
        confort: 'standard',
        nombreEnfants: 0,
        ageEnfants: [],
        formatFichier: 'pdf'
      };

      const checklist = generateCompleteChecklist(formData);

      expect(checklist).toBeDefined();
      expect(checklist.sections).toBeInstanceOf(Array);
    });

    it('chaque section générée devrait avoir un nom et des items', () => {
      const formData: FormData = {
        nomVoyage: 'Vacances d\'été',
        dateDepart: '2025-08-01',
        dateRetour: '2025-08-07',
        duree: 'court',
        localisation: 'europe',
        pays: [{ code: 'FR', nom: 'France', nomEn: 'France', flag: '🇫🇷' }],
        temperature: ['chaude'],
        saison: ['ete'],
        conditionsClimatiques: [],
        activites: ['plage'],
        profil: 'solo',
        typeVoyage: 'flexible',
        confort: 'standard',
        nombreEnfants: 0,
        ageEnfants: [],
        formatFichier: 'pdf'
      };

      const checklist = generateCompleteChecklist(formData);

      checklist.sections.forEach(section => {
        expect(section.nom).toBeDefined();
        expect(typeof section.nom).toBe('string');
        expect(section.items).toBeDefined();
        expect(Array.isArray(section.items)).toBe(true);
      });
    });

    it('chaque item devrait avoir un champ "item"', () => {
      const formData: FormData = {
        nomVoyage: 'Randonnée',
        dateDepart: '2025-09-01',
        dateRetour: '2025-09-07',
        duree: 'court',
        localisation: 'europe',
        pays: [{ code: 'FR', nom: 'France', nomEn: 'France', flag: '🇫🇷' }],
        temperature: ['temperee'],
        saison: ['automne'],
        conditionsClimatiques: [],
        activites: ['randonnee'],
        profil: 'solo',
        typeVoyage: 'flexible',
        confort: 'standard',
        nombreEnfants: 0,
        ageEnfants: [],
        formatFichier: 'pdf'
      };

      const checklist = generateCompleteChecklist(formData);

      checklist.sections.forEach(section => {
        section.items.forEach(item => {
          expect(item.item).toBeDefined();
          expect(typeof item.item).toBe('string');
          expect(item.item.length).toBeGreaterThan(0);
        });
      });
    });

    it('devrait générer une checklist pour voyage hivernal', () => {
      const formData: FormData = {
        nomVoyage: 'Ski en Suisse',
        dateDepart: '2025-12-15',
        dateRetour: '2025-12-22',
        duree: 'court',
        localisation: 'europe',
        pays: [{ code: 'CH', nom: 'Suisse', nomEn: 'Switzerland', flag: '🇨🇭' }],
        temperature: ['tres-froide'],
        saison: ['hiver'],
        conditionsClimatiques: ['climat_neige'],
        activites: ['sports-hiver'],
        profil: 'solo',
        typeVoyage: 'flexible',
        confort: 'standard',
        nombreEnfants: 0,
        ageEnfants: [],
        formatFichier: 'pdf'
      };

      const checklist = generateCompleteChecklist(formData);

      expect(checklist).toBeDefined();
      expect(checklist.sections.length).toBeGreaterThan(0);
    });
  });
});
