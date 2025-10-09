export const checklistComplete = {
  metadata: {
    version: "1.0",
    lastUpdated: "2025-10-08",
    totalItems: 127,
    categories: 7
  },
  labels: {
    destinations: {
      europe: "🇪🇺 Europe",
      "hors-europe-dev": "🌍 Hors Europe - Pays développé",
      "hors-europe-emergent": "🌴 Hors Europe - Pays émergent/tropical",
      "zone-froide": "❄️ Zone froide (-10°C à 5°C)",
      "zone-chaude": "☀️ Zone chaude (25°C et +)"
    },
    saisons: {
      ete: "☀️ Été",
      hiver: "❄️ Hiver",
      printemps: "🌸 Printemps",
      automne: "🍂 Automne",
      humide: "🌧️ Saison humide/Mousson",
      seche: "🌵 Saison sèche"
    },
    durees: {
      court: "🏃 Court (2-7 jours)",
      moyen: "📅 Moyen (1-3 semaines)",
      long: "🌏 Long (1 mois et +)"
    },
    activites: {
      randonnee: "⛰️ Randonnée / Trekking / Montagne",
      plage: "🏖️ Plage / Mer / Sports nautiques",
      "city-trip": "🏙️ City-trip / Visites culturelles",
      backpacking: "🎒 Backpacking / Auberges",
      camping: "🏕️ Camping / Nature",
      "sports-hiver": "⛷️ Sports d'hiver",
      "road-trip": "🚗 Vélo / Road trip",
      gastronomie: "🍷 Gastronomie / Œnotourisme"
    },
    profils: {
      solo: "🚶 Solo",
      couple: "💑 Couple",
      famille: "👨‍👩‍👧‍👦 Famille",
      groupe: "👥 Groupe d'amis",
      pro: "💼 Voyage professionnel"
    },
    conforts: {
      budget: "💰 Budget - Auberges, transports locaux, cuisine de rue",
      confort: "🏨 Confort - Hôtels 3*, locations Airbnb, mix transport",
      premium: "💎 Premium - Hôtels 4-5*, services concierge, confort maximal"
    }
  },
  categories: {
    j90_j60: {
      periode: "J-90 à J-60",
      description: "3 mois à 2 mois avant le départ",
      items: [
        {
          id: "verif-passeport",
          nom: "Vérifier validité passeport (+6 mois après retour)",
          priorite: 3,
          delai: "J-90",
          conditions: {
            destination: ["hors-europe-dev", "hors-europe-emergent", "zone-froide", "zone-chaude"]
          }
        },
        {
          id: "demander-visa",
          nom: "Demander visa si nécessaire (délai 3 semaines à 3 mois)",
          priorite: 3,
          delai: "J-90",
          conditions: {
            destination: ["hors-europe-emergent", "zone-chaude"]
          }
        },
        {
          id: "rdv-vaccins",
          nom: "Prendre RDV vaccinations (certains nécessitent plusieurs injections)",
          priorite: 3,
          delai: "J-90",
          conditions: {
            destination: ["hors-europe-emergent", "zone-chaude"]
          }
        },
        {
          id: "reserver-vols",
          nom: "Réserver vols (meilleurs prix généralement 2-3 mois avant)",
          priorite: 2,
          delai: "J-60",
          conditions: {}
        }
      ]
    },
    j30_j14: {
      periode: "J-30 à J-14",
      description: "1 mois à 2 semaines avant",
      items: [
        {
          id: "assurance-voyage",
          nom: "Souscrire assurance voyage (rapatriement + santé + annulation)",
          priorite: 3,
          delai: "J-30",
          conditions: {}
        },
        {
          id: "commander-cb",
          nom: "Commander CB sans frais (Revolut, N26, Wise) - délai 7-10j",
          priorite: 3,
          delai: "J-30",
          conditions: {
            destination: ["hors-europe-dev", "hors-europe-emergent", "zone-froide", "zone-chaude"]
          }
        },
        {
          id: "reserver-hebergements",
          nom: "Réserver hébergements (premières nuits minimum)",
          priorite: 2,
          delai: "J-30",
          conditions: {}
        },
        {
          id: "checkup-medical",
          nom: "Check-up médical et dentaire (éviter urgences sur place)",
          priorite: 2,
          delai: "J-30",
          conditions: {
            duree: ["moyen", "long"]
          }
        }
      ]
    },
    j7_j3: {
      periode: "J-7 à J-3",
      description: "1 semaine à 3 jours avant",
      items: [
        {
          id: "check-meteo",
          nom: "Check météo destination (adapter vêtements si besoin)",
          priorite: 2,
          delai: "J-7",
          conditions: {}
        },
        {
          id: "telecharger-apps",
          nom: "Télécharger apps offline (Maps, traduction, guides)",
          priorite: 2,
          delai: "J-7",
          conditions: {}
        },
        {
          id: "echanger-devise",
          nom: "Échanger devise (petites coupures pour arrivée)",
          priorite: 2,
          delai: "J-7",
          conditions: {
            destination: ["hors-europe-dev", "hors-europe-emergent", "zone-froide", "zone-chaude"]
          }
        },
        {
          id: "prevenir-banque",
          nom: "Prévenir banque du voyage (éviter blocage carte)",
          priorite: 3,
          delai: "J-7",
          conditions: {
            destination: ["hors-europe-dev", "hors-europe-emergent", "zone-froide", "zone-chaude"]
          }
        }
      ]
    },
    j2_j1: {
      periode: "J-2 à J-1",
      description: "48h avant le départ",
      items: [
        {
          id: "checkin-online",
          nom: "Check-in en ligne (choisir sièges)",
          priorite: 3,
          delai: "J-1",
          conditions: {}
        },
        {
          id: "peser-bagages",
          nom: "Peser bagages (vérifier limites compagnie)",
          priorite: 3,
          delai: "J-1",
          conditions: {}
        },
        {
          id: "charger-appareils",
          nom: "Charger tous appareils (téléphone, batterie externe, appareil photo)",
          priorite: 3,
          delai: "J-1",
          conditions: {}
        },
        {
          id: "liquides-sachet",
          nom: "Liquides en sachet transparent (100ml max par contenant)",
          priorite: 3,
          delai: "J-1",
          conditions: {}
        }
      ]
    },
    documents: {
      id: "documents",
      nom: "Documents & Administratif",
      icon: "FileText",
      ordre: 1,
      items: [
        {
          id: "passeport",
          nom: "Passeport valide (+6 mois après retour)",
          priorite: 3,
          conditions: {
            destination: ["hors-europe-dev", "hors-europe-emergent", "zone-froide", "zone-chaude"]
          }
        },
        {
          id: "carte-identite",
          nom: "Carte d'identité valide",
          priorite: 3,
          conditions: {
            destination: ["europe"]
          }
        },
        {
          id: "visa",
          nom: "Visa / e-Visa",
          priorite: 3,
          conditions: {
            destination: ["hors-europe-emergent", "zone-chaude"]
          }
        },
        {
          id: "billets-avion",
          nom: "Billets d'avion (papier + digital)",
          priorite: 3,
          conditions: {}
        },
        {
          id: "assurance-doc",
          nom: "Attestation assurance voyage",
          priorite: 3,
          conditions: {}
        },
        {
          id: "permis-conduire",
          nom: "Permis de conduire (+ international si hors Europe)",
          priorite: 2,
          conditions: {
            activites: ["road-trip"]
          }
        },
        {
          id: "carnet-vaccinations",
          nom: "Carnet de vaccinations international",
          priorite: 2,
          conditions: {
            destination: ["hors-europe-emergent", "zone-chaude"]
          }
        }
      ]
    }
  },
  bagages: {
    vetements: [
      {
        id: "tshirts-respirants",
        nom: "T-shirts respirants",
        quantite: { court: 3, moyen: 5, long: 7 },
        pertinence: {
          froid: "-", chaud: "●", pluie: "-",
          randonnee: "●", plage: "●", ville: "●"
        },
        conditions: {
          destination: ["zone-chaude", "hors-europe-dev", "hors-europe-emergent"]
        }
      },
      {
        id: "pantalons-convertibles",
        nom: "Pantalons convertibles shorts/longs",
        quantite: { court: 1, moyen: 2, long: 3 },
        pertinence: {
          froid: "-", chaud: "●", pluie: "-",
          randonnee: "●", plage: "○", ville: "○"
        },
        conditions: {
          activites: ["randonnee", "backpacking"]
        }
      },
      {
        id: "polaire-doudoune",
        nom: "Polaire ou doudoune compressible",
        quantite: { court: 0, moyen: 1, long: 1 },
        pertinence: {
          froid: "●", chaud: "-", pluie: "-",
          randonnee: "●", plage: "-", ville: "-"
        },
        conditions: {
          destination: ["zone-froide", "europe"],
          saison: ["hiver", "automne"]
        }
      },
      {
        id: "veste-impermeable",
        nom: "Veste imperméable respirante",
        quantite: { court: 1, moyen: 1, long: 1 },
        pertinence: {
          froid: "●", chaud: "○", pluie: "●",
          randonnee: "●", plage: "○", ville: "○"
        },
        conditions: {}
      },
      {
        id: "maillot-bain",
        nom: "Maillot de bain",
        quantite: { court: 1, moyen: 2, long: 2 },
        pertinence: {
          froid: "-", chaud: "●", pluie: "-",
          randonnee: "-", plage: "●", ville: "-"
        },
        conditions: {
          activites: ["plage"]
        }
      },
      {
        id: "chaussures-randonnee",
        nom: "Chaussures de randonnée montantes",
        quantite: { court: 0, moyen: 1, long: 1 },
        pertinence: {
          froid: "●", chaud: "-", pluie: "-",
          randonnee: "●", plage: "-", ville: "-"
        },
        conditions: {
          activites: ["randonnee"]
        }
      },
      {
        id: "sandales-tongs",
        nom: "Sandales ou tongs",
        quantite: { court: 1, moyen: 1, long: 1 },
        pertinence: {
          froid: "-", chaud: "●", pluie: "-",
          randonnee: "-", plage: "●", ville: "○"
        },
        conditions: {
          destination: ["zone-chaude", "hors-europe-emergent"]
        }
      },
      {
        id: "chapeau-large",
        nom: "Chapeau large bord",
        quantite: { court: 1, moyen: 1, long: 1 },
        pertinence: {
          froid: "-", chaud: "●", pluie: "-",
          randonnee: "●", plage: "●", ville: "○"
        },
        conditions: {
          destination: ["zone-chaude"]
        }
      }
    ],
    equipement: [
      {
        id: "sac-dos-40-60l",
        nom: "Sac à dos 40-60L",
        quantite: { court: 0, moyen: 1, long: 1 },
        pertinence: {
          froid: "●", chaud: "○", pluie: "-",
          randonnee: "●", plage: "-", ville: "-"
        },
        conditions: {
          activites: ["randonnee", "backpacking"],
          duree: ["moyen", "long"]
        }
      },
      {
        id: "cadenas",
        nom: "Cadenas (x2-3)",
        quantite: { court: 2, moyen: 2, long: 3 },
        pertinence: {
          froid: "●", chaud: "●", pluie: "●",
          randonnee: "●", plage: "●", ville: "●"
        },
        conditions: {}
      },
      {
        id: "batterie-externe",
        nom: "Batterie externe (20000mAh)",
        quantite: { court: 1, moyen: 1, long: 1 },
        pertinence: {
          froid: "●", chaud: "●", pluie: "●",
          randonnee: "●", plage: "●", ville: "●"
        },
        conditions: {}
      },
      {
        id: "adaptateur-universel",
        nom: "Adaptateur universel",
        quantite: { court: 1, moyen: 1, long: 1 },
        pertinence: {
          froid: "●", chaud: "●", pluie: "●",
          randonnee: "●", plage: "●", ville: "●"
        },
        conditions: {
          destination: ["hors-europe-dev", "hors-europe-emergent", "zone-froide", "zone-chaude"]
        }
      },
      {
        id: "gourde-1l",
        nom: "Gourde isotherme 1L",
        quantite: { court: 1, moyen: 1, long: 1 },
        pertinence: {
          froid: "○", chaud: "●", pluie: "○",
          randonnee: "●", plage: "●", ville: "○"
        },
        conditions: {}
      }
    ]
  }
};

export default checklistComplete;
