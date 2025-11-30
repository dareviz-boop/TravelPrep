import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist } from '@/utils/checklistGenerator';
import { CoverPage } from './CoverPage';
import { TimelinePage } from './TimelinePage';
import { CategoryPage } from './CategoryPage';
import referenceData from '@/data/reference-data.json';
import { getAllLocalisationsSync } from '@/utils/locationLoader';

// 🔧 FIX: Ne pas charger de polices externes pour éviter les erreurs d'encodage
// Utiliser Helvetica qui est toujours disponible dans les PDFs
// Font.register() commenté car causait : RangeError: Offset is outside the bounds of the DataView

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    padding: 20,
    backgroundColor: '#FFFFFF'
  }
});

interface PDFDocumentProps {
  formData: FormData;
  checklistData: GeneratedChecklist;
}

export const TravelPrepPDF = ({ formData, checklistData }: PDFDocumentProps) => {
  const isDetailedPDF = formData.formatPDF === 'detaille';

  // Filtrer les sections selon sectionsInclure
  // Si sectionsInclure est undefined OU vide, tout est inclus par défaut
  const sectionsInclure = formData.sectionsInclure;
  const shouldIncludeAll = !sectionsInclure || sectionsInclure.length === 0;

  // Filtrer les sections selon sectionsInclure
  const filteredSections = checklistData.sections.filter(section => {
    // TOUJOURS inclure les sections d'activités (car elles ne sont pas dans l'UI de sélection)
    if (section.source === 'activite') {
      return true;
    }
    // TOUJOURS inclure les sections climatiques (générées selon conditions sélectionnées)
    if (section.source === 'climat') {
      return true;
    }
    // TOUJOURS inclure "pendant_apres" (même si non sélectionnée dans sectionsInclure)
    if (section.id === 'pendant_apres') {
      return true;
    }
    // Si shouldIncludeAll, inclure toutes les autres sections
    if (shouldIncludeAll) {
      return true;
    }
    // Sinon, vérifier si l'ID est dans sectionsInclure
    return sectionsInclure.includes(section.id);
  });

  // Créer une copie de checklistData avec sections filtrées
  const filteredChecklistData = {
    ...checklistData,
    sections: filteredSections
  };

  // ========== FORMAT DÉTAILLÉ : Organisation des sections selon l'étape 5 ==========

  // 1. Essentiels Absolus : documents, finances, sante
  const ESSENTIAL_IDS = ['documents', 'finances', 'sante'];
  const essentialSections = filteredSections.filter(section =>
    ESSENTIAL_IDS.includes(section.id)
  );

  // 2. Sections recommandées : toutes les autres sauf essentiels, activités et climatiques
  // Inclut : bagages, equipement, apps, pendant_apres, etc.
  // Les sections climatiques sont affichées dans leur propre section dédiée
  const recommendedSections = filteredSections.filter(section =>
    section.source !== 'activite' &&
    section.source !== 'climat' &&
    !ESSENTIAL_IDS.includes(section.id)
  );

  // 3. Activités
  const activiteSections = filteredSections.filter(section => section.source === 'activite');

  // 4. Sections climatiques (pour la section dédiée)
  const climateSections = filteredSections.filter(section => section.source === 'climat');

  // Charger toutes les localisations pour le PDF
  const localisations = getAllLocalisationsSync();

  return (
    <Document>
      <CoverPage
        formData={formData}
        checklistData={filteredChecklistData}
        referenceData={{
          ...referenceData,
          localisations // Ajouter les localisations chargées dynamiquement
        }}
        isDetailed={isDetailedPDF}
        essentialSections={essentialSections}
        recommendedSections={recommendedSections}
        activiteSections={activiteSections}
        climateSections={climateSections}
      />
      {/* Format compact ET format détaillé : Intégrés directement dans CoverPage */}
    </Document>
  );
};
