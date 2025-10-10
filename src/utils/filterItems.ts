import { FormData } from "@/types/form";

export interface ChecklistItem {
  id: string;
  nom: string;
  priorite?: number;
  delai?: string;
  conditions?: {
    destination?: string[];
    saison?: string[];
    duree?: string[];
    activites?: string[];
    profil?: string[];
  };
}

export const filterItemsByConditions = (
  item: ChecklistItem,
  formData: FormData
): boolean => {
  if (!item.conditions) return true;

  const { destination, saison, duree, activites, profil } = item.conditions;

  // Check localisation (destination)
  if (destination && !destination.includes(formData.localisation)) {
    return false;
  }

  // Check saison
  if (saison && !saison.includes(formData.saison)) {
    return false;
  }

  // Check duree
  if (duree && formData.duree && !duree.includes(formData.duree)) {
    return false;
  }

  // Check activites (if item requires ANY of these activities)
  if (activites && activites.length > 0) {
    const hasMatchingActivity = activites.some(act =>
      formData.activites?.includes(act as any)
    );
    if (!hasMatchingActivity) {
      return false;
    }
  }

  // Check profil
  if (profil && !profil.includes(formData.profil)) {
    return false;
  }

  return true;
};

export const calculateDeadline = (dateDepart: string, delai: string): string => {
  const departDate = new Date(dateDepart);
  const jValue = parseInt(delai.replace('J-', '').replace('J+', ''));

  if (delai.startsWith('J-')) {
    departDate.setDate(departDate.getDate() - jValue);
  } else if (delai.startsWith('J+')) {
    departDate.setDate(departDate.getDate() + jValue);
  }

  return departDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
