import { FormData, Localisation } from '@/types/form';
import referenceData from '@/data/reference-data.json';
import { getAllLocalisationsSync } from './locationLoader';

// Charger toutes les localisations de manière synchrone
const localisations = getAllLocalisationsSync();

export const getLocalisationLabel = (code: string): string => {
  const loc = localisations[code as Localisation];
  return loc?.nom || code;
};

export const getPaysOptions = (localisation: string) => {
  if (!localisation) return [];

  // Pour multi-destinations, retourner TOUS les pays de TOUTES les zones
  if (localisation === 'multi-destinations') {
    // Fusionner tous les pays de toutes les zones géographiques
    const allPays = Object.values(localisations)
      .flatMap((loc) => loc.pays || []);

    // Trier par ordre alphabétique et dédupliquer par code
    const uniquePays = Array.from(
      new Map(allPays.map(p => [p.code, p])).values()
    ).sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

    return uniquePays;
  }

  const loc = localisations[localisation as Localisation];
  return loc?.pays || [];
};

export const calculateDuree = (dateDepart: string, dateRetour: string): FormData['duree'] => {
  const start = new Date(dateDepart);
  const end = new Date(dateRetour);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days <= 7) return 'court';
  if (days <= 21) return 'moyen';
  if (days <= 90) return 'long';
  return 'tres-long';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

export const calculateDeadline = (dateDepart: string, delai: string): string => {
  const departDate = new Date(dateDepart);
  const jValue = parseInt(delai.replace('J-', '').replace('J+', ''));

  if (delai.startsWith('J-')) {
    departDate.setDate(departDate.getDate() - jValue);
  } else if (delai.startsWith('J+')) {
    departDate.setDate(departDate.getDate() + jValue);
  }

  return formatDate(departDate.toISOString());
};

// Exporter les données de référence (sans les localisations)
export { referenceData as checklistData };

// Exporter aussi les localisations pour compatibilité
export { localisations };
