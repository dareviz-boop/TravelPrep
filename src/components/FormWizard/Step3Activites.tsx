import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { cn } from "@/lib/utils"; // Importation pour la gestion des classes

interface Step3ActivitesProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step3Activites = ({ formData, updateFormData }: Step3ActivitesProps) => {
  const handleActiviteToggle = (activite: string) => {
    const currentActivites = formData.activites || []; 
    
    const isSelected = currentActivites.includes(activite as any);
    
    const updated = isSelected
      ? currentActivites.filter((a) => a !== activite as any)
      : [...currentActivites, activite as any];
        
    updateFormData({ activites: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          🎯 Quelles activités prévoyez-vous ?
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez tout ce qui s'applique (choix multiple)
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(checklistData.activites).map(([code, activite]: [string, any]) => {
            const isChecked = (formData.activites || []).includes(code as any);

            return (
              <div
                key={code}
                // Utilisation de cn pour une meilleure gestion des classes
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                  isChecked
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-border"
                )}
                onClick={() => handleActiviteToggle(code)}
              >
                <Checkbox
                  id={`activite-${code}`}
                  checked={isChecked}
                  // OnCheckedChange n'est pas nécessaire puisque le click sur le div parent gère le toggle
                  onCheckedChange={() => {}} 
                  className="mt-1" // Aide à l'alignement de la checkbox
                />
                <Label
                  htmlFor={`activite-${code}`}
                  className="flex-1 cursor-pointer text-base font-medium"
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
