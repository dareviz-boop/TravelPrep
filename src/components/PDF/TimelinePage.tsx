import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';

// Fonction utilitaire pour nettoyer certains caractères spéciaux problématiques
// ✨ GARDONS les emojis pour plus de personnalité dans le PDF !
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    // Normaliser les guillemets typographiques
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    // Normaliser les tirets
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    // 🎨 Les emojis sont maintenant CONSERVÉS !
    // Seulement supprimer les variation selectors qui peuvent causer des problèmes
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .trim();
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
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
    marginBottom: 12,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 8
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 6,
    backgroundColor: '#f9fafb',
    padding: 4,
    borderLeft: '3px solid #E85D2A'
  },
  categoryTitle: {
    fontSize: 8,
    fontWeight: 600,
    color: '#6b7280',
    marginTop: 6,
    marginBottom: 4,
    marginLeft: 5
  },
  item: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 5
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1px solid #111827',
    marginRight: 6,
    marginTop: 1
  },
  itemText: {
    flex: 1,
    fontSize: 8,
    color: '#374151'
  },
  deadline: {
    fontSize: 7,
    color: '#6b7280',
    width: 60,
    textAlign: 'right'
  },
  priority: {
    fontSize: 7,
    fontWeight: 600,
    width: 45,
    textAlign: 'center'
  },
  priorityHigh: {
    color: '#ef4444'
  },
  priorityMedium: {
    color: '#f59e0b'
  },
  priorityLow: {
    color: '#3b82f6'
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
      section.items.forEach(item => {
        const itemWithSection: TimelineItem = {
          ...item,
          sectionName: section.nom,
          sectionEmoji: section.emoji
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

  const getPriorityStars = (priorite?: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute')) return 'HAUTE';
    if (p.includes('moyenne')) return 'MOYENNE';
    if (p.includes('basse')) return 'BASSE';
    return 'MOYENNE';
  };

  const getPriorityStyle = (priorite?: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute')) return styles.priorityHigh;
    if (p.includes('basse')) return styles.priorityLow;
    return styles.priorityMedium;
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

          return (
            <View key={categoryName}>
              <Text style={styles.categoryTitle}>
                {emoji} {cleanTextForPDF(categoryName)}
              </Text>
              {categoryItems.map((item, index) => (
                <View style={styles.item} key={`${item.id || index}-${item.item}`}>
                  <View style={styles.checkbox} />
                  <Text style={styles.itemText}>
                    {cleanTextForPDF(item.item)}
                  </Text>
                  {item.priorite && (
                    <Text style={[styles.priority, getPriorityStyle(item.priorite)]}>
                      {getPriorityStars(item.priorite)}
                    </Text>
                  )}
                  {item.delai && formData.dateDepart && (
                    <Text style={styles.deadline}>
                      {calculateDeadline(formData.dateDepart, item.delai)}
                    </Text>
                  )}
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
      <Text style={styles.title}>Timeline de Preparation</Text>

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
    </Page>
  );
};
