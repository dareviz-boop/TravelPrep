import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';
import { calculateDeadline } from '@/utils/checklistUtils';
import { PDFIcon } from './PDFIcon';
import { COLORS } from '@/utils/colors';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
// Helvetica ne supporte PAS les emojis Unicode, ils apparaissent corrompus
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
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
    // SUPPRIMER les emojis mal encodés (ex: =Ä, <å, =³)
    // Ces patterns apparaissent quand des emojis UTF-8 sont corrompus
    .replace(/[=<][^\s\w\d.,;:!?()[\]{}'"/\\-]/g, '')
    // Normaliser les guillemets typographiques
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    // Normaliser les tirets et flèches
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/…/g, '...')
    // Nettoyer espaces multiples
    .replace(/\s+/g, ' ')
    .trim();
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: 30, // ✅ Augmenté pour meilleur contrôle
    paddingBottom: 40, // ✅ Espace pour numéro de page
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 10 // ✅ Réduit
  },
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 6, // ✅ Réduit de moitié
    paddingBottom: 2, // ✅ Padding minimal
    paddingLeft: 5
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2 // ✅ Réduit
  },
  item: {
    flexDirection: 'row',
    marginBottom: 4, // ✅ Légèrement réduit
    paddingLeft: 5
  },
  checkbox: {
    width: 8,
    height: 8,
    border: `1px solid ${COLORS.text.primary}`,
    marginRight: 8,
    marginTop: 3 // ✅ Léger ajustement pour alignement optique
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.text.secondary,
    lineHeight: 1.4
  },
  // Encart gris pour le conseil - démarre directement sous la checkbox/!!
  conseilContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1, // ✅ Réduit drastiquement
    marginBottom: 1, // ✅ Espace minimal sous le conseil
    marginLeft: 24, // ✅ Aligné sous checkbox (8px width + 8px marginRight + 8px extra)
    marginRight: 24, // ✅ Symétrique avec marginLeft
    backgroundColor: '#f5f5f5', // Fond gris clair
    padding: 6, // ✅ Padding réduit
    borderRadius: 2
  },
  conseilText: {
    fontSize: 9,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    lineHeight: 1.4,
    flex: 1
  },
  prioritySymbol: {
    fontSize: 8,
    fontWeight: 700,
    marginRight: 5,
    color: '#DC2626' // Rouge pour haute priorité
  },
  priorityText: {
    fontSize: 7,
    fontWeight: 600,
    marginRight: 5,
    color: COLORS.text.secondary
  },
  timelineSection: {
    marginBottom: 10, // ✅ Réduit de moitié
    borderBottom: `1px solid ${COLORS.border.gray}`,
    paddingBottom: 8 // ✅ Réduit
  },
  timelineSectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.text.primary,
    marginTop: 8, // ✅ Ajouté pour contrôle
    marginBottom: 6, // ✅ Réduit
    backgroundColor: COLORS.background.subtle,
    padding: 5,
    borderLeft: '3px solid #C54616'
  },
  deadline: {
    fontSize: 8,
    color: COLORS.text.tertiary,
    width: 65,
    textAlign: 'right'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: COLORS.text.muted
  }
});

interface CategoryPageProps {
  formData: FormData;
  category: GeneratedChecklistSection;
  title: string;
}

export const CategoryPage = ({ formData, category, title }: CategoryPageProps) => {
  if (!category?.items || category.items.length === 0) return null;

  const isHighPriority = (priorite?: string): boolean => {
    const p = priorite?.toLowerCase() || '';
    return p.includes('haute');
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
          {isHighPriority(item.priorite) && (
            <Text style={styles.prioritySymbol}>!!</Text>
          )}
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
          {item.delai && formData.dateDepart && (
            <Text style={styles.deadline}>
              {calculateDeadline(formData.dateDepart, item.delai)}
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
        {isHighPriority(item.priorite) && (
          <Text style={styles.prioritySymbol}>!!</Text>
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

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};
