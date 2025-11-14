import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2563eb',
    marginBottom: 30
  },
  section: {
    marginBottom: 25,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    padding: 8,
    borderLeft: '4px solid #2563eb'
  },
  item: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '2px solid #111827',
    marginRight: 10,
    marginTop: 2
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: '#374151'
  },
  deadline: {
    fontSize: 9,
    color: '#6b7280',
    width: 100,
    textAlign: 'right'
  },
  priority: {
    fontSize: 9,
    fontWeight: 600,
    width: 30,
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
}

interface TimelineItem extends ChecklistItem {
  sectionName: string;
  sectionEmoji?: string;
}

export const TimelinePage = ({ formData, checklistData }: TimelinePageProps) => {
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
    if (p.includes('haute')) return '⭐⭐⭐';
    if (p.includes('moyenne')) return '⭐⭐';
    if (p.includes('basse')) return '⭐';
    return '⭐⭐';
  };

  const getPriorityStyle = (priorite?: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute')) return styles.priorityHigh;
    if (p.includes('basse')) return styles.priorityLow;
    return styles.priorityMedium;
  };

  const renderTimelineSection = (items: TimelineItem[], title: string) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section} key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map((item, index) => (
          <View style={styles.item} key={`${item.id || index}-${item.item}`}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              {item.sectionEmoji && `${item.sectionEmoji} `}
              {item.item}
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
  };

  const timelines = organizeItemsByTimeline();

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>📅 Timeline de Préparation</Text>

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
