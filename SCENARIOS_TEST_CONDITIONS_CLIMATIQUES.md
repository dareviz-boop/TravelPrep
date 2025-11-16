# 🧪 Scénarios de test des conditions climatiques

> 26 scénarios couvrant TOUTES les conditions climatiques de l'application

## 📋 Liste des conditions climatiques à tester

### Précipitations (5)
- ✅ climat_mousson - Saison des pluies / Mousson
- ✅ climat_sec_aride - Saison sèche / Climat aride
- ✅ climat_orages - Orages tropicaux fréquents
- ✅ climat_cyclones - Cyclones / Typhons / Ouragans
- ✅ climat_neige - Neige / Blizzard

### Températures extrêmes (5)
- ✅ climat_canicule - Chaleur extrême (>40°C)
- ✅ climat_froid_intense - Froid polaire (<-20°C)
- ✅ climat_amplitude_thermique - Amplitude thermique extrême
- ✅ climat_desert_extreme - Canicule désertique (>45°C)

### Altitude (3)
- ✅ climat_altitude_moderee - Altitude modérée (2500-3500m)
- ✅ climat_altitude_haute - Haute altitude (3500-5500m)
- ✅ climat_altitude_extreme - Très haute altitude (>5500m)

### Conditions spéciales (9)
- ✅ climat_tropical_humide - Climat tropical humide
- ✅ climat_marin - Environnement marin
- ✅ climat_desert_aride - Désert aride
- ✅ climat_volcanique - Zone volcanique active
- ✅ climat_jungle_dense - Forêt dense / Jungle
- ✅ climat_arctique - Banquise / Arctique
- ✅ climat_brouillard - Brouillard dense

### Vents (3)
- ✅ climat_vents_forts - Vents violents / Tempêtes
- ✅ climat_tornades - Tornades / Twisters
- ✅ climat_harmattan - Harmattan (vent de sable)

### Humidité (2)
- ✅ climat_humidite - Humidité extrême (>85%)
- ✅ climat_secheresse - Sécheresse extrême (<20%)

---

## 🌍 Scénarios de test (26 scénarios)

### 1. Mousson en Asie du Sud-Est
**Objectif :** climat_mousson, climat_tropical_humide, climat_humidite, climat_orages
```
Destination: Asie
Pays: Vietnam, Thaïlande, Indonésie
Date départ: 15 juillet 2025
Date retour: 30 août 2025
Température: Très chaude
Saison: Été
```
**Conditions attendues :** 🌧️ Mousson, 🏝️ Tropical humide, 💧 Humidité, ⛈️ Orages

---

### 2. Typhons aux Philippines
**Objectif :** climat_cyclones, climat_tropical_humide, climat_mousson
```
Destination: Asie
Pays: Philippines, Taiwan, Japon
Date départ: 1er août 2025
Date retour: 30 septembre 2025
Température: Chaude
Saison: Été
```
**Conditions attendues :** 🌀 Cyclones, 🏝️ Tropical humide, 🌧️ Mousson

---

### 3. Ouragan dans les Caraïbes
**Objectif :** climat_cyclones, climat_tropical_humide, climat_marin
```
Destination: Amérique centrale et Caraïbes
Pays: Cuba, Jamaïque, Haïti, République Dominicaine
Date départ: 1er septembre 2025
Date retour: 30 octobre 2025
Température: Très chaude
Saison: Été
```
**Conditions attendues :** 🌀 Cyclones, 🏝️ Tropical humide, 🌊 Environnement marin

---

### 4. Désert du Sahara - Chaleur extrême
**Objectif :** climat_desert_extreme, climat_sec_aride, climat_canicule, climat_amplitude_thermique, climat_secheresse
```
Destination: Afrique
Pays: Maroc, Algérie, Tchad, Mali
Date départ: 15 juin 2025
Date retour: 30 juillet 2025
Température: Très chaude
Saison: Été
```
**Conditions attendues :** 🏜️ Désert extrême, 🌵 Sec aride, 🔥 Canicule, 🌡️ Amplitude thermique, 🏜️ Sécheresse

---

### 5. Harmattan en Afrique de l'Ouest
**Objectif :** climat_harmattan, climat_sec_aride, climat_secheresse
```
Destination: Afrique
Pays: Sénégal, Mali, Niger, Nigeria
Date départ: 1er décembre 2025
Date retour: 31 janvier 2026
Température: Chaude
Saison: Hiver
```
**Conditions attendues :** 🌬️ Harmattan, 🌵 Sec aride, 🏜️ Sécheresse

---

### 6. Hiver arctique au Groenland
**Objectif :** climat_arctique, climat_froid_intense, climat_neige, climat_vents_forts
```
Destination: Europe
Pays: Groenland, Islande
Date départ: 1er janvier 2026
Date retour: 28 février 2026
Température: Très froide
Saison: Hiver
```
**Conditions attendues :** ❄️ Arctique, 🥶 Froid intense, ❄️ Neige, 💨 Vents forts

