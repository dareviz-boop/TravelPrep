// Types basés sur Checklist_Voyage_2.json (Vos types restent inchangés)
export type Localisation = 'europe' | 'asie' | 'afrique' | 'amerique-nord' | 'amerique-centrale-caraibes' | 'amerique-sud' | 'oceanie' | 'multi-destinations';
export type Temperature = 'tres-froide' | 'froide' | 'temperee' | 'chaude' | 'tres-chaude' | 'inconnue';
export type Saison = 'ete' | 'hiver' | 'printemps' | 'automne' | 'inconnue';
export type Duree = 'court' | 'moyen' | 'long' | 'tres-long';
export type Activite = 'randonnee' | 'plage' | 'city-trip' | 'backpacking' | 'camping' | 'sports-hiver' | 'road-trip' | 'gastronomie' | 'shopping';
export type Profil = 'solo' | 'couple' | 'famille' | 'groupe' | 'pro';
export type TypeVoyage = 'backpacker' | 'immersion' | 'equilibre' | 'confort-organise' | 'luxe';
export type Confort = 'economique' | 'confortable' | 'premium' | 'luxe';
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
  
  // AJOUT NÉCESSAIRE: Champ de texte pour les villes/étapes
  villesEtapes?: string; 
  
  // DATES (Déplacé/Maintenu dans Page 1, mais toujours lié)
  dateDepart: string;
  dateRetour?: string;
  duree: Duree; // *Retiré l'optionnel* car il est soit calculé, soit saisi manuellement dans l'Étape 1
  
  // DESTINATION GÉOGRAPHIQUE (Déplacé/Maintenu dans Page 1, mais toujours lié)
  localisation: Localisation;
  pays: Pays[];

  // Page 2: Climat & Conditions (Étape 2)
  temperature: Temperature;
  saison: Saison;
  conditionsClimatiques: string[]; // Reste ici, géré dans l'Étape 2
  
  // Page 3: Activités
  activites: Activite[];
  
  // Page 3: Profil voyageur
  profil: Profil;
  nombreEnfants?: number;
  agesEnfants: EnfantAge[];
  typeVoyage: TypeVoyage;
  confort: Confort;
  
  // Page 4: Récapitulatif & Options
  sectionsInclure: string[];
  formatPDF: 'compact' | 'detaille';
  formatFichier: FormatFichier;
  
  // Page 5: Checkout
  nom?: string;
  prenom?: string;
  email?: string;
}
