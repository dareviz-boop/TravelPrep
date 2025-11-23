import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { GeneratedChecklist } from '@/utils/checklistGenerator';
import { CoverPage } from './CoverPage';
import { TimelinePage } from './TimelinePage';
import { CategoryPage } from './CategoryPage';
import { BagagesPage } from './BagagesPage';
import { ApplicationsPage } from './ApplicationsPage';
import { DetailedSectionsPage } from './DetailedSectionsPage';
import { PendantApresPage } from './PendantApresPage';
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

  // ========== FORMAT DÉTAILLÉ : Organisation des sections selon l'étape 5 ==========

  // 1. Essentiels Absolus : documents, finances, sante
  const ESSENTIAL_IDS = ['documents', 'finances', 'sante'];
  const essentialSections = filteredSections.filter(section =>
    ESSENTIAL_IDS.includes(section.id)
  );

  // 2. Sections recommandées : toutes les autres sauf essentiels, activités, apps, pendant_apres
  const SPECIAL_IDS = [...ESSENTIAL_IDS, 'apps', 'pendant_apres'];
  const recommendedSections = filteredSections.filter(section =>
    section.source !== 'activite' &&
    !SPECIAL_IDS.includes(section.id)
  );

  // 3. Applications recommandées
  const appsSection = filteredSections.find(section => section.id === 'apps') || null;

  // 4. Activités
  const activiteSections = filteredSections.filter(section => section.source === 'activite');

  // 5. Pendant & Après le voyage
  const pendantApresSection = filteredSections.find(section => section.id === 'pendant_apres') || null;

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
          {/* 1. Essentiels Absolus (avec dates précises) */}
          {essentialSections.length > 0 && (
            <DetailedSectionsPage
              formData={formData}
              sections={essentialSections}
              title="Essentiels Absolus"
              isEssentials={true}
            />
          )}

          {/* 2. Sections Recommandées (timeline uniquement, pas de dates) */}
          {recommendedSections.length > 0 && (
            <DetailedSectionsPage
              formData={formData}
              sections={recommendedSections}
              title="Sections Recommandées"
              isEssentials={false}
            />
          )}

          {/* 3. Applications Recommandées */}
          {appsSection && (
            <ApplicationsPage formData={formData} appsSection={appsSection} />
          )}

          {/* 4. Activités (timeline uniquement, pas de dates) */}
          {activiteSections.length > 0 && (
            <DetailedSectionsPage
              formData={formData}
              sections={activiteSections}
              title="Préparation Activités"
              isEssentials={false}
            />
          )}

          {/* 5. Pendant & Après le voyage */}
          {pendantApresSection && (
            <PendantApresPage formData={formData} section={pendantApresSection} />
          )}
        </>
      )}
      {/* Format compact : Intégré directement dans CoverPage */}
    </Document>
  );
};
