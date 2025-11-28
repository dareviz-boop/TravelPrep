import { Text, View, StyleSheet } from '@react-pdf/renderer';
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
    marginBottom: 10,
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
  // Format compact pour les conditions climatiques (similaire au format compact)
  climatConditionBlock: {
    marginBottom: 6,
    paddingLeft: 10
    // Ne pas utiliser breakInside: 'avoid' pour permettre la pagination naturelle
  },
  climatConditionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 4
  },
  climatAdviceItem: {
    fontSize: 9,
    color: COLORS.text.secondary,
    marginBottom: 2,
    paddingLeft: 10,
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

        {/* Premier conseil - format compact */}
        {firstAdviceSentences.length <= 3 ? (
          <View style={styles.climatConditionBlock}>
            <Text style={styles.climatConditionTitle}>{cleanTextForPDF(firstConseil.nom)}</Text>
            {firstAdviceSentences.map((sentence, idx) => (
              <Text key={idx} style={styles.climatAdviceItem}>- {cleanTextForPDF(sentence)}</Text>
            ))}
          </View>
        ) : (
          <View style={styles.climatConditionBlock}>
            <Text style={styles.climatConditionTitle}>{cleanTextForPDF(firstConseil.nom)}</Text>
            {firstAdviceSentences.slice(0, 2).map((sentence, idx) => (
              <Text key={idx} style={styles.climatAdviceItem}>- {cleanTextForPDF(sentence)}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Suite du premier conseil si plus de 3 phrases */}
      {firstAdviceSentences.length > 3 && (
        <View style={styles.climatConditionBlock}>
          {firstAdviceSentences.slice(2).map((sentence, idx) => (
            <Text key={idx + 2} style={styles.climatAdviceItem}>- {cleanTextForPDF(sentence)}</Text>
          ))}
        </View>
      )}

      {/* Conseils restants - format compact */}
      {remainingConseils.map((conseilData, index) => {
        const adviceSentences = formatAdviceText(conseilData.conseil);

        // Grouper titre + 2 premiers conseils si possible
        if (adviceSentences.length <= 3) {
          return (
            <View key={index} style={styles.climatConditionBlock} wrap={false}>
              <Text style={styles.climatConditionTitle}>{cleanTextForPDF(conseilData.nom)}</Text>
              {adviceSentences.map((sentence, idx) => (
                <Text key={idx} style={styles.climatAdviceItem}>- {cleanTextForPDF(sentence)}</Text>
              ))}
            </View>
          );
        } else {
          return (
            <View key={index} style={styles.climatConditionBlock}>
              <View wrap={false}>
                <Text style={styles.climatConditionTitle}>{cleanTextForPDF(conseilData.nom)}</Text>
                {adviceSentences.slice(0, 2).map((sentence, idx) => (
                  <Text key={idx} style={styles.climatAdviceItem}>- {cleanTextForPDF(sentence)}</Text>
                ))}
              </View>
              {adviceSentences.slice(2).map((sentence, idx) => (
                <Text key={idx + 2} style={styles.climatAdviceItem}>- {cleanTextForPDF(sentence)}</Text>
              ))}
            </View>
          );
        }
      })}
    </>
  );
};
