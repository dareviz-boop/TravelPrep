import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';
import { PDFIcon } from './PDFIcon';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
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
    // eslint-disable-next-line no-useless-escape
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
  // Titre principal en deux parties
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  titlePart1: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827'
  },
  titlePart2: {
    fontSize: 16,
    fontWeight: 700,
    color: '#E85D2A'
  },
  // Bloc de timeline (J-90 à J-60, etc.)
  timelineBlock: {
    marginBottom: 10
    // Ne pas utiliser breakInside: 'avoid' pour permettre la pagination
  },
  timelineHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 5,
    borderLeft: '4px solid #E85D2A',
    backgroundColor: '#FFF5F0'
  },
  // Titre de catégorie (Documents, Santé, etc.)
  categoryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 8,
    marginTop: 10,
    paddingLeft: 6
  },
  // Encart daté avec fond gris et date à droite
  datedBoxContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    padding: 6,
    paddingRight: 8,
    borderRadius: 2,
    breakInside: 'avoid' as any
  },
  // Colonne gauche : items
  datedBoxItems: {
    flex: 1,
    paddingRight: 8
  },
  // Colonne droite : date alignée en haut
  datedBoxDateColumn: {
    width: 75,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 2
  },
  dateLabel: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 600,
    textAlign: 'right'
  },
  // Item de checklist avec conseil
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 6,
    breakInside: 'avoid' as any
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  // Item de checklist sans conseil
  item: {
    flexDirection: 'row',
    marginBottom: 4,
    breakInside: 'avoid' as any
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
  // Conseil sans indentation, démarre sous la checkbox
  conseilContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1,
    paddingLeft: 16 // Aligné avec le texte après la checkbox (8px checkbox + 8px margin)
  },
  conseilText: {
    fontSize: 9,
    color: '#616161',
    fontStyle: 'italic',
    lineHeight: 1.3,
    flex: 1
  },
  prioritySymbol: {
    fontSize: 8,
    fontWeight: 700,
    marginRight: 5,
    color: '#DC2626'
  },
  // Séparateur entre grandes sections (pour démarcation)
  sectionSeparator: {
    marginTop: 30,
    marginBottom: 15
  },
  // Groupe titre + items pour éviter les orphelins
  titleWithItemsGroup: {
    breakInside: 'avoid' as any
  }
});

interface DetailedSectionsPageProps {
  formData: FormData;
  sections: GeneratedChecklistSection[];
  titlePart1: string;  // "Timeline de Préparation - " ou "À Prévoir - "
  titlePart2: string;  // "Essentiels absolus" ou "Sélection conseillée"
  isEssentials?: boolean; // true pour les essentiels absolus
  addSeparator?: boolean; // Ajouter un séparateur avant le titre
}

// Catégories essentielles (avec dates précises)
const ESSENTIAL_CATEGORIES = ['documents', 'finances', 'sante'];

// Ordre des sections tel qu'affiché en step 5 (basé sur checklistComplete.json)
const SECTION_ORDER = [
  'documents', 'finances', 'sante', // Essentiels absolus
  'bagages', 'hygiene', 'tech', 'domicile', 'transport', 'reservations',
  'urgence', 'apps', 'pendant_apres'
];

// Interface pour un item avec sa section
interface ItemWithSection extends ChecklistItem {
  sectionName: string;
  sectionId: string;
}

