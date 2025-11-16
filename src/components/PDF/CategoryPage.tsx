import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection } from '@/utils/checklistGenerator';
import { PDFIcon } from './PDFIcon';

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
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 7,
    paddingLeft: 3
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 3
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
    color: '#374151',
    lineHeight: 1.4
  },
  conseilContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 14,
    marginTop: 2
  },
  conseilText: {
    fontSize: 6.5,
    color: '#616161',
    fontStyle: 'italic',
    lineHeight: 1.3,
    flex: 1
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
    if (p.includes('moyenne')) return 'MOYENNE';
    if (p.includes('basse')) return 'BASSE';
    return 'MOYENNE'; // Default to medium
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

      {category.items.map((item, index) => {
        const hasConseil = item.conseils && item.conseils.trim().length > 0;

        return hasConseil ? (
          // Item avec conseil
          <View style={styles.itemWithConseil} key={item.id || `item-${index}`}>
            <View style={styles.itemRow}>
              <View style={styles.checkbox} />
              <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
              {item.priorite && (
                <Text style={[styles.priority, getPriorityStyle(item.priorite)]}>
                  {getPriorityStars(item.priorite)}
                </Text>
              )}
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
          <View style={styles.item} key={item.id || `item-${index}`}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
            {item.priorite && (
              <Text style={[styles.priority, getPriorityStyle(item.priorite)]}>
                {getPriorityStars(item.priorite)}
              </Text>
            )}
          </View>
        );
      })}
    </Page>
  );
};
