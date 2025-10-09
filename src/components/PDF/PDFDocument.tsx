import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { CoverPage } from './CoverPage';
import { TimelinePage } from './TimelinePage';
import { CategoryPage } from './CategoryPage';
import { BagagesPage } from './BagagesPage';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 30,
    backgroundColor: '#FFFFFF'
  }
});

interface PDFDocumentProps {
  formData: FormData;
  checklistData: any;
}

export const TravelPrepPDF = ({ formData, checklistData }: PDFDocumentProps) => {
  return (
    <Document>
      <CoverPage formData={formData} />
      <TimelinePage formData={formData} checklistData={checklistData} />
      
      {formData.sectionsInclure.includes('Documents & Administratif') && (
        <CategoryPage 
          formData={formData} 
          category={checklistData.categories.documents}
          title="Documents & Administratif"
        />
      )}
      
      {formData.sectionsInclure.includes('Bagages détaillés') && (
        <BagagesPage formData={formData} checklistData={checklistData} />
      )}
    </Document>
  );
};
