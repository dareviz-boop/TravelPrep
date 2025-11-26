import { describe, it, expect } from 'vitest';

/**
 * Tests de validation des regex
 * Vérifie que les regex simplifiées fonctionnent correctement
 */

describe('Validation des Regex', () => {
  describe('Normalisation de texte', () => {
    it('devrait normaliser correctement les accents', () => {
      const testCases = [
        { input: 'café', expected: 'cafe' },
        { input: 'hôtel', expected: 'hotel' },
        { input: 'naïf', expected: 'naif' },
        { input: 'Île', expected: 'ile' },
        { input: 'São Paulo', expected: 'sao paulo' }
      ];

      testCases.forEach(({ input, expected }) => {
        const normalized = input
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        expect(normalized).toBe(expected);
      });
    });

    it('devrait normaliser les espaces multiples', () => {
      const testCases = [
        'appareil  photo',
        'sac    à    dos',
        'carte   bancaire'
      ];

      testCases.forEach(input => {
        const normalized = input.replace(/\s+/g, ' ').trim();
        expect(normalized).not.toMatch(/\s{2,}/);
      });
    });

    it('devrait normaliser les caractères spéciaux', () => {
      const text = 'appareil-photo / camera (numérique)';
      const normalized = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      expect(normalized).toBe('appareil photo camera numerique');
    });
  });

  describe('Patterns de correspondance', () => {
    it('devrait détecter "appareil photo" et ses variantes', () => {
      const pattern = /appareil\s*photo|camera\s*photo/i;

      expect('Appareil photo').toMatch(pattern);
      expect('appareil photo compact').toMatch(pattern);
      expect('Camera photo numérique').toMatch(pattern);
      expect('Mon nouvel appareil  photo').toMatch(pattern);
    });

    it('devrait détecter "batterie externe" et ses variantes', () => {
      const pattern = /batterie\s*externe|power\s*bank|powerbank/i;

      expect('Batterie externe').toMatch(pattern);
      expect('PowerBank 20000mAh').toMatch(pattern);
      expect('Power bank USB-C').toMatch(pattern);
    });

    it('devrait détecter "sac à dos" et ses variantes', () => {
      const pattern = /sac\s*(?:a|à)\s*dos|backpack/i;

      expect('Sac à dos de voyage').toMatch(pattern);
      expect('Sac a dos 40L').toMatch(pattern);
      expect('Backpack randonnée').toMatch(pattern);
    });

    it('devrait détecter "crème solaire" et ses variantes', () => {
      const pattern = /cr[eè]me\s*solaire|protection\s*solaire|[eé]cran\s*solaire/i;

      expect('Crème solaire SPF 50').toMatch(pattern);
      expect('Protection solaire visage').toMatch(pattern);
      expect('Écran solaire waterproof').toMatch(pattern);
    });

    it('ne devrait PAS confondre des items similaires mais différents', () => {
      // Casque vélo vs casque ski - doivent être différents
      const casqueVelo = 'Casque vélo route';
      const casqueSki = 'Casque ski alpin';

      expect(casqueVelo).not.toBe(casqueSki);
      expect(casqueVelo.includes('vélo')).toBe(true);
      expect(casqueSki.includes('ski')).toBe(true);
    });

    it('ne devrait PAS confondre les médicaments différents', () => {
      const medicaments = [
        'Paracétamol',
        'Ibuprofène',
        'Aspirine',
        'Doliprane'
      ];

      // Chaque médicament est unique
      medicaments.forEach((med1, i) => {
        medicaments.forEach((med2, j) => {
          if (i !== j && med1 !== 'Doliprane' && med2 !== 'Paracétamol') {
            // Doliprane et Paracétamol sont le même principe actif
            expect(med1).not.toBe(med2);
          }
        });
      });
    });
  });

  describe('Patterns de filtrage', () => {
    it('devrait filtrer les items par priorité', () => {
      const items = [
        { nom: 'Passeport', priorite: 'essentiel' },
        { nom: 'Guide voyage', priorite: 'important' },
        { nom: 'Livre', priorite: 'optionnel' }
      ];

      const essentiels = items.filter(i => i.priorite === 'essentiel');
      expect(essentiels.length).toBe(1);
      expect(essentiels[0].nom).toBe('Passeport');
    });

    it('devrait filtrer par plusieurs critères', () => {
      const items = [
        { nom: 'Veste imperméable', categorie: 'vetements', saison: 'hiver' },
        { nom: 'T-shirt', categorie: 'vetements', saison: 'ete' },
        { nom: 'Batterie externe', categorie: 'tech', saison: null }
      ];

      const vetementsHiver = items.filter(
        i => i.categorie === 'vetements' && i.saison === 'hiver'
      );
      expect(vetementsHiver.length).toBe(1);
      expect(vetementsHiver[0].nom).toBe('Veste imperméable');
    });
  });

  describe('Patterns de validation', () => {
    it('devrait valider les codes pays (ISO 3166-1 alpha-2)', () => {
      const validCodes = ['FR', 'US', 'JP', 'BR', 'AU'];
      const invalidCodes = ['FRA', 'USA', 'f', 'fr', '12', ''];

      const pattern = /^[A-Z]{2}$/;

      validCodes.forEach(code => {
        expect(code).toMatch(pattern);
      });

      invalidCodes.forEach(code => {
        expect(code).not.toMatch(pattern);
      });
    });

    it('devrait valider les IDs alphanumériques avec tirets', () => {
      const pattern = /^[a-z0-9-]+$/;

      expect('randonnee').toMatch(pattern);
      expect('sports-hiver').toMatch(pattern);
      expect('city-trip').toMatch(pattern);
      expect('activite-123').toMatch(pattern);

      expect('Sport Hiver').not.toMatch(pattern);
      expect('activité').not.toMatch(pattern);
      expect('').not.toMatch(pattern);
    });

    it('devrait extraire les nombres d\'un texte', () => {
      const pattern = /\d+/g;

      expect('SPF 50'.match(pattern)).toEqual(['50']);
      expect('20000mAh'.match(pattern)).toEqual(['20000']);
      expect('Température -10°C à +30°C'.match(pattern)).toEqual(['10', '30']);
    });

    it('devrait détecter les emojis', () => {
      const hasEmoji = (text: string) => {
        // Pattern simplifié pour détecter les emojis communs
        const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
        return emojiPattern.test(text);
      };

      expect(hasEmoji('Plage 🏖️')).toBe(true);
      expect(hasEmoji('Randonnée ⛰️')).toBe(true);
      expect(hasEmoji('Simple texte')).toBe(false);
    });
  });

  describe('Patterns de nettoyage', () => {
    it('devrait supprimer les balises HTML', () => {
      const html = '<p>Texte <strong>important</strong></p>';
      const cleaned = html.replace(/<[^>]*>/g, '');
      expect(cleaned).toBe('Texte important');
    });

    it('devrait nettoyer les espaces en début et fin', () => {
      const texts = [
        '  texte  ',
        '\n\tpasseport\t\n',
        '   appareil photo   '
      ];

      texts.forEach(text => {
        expect(text.trim()).not.toMatch(/^\s|\s$/);
      });
    });

    it('devrait normaliser les tirets et apostrophes', () => {
      const testCases = [
        { input: 'K-way', normalized: 'kway' },
        { input: "Sac à dos", normalized: 'sac a dos' },
        { input: 'Anti-moustiques', normalized: 'antimoustiques' }
      ];

      testCases.forEach(({ input, normalized }) => {
        const result = input
          .toLowerCase()
          .replace(/[-']/g, '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ');

        expect(result).toContain(normalized.replace(/\s+/g, ' '));
      });
    });
  });

  describe('Performance des regex', () => {
    it('ne devrait pas avoir de catastrophic backtracking', () => {
      // Test avec une chaîne longue pour vérifier qu'il n'y a pas de regex inefficaces
      const longString = 'a'.repeat(1000) + 'b';
      const safePattern = /^a+b$/;

      const start = Date.now();
      safePattern.test(longString);
      const duration = Date.now() - start;

      // Devrait être très rapide (< 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('devrait gérer efficacement les recherches multiples', () => {
      const items = Array(1000).fill('Appareil photo numérique');
      const pattern = /appareil\s*photo/i;

      const start = Date.now();
      items.forEach(item => pattern.test(item));
      const duration = Date.now() - start;

      // Devrait traiter 1000 items rapidement (< 50ms)
      expect(duration).toBeLessThan(50);
    });
  });
});
