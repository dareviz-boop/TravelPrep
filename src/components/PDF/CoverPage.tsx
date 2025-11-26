import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist, GeneratedChecklistSection } from '@/utils/checklistGenerator';
import { PDFIcon } from './PDFIcon';
import { CompactPage } from './CompactPage';
import { TimelineContent } from './TimelineContent';
import { DetailedSectionsPage } from './DetailedSectionsPage';
import { ClimatAdvicePage } from './ClimatAdvicePage';

// Fonction utilitaire pour nettoyer les caractères spéciaux et SUPPRIMER les emojis
// Helvetica ne supporte PAS les emojis Unicode, ils apparaissent corrompus
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    // SUPPRIMER tous les emojis (plage Unicode complète)
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis & Pictographs
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Symboles divers
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation selectors
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '') // Mahjong Tiles
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '') // Playing Cards
    .replace(/[\u{1F100}-\u{1F64F}]/gu, '') // Enclosed characters
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & Map
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
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
    padding: 30,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#C54616',
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center'
  },
  tripName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#C54616',
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  infoBox: {
    backgroundColor: '#F5F5F5', // Fond gris Dareviz
    padding: 15,
    borderRadius: 4,
    border: '1px solid #CCCCCC', // Bordure grise
    width: '100%',
    marginBottom: 15
  },
  divider: {
    borderBottom: '3px solid #C54616', // Ligne de séparation orange 3px
    marginVertical: 10,
    marginBottom: 15
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
    fontSize: 8,
    color: '#9ca3af'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: '#9ca3af'
  }
});

interface CoverPageProps {
  formData: FormData;
  checklistData: GeneratedChecklist;
  referenceData: any;
  isDetailed?: boolean;
  essentialSections?: GeneratedChecklistSection[];
  recommendedSections?: GeneratedChecklistSection[];
  activiteSections?: GeneratedChecklistSection[];
}

