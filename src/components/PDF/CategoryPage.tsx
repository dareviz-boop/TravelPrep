import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection } from '@/utils/checklistGenerator';

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
    fontFamily: 'Helvetica', // 🔧 FIX: Utiliser Helvetica au lieu d'Inter
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#E85D2A', // 🎨 Orange Dareviz
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
