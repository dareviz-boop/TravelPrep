// Step 2 Info.tsx

import React, { useState, useRef, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { generateAutoSuggestions, autoDetectSeasons, autoDetectTemperatures } from "@/utils/checklistFilters";
import { Card } from "@/components/ui/card";

interface Step2InfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

/**
 * Convertit un texte markdown simple en JSX
 * Supporte **texte** pour le gras et \n pour les retours à la ligne
 */
const renderMarkdown = (text: string) => {
  const parts = text.split('\n');
  return parts.map((line, lineIndex) => {
    const segments: React.ReactNode[] = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      // Ajouter le texte avant le match
      if (match.index > lastIndex) {
        segments.push(line.substring(lastIndex, match.index));
      }
      // Ajouter le texte en gras
      segments.push(<strong key={`bold-${lineIndex}-${match.index}`}>{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }

    // Ajouter le reste du texte
    if (lastIndex < line.length) {
      segments.push(line.substring(lastIndex));
    }

    return (
      <span key={`line-${lineIndex}`}>
        {segments}
        {lineIndex < parts.length - 1 && <br />}
      </span>
    );
  });
};

export const Step2Info = ({ formData, updateFormData }: Step2InfoProps) => {

  // Ref pour tracker si l'utilisateur a modifié manuellement les conditions climatiques
  const hasUserModifiedConditionsRef = useRef(false);

  // State pour tracker si les recommandations ont déjà été calculées (réinitialise à chaque montage du composant)
  const [recommendationsCalculated, setRecommendationsCalculated] = useState(false);

  // Calculer les recommandations avec useMemo pour qu'elles soient toujours disponibles
  const recommendedConditions = useMemo(() => {
    if (!formData.localisation || !formData.dateDepart || !formData.pays || formData.pays.length === 0) {
      return new Set<string>();
    }

    const suggestions = generateAutoSuggestions(formData);
    return new Set(suggestions.map(s => s.conditionId));
  }, [formData.localisation, formData.pays, formData.temperature, formData.saison, formData.dateDepart, formData.dateRetour]);

  /**
   * 🌍 Auto-détection des saisons : Attribution automatique selon pays, date et durée
   * Déclenché quand date de départ, date de retour, durée ou pays changent
   * ✨ Met à jour automatiquement à chaque changement de dates
   */
  useEffect(() => {
    if (formData.dateDepart && formData.pays && formData.pays.length > 0) {
      const detectedSeasons = autoDetectSeasons(formData);

      if (detectedSeasons.length > 0) {
        updateFormData({ saison: detectedSeasons });
      }
    }
  }, [formData.dateDepart, formData.dateRetour, formData.pays]);

  /**
   * 🌡️ Auto-détection des températures : Attribution automatique selon pays et date
   * Déclenché quand date de départ ou pays changent
   * ✨ Met à jour automatiquement à chaque changement de dates
   */
  useEffect(() => {
    if (formData.dateDepart && formData.pays && formData.pays.length > 0) {
      const detectedTemperatures = autoDetectTemperatures(formData);

      if (detectedTemperatures.length > 0) {
        updateFormData({ temperature: detectedTemperatures });
      }
    }
  }, [formData.dateDepart, formData.dateRetour, formData.pays]);

  /**
   * 🔄 Auto-suggestions : Pré-sélectionner automatiquement les conditions recommandées
   * Déclenché dès qu'on a destination, pays et dates (première visite de l'étape 2)
   *
   * ✨ Améliorations :
   * - Se déclenche dès la première visite (sans attendre température/saison)
   * - Préserve les sélections manuelles de l'utilisateur
   * - Les recommandations sont calculées avec useMemo et toujours disponibles
   */
  useEffect(() => {
    // Vérifier qu'on a au moins une destination, des pays et une date de départ
    if (!formData.localisation || !formData.dateDepart || !formData.pays || formData.pays.length === 0) {
      return;
    }

    // Ne pré-sélectionner qu'une seule fois
    if (recommendationsCalculated) {
      return;
    }

    const suggestions = generateAutoSuggestions(formData);

    if (suggestions.length > 0) {
      // Ne pré-sélectionner QUE si l'utilisateur n'a pas encore modifié manuellement
      if (!hasUserModifiedConditionsRef.current) {
        const current = formData.conditionsClimatiques || [];
        const filtered = current.filter(id => id !== 'climat_aucune');

        // Ajouter toutes les suggestions qui ne sont pas déjà sélectionnées
        const newSuggestions = suggestions
          .map(s => s.conditionId)
          .filter(id => !filtered.includes(id));

        if (newSuggestions.length > 0) {
          updateFormData({
            conditionsClimatiques: [...filtered, ...newSuggestions]
          });
        }
      }
    } else {
      // Si aucune suggestion n'est proposée, sélectionner automatiquement "climat_aucune"
      if (!hasUserModifiedConditionsRef.current) {
        const current = formData.conditionsClimatiques || [];
        if (current.length === 0 || !current.includes('climat_aucune')) {
          updateFormData({
            conditionsClimatiques: ['climat_aucune']
          });
        }
      }
    }

    // Marquer que les recommandations ont été calculées
    setRecommendationsCalculated(true);
  }, [formData.localisation, formData.pays, formData.temperature, formData.saison, formData.dateDepart, formData.dateRetour]);

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
   * Logique pour les conditions climatiques spéciales
   * ✨ Amélioration : Marque que l'utilisateur a modifié manuellement
   */
  const handleConditionToggle = (conditionId: string) => {
    // Marquer que l'utilisateur a fait une modification manuelle
    hasUserModifiedConditionsRef.current = true;

    const current = formData.conditionsClimatiques || [];

    if (conditionId === 'climat_aucune') {
        const isCurrentlyNone = current.includes('climat_aucune');
        updateFormData({ conditionsClimatiques: isCurrentlyNone ? [] : ['climat_aucune'] });
        return;
    }

    const filteredCurrent = current.filter(id => id !== 'climat_aucune');
    const isSelected = filteredCurrent.includes(conditionId);

    const updated = isSelected
        ? filteredCurrent.filter((id) => id !== conditionId)
        : [...filteredCurrent, conditionId];

    updateFormData({ conditionsClimatiques: updated });
  };

  /**
   * Vérifier si le voyage est "long" (strictement plus de 3 mois / 90 jours)
   * Seulement "très long" (> 90 jours) est considéré comme "plus de 3 mois"
   */
  const isVeryLongTrip = (): boolean => {
    if (formData.dateDepart && formData.dateRetour) {
      const days = Math.ceil(
        (new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return days > 90; // Strictement plus de 90 jours = plus de 3 mois
    }

    // Sinon utiliser formData.duree : seulement 'tres-long' est > 3 mois
    return formData.duree === 'tres-long';
  };

  /**
   * Obtenir le label de la localisation
   */
  const getLocalisationLabel = (): string => {
    const localisations: any = checklistData.localisations || {};
    const localisation = localisations[formData.localisation];
    if (localisation && localisation.nom) {
      // Retirer l'emoji si présent (ex: "🇪🇺 Europe" → "Europe")
      return localisation.nom.split(' ').slice(1).join(' ');
    }
    return formData.localisation;
  };

  /**
   * Générer le message du disclaimer climat
   */
  const getClimateDisclaimerMessage = (): string | null => {
    if (!formData.localisation || !formData.dateDepart) {
      return null;
    }

    const isMultiHemisphere = ['multi-destinations', 'amerique-centrale-caraibes'].includes(formData.localisation);
    const locLabel = getLocalisationLabel();
    const isLongTrip = isVeryLongTrip(); // Utilise la nouvelle fonction

    // Condition 1 : Multi-destination/Amérique centrale + < 3 mois
    if (isMultiHemisphere && !isLongTrip) {
      return `**Attention :** comme tu as sélectionné **${locLabel}**, tu pourrais changer d'hémisphère et donc rencontrer un **basculement de saison**. Nous avons présélectionné ci-dessous les champs liés à la **saisonnalité** et au **climat** selon tes dates.`;
    }

    // Condition 2 : Multi-destination/Amérique centrale + > 3 mois
    if (isMultiHemisphere && isLongTrip) {
      return `**Attention :** avec **${locLabel}** et un séjour de plus de **3 mois**, tu risques de traverser **plusieurs saisons** en changeant d'hémisphère. \nLes champs liés à la **saisonnalité** et au **climat** ont été présélectionnés pour toi.`;
    }

    // Condition 3 : Autre zone + < 3 mois
    if (!isMultiHemisphere && !isLongTrip) {
      return `Comme tu as sélectionné **${locLabel}**, nous avons présélectionné les champs concernant la **saisonnalité** et le **climat** selon les dates que tu as indiquées.`;
    }

    // Condition 4 : Autre zone + > 3 mois
    if (!isMultiHemisphere && isLongTrip) {
      return `Comme tu as sélectionné **${locLabel}** et que ton voyage dure plus de **3 mois**, tu rencontreras sans doute **plusieurs variations de températures et de saisons**. \nLes champs concernant la **saisonnalité** et le **climat** ont été présélectionnés pour toi.`;
    }

    return null;
  };

  const disclaimerMessage = getClimateDisclaimerMessage();

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

        {/* Disclaimer climatique */}
        {disclaimerMessage && (
          <Card className="p-6 bg-muted/30 border-2 border-primary/20 shadow-lg">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-primary">
              🔔 Petite note sur le climat et la saisonnalité
            </h3>
            <div className="text-sm text-foreground leading-relaxed">
              {renderMarkdown(disclaimerMessage)}

              {/* Légende pour l'emoji 📌 (uniquement si des recommandations existent) */}
              {recommendedConditions.size > 0 && (
                <>
                  <br />
                  <br />
                  <span className="text-xs text-muted-foreground italic">
                    🔔 Les conditions climatiques marquées de cet emoji sont recommandées par l'application selon votre destination et vos dates.
                  </span>
                </>
              )}
            </div>
          </Card>
        )}

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
                                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10",
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
                                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10",
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

          {/* 🔧 LOG: Vérification du nombre de groupes */}
          {console.log(`📊 Nombre de groupes de conditions climatiques : ${checklistData.conditionsClimatiques.length}`, checklistData.conditionsClimatiques.map((g: any) => g.groupe))}

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
                  const isRecommended = recommendedConditions.has(condition.id);

                  const [emoji, ...labelParts] = condition.nom.split(' ');
                  const title = labelParts.join(' ').trim();

                  return (
                    <div key={condition.id} className="relative">
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
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10",
                          condition.id === 'climat_aucune' ? 'bg-secondary/20' : ''
                        )}
                      >
                        {/* 3. Le contenu de la carte */}
                        <span className="flex-1 cursor-pointer">
                            <p className="font-semibold text-base flex items-center gap-2">
                                <span>{emoji}</span>
                                <span className="flex-1">{title}</span>
                                {/* Emoji 🔔 si cette condition est recommandée */}
                                {isRecommended && (
                                  <span className="text-primary text-sm" title="Recommandé par l'application">
                                    🔔
                                  </span>
                                )}
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

        {/* 💡 Les suggestions climatiques sont maintenant pré-cochées automatiquement ! */}
        {/* Aucun panel à afficher, les conditions sont ajoutées directement via useEffect */}
      </div>
    </div>
  );
};
