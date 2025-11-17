/**
 * Icônes optimisées pour le PDF (SVG en data URI)
 * Basées sur lucide-react, converties en SVG inline pour @react-pdf/renderer
 */

// Couleur principale pour les icônes
const ICON_COLOR = '#E85D2A';
const ICON_SIZE = 12;

/**
 * Crée un data URI SVG optimisé pour @react-pdf/renderer
 */
const createSvgDataUri = (pathData: string, viewBox = '0 0 24 24', customColor?: string): string => {
  const strokeColor = customColor || ICON_COLOR;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${viewBox}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${pathData}</svg>`;
  // Utiliser btoa() pour encoder en base64 (compatible navigateur)
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Collection d'icônes pour le PDF
 * Chaque icône est un SVG encodé en data URI pour un rendu parfait
 */
export const PDF_ICONS = {
  // Dates et temps
  calendar: createSvgDataUri('<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>'),

  // Destinations
  globe: createSvgDataUri('<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),

  mapPin: createSvgDataUri('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),

  map: createSvgDataUri('<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>'),

  // Saisons et météo
  leaf: createSvgDataUri('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>'),

  sun: createSvgDataUri('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'),

  thermometer: createSvgDataUri('<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>'),

  cloud: createSvgDataUri('<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'),

  cloudRain: createSvgDataUri('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>'),

  snowflake: createSvgDataUri('<line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>'),

  // Profil et personnes
  user: createSvgDataUri('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),

  users: createSvgDataUri('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),

  baby: createSvgDataUri('<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>'),

  // Activités
  activity: createSvgDataUri('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),

  sparkles: createSvgDataUri('<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>'),

  target: createSvgDataUri('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),

  // Voyage
  plane: createSvgDataUri('<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),

  planeTakeoff: createSvgDataUri('<path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 12 2l.68.42a2 2 0 0 1 .91 1.68V8a2 2 0 0 0 .75 1.56L21 15.5"/>'),

  // Confort
  bed: createSvgDataUri('<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>'),

  hotel: createSvgDataUri('<path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/>'),

  star: createSvgDataUri('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),

  // Conseils et infos
  lightbulb: createSvgDataUri('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),

  info: createSvgDataUri('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),

  alertCircle: createSvgDataUri('<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>'),

  checkCircle: createSvgDataUri('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),

  // Navigation
  arrowRight: createSvgDataUri('<line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/>'),

  clock: createSvgDataUri('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),

  // Catégories spécifiques
  mountain: createSvgDataUri('<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>'),

  palmtree: createSvgDataUri('<path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h11Z"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-11Z"/><path d="M5.89 9 3 21.89"/><path d="M12 12v8"/>'),

  umbrella: createSvgDataUri('<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>'),

  compass: createSvgDataUri('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>'),

  backpack: createSvgDataUri('<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/><path d="M8 10h8"/><path d="M8 18h8"/>'),

  // Priorité haute
  flame: createSvgDataUri('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>', '0 0 24 24', '#ef4444'),
};

/**
 * Mapping des emojis vers les icônes PDF
 * Permet une transition facile des emojis existants vers les icônes
 */
export const EMOJI_TO_ICON: Record<string, keyof typeof PDF_ICONS> = {
  '📅': 'calendar',
  '🌍': 'globe',
  '🗺️': 'map',
  '🍂': 'leaf',
  '🌡️': 'thermometer',
  '☁️': 'cloud',
  '👤': 'user',
  '🎭': 'activity',
  '✈️': 'plane',
  '🛏️': 'bed',
  '💡': 'lightbulb',
  '⛰️': 'mountain',
  '🏖️': 'palmtree',
  '☀️': 'sun',
  '❄️': 'snowflake',
  '🌧️': 'cloudRain',
  '👥': 'users',
  '🎯': 'target',
  '⭐': 'star',
  '🏨': 'hotel',
  '🎒': 'backpack',
};

/**
 * Récupère l'icône correspondant à un emoji
 */
export const getIconForEmoji = (emoji: string): string | null => {
  const iconKey = EMOJI_TO_ICON[emoji];
  return iconKey ? PDF_ICONS[iconKey] : null;
};

/**
 * Récupère une icône par son nom
 */
export const getIcon = (iconName: keyof typeof PDF_ICONS): string => {
  return PDF_ICONS[iconName];
};
