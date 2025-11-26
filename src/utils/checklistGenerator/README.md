# Module checklistGenerator

Ce module a été divisé en plusieurs fichiers pour améliorer la maintenabilité et l'organisation du code.

## Structure

```
checklistGenerator/
├── README.md                   # Ce fichier
├── types.ts                    # Tous les types et interfaces (146 lignes)
├── deduplication.ts            # Constantes et fonctions de déduplication (193 lignes)
├── utils.ts                    # Fonctions utilitaires (158 lignes)
├── exporters.ts                # Fonctions d'export (CSV, JSON, Summary) (63 lignes)
└── index.ts                    # Point d'entrée principal et fonctions de génération (1078 lignes)
```

## Modules

### 📋 types.ts
Contient toutes les définitions de types et interfaces :
- `ItemFiltres`, `RawChecklistItem`
- `ProfilVoyageurSection`, `ProfilVoyageursData`
- `AppItem`, `AppCategory`
- `CoreSection`, `CoreSectionsData`
- `ActivityData`, `ActivitesData`
- `ChecklistItem`, `GeneratedChecklistSection`, `GeneratedChecklist`

### 🔄 deduplication.ts
Gère la déduplication des items :
- `DEDUP_KEYWORDS` : Dictionnaire de ~100 entrées pour identifier les doublons
- `extractDeduplicationKey()` : Extrait la clé de déduplication d'un item
- `deduplicateCrossSections()` : Déduplique entre sections différentes
- `deduplicateSections()` : Déduplique au sein d'une même section

### 🛠️ utils.ts
Fonctions utilitaires réutilisables :
- `mapStarsToPriority()` : Convertit ⭐⭐⭐ en "haute"
- `normalizeAge()`, `ageMatches()` : Gestion des âges enfants
- `mapClimatItemToSection()` : Catégorise les items climatiques
- `areItemsSimilar()` : Détecte la similarité entre items
- `mergeClimatItemsIntoSection()` : Fusionne items climatiques
- `calculateStats()` : Calcule les statistiques de la checklist

### 📤 exporters.ts
Fonctions d'export dans différents formats :
- `getChecklistSummary()` : Résumé textuel de la checklist
- `exportChecklistJSON()` : Export JSON
- `exportChecklistCSV()` : Export CSV

### 🏠 index.ts
Point d'entrée principal :
- Importe tous les modules
- Contient `generateCompleteChecklist()` (fonction principale)
- Contient les fonctions de génération de sections :
  - `getCoreSections()`
  - `getActivitesSections()`
  - `getProfilVoyageursSections()`
  - `getClimatItemsGroupedBySection()`
  - `filterByProfile()`
- Ré-exporte tous les types et fonctions pour compatibilité

## Utilisation

```typescript
// Import depuis le module
import { generateCompleteChecklist, ChecklistItem, GeneratedChecklist } from '@/utils/checklistGenerator';

// Ou import de fonctions spécifiques
import { deduplicateSections, DEDUP_KEYWORDS } from '@/utils/checklistGenerator/deduplication';
import { calculateStats } from '@/utils/checklistGenerator/utils';
import { exportChecklistCSV } from '@/utils/checklistGenerator/exporters';
```

## Avantages de cette structure

1. **Maintenabilité** : Chaque fichier a une responsabilité claire
2. **Lisibilité** : Plus facile de naviguer et comprendre le code
3. **Testabilité** : Chaque module peut être testé indépendamment
4. **Réutilisabilité** : Les fonctions utilitaires sont facilement réutilisables
5. **Performance** : Meilleure organisation pour le tree-shaking du bundler

## Migration depuis l'ancienne version

L'ancien fichier `checklistGenerator.ts` monolithique (1078 lignes) a été :
- Sauvegardé dans `checklistGenerator.ts.backup`
- Divisé en 5 fichiers modulaires
- Les imports restent identiques grâce aux ré-exports dans `index.ts`

**Aucun changement de code n'est nécessaire dans les fichiers qui importent ce module.**
