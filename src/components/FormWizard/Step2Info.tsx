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
    // NOTE: On suppose que saison et temperature sont de type string[] dans FormData
    const current = formData[field] as string[] || [];
    const isCurrentlySelected = current.includes(itemId);
    
    // --- Logique Spéciale pour l'option "inconnue" ---
    if (itemId === 'inconnue') {
        const newState = isCurrentlySelected ? [] : ['inconnue'];
        
        // Si on décoche 'inconnue', on force la validation au prochain clic sur le bouton Suivant (mais on permet l'état vide temporaire)
        // Sinon, on sélectionne uniquement 'inconnue', retirant tout le reste.
        updateFormData({ [field]: newState } as Partial<FormData>);
        return;
    }

    // --- Pour toute autre option ---
    
    // 1. S'assurer de retirer 'inconnue' si elle était sélectionnée (car on choisit autre chose).
    let updated = current.filter(id => id !== 'inconnue');

    // 2. Basculer l'option cliquée
    if (isCurrentlySelected) {
        updated = updated.filter(id => id !== itemId); // Retirer l'élément
    } else {
        updated = [...updated, itemId]; // Ajouter l'élément
    }

    // 3. Contrainte: S'assurer qu'il y a toujours au moins une réponse
    // Si la liste est vide après bascule, on revient à ['inconnue'] (pour une valeur par défaut cohérente, bien que la validation dans Generator.tsx soit plus stricte).
    if (updated.length === 0) {
        updated = ['inconnue'];
    }

    updateFormData({ [field]: updated } as Partial<FormData>);
  };


  /**
   * Logique pour les conditions climatiques spéciales (Inchangé)
   */
  const handleConditionToggle = (conditionId: string) => {
    // 1. Définir l'état actuel.
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

    // Si la liste est vide après bascule, on revient à ['aucune']
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
        
        {/* Saison de voyage (Maintenant avec Checkbox pour Multi-sélection) */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            📅 Saisons de voyage <span className="text-primary">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3"> {/* Remplacement de RadioGroup par un simple div */}
            {checklistData.saisons.options.map((saison: any) => {
                // NOTE: formData.saison est maintenant traité comme string[]
                const isSelected = (formData.saison as string[] || []).includes(saison.id);
                return (
                    <div key={saison.id}>
                        <Checkbox 
                            id={`saison-${saison.id}`} 
                            className="peer sr-only"
                            checked={isSelected}
                            onCheckedChange={() => handleToggle('saison', saison.id)} // Utilisation du nouveau handler
                        />
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

        {/* Température moyenne (Maintenant avec Checkbox pour Multi-sélection) */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            🌡️ Températures moyennes sur place <span className="text-primary">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3"> {/* Remplacement de RadioGroup par un simple div */}
            {checklistData.temperatures.options.map((temp: any) => {
                // NOTE: formData.temperature est maintenant traité comme string[]
                const isSelected = (formData.temperature as string[] || []).includes(temp.id);
                return (
                    <div key={temp.id}>
                        <Checkbox 
                            id={`temp-${temp.id}`} 
                            className="peer sr-only"
                            checked={isSelected}
                            onCheckedChange={() => handleToggle('temperature', temp.id)} // Utilisation du nouveau handler
                        />
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
                  // Utilise [] si formData.conditionsClimatiques est vide
                  const initialSelection = formData.conditionsClimatiques || []; 
                  const isSelected = initialSelection.includes(condition.id);

                  // Extraction de l'emoji et du nom
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
                          // ✅ CORRECTION du style pour des cases plus petites et alignées
                          "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                          "hover:border-primary/50",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                          // Style spécifique pour l'option 'Aucune condition' si nécessaire
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
