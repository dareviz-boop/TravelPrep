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
    // 1. Définir l'état actuel. Si vide, on commence avec ['aucune'] pour la cohérence visuelle.
    // NOTE: Le changement d'état se fait sur formData, qui est ensuite reflété par isSelected.
    const current = formData.conditionsClimatiques || []; 
    
    // --- Logique Spéciale pour l'option "aucune" ---
    if (conditionId === 'aucune') {
        const isCurrentlyNone = current.includes('aucune');
        // Si 'aucune' est déjà cochée -> on la décoche (état vide), 
        // sinon -> on sélectionne uniquement 'aucune'.
        updateFormData({ conditionsClimatiques: isCurrentlyNone ? [] : ['aucune'] });
        return;
    }
    
    // --- Pour toute autre option ---
    
    // 1. S'assurer de retirer 'aucune' si elle était sélectionnée (car on choisit autre chose).
    const filteredCurrent = current.filter(id => id !== 'aucune');
    
    // 2. Basculer l'option cliquée
    const isSelected = filteredCurrent.includes(conditionId);

    const updated = isSelected
        ? filteredCurrent.filter((id) => id !== conditionId)
        : [...filteredCurrent, conditionId];

    // Si la liste est vide après bascule (très rare), on revient à ['aucune']
    updateFormData({ conditionsClimatiques: updated.length > 0 ? updated : ['aucune'] });
  };

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
            value={formData.saison || "inconnue"} // <-- CORRECTION: Défaut sur 'inconnue'
            onValueChange={(value) => updateFormData({ saison: value as FormData['saison'] })}
            className="grid grid-cols-2 gap-3"
          >
            {checklistData.saisons.options.map((saison: any) => (
              <div key={saison.id}>
                <RadioGroupItem value={saison.id} id={`saison-${saison.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`saison-${saison.id}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  )}
                >
                  <span className="flex-1 cursor-pointer">
                    <p className="font-semibold text-base flex items-center">
                        <span className="mr-2">{saison.emoji}</span>
                        {saison.nom}
                    </p>
                    <p className="text-muted-foreground text-sm font-normal mt-1">
                        {saison.description}
                    </p>
                  </span>
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
            value={formData.temperature || "inconnue"} // <-- CORRECTION: Défaut sur 'inconnue'
            onValueChange={(value) => updateFormData({ temperature: value as FormData['temperature'] })}
            className="grid grid-cols-1 gap-3"
          >
            {checklistData.temperatures.options.map((temp: any) => (
              <div key={temp.id}>
                <RadioGroupItem value={temp.id} id={`temp-${temp.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`temp-${temp.id}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  )}
                >
                  <span className="flex-1 cursor-pointer">
                    <p className="font-semibold text-base flex items-center">
                        <span className="mr-2">{temp.emoji}</span>
                        {temp.nom}
                    </p>
                    <p className="text-muted-foreground text-sm font-normal mt-1">
                        {temp.description}
                    </p>
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
                // Utilise ['aucune'] par défaut si le tableau est undefined ou vide
                const initialSelection = formData.conditionsClimatiques || ['aucune']; 
                const isSelected = initialSelection.includes(condition.id);
                
                // Extraction de l'emoji et du nom
                const [emoji, ...labelParts] = condition.nom.split(' ');
                const title = labelParts.join(' ').trim();
                
                return (
                  <div
                    key={condition.id}
                    // items-center aligne le contenu en haut (première ligne)
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        isSelected ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => handleConditionToggle(condition.id)}
                  >
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={isSelected}
                      onCheckedChange={() => {}} 
                      className="mt-0" // CORRECTION : Supprimer le décalage
                    />
                    <Label htmlFor={`condition-${condition.id}`} className="flex-1 cursor-pointer">
                      {/* LA CORRECTION EST ICI :
                        Change 'items-center' en 'items-center' 
                        pour que l'emoji s'aligne en haut avec la première ligne de texte.
                      */}
                      <span className="font-semibold text-base flex items-center">
                        <span className="mr-2 text-xl">{emoji}</span>
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
