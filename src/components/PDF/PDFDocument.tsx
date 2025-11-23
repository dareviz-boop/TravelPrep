import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist } from '@/utils/checklistGenerator';
import { CoverPage } from './CoverPage';
import { TimelinePage } from './TimelinePage';
import { CategoryPage } from './CategoryPage';
import { BagagesPage } from './BagagesPage';
import { ApplicationsPage } from './ApplicationsPage';
import checklistCompleteData from '@/data/checklistComplete.json';

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
  const filteredSections = shouldIncludeAll
    ? checklistData.sections
    : checklistData.sections.filter(section => {
        // TOUJOURS inclure les sections d'activités (car elles ne sont pas dans l'UI de sélection)
        if (section.source === 'activite') {
          return true;
        }
        // Pour les sections core, vérifier si l'ID est dans sectionsInclure
        return sectionsInclure.includes(section.id);
      });

  // Créer une copie de checklistData avec sections filtrées
  const filteredChecklistData = {
    ...checklistData,
    sections: filteredSections
  };

  // Filtrer uniquement les sections d'activités pour les pages détaillées
  const activiteSections = filteredSections.filter(section => section.source === 'activite');

  // Récupérer la section apps si elle existe
  const appsSection = filteredSections.find(section => section.id === 'apps') || null;

  return (
    <Document>
      <CoverPage
        formData={formData}
        checklistData={filteredChecklistData}
        referenceData={checklistCompleteData}
        isDetailed={isDetailedPDF}
      />

      {isDetailedPDF && (
        <>
          {/* Format détaillé : Pages par activité + Applications */}
          {activiteSections.map((section) => (
            <CategoryPage
              key={section.id}
              formData={formData}
              category={section}
              title={section.nom}
            />
          ))}
          {/* Page Applications recommandées */}
          <ApplicationsPage formData={formData} appsSection={appsSection} />
        </>
      )}
      {/* Format compact : Intégré directement dans CoverPage */}
    </Document>
  );
};
