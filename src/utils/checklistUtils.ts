import { FormData } from '@/types/form';
import checklistData from '@/data/checklistComplete.json';

export const getLocalisationLabel = (code: string): string => {
  const loc = checklistData.localisations[code as keyof typeof checklistData.localisations];
  return loc?.nom || code;
};

export const getPaysOptions = (localisation: string) => {
  if (!localisation || localisation === 'multi-destinations') return [];
  const loc = checklistData.localisations[localisation as keyof typeof checklistData.localisations];
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

export { checklistData };
