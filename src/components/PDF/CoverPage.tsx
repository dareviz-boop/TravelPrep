import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import checklistCompleteData from '@/data/checklistComplete.json';
import { PDFIcon } from './PDFIcon';

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
    fontFamily: 'Helvetica',
    padding: 30,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#E85D2A',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center'
  },
  tripName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#E85D2A',
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 4,
    width: '100%',
    marginBottom: 10
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    fontSize: 9
  },
  infoLabel: {
    color: '#6b7280',
    width: 80,
    fontWeight: 600,
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelText: {
    color: '#6b7280',
    fontWeight: 600
  },
  infoValue: {
    color: '#111827',
    flex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
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

  // Fonction pour obtenir les labels des âges d'enfants
  const getAgesEnfantsLabels = () => {
    if (!formData.agesEnfants || formData.agesEnfants.length === 0) return '';
    const agesMap: { [key: string]: string } = {
      '0-2-ans': '0-2 ans',
      '3-5-ans': '3-5 ans',
      '6-12-ans': '6-12 ans',
      '13+-ans': '13+ ans'
    };
    return formData.agesEnfants.map(age => agesMap[age] || age).join(', ');
  };

  // Fonction pour formater la durée estimée
  const getDureeEstimee = () => {
    const dureeMap: { [key: string]: string } = {
      'court': 'entre 1 & 7 jours',
      'moyen': 'entre 8 & 21 jours',
      'long': 'entre 22 & 90 jours',
      'tres-long': 'plus de 90 jours'
    };
    return dureeMap[formData.duree] || '';
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>TRAVELPREP</Text>
      <Text style={styles.subtitle}>Votre Guide de Preparation au Voyage</Text>

      <Text style={styles.tripName}>{cleanTextForPDF(formData.nomVoyage)}</Text>

      <View style={styles.infoBox}>
        {/* Date & Durée */}
        {formData.dateRetour && duration ? (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="calendar" />
              <Text style={styles.labelText}>Date :</Text>
            </View>
            <Text style={styles.infoValue}>
              {formatDate(formData.dateDepart)} ➞ {formatDate(formData.dateRetour)} / {duration} jours
            </Text>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="calendar" />
              <Text style={styles.labelText}>Départ :</Text>
            </View>
            <Text style={styles.infoValue}>
              {formatDate(formData.dateDepart)} / {getDureeEstimee()}
            </Text>
          </View>
        )}

        {/* Destination */}
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <PDFIcon name="globe" />
            <Text style={styles.labelText}>Destination :</Text>
          </View>
          <Text style={styles.infoValue}>{getLocalisationLabel()}</Text>
        </View>

        {/* Pays */}
        {getPaysLabels() && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="map" />
              <Text style={styles.labelText}>Pays :</Text>
            </View>
            <Text style={styles.infoValue}>{getPaysLabels()}</Text>
          </View>
        )}

        {/* Saisons */}
        {getSaisonsLabels() && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="leaf" />
              <Text style={styles.labelText}>Saison :</Text>
            </View>
            <Text style={styles.infoValue}>{getSaisonsLabels()}</Text>
          </View>
        )}

        {/* Températures */}
        {getTemperaturesLabels() && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="thermometer" />
              <Text style={styles.labelText}>Température :</Text>
            </View>
            <Text style={styles.infoValue}>{getTemperaturesLabels()}</Text>
          </View>
        )}

        {/* Conditions Climatiques */}
        {getConditionsClimatiquesLabels() && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="cloud" />
              <Text style={styles.labelText}>Climat :</Text>
            </View>
            <Text style={styles.infoValue}>{getConditionsClimatiquesLabels()}</Text>
          </View>
        )}

        {/* Profil */}
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <PDFIcon name="user" />
            <Text style={styles.labelText}>Profil :</Text>
          </View>
          <Text style={styles.infoValue}>
            {getProfilLabel()}
            {formData.profil === 'famille' && formData.nombreEnfants &&
              ` (${formData.nombreEnfants} enfant${formData.nombreEnfants > 1 ? 's' : ''}${getAgesEnfantsLabels() ? ': ' + getAgesEnfantsLabels() : ''})`
            }
          </Text>
        </View>

        {/* Activités */}
        {formData.activites.length > 0 && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="activity" />
              <Text style={styles.labelText}>Activités :</Text>
            </View>
            <Text style={styles.infoValue}>{getActivitesLabels()}</Text>
          </View>
        )}

        {/* Type de Voyage */}
        {formData.typeVoyage && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="plane" />
              <Text style={styles.labelText}>Type :</Text>
            </View>
            <Text style={styles.infoValue}>{getTypeVoyageLabel()}</Text>
          </View>
        )}

        {/* Confort */}
        {formData.confort && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <PDFIcon name="bed" />
              <Text style={styles.labelText}>Confort :</Text>
            </View>
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
