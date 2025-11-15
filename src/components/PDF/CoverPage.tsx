import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import checklistCompleteData from '@/data/checklistComplete.json';

// Fonction utilitaire pour nettoyer certains caractères spéciaux problématiques
// ✨ GARDONS les emojis pour plus de personnalité dans le PDF !
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    // Normaliser les guillemets typographiques
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[«»]/g, '"')
    // Normaliser les tirets
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    // 🎨 Les emojis sont maintenant CONSERVÉS !
    // Seulement supprimer les variation selectors qui peuvent causer des problèmes
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .trim();
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica', // 🔧 FIX: Utiliser Helvetica au lieu d'Inter
    padding: 60,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: '#E85D2A', // 🎨 Orange Dareviz
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 60,
    textAlign: 'center'
  },
  tripName: {
    fontSize: 28,
    fontWeight: 600,
    color: '#E85D2A', // 🎨 Orange Dareviz
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    padding: 30,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    fontSize: 12
  },
  infoLabel: {
    color: '#6b7280',
    width: 100,
    fontWeight: 600
  },
  infoValue: {
    color: '#111827',
    flex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af'
  }
});

interface CoverPageProps {
  formData: FormData;
  checklistData: any;
  referenceData: any;
}

export const CoverPage = ({ formData, checklistData, referenceData }: CoverPageProps) => {
  const calculateDuration = () => {
    if (!formData.dateRetour) return null;
    const start = new Date(formData.dateDepart);
    const end = new Date(formData.dateRetour);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getActivitesLabels = () => {
    if (!referenceData.activites) return '';
    return formData.activites
      .map(act => referenceData.activites[act]?.label)
      .filter(Boolean)
      .join(', ');
    const activitesMap: any = checklistCompleteData.activites || {};
    return cleanTextForPDF(
      formData.activites
        .map(actId => activitesMap[actId]?.label || actId)
        .filter(Boolean)
        .join(', ')
    );
  };

  const getLocalisationLabel = () => {
    const localisations: any = checklistCompleteData.localisations || {};
    return cleanTextForPDF(localisations[formData.localisation]?.nom || formData.localisation);
  };

  const getProfilLabel = () => {
    const profils: any = checklistCompleteData.profils || {};
    return cleanTextForPDF(profils[formData.profil]?.label || formData.profil);
  };

  const getPaysLabels = () => {
    if (!formData.pays || formData.pays.length === 0) return null;
    return cleanTextForPDF(
      formData.pays.map(p => p.nom).join(', ')
    );
  };

  const getTemperaturesLabels = () => {
    const temps: any = checklistCompleteData.temperatures || {};
    const tempArray = Array.isArray(formData.temperature) ? formData.temperature : [formData.temperature];
    return cleanTextForPDF(
      tempArray
        .filter(t => t !== 'inconnue')
        .map(t => temps.options?.find((opt: any) => opt.id === t)?.nom || t)
        .join(', ')
    );
  };

  const getSaisonsLabels = () => {
    const saisons: any = checklistCompleteData.saisons || {};
    const saisonArray = Array.isArray(formData.saison) ? formData.saison : [formData.saison];
    return cleanTextForPDF(
      saisonArray
        .filter(s => s !== 'inconnue')
        .map(s => saisons.options?.find((opt: any) => opt.id === s)?.nom || s)
        .join(', ')
    );
  };

  const getConditionsClimatiquesLabels = () => {
    if (!formData.conditionsClimatiques || formData.conditionsClimatiques.length === 0) return null;
    const conditions: any = checklistCompleteData.conditionsClimatiques || [];
    const allConditions: any[] = [];

    // Parcourir tous les groupes pour trouver les conditions
    conditions.forEach((groupe: any) => {
      if (groupe.options) {
        allConditions.push(...groupe.options);
      }
    });

    return cleanTextForPDF(
      formData.conditionsClimatiques
        .filter(c => c !== 'climat_aucune')
        .slice(0, 5) // Limiter à 5 conditions max pour ne pas surcharger
        .map(condId => {
          const cond = allConditions.find((c: any) => c.id === condId);
          return cond?.nom || condId;
        })
        .join(', ')
    );
  };

  const getTypeVoyageLabel = () => {
    const types: any = checklistCompleteData.typeVoyage || {};
    return cleanTextForPDF(types[formData.typeVoyage]?.label || formData.typeVoyage);
  };

  const getConfortLabel = () => {
    const conforts: any = checklistCompleteData.confort || {};
    return cleanTextForPDF(conforts[formData.confort]?.label || formData.confort);
  };

  const duration = calculateDuration();

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>TRAVELPREP</Text>
      <Text style={styles.subtitle}>Votre Guide de Preparation au Voyage</Text>

      <Text style={styles.tripName}>{cleanTextForPDF(formData.nomVoyage)}</Text>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Départ :</Text>
          <Text style={styles.infoValue}>{formatDate(formData.dateDepart)}</Text>
        </View>

        {formData.dateRetour && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Retour :</Text>
            <Text style={styles.infoValue}>{formatDate(formData.dateRetour)}</Text>
          </View>
        )}

        {duration && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Durée :</Text>
            <Text style={styles.infoValue}>{duration} jours</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📍 Destination :</Text>
          <Text style={styles.infoValue}>{referenceData.localisations?.[formData.localisation]?.nom || formData.localisation}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>👥 Profil :</Text>
          <Text style={styles.infoValue}>{referenceData.profils?.[formData.profil]?.label || formData.profil}</Text>
          <Text style={styles.infoLabel}>Destination :</Text>
          <Text style={styles.infoValue}>{getLocalisationLabel()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Profil :</Text>
          <Text style={styles.infoValue}>{getProfilLabel()}</Text>
        </View>

        {formData.activites.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Activités :</Text>
            <Text style={styles.infoValue}>{getActivitesLabels()}</Text>
          </View>
        )}

        {getPaysLabels() && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pays :</Text>
            <Text style={styles.infoValue}>{getPaysLabels()}</Text>
          </View>
        )}

        {getTemperaturesLabels() && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Températures :</Text>
            <Text style={styles.infoValue}>{getTemperaturesLabels()}</Text>
          </View>
        )}

        {getSaisonsLabels() && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Saisons :</Text>
            <Text style={styles.infoValue}>{getSaisonsLabels()}</Text>
          </View>
        )}

        {getConditionsClimatiquesLabels() && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Climat :</Text>
            <Text style={styles.infoValue}>{getConditionsClimatiquesLabels()}</Text>
          </View>
        )}

        {formData.typeVoyage && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type :</Text>
            <Text style={styles.infoValue}>{getTypeVoyageLabel()}</Text>
          </View>
        )}

        {formData.confort && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Confort :</Text>
            <Text style={styles.infoValue}>{getConfortLabel()}</Text>
          </View>
        )}
      </View>

      <Text style={styles.footer}>
        Généré le {new Date().toLocaleDateString('fr-FR')} avec TravelPrep
      </Text>
    </Page>
  );
};
