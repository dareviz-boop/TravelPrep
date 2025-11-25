import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';
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
  section: {
    marginBottom: 14,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 10
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    padding: 5,
    borderLeft: '3px solid #E85D2A'
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#E85D2A',
    marginTop: 12,
    marginBottom: 10,
    marginLeft: 5
  },
  categoryTitleMustHave: {
    fontSize: 14,
    fontWeight: 700,
    color: '#E85D2A',
    marginTop: 12,
    marginBottom: 10,
    marginLeft: 5,
    backgroundColor: '#FEF3F0',
    padding: 4,
    borderLeft: '2px solid #E85D2A'
  },
  item: {
    flexDirection: 'row',
    marginBottom: 4
  },
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 8
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2
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
  // Encart daté avec fond gris et date à droite
  dateGroupContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    padding: 6,
    paddingRight: 8,
    borderRadius: 2
  },
  // Colonne gauche : items
  dateGroupItems: {
    flex: 1,
    paddingRight: 8
  },
  // Colonne droite : date alignée en haut
  dateGroupDateColumn: {
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
  }
});

interface TimelineItem extends ChecklistItem {
  sectionName: string;
  sectionEmoji?: string;
  sectionSource?: 'core' | 'activite' | 'climat' | 'destination_specifique';
  category?: 'must-have' | 'interesting';
  moment?: string;
}

interface TimelineContentProps {
  formData: FormData;
  checklistData: GeneratedChecklist;
  isDetailed?: boolean;
  showTitle?: boolean;
}

