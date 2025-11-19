import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, ChecklistItem } from '@/utils/checklistGenerator';
import { PDFIcon } from './PDFIcon';

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
  categoryHeader: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: '#E85D2A',
    padding: 6,
    marginTop: 10,
    marginBottom: 10
  },
  categoryHeaderInteresting: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: '#6B7280',
    padding: 6,
    marginTop: 10,
    marginBottom: 10
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
  prioritySymbol: {
    fontSize: 6,
    fontWeight: 600,
    marginRight: 3,
    color: '#374151'
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
  const isHighPriority = (priorite?: string): boolean => {
    const p = priorite?.toLowerCase() || '';
    return p.includes('haute');
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

  // Séparer les sections par catégorie
  const mustHaveSections = checklistData.sections.filter(s => s.category === 'must-have');
  const interestingSections = checklistData.sections.filter(s => s.category === 'interesting');

  const renderSection = (section: any) => {
    if (!section.items || section.items.length === 0) return null;

    const sortedItems = sortItemsByDelay(section.items);

    return (
      <View style={styles.section} key={section.id} wrap={false}>
        <Text style={styles.sectionTitle}>
          {section.emoji} {cleanTextForPDF(section.nom)}
        </Text>
        {sortedItems.map((item, index) => (
          <View style={styles.item} key={item.id || `item-${index}`}>
            {isHighPriority(item.priorite) && (
              <PDFIcon name="flame" style={{ marginRight: 3, marginTop: 1 }} />
            )}
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>{cleanTextForPDF(item.item)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Checklist Compacte</Text>

      {/* MUST-HAVES */}
      {mustHaveSections.length > 0 && (
        <>
          <Text style={styles.categoryHeader}>ESSENTIELS - MUST-HAVES</Text>
          {mustHaveSections.map(renderSection)}
        </>
      )}

      {/* INTÉRESSANTS */}
      {interestingSections.length > 0 && (
        <>
          <Text style={styles.categoryHeaderInteresting}>COMPLEMENTAIRES - INTERESSANTS</Text>
          {interestingSections.map(renderSection)}
        </>
      )}
    </Page>
  );
};
