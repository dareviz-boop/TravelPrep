# 🧪 Scénarios de Test - Système Intelligent de Checklist TravelPrep

## 📋 Table des matières
1. [Tests du Système de Filtrage Climatique](#tests-du-système-de-filtrage-climatique)
2. [Tests des Suggestions Automatiques](#tests-des-suggestions-automatiques)
3. [Tests des Destinations Spécifiques](#tests-des-destinations-spécifiques)
4. [Tests de Génération PDF](#tests-de-génération-pdf)
5. [Tests d'Intégration Complète](#tests-dintégration-complète)

---

## 🌦️ Tests du Système de Filtrage Climatique

### Test 1️⃣ : Voyage en Thaïlande pendant la mousson

**Objectif**: Vérifier le filtrage automatique des items climatiques basé sur destination + période

**Données d'entrée**:
```json
{
  "destination": "Thaïlande",
  "localisation": "asie",
  "dateDepart": "2025-07-15",
  "dateRetour": "2025-07-30",
  "temperature": ["chaude", "tres-chaude"],
  "saison": ["ete"],
  "conditionsClimatiques": ["climat_mousson"]
}
```

**Résultats attendus**:
- ✅ Section "🌧️ Saison des pluies / Mousson" présente
- ✅ Items inclus : poncho pluie, veste Gore-Tex, sac étanche, pochettes électroniques
- ✅ Filtrage basé sur : `destinations: ["asie"]` + `periode: 5-10` (juillet = mois 7)
- ✅ Conseils d'expert affichés (pluies 15h-19h, humidité 90%+)

**Points de vérification**:
1. La condition `climat_mousson` doit matcher avec la période (juillet dans la fourchette 5-10)
2. Les items doivent apparaître dans la section PDF
3. Les conseils doivent être visibles
4. Aucune condition non-sélectionnée ne doit apparaître

---

### Test 2️⃣ : Voyage au Canada en hiver (grand froid)

**Objectif**: Vérifier la gestion des températures extrêmes froides

**Données d'entrée**:
```json
{
  "destination": "Canada",
  "localisation": "amerique-nord",
  "dateDepart": "2025-01-10",
  "dateRetour": "2025-01-20",
  "temperature": ["froide", "tres-froide"],
  "saison": ["hiver"],
  "conditionsClimatiques": ["climat_froid_intense", "climat_neige"]
}
```

**Résultats attendus**:
- ✅ Section "🥶 Grand froid / Températures extrêmes" présente
- ✅ Section "❄️ Neige / Blizzard" présente
- ✅ Items inclus : doudoune -30°C, sous-vêtements thermiques, masque facial, crampons
- ✅ Filtrage par destination (Amérique Nord) et période (janvier = mois 1)

**Points de vérification**:
1. Les 2 conditions climatiques doivent générer 2 sections distinctes
2. Chaque section doit avoir ses items spécifiques
3. Les items ne doivent pas se dupliquer entre sections
4. Le nombre total d'items doit correspondre aux 2 sections combinées

---

### Test 3️⃣ : Voyage au Maroc (climat sec + UV élevés)

**Objectif**: Tester la combinaison de conditions climatiques compatibles

**Données d'entrée**:
```json
{
  "destination": "Maroc",
  "localisation": "afrique",
  "dateDepart": "2025-08-01",
  "dateRetour": "2025-08-15",
  "temperature": ["chaude", "tres-chaude"],
  "saison": ["ete"],
  "conditionsClimatiques": ["climat_sec_aride", "climat_uv_eleves", "climat_canicule"]
}
```

**Résultats attendus**:
- ✅ 3 sections climatiques distinctes
- ✅ Items spécifiques au climat aride (chèche, masque anti-poussière)
- ✅ Items spécifiques aux UV (crème SPF 50+, lunettes UV400, vêtements anti-UV)
- ✅ Items spécifiques canicule (électrolytes, chapeau ventilé)

**Points de vérification**:
1. Aucun conflit entre les 3 conditions (toutes compatibles)
2. Les conseils de chaque condition doivent être distincts
3. Les items similaires (crème solaire, chapeau) peuvent apparaître dans plusieurs sections

---

## 💡 Tests des Suggestions Automatiques

### Test 4️⃣ : Suggestion automatique Mousson (Asie + Été)

**Objectif**: Vérifier que les suggestions intelligentes fonctionnent correctement

**Données d'entrée**:
```json
{
  "localisation": "asie",
  "temperature": ["tres-chaude"],
  "saison": ["ete"],
  "conditionsClimatiques": [] // AUCUNE condition sélectionnée manuellement
}
```

**Résultats attendus**:
- ✅ SuggestionsPanel visible dans Step2Info
- ✅ Suggestion "🌧️ Saison des pluies / Mousson" affichée
- ✅ Badge priorité "HAUTE" visible
- ✅ Raison affichée : "Asie en été → risque de mousson"
- ✅ Boutons "Accepter" et "Ignorer" fonctionnels

**Points de vérification**:
1. La suggestion doit apparaître AVANT que l'utilisateur ne la sélectionne
2. Cliquer "Accepter" doit ajouter `climat_mousson` à `conditionsClimatiques`
3. Cliquer "Ignorer" doit masquer la suggestion
4. La suggestion ne doit PAS s'ajouter automatiquement (non-forcé)

---

### Test 5️⃣ : Suggestion Cyclones (Caraïbes + Juin-Novembre)

**Objectif**: Tester le filtrage par période pour suggestions

**Données d'entrée**:
```json
{
  "localisation": "amerique-centrale-caraibes",
  "destination": "Cuba",
  "dateDepart": "2025-09-15",
  "temperature": ["chaude"],
  "saison": ["automne"]
}
```

**Résultats attendus**:
- ✅ Suggestion "🌪️ Cyclones / Ouragans" affichée
- ✅ Raison : "Caraïbes entre juin-novembre → saison cyclonique"
- ✅ Badge priorité "HAUTE"

**Test négatif (hors période)**:
```json
{
  "localisation": "amerique-centrale-caraibes",
  "dateDepart": "2025-02-15", // Février = hors saison cyclonique
  "temperature": ["temperee"],
  "saison": ["hiver"]
}
```

**Résultat attendu**: ❌ Aucune suggestion de cyclones (hors période 6-11)

---

### Test 6️⃣ : "Accepter tout" - Multiple suggestions

**Objectif**: Vérifier le bouton "Accepter toutes les suggestions"

**Données d'entrée**:
```json
{
  "localisation": "afrique",
  "destination": "Sahara",
  "temperature": ["tres-chaude"],
  "saison": ["ete"],
  "activites": ["randonnee", "camping"]
}
```

**Résultats attendus**:
- ✅ Suggestions multiples : `climat_canicule`, `climat_sec_aride`, `climat_uv_eleves`
- ✅ Bouton "✨ Accepter toutes les suggestions" visible
- ✅ Clic → ajoute les 3 conditions d'un coup
- ✅ Le panel se vide après acceptation

---

## 🏔️ Tests des Destinations Spécifiques (Backend Only)

### Test 7️⃣ : Items Désert (automatiques)

**Objectif**: Vérifier que les items désert s'ajoutent automatiquement (pas visibles dans le formulaire)

**Données d'entrée**:
```json
{
  "destination": "Désert du Sahara",
  "localisation": "afrique",
  "activites": ["randonnee"],
  "temperature": ["tres-chaude"],
  "saison": ["ete"]
}
```

**Résultats attendus**:
- ✅ Section "🏜️ Équipement Désert" ajoutée automatiquement dans le PDF
- ✅ Items spécifiques : gourde grande capacité, sel de réhydratation, vêtements anti-sable
- ✅ **IMPORTANT**: Ces items NE sont PAS visibles dans Step2Info (backend only)
- ✅ Trigger basé sur `destinations: ["afrique", "moyen-orient"]` + activité `randonnee`

**Points de vérification**:
1. La section désert doit apparaître dans `generatedChecklist.sections`
2. Elle ne doit PAS être dans le formulaire UI
3. Elle doit être dans le PDF généré
4. Le déclencheur doit fonctionner sans sélection manuelle

---

### Test 8️⃣ : Items Jungle (automatiques)

**Données d'entrée**:
```json
{
  "destination": "Amazonie",
  "localisation": "amerique-sud",
  "activites": ["randonnee", "camping"],
  "temperature": ["chaude"],
  "saison": ["ete"]
}
```

**Résultats attendus**:
- ✅ Section "🌴 Équipement Jungle" ajoutée automatiquement
- ✅ Items : moustiquaire, anti-malariques, machette pliable, bottes caoutchouc

---

### Test 9️⃣ : Items Montagne/Altitude (> 2500m)

**Données d'entrée**:
```json
{
  "destination": "Népal",
  "localisation": "asie",
  "activites": ["randonnee"],
  "temperature": ["froide"],
  "saison": ["automne"],
  "conditionsClimatiques": ["climat_altitude"]
}
```

**Résultats attendus**:
- ✅ Section "⛰️ Haute Altitude" (items manuels de la condition)
- ✅ Section "🏔️ Équipement Montagne" (items automatiques backend)
- ✅ Items spécifiques montagne : crampons, piolet, corde, lunettes glacier

---

## 📄 Tests de Génération PDF

### Test 🔟 : Structure PDF complète

**Objectif**: Vérifier que le PDF contient toutes les sections générées

**Données d'entrée**:
```json
{
  "nomVoyage": "Aventure Thaïlande",
  "destination": "Thaïlande",
  "localisation": "asie",
  "dateDepart": "2025-07-01",
  "dateRetour": "2025-07-15",
  "temperature": ["chaude"],
  "saison": ["ete"],
  "conditionsClimatiques": ["climat_mousson"],
  "activites": ["plage", "randonnee"],
  "profil": "confort",
  "sectionsInclure": ["all"]
}
```

**Résultats attendus**:
1. ✅ **Page de couverture** avec nom du voyage, destination, dates
2. ✅ **Timeline** avec étapes du voyage
3. ✅ **Sections dynamiques** (dans l'ordre) :
   - Essentiels (toujours inclus)
   - Activités Plage
   - Activités Randonnée
   - 🌧️ Mousson (condition climatique)
4. ✅ **Stats dans le toast** : "X items organisés en Y sections"
5. ✅ **Console log** : Affichage du résumé de la checklist

**Points de vérification**:
- Vérifier que `checklistData.sections.map()` itère correctement
- Chaque section doit avoir : `id`, `nom`, `emoji`, `items[]`
- Les items doivent afficher : checkbox, texte, priorité (étoiles)
- Le PDF doit se télécharger avec le nom `TravelPrep_AventureThaïlande.pdf`

---

### Test 1️⃣1️⃣ : Filtrage par profil (Budget vs Luxe)

**Objectif**: Vérifier que le filtrage par profil fonctionne

**Test A - Profil Budget**:
```json
{
  "profil": "budget",
  "confort": "minimaliste"
}
```
**Résultat attendu**: ❌ Items "luxe" ou "premium" exclus

**Test B - Profil Luxe**:
```json
{
  "profil": "luxe",
  "confort": "premium"
}
```
**Résultat attendu**: ✅ Items premium/luxe inclus, items basiques exclus

---

### Test 1️⃣2️⃣ : Priorités visuelles dans le PDF

**Objectif**: Vérifier l'affichage des priorités

**Résultats attendus**:
- ✅ Priorité "haute" → ⭐⭐⭐ (rouge)
- ✅ Priorité "moyenne" → ⭐⭐ (orange)
- ✅ Priorité "basse" → ⭐ (bleu)

**Code à vérifier**:
```typescript
const getPriorityStars = (priorite: string) => {
  const p = priorite?.toLowerCase() || '';
  if (p.includes('haute') || p.includes('⭐⭐⭐')) return '⭐⭐⭐';
  if (p.includes('moyenne') || p.includes('⭐⭐')) return '⭐⭐';
  return '⭐';
};
```

---

## 🔗 Tests d'Intégration Complète

### Test 1️⃣3️⃣ : Workflow complet (Step 1 → PDF)

**Objectif**: Parcours utilisateur complet

**Étapes**:
1. **Step 1 - Destination**
   - Sélectionner "Asie" → "Thaïlande"
   - Dates : 15 juillet → 30 juillet 2025
   - Type : "Vacances"

2. **Step 2 - Informations voyage**
   - Température : "Chaude", "Très chaude"
   - Saison : "Été"
   - ✅ Vérifier apparition SuggestionsPanel
   - ✅ Accepter suggestion "Mousson"

3. **Step 3 - Activités**
   - Sélectionner : "Plage", "Randonnée", "Sports nautiques"

4. **Step 4 - Profil**
   - Profil : "Confort"
   - Préférences : Confort standard

5. **Step 5 - Options**
   - Sections : Toutes cochées
   - Email : optionnel

6. **Génération PDF**
   - Cliquer "Générer le PDF"
   - ✅ Toast de succès avec stats
   - ✅ Console log avec résumé
   - ✅ Téléchargement automatique

**Validation finale**:
- Ouvrir le PDF
- Vérifier présence de toutes les sections
- Vérifier que les items sont pertinents (mousson, plage, randonnée)
- Vérifier que les conseils d'expert sont présents
- Vérifier la mise en forme (emojis, priorités, checkboxes)

---

### Test 1️⃣4️⃣ : Cas limite - Aucune condition climatique

**Objectif**: Vérifier le comportement sans conditions climatiques

**Données d'entrée**:
```json
{
  "conditionsClimatiques": ["climat_aucune"]
}
```

**Résultats attendus**:
- ✅ Pas de section climatique dans le PDF
- ✅ Seules les sections essentiels + activités présentes
- ✅ Pas d'erreur lors de la génération
- ✅ Le PDF se génère normalement

---

### Test 1️⃣5️⃣ : Cas limite - Multi-destinations

**Objectif**: Vérifier le comportement avec plusieurs pays

**Données d'entrée**:
```json
{
  "localisation": "multi-destinations",
  "destination": "Europe (France, Italie, Suisse)"
}
```

**Résultats attendus**:
- ✅ Les filtres géographiques s'appliquent de manière permissive
- ✅ Les suggestions automatiques sont désactivées (trop ambigu)
- ✅ Seules les conditions manuelles sont prises en compte

---

## 🎯 Checklist de Validation Finale

Avant de merger sur `main`, valider :

### ✅ Fonctionnalités Core
- [ ] Génération de checklist avec `generateCompleteChecklist()`
- [ ] Filtrage intelligent par destination, activité, période
- [ ] Suggestions automatiques non-forcées
- [ ] Items destination-spécifiques (backend only)
- [ ] Génération PDF avec toutes les sections

### ✅ Qualité du Code
- [ ] Aucun warning TypeScript
- [ ] Aucune erreur dans la console
- [ ] Tous les imports fonctionnent
- [ ] Types correctement définis (`GeneratedChecklist`, `GeneratedChecklistSection`)

### ✅ UI/UX
- [ ] SuggestionsPanel s'affiche correctement
- [ ] Boutons "Accepter" / "Ignorer" fonctionnent
- [ ] Toast de succès avec statistiques
- [ ] PDF téléchargé avec bon nom de fichier

### ✅ Données
- [ ] `checklistComplete.json` : metadata correcte (195 pays)
- [ ] `checklist_climat_meteo_v3.json` : mapping supprimé ✅
- [ ] Tous les IDs utilisent le format `climat_xxx`

### ✅ Git
- [ ] Tous les commits sont sur la branche feature
- [ ] Messages de commit clairs et descriptifs
- [ ] Pas de fichiers temporaires commités
- [ ] Ready pour merge vers `main`

---

## 🚀 Prochaines Étapes (Post-Tests)

Une fois tous les tests validés :

1. **Merger vers main**
   ```bash
   git checkout main
   git merge claude/analyze-climate-json-compatibility-01Q7or3ztuzMP4rHy1L29AeG
   git push origin main
   ```

2. **Discussion BDD**
   - Connexion avec base de données
   - Sauvegarde des checklists générées
   - Authentification utilisateurs

3. **Génération PDF Server-Side**
   - API endpoint pour génération PDF
   - Stockage sur serveur (S3, CloudStorage)
   - Email automatique avec PDF

4. **Automatisation**
   - CI/CD pour tests automatiques
   - Déploiement automatique
   - Monitoring et analytics

---

**Date de création** : 2025-11-14
**Version** : 1.0
**Auteur** : Claude (TravelPrep Team)
