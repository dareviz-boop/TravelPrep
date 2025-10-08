export type Destination = 'europe' | 'hors-europe-dev' | 'hors-europe-emergent' | 'zone-froide' | 'zone-chaude';
export type Saison = 'ete' | 'hiver' | 'printemps' | 'automne' | 'humide' | 'seche';
export type Duree = 'court' | 'moyen' | 'long';
export type Activite = 'randonnee' | 'plage' | 'city-trip' | 'backpacking' | 'camping' | 'sports-hiver' | 'road-trip' | 'gastronomie';
export type Profil = 'solo' | 'couple' | 'famille' | 'groupe' | 'pro';
export type Confort = 'budget' | 'confort' | 'premium';
export type EnfantAge = '0-2-ans' | '3-5-ans' | '6-12-ans' | '13+-ans';

export interface FormData {
  // Page 1
  nomVoyage: string;
  dateDepart: string;
  dateRetour?: string;
  
  // Page 2
  destination: Destination;
  saison: Saison;
  duree?: Duree;
  
  // Page 3
  activites: Activite[];
  
  // Page 4
  profil: Profil;
  nombreEnfants?: number;
  agesEnfants: EnfantAge[];
  confort: Confort;
  
  // Page 5
  sectionsInclure: string[];
  formatPDF: 'compact' | 'detaille' | 'notion';
  email?: string;
}
