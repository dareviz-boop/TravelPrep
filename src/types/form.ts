export type Localisation = 'europe' | 'asie' | 'afrique' | 'amerique-nord' | 'amerique-centrale-caraibes' | 'amerique-sud' | 'oceanie' | 'multi-destinations';
export type Duree = 'court' | 'moyen' | 'long' | 'tres-long';
export type Temperature = 'tres-froide' | 'froide' | 'temperee' | 'chaude' | 'tres-chaude' | 'inconnue';
export type Saison = 'ete' | 'hiver' | 'printemps' | 'automne' | 'inconnue';
export type Activite = 'randonnee' | 'plage' | 'sports-nautiques' | 'city-trip' | 'backpacking' | 'camping' | 'sports-hiver' | 'road-trip' | 'vie-nocturne' | 'velo' | 'gastronomie' | 'shopping' | 'photographie';
export type Profil = 'solo' | 'couple' | 'famille' | 'groupe' | 'pro';
export type TypeVoyage = 'backpacker' | 'immersion' | 'flexible' | 'confort-organise' | 'luxe';
export type Confort = 'economique' | 'confortable' | 'standard' | 'premium' | 'luxe';
export type EnfantAge = '0-2-ans' | '3-5-ans' | '6-12-ans' | '13+-ans';
export type FormatFichier = 'pdf' | 'csv' | 'les-deux';

export interface Pays {
  code: string;
  nom: string;
  nomEn: string;
  flag: string;
}

export interface FormData {
  // Page 1: Informations du Voyage & Destination (Étape 1)
  nomVoyage: string;
  
  // STAND BY POUR LE MOMENT CAR INUTILISÉ MAIS A NE PAS SUPPRIMER 
  // AJOUT NÉCESSAIRE: Champ de texte pour les villes/étapes
  // villesEtapes?: string; 
  
  // DATES
  dateDepart: string;
  dateRetour?: string;
  duree: Duree; 
  
  // DESTINATION GÉOGRAPHIQUE
  localisation: Localisation;
  pays: Pays[];

  // Page 2: Climat & Conditions (Étape 2)
  temperature: Temperature;
  saison: Saison;
  conditionsClimatiques: string[];
  
  // Page 3: Activités
  activites: Activite[];
  
  // Page 4: Profil voyageur (Étape 4)
  profil: Profil;
  nombreEnfants?: number;
  
  // Rendu OPTIONNEL pour correspondre à la logique de la Step 4 (uniquement pertinent si profil='famille')
  agesEnfants?: EnfantAge[]; 
  
  typeVoyage: TypeVoyage;
  confort: Confort;
  
  // Page 5: Récapitulatif & Options
  // Rendu OPTIONNEL pour correspondre à la logique de la Step 5 (undefined = tout coché)
  sectionsInclure: string[];
  formatPDF: 'compact' | 'detaille';
  formatFichier: 'pdf' | 'excel';
  
  // Page 6: Checkout
  nomClient: string;
  prenomClient: string;
  email: string;
}
