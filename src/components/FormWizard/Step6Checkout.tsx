import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { PDFViewer } from '@react-pdf/renderer';
import { TravelPrepPDF } from '@/components/PDF/PDFDocument';
import { generateCompleteChecklist } from '@/utils/checklistGenerator';
import { useState, useEffect } from 'react';

interface Step6CheckoutProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step6Checkout = ({ formData, updateFormData }: Step6CheckoutProps) => {
  const [showPDF, setShowPDF] = useState(false);
  const generatedChecklist = generateCompleteChecklist(formData);

  // Afficher le PDF après un court délai pour éviter les problèmes de rendu
  useEffect(() => {
    const timer = setTimeout(() => setShowPDF(true), 500);
    return () => clearTimeout(timer);
  }, []);
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
            placeholder="Jean"
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
            placeholder="Dupont"
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
            placeholder="jean.dupont@email.com"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="h-12 text-base"
          />
          <p className="text-sm text-muted-foreground">
            Votre checklist personnalisée vous sera envoyée à cette adresse.
          </p>
        </div>
      </div>

      {/* Aperçu du PDF */}
      <div className="space-y-4 max-w-6xl mx-auto">
        <h3 className="text-xl font-bold text-center">📄 Aperçu de votre checklist</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Vérifiez votre PDF avant de le télécharger
        </p>
        {showPDF && (
          <div className="w-full h-[600px] border-2 border-border rounded-lg overflow-hidden shadow-lg">
            <PDFViewer width="100%" height="100%" showToolbar={true}>
              <TravelPrepPDF formData={formData} checklistData={generatedChecklist} />
            </PDFViewer>
          </div>
        )}
      </div>
    </div>
  );
};
