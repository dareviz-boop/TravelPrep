import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklistSection, ChecklistItem } from '@/utils/checklistGenerator';

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
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 15
  },
  divider: {
    borderBottom: '2px solid #C54616',
    marginVertical: 10,
    marginBottom: 15
  },
  categorySection: {
    marginBottom: 12
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.text.primary,
    marginBottom: 8,
    paddingLeft: 6,
    paddingVertical: 3,
    backgroundColor: COLORS.background.light,
    borderLeft: '3px solid #C54616'
  },
  subCategoryTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.text.tertiary,
    marginBottom: 5,
    marginTop: 8,
    paddingLeft: 10,
    fontStyle: 'italic'
  },
  item: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 10
  },
  checkbox: {
    width: 8,
    height: 8,
    border: `1px solid ${COLORS.text.primary}`,
    marginRight: 8,
    marginTop: 2
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.text.secondary,
    lineHeight: 1.4
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: COLORS.text.muted
  }
});

interface ApplicationsPageProps {
  formData: FormData;
  appsSection: GeneratedChecklistSection | null;
}

export const ApplicationsPage = ({ formData, appsSection }: ApplicationsPageProps) => {
  if (!appsSection || !appsSection.items || appsSection.items.length === 0) {
    return null;
  }

  // Grouper les apps par catégorie en extrayant la catégorie du texte
  const appsByCategory: { [key: string]: ChecklistItem[] } = {};

  appsSection.items.forEach(item => {
    // Format attendu: "Catégorie: Nom de l'app"
    const match = item.item.match(/^([^:]+):\s*(.+)$/);

    if (match) {
      const category = match[1].trim();
      const appName = match[2].trim();

      if (!appsByCategory[category]) {
        appsByCategory[category] = [];
      }

      appsByCategory[category].push({
        ...item,
        item: appName
      });
    } else {
      // Si pas de catégorie, mettre dans "Autres"
      if (!appsByCategory['Autres']) {
        appsByCategory['Autres'] = [];
      }
      appsByCategory['Autres'].push(item);
    }
  });

  // Si aucune app catégorisée, ne pas afficher la page
  if (Object.keys(appsByCategory).length === 0) {
    return null;
  }

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Applications recommandees</Text>

      <View style={styles.divider} />

      {Object.entries(appsByCategory).map(([category, apps]) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.subCategoryTitle}>{cleanTextForPDF(category)}</Text>

          {apps.map((app, index) => (
            <View style={styles.item} key={app.id || `app-${index}`}>
              <View style={styles.checkbox} />
              <Text style={styles.itemText}>{cleanTextForPDF(app.item)}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};
