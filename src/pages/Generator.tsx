import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/FormWizard/ProgressBar";
import { Step1Destination } from "@/components/FormWizard/Step1Destination";
import { Step2Info } from '@/components/FormWizard/Step2Info';
import { Step3Activites } from "@/components/FormWizard/Step3Activites";
import { Step4Profil } from "@/components/FormWizard/Step4Profil";
import { Step5Options } from "@/components/FormWizard/Step5Options";
import { Step6Checkout } from "@/components/FormWizard/Step6Checkout";
import { FormData } from "@/types/form";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";
import { generateCompleteChecklist, getChecklistSummary } from "@/utils/checklistGenerator";

const Generator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0); // Track le plus loin que l'utilisateur est allé
  const [formData, setFormData] = useState<FormData>({
    nomVoyage: "",
    dateDepart: "",
    duree: "moyen",
    localisation: "multi-destinations",
    pays: [],
    temperature: ["inconnue"],
    saison: ["inconnue"],
    conditionsClimatiques: [],
    activites: [],
    profil: "couple",
    agesEnfants: [],
    typeVoyage: "flexible",
    confort: "standard",
    sectionsInclure: ['essentiels'],
    formatPDF: "detaille",
    formatFichier: "pdf",
    nomClient: "", 
    prenomClient: "",
    email: "",
  });
  
  useEffect(() => {
    // Vérifie si nous sommes dans un environnement de navigateur
    if (typeof window !== 'undefined') {
      // Force le défilement instantané vers le haut (0, 0)
      window.scrollTo(0, 0); 
    }
  }, [currentStep]); // Le code s'exécute uniquement lorsque currentStep change.

  const stepTitles = ["Destination", "Informations", "Activités", "Profil", "Récapitulatif", "Checkout"];
  
  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Étape 1 : Destinations (Nom, Localisation, Dates/Durée)
        if (!formData.nomVoyage || !formData.dateDepart || !formData.localisation) {
          toast.error("Veuillez remplir le nom du voyage, la date de départ et la zone géographique.");
          return false;
        }
        if (!formData.dateRetour && !formData.duree) {
            toast.error("Veuillez renseigner la date de retour OU la durée estimée.");
            return false;
        }
        return true;

      case 1: // Étape 2 : Informations (Saison & Température) 💥 CORRECTION MULTI-SÉLECTION
        const selectedTemperatures = formData.temperature as string[] || [];
        const selectedSaisons = formData.saison as string[] || [];

        // 1. Validation de non-vide (au moins un élément doit être sélectionné)
        if (selectedTemperatures.length === 0 || selectedSaisons.length === 0) {
            toast.error("Veuillez sélectionner au moins une température et une saison pour votre voyage.");
            return false;
        }

        // 2. Validation de l'exclusivité de 'inconnue'
        if ((selectedTemperatures.includes('inconnue') && selectedTemperatures.length > 1) ||
            (selectedSaisons.includes('inconnue') && selectedSaisons.length > 1)) {
            toast.error("L'option 'Inconnue' est exclusive et ne peut être sélectionnée avec d'autres saisons ou températures.");
            return false;
        }
        return true;
        
      case 2: // Étape 3 : Activités/Thèmes 💥 CORRECTION DE LA LOGIQUE
        if (!formData.activites || formData.activites.length === 0) {
           toast.error("Veuillez choisir au moins un thème d'activités pour générer la checklist.");
           return false;
        }
        return true;
        
      case 3: // Étape 4 : Profils et Confort (Validations existantes conservées)
        if (!formData.profil || !formData.typeVoyage || !formData.confort) { 
          toast.error("Veuillez sélectionner le type de voyageur, le type de voyage et le niveau de confort.");
          return false;
        }
          
        // Validation conditionnelle pour les familles
        if (formData.profil === 'famille') {
            if (!formData.nombreEnfants || formData.nombreEnfants <= 0) {
                 toast.error("Veuillez indiquer le nombre d'enfants.");
                 return false;
            }
            if (!formData.agesEnfants || formData.agesEnfants.length === 0) {
                 toast.error("Veuillez sélectionner au moins une catégorie d'âge pour vos enfants.");
                 return false;
            }
        }
        return true;

      case 4: // Étape 5 : Options
        if (!formData.formatPDF) {
          toast.error("Veuillez sélectionner un format de PDF (compact ou détaillé).");
          return false;
        }
        return true;

      case 5: // Étape 6 : Page de Checkout/Génération
        if (!formData.nomClient || !formData.prenomClient) {
        toast.error("Veuillez renseigner votre nom et votre prénom.");
        return false;
            }
            if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
              toast.error("Veuillez entrer une adresse email valide.");
              return false;
            }
            if (!formData.optIn) {
              toast.error("Veuillez accepter de recevoir des informations pour télécharger votre checklist.");
              return false;
            }
            return true;
        
      default:
        return true;
    }
};

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = Math.min(currentStep + 1, stepTitles.length - 1);
      setCurrentStep(nextStep);
      // Mettre à jour le maximum atteint
      setMaxStepReached((prev) => Math.max(prev, nextStep));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Fonction pour naviguer vers une étape spécifique (uniquement si déjà visitée)
  const handleStepClick = (stepIndex: number) => {
    // Permettre uniquement de naviguer vers les étapes déjà visitées
    if (stepIndex <= maxStepReached) {
      setCurrentStep(stepIndex);
    }
  };

  const handleGeneratePDF = async () => {
    if (!validateStep(currentStep)) return;

    console.log('🚀 Début de la génération du PDF');
    console.log('📋 FormData:', formData);

    toast.success("Génération du PDF en cours...", {
      description: "Votre checklist personnalisée est en cours de création",
    });

    try {
      // ✨ NOUVEAU : Générer la checklist avec le système intelligent
      console.log('📦 Génération de la checklist...');
      const generatedChecklist = generateCompleteChecklist(formData);

      // 📊 Afficher le résumé dans la console (debug)
      console.log('📋 CHECKLIST GÉNÉRÉE:');
      console.log(getChecklistSummary(generatedChecklist));
      console.log('📊 Stats:', generatedChecklist.stats);

      console.log('📥 Import de @react-pdf/renderer...');
      // Import avec retry en cas d'échec
      const reactPdfModule = await import('@react-pdf/renderer').catch(async (err) => {
        console.error('❌ Erreur initiale import @react-pdf/renderer:', err);
        console.log('🔄 Nouvelle tentative dans 1 seconde...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return import('@react-pdf/renderer');
      });

      const { pdf } = reactPdfModule;

      console.log('📥 Import du composant TravelPrepPDF...');
      const { TravelPrepPDF } = await import('@/components/PDF/PDFDocument');

      console.log('🎨 Création du document PDF...');
      const pdfDoc = <TravelPrepPDF formData={formData} checklistData={generatedChecklist} />;

      console.log('📄 Conversion en blob...');
      const blob = await pdf(pdfDoc).toBlob();
      console.log('✅ Blob créé:', blob.size, 'bytes');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.nomVoyage.replace(/\s+/g, '_')}_TravelPrep.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      console.log('✅ PDF téléchargé avec succès !');
      toast.success("PDF généré avec succès !", {
        description: `${generatedChecklist.stats.totalItems} items organisés en ${generatedChecklist.stats.totalSections} sections`,
      });
    } catch (error) {
      console.error("❌ Erreur génération PDF:", error);
      console.error("❌ Stack:", (error as Error).stack);
      const errorMessage = error instanceof Error ? error.message : "Veuillez réessayer";
      toast.error("Erreur lors de la génération du PDF", {
        description: `${errorMessage}\n\nℹ️ Essayez de rafraîchir la page si le problème persiste.`,
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Destination formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <Step2Info formData={formData} updateFormData={updateFormData} />; 
      case 2:
        return <Step3Activites formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step4Profil formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step5Options formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step6Checkout formData={formData} updateFormData={updateFormData} />; 
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
            <span className="inline-block text-5xl mr-3">🌍   </span>
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
          maxStepReached={maxStepReached}
          onStepClick={handleStepClick}
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
            className="h-14 px-8 text-base font-bold border-2
                       border-primary/50 text-foreground
                       hover:bg-primary/20 hover:border-primary hover:text-foreground // Ligne modifiée
                       disabled:opacity-50"
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
