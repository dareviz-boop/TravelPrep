/**
 * Types et interfaces pour le générateur de checklist
 */

// Type pour les filtres d'items
export interface ItemFiltres {
  typeVoyageur?: string[];
  niveauConfort?: string[];
  activites?: string[];
  ageEnfants?: string[];
  destinations?: string[];
  duree?: string[];
  typeVoyage?: string[];
  profil?: string[];
}

// Type pour un item brut venant des fichiers JSON
export interface RawChecklistItem {
  id?: string;
  item: string;
  priorite?: string;
  delai?: string;
  moment?: string;
  quantite?: string;
  specifications?: string[];
  conseils?: string;
  filtres?: ItemFiltres;
}

// Type pour une section de profil voyageur
export interface ProfilVoyageurSection {
  description?: string;
  filtres?: {
    typeVoyageur?: string[];
    ageEnfants?: string[];
  };
  items: RawChecklistItem[];
}

// Type pour le fichier JSON profil voyageurs
export interface ProfilVoyageursData {
  [key: string]: ProfilVoyageurSection;
}

// Type pour une app dans la section apps
export interface AppItem {
  nom: string;
  usage: string;
  prix: string;
  priorite?: string;
  conseils?: string;
}

// Type pour une catégorie d'apps
export interface AppCategory {
  nom: string;
  apps: AppItem[];
}

// Type pour une section core (documents, santé, etc.)
export interface CoreSection {
  id: string;
  nom: string;
  description?: string;
  obligatoire?: boolean;
  note?: string;
  items?: RawChecklistItem[];
  categories?: { [key: string]: AppCategory };
}

// Type pour le fichier JSON core sections
export interface CoreSectionsData {
  [key: string]: CoreSection;
}

// Type pour une activité
export interface ActivityData {
  activity_id: string;
  nom: string;
  items: RawChecklistItem[];
}

// Type pour le fichier JSON activités
export interface ActivitesData {
  activites: ActivityData[];
}

// Type pour un item de checklist final
export interface ChecklistItem {
  id?: string;
  item: string;
  priorite?: string;
  delai?: string;
  moment?: string;
  quantite?: string;
  specifications?: string[];
  conseils?: string;
  source?: string;
  checked?: boolean;
}

// Type pour une section de checklist générée
export interface GeneratedChecklistSection {
  id: string;
  nom: string;
  description?: string;
  obligatoire?: boolean;
  note?: string;
  items: ChecklistItem[];
  categories?: { [key: string]: AppCategory };
}

// Type pour la checklist complète générée
export interface GeneratedChecklist {
  metadata: {
    nomVoyage: string;
    destination: string;
    pays: string[];
    dateDepart: string;
    dateRetour?: string;
    duree: string;
    saison: string[];
    temperature: string[];
    activites: string[];
    profil: string;
    typeVoyage: string;
    confort: string;
    genereeLe: string;
  };
  sections: GeneratedChecklistSection[];
  stats: {
    totalItems: number;
    totalSections: number;
    itemsEssentiels: number;
    itemsImportants: number;
    itemsOptionnels: number;
  };
}
