# 📖 Guide de Procédure de Tests - TravelPrep

> Guide étape par étape pour exécuter les 50 scénarios de test

---

## 🎯 Objectif

Valider que **toutes** les fonctionnalités de TravelPrep fonctionnent correctement après les corrections apportées :
1. ✅ Suggestions automatiques de conditions climatiques
2. ✅ Emoji 📌 persistant lors de la navigation
3. ✅ Nombre de conditions dans récapitulatif
4. ✅ Génération PDF sans erreur
5. ✅ Sélection automatique "aucune condition"

---

## 🛠️ Préparation

### 1. Environnement de Test

```bash
# 1. Naviguer vers le projet
cd /path/to/TravelPrep

# 2. Installer les dépendances (si nécessaire)
npm install

# 3. Lancer l'application en mode développement
npm run dev

# 4. Ouvrir l'application
# L'URL sera affichée dans le terminal (généralement http://localhost:5173)
```

### 2. Outils Nécessaires

- ✅ Navigateur moderne (Chrome, Firefox, Safari, Edge)
- ✅ Console développeur ouverte (F12 ou Cmd+Option+I)
- ✅ Feuille de suivi des tests (voir section "Rapport")
- ✅ Outil de capture d'écran (pour documenter les bugs)

### 3. État Initial

Avant chaque test :
1. Rafraîchir la page (F5 ou Cmd+R)
2. Vider la console (icône 🚫 dans DevTools)
3. Vérifier qu'aucune erreur n'est présente au chargement

---

## 📋 Procédure de Test Standard

### Étape 1 : Remplissage Step 1 (Destination)

```
1. Cliquer sur "Commencer"
2. Remplir "Nom du voyage" : [Selon scénario]
3. Sélectionner "Destination" : [Selon scénario]
4. Sélectionner "Pays" : [Selon scénario]
   - Cliquer sur le champ de recherche
   - Taper le nom du pays
   - Cliquer sur le pays dans la liste
   - Répéter pour chaque pays
5. Sélectionner "Date de départ" : [Selon scénario]
6. Sélectionner "Date de retour" : [Selon scénario]
7. Cliquer sur "Suivant"
```

**✅ Validation Step 1:**
- [ ] Tous les champs sont remplis
- [ ] Dates cohérentes (retour après départ)
- [ ] Bouton "Suivant" actif et fonctionnel

---

### Étape 2 : Vérification Step 2 (Informations Climatiques)

```
1. Attendre chargement de Step 2 (1-2 secondes)
2. OBSERVER sans cliquer :
   - Disclaimer climatique (si applicable)
   - Saisons auto-sélectionnées (vérifier valeur)
   - Températures auto-sélectionnées (vérifier valeur)
   - Conditions climatiques avec emoji 📌
```

**✅ Validation Step 2:**
- [ ] Auto-détection saisons fonctionne
- [ ] Auto-détection températures fonctionne
- [ ] Emoji 📌 visible sur conditions recommandées
- [ ] Nombre de conditions avec 📌 correspond aux attentes
- [ ] Disclaimer affiché (si multi-destinations ou long voyage)

**📸 À capturer:**
- Screenshot des conditions climatiques avec 📌

---

### Étape 3 : Test Navigation Aller-Retour

```
1. SANS modifier quoi que ce soit à Step 2
2. Cliquer "Suivant" → Step 3
3. Cliquer "Suivant" → Step 4
4. Cliquer "Suivant" → Step 5
5. Cliquer "Précédent" x3 → Retour Step 2
6. VÉRIFIER : Les emoji 📌 sont toujours présents
```

**✅ Validation Navigation:**
- [ ] Emoji 📌 toujours présent après navigation
- [ ] Sélections préservées
- [ ] Aucune erreur dans la console

---

### Étape 4 : Remplissage Step 3 (Activités)

```
1. Sélectionner activités : [Selon scénario]
2. Cliquer "Suivant"
```

**✅ Validation Step 3:**
- [ ] Activités sélectionnées correctement
- [ ] Passage à Step 4 sans erreur

---

### Étape 5 : Remplissage Step 4 (Profil)

```
1. Sélectionner "Type de voyage" : [Selon scénario, défaut: Solo]
2. Sélectionner "Profil" : [Selon scénario, défaut: Solo]
3. Si Famille : Remplir nombre d'enfants et âges
4. Sélectionner "Confort" : [Défaut: Modéré]
5. Cliquer "Suivant"
```

**✅ Validation Step 4:**
- [ ] Profil sélectionné
- [ ] Champs famille affichés si nécessaire
- [ ] Passage à Step 5 sans erreur

