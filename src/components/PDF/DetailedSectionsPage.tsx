import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/filterItems';
import { PDFIcon } from './PDFIcon';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/…/g, '...')
    // SUPPRIMER tous les emojis
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
    fontSize: 9,
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  // Titre principal de la page
  mainTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 15,
    textAlign: 'center'
  },
  // Bloc de timeline (J-90 à J-60, etc.)
  timelineBlock: {
    marginBottom: 18,
    break: 'avoid' as any // Empêche la coupure entre pages
  },
  timelineHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 5,
    borderLeft: '4px solid #E85D2A',
    backgroundColor: '#FFF5F0'
  },
  // Titre de catégorie (Documents, Santé, etc.)
  categoryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 8,
    marginTop: 10,
    paddingLeft: 6
  },
  // Encart daté avec barre orange à droite
  datedBox: {
    marginBottom: 6,
    paddingRight: 10,
    borderRight: '4px solid #E85D2A',
    break: 'inside-avoid' as any // Empêche la coupure à l'intérieur
  },
  dateLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: 600,
    textAlign: 'right'
  },
  // Item de checklist avec conseil
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 7, // Réduit de 10 à 7
    paddingLeft: 5,
    break: 'inside-avoid' as any
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  // Item de checklist sans conseil
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 5,
    break: 'inside-avoid' as any
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1px solid #111827',
    marginRight: 8,
    marginTop: 2
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4
  },
  conseilContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 18,
    marginTop: 2 // Réduit de 3 à 2
  },
  conseilText: {
    fontSize: 9,
    color: '#616161',
    fontStyle: 'italic',
    lineHeight: 1.3,
    flex: 1
  },
  prioritySymbol: {
    fontSize: 8,
    fontWeight: 700,
    marginRight: 5,
    color: '#DC2626'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#9ca3af'
  },
  divider: {
    borderBottom: '2px solid #E85D2A',
    marginVertical: 12,
    marginBottom: 15
  }
});

interface DetailedSectionsPageProps {
  formData: FormData;
  sections: GeneratedChecklistSection[];
  title: string;
  isEssentials?: boolean; // true pour les essentiels absolus
}

// Catégories essentielles (avec dates précises)
const ESSENTIAL_CATEGORIES = ['documents', 'finances', 'sante'];

