import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFIcon } from './PDFIcon';
import { COLORS } from '@/utils/colors';

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
    color: COLORS.text.primary
  },
  titlePart2: {
    fontSize: 16,
    fontWeight: 700,
    color: '#C54616'
  },
  // Séparateur orange entre grandes sections
  sectionSeparator: {
    borderBottom: '3px solid #C54616',
    marginTop: 20,
    marginBottom: 15
  },
  // Encart de conseil climatique
  conseilClimatiqueBox: {
    backgroundColor: '#f9f0de', // Fond crème Dareviz
    borderLeft: '4px solid #fbb041', // Bordure jaune/ambre Dareviz
    padding: 10,
    marginBottom: 12,
    borderRadius: 2,
    breakInside: 'avoid' as const
  },
  conseilClimatiqueTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 6
  },
  conseilClimatiqueAdviceItem: {
    fontSize: 9,
    color: '#78350F',
    lineHeight: 1.4,
    marginBottom: 2
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

  // Fonction pour formater les conseils avec retours à la ligne (utiliser "." comme séparateur)
  const formatAdviceText = (conseil: string): string[] => {
    if (!conseil) return [];
    // Séparer par "." et nettoyer
    return conseil
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => sentence + '.'); // Rajouter le point à la fin
  };

  // Grouper le titre avec le premier conseil pour éviter les orphelins
  const firstConseil = conseilsClimatiques[0];
  const remainingConseils = conseilsClimatiques.slice(1);
  const firstAdviceSentences = formatAdviceText(firstConseil.conseil);

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
          {/* Nom de la condition comme titre principal */}
          <Text style={styles.conseilClimatiqueTitle}>
            {cleanTextForPDF(firstConseil.nom)}
          </Text>
          {/* Conseils formatés avec puces */}
          {firstAdviceSentences.map((sentence, idx) => (
            <Text key={idx} style={styles.conseilClimatiqueAdviceItem}>
              • {cleanTextForPDF(sentence)}
            </Text>
          ))}
        </View>
      </View>

      {/* Conseils restants */}
      {remainingConseils.map((conseilData, index) => {
        const adviceSentences = formatAdviceText(conseilData.conseil);
        return (
          <View key={index} style={styles.conseilClimatiqueBox} wrap={false}>
            {/* Nom de la condition comme titre principal */}
            <Text style={styles.conseilClimatiqueTitle}>
              {cleanTextForPDF(conseilData.nom)}
            </Text>
            {/* Conseils formatés avec puces */}
            {adviceSentences.map((sentence, idx) => (
              <Text key={idx} style={styles.conseilClimatiqueAdviceItem}>
                • {cleanTextForPDF(sentence)}
              </Text>
            ))}
          </View>
        );
      })}
    </>
  );
};