---

### Étape 6 : Vérification Step 5 (Récapitulatif + Options)

```
1. VÉRIFIER le récapitulatif :
   - Nom du voyage ✅
   - Dates ✅
   - Destination + drapeaux pays ✅
   - Saisons + emoji ✅
   - Températures + emoji ✅
   - ⚠️ CONDITIONS CLIMATIQUES :
     * Nombre affiché : "X sélectionnée(s)"
     * Emojis des conditions sous le nombre
     * Vérifier que nombre = nombre d'emojis
   - Activités : "X sélectionnée(s)" + emojis ✅
   - Profil + détails ✅
   - Type de voyage ✅
   - Confort ✅

2. Vérifier sections à inclure (par défaut toutes cochées)
3. Sélectionner format PDF : [Défaut: Compact]
4. Cliquer "Suivant"
```

**✅ Validation Step 5 - CRITIQUE:**
- [ ] **Nombre de conditions = nombre d'emojis affichés**
- [ ] Tous les champs du récapitulatif présents
- [ ] Emojis conditions bien alignés à droite
- [ ] Si "aucune condition" : ❌ + "Aucune condition particulière"

**📸 À capturer:**
- Screenshot du récapitulatif complet (preuve du nombre de conditions)

---

### Étape 7 : Génération PDF Step 6

```
1. Remplir informations :
   - Prénom : Test
   - Nom : User
   - Email : test@example.com

2. ATTENDRE le chargement du PDF (5-10 secondes)

3. OBSERVER la console développeur :
   - Rechercher "getPriorityStyle" → NE DOIT PAS EXISTER
   - Rechercher "Invalid" → NE DOIT PAS EXISTER
   - Rechercher "ReferenceError" → NE DOIT PAS EXISTER

4. VÉRIFIER l'aperçu PDF :
   - PDF visible (pas de page blanche)
   - Contenu affiché
   - Conditions climatiques listées (si format détaillé)
```

**✅ Validation Step 6 - CRITIQUE:**
- [ ] **Console SANS erreur "getPriorityStyle"**
- [ ] **Console SANS erreur "Invalid '' string child"**
- [ ] PDF visible et complet
- [ ] Pas de page blanche après chargement
- [ ] Temps de chargement < 10 secondes

