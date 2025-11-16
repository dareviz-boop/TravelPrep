import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';

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
  conseilText: {
    fontSize: 6.5,
    color: '#616161',
    marginLeft: 14,
    marginTop: 1,
    fontStyle: 'italic',
    lineHeight: 1.3
  },
  prioritySymbol: {
    fontSize: 7,
    fontWeight: 600,
    marginRight: 4,
    color: '#374151'
  },
  timelineSection: {
    marginBottom: 15,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 10
  },
  timelineSectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 6,
    backgroundColor: '#f9fafb',
    padding: 4,
    borderLeft: '3px solid #E85D2A'
  },
  deadline: {
    fontSize: 7,
    color: '#6b7280',
    width: 60,
    textAlign: 'right'
  }
});

interface CategoryPageProps {
  formData: FormData;
  category: GeneratedChecklistSection;
  title: string;
}

export const CategoryPage = ({ formData, category, title }: CategoryPageProps) => {
  if (!category?.items || category.items.length === 0) return null;

  const getPrioritySymbol = (priorite?: string) => {
    const p = priorite?.toLowerCase() || '';
    if (p.includes('haute')) return '[H]';
    if (p.includes('basse')) return '[B]';
    return '[M]'; // moyenne
  };

  // Fonction pour extraire le numéro de jours du délai (J-90 -> 90)
  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Organiser les items par période timeline
  const organizeItemsByTimeline = () => {
    const timelines: {
      j90_j60: ChecklistItem[];
      j30_j14: ChecklistItem[];
      j7_j3: ChecklistItem[];
      j2_j1: ChecklistItem[];
      noDelay: ChecklistItem[];
    } = {
      j90_j60: [],
      j30_j14: [],
      j7_j3: [],
      j2_j1: [],
      noDelay: []
    };

    category.items.forEach(item => {
      const delai = item.delai?.toUpperCase() || '';

      if (!delai) {
        timelines.noDelay.push(item);
      } else if (delai.includes('J-90') || delai.includes('J-60')) {
        timelines.j90_j60.push(item);
      } else if (delai.includes('J-30') || delai.includes('J-21') || delai.includes('J-14')) {
        timelines.j30_j14.push(item);
      } else if (delai.includes('J-7') || delai.includes('J-3')) {
        timelines.j7_j3.push(item);
      } else if (delai.includes('J-2') || delai.includes('J-1')) {
        timelines.j2_j1.push(item);
      } else {
        timelines.noDelay.push(item);
      }
    });

    return timelines;
  };

  // Fonction pour trier les items par ordre chronologique (du plus lointain au plus proche)
  const sortItemsByDelay = (items: ChecklistItem[]): ChecklistItem[] => {
    return [...items].sort((a, b) => {
      const delayA = extractDelayNumber(a.delai);
      const delayB = extractDelayNumber(b.delai);
      return delayB - delayA; // Ordre décroissant : J-90 avant J-7
    });
  };

  // Fonction pour rendre une section de timeline
  const renderTimelineSection = (items: ChecklistItem[], title: string) => {
    if (items.length === 0) return null;

    const sortedItems = sortItemsByDelay(items);

    return (
      <View style={styles.timelineSection} key={title}>
        <Text style={styles.timelineSectionTitle}>{cleanTextForPDF(title)}</Text>
        {sortedItems.map((item, index) => renderItem(item, index))}
      </View>
    );
  };

  // Fonction pour rendre un item
  const renderItem = (item: ChecklistItem, index: number) => {
    const hasConseil = item.conseils && item.conseils.trim().length > 0;

    return hasConseil ? (
      // Item avec conseil
      <View style={styles.itemWithConseil} key={item.id || `item-${index}`}>
        <View style={styles.itemRow}>
          {item.priorite && (
            <Text style={styles.prioritySymbol}>
              {getPrioritySymbol(item.priorite)}
            </Text>
          )}
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
          {item.delai && formData.dateDepart && (
            <Text style={styles.deadline}>
              {calculateDeadline(formData.dateDepart, item.delai)}
            </Text>
          )}
        </View>
        <Text style={styles.conseilText}>
          💡 {cleanTextForPDF(item.conseils)}
        </Text>
      </View>
    ) : (
      // Item sans conseil
      <View style={styles.item} key={item.id || `item-${index}`}>
        {item.priorite && (
          <Text style={styles.prioritySymbol}>
            {getPrioritySymbol(item.priorite)}
          </Text>
        )}
        <View style={styles.checkbox} />
        <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
        {item.delai && formData.dateDepart && (
          <Text style={styles.deadline}>
            {calculateDeadline(formData.dateDepart, item.delai)}
          </Text>
        )}
      </View>
    );
  };

  const timelines = organizeItemsByTimeline();

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{cleanTextForPDF(title)}</Text>

      {/* Timeline sections */}
      {renderTimelineSection(timelines.j90_j60, 'J-90 à J-60 (3 mois à 2 mois avant)')}
      {renderTimelineSection(timelines.j30_j14, 'J-30 à J-14 (1 mois à 2 semaines avant)')}
      {renderTimelineSection(timelines.j7_j3, 'J-7 à J-3 (1 semaine avant)')}
      {renderTimelineSection(timelines.j2_j1, 'J-2 à J-1 (48h avant le départ)')}

      {/* Items sans délai */}
      {timelines.noDelay.length > 0 && (
        <View>
          <Text style={styles.timelineSectionTitle}>Équipement général</Text>
          {sortItemsByDelay(timelines.noDelay).map((item, index) => renderItem(item, index))}
        </View>
      )}
    </Page>
  );
};
