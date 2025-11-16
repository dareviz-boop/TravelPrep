import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem } from '@/utils/checklistGenerator';

// Fonction utilitaire pour nettoyer certains caractères spéciaux problématiques
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
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
  item: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 5
  },
  priorityEmoji: {
    fontSize: 8,
    marginRight: 3
  },
  checkbox: {
    width: 6,
    height: 6,
    border: '1px solid #111827',
    marginRight: 5,
    marginTop: 1
  },
  itemText: {
    flex: 1,
    fontSize: 7,
    color: '#374151',
    lineHeight: 1.3
  }
});

interface CompactPageProps {
  formData: FormData;
  checklistData: GeneratedChecklist;
}

export const CompactPage = ({ formData, checklistData }: CompactPageProps) => {
  const getPriorityEmoji = (priorite?: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute')) return '🔥';
    if (p.includes('basse')) return '🌱';
    return '☀️'; // moyenne
  };

  // Fonction pour extraire le numéro de jours du délai
  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Trier les items par ordre chronologique
  const sortItemsByDelay = (items: ChecklistItem[]): ChecklistItem[] => {
    return [...items].sort((a, b) => {
      const delayA = extractDelayNumber(a.delai);
      const delayB = extractDelayNumber(b.delai);
      return delayB - delayA; // Ordre décroissant : J-90 avant J-7
    });
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Checklist Compacte</Text>

      {checklistData.sections.map((section) => {
        if (!section.items || section.items.length === 0) return null;

        const sortedItems = sortItemsByDelay(section.items);

        return (
          <View style={styles.section} key={section.id} wrap={false}>
            <Text style={styles.sectionTitle}>
              {section.emoji} {cleanTextForPDF(section.nom)}
            </Text>
            {sortedItems.map((item, index) => (
              <View style={styles.item} key={item.id || `item-${index}`}>
                {item.priorite && (
                  <Text style={styles.priorityEmoji}>
                    {getPriorityEmoji(item.priorite)}
                  </Text>
                )}
                <View style={styles.checkbox} />
                <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </Page>
  );
};