export const TimelineContent = ({ formData, checklistData, isDetailed = false, showTitle = true }: TimelineContentProps) => {
  const organizeItemsByTimeline = () => {
    const timelines: {
      j90_j60: TimelineItem[];
      j30_j14: TimelineItem[];
      j7_j3: TimelineItem[];
      j2_j1: TimelineItem[];
      other: TimelineItem[];
      surPlace: TimelineItem[];
    } = {
      j90_j60: [],
      j30_j14: [],
      j7_j3: [],
      j2_j1: [],
      other: [],
      surPlace: []
    };

    checklistData.sections.forEach(section => {
      if (isDetailed && section.source === 'activite') {
        return;
      }

      section.items.forEach(item => {
        const itemWithSection: TimelineItem = {
          ...item,
          sectionName: section.nom,
          sectionEmoji: section.emoji,
          sectionSource: section.source,
          category: section.category,
          moment: item.moment
        };

        if (item.moment) {
          timelines.surPlace.push(itemWithSection);
          return;
        }

        const delai = item.delai?.toUpperCase() || '';

        if (delai.includes('J-90') || delai.includes('J-60')) {
          timelines.j90_j60.push(itemWithSection);
        } else if (delai.includes('J-30') || delai.includes('J-21') || delai.includes('J-14')) {
          timelines.j30_j14.push(itemWithSection);
        } else if (delai.includes('J-7') || delai.includes('J-3')) {
          timelines.j7_j3.push(itemWithSection);
        } else if (delai.includes('J-2') || delai.includes('J-1')) {
          timelines.j2_j1.push(itemWithSection);
        } else if (delai) {
          timelines.other.push(itemWithSection);
        }
      });
    });

    return timelines;
  };

  const isHighPriority = (priorite?: string): boolean => {
    const p = priorite?.toLowerCase() || '';
    return p.includes('haute');
  };

  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const sortItemsByDelay = (items: TimelineItem[]): TimelineItem[] => {
    return [...items].sort((a, b) => {
      const delayA = extractDelayNumber(a.delai);
      const delayB = extractDelayNumber(b.delai);
      return delayB - delayA;
    });
  };

  // Catégories essentielles (documents, santé, finances)
  const ESSENTIAL_CATEGORIES = ['documents', 'sante', 'finances'];

  const renderTimelineSection = (items: TimelineItem[], title: string) => {
    if (items.length === 0) return null;

    const itemsByCategory: { [categoryName: string]: TimelineItem[] } = {};

    items.forEach(item => {
      const categoryName = item.sectionName || 'Autres';
      if (!itemsByCategory[categoryName]) {
        itemsByCategory[categoryName] = [];
      }
      itemsByCategory[categoryName].push(item);
    });

    const sortedCategories = Object.keys(itemsByCategory).sort((a, b) => {
      if (a.toLowerCase().includes('essentiel')) return -1;
      if (b.toLowerCase().includes('essentiel')) return 1;
      return a.localeCompare(b);
    });

    return (
      <View style={styles.section} key={title}>
        <Text style={styles.sectionTitle}>{cleanTextForPDF(title)}</Text>
        {sortedCategories.map(categoryName => {
          const categoryItems = itemsByCategory[categoryName];
          const emoji = categoryItems[0]?.sectionEmoji || '';
          const sortedCategoryItems = sortItemsByDelay(categoryItems);
          const isMustHave = categoryItems[0]?.category === 'must-have';
          const categoryTitleStyle = isMustHave ? styles.categoryTitleMustHave : styles.categoryTitle;

          // Vérifier si cette catégorie fait partie des essentiels absolus
          const isEssentialCategory = ESSENTIAL_CATEGORIES.some(essential =>
            categoryName.toLowerCase().includes(essential)
          );

          // Grouper par date UNIQUEMENT pour les sections essentielles
          if (isEssentialCategory) {
            const itemsByDate: { [date: string]: TimelineItem[] } = {};
            sortedCategoryItems.forEach(item => {
              const deadline = item.delai && formData.dateDepart
                ? calculateDeadline(formData.dateDepart, item.delai)
                : 'no-date';
              if (!itemsByDate[deadline]) {
                itemsByDate[deadline] = [];
              }
              itemsByDate[deadline].push(item);
            });

            return (
              <View key={categoryName}>
                <Text style={categoryTitleStyle}>
                  {emoji} {cleanTextForPDF(categoryName)}
                </Text>
                {Object.entries(itemsByDate).map(([deadline, dateItems]) => {
                  // Structure: fond gris avec items à gauche, date à droite alignée avec le premier élément
                  if (deadline !== 'no-date') {
                    return (
                      <View key={`${categoryName}-${deadline}`} style={styles.dateGroupContainer}>
                        {/* Colonne gauche: tous les items */}
                        <View style={styles.dateGroupItems}>
                          {dateItems.map((item, index) => {
                            const shouldShowConseil = isDetailed && item.conseils && item.sectionSource !== 'activite';

                            return shouldShowConseil ? (
                              <View style={styles.itemWithConseil} key={`${item.id || index}-${item.item}`}>
                                <View style={styles.itemRow}>
                                  {isHighPriority(item.priorite) && (
                                    <Text style={styles.prioritySymbol}>!!</Text>
                                  )}
                                  <View style={styles.checkbox} />
                                  <Text style={styles.itemText}>
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
                              <View style={styles.item} key={`${item.id || index}-${item.item}`}>
                                {isHighPriority(item.priorite) && (
                                  <Text style={styles.prioritySymbol}>!!</Text>
                                )}
                                <View style={styles.checkbox} />
                                <Text style={styles.itemText}>
                                  {cleanTextForPDF(item.item)}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                        {/* Colonne droite: date alignée en haut */}
                        <View style={styles.dateGroupDateColumn}>
                          <Text style={styles.dateLabel}>{deadline}</Text>
                        </View>
                      </View>
                    );
                  } else {
                    // Items sans date
                    return (
                      <View key={`${categoryName}-${deadline}`}>
                        {dateItems.map((item, index) => {
                          const shouldShowConseil = isDetailed && item.conseils && item.sectionSource !== 'activite';

                          return shouldShowConseil ? (
                            <View style={styles.itemWithConseil} key={`${item.id || index}-${item.item}`}>
                              <View style={styles.itemRow}>
                                {isHighPriority(item.priorite) && (
                                  <Text style={styles.prioritySymbol}>!!</Text>
                                )}
                                <View style={styles.checkbox} />
                                <Text style={styles.itemText}>
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
                            <View style={styles.item} key={`${item.id || index}-${item.item}`}>
                              {isHighPriority(item.priorite) && (
                                <Text style={styles.prioritySymbol}>!!</Text>
                              )}
                              <View style={styles.checkbox} />
                              <Text style={styles.itemText}>
                                {cleanTextForPDF(item.item)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  }
                })}
              </View>
            );
          } else {
            // Pour les autres catégories, pas de dates
            return (
              <View key={categoryName}>
                <Text style={categoryTitleStyle}>
                  {emoji} {cleanTextForPDF(categoryName)}
                </Text>
                {sortedCategoryItems.map((item, index) => {
                  const shouldShowConseil = isDetailed && item.conseils && item.sectionSource !== 'activite';

                  return shouldShowConseil ? (
                    <View style={styles.itemWithConseil} key={`${item.id || index}-${item.item}`}>
                      <View style={styles.itemRow}>
                        {isHighPriority(item.priorite) && (
                          <Text style={styles.prioritySymbol}>!!</Text>
                        )}
                        <View style={styles.checkbox} />
                        <Text style={styles.itemText}>
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
                    <View style={styles.item} key={`${item.id || index}-${item.item}`}>
                      {isHighPriority(item.priorite) && (
                        <Text style={styles.prioritySymbol}>!!</Text>
                      )}
                      <View style={styles.checkbox} />
                      <Text style={styles.itemText}>
                        {cleanTextForPDF(item.item)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          }
        })}
      </View>
    );
  };

  const renderSurPlaceSection = (items: TimelineItem[]) => {
    if (items.length === 0) return null;

    const itemsByMoment: { [moment: string]: TimelineItem[] } = {};
    items.forEach(item => {
      const moment = item.moment || 'Autre';
      if (!itemsByMoment[moment]) {
        itemsByMoment[moment] = [];
      }
      itemsByMoment[moment].push(item);
    });

    const momentOrder = ['Arrivée', 'J1-J2', 'Début voyage', 'Quotidien', 'Quotidien soir', 'Quotidien nuit', 'Soir', 'Avant dormir', 'Repas', 'Tous les 3-5 jours', 'Continu', 'Autre'];
    const sortedMoments = Object.keys(itemsByMoment).sort((a, b) => {
      const indexA = momentOrder.indexOf(a);
      const indexB = momentOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sur place & Retour</Text>
        {sortedMoments.map(moment => {
          const momentItems = itemsByMoment[moment];
          return (
            <View key={moment}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: '#E85D2A', marginTop: 8, marginBottom: 4, marginLeft: 5 }}>
                {cleanTextForPDF(moment)}
              </Text>
              {momentItems.map((item, index) => {
                const shouldShowConseil = isDetailed && item.conseils;
                return shouldShowConseil ? (
                  <View style={styles.itemWithConseil} key={`${item.id || index}-${item.item}`}>
                    <View style={styles.itemRow}>
                      {isHighPriority(item.priorite) && (
                        <Text style={styles.prioritySymbol}>!!</Text>
                      )}
                      <View style={styles.checkbox} />
                      <Text style={styles.itemText}>
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
                  <View style={styles.item} key={`${item.id || index}-${item.item}`}>
                    {isHighPriority(item.priorite) && (
                      <Text style={styles.prioritySymbol}>!!</Text>
                    )}
                    <View style={styles.checkbox} />
                    <Text style={styles.itemText}>
                      {cleanTextForPDF(item.item)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  const timelines = organizeItemsByTimeline();

  return (
    <>
      {showTitle && (
        <View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
            Timeline de Préparation -{' '}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: 700, color: '#E85D2A' }}>
            Essentiels absolus
          </Text>
        </View>
      )}

      {renderTimelineSection(timelines.j90_j60, 'J-90 à J-60 (3 mois à 2 mois avant)')}
      {renderTimelineSection(timelines.j30_j14, 'J-30 à J-14 (1 mois à 2 semaines avant)')}
      {renderTimelineSection(timelines.j7_j3, 'J-7 à J-3 (1 semaine avant)')}
      {renderTimelineSection(timelines.j2_j1, 'J-2 à J-1 (48h avant le départ)')}
      {renderTimelineSection(timelines.other, 'Autres éléments')}
      {renderSurPlaceSection(timelines.surPlace)}
    </>
  );
};
