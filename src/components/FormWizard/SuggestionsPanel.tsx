/**
 * Panneau de suggestions automatiques (non forcées)
 * Affiche les recommandations climatiques basées sur le profil voyage
 */

import { useState } from 'react';
import { FormData } from '@/types/form';
import { generateAutoSuggestions, getSuggestionDetails, SuggestionItem } from '@/utils/checklistFilters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, X, Check, Info } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface SuggestionsPanelProps {
  formData: FormData;
  onAcceptSuggestion: (conditionId: string) => void;
  onDismissSuggestion: (conditionId: string) => void;
}

export const SuggestionsPanel = ({
  formData,
  onAcceptSuggestion,
  onDismissSuggestion
}: SuggestionsPanelProps) => {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const [expandedSuggestions, setExpandedSuggestions] = useState<string[]>([]);

  // Générer les suggestions
  const allSuggestions = generateAutoSuggestions(formData);

  // Filtrer les suggestions déjà écartées
  const activeSuggestions = allSuggestions.filter(
    (s) => !dismissedSuggestions.includes(s.conditionId)
  );

  // Si aucune suggestion, ne rien afficher
  if (activeSuggestions.length === 0) {
    return null;
  }

  const handleAccept = (suggestion: SuggestionItem) => {
    onAcceptSuggestion(suggestion.conditionId);
    toast.success(`✅ ${suggestion.nom} ajouté`, {
      description: 'Les équipements correspondants seront inclus dans votre checklist'
    });
  };

  const handleDismiss = (suggestion: SuggestionItem) => {
    setDismissedSuggestions([...dismissedSuggestions, suggestion.conditionId]);
    onDismissSuggestion(suggestion.conditionId);
    toast.info('Suggestion écartée', {
      description: 'Vous pouvez toujours l\'ajouter manuellement plus tard'
    });
  };

  const toggleExpanded = (conditionId: string) => {
    setExpandedSuggestions(
      expandedSuggestions.includes(conditionId)
        ? expandedSuggestions.filter((id) => id !== conditionId)
        : [...expandedSuggestions, conditionId]
    );
  };

  const getPriorityColor = (priorite: 'haute' | 'moyenne' | 'basse') => {
    switch (priorite) {
      case 'haute':
        return 'destructive';
      case 'moyenne':
        return 'default';
      case 'basse':
        return 'secondary';
    }
  };

  const getPriorityLabel = (priorite: 'haute' | 'moyenne' | 'basse') => {
    switch (priorite) {
      case 'haute':
        return 'Fortement recommandé';
      case 'moyenne':
        return 'Recommandé';
      case 'basse':
        return 'Optionnel';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
            💡 Suggestions Intelligentes
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Basées sur votre profil voyage, nous recommandons ces adaptations climatiques
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activeSuggestions.map((suggestion) => {
          const details = getSuggestionDetails(suggestion.conditionId);
          const isExpanded = expandedSuggestions.includes(suggestion.conditionId);

          return (
            <Card
              key={suggestion.conditionId}
              className="p-4 bg-white dark:bg-gray-900 border-l-4 border-l-blue-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{suggestion.emoji}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {suggestion.nom}
                    </h4>
                    <Badge variant={getPriorityColor(suggestion.priorite)} className="text-xs">
                      {getPriorityLabel(suggestion.priorite)}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {suggestion.raison}
                  </p>

                  {/* Détails expandables */}
                  {details && (
                    <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(suggestion.conditionId)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                        >
                          <Info className="w-3 h-3 mr-1" />
                          {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            <strong>Conseils :</strong> {details.conseils}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Équipements inclus :</strong> {details.equipement.length} articles
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleAccept(suggestion)}
                    className="whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(suggestion)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {activeSuggestions.length > 1 && (
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              activeSuggestions.forEach((s) => onAcceptSuggestion(s.conditionId));
              toast.success('✅ Toutes les suggestions ajoutées', {
                description: `${activeSuggestions.length} conditions climatiques ajoutées`
              });
            }}
            className="w-full"
          >
            ✨ Tout accepter ({activeSuggestions.length})
          </Button>
        </div>
      )}
    </Card>
  );
};
