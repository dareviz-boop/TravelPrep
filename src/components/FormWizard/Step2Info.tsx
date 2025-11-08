import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { cn } from "@/lib/utils"; 

interface Step2InfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step2Info = ({ formData, updateFormData }: Step2InfoProps) => {
  const handleConditionToggle = (conditionId: string) => {
    // Récupérer l'état actuel, par défaut un tableau vide
    const current = formData.conditionsClimatiques || [];
    
    // --- Logique Spéciale pour l'option "aucune" ---
    if (conditionId === 'aucune') {
        const isCurrentlyNone = current.includes('aucune');
        // Si 'aucune' est cochée -> on la décoche (état vide), 
        // sinon -> on sélectionne uniquement 'aucune'.
        updateFormData({ conditionsClimatiques: isCurrentlyNone ? [] : ['aucune'] });
        return;
    }
    
    // --- Pour toute autre option ---
    
    // 1. S'assurer de retirer 'aucune' si elle était sélectionnée.
    const filteredCurrent = current.filter(id => id !== 'aucune');
    
    // 2. Basculer l'option cliquée
    const isSelected = filteredCurrent.includes(conditionId);

    const updated = isSelected
        ? filteredCurrent.filter((id) => id !== conditionId)
        : [...filteredCurrent, conditionId];

    updateFormData({ conditionsClimatiques: updated });
  };

  
  console.log("Objet checklistData COMPLET :", checklistData); 
  console.log("Propriétés de saisons :", Object.keys(checklistData.saisons || {}));
  
  
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          📍 Informations complémentaires
        </h2>
        <p className="text-muted-foreground">
          Ces informations nous permettront d'adapter vos recommandations
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        
        {/* Saison de voyage */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            📅 Saison de voyage <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.saison}
            onValueChange={(value) => updateFormData({ saison: value as FormData['saison'] })}
            className="grid grid-cols-2 gap-3"
          >
            {Object.entries(checklistData.saisons).map(([code, saison]: [string, any]) => (
              <div
                key={code}
              >
                <RadioGroupItem value={code} id={`saison-${code}`} className="peer sr-only" />
                <Label
                  htmlFor={`saison-${code}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  )}
                >
                  <span className="flex-1 cursor-pointer font-semibold text-base">{saison.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Température moyenne */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            🌡️ Température moyenne sur place <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.temperature}
            onValueChange={(value) => updateFormData({ temperature: value as FormData['temperature'] })}
            className="grid grid-cols-1 gap-3"
          >
            {Object.entries(checklistData.temperatures).map(([code, temp]: [string, any]) => (
              <div key={code}>
                <RadioGroupItem value={code} id={`temp-${code}`} className="peer sr-only" />
                <Label
                  htmlFor={`temp-${code}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  )}
                >
                  <span className="flex-1 cursor-pointer text-base font-medium">
                    {temp.label}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Conditions climatiques spéciales */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold mb-3">
            Conditions climatiques <span className="text-muted-foreground text-sm font-normal">(choix multiple - optionnel)</span>
          </h3>
      
          {/* Utilise la structure groupée du JSON */}
          {checklistData.conditionsClimatiques.map((groupe, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-xl bg-card shadow-sm">
              <Label className="text-base font-bold text-primary/80 border-b pb-2 block">
                {groupe.groupe}
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupe.options.map((condition) => {
                  const isSelected = (formData.conditionsClimatiques || []).includes(condition.id);
                  
                  // Extraction de l'emoji et du nom
                  const [emoji, ...labelParts] = condition.nom.split(' ');
                  const title = labelParts.join(' ').trim();
                  
                  return (
                    <div
                      key={condition.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                          isSelected ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => handleConditionToggle(condition.id)}
                    >
                      <Checkbox
                        id={`condition-${condition.id}`}
                        checked={isSelected}
                        // La logique de bascule est gérée par l'onClick du div parent via handleConditionToggle
                        onCheckedChange={() => {}} 
                        className="mt-1"
                      />
                      <Label htmlFor={`condition-${condition.id}`} className="flex-1 cursor-pointer">
                        <span className="font-semibold text-base flex items-center">
                          <span className="mr-2">{emoji}</span>
                          {title}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
