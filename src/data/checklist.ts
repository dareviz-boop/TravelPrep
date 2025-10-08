// Simplified checklist data for the travel PDF generator
export const checklistData = {
  metadata: {
    version: "1.0",
    lastUpdated: "2025-10-08"
  },
  labels: {
    destinations: {
      "europe": "🇪🇺 Europe",
      "hors-europe-dev": "🌍 Hors Europe - Pays développé",
      "hors-europe-emergent": "🌴 Hors Europe - Pays émergent/tropical",
      "zone-froide": "❄️ Zone froide (-10°C à 5°C)",
      "zone-chaude": "☀️ Zone chaude (25°C et +)"
    },
    saisons: {
      "ete": "☀️ Été",
      "hiver": "❄️ Hiver",
      "printemps": "🌸 Printemps",
      "automne": "🍂 Automne",
      "humide": "🌧️ Saison humide/Mousson",
      "seche": "🌵 Saison sèche"
    },
    durees: {
      "court": "🏃 Court (2-7 jours)",
      "moyen": "📅 Moyen (1-3 semaines)",
      "long": "🌏 Long (1 mois et +)"
    },
    activites: {
      "randonnee": "⛰️ Randonnée / Trekking / Montagne",
      "plage": "🏖️ Plage / Mer / Sports nautiques",
      "city-trip": "🏙️ City-trip / Visites culturelles",
      "backpacking": "🎒 Backpacking / Auberges",
      "camping": "🏕️ Camping / Nature",
      "sports-hiver": "⛷️ Sports d'hiver",
      "road-trip": "🚗 Vélo / Road trip",
      "gastronomie": "🍷 Gastronomie / Œnotourisme"
    },
    profils: {
      "solo": "🚶 Solo",
      "couple": "💑 Couple",
      "famille": "👨‍👩‍👧‍👦 Famille",
      "groupe": "👥 Groupe d'amis",
      "pro": "💼 Voyage professionnel"
    },
    conforts: {
      "budget": "💰 Budget - Auberges, transports locaux, cuisine de rue",
      "confort": "🏨 Confort - Hôtels 3*, locations Airbnb, mix transport",
      "premium": "💎 Premium - Hôtels 4-5*, services concierge, confort maximal"
    }
  },
  sections: [
    "Documents & Administratif",
    "Finances & Argent",
    "Santé & Assurances",
    "Domicile (avant départ)",
    "Technologie & Apps",
    "Réservations & Activités",
    "Timeline chronologique (J-90 au retour)",
    "Bagages détaillés",
    "Kit d'urgence",
    "Applications recommandées"
  ]
};

export default checklistData;
