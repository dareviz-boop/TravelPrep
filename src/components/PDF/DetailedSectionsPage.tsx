import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/checklistUtils';
import { PDFIcon } from './PDFIcon';
import { COLORS } from '@/utils/colors';

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
    .replace(/[=<][^\s\w\d.,;:!?()[\]{}'"/\\-]/g, '')
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
    marginBottom: 8, // ✅ Réduit de 15 à 8pt
    flexWrap: 'wrap'
  },
  titlePart1: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.text.primary
  },
  titlePart2: {
    fontSize: 16,
    fontWeight: 700,
    color: '#C54616'
  },
  // Bloc de timeline (J-90 à J-60, etc.)
  timelineBlock: {
    marginBottom: 6 // ✅ Réduit de 10 à 6pt
    // Ne pas utiliser breakInside: 'avoid' pour permettre la pagination
  },
  timelineHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.text.primary,
    marginBottom: 6, // ✅ Réduit de 10 à 6pt
    paddingLeft: 10,
    paddingVertical: 4, // ✅ Réduit de 5 à 4pt
    borderLeft: '4px solid #C54616',
    backgroundColor: '#FFF5F0'
  },
  // Titre de catégorie (Documents, Santé, etc.)
  categoryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 5, // ✅ Réduit de 8 à 5pt
    marginTop: 6, // ✅ Réduit de 10 à 6pt
    paddingLeft: 6
  },
  // Sous-titre de catégorie (apps, moments pendant/après) - style gris italique
  subCategoryTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.text.tertiary,
    marginBottom: 4, // ✅ Réduit de 5 à 4pt
    marginTop: 5, // ✅ Réduit de 8 à 5pt
    paddingLeft: 10,
    fontStyle: 'italic'
  },
  // Encart daté avec fond gris et date à droite
  datedBoxContainer: {
    flexDirection: 'row',
    marginBottom: 6, // ✅ Réduit de 8 à 6pt
    backgroundColor: '#f5f5f5',
    padding: 5, // ✅ Réduit de 6 à 5pt
    paddingRight: 7, // ✅ Réduit de 8 à 7pt
    borderRadius: 2,
    breakInside: 'avoid' as const
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
    color: COLORS.text.tertiary,
    fontWeight: 600,
    textAlign: 'right'
  },
  // Item de checklist avec conseil
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 7, // ✅ Espacement uniforme entre items (6-8pt)
    breakInside: 'avoid' as const
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 1 // ✅ Espace minimal (1-2pt) avant le conseil
  },
  // Item de checklist sans conseil
  item: {
    flexDirection: 'row',
    marginBottom: 7, // ✅ Espacement uniforme entre items (6-8pt)
    breakInside: 'avoid' as const
  },
  checkbox: {
    width: 8,
    height: 8,
    border: `1px solid ${COLORS.text.primary}`,
    marginRight: 8,
    marginTop: 2
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.text.secondary,
    lineHeight: 1.4
  },
  // Texte de conseil - aligné avec le texte de l'item (pas de fond, juste italic gris)
  conseilContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16 // ✅ Aligné avec le texte de l'item (8px checkbox + 8px marginRight)
  },
  conseilText: {
    fontSize: 8, // ✅ Taille réduite pour distinction visuelle
    color: '#666666', // ✅ Gris moyen
    fontStyle: 'italic',
    lineHeight: 1.4,
    flex: 1
  },
  // Encart gris pour les conseils climatiques en tête de section
  climatConseilsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 7, // ✅ Réduit de 10 à 7pt
    marginBottom: 6, // ✅ Réduit de 10 à 6pt
    borderRadius: 2
  },
  climatConseilItem: {
    fontSize: 9,
    color: COLORS.text.secondary,
    lineHeight: 1.5,
    marginBottom: 2
  },
  prioritySymbol: {
    fontSize: 8,
    fontWeight: 700,
    marginRight: 5,
    color: '#DC2626'
  },
  // Séparateur orange entre grandes sections (pour démarcation)
  sectionSeparator: {
    borderBottom: '3px solid #C54616',
    marginTop: 12, // ✅ Réduit de 20 à 12pt
    marginBottom: 10 // ✅ Réduit de 15 à 10pt
  },
  // Groupe titre + items pour éviter les orphelins
  titleWithItemsGroup: {
    breakInside: 'avoid' as const
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
        if (item.moment) {
          timelines.pendantApres.push(itemWithSection);
          return;
        }

        const delai = item.delai?.toUpperCase() || '';

        if (!delai) {
          timelines.noDelay.push(itemWithSection);
        } else {
          // Extraire le numéro de jours du délai pour une classification précise
          const delayNumber = extractDelayNumber(delai);

          if (delayNumber >= 60) {
            // J-90, J-60, etc.
            timelines.j90_j60.push(itemWithSection);
          } else if (delayNumber >= 14) {
            // J-59 à J-14 (inclut J-45, J-30, J-21, J-14)
            timelines.j30_j14.push(itemWithSection);
          } else if (delayNumber >= 3) {
            // J-13 à J-3 (inclut J-7, J-5, J-3)
            timelines.j7_j3.push(itemWithSection);
          } else if (delayNumber >= 1) {
            // J-2, J-1
            timelines.j2_j1.push(itemWithSection);
          } else {
            // Délai = 0 ou non reconnu
            timelines.noDelay.push(itemWithSection);
          }
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

    const categoryEntries = Object.entries(itemsByCategory);
    const firstCategoryEntry = categoryEntries[0];
    const remainingCategoryEntries = categoryEntries.slice(1);

    // Préparer le premier encart de la première catégorie
    const getFirstCategoryContent = () => {
      if (!firstCategoryEntry) return null;
      const [categoryName, categoryItems] = firstCategoryEntry;
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
      const firstEntry = dateEntries[0];
      const remainingEntries = dateEntries.slice(1);

      return { categoryName, firstEntry, remainingEntries };
    };

    const firstCategoryContent = getFirstCategoryContent();

    return (
      <View style={styles.timelineBlock} key={title}>
        {/* Grouper le titre de période + premier titre de catégorie + premier encart pour éviter les orphelins */}
        <View style={styles.titleWithItemsGroup} wrap={false}>
          <Text style={styles.timelineHeader}>{cleanTextForPDF(title)}</Text>

          {firstCategoryContent && (
            <>
              <Text style={styles.categoryTitle}>{cleanTextForPDF(firstCategoryContent.categoryName)}</Text>
              {firstCategoryContent.firstEntry && (() => {
                const [deadline, dateItems] = firstCategoryContent.firstEntry;
                if (deadline !== 'no-date') {
                  return (
                    <View key={`${firstCategoryContent.categoryName}-${deadline}`} style={styles.datedBoxContainer}>
                      <View style={styles.datedBoxItems}>
                        {dateItems.map((item, idx) => renderItem(item, idx, false))}
                      </View>
                      <View style={styles.datedBoxDateColumn}>
                        <Text style={styles.dateLabel}>{deadline}</Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View key={`${firstCategoryContent.categoryName}-${deadline}`}>
                      {dateItems.map((item, idx) => renderItem(item, idx, false))}
                    </View>
                  );
                }
              })()}
            </>
          )}
        </View>

        {/* Reste des encarts de la première catégorie */}
        {firstCategoryContent && firstCategoryContent.remainingEntries.map(([deadline, dateItems]) => {
          if (deadline !== 'no-date') {
            return (
              <View key={`${firstCategoryContent.categoryName}-${deadline}`} style={styles.datedBoxContainer} wrap={false}>
                <View style={styles.datedBoxItems}>
                  {dateItems.map((item, idx) => renderItem(item, idx, false))}
                </View>
                <View style={styles.datedBoxDateColumn}>
                  <Text style={styles.dateLabel}>{deadline}</Text>
                </View>
              </View>
            );
          } else {
            return (
              <View key={`${firstCategoryContent.categoryName}-${deadline}`}>
                {dateItems.map((item, idx) => renderItem(item, idx, false))}
              </View>
            );
          }
        })}

        {/* Catégories restantes */}
        {remainingCategoryEntries.map(([categoryName, categoryItems]) => {
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
          const firstEntry = dateEntries[0];
          const remainingEntries = dateEntries.slice(1);

          return (
            <View key={categoryName}>
              {/* Grouper le titre avec le premier encart pour éviter les orphelins */}
              {firstEntry && (
                <View style={styles.titleWithItemsGroup} wrap={false}>
                  <Text style={styles.categoryTitle}>{cleanTextForPDF(categoryName)}</Text>
                  {(() => {
                    const [deadline, dateItems] = firstEntry;
                    if (deadline !== 'no-date') {
                      return (
                        <View key={`${categoryName}-${deadline}`} style={styles.datedBoxContainer}>
                          <View style={styles.datedBoxItems}>
                            {dateItems.map((item, idx) => renderItem(item, idx, false))}
                          </View>
                          <View style={styles.datedBoxDateColumn}>
                            <Text style={styles.dateLabel}>{deadline}</Text>
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <View key={`${categoryName}-${deadline}`}>
                          {dateItems.map((item, idx) => renderItem(item, idx, false))}
                        </View>
                      );
                    }
                  })()}
                </View>
              )}

              {/* Reste des encarts datés */}
              {remainingEntries.map(([deadline, dateItems]) => {
                if (deadline !== 'no-date') {
                  return (
                    <View key={`${categoryName}-${deadline}`} style={styles.datedBoxContainer} wrap={false}>
                      <View style={styles.datedBoxItems}>
                        {dateItems.map((item, idx) => renderItem(item, idx, false))}
                      </View>
                      <View style={styles.datedBoxDateColumn}>
                        <Text style={styles.dateLabel}>{deadline}</Text>
                      </View>
                    </View>
                  );
                } else {
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
  const renderPendantApresSection = (items: ItemWithSection[], includeSectionTitle: boolean = false, sectionName?: string) => {
    if (items.length === 0) return null;

    // Grouper par moment
    const itemsByMoment: { [moment: string]: ItemWithSection[] } = {};
    items.forEach(item => {
      // Vérifier d'abord le moment, puis le delai "Après", sinon "Quotidien"
      const moment = item.moment || (item.delai === 'Après' ? 'Après' : 'Quotidien');
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

    return sortedMoments.map((moment, momentIndex) => {
      const momentItems = itemsByMoment[moment];
      const firstItems = momentItems.slice(0, 3);
      const remainingItems = momentItems.slice(3);

      // Si c'est le premier moment et qu'on doit inclure le titre de section, le grouper avec le titre du moment
      const isFirstMoment = momentIndex === 0;

      return (
        <View key={moment} style={styles.timelineBlock}>
          {/* Groupe titre + 3 premiers items pour éviter orphelins */}
          <View style={styles.titleWithItemsGroup} wrap={false}>
            {isFirstMoment && includeSectionTitle && sectionName && (
              <Text style={styles.categoryTitle}>{cleanTextForPDF(sectionName)}</Text>
            )}
            <Text style={styles.subCategoryTitle}>{cleanTextForPDF(getMomentLabel(moment))}</Text>
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
            {renderPendantApresSection(itemsWithSection, true, section.nom)}
          </View>
        );
      }

      // Gestion spéciale pour sections climatiques (source === 'climat')
      // Affiche les conseils en tête dans un encadré gris, puis les équipements en checklist
      if (section.source === 'climat') {
        const hasConseils = section.conseils && section.conseils.trim().length > 0;
        // Formater les conseils : séparer par "." ou "-" pour créer une liste
        const formatClimatConseils = (conseils: string): string[] => {
          if (!conseils) return [];
          // Séparer par "." ou " - " et nettoyer
          return conseils
            .split(/[.]\s*(?=[A-Z])|(?:\s+-\s+)/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => s.endsWith('.') ? s : s + '.');
        };
        const conseilsList = hasConseils ? formatClimatConseils(section.conseils!) : [];
        const firstItems = section.items.slice(0, 3);
        const remainingItems = section.items.slice(3);

        return (
          <View key={section.id}>
            {/* Groupe titre + conseils + premiers items pour éviter orphelins */}
            <View style={styles.titleWithItemsGroup} wrap={false}>
              <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>
              {/* Encadré gris avec les conseils en liste */}
              {hasConseils && (
                <View style={styles.climatConseilsContainer}>
                  {conseilsList.map((conseil, idx) => (
                    <Text key={idx} style={styles.climatConseilItem}>
                      - {cleanTextForPDF(conseil)}
                    </Text>
                  ))}
                </View>
              )}
              {/* Premiers équipements */}
              {firstItems.map((item, idx) => {
                const itemWithSection: ItemWithSection = {
                  ...item,
                  sectionName: section.nom,
                  sectionId: section.id
                };
                return renderItem(itemWithSection, idx, false);
              })}
            </View>
            {/* Reste des équipements */}
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
            <Text style={styles.subCategoryTitle}>{cleanTextForPDF(category)}</Text>
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
        <Text style={styles.titlePart1}>{titlePart1}</Text>
        <Text style={styles.titlePart2}>{titlePart2}</Text>
      </View>

      {isEssentials ? (
        <>
          {/* Essentiels : avec dates et trait orange */}
          {renderTimelinePeriodForEssentials(timelines.j90_j60, 'J-90 à J-60 (3 mois à 2 mois avant)')}
          {renderTimelinePeriodForEssentials(timelines.j30_j14, 'J-30 à J-14 (1 mois à 2 semaines avant)')}
          {renderTimelinePeriodForEssentials(timelines.j7_j3, 'J-7 à J-3 (1 semaine avant)')}
          {renderTimelinePeriodForEssentials(timelines.j2_j1, 'J-2 à J-1 (48h avant le départ)')}
          {timelines.noDelay.length > 0 && (
            <View style={styles.timelineBlock}>
              <Text style={styles.timelineHeader}>Autres recommandations</Text>
              {sortItemsByDelay(timelines.noDelay).map((item, idx) => {
                return renderItem(item, idx, false);
              })}
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
