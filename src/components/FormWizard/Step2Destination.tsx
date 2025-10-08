import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, Destination, Saison, Duree } from "@/types/form";
import checklistData from "@/data/checklist";

interface Step2DestinationProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step2Destination = ({ formData, updateFormData }: Step2DestinationProps) => {
  const destinations = checklistData.labels.destinations;
  const saisons = checklistData.labels.saisons;
  const durees = checklistData.labels.durees;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          📍 Où partez-vous ?
        </h2>
        <p className="text-muted-foreground">
          Cela nous aidera à personnaliser votre checklist
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Type de destination <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.destination}
            onValueChange={(value) => updateFormData({ destination: value as Destination })}
            className="grid grid-cols-1 gap-3"
          >
            {Object.entries(destinations).map(([key, label]) => (
              <div
                key={key}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.destination === key ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={key} id={`dest-${key}`} />
                <Label htmlFor={`dest-${key}`} className="flex-1 cursor-pointer text-base">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Saison sur place <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.saison}
            onValueChange={(value) => updateFormData({ saison: value as Saison })}
            className="grid grid-cols-2 gap-3"
          >
            {Object.entries(saisons).map(([key, label]) => (
              <div
                key={key}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.saison === key ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={key} id={`saison-${key}`} />
                <Label htmlFor={`saison-${key}`} className="flex-1 cursor-pointer text-base">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Durée du séjour
          </Label>
          <RadioGroup
            value={formData.duree}
            onValueChange={(value) => updateFormData({ duree: value as Duree })}
            className="grid grid-cols-1 gap-3"
          >
            {Object.entries(durees).map(([key, label]) => (
              <div
                key={key}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.duree === key ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={key} id={`duree-${key}`} />
                <Label htmlFor={`duree-${key}`} className="flex-1 cursor-pointer text-base">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