**📸 À capturer:**
- Screenshot de la console (preuve absence d'erreurs)
- Screenshot du PDF généré

---

## 🧪 Exécution des Tests

### Tests Climatiques (Test 1-30)

Pour chaque test climatique :

1. **Préparer** : Lire le scénario dans `TESTS_COMPLETS_40_SCENARIOS.md`
2. **Exécuter** : Suivre la procédure standard ci-dessus
3. **Valider** : Vérifier que les conditions attendues ont 📌
4. **Documenter** : Remplir le tableau de suivi

#### Exemple : Test 1 - Mousson Vietnam

```yaml
Scénario:
  Destination: Asie
  Pays: Vietnam, Thaïlande
  Date: 15 juillet 2025 → 30 août 2025
  Température: Très chaude
  Saison: Été
  Activités: Backpacking, Randonnée

Conditions attendues avec 📌:
  - 🌧️ Saison des pluies / Mousson
  - 🏝️ Climat tropical humide
  - 💧 Humidité extrême (>85%)
  - ⛈️ Orages tropicaux fréquents
```

**Procédure:**
1. Step 1 : Remplir selon scénario
2. Step 2 : **VÉRIFIER** que les 4 conditions ont 📌
3. Step 3-6 : Compléter normalement
4. **VALIDER** : 4 conditions dans récapitulatif Step 5

**Critères de réussite:**
- ✅ 4/4 conditions avec 📌
- ✅ Récapitulatif affiche "4 sélectionnée(s)"
- ✅ 4 emojis affichés (🌧️ 🏝️ 💧 ⛈️)
- ✅ PDF généré sans erreur

---

### Tests Non-Régression (NR-1 à NR-10)

#### NR-3 : Emoji 📌 ne disparaît PAS (CRITIQUE)

**Procédure spécifique:**
```
1. Remplir Step 1 avec Vietnam, juillet 2025
2. Aller Step 2, NOTER les conditions avec 📌:
   - Prendre screenshot
   - Compter le nombre : ____ conditions

3. Navigation complète:
   - Cliquer "Suivant" → Step 3
   - Cliquer "Suivant" → Step 4
   - Cliquer "Suivant" → Step 5
   - Cliquer "Précédent" → Step 4
   - Cliquer "Précédent" → Step 3
   - Cliquer "Précédent" → Step 2

4. COMPARER :
   - Prendre nouveau screenshot
   - Compter le nombre : ____ conditions
   - Vérifier que c'est identique

5. Aller jusqu'à Step 6, revenir Step 2
6. VÉRIFIER ENCORE : 📌 toujours présent
```

**Critères de réussite:**
- ✅ Même nombre de 📌 avant et après navigation
- ✅ Même conditions recommandées
- ✅ 📌 présent même après Step 6

---

#### NR-6 : PDF sans erreur (CRITIQUE)

**Procédure spécifique:**
```
1. Remplir formulaire complet (Vietnam, juillet 2025)
2. Step 6 : Remplir email
3. OUVRIR la console développeur (F12)
4. VIDER la console (cliquer 🚫)
5. ATTENDRE 10 secondes le chargement du PDF
6. INSPECTER la console :
   - Rechercher "Error" → compter
   - Rechercher "getPriorityStyle" → NE DOIT PAS EXISTER
   - Rechercher "Invalid" → NE DOIT PAS EXISTER

7. VÉRIFIER le DOM :
   - Aperçu PDF visible (pas div vide)
   - Scroll fonctionne dans le PDF
   - Pages visibles
```

**Critères de réussite:**
- ✅ 0 erreur "getPriorityStyle"
- ✅ 0 erreur "Invalid '' string child"
- ✅ PDF affiché correctement
- ✅ Console propre (warnings acceptables)

---

### Tests Cas Limites (CL-1 à CL-5)

#### CL-2 : Date retour avant départ

**Procédure:**
```
1. Step 1 :
   - Nom : "Test dates"
   - Destination : Europe
   - Pays : France
   - Date départ : 15 juin 2025
   - Date retour : 1er juin 2025 (AVANT départ)

2. OBSERVER le comportement :
   - Message d'erreur ?
   - Correction automatique ?
   - Bouton "Suivant" bloqué ?

3. DOCUMENTER le comportement observé
```

**Résultats possibles:**
- ✅ Message d'erreur clair
- ✅ Correction automatique (retour = départ + 1j)
- ❌ Crash de l'application
- ❌ Accepte dates incohérentes

---

### Tests Intégration (INT-1 à INT-5)

#### INT-1 : Parcours complet

**Procédure complète:**
```
[10 minutes chronométrées]

1. Démarrer chronomètre

2. Step 1 :
   - Nom : "Vacances Vietnam"
   - Destination : Asie
   - Pays : Vietnam
   - Date : 15 juillet 2025 → 30 août 2025
   - Suivant

3. Step 2 :
   - Vérifier auto-suggestions (📌)
   - Ne rien modifier
   - Suivant

4. Step 3 :
   - Sélectionner : Randonnée, Plage
   - Suivant

5. Step 4 :
   - Profil : Solo
   - Confort : Modéré
   - Suivant

6. Step 5 :
   - Vérifier récapitulatif
   - Format : Compact
   - Suivant

7. Step 6 :
   - Email : test@example.com
   - Attendre génération PDF
   - TÉLÉCHARGER le PDF (bouton download)

8. Arrêter chronomètre

9. OUVRIR le PDF téléchargé :
   - Vérifier qu'il s'ouvre
   - Compter le nombre de pages
   - Vérifier présence conditions climatiques
```

**Critères de réussite:**
- ✅ Parcours complet < 10 minutes
- ✅ PDF téléchargé et ouvrable
- ✅ Contenu cohérent avec formulaire
- ✅ Aucun blocage pendant le parcours

---

## 📊 Rapport de Test

### Template de Rapport

```markdown
# Rapport de Tests TravelPrep
**Date :** [JJ/MM/AAAA]
**Testeur :** [Nom]
**Version :** [Numéro commit]
**Navigateur :** [Chrome 120 / Firefox 121 / Safari 17]

---

## 📈 Résumé Exécutif

| Catégorie | Tests | Passés | Échoués | Taux |
|-----------|-------|--------|---------|------|
| Climatiques | 30 | X | Y | XX% |
| Non-Régression | 10 | X | Y | XX% |
| Cas Limites | 5 | X | Y | XX% |
| Intégration | 5 | X | Y | XX% |
| **TOTAL** | **50** | **X** | **Y** | **XX%** |

---

## ✅ Tests Réussis

### Test 1 : Mousson Vietnam
- ✅ 4/4 conditions avec 📌
- ✅ Récapitulatif correct
- ✅ PDF généré
- **Durée :** 3 min

[Répéter pour chaque test réussi]

---

## ❌ Tests Échoués

### Test X : [Nom]
- ❌ Problème : [Description]
- 🐛 Erreur : [Message d'erreur]
- 📸 Capture : [Lien screenshot]
- 🔄 Reproduction :
  1. [Étape 1]
  2. [Étape 2]
  ...
- 🎯 Sévérité : **Haute / Moyenne / Basse**
- 💡 Solution proposée : [Si connue]

[Répéter pour chaque test échoué]

---

## ⚠️ Observations

### Points Positifs
- [Liste des bonnes choses observées]

### Points d'Amélioration
- [Liste des améliorations possibles]

### Bugs Mineurs
- [Liste des petits bugs non bloquants]

---

## 🎯 Recommandations

### Actions Immédiates
1. [Action prioritaire 1]
2. [Action prioritaire 2]

### Actions à Moyen Terme
1. [Amélioration 1]
2. [Amélioration 2]

---

## 📎 Annexes

### Screenshots
- [Lien Drive/Imgur avec tous les screenshots]

### Logs Console
- [Logs d'erreurs si pertinent]

### Vidéos
- [Enregistrement écran si bug complexe]
```

---

## 🎯 Critères de Validation Finaux

### ✅ Validation Minimale (MVP)

L'application est considérée comme **fonctionnelle** si :

1. **90%+ des tests passent** (45/50 minimum)
2. **100% des tests non-régression passent** (10/10 obligatoire)
3. **Aucune erreur bloquante** (crashes, pages blanches)
4. **PDF se génère** pour tous les scénarios climatiques

### 🌟 Validation Optimale

L'application est considérée comme **excellente** si :

1. **100% des tests passent** (50/50)
2. **Console sans aucune erreur** (même warnings)
3. **Performance < 3s** pour génération PDF
4. **Tous les emoji 📌** présents et persistants
5. **UX fluide** (transitions, feedbacks)

---

## 🚨 Procédure d'Urgence

### Si Erreur Bloquante

```
1. ARRÊTER les tests
2. DOCUMENTER l'erreur :
   - Screenshot
   - Message d'erreur complet
   - Étapes de reproduction
3. OUVRIR un ticket GitHub :
   - Titre : [BUG] Description courte
   - Corps : Template bug report
   - Labels : bug, priority-high
4. NOTIFIER le développeur
```

### Si Taux de Réussite < 90%

```
1. ANALYSER les patterns :
   - Type d'erreurs récurrentes
   - Catégorie de tests affectée
2. REGROUPER les bugs similaires
3. PRIORISER :
   - Haute : Erreurs PDF, crashes
   - Moyenne : Suggestions incorrectes
   - Basse : UX mineure
4. CRÉER un plan d'action
```

---

## 📚 Ressources

### Fichiers de Référence
- `TESTS_COMPLETS_40_SCENARIOS.md` - Scénarios détaillés
- `SCENARIOS_TEST_CONDITIONS_CLIMATIQUES.md` - Scénarios v1
- `ANALYSE_NON_REGRESSION.md` - Analyse précédente

### Contacts
- **Développeur Principal :** [Nom]
- **Product Owner :** [Nom]
- **Support Technique :** [Email/Slack]

### Outils
- **Chrome DevTools :** F12
- **React DevTools :** Extension Chrome/Firefox
- **Screenshot :** Cmd+Shift+4 (Mac) / Win+Shift+S (Windows)
- **Enregistrement écran :** Cmd+Shift+5 (Mac) / Xbox Game Bar (Windows)

---

## ✍️ Bonnes Pratiques

1. **Tester dans l'ordre** - Ne pas sauter d'étapes
2. **Un test = un refresh** - Repartir de zéro
3. **Console toujours ouverte** - Surveiller les erreurs
4. **Screenshots systématiques** - Preuves visuelles
5. **Noter immédiatement** - Ne pas faire confiance à la mémoire
6. **Pause régulière** - 10 tests → pause 5 min
7. **Reporting continu** - Ne pas attendre la fin

---

## 🎓 Formation Testeur

### Checklist Compétences Requises

- [ ] Connaissance basique HTML/CSS/JavaScript
- [ ] Utilisation Chrome DevTools (Console, Network)
- [ ] Compréhension des scénarios de test
- [ ] Rédaction rapport de bug
- [ ] Reproduction d'erreurs
- [ ] Évaluation de sévérité

### Temps Estimé Formation
- **Débutant :** 2-3 heures (formation + 10 tests supervisés)
- **Intermédiaire :** 1 heure (consignes + 5 tests supervisés)
- **Expert :** 30 min (lecture consignes)

---

**🎯 Objectif Final : Garantir une expérience utilisateur sans faille avec des suggestions climatiques précises et un PDF généré correctement à chaque fois !**
