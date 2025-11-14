import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection } from '@/utils/checklistGenerator';

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
  item: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 5
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
    color: '#374151',
    lineHeight: 1.5
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

interface CategoryPageProps {
  formData: FormData;
  category: GeneratedChecklistSection;
  title: string;
}

export const CategoryPage = ({ formData, category, title }: CategoryPageProps) => {
  if (!category?.items || category.items.length === 0) return null;

  const getPriorityStars = (priorite: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute') || p.includes('⭐⭐⭐')) return '⭐⭐⭐';
    if (p.includes('moyenne') || p.includes('⭐⭐')) return '⭐⭐';
    if (p.includes('basse') || p.includes('⭐')) return '⭐';
    return '⭐⭐'; // Default to medium
  };

  const getPriorityStyle = (priorite: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute') || p.includes('⭐⭐⭐')) return styles.priorityHigh;
    if (p.includes('moyenne') || p.includes('⭐⭐')) return styles.priorityMedium;
    return styles.priorityLow;
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{category.emoji || '📄'} {title}</Text>

      {category.items.map((item, index) => (
        <View style={styles.item} key={item.id || `item-${index}`}>
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{item.item}</Text>
          {item.priorite && (
            <Text style={[styles.priority, getPriorityStyle(item.priorite)]}>
              {getPriorityStars(item.priorite)}
            </Text>
          )}
        </View>
      ))}
    </Page>
  );
};
