import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { filterItemsByConditions } from '@/utils/filterItems';

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
  category: any;
  title: string;
}

export const CategoryPage = ({ formData, category, title }: CategoryPageProps) => {
  if (!category?.items) return null;

  const filteredItems = category.items.filter((item: any) =>
    filterItemsByConditions(item, formData)
  );

  if (filteredItems.length === 0) return null;

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

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>📄 {title}</Text>
      
      {filteredItems.map((item: any) => (
        <View style={styles.item} key={item.id}>
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{item.nom}</Text>
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
