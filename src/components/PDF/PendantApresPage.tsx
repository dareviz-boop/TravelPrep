import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';
import { PDFIcon } from './PDFIcon';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
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
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 15,
    textAlign: 'center'
  },
  momentBlock: {
    marginBottom: 12,
    breakInside: 'avoid' as const
  },
  momentTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 8,
    paddingLeft: 6
  },
  itemWithConseil: {
    flexDirection: 'column',
    marginBottom: 7,
    paddingLeft: 5,
    breakInside: 'avoid' as const
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 5,
    breakInside: 'avoid' as const
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
    marginTop: 2
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
  }
});

interface PendantApresPageProps {
  formData: FormData;
  section: GeneratedChecklistSection | null;
}

export const PendantApresPage = ({ formData, section }: PendantApresPageProps) => {
  if (!section || !section.items || section.items.length === 0) {
    return null;
  }

  const isHighPriority = (priorite?: string): boolean => {
    const p = priorite?.toLowerCase() || '';
    return p.includes('haute');
  };

  // Grouper les items par moment
  const itemsByMoment: { [moment: string]: ChecklistItem[] } = {};
  section.items.forEach(item => {
    const moment = item.moment || 'Autre';
    if (!itemsByMoment[moment]) {
      itemsByMoment[moment] = [];
    }
    itemsByMoment[moment].push(item);
  });

  // Ordre des moments
  const momentOrder = [
    'Arrivée',
    'J1-J2',
    'Début voyage',
    'Quotidien',
    'Quotidien soir',
    'Quotidien nuit',
    'Soir',
    'Avant dormir',
    'Repas',
    'Tous les 3-5 jours',
    'Continu',
    'Autre'
  ];

  const sortedMoments = Object.keys(itemsByMoment).sort((a, b) => {
    const indexA = momentOrder.indexOf(a);
    const indexB = momentOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Rendre un item
  const renderItem = (item: ChecklistItem, index: number) => {
    const hasConseil = item.conseils && item.conseils.trim().length > 0;

    return hasConseil ? (
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
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.mainTitle}>Pendant & Après le voyage</Text>

      {sortedMoments.map(moment => {
        const items = itemsByMoment[moment];
        return (
          <View key={moment} style={styles.momentBlock}>
            <Text style={styles.momentTitle}>{cleanTextForPDF(moment)}</Text>
            {items.map((item, idx) => renderItem(item, idx))}
          </View>
        );
      })}

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};
