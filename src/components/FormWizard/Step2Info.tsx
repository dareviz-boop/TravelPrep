import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, Pays } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { checklistData, getPaysOptions, calculateDuree } from "@/utils/checklistUtils";

interface Step2InfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step2Info = ({ formData, updateFormData }: Step2InfoProps) => {
  const [open, setOpen] = useState(false);
  const [showPaysSelector, setShowPaysSelector] = useState(false);

  const paysOptions = getPaysOptions(formData.localisation);

  const handlePaysSelect = (pays: Pays) => {
    const currentPays = formData.pays || [];
    const isAlreadySelected = currentPays.some(p => p.code === pays.code);
    
    if (isAlreadySelected) {
      updateFormData({ pays: currentPays.filter(p => p.code !== pays.code) });
    } else if (currentPays.length < 3) {
      updateFormData({ pays: [...currentPays, pays] });
    }
  };

  const handlePaysRemove = (paysCode: string) => {
    updateFormData({ pays: (formData.pays || []).filter(p => p.code !== paysCode) });
  };

  const handleConditionToggle = (conditionId: string) => {
      // Récupérer l'état actuel, par défaut un tableau vide si undefined
      const current = formData.conditionsClimatiques || [];
  
      // Logique pour l'option "aucune"
      if (conditionId === 'aucune') {
          const isCurrentlyNone = current.includes('aucune');
          // Si elle est cochée -> la décocher (état vide), sinon -> sélectionner uniquement 'aucune'
          updateFormData({ conditionsClimatiques: isCurrentlyNone ? [] : ['aucune'] });
          return;
      }
  
      // Pour toute autre option :
      // 1. S'assurer de retirer 'aucune' si elle était sélectionnée.
      const filteredCurrent = current.filter(id => id !== 'aucune');
  
      // 2. Basculer l'option cliquée
      const updated = filteredCurrent.includes(conditionId)
          ? filteredCurrent.filter((id) => id !== conditionId)
          : [...filteredCurrent, conditionId];
  
      updateFormData({ conditionsClimatiques: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          📍 Où partez-vous ?
        </h2>
        <p className="text-muted-foreground">
          Ces informations nous permettront d'adapter vos recommandations
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Température moyenne */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            🌡️ Température moyenne sur place <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.temperature}
            onValueChange={(value) => updateFormData({ temperature: value as FormData['temperature'] })}
            className="grid grid-cols-1 gap-3"
          >
            {Object.entries(checklistData.temperatures).map(([code, temp]: [string, any]) => (
              <div
                key={code}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.temperature === code ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={code} id={`temp-${code}`} />
                <Label htmlFor={`temp-${code}`} className="flex-1 cursor-pointer text-base">
                  {temp.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Saison de voyage */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            📅 Saison de voyage <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.saison}
            onValueChange={(value) => updateFormData({ saison: value as FormData['saison'] })}
            className="grid grid-cols-2 gap-3"
          >
            {Object.entries(checklistData.saisons).map(([code, saison]: [string, any]) => (
              <div
                key={code}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.saison === code ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={code} id={`saison-${code}`} />
                <Label htmlFor={`saison-${code}`} className="flex-1 cursor-pointer">
                  {saison.label}
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
        
            {/* Utilise la nouvelle structure groupée du JSON */}
            {checklistData.conditionsClimatiques.map((groupe, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg bg-muted/30 shadow-sm">
                    <Label className="text-base font-semibold text-primary/80 border-b pb-2 block">
                        {groupe.groupe}
                    </Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {groupe.options.map((condition) => {
                            const isSelected = (formData.conditionsClimatiques || []).includes(condition.id);
                            
                            // Extraction de l'emoji et du nom pour l'affichage (si le JSON contient l'emoji dans 'nom')
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
                                        onCheckedChange={() => handleConditionToggle(condition.id)}
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
        )}
      </div>
    </div>
  );
};