---

### 7. Hiver polaire en Scandinavie
**Objectif :** climat_froid_intense, climat_neige, climat_arctique
```
Destination: Europe
Pays: Norvège, Suède, Finlande
Date départ: 15 décembre 2025
Date retour: 31 janvier 2026
Température: Très froide
Saison: Hiver
```
**Conditions attendues :** 🥶 Froid intense, ❄️ Neige, ❄️ Arctique

---

### 8. Hiver canadien extrême
**Objectif :** climat_froid_intense, climat_neige, climat_arctique
```
Destination: Amérique du Nord
Pays: Canada
Date départ: 1er janvier 2026
Date retour: 28 février 2026
Température: Très froide
Saison: Hiver
```
**Conditions attendues :** 🥶 Froid intense, ❄️ Neige, ❄️ Arctique

---

### 9. Tornado Alley aux USA
**Objectif :** climat_tornades, climat_orages, climat_vents_forts
```
Destination: Amérique du Nord
Pays: États-Unis
Date départ: 15 avril 2025
Date retour: 30 juin 2025
Température: Chaude
Saison: Printemps
Activités: Road trip
```
**Conditions attendues :** 🌪️ Tornades, ⛈️ Orages, 💨 Vents forts

---

### 10. Jungle amazonienne
**Objectif :** climat_jungle_dense, climat_tropical_humide, climat_humidite, climat_mousson
```
Destination: Amérique du Sud
Pays: Brésil, Pérou, Colombie
Date départ: 1er mars 2025
Date retour: 30 avril 2025
Température: Chaude
Saison: Été
Activités: Randonnée, Camping
```
**Conditions attendues :** 🌲 Jungle dense, 🏝️ Tropical humide, 💧 Humidité

---

### 11. Haute altitude Pérou (Cusco, Machu Picchu)
**Objectif :** climat_altitude_moderee, climat_amplitude_thermique
```
Destination: Amérique du Sud
Pays: Pérou
Date départ: 15 juin 2025
Date retour: 15 juillet 2025
Température: Tempérée
Saison: Hiver (hémisphère sud)
Activités: Randonnée
```
**Conditions attendues :** ⛰️ Altitude modérée, 🌡️ Amplitude thermique

---

### 12. Everest Base Camp (Népal)
**Objectif :** climat_altitude_haute, climat_froid_intense, climat_amplitude_thermique
```
Destination: Asie
Pays: Népal
Date départ: 1er octobre 2025
Date retour: 30 octobre 2025
Température: Froide
Saison: Automne
Activités: Randonnée
```
**Conditions attendues :** 🏔️ Haute altitude, 🥶 Froid intense, 🌡️ Amplitude thermique

---

### 13. Expedition Himalaya (>5500m)
**Objectif :** climat_altitude_extreme, climat_froid_intense, climat_neige
```
Destination: Asie
Pays: Népal, Tibet
Date départ: 1er avril 2025
Date retour: 31 mai 2025
Température: Très froide
Saison: Printemps
Activités: Randonnée
```
**Conditions attendues :** 🗻 Altitude extrême, 🥶 Froid intense, ❄️ Neige

---

### 14. Désert australien (Outback)
**Objectif :** climat_desert_extreme, climat_sec_aride, climat_canicule, climat_amplitude_thermique, climat_secheresse
```
Destination: Océanie
Pays: Australie
Date départ: 1er janvier 2026
Date retour: 31 janvier 2026
Température: Très chaude
Saison: Été (hémisphère sud)
```
**Conditions attendues :** 🏜️ Désert extrême, 🌵 Sec aride, 🔥 Canicule, 🌡️ Amplitude, 🏜️ Sécheresse

---

### 15. Côtes tropicales (Maldives, Seychelles)
**Objectif :** climat_marin, climat_tropical_humide, climat_humidite
```
Destination: Asie
Pays: Maldives, Seychelles
Date départ: 1er août 2025
Date retour: 30 août 2025
Température: Très chaude
Saison: Été
Activités: Plage, Sports nautiques
```
**Conditions attendues :** 🌊 Environnement marin, 🏝️ Tropical humide, 💧 Humidité

---

### 16. Zone volcanique (Islande)
**Objectif :** climat_volcanique, climat_vents_forts, climat_amplitude_thermique
```
Destination: Europe
Pays: Islande
Date départ: 15 juillet 2025
Date retour: 30 août 2025
Température: Tempérée
Saison: Été
Activités: Randonnée
```
**Conditions attendues :** 🌋 Zone volcanique, 💨 Vents forts, 🌡️ Amplitude thermique

---

