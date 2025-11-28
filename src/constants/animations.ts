/**
 * Animation constants for delays, durations, and keyframes
 */

export const ANIMATION_DELAYS = {
  short: '0.1s',
  medium: '0.2s',
} as const;

export const ANIMATION_DURATIONS = {
  accordionDown: '0.2s ease-out',
  accordionUp: '0.2s ease-out',
  fadeIn: '0.5s ease-out',
  slideUp: '0.6s ease-out',
  scaleIn: '0.3s ease-out',
  logoSpin: 'infinite 20s linear',
} as const;

export const KEYFRAMES = {
  fadeIn: {
    from: { opacity: '0', transform: 'translateY(10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  slideUp: {
    from: { opacity: '0', transform: 'translateY(20px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  scaleIn: {
    from: { opacity: '0', transform: 'scale(0.95)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
} as const;

export const TIMEOUTS = {
  retryDelay: 1000, // 1 second
} as const;
