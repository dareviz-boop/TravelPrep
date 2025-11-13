// Step 2 Info.tsx

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

  /**
   * Fonction générique pour gérer la bascule (toggle) de la sélection multiple pour saison et temperature.
   * Elle applique les contraintes d'exclusivité de 'inconnue' et de non-vide.
   */
  const handleToggle = (field: 'saison' | 'temperature', itemId: string) => {
    const current = (formData[field] as string[] || []);
    const isCurrentlySelected = current.includes(itemId);
    
    // --- Logique Spéciale pour l'option "inconnue" ---
    if (itemId === 'inconnue') {
        let newState: string[];

        if (isCurrentlySelected) {
             // Si 'inconnue' est décochée, on passe à un état vide (validé par Generator.tsx)
             newState = []; 
        } else {
             // Si 'inconnue' est cochée, elle est exclusive
             newState = ['inconnue']; 
        }
        
        updateFormData({ [field]: newState } as Partial<FormData>);
        return;
    }

    // --- Pour toute autre option ---
    
    // 1. S'assurer de retirer 'inconnue' si elle était sélectionnée.
    let updated = current.filter(id => id !== 'inconnue');

    // 2. Basculer l'option cliquée
    if (isCurrentlySelected) {
        updated = updated.filter(id => id !== itemId); // Retirer l'élément
    } else {
        updated = [...updated, itemId]; // Ajouter l'élément
    }

    // 3. S'assurer qu'il y a toujours au moins une réponse
    if (updated.length === 0) {
        updated = ['inconnue'];
    }

    updateFormData({ [field]: updated } as Partial<FormData>);
  };


  /**
   * Logique pour les conditions climatiques spéciales (Inchangement)
   */
  const handleConditionToggle = (conditionId: string) => {
    const current = formData.conditionsClimatiques || []; 
    
    if (conditionId === 'aucune') {
        const isCurrentlyNone = current.includes('aucune');
        updateFormData({ conditionsClimatiques: isCurrentlyNone ? [] : ['aucune'] });
        return;
    }
    
    const filteredCurrent = current.filter(id => id !== 'aucune');
    const isSelected = filteredCurrent.includes(conditionId);

    const updated = isSelected
        ? filteredCurrent.filter((id) => id !== conditionId)
        : [...filteredCurrent, conditionId];

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
        
        {/* Saison de voyage (CORRIGÉ: Utilise Checkbox/Label pour Multi-sélection) */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            📅 Saisons de voyage <span className="text-primary">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3"> 
            {checklistData.saisons.options.map((saison: any) => {
                const isSelected = (formData.saison as string[] || []).includes(saison.id);
                return (
                    <div key={saison.id}>
                        {/* 1. INPUT Checkbox invisible */}
                        <Checkbox 
                            id={`saison-${saison.id}`} 
                            className="peer sr-only"
                            checked={isSelected}
                            onCheckedChange={() => handleToggle('saison', saison.id)} 
                        />
                        {/* 2. LABEL qui sert de carte cliquable */}
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
                );
            })}
          </div>
        </div>

        {/* Température moyenne (CORRIGÉ: Utilise Checkbox/Label pour Multi-sélection) */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            🌡️ Températures moyennes sur place <span className="text-primary">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3"> 
            {checklistData.temperatures.options.map((temp: any) => {
                const isSelected = (formData.temperature as string[] || []).includes(temp.id);
                return (
                    <div key={temp.id}>
                         {/* 1. INPUT Checkbox invisible */}
                        <Checkbox 
                            id={`temp-${temp.id}`} 
                            className="peer sr-only"
                            checked={isSelected}
                            onCheckedChange={() => handleToggle('temperature', temp.id)} 
                        />
                         {/* 2. LABEL qui sert de carte cliquable */}
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
                );
            })}
          </div>
        </div>

        {/* Conditions climatiques spéciales (Inchangement - utilise déjà la Checkbox) */}
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
                  const initialSelection = formData.conditionsClimatiques || []; 
                  const isSelected = initialSelection.includes(condition.id);

                  const [emoji, ...labelParts] = condition.nom.split(' ');
                  const title = labelParts.join(' ').trim();
                  
                  return (
                    <div key={condition.id}>
                      {/* 1. L'INPUT Checkbox (invisible) */}
                      <Checkbox
                        value={condition.id}
                        id={`condition-${condition.id}`}
                        className="peer sr-only" 
                        checked={isSelected}
                        onCheckedChange={() => handleConditionToggle(condition.id)} 
                      />
                      
                      {/* 2. Le LABEL englobe TOUT le design de la carte et la rend cliquable */}
                      <Label
                        htmlFor={`condition-${condition.id}`}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                          "hover:border-primary/50",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                          condition.id === 'aucune' ? 'bg-secondary/20' : '' 
                        )}
                      >
                        {/* 3. Le contenu de la carte */}
                        <span className="flex-1 cursor-pointer">
                            <p className="font-semibold text-base flex items-center">
                                <span className="mr-2">{emoji}</span>
                                {title}
                            </p>
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