### 17. Volcans d'Indonésie
**Objectif :** climat_volcanique, climat_tropical_humide, climat_humidite
```
Destination: Asie
Pays: Indonésie
Date départ: 1er juin 2025
Date retour: 30 juin 2025
Température: Très chaude
Saison: Été
Activités: Randonnée
```
**Conditions attendues :** 🌋 Zone volcanique, 🏝️ Tropical humide, 💧 Humidité

---

### 18. Brouillard en Écosse
**Objectif :** climat_brouillard, climat_vents_forts
```
Destination: Europe
Pays: Royaume-Uni (Écosse)
Date départ: 1er octobre 2025
Date retour: 31 octobre 2025
Température: Froide
Saison: Automne
Activités: Randonnée
```
**Conditions attendues :** 🌫️ Brouillard dense, 💨 Vents forts

---

### 19. Patagonie - Vents violents
**Objectif :** climat_vents_forts, climat_froid_intense, climat_amplitude_thermique
```
Destination: Amérique du Sud
Pays: Argentine, Chili
Date départ: 1er décembre 2025
Date retour: 31 janvier 2026
Température: Froide
Saison: Été (hémisphère sud)
Activités: Randonnée, Camping
```
**Conditions attendues :** 💨 Vents forts, 🥶 Froid, 🌡️ Amplitude thermique

---

### 20. Désert d'Atacama - Amplitude thermique
**Objectif :** climat_desert_aride, climat_amplitude_thermique, climat_sec_aride, climat_secheresse
```
Destination: Amérique du Sud
Pays: Chili
Date départ: 15 juin 2025
Date retour: 15 juillet 2025
Température: Chaude
Saison: Hiver (hémisphère sud)
```
**Conditions attendues :** 🐫 Désert aride, 🌡️ Amplitude thermique, 🌵 Sec aride, 🏜️ Sécheresse

---

### 21. Afrique du Sud - Cyclones Océan Indien
**Objectif :** climat_cyclones, climat_tropical_humide, climat_marin
```
Destination: Afrique
Pays: Madagascar, Mozambique, Maurice
Date départ: 1er janvier 2026
Date retour: 28 février 2026
Température: Très chaude
Saison: Été (hémisphère sud)
```
**Conditions attendues :** 🌀 Cyclones, 🏝️ Tropical humide, 🌊 Environnement marin

---

### 22. Orages tropicaux Afrique équatoriale
**Objectif :** climat_orages, climat_tropical_humide, climat_humidite
```
Destination: Afrique
Pays: Kenya, Tanzanie, Ouganda
Date départ: 1er avril 2025
Date retour: 30 mai 2025
Température: Chaude
Saison: Printemps
```
**Conditions attendues :** ⛈️ Orages tropicaux, 🏝️ Tropical humide, 💧 Humidité

---

### 23. Multi-destinations - Tour du monde (TOUS les climats)
**Objectif :** Tester la logique multi-destinations complexe
```
Destination: Multi-destinations
Pays: Groenland, Islande, Sahara occidental, Tchad, Vietnam, Indonésie, Chili, Haïti, France, États-Unis
Date départ: 1er janvier 2025
Date retour: 31 décembre 2025
Durée: Très longue (> 1 an)
Température: Toutes sélectionnées
Saison: Toutes sélectionnées
```
**Conditions attendues :** Toutes ou presque toutes les conditions doivent être suggérées

---

### 24. Moyen-Orient - Chaleur extrême
**Objectif :** climat_canicule, climat_desert_extreme, climat_sec_aride, climat_secheresse
```
Destination: Asie
Pays: Arabie Saoudite, Émirats Arabes Unis, Qatar
Date départ: 1er juillet 2025
Date retour: 31 août 2025
Température: Très chaude
Saison: Été
```
**Conditions attendues :** 🔥 Canicule, 🏜️ Désert extrême, 🌵 Sec aride, 🏜️ Sécheresse

---

### 25. Nouvelle-Zélande - Vents et brouillard
**Objectif :** climat_vents_forts, climat_brouillard, climat_marin
```
Destination: Océanie
Pays: Nouvelle-Zélande
Date départ: 1er juin 2025
Date retour: 31 juillet 2025
Température: Froide
Saison: Hiver (hémisphère sud)
Activités: Randonnée
```
**Conditions attendues :** 💨 Vents forts, 🌫️ Brouillard, 🌊 Marin

---

### 26. Russie sibérienne - Froid extrême
**Objectif :** climat_froid_intense, climat_neige, climat_amplitude_thermique, climat_arctique
```
Destination: Europe (ou Asie)
Pays: Russie
Date départ: 1er décembre 2025
Date retour: 28 février 2026
Température: Très froide
Saison: Hiver
```
**Conditions attendues :** 🥶 Froid intense, ❄️ Neige, 🌡️ Amplitude thermique, ❄️ Arctique

