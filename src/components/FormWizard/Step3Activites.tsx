import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, Activite } from "@/types/form";
import checklistData from "@/data/checklist";

interface Step3ActivitesProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step3Activites = ({ formData, updateFormData }: Step3ActivitesProps) => {
  const activites = checklistData.labels.activites;

  const handleActiviteToggle = (activite: Activite) => {
    const current = formData.activites || [];
    const updated = current.includes(activite)
      ? current.filter((a) => a !== activite)
      : [...current, activite];
    updateFormData({ activites: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          🎯 Quelles activités au programme ?
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez tout ce qui s'applique
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <Label className="text-base font-semibold">Type d'activités</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(activites).map(([key, label]) => (
            <div
              key={key}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                formData.activites?.includes(key as Activite)
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              onClick={() => handleActiviteToggle(key as Activite)}
            >
              <Checkbox
                id={`activite-${key}`}
                checked={formData.activites?.includes(key as Activite)}
                onCheckedChange={() => handleActiviteToggle(key as Activite)}
              />
              <Label htmlFor={`activite-${key}`} className="flex-1 cursor-pointer text-base">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
