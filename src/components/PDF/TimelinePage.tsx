import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { filterItemsByConditions, calculateDeadline } from '@/utils/filterItems';

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
  checklistData: any;
}

export const TimelinePage = ({ formData, checklistData }: TimelinePageProps) => {
  const getPriorityStars = (priorite: number) => {
    if (priorite === 3) return '⭐⭐⭐';
    if (priorite === 2) return '⭐⭐';
    return '⭐';
  };

  const getPriorityStyle = (priorite: number) => {
    if (priorite === 3) return styles.priorityHigh;
    if (priorite === 2) return styles.priorityMedium;
    return styles.priorityLow;
  };

  const renderTimelineSection = (category: any, title: string) => {
    if (!category?.items) return null;

    const filteredItems = category.items.filter((item: any) =>
      filterItemsByConditions(item, formData)
    );

    if (filteredItems.length === 0) return null;

    return (
      <View style={styles.section} key={category.id || title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {filteredItems.map((item: any) => (
          <View style={styles.item} key={item.id}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>{item.nom}</Text>
            {item.priorite && (
              <Text style={[styles.priority, getPriorityStyle(item.priorite)]}>
                {getPriorityStars(item.priorite)}
              </Text>
            )}
            {item.delai && (
              <Text style={styles.deadline}>
                {calculateDeadline(formData.dateDepart, item.delai)}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>📅 Timeline de Préparation</Text>
      
      {checklistData.categories.j90_j60 && renderTimelineSection(
        checklistData.categories.j90_j60,
        'J-90 à J-60 (3 mois à 2 mois avant)'
      )}
      
      {checklistData.categories.j30_j14 && renderTimelineSection(
        checklistData.categories.j30_j14,
        'J-30 à J-14 (1 mois à 2 semaines avant)'
      )}
      
      {checklistData.categories.j7_j3 && renderTimelineSection(
        checklistData.categories.j7_j3,
        'J-7 à J-3 (1 semaine avant)'
      )}
      
      {checklistData.categories.j2_j1 && renderTimelineSection(
        checklistData.categories.j2_j1,
        'J-2 à J-1 (48h avant le départ)'
      )}
    </Page>
  );
};
