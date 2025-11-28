/**
 * Theme constants for dimensions, spacings, and layout
 */

export const SPACING = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 15,
  xl: 30,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
} as const;

export const FONT_SIZE = {
  xs: 9,
  sm: 10,
  md: 11,
  base: 14,
  lg: 18,
} as const;

export const DIMENSIONS = {
  checkbox: {
    width: 8,
    height: 8,
  },
  icon: {
    width: 80,
  },
  pdf: {
    previewHeight: 600,
  },
  button: {
    heightSm: 'h-12',
    heightMd: 'h-14',
  },
  progressBar: {
    circle: 'w-10 h-10',
    ring: 'ring-4',
    bar: 'h-1',
  },
  margins: {
    xl: 'mb-12',
  },
} as const;

export const BORDER_WIDTH = {
  thin: '1px',
  medium: '2px',
  thick: '3px',
  extraThick: '4px',
} as const;
