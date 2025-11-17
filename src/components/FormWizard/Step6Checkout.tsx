import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { useState, useEffect, useMemo } from 'react';
import { generateCompleteChecklist } from '@/utils/checklistGenerator';

interface Step6CheckoutProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step6Checkout = ({ formData, updateFormData }: Step6CheckoutProps) => {
  const [showPDF, setShowPDF] = useState(false);
  const [PDFComponents, setPDFComponents] = useState<any>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // 🔧 FIX: Utiliser useMemo pour éviter de recalculer la checklist à chaque render
  // Ne recalculer QUE si les données de voyage changent (pas les infos de contact)
  const generatedChecklist = useMemo(() => {
    return generateCompleteChecklist(formData);
  }, [
    formData.nomVoyage,
    formData.dateDepart,
    formData.dateRetour,
    formData.duree,
    formData.localisation,
    formData.pays,
    formData.temperature,
    formData.saison,
    formData.conditionsClimatiques,
    formData.activites,
    formData.profil,
    formData.agesEnfants,
    formData.typeVoyage,
    formData.confort,
    formData.sectionsInclure,
    formData.formatPDF
  ]);

  // Charger les composants PDF de manière dynamique
  useEffect(() => {
    const loadPDF = async () => {
      try {
        console.log('📥 Chargement des composants PDF...');
        const { PDFViewer } = await import('@react-pdf/renderer');
        const { TravelPrepPDF } = await import('@/components/PDF/PDFDocument');
        setPDFComponents({ PDFViewer, TravelPrepPDF });
        setPdfError(null);
        console.log('✅ Composants PDF chargés avec succès');

        // ✅ FIX: Afficher le PDF une seule fois au chargement initial
        setShowPDF(true);
      } catch (error) {
        console.error('❌ Erreur lors du chargement du PDF:', error);
        setPdfError(error instanceof Error ? error.message : 'Erreur inconnue');
      }
    };

    loadPDF();
  }, []); // 🔧 FIX: Ne charger qu'une seule fois au montage du composant
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Titre de l'étape */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          🚀 Presque terminé !
        </h2>
        <p className="text-muted-foreground">
          Générez votre PDF pour le télécharger et recevez-le par email.
        </p>
      </div>

      {/* Formulaire de contact */}
      <div className="space-y-6 max-w-xl mx-auto">
        
        {/* Champ Prénom */}
        <div className="space-y-2">
          <Label htmlFor="prenomClient" className="text-base font-semibold">
            Prénom <span className="text-primary">*</span>
          </Label>
          <Input
            id="prenomClient"
            placeholder="Jack"
            value={formData.prenomClient || ''}
            onChange={(e) => updateFormData({ prenomClient: e.target.value })}
            className="h-12 text-base"
          />
        </div>

        {/* Champ Nom */}
        <div className="space-y-2">
          <Label htmlFor="nomClient" className="text-base font-semibold">
            Nom <span className="text-primary">*</span>
          </Label>
          <Input
            id="nomClient"
            placeholder="Williams"
            value={formData.nomClient || ''}
            onChange={(e) => updateFormData({ nomClient: e.target.value })}
            className="h-12 text-base"
          />
        </div>

        {/* Champ Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold">
            Email <span className="text-primary">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jack.williams@email.com"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="h-12 text-base"
          />
          <p className="text-sm text-muted-foreground">
            Votre checklist personnalisée vous sera envoyée à cette adresse.
          </p>
        </div>

        {/* Opt-in pour communications */}
        <div className="flex items-start space-x-3 p-4 rounded-xl border-2 border-border bg-card">
          <Checkbox
            id="optIn"
            checked={formData.optIn || false}
            onCheckedChange={(checked) => updateFormData({ optIn: checked as boolean })}
            className="mt-1"
          />
          <Label htmlFor="optIn" className="cursor-pointer text-sm leading-relaxed">
            J'accepte de recevoir des informations et des conseils pour préparer mon voyage par email.
            <span className="text-primary"> *</span>
          </Label>
        </div>
      </div>

      {/* Aperçu du PDF */}
      <div className="space-y-4 max-w-6xl mx-auto">
        <h3 className="text-xl font-bold text-center">📄 Aperçu de votre checklist</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Vérifiez votre PDF avant de le télécharger
        </p>
        {/* 🔧 FIX: Afficher les erreurs de chargement */}
        {pdfError && (
          <div className="w-full h-[600px] border-2 border-destructive rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-destructive font-bold mb-2">❌ Erreur de chargement du PDF</p>
              <p className="text-sm text-muted-foreground">{pdfError}</p>
              <p className="text-xs text-muted-foreground mt-4">Consultez la console pour plus de détails</p>
            </div>
          </div>
        )}
        {!PDFComponents && !pdfError && (
          <div className="w-full h-[600px] border-2 border-border rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chargement de l'aperçu PDF...</p>
          </div>
        )}
        {showPDF && PDFComponents && !pdfError && (
          <div className="w-full h-[600px] border-2 border-border rounded-lg overflow-hidden shadow-lg">
            <PDFComponents.PDFViewer width="100%" height="100%" showToolbar={true}>
              <PDFComponents.TravelPrepPDF formData={formData} checklistData={generatedChecklist} />
            </PDFComponents.PDFViewer>
          </div>
        )}
      </div>
    </div>
  );
};