---

## 📊 Résumé des conditions par scénario

| Scénario | Mousson | Cyclones | Neige | Canicule | Froid | Altitude | Vents | Brouillard | Humidité | Autres |
|----------|---------|----------|-------|----------|-------|----------|-------|------------|----------|--------|
| 1. Asie mousson | ✅ | | | | | | | | ✅ | Tropical, Orages |
| 2. Philippines typhons | ✅ | ✅ | | | | | | | | Tropical |
| 3. Caraïbes ouragan | | ✅ | | | | | | | | Tropical, Marin |
| 4. Sahara chaleur | | | | ✅ | | | | | | Désert extrême, Amplitude |
| 5. Harmattan | | | | | | | ✅ | | | Sec aride, Sécheresse |
| 6. Groenland | | | ✅ | | ✅ | | ✅ | | | Arctique |
| 7. Scandinavie | | | ✅ | | ✅ | | | | | Arctique |
| 8. Canada | | | ✅ | | ✅ | | | | | Arctique |
| 9. USA Tornades | | | | | | | ✅ | | | Tornades, Orages |
| 10. Amazonie | ✅ | | | | | | | | ✅ | Jungle, Tropical |
| 11. Pérou altitude | | | | | | ✅ | | | | Amplitude |
| 12. Everest | | | | | ✅ | ✅ | | | | Amplitude |
| 13. Himalaya | | | ✅ | | ✅ | ✅ | | | | |
| 14. Australie désert | | | | ✅ | | | | | | Désert extrême, Amplitude |
| 15. Maldives | | | | | | | | | ✅ | Tropical, Marin |
| 16. Islande volcans | | | | | | | ✅ | | | Volcanique, Amplitude |
| 17. Indonésie volcans | | | | | | | | | ✅ | Volcanique, Tropical |
| 18. Écosse | | | | | | | ✅ | ✅ | | |
| 19. Patagonie | | | | | ✅ | | ✅ | | | Amplitude |
| 20. Atacama | | | | | | | | | | Désert, Amplitude, Sec |
| 21. Madagascar cyclones | | ✅ | | | | | | | | Tropical, Marin |
| 22. Afrique orages | | | | | | | | | ✅ | Tropical, Orages |
| 23. Tour du monde | ✅ | ✅ | ✅ | ✅ | ✅ | | ✅ | | ✅ | Tous |
| 24. Moyen-Orient | | | | ✅ | | | | | | Désert extrême, Sec |
| 25. Nouvelle-Zélande | | | | | | | ✅ | ✅ | | Marin |
| 26. Sibérie | | | ✅ | | ✅ | | | | | Arctique, Amplitude |

---

## ✅ Checklist de validation

Pour chaque scénario, vérifier que :
- [ ] Les conditions attendues sont proposées automatiquement (emoji 📌)
- [ ] Le nombre de conditions affichées dans le récapitulatif est correct
- [ ] Si aucune condition n'est applicable, "climat_aucune" est sélectionné automatiquement
- [ ] L'emoji 📌 ne disparaît PAS lors de la navigation entre les étapes
- [ ] Le PDF se génère sans erreur `getPriorityStyle is not defined`

---

## 🔧 Points d'amélioration identifiés

### 1. Conditions jamais suggérées automatiquement
- ✅ `climat_brouillard` - Besoin d'ajouter logique contextuelle
- ✅ `climat_vents_forts` - Besoin d'ajouter logique contextuelle
- ✅ `climat_amplitude_thermique` - Besoin d'ajouter logique contextuelle
- ✅ `climat_desert_aride` - Besoin d'ajouter logique contextuelle
- ✅ `climat_secheresse` - Besoin d'ajouter logique contextuelle
- ✅ `climat_volcanique` - Besoin d'ajouter logique contextuelle
- ✅ `climat_marin` - Besoin d'ajouter logique contextuelle

### 2. Logique à améliorer dans `generateAutoSuggestions`
- Ajouter détection automatique zones côtières → climat_marin
- Ajouter détection zones montagneuses → climat_vents_forts, climat_brouillard
- Ajouter détection zones désertiques → climat_desert_aride, climat_secheresse
- Ajouter détection zones volcaniques → climat_volcanique
- Ajouter détection amplitude thermique (déserts, montagnes) → climat_amplitude_thermique

### 3. Mapping pays → conditions spéciales
Créer un mapping enrichi dans climateDatabase.ts avec :
- Zones côtières (activités plage/nautiques) → climat_marin
- Zones volcaniques (Islande, Indonésie, Japon, etc.) → climat_volcanique
- Zones de vents forts (Patagonie, Islande, Nouvelle-Zélande) → climat_vents_forts
- Zones de brouillard (Écosse, San Francisco, etc.) → climat_brouillard
