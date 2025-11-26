import { Text, View, StyleSheet } from '@react-pdf/renderer';

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
    // SUPPRIMER les emojis mal encodés
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
  // Titre principal en deux parties
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  titlePart1: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827'
  },
  titlePart2: {
    fontSize: 16,
    fontWeight: 700,
    color: '#E85D2A'
  },
  // Séparateur entre grandes sections
  sectionSeparator: {
    marginTop: 30,
    marginBottom: 15
  },
  // Encart de conseil climatique
  conseilClimatiqueBox: {
    backgroundColor: '#FFF9E6', // Fond jaune pâle
    borderLeft: '4px solid #F59E0B', // Bordure orange ambre
    padding: 10,
    marginBottom: 12,
    borderRadius: 2,
    breakInside: 'avoid' as const
  },
  conseilClimatiqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  conseilClimatiqueIcon: {
    fontSize: 11,
    marginRight: 6,
    color: '#F59E0B'
  },
  conseilClimatiqueTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#92400E'
  },
  conseilClimatiqueSubtitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 4
  },
  conseilClimatiqueText: {
    fontSize: 9,
    color: '#78350F',
    lineHeight: 1.4
  },
  // Groupe titre + items pour éviter les orphelins
  titleWithItemsGroup: {
    breakInside: 'avoid' as const
  }
});

interface ClimatAdvicePageProps {
  conseilsClimatiques: Array<{nom: string, conseil: string}>;
}

export const ClimatAdvicePage = ({ conseilsClimatiques }: ClimatAdvicePageProps) => {
  if (!conseilsClimatiques || conseilsClimatiques.length === 0) return null;

  // Grouper le titre avec le premier conseil pour éviter les orphelins
  const firstConseil = conseilsClimatiques[0];
  const remainingConseils = conseilsClimatiques.slice(1);

  return (
    <>
      <View style={styles.sectionSeparator} />

      {/* Titre + premier conseil groupés pour éviter les orphelins */}
      <View style={styles.titleWithItemsGroup} wrap={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.titlePart1}>Conseils -</Text>
          <Text style={styles.titlePart2}> Conditions climatiques</Text>
        </View>

        {/* Premier conseil */}
        <View style={styles.conseilClimatiqueBox}>
          <View style={styles.conseilClimatiqueHeader}>
            <Text style={styles.conseilClimatiqueIcon}>⚠️</Text>
            <Text style={styles.conseilClimatiqueTitle}>Important</Text>
          </View>
          {/* Nom de la condition comme sous-titre */}
          <Text style={styles.conseilClimatiqueSubtitle}>
            {cleanTextForPDF(firstConseil.nom)}
          </Text>
          {/* Conseil */}
          <Text style={styles.conseilClimatiqueText}>
            {cleanTextForPDF(firstConseil.conseil)}
          </Text>
        </View>
      </View>

      {/* Conseils restants */}
      {remainingConseils.map((conseilData, index) => (
        <View key={index} style={styles.conseilClimatiqueBox} wrap={false}>
          <View style={styles.conseilClimatiqueHeader}>
            <Text style={styles.conseilClimatiqueIcon}>⚠️</Text>
            <Text style={styles.conseilClimatiqueTitle}>Important</Text>
          </View>
          {/* Nom de la condition comme sous-titre */}
          <Text style={styles.conseilClimatiqueSubtitle}>
            {cleanTextForPDF(conseilData.nom)}
          </Text>
          {/* Conseil */}
          <Text style={styles.conseilClimatiqueText}>
            {cleanTextForPDF(conseilData.conseil)}
          </Text>
        </View>
      ))}
    </>
  );
};
