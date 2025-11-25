import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem, GeneratedChecklistSection } from '@/utils/checklistGenerator';
import { PDFIcon } from './PDFIcon';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
// Helvetica ne supporte PAS les emojis Unicode, ils apparaissent corrompus
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    // SUPPRIMER tous les emojis (plage Unicode complète)
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '')
    .replace(/[\u{1F100}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
    // SUPPRIMER les emojis mal encodés (ex: =Ä, <å, =³)
    // Ces patterns apparaissent quand des emojis UTF-8 sont corrompus
    .replace(/[=<][^\s\w\d.,;:!?()\[\]{}'"\/\\-]/g, '')
    // Normaliser les guillemets typographiques
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    // Normaliser les tirets et flèches
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/…/g, '...')
    // Nettoyer espaces multiples
    .replace(/\s+/g, ' ')
    .trim();
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  // Container pour le titre en deux parties (style détaillé)
  mainSectionTitleContainer: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 14,
    flexWrap: 'wrap'
  },
  // Première partie du titre (noir)
  mainSectionTitlePart1: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827'
  },
  // Deuxième partie du titre (orange, emphase)
  mainSectionTitlePart2: {
    fontSize: 18,
    fontWeight: 700,
    color: '#E85D2A'
  },
  // Barre de séparation orange pleine largeur
  divider: {
    borderBottom: '2px solid #E85D2A',
    marginVertical: 14,
    width: '100%'
  },
  // Jalon temporel (J-90 - J-60, etc.)
  timelineBlock: {
    marginBottom: 18,
    breakInside: 'avoid' as const
  },
  timelineHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827', // ✅ Texte noir au lieu d'orange
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 5,
    borderLeft: '4px solid #E85D2A',
    backgroundColor: '#FFF5F0' // Fond orange pâle conservé
  },
  // Titre de catégorie (Documents & Administratifs, Santé, etc.)
  categoryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 8,
    marginTop: 10,
    paddingLeft: 6
  },
  // Item de checklist
  item: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 10
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1px solid #111827',
    marginRight: 8,
    marginTop: 2
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4
  },
  // Symbole de priorité haute !!
  highPrioritySymbol: {
    fontSize: 10,
    fontWeight: 700,
    color: '#DC2626', // Rouge
    marginRight: 5,
    marginTop: 2
  },
  // Sous-catégorie pour les apps
  subCategoryTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#6B7280',
    marginBottom: 5,
    marginTop: 8,
    paddingLeft: 10,
    fontStyle: 'italic'
  },
  // Groupe catégorie + items (évite les coupures orphelines)
  categoryGroup: {
    breakInside: 'avoid' as const,
    marginBottom: 6
  },
  // Container 2 colonnes pour les apps
  appsColumnsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 4
  },
  // Colonne pour les catégories d'apps (50% de largeur)
  appsCategoryColumn: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 6,
    breakInside: 'avoid' as const
  }
});

interface CompactPageProps {
  formData: FormData;
  checklistData: GeneratedChecklist;
}

// Jalons temporels pour la timeline
const TIMELINE_MILESTONES = [
  { id: 'j90-j60', label: 'J-90 - J-60 (3 mois à 2 mois avant)', min: 60, max: 90 },
  { id: 'j60-j30', label: 'J-60 - J-30 (2 mois à 1 mois avant)', min: 30, max: 60 },
  { id: 'j30-j7', label: 'J-30 - J-7 (1 mois à 1 semaine avant)', min: 7, max: 30 },
  { id: 'j7-j1', label: 'J-7 - J-1 (1 semaine à la veille)', min: 1, max: 7 },
  { id: 'j1', label: 'J-1 (la veille du départ)', min: 0, max: 1 }
];

// Catégories pour la section Timeline (essentiels absolus)
const TIMELINE_CATEGORIES = ['documents', 'sante', 'finances'];

// Ordre des sections tel qu'affiché en step 5 (basé sur checklistComplete.json)
const SECTION_ORDER = [
  'documents', 'finances', 'sante', // Essentiels absolus
  'bagages', 'hygiene', 'tech', 'domicile', 'transport', 'reservations',
  'urgence', 'apps', 'pendant_apres'
];