export const DetailedSectionsPage = ({
  formData,
  sections,
  title,
  isEssentials = false
}: DetailedSectionsPageProps) => {
  if (!sections || sections.length === 0) return null;

  const isHighPriority = (priorite?: string): boolean => {
    const p = priorite?.toLowerCase() || '';
    return p.includes('haute');
  };

  // Extraire le numéro de jours du délai
  const extractDelayNumber = (delai?: string): number => {
    if (!delai) return 0;
    const match = delai.match(/J-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Trier les items par délai
  const sortItemsByDelay = (items: ChecklistItem[]): ChecklistItem[] => {
    return [...items].sort((a, b) => {
      const delayA = extractDelayNumber(a.delai);
      const delayB = extractDelayNumber(b.delai);
      return delayB - delayA; // J-90 avant J-7
    });
  };

  // Organiser les items par période de préparation
  const organizeItemsByTimeline = (items: ChecklistItem[]) => {
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

    items.forEach(item => {
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

  // Rendre un item (avec ou sans conseil)
  const renderItem = (item: ChecklistItem, index: number, showDate: boolean = false) => {
    const hasConseil = item.conseils && item.conseils.trim().length > 0;

    const itemContent = hasConseil ? (
      <View style={styles.itemWithConseil} key={item.id || `item-${index}`}>
        <View style={styles.itemRow}>
          {isHighPriority(item.priorite) && (
            <Text style={styles.prioritySymbol}>!!</Text>
          )}
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
        </View>
        <View style={styles.conseilContainer}>
          <PDFIcon name="lightbulb" style={{ marginRight: 4, marginTop: 1 }} />
          <Text style={styles.conseilText}>
            {cleanTextForPDF(item.conseils)}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.item} key={item.id || `item-${index}`}>
        {isHighPriority(item.priorite) && (
          <Text style={styles.prioritySymbol}>!!</Text>
        )}
        <View style={styles.checkbox} />
        <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
      </View>
    );

    // Si on doit afficher une date précise (essentiels seulement)
    if (showDate && item.delai && formData.dateDepart) {
      return (
        <View style={styles.datedBox} key={item.id || `item-${index}`}>
          <Text style={styles.dateLabel}>
            {calculateDeadline(formData.dateDepart, item.delai)}
          </Text>
          {itemContent}
        </View>
      );
    }

    return itemContent;
  };

  // Rendre une section pour les essentiels (avec dates précises)
  const renderEssentialSection = (section: GeneratedChecklistSection) => {
    const timelines = organizeItemsByTimeline(section.items);

    return (
      <View key={section.id}>
        <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>

        {/* J-90 à J-60 */}
        {timelines.j90_j60.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-90 à J-60 (3 mois à 2 mois avant)</Text>
            {sortItemsByDelay(timelines.j90_j60).map((item, idx) =>
              renderItem(item, idx, true)
            )}
          </View>
        )}

        {/* J-30 à J-14 */}
        {timelines.j30_j14.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-30 à J-14 (1 mois à 2 semaines avant)</Text>
            {sortItemsByDelay(timelines.j30_j14).map((item, idx) =>
              renderItem(item, idx, true)
            )}
          </View>
        )}

        {/* J-7 à J-3 */}
        {timelines.j7_j3.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-7 à J-3 (1 semaine avant)</Text>
            {sortItemsByDelay(timelines.j7_j3).map((item, idx) =>
              renderItem(item, idx, true)
            )}
          </View>
        )}

        {/* J-2 à J-1 */}
        {timelines.j2_j1.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-2 à J-1 (48h avant le départ)</Text>
            {sortItemsByDelay(timelines.j2_j1).map((item, idx) =>
              renderItem(item, idx, true)
            )}
          </View>
        )}

        {/* Sans délai */}
        {timelines.noDelay.length > 0 && (
          <View>
            {sortItemsByDelay(timelines.noDelay).map((item, idx) =>
              renderItem(item, idx, false)
            )}
          </View>
        )}
      </View>
    );
  };

  // Rendre une section pour les autres catégories (timeline uniquement, pas de dates)
  const renderRegularSection = (section: GeneratedChecklistSection) => {
    const timelines = organizeItemsByTimeline(section.items);

    return (
      <View key={section.id}>
        <Text style={styles.categoryTitle}>{cleanTextForPDF(section.nom)}</Text>

        {/* J-90 à J-60 */}
        {timelines.j90_j60.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-90 à J-60 (3 mois à 2 mois avant)</Text>
            {sortItemsByDelay(timelines.j90_j60).map((item, idx) =>
              renderItem(item, idx, false)
            )}
          </View>
        )}

        {/* J-30 à J-14 */}
        {timelines.j30_j14.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-30 à J-14 (1 mois à 2 semaines avant)</Text>
            {sortItemsByDelay(timelines.j30_j14).map((item, idx) =>
              renderItem(item, idx, false)
            )}
          </View>
        )}

        {/* J-7 à J-3 */}
        {timelines.j7_j3.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-7 à J-3 (1 semaine avant)</Text>
            {sortItemsByDelay(timelines.j7_j3).map((item, idx) =>
              renderItem(item, idx, false)
            )}
          </View>
        )}

        {/* J-2 à J-1 */}
        {timelines.j2_j1.length > 0 && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineHeader}>J-2 à J-1 (48h avant le départ)</Text>
            {sortItemsByDelay(timelines.j2_j1).map((item, idx) =>
              renderItem(item, idx, false)
            )}
          </View>
        )}

        {/* Sans délai */}
        {timelines.noDelay.length > 0 && (
          <View>
            {sortItemsByDelay(timelines.noDelay).map((item, idx) =>
              renderItem(item, idx, false)
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.mainTitle}>{cleanTextForPDF(title)}</Text>

      {sections.map(section =>
        isEssentials ? renderEssentialSection(section) : renderRegularSection(section)
      )}

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};