export const DetailedSectionsPage = ({
  formData,
  sections,
  titlePart1,
  titlePart2,
  isEssentials = false,
  addSeparator = false
}: DetailedSectionsPageProps) => {
  if (!sections || sections.length === 0) return null;

  const isHighPriority = (priorite?: string): boolean => {
    const p = priorite?.toLowerCase() || '';
    return p.includes('haute');
  };

  // Extraire le numéro de jours du délai
  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Trier les items par délai
  const sortItemsByDelay = (items: ItemWithSection[]): ItemWithSection[] => {
    return [...items].sort((a, b) => {
      const delayA = extractDelayNumber(a.delai);
      const delayB = extractDelayNumber(b.delai);
      return delayB - delayA; // J-90 avant J-7
    });
  };

  // Organiser tous les items par période de préparation
  const organizeAllItemsByTimeline = () => {
    const timelines: {
      j90_j60: ItemWithSection[];
      j30_j14: ItemWithSection[];
      j7_j3: ItemWithSection[];
      j2_j1: ItemWithSection[];
      noDelay: ItemWithSection[];
      pendantApres: ItemWithSection[]; // Items "Pendant & Après" avec moment
    } = {
      j90_j60: [],
      j30_j14: [],
      j7_j3: [],
      j2_j1: [],
      noDelay: [],
      pendantApres: []
    };

    sections.forEach(section => {
      section.items.forEach(item => {
        const itemWithSection: ItemWithSection = {
          ...item,
          sectionName: section.nom,
          sectionId: section.id
        };

        // Si l'item a un "moment" (Pendant & Après), le mettre dans une section spéciale
        if ((item as any).moment) {
          timelines.pendantApres.push(itemWithSection);
          return;
        }

        const delai = item.delai?.toUpperCase() || '';

        if (!delai) {
          timelines.noDelay.push(itemWithSection);
        } else if (delai.includes('J-90') || delai.includes('J-60')) {
          timelines.j90_j60.push(itemWithSection);
        } else if (delai.includes('J-30') || delai.includes('J-21') || delai.includes('J-14')) {
          timelines.j30_j14.push(itemWithSection);
        } else if (delai.includes('J-7') || delai.includes('J-3')) {
          timelines.j7_j3.push(itemWithSection);
        } else if (delai.includes('J-2') || delai.includes('J-1')) {
          timelines.j2_j1.push(itemWithSection);
        } else {
          timelines.noDelay.push(itemWithSection);
        }
      });
    });

    return timelines;
  };

  // Rendre un item (avec ou sans conseil)
  const renderItem = (item: ItemWithSection, index: number, showActivityTitle: boolean = false) => {
    const hasConseil = item.conseils && item.conseils.trim().length > 0;

    return hasConseil ? (
      <View style={styles.itemWithConseil} key={item.id || `item-${index}`} wrap={false}>
        <View style={styles.itemRow}>
          {isHighPriority(item.priorite) && (
            <Text style={styles.prioritySymbol}>!!</Text>
          )}
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>
            {showActivityTitle && `[${cleanTextForPDF(item.sectionName)}] `}
            {cleanTextForPDF(item.item)}
          </Text>
        </View>
        <View style={styles.conseilContainer}>
          <PDFIcon name="lightbulb" style={{ marginRight: 4, marginTop: 1 }} />
          <Text style={styles.conseilText}>
            {cleanTextForPDF(item.conseils)}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.item} key={item.id || `item-${index}`} wrap={false}>
        {isHighPriority(item.priorite) && (
          <Text style={styles.prioritySymbol}>!!</Text>
        )}
        <View style={styles.checkbox} />
        <Text style={styles.itemText}>
          {showActivityTitle && `[${cleanTextForPDF(item.sectionName)}] `}
          {cleanTextForPDF(item.item)}
        </Text>
      </View>
    );
  };

  // Rendre une période de timeline pour les ESSENTIELS (avec dates et fond gris)
  const renderTimelinePeriodForEssentials = (items: ItemWithSection[], title: string) => {
    if (items.length === 0) return null;

    // Grouper par catégorie
    const itemsByCategory: { [categoryName: string]: ItemWithSection[] } = {};
    items.forEach(item => {
      const categoryName = item.sectionName || 'Autres';
      if (!itemsByCategory[categoryName]) {
        itemsByCategory[categoryName] = [];
      }
      itemsByCategory[categoryName].push(item);
    });

    return (
      <View style={styles.timelineBlock} key={title}>
        <Text style={styles.timelineHeader}>{cleanTextForPDF(title)}</Text>
        {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => {
          const sortedItems = sortItemsByDelay(categoryItems);

          // Grouper par date précise
          const itemsByDate: { [date: string]: ItemWithSection[] } = {};
          sortedItems.forEach(item => {
            const deadline = item.delai && formData.dateDepart
              ? calculateDeadline(formData.dateDepart, item.delai)
              : 'no-date';
            if (!itemsByDate[deadline]) {
              itemsByDate[deadline] = [];
            }
            itemsByDate[deadline].push(item);
          });

          const dateEntries = Object.entries(itemsByDate);

          return (
            <View key={categoryName}>
              {/* Afficher le titre de catégorie une seule fois */}
              <Text style={styles.categoryTitle}>{cleanTextForPDF(categoryName)}</Text>

              {dateEntries.map(([deadline, dateItems]) => {
                // Structure: fond gris avec items à gauche, date à droite alignée avec le premier élément
                if (deadline !== 'no-date') {
                  return (
                    <View key={`${categoryName}-${deadline}`} style={styles.datedBoxContainer} wrap={false}>
                      {/* Colonne gauche: tous les items */}
                      <View style={styles.datedBoxItems}>
                        {dateItems.map((item, idx) => renderItem(item, idx, false))}
                      </View>
                      {/* Colonne droite: date alignée en haut */}
                      <View style={styles.datedBoxDateColumn}>
                        <Text style={styles.dateLabel}>{deadline}</Text>
                      </View>
                    </View>
                  );
                } else {
                  // Items sans date
                  return (
                    <View key={`${categoryName}-${deadline}`}>
                      {dateItems.map((item, idx) => renderItem(item, idx, false))}
                    </View>
                  );
                }
              })}
            </View>
          );
        })}
      </View>
    );
  };

  // Rendre une période de timeline pour les AUTRES (timeline uniquement, pas de dates)
  const renderTimelinePeriodForOthers = (items: ItemWithSection[], title: string) => {
    if (items.length === 0) return null;

    const sortedItems = sortItemsByDelay(items);

    // Pour les activités, regrouper par activité
    const isActivity = sortedItems.length > 0 && sortedItems[0].sectionName;
    const hasMultipleActivities = new Set(sortedItems.map(i => i.sectionName)).size > 1;

    // Grouper le titre avec les 3 premiers items pour éviter les orphelins
    const firstItems = sortedItems.slice(0, 3);
    const remainingItems = sortedItems.slice(3);

    return (
      <View style={styles.timelineBlock} key={title}>
        {/* Groupe titre + 3 premiers items pour éviter orphelins */}
        <View style={styles.titleWithItemsGroup} wrap={false}>
          <Text style={styles.timelineHeader}>{cleanTextForPDF(title)}</Text>
          {firstItems.map((item, idx) => renderItem(item, idx, hasMultipleActivities))}
        </View>
        {/* Reste des items */}
        {remainingItems.map((item, idx) => renderItem(item, idx + firstItems.length, hasMultipleActivities))}
      </View>
    );
  };

  // Rendre la section "Pendant & Après" organisée par moment
  const renderPendantApresSection = (items: ItemWithSection[]) => {
    if (items.length === 0) return null;

    // Grouper par moment
    const itemsByMoment: { [moment: string]: ItemWithSection[] } = {};
    items.forEach(item => {
      // Vérifier d'abord le moment, puis le delai "Après", sinon "Autre"
      const moment = (item as any).moment || ((item as any).delai === 'Après' ? 'Après' : 'Autre');
      if (!itemsByMoment[moment]) {
        itemsByMoment[moment] = [];
      }
      itemsByMoment[moment].push(item);
    });

    // Ordre des moments
    const momentOrder = [
      'Arrivée',
      'J1-J2',
      'Quotidien',
      'Après'
    ];

    const sortedMoments = Object.keys(itemsByMoment).sort((a, b) => {
      const indexA = momentOrder.indexOf(a);
      const indexB = momentOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Helper pour afficher le libellé du moment
    const getMomentLabel = (m: string) => m === 'Après' ? 'Après le voyage' : m;

    return sortedMoments.map(moment => {
      const momentItems = itemsByMoment[moment];
      const firstItems = momentItems.slice(0, 3);
      const remainingItems = momentItems.slice(3);

      return (
        <View key={moment} style={styles.timelineBlock}>
          {/* Groupe titre + 3 premiers items pour éviter orphelins */}
          <View style={styles.titleWithItemsGroup} wrap={false}>
            <Text style={styles.timelineHeader}>{cleanTextForPDF(getMomentLabel(moment))}</Text>
            {firstItems.map((item, idx) => renderItem(item, idx, false))}
          </View>
          {/* Reste des items */}
          {remainingItems.map((item, idx) => renderItem(item, idx + firstItems.length, false))}
        </View>
      );
    });
  };

  // Déterminer le type de sections (essentiels, recommandées, ou activités)
  const isActivities = sections.length > 0 && sections[0].source === 'activite';

  // Fonction pour rendre les sections recommandées (dans l'ordre de step 5)
  const renderRecommendedSections = () => {
    // Trier les sections selon SECTION_ORDER
    const sortedSections = [...sections].sort((a, b) => {
      const indexA = SECTION_ORDER.indexOf(a.id);
      const indexB = SECTION_ORDER.indexOf(b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return sortedSections.map(section => {
      if (section.items.length === 0) return null;

      // Gestion spéciale pour apps
      if (section.id === 'apps') {
        return (
          <View key={section.id}>
            <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
            {renderAppsWithSubcategories(section.items)}
          </View>
        );
      }

      // Gestion spéciale pour pendant_apres
      if (section.id === 'pendant_apres') {
        const itemsWithSection: ItemWithSection[] = section.items.map(item => ({
          ...item,
          sectionName: section.nom,
          sectionId: section.id
        }));
        return (
          <View key={section.id}>
            <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
            {renderPendantApresSection(itemsWithSection)}
          </View>
        );
      }

      // Autres sections
      const firstItems = section.items.slice(0, 3);
      const remainingItems = section.items.slice(3);

      return (
        <View key={section.id}>
          {/* Groupe titre + 3 premiers items pour éviter orphelins */}
          <View style={styles.titleWithItemsGroup} wrap={false}>
            <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
            {firstItems.map((item, idx) => {
              const itemWithSection: ItemWithSection = {
                ...item,
                sectionName: section.nom,
                sectionId: section.id
              };
              return renderItem(itemWithSection, idx, false);
            })}
          </View>
          {/* Reste des items */}
          {remainingItems.map((item, idx) => {
            const itemWithSection: ItemWithSection = {
              ...item,
              sectionName: section.nom,
              sectionId: section.id
            };
            return renderItem(itemWithSection, idx + firstItems.length, false);
          })}
        </View>
      );
    });
  };

  // Fonction pour rendre les apps avec sous-catégories
  const renderAppsWithSubcategories = (items: ChecklistItem[]) => {
    const appsByCategory: { [key: string]: ChecklistItem[] } = {};
    items.forEach(item => {
      const match = item.item.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const category = match[1].trim();
        if (!appsByCategory[category]) {
          appsByCategory[category] = [];
        }
        appsByCategory[category].push({
          ...item,
          item: match[2].trim()
        });
      } else {
        if (!appsByCategory['Autres']) {
          appsByCategory['Autres'] = [];
        }
        appsByCategory['Autres'].push(item);
      }
    });

    return Object.entries(appsByCategory).map(([category, categoryItems]) => {
      const firstItems = categoryItems.slice(0, 3);
      const remainingItems = categoryItems.slice(3);

      return (
        <View key={category}>
          {/* Groupe titre + 3 premiers items pour éviter orphelins */}
          <View style={styles.titleWithItemsGroup} wrap={false}>
            <Text style={styles.timelineHeader}>{cleanTextForPDF(category)}</Text>
            {firstItems.map((item, idx) => {
              const itemWithSection: ItemWithSection = {
                ...item,
                sectionName: category,
                sectionId: 'apps'
              };
              return renderItem(itemWithSection, idx, false);
            })}
          </View>
          {/* Reste des items */}
          {remainingItems.map((item, idx) => {
            const itemWithSection: ItemWithSection = {
              ...item,
              sectionName: category,
              sectionId: 'apps'
            };
            return renderItem(itemWithSection, idx + firstItems.length, false);
          })}
        </View>
      );
    });
  };

  // Fonction pour rendre les activités
  const renderActivitiesSections = () => {
    return sections.map(section => {
      if (section.items.length === 0) return null;

      const firstItems = section.items.slice(0, 3);
      const remainingItems = section.items.slice(3);

      return (
        <View key={section.id}>
          {/* Groupe titre + 3 premiers items pour éviter orphelins */}
          <View style={styles.titleWithItemsGroup} wrap={false}>
            <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
            {firstItems.map((item, idx) => {
              const itemWithSection: ItemWithSection = {
                ...item,
                sectionName: section.nom,
                sectionId: section.id
              };
              return renderItem(itemWithSection, idx, false);
            })}
          </View>
          {/* Reste des items */}
          {remainingItems.map((item, idx) => {
            const itemWithSection: ItemWithSection = {
              ...item,
              sectionName: section.nom,
              sectionId: section.id
            };
            return renderItem(itemWithSection, idx + firstItems.length, false);
          })}
        </View>
      );
    });
  };

  const timelines = organizeAllItemsByTimeline();

  return (
    <>
      {addSeparator && <View style={styles.sectionSeparator} />}
      <View style={styles.titleContainer}>
        <Text style={styles.titlePart1}>{cleanTextForPDF(titlePart1)}</Text>
        <Text style={styles.titlePart2}>{cleanTextForPDF(titlePart2)}</Text>
      </View>

      {isEssentials ? (
        <>
          {/* Essentiels : avec dates et trait orange */}
          {renderTimelinePeriodForEssentials(timelines.j90_j60, 'J-90 à J-60 (3 mois à 2 mois avant)')}
          {renderTimelinePeriodForEssentials(timelines.j30_j14, 'J-30 à J-14 (1 mois à 2 semaines avant)')}
          {renderTimelinePeriodForEssentials(timelines.j7_j3, 'J-7 à J-3 (1 semaine avant)')}
          {renderTimelinePeriodForEssentials(timelines.j2_j1, 'J-2 à J-1 (48h avant le départ)')}
          {timelines.noDelay.length > 0 && (
            <View>
              {sortItemsByDelay(timelines.noDelay).map((item, idx) => renderItem(item, idx, false))}
            </View>
          )}
        </>
      ) : isActivities ? (
        <>
          {/* Activités : afficher par activité */}
          {renderActivitiesSections()}
        </>
      ) : (
        <>
          {/* Recommandées : afficher par section dans l'ordre de step 5 */}
          {renderRecommendedSections()}
        </>
      )}
    </>
  );
};
