/**
 * Palette de couleurs centralisée pour TravelPrep
 *
 * Ce fichier définit toutes les couleurs utilisées dans l'application.
 * Pour les composants React-PDF qui ne supportent pas les variables CSS,
 * utilisez ces constantes.
 *
 * Pour les composants DOM normaux, préférez les variables CSS définies dans index.css
 */

// ============================================================================
// COULEURS DE LA MARQUE DAREVIZ
// ============================================================================

export const COLORS = {
  // Orange principal
  primary: '#C54616',
  primaryDark: '#d85e20',
  primaryHover: '#d85e20',

  // Crème/Backgrounds chauds
  cream: '#FFF7ED',
  creamLight: '#FFF5F0',
  creamVeryLight: '#FEF3F0',
  creamDareviz: '#f9f0de',

  // Blanc
  white: '#FFFFFF',

  // ============================================================================
  // PALETTE DE GRIS SIMPLIFIÉE (7 couleurs au lieu de 13)
  // ============================================================================

  // Texte (4 niveaux)
  text: {
    primary: '#111827',    // gray-900 - Texte principal (remplace #111827, #1F2937)
    secondary: '#374151',  // gray-700 - Texte secondaire (remplace #374151, #616161)
    tertiary: '#6b7280',   // gray-500 - Texte tertiaire (remplace #6b7280, #6B7280, #666, #888)
    muted: '#9ca3af',      // gray-400 - Texte désactivé/placeholder
  },

  // Fonds et bordures (3 niveaux)
  background: {
    subtle: '#f9fafb',     // gray-50 - Fond très léger
    light: '#F5F5F5',      // gray-100 - Fond léger (Dareviz)
  },

  border: {
    gray: '#e5e7eb',       // gray-200 - Bordures (remplace #e5e7eb, #CCCCCC, #ccc)
  },

  // ============================================================================
  // COULEURS D'ÉTAT
  // ============================================================================

  // Rouge pour alertes et haute priorité
  red: '#DC2626',
  redIcon: '#ef4444',

  // Jaune/Ambre pour accents
  amber: '#fbb041',
  brown: '#78350F',

  // Autres couleurs (pour chart.tsx, logos React, etc.)
  chartGray: '#ccc',
  reactBlue: '#646cff',
  reactCyan: '#61dafb',
} as const;

// Export des alias pour rétrocompatibilité
export const PRIMARY_COLOR = COLORS.primary;
export const WHITE = COLORS.white;

// Export de types pour TypeScript
export type ColorPalette = typeof COLORS;