export const CoverPage = ({
  formData,
  checklistData,
  referenceData,
  isDetailed = false,
  essentialSections = [],
  recommendedSections = [],
  activiteSections = []
}: CoverPageProps) => {
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
    const activitesOptions: any[] = referenceData.activites?.options || [];
    return cleanTextForPDF(
      formData.activites
        .map(actId => {
          const activite = activitesOptions.find((opt: any) => opt.id === actId);
          return activite ? activite.nom : actId;
        })
        .filter(Boolean)
        .join(', ')
    );
  };

  const getLocalisationLabel = () => {
    const localisations: any = referenceData.localisations || {};
    return cleanTextForPDF(localisations[formData.localisation]?.nom || formData.localisation);
  };

  const getProfilLabel = () => {
    const profilsOptions: any[] = referenceData.profils?.options || [];
    const profil = profilsOptions.find((opt: any) => opt.id === formData.profil);
    return cleanTextForPDF(profil ? profil.nom : formData.profil);
  };

  const getPaysLabels = () => {
    if (!formData.pays || formData.pays.length === 0) return null;
    return cleanTextForPDF(
      formData.pays.map(p => p.nom).join(', ')
    );
  };

  const getTemperaturesLabels = () => {
    // Cas spécial : Multi-destination sans pays spécifiés
    if (formData.localisation === 'multi-destinations' && (!formData.pays || formData.pays.length === 0)) {
      return 'je ne sais pas';
    }

    const temps: any = referenceData.temperatures || {};
    const tempArray = Array.isArray(formData.temperature) ? formData.temperature : [formData.temperature];
    const filtered = tempArray.filter(t => t !== 'inconnue');

    // Si toutes les températures sont sélectionnées (5 températures : très-froide, froide, temperee, chaude, très-chaude)
    const allTemps = ['tres-froide', 'froide', 'temperee', 'chaude', 'tres-chaude'];
    if (filtered.length === allTemps.length && allTemps.every(t => filtered.includes(t as any))) {
      return 'Toutes, de tres froides à chaleur extrême';
    }

    return cleanTextForPDF(
      filtered
        .map(t => {
          const option = temps.options?.find((opt: any) => opt.id === t);
          return option ? option.nom : t;
        })
        .join(', ')
    );
  };

  const getSaisonsLabels = () => {
    // Cas spécial : Multi-destination sans pays spécifiés
    if (formData.localisation === 'multi-destinations' && (!formData.pays || formData.pays.length === 0)) {
      return 'je ne sais pas';
    }

    const saisons: any = referenceData.saisons || {};
    const saisonArray = Array.isArray(formData.saison) ? formData.saison : [formData.saison];
    const filtered = saisonArray.filter(s => s !== 'inconnue');

    // Si toutes les saisons sont sélectionnées (4 saisons : ete, hiver, printemps, automne)
    const allSaisons = ['ete', 'hiver', 'printemps', 'automne'];
    if (filtered.length === allSaisons.length && allSaisons.every(s => filtered.includes(s as any))) {
      return 'Toutes les saisons';
    }

    return cleanTextForPDF(
      filtered
        .map(s => {
          const option = saisons.options?.find((opt: any) => opt.id === s);
          return option ? option.nom : s;
        })
        .join(', ')
    );
  };

  const getConditionsClimatiquesLabels = () => {
    // Cas spécial : Multi-destination sans pays spécifiés
    if (formData.localisation === 'multi-destinations' && (!formData.pays || formData.pays.length === 0)) {
      return 'Aucune condition specifique';
    }

    if (!formData.conditionsClimatiques || formData.conditionsClimatiques.length === 0) return null;
    const conditions: any = referenceData.conditionsClimatiques || [];
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
          return cond ? cond.nom : condId;
        })
        .join(', ')
    );
  };

  const getTypeVoyageLabel = () => {
    const typesOptions: any[] = referenceData.typeVoyage?.options || [];
    const type = typesOptions.find((opt: any) => opt.id === formData.typeVoyage);
    return cleanTextForPDF(type ? type.nom : formData.typeVoyage);
  };

  const getConfortLabel = () => {
    const confortsOptions: any[] = referenceData.confort?.options || [];
    const confort = confortsOptions.find((opt: any) => opt.id === formData.confort);
    return cleanTextForPDF(confort ? confort.nom : formData.confort);
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
      <Text style={styles.title}>TravelPrep</Text>
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
              {formatDate(formData.dateDepart)} {'->'} {formatDate(formData.dateRetour)} / {duration} jours
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

      {/* Divider - Ligne de séparation orange avant la suite */}
      <View style={styles.divider}></View>

      {/* Intégrer la timeline si format compact */}
      {formData.formatPDF === 'compact' && checklistData && (
        <CompactPage formData={formData} checklistData={checklistData} />
      )}

      {/* Intégrer les sections détaillées si format détaillé */}
      {isDetailed && (
        <>
          {/* 1. Essentiels Absolus (avec dates précises) */}
          {essentialSections.length > 0 && (
            <DetailedSectionsPage
              formData={formData}
              sections={essentialSections}
              titlePart1="Timeline de Préparation -"
              titlePart2=" Essentiels absolus"
              isEssentials={true}
              addSeparator={false}
            />
          )}

          {/* 2. Sélection Conseillée (inclut apps et pendant_apres) */}
          {recommendedSections.length > 0 && (
            <DetailedSectionsPage
              formData={formData}
              sections={recommendedSections}
              titlePart1="À Prévoir -"
              titlePart2=" Sélection conseillée"
              isEssentials={false}
              addSeparator={true}
            />
          )}

          {/* 3. Activités (timeline uniquement, pas de dates) */}
          {activiteSections.length > 0 && (
            <DetailedSectionsPage
              formData={formData}
              sections={activiteSections}
              titlePart1="À Prévoir -"
              titlePart2=" Préparation activités"
              isEssentials={false}
              addSeparator={true}
            />
          )}

          {/* 4. Conseils climatiques (encarts informatifs) */}
          {checklistData.conseilsClimatiques && checklistData.conseilsClimatiques.length > 0 && (
            <ClimatAdvicePage conseilsClimatiques={checklistData.conseilsClimatiques} />
          )}
        </>
      )}

      <Text style={styles.footer}>
        Généré le {new Date().toLocaleDateString('fr-FR')} avec TravelPrep
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  );
};
