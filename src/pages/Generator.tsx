import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/FormWizard/ProgressBar";
import { Step1Destination } from "@/components/FormWizard/Step1Destination";
import { Step3Activites } from "@/components/FormWizard/Step3Activites";
import { Step4Profil } from "@/components/FormWizard/Step4Profil";
import { Step5Options } from "@/components/FormWizard/Step5Options";
import { FormData } from "@/types/form";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";
import { checklistData } from "@/utils/checklistUtils";

const Generator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nomVoyage: "",
    dateDepart: "",
    localisation: "europe",
    pays: [],
    temperature: "temperee",
    saison: "ete",
    conditionsClimatiques: [],
    activites: [],
    profil: "solo",
    agesEnfants: [],
    typeVoyage: "equilibre",
    confort: "confortable",
    sectionsInclure: [],
    formatPDF: "detaille",
    formatFichier: "pdf",
  });

  const stepTitles = ["Destination", "Activités", "Profil", "Récapitulatif", "Checkout"];

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.nomVoyage || !formData.dateDepart) {
          toast.error("Veuillez remplir tous les champs obligatoires");
          return false;
        }
        return true;
      case 1:
        if (!formData.localisation || !formData.temperature || !formData.saison) {
          toast.error("Veuillez remplir tous les champs obligatoires");
          return false;
        }
        return true;
      case 3:
        if (!formData.profil || !formData.confort) {
          toast.error("Veuillez sélectionner un profil et un niveau de confort");
          return false;
        }
        return true;
      case 4:
        if (!formData.formatPDF) {
          toast.error("Veuillez sélectionner un format de PDF");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleGeneratePDF = async () => {
    if (!validateStep(currentStep)) return;

    toast.success("Génération du PDF en cours...", {
      description: "Votre checklist personnalisée est en cours de création",
    });

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { TravelPrepPDF } = await import('@/components/PDF/PDFDocument');
      const checklistComplete = await import('@/data/checklistComplete.json');

      const blob = await pdf(
        <TravelPrepPDF formData={formData} checklistData={checklistComplete.default} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.nomVoyage.replace(/\s+/g, '_')}_TravelPrep.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDF généré avec succès !", {
        description: "Votre checklist est prête à être utilisée",
      });
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      toast.error("Erreur lors de la génération du PDF", {
        description: "Veuillez réessayer",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Destination formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <Step3Activites formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step4Profil formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step5Options formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <div className="text-center">Checkout page à venir</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Dareviz */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-2 text-primary">
            TravelPrep
          </h1>
          <p className="text-sm text-foreground/60 mb-4">by Dareviz</p>
          <p className="text-xl text-foreground/80 font-medium">
            Générateur de checklist voyage personnalisée
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={stepTitles.length}
          stepTitles={stepTitles}
        />

        {/* Form Step */}
        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 mb-8 border-2 border-border">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="h-14 px-8 text-base font-bold border-2 hover:bg-muted disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Précédent
          </Button>

          {currentStep < stepTitles.length - 1 ? (
            <Button 
              onClick={handleNext} 
              className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary-dark text-white shadow-lg"
            >
              Suivant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleGeneratePDF}
              className="h-14 px-10 text-base font-bold bg-primary hover:bg-primary-dark text-white shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Générer mon PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
