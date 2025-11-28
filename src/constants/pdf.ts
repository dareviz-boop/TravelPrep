/**
 * PDF-specific constants for styling and layout
 */

import { COLORS } from '../utils/colors';

export const PDF_COLORS = {
  primary: COLORS.primary,
  creamBg: COLORS.creamDareviz,
  amberBorder: COLORS.amber,
  brownText: COLORS.brown,
  lightBg: COLORS.creamLight,
} as const;

export const PDF_BORDERS = {
  section: {
    bottom: `2px solid ${COLORS.primary}`,
    bottomThick: `3px solid ${COLORS.primary}`,
  },
  accent: {
    left: `4px solid ${COLORS.primary}`,
    leftAmber: `4px solid ${COLORS.amber}`,
  },
  info: {
    standard: `1px solid ${COLORS.border.gray}`,
  },
} as const;

export const PDF_SPACING = {
  contentPadding: 30,
  sectionPadding: 15,
  itemMarginBottom: 14,
  titleMarginBottom: 8,
  sectionPaddingBottom: 10,
} as const;

export const PDF_FONT_SIZES = {
  small: 9,
  medium: 10,
  base: 11,
  large: 14,
  title: 18,
} as const;

export const PDF_DIMENSIONS = {
  iconWidth: 80,
  checkboxSize: 8,
  borderRadius: 4,
} as const;

export const UNICODE_EMOJI_RANGES = [
  '\\u{1F300}-\\u{1F6FF}', // Miscellaneous Symbols and Pictographs
  '\\u{1F900}-\\u{1F9FF}', // Supplemental Symbols and Pictographs
  '\\u{1FA70}-\\u{1FAFF}', // Symbols and Pictographs Extended-A
  '\\u{2600}-\\u{26FF}',   // Miscellaneous Symbols
  '\\u{2700}-\\u{27BF}',   // Dingbats
  '\\u{1F1E0}-\\u{1F1FF}', // Regional Indicator Symbols (flags)
  '\\u{1F680}-\\u{1F6FF}', // Transport and Map Symbols
  '\\u{2300}-\\u{23FF}',   // Miscellaneous Technical
  '\\u{2B50}',             // Star
  '\\u{FE0F}',             // Variation Selector-16
  '\\u{200D}',             // Zero Width Joiner
  '\\u{20E3}',             // Combining Enclosing Keycap
] as const;
