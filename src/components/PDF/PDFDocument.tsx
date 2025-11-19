import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist } from '@/utils/checklistGenerator';
import { CoverPage } from './CoverPage';
import { TimelinePage } from './TimelinePage';
import { CategoryPage } from './CategoryPage';
import { BagagesPage } from './BagagesPage';
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
        // Vérifier si l'ID de la section est dans sectionsInclure
        return sectionsInclure.includes(section.id);
      });

  // Créer une copie de checklistData avec sections filtrées
  const filteredChecklistData = {
    ...checklistData,
    sections: filteredSections
  };

  // Filtrer uniquement les sections d'activités pour les pages détaillées
  const activiteSections = filteredSections.filter(section => section.source === 'activite');

  return (
    <Document>
      <CoverPage
        formData={formData}
        checklistData={filteredChecklistData}
        referenceData={checklistCompleteData}
      />

      {isDetailedPDF && (
        <>
          {/* Format détaillé : Timeline sans activités + pages par activité avec timeline */}
          <TimelinePage formData={formData} checklistData={filteredChecklistData} isDetailed={true} />
          {activiteSections.map((section) => (
            <CategoryPage
              key={section.id}
              formData={formData}
              category={section}
              title={section.nom}
            />
          ))}
        </>
      )}
      {/* Format compact : Intégré directement dans CoverPage */}
    </Document>
  );
};
