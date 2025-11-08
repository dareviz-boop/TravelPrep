import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";

interface Step3ActivitesProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step3Activites = ({ formData, updateFormData }: Step3ActivitesProps) => {
  const handleActiviteToggle = (activite: string) => {
    // Assurez-vous que formData.activites existe, sinon utilisez un tableau vide
    const currentActivites = formData.activites || []; 
    
    // Vérifie si l'activité est déjà sélectionnée
    const isSelected = currentActivites.includes(activite);
    
    const updated = isSelected
      ? currentActivites.filter((a) => a !== activite) // Retirer l'activité
      : [...currentActivites, activite]; // Ajouter l'activité
      
    updateFormData({ activites: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          🎯 Quelles activités prévoyez-vous ?
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez tout ce qui s'applique
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <Label className="text-base font-semibold">
          Activités prévues (plusieurs choix possibles)
        </Label>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(checklistData.activites).map(([code, activite]: [string, any]) => {
                const isChecked = (formData.activites || []).includes(code); // Utilisation de || [] pour la sécurité

                return (
            <div
              key={code}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                isChecked
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              onClick={() => handleActiviteToggle(code)}
            >
              <Checkbox
                id={`activite-${code}`}
                checked={isChecked}
                // Pas besoin de onCheckedChange car le onClick du div parent gère le toggle
                // onCheckedChange={() => handleActiviteToggle(code)} 
              />
              <Label
                htmlFor={`activite-${code}`}
                className="flex-1 cursor-pointer text-base"
              >
                {activite.label}
              </Label>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
};
