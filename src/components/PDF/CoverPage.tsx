import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import checklistCompleteData from '@/data/checklistComplete.json';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    padding: 60,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: '#2563eb',
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
    color: '#111827',
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
}

export const CoverPage = ({ formData, checklistData }: CoverPageProps) => {
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
    const activitesMap: any = checklistCompleteData.activites || {};
    return formData.activites
      .map(actId => activitesMap[actId]?.label || actId)
      .filter(Boolean)
      .join(', ');
  };

  const getLocalisationLabel = () => {
    const localisations: any = checklistCompleteData.localisations || {};
    return localisations[formData.localisation]?.nom || formData.localisation;
  };

  const getProfilLabel = () => {
    const profils: any = checklistCompleteData.profils || {};
    return profils[formData.profil]?.label || formData.profil;
  };

  const duration = calculateDuration();

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>🌍 TRAVELPREP</Text>
      <Text style={styles.subtitle}>Votre Guide de Préparation au Voyage</Text>
      
      <Text style={styles.tripName}>{formData.nomVoyage}</Text>
      
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📅 Départ :</Text>
          <Text style={styles.infoValue}>{formatDate(formData.dateDepart)}</Text>
        </View>
        
        {formData.dateRetour && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Retour :</Text>
            <Text style={styles.infoValue}>{formatDate(formData.dateRetour)}</Text>
          </View>
        )}
        
        {duration && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏱️ Durée :</Text>
            <Text style={styles.infoValue}>{duration} jours</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📍 Destination :</Text>
          <Text style={styles.infoValue}>{getLocalisationLabel()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>👥 Profil :</Text>
          <Text style={styles.infoValue}>{getProfilLabel()}</Text>
        </View>
        
        {formData.activites.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🎯 Activités :</Text>
            <Text style={styles.infoValue}>{getActivitesLabels()}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.footer}>
        Généré le {new Date().toLocaleDateString('fr-FR')} avec TravelPrep
      </Text>
    </Page>
  );
};
