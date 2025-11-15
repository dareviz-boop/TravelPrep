import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection } from '@/utils/checklistGenerator';

// Fonction utilitaire pour nettoyer les emojis et caractères spéciaux
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  // Remplace les emojis et autres caractères spéciaux par des équivalents texte ou les supprime
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Supprime les emojis
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Supprime les symboles divers
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Supprime les dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Supprime les sélecteurs de variation
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supprime les emojis supplémentaires
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Supprime les emoticons
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Supprime les symboles de transport
    .replace(/[\u{E000}-\u{F8FF}]/gu, '')   // Supprime les caractères de la zone privée
    .replace(/[\u{2190}-\u{21FF}]/gu, '')   // Supprime les flèches
    .trim();
};

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
    if (p.includes('haute')) return 'HAUTE';
    if (p.includes('moyenne')) return 'MOY';
    if (p.includes('basse')) return 'BASSE';
    return 'MOY'; // Default to medium
  };

  const getPriorityStyle = (priorite: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute') || p.includes('⭐⭐⭐')) return styles.priorityHigh;
    if (p.includes('moyenne') || p.includes('⭐⭐')) return styles.priorityMedium;
    return styles.priorityLow;
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{cleanTextForPDF(title)}</Text>

      {category.items.map((item, index) => (
        <View style={styles.item} key={item.id || `item-${index}`}>
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
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
