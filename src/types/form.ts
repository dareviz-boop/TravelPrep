// Types based on Checklist_Voyage_2.json
export type Localisation = 'europe' | 'asie' | 'afrique' | 'amerique-nord' | 'amerique-centrale-caraibes' | 'amerique-sud' | 'oceanie' | 'multi-destinations';
export type Temperature = 'tres-froide' | 'froide' | 'temperee' | 'chaude' | 'tres-chaude' | 'inconnue';
export type Saison = 'ete' | 'hiver' | 'printemps' | 'automne' | 'inconnue';
export type Duree = 'court' | 'moyen' | 'long' | 'tres-long';
export type Activite = 'randonnee' | 'plage' | 'city-trip' | 'backpacking' | 'camping' | 'sports-hiver' | 'road-trip' | 'gastronomie' | 'shopping';
export type Profil = 'solo' | 'couple' | 'famille' | 'groupe' | 'pro';
export type Confort = 'budget' | 'confort' | 'premium';
export type EnfantAge = '0-2-ans' | '3-5-ans' | '6-12-ans' | '13+-ans';

export interface Pays {
  code: string;
  nom: string;
  nomEn: string;
  flag: string;
}

export interface FormData {
  // Page 1: Informations du Voyage
  nomVoyage: string;
  dateDepart: string;
  dateRetour?: string;
  
  // Page 2: Destination & Climat
  localisation: Localisation;
  pays: Pays[];
  temperature: Temperature;
  saison: Saison;
  conditionsClimatiques: string[];
  duree?: Duree; // Auto-calculated if dateRetour provided
  
  // Page 3: Activités
  activites: Activite[];
  
  // Page 4: Profil voyageur
  profil: Profil;
  nombreEnfants?: number;
  agesEnfants: EnfantAge[];
  confort: Confort;
  
  // Page 5: Préférences & Génération
  sectionsInclure: string[];
  formatPDF: 'compact' | 'detaille' | 'tableau';
  email?: string;
}
