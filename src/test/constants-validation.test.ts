import { describe, it, expect } from 'vitest';
import { LIMITS, DATE_LIMITS, SPECIAL_CONDITIONS, SPECIAL_LOCATIONS, ESSENTIAL_SECTIONS, PATTERNS, DURATION_THRESHOLDS } from '@/constants/validation';
import { SPACING, BORDER_RADIUS, FONT_SIZE, DIMENSIONS, BORDER_WIDTH } from '@/constants/theme';
import { ANIMATION_DELAYS, ANIMATION_DURATIONS, KEYFRAMES, TIMEOUTS } from '@/constants/animations';
import { DURATION_LABELS, DURATION_LABELS_SHORT, DURATION_ESTIMATES, DURATION_VALUES, AGE_GROUPS, AGE_GROUP_VALUES, TEMPERATURE_ALL, SEASON_ALL, PRIORITY_LABELS, LOCALE_FR, STEP_TITLES } from '@/constants/formats';
import { ERROR_MESSAGES, PLACEHOLDERS, TITLES, GRADIENT_STYLES } from '@/constants/messages';
import { PDF_COLORS, PDF_BORDERS, PDF_SPACING, PDF_FONT_SIZES, PDF_DIMENSIONS, UNICODE_EMOJI_RANGES } from '@/constants/pdf';
import { DEFAULT_FORM_DATA } from '@/config/defaults';

/**
 * Tests de validation des constantes centralisées
 * Vérifie que toutes les constantes sont accessibles et ont les bonnes valeurs
 */

describe('Constantes de validation', () => {
  it('LIMITS devrait contenir les limites correctes', () => {
    expect(LIMITS.countries.default).toBe(3);
    expect(LIMITS.countries.multiDestinations).toBe(10);
    expect(LIMITS.children.min).toBe(1);
    expect(LIMITS.children.max).toBe(99);
    expect(LIMITS.climateConditions.max).toBe(5);
  });

  it('SPECIAL_CONDITIONS devrait contenir les valeurs spéciales', () => {
    expect(SPECIAL_CONDITIONS.none).toBe('climat_aucune');
    expect(SPECIAL_CONDITIONS.unknown).toBe('inconnue');
  });

  it('ESSENTIAL_SECTIONS devrait contenir les sections essentielles', () => {
    expect(ESSENTIAL_SECTIONS).toContain('documents');
    expect(ESSENTIAL_SECTIONS).toContain('finances');
    expect(ESSENTIAL_SECTIONS).toContain('sante');
    expect(ESSENTIAL_SECTIONS.length).toBe(3);
  });

  it('PATTERNS.email devrait être une regex valide', () => {
    expect(PATTERNS.email).toBeInstanceOf(RegExp);
    expect('test@example.com').toMatch(PATTERNS.email);
    expect('invalid-email').not.toMatch(PATTERNS.email);
  });
});

describe('Constantes de thème', () => {
  it('DIMENSIONS devrait contenir les dimensions correctes', () => {
    expect(DIMENSIONS.checkbox.width).toBe(8);
    expect(DIMENSIONS.checkbox.height).toBe(8);
    expect(DIMENSIONS.pdf.previewHeight).toBe(600);
  });

  it('SPACING devrait contenir les espacements', () => {
    expect(DIMENSIONS.button.heightSm).toBeDefined();
    expect(DIMENSIONS.button.heightMd).toBeDefined();
  });
});

describe('Constantes d\'animation', () => {
  it('ANIMATION_DELAYS devrait contenir les délais', () => {
    expect(ANIMATION_DELAYS.short).toBe('0.1s');
    expect(ANIMATION_DELAYS.medium).toBe('0.2s');
  });

  it('TIMEOUTS.retryDelay devrait être de 1000ms', () => {
    expect(TIMEOUTS.retryDelay).toBe(1000);
  });
});

describe('Constantes de formats', () => {
  it('DURATION_VALUES devrait contenir toutes les durées', () => {
    expect(DURATION_VALUES).toContain('court');
    expect(DURATION_VALUES).toContain('moyen');
    expect(DURATION_VALUES).toContain('long');
    expect(DURATION_VALUES).toContain('tres-long');
  });

  it('AGE_GROUPS devrait contenir tous les groupes d\'âge', () => {
    expect(AGE_GROUPS['0-2-ans']).toBe('0-2 ans');
    expect(AGE_GROUPS['3-5-ans']).toBe('3-5 ans');
    expect(AGE_GROUPS['6-12-ans']).toBe('6-12 ans');
    expect(AGE_GROUPS['13+-ans']).toBe('13+ ans');
  });

  it('STEP_TITLES devrait contenir tous les titres d\'étapes', () => {
    expect(STEP_TITLES).toHaveLength(6);
    expect(STEP_TITLES).toContain('Destination');
    expect(STEP_TITLES).toContain('Checkout');
  });
});

describe('Constantes de messages', () => {
  it('ERROR_MESSAGES devrait contenir tous les messages d\'erreur', () => {
    expect(ERROR_MESSAGES.maxCountriesPerZone).toContain('3 pays');
    expect(ERROR_MESSAGES.missingNameAndZone).toBeDefined();
    expect(ERROR_MESSAGES.exclusiveUnknown).toBeDefined();
  });

  it('PLACEHOLDERS devrait contenir tous les placeholders', () => {
    expect(PLACEHOLDERS.tripName).toBeDefined();
    expect(PLACEHOLDERS.firstName).toBe('Jack');
    expect(PLACEHOLDERS.email).toBe('jack.williams@email.com');
  });

  it('TITLES devrait contenir les titres principaux', () => {
    expect(TITLES.app).toBe('TravelPrep');
    expect(TITLES.tagline).toBeDefined();
  });
});

describe('Constantes PDF', () => {
  it('PDF_SPACING devrait contenir les espacements PDF', () => {
    expect(PDF_SPACING.contentPadding).toBe(30);
    expect(PDF_SPACING.sectionPadding).toBe(15);
  });

  it('PDF_FONT_SIZES devrait contenir les tailles de police', () => {
    expect(PDF_FONT_SIZES.small).toBe(9);
    expect(PDF_FONT_SIZES.title).toBe(18);
  });

  it('UNICODE_EMOJI_RANGES devrait contenir les ranges', () => {
    expect(UNICODE_EMOJI_RANGES.length).toBeGreaterThan(0);
  });
});

describe('Configuration par défaut', () => {
  it('DEFAULT_FORM_DATA devrait être un objet FormData valide', () => {
    expect(DEFAULT_FORM_DATA).toBeDefined();
    expect(DEFAULT_FORM_DATA.nomVoyage).toBe('');
    expect(DEFAULT_FORM_DATA.duree).toBe('moyen');
    expect(DEFAULT_FORM_DATA.localisation).toBe('multi-destinations');
  });

  it('DEFAULT_FORM_DATA devrait utiliser les constantes', () => {
    expect(DEFAULT_FORM_DATA.localisation).toBe(SPECIAL_LOCATIONS.multiDestinations);
    expect(DEFAULT_FORM_DATA.temperature).toContain(SPECIAL_CONDITIONS.unknown);
    expect(DEFAULT_FORM_DATA.sectionsInclure).toEqual([...ESSENTIAL_SECTIONS]);
  });
});