export const CompactPage = ({ formData, checklistData }: CompactPageProps) => {
  // ==========================================
  // FONCTIONS HELPERS
  // ==========================================

  // Extraire le numéro de jours du délai (J-90 → 90)
  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Vérifier la priorité d'un item
  // Les priorités sont déjà converties en texte par mapStarsToPriority() dans checklistGenerator.ts
  const getPriority = (priorite?: string): 'haute' | 'moyenne' | 'basse' => {
    if (!priorite) return 'basse';
    const p = priorite.toLowerCase().trim();
    if (p === 'haute') return 'haute';
    if (p === 'moyenne') return 'moyenne';
    return 'basse';
  };

  // Assigner un item à un jalon temporel
  const getTimelineMilestone = (item: ChecklistItem): string | null => {
    const delay = extractDelayNumber(item.delai);
    const milestone = TIMELINE_MILESTONES.find(m => delay >= m.min && delay <= m.max);
    return milestone ? milestone.id : null;
  };

  // ==========================================
  // SECTION 1: TIMELINE DE PRÉPARATION - ESSENTIELS ABSOLUS
  // ==========================================

  const renderTimelineSection = () => {
    // Filtrer les sections autorisées pour la timeline (documents, santé, finances)
    const timelineSections = checklistData.sections.filter(section =>
      TIMELINE_CATEGORIES.includes(section.id)
    );

    // Récupérer TOUS les items de ces sections (toutes priorités)
    const allItems: Array<{ item: ChecklistItem; sectionId: string; sectionName: string }> = [];
    timelineSections.forEach(section => {
      section.items.forEach(item => {
        allItems.push({
          item,
          sectionId: section.id,
          sectionName: cleanTextForPDF(section.nom)
        });
      });
    });

    if (allItems.length === 0) return null;

    // Grouper par jalons temporels
    const itemsByMilestone: { [key: string]: typeof allItems } = {};
    TIMELINE_MILESTONES.forEach(milestone => {
      itemsByMilestone[milestone.id] = [];
    });

    allItems.forEach(({ item, sectionId, sectionName }) => {
      const milestoneId = getTimelineMilestone(item);
      if (milestoneId && itemsByMilestone[milestoneId]) {
        itemsByMilestone[milestoneId].push({ item, sectionId, sectionName });
      }
    });

    return (
      <>
        <View style={styles.mainSectionTitleContainer}>
          <Text style={styles.mainSectionTitlePart1}>Timeline de Préparation - </Text>
          <Text style={styles.mainSectionTitlePart2}>Essentiels absolus</Text>
        </View>

        {TIMELINE_MILESTONES.map(milestone => {
          const items = itemsByMilestone[milestone.id];
          if (!items || items.length === 0) return null;

          // Grouper par catégorie (Documents, Santé, Finances)
          const itemsByCategory: { [key: string]: typeof items } = {};
          items.forEach(({ item, sectionId, sectionName }) => {
            if (!itemsByCategory[sectionName]) {
              itemsByCategory[sectionName] = [];
            }
            itemsByCategory[sectionName].push({ item, sectionId, sectionName });
          });

          return (
            <View key={milestone.id} style={styles.timelineBlock}>
              <Text style={styles.timelineHeader}>{milestone.label}</Text>

              {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
                <View key={categoryName} style={styles.categoryGroup}>
                  <Text style={styles.categoryTitle}>{categoryName}</Text>
                  {categoryItems.map(({ item }, idx) => {
                    const priority = getPriority(item.priorite);
                    return (
                      <View style={styles.item} key={item.id || `item-${idx}`}>
                        {priority === 'haute' && <Text style={styles.highPrioritySymbol}>!!</Text>}
                        <View style={styles.checkbox} />
                        <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })}
      </>
    );
  };

  // ==========================================
  // SECTION 2: À PRÉVOIR - SÉLECTION CONSEILLÉE
  // ==========================================

  const renderSelectionSection = () => {
    // Filtrer TOUTES les sections qui ne sont ni dans Timeline ni des activités
    const selectionSections = checklistData.sections.filter(section =>
      !TIMELINE_CATEGORIES.includes(section.id) && section.source !== 'activite'
    );

    // Récupérer TOUS les items (toutes priorités) pour chaque section
    const sectionItems: { [sectionId: string]: { section: GeneratedChecklistSection; items: ChecklistItem[] } } = {};

    selectionSections.forEach(section => {
      // Inclure TOUS les items, quelle que soit leur priorité
      if (section.items.length > 0) {
        sectionItems[section.id] = {
          section,
          items: section.items
        };
      }
    });

    if (Object.keys(sectionItems).length === 0) return null;

    // Trier les sections selon l'ordre défini dans SECTION_ORDER
    const sortedSectionEntries = Object.entries(sectionItems).sort(([idA], [idB]) => {
      const indexA = SECTION_ORDER.indexOf(idA);
      const indexB = SECTION_ORDER.indexOf(idB);
      // Si une section n'est pas dans l'ordre, la mettre à la fin
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return (
      <>
        <View style={styles.divider} />
        <View style={styles.mainSectionTitleContainer}>
          <Text style={styles.mainSectionTitlePart1}>À prévoir - </Text>
          <Text style={styles.mainSectionTitlePart2}>Sélection conseillée</Text>
        </View>

        {sortedSectionEntries.map(([sectionId, { section, items }]) => {
          // Gestion spéciale pour la section "apps" avec sous-catégories
          if (sectionId === 'apps') {
            return (
              <View key={sectionId}>
                <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
                {renderAppsWithSubcategories(items)}
              </View>
            );
          }

          // Gestion spéciale pour la section "pendant_apres" organisée par moment
          if (sectionId === 'pendant_apres') {
            return (
              <View key={sectionId}>
                <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
                {renderPendantApresWithMoments(items)}
              </View>
            );
          }

          return (
            <View key={sectionId} style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
              {items.map((item, idx) => {
                const priority = getPriority(item.priorite);
                return (
                  <View style={styles.item} key={item.id || `item-${idx}`}>
                    {priority === 'haute' && <Text style={styles.highPrioritySymbol}>!!</Text>}
                    <View style={styles.checkbox} />
                    <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </>
    );
  };

  // Fonction spéciale pour rendre les apps avec sous-catégories sur 2 colonnes
  const renderAppsWithSubcategories = (items: ChecklistItem[]) => {
    // Grouper les apps par catégorie (Navigation, Hébergement, etc.)
    const appsByCategory: { [key: string]: ChecklistItem[] } = {};

    items.forEach(item => {
      // Extraire la catégorie du texte de l'item (format: "Catégorie: Nom de l'app")
      const match = item.item.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const category = match[1].trim();
        if (!appsByCategory[category]) {
          appsByCategory[category] = [];
        }
        appsByCategory[category].push({
          ...item,
          item: match[2].trim() // Nom de l'app sans la catégorie
        });
      } else {
        // Si pas de catégorie, mettre dans "Autres"
        if (!appsByCategory['Autres']) {
          appsByCategory['Autres'] = [];
        }
        appsByCategory['Autres'].push(item);
      }
    });

    // Rendu en 2 colonnes pour économiser l'espace
    return (
      <View style={styles.appsColumnsContainer}>
        {Object.entries(appsByCategory).map(([category, categoryItems]) => (
          <View key={category} style={styles.appsCategoryColumn}>
            <Text style={styles.subCategoryTitle}>{cleanTextForPDF(category)}</Text>
            {categoryItems.map((item, idx) => (
              <View style={styles.item} key={item.id || `app-${idx}`}>
                <View style={styles.checkbox} />
                <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Fonction spéciale pour rendre pendant_apres organisée par moment
  const renderPendantApresWithMoments = (items: ChecklistItem[]) => {
    // Grouper les items par moment
    const itemsByMoment: { [moment: string]: ChecklistItem[] } = {};
    items.forEach(item => {
      // Vérifier d'abord le moment, puis le delai "Après", sinon "Autre"
      const moment = (item as any).moment || ((item as any).delai === 'Après' ? 'Après' : 'Autre');
      if (!itemsByMoment[moment]) {
        itemsByMoment[moment] = [];
      }
      itemsByMoment[moment].push(item);
    });

    // Ordre des moments
    const momentOrder = ['Arrivée', 'J1-J2', 'Début voyage', 'Quotidien', 'Quotidien soir', 'Quotidien nuit', 'Soir', 'Avant dormir', 'Repas', 'Tous les 3-5 jours', 'Continu', 'Après', 'Autre'];
    const sortedMoments = Object.keys(itemsByMoment).sort((a, b) => {
      const indexA = momentOrder.indexOf(a);
      const indexB = momentOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Helper pour afficher le libellé du moment
    const getMomentLabel = (m: string) => m === 'Après' ? 'Après le voyage' : m;

    return (
      <>
        {sortedMoments.map(moment => {
          const momentItems = itemsByMoment[moment];
          return (
            <View key={moment} style={styles.categoryGroup}>
              <Text style={styles.subCategoryTitle}>{cleanTextForPDF(getMomentLabel(moment))}</Text>
              {momentItems.map((item, idx) => {
                const priority = getPriority(item.priorite);
                return (
                  <View style={styles.item} key={item.id || `moment-${idx}`}>
                    {priority === 'haute' && <Text style={styles.highPrioritySymbol}>!!</Text>}
                    <View style={styles.checkbox} />
                    <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </>
    );
  };

  // ==========================================
  // SECTION 3: À PRÉVOIR - PRÉPARATION ACTIVITÉS
  // ==========================================

  const renderActivitiesSection = () => {
    // Filtrer uniquement les sections d'activités
    const activitySections = checklistData.sections.filter(section => section.source === 'activite');

    if (activitySections.length === 0) return null;

    return (
      <>
        <View style={styles.divider} />
        <View style={styles.mainSectionTitleContainer}>
          <Text style={styles.mainSectionTitlePart1}>À prévoir - </Text>
          <Text style={styles.mainSectionTitlePart2}>Préparation activités</Text>
        </View>

        {activitySections.map(section => {
          if (!section.items || section.items.length === 0) return null;

          return (
            <View key={section.id} style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
              {section.items.map((item, idx) => {
                const priority = getPriority(item.priorite);
                return (
                  <View style={styles.item} key={item.id || `activity-${idx}`}>
                    {priority === 'haute' && <Text style={styles.highPrioritySymbol}>!!</Text>}
                    <View style={styles.checkbox} />
                    <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </>
    );
  };

  // ==========================================
  // SECTION 4: SUR PLACE & RETOUR
  // ==========================================

  const renderSurPlaceSection = () => {
    // Trouver la section "Pendant & Après"
    const surPlaceSection = checklistData.sections.find(
      section => section.id === 'pendant_apres'
    );

    if (!surPlaceSection || surPlaceSection.items.length === 0) return null;

    // Grouper les items par moment
    const itemsByMoment: { [moment: string]: ChecklistItem[] } = {};
    surPlaceSection.items.forEach(item => {
      // Vérifier d'abord le moment, puis le delai "Après", sinon "Autre"
      const moment = (item as any).moment || ((item as any).delai === 'Après' ? 'Après' : 'Autre');
      if (!itemsByMoment[moment]) {
        itemsByMoment[moment] = [];
      }
      itemsByMoment[moment].push(item);
    });

    // Ordre des moments
    const momentOrder = ['Arrivée', 'J1-J2', 'Début voyage', 'Quotidien', 'Quotidien soir', 'Quotidien nuit', 'Soir', 'Avant dormir', 'Repas', 'Tous les 3-5 jours', 'Continu', 'Après', 'Autre'];
    const sortedMoments = Object.keys(itemsByMoment).sort((a, b) => {
      const indexA = momentOrder.indexOf(a);
      const indexB = momentOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Helper pour afficher le libellé du moment
    const getMomentLabel = (m: string) => m === 'Après' ? 'Après le voyage' : m;

    return (
      <>
        <View style={styles.divider} />
        <View style={styles.mainSectionTitleContainer}>
          <Text style={styles.mainSectionTitlePart1}>Sur place & </Text>
          <Text style={styles.mainSectionTitlePart2}>Retour</Text>
        </View>

        {sortedMoments.map(moment => {
          const items = itemsByMoment[moment];
          return (
            <View key={moment}>
              <Text style={styles.categoryTitle}>{cleanTextForPDF(getMomentLabel(moment))}</Text>
              {items.map((item, idx) => {
                const priority = getPriority(item.priorite);
                return (
                  <View style={styles.item} key={item.id || `moment-${idx}`}>
                    {priority === 'haute' && <Text style={styles.highPrioritySymbol}>!!</Text>}
                    <View style={styles.checkbox} />
                    <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </>
    );
  };

  // ==========================================
  // RENDU PRINCIPAL
  // ==========================================

  return (
    <>
      {renderTimelineSection()}
      {renderSelectionSection()}
      {renderActivitiesSection()}
      {/* renderSurPlaceSection() supprimé : pendant_apres intégré dans renderSelectionSection */}
    </>
  );
};
