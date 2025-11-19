import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';
import { PDFIcon } from './PDFIcon';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
// Helvetica ne supporte PAS les emojis Unicode, ils apparaissent corrompus
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    // Normaliser les guillemets typographiques
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    // Normaliser les tirets et flèches
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/…/g, '...')
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
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 15
  },
  section: {
    marginBottom: 14,
    borderBottom: '1px solid #e5e7eb',
    borderLeft: '4px solid #E85D2A', // Barre verticale orange
    paddingLeft: 10,
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
    marginBottom: 5,
    paddingLeft: 5
  },
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 12,
    paddingLeft: 5
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 3
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
    fontSize: 9, // ✅ Augmenté de 8 à 9
    color: '#374151',
    lineHeight: 1.4
  },
  conseilContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 18,
    marginTop: 3
  },
  conseilText: {
    fontSize: 8, // ✅ Augmenté de 6.5 à 8
    color: '#616161',
    fontStyle: 'italic',
    lineHeight: 1.3,
    flex: 1
  },
  deadline: {
    fontSize: 7,
    color: '#6b7280',
    width: 60,
    textAlign: 'right'
  },
  prioritySymbol: {
    fontSize: 7,
    fontWeight: 600,
    marginRight: 4,
    color: '#374151'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#9ca3af'
  }
});

interface TimelinePageProps {
  formData: FormData;
  checklistData: GeneratedChecklist;
  isDetailed?: boolean;
}

interface TimelineItem extends ChecklistItem {
  sectionName: string;
  sectionEmoji?: string;
  sectionSource?: 'core' | 'activite' | 'climat' | 'destination_specifique';
  category?: 'must-have' | 'interesting';
}

export const TimelinePage = ({ formData, checklistData, isDetailed = false }: TimelinePageProps) => {
  // Organize items by timeline period based on their deadline
  const organizeItemsByTimeline = () => {
    const timelines: {
      j90_j60: TimelineItem[];
      j30_j14: TimelineItem[];
      j7_j3: TimelineItem[];
      j2_j1: TimelineItem[];
      other: TimelineItem[];
    } = {
      j90_j60: [],
      j30_j14: [],
      j7_j3: [],
      j2_j1: [],
      other: []
    };

    checklistData.sections.forEach(section => {
      // En mode détaillé, exclure les activités de la timeline principale
      if (isDetailed && section.source === 'activite') {
        return; // Skip les sections d'activités
      }

      section.items.forEach(item => {
        const itemWithSection: TimelineItem = {
          ...item,
          sectionName: section.nom,
          sectionEmoji: section.emoji,
          sectionSource: section.source,
          category: section.category
        };

        const delai = item.delai?.toUpperCase() || '';

        // Categorize by deadline
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

  // Fonction pour extraire le numéro de jours du délai (J-90 -> 90)
  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Fonction pour trier les items par ordre chronologique (du plus lointain au plus proche)
  const sortItemsByDelay = (items: TimelineItem[]): TimelineItem[] => {
    return [...items].sort((a, b) => {
      const delayA = extractDelayNumber(a.delai);
      const delayB = extractDelayNumber(b.delai);
      return delayB - delayA; // Ordre décroissant : J-90 avant J-7
    });
  };

  const renderTimelineSection = (items: TimelineItem[], title: string) => {
    if (items.length === 0) return null;

    // Grouper les items par catégorie
    const itemsByCategory: { [categoryName: string]: TimelineItem[] } = {};

    items.forEach(item => {
      const categoryName = item.sectionName || 'Autres';
      if (!itemsByCategory[categoryName]) {
        itemsByCategory[categoryName] = [];
      }
      itemsByCategory[categoryName].push(item);
    });

    // Trier les catégories : Essentiels d'abord, puis les autres par ordre alphabétique
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

          // Trier les items par ordre chronologique dans cette catégorie
          const sortedCategoryItems = sortItemsByDelay(categoryItems);

          // Déterminer le style selon la catégorie
          const isMustHave = categoryItems[0]?.category === 'must-have';
          const categoryTitleStyle = isMustHave ? styles.categoryTitleMustHave : styles.categoryTitle;

          // Grouper les items par date calculée
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
              {Object.entries(itemsByDate).map(([deadline, dateItems]) => (
                <View key={`${categoryName}-${deadline}`}>
                  {/* Afficher la date une seule fois pour le groupe */}
                  {deadline !== 'no-date' && (
                    <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 4, marginLeft: 5, fontWeight: 600 }}>
                      {deadline}
                    </Text>
                  )}
                  {dateItems.map((item, index) => {
                    // Vérifier si on doit afficher le conseil
                    const shouldShowConseil = isDetailed && item.conseils && item.sectionSource !== 'activite';

                    return shouldShowConseil ? (
                      // Item avec conseil
                      <View style={styles.itemWithConseil} key={`${item.id || index}-${item.item}`}>
                        <View style={styles.itemRow}>
                          {isHighPriority(item.priorite) && (
                            <PDFIcon name="flame" style={{ marginRight: 4, marginTop: 1 }} />
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
                      // Item sans conseil
                      <View style={styles.item} key={`${item.id || index}-${item.item}`}>
                        {isHighPriority(item.priorite) && (
                          <PDFIcon name="flame" style={{ marginRight: 4, marginTop: 1 }} />
                        )}
                        <View style={styles.checkbox} />
                        <Text style={styles.itemText}>
                          {cleanTextForPDF(item.item)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  const timelines = organizeItemsByTimeline();

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
          Timeline de Preparation - {' '}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: 700, color: '#E85D2A' }}>
          Essentiels absolus
        </Text>
      </View>

      {renderTimelineSection(
        timelines.j90_j60,
        'J-90 à J-60 (3 mois à 2 mois avant)'
      )}

      {renderTimelineSection(
        timelines.j30_j14,
        'J-30 à J-14 (1 mois à 2 semaines avant)'
      )}

      {renderTimelineSection(
        timelines.j7_j3,
        'J-7 à J-3 (1 semaine avant)'
      )}

      {renderTimelineSection(
        timelines.j2_j1,
        'J-2 à J-1 (48h avant le départ)'
      )}

      {renderTimelineSection(
        timelines.other,
        'Autres éléments'
      )}

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};
