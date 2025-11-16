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

  return (
    <Document>
      <CoverPage formData={formData} checklistData={checklistData} referenceData={checklistCompleteData} />
      <TimelinePage formData={formData} checklistData={checklistData} isDetailed={isDetailedPDF} />

      {/* Render category pages only if detailed PDF with advice/tips */}
      {isDetailedPDF && checklistData.sections.map((section) => (
        <CategoryPage
          key={section.id}
          formData={formData}
          category={section}
          title={section.nom}
        />
      ))}
    </Document>
  );
};
