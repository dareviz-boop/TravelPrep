import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; 
import { Flag } from "lucide-react"; // Importation pour un drapeau générique si besoin

// ----------------------------------------------------------------------
// Fonctions d'aide (inchangées)
// ----------------------------------------------------------------------

// Fonction pour trouver les détails dans une liste simple ou dans un groupe avec 'options: []'
const getOptionDetailsFromList = (groupKey: keyof typeof checklistData, id: string | undefined) => {
  if (!id) return null;
  const group = checklistData[groupKey] as { options?: any[] };
  return group?.options?.find(option => option.id === id) || null;
};

// Fonction pour trouver les détails dans une liste de groupes (ex: conditionsClimatiques)
const getOptionDetailsFromGroupedList = (groupKey: keyof typeof checklistData, id: string) => {
  const groups = checklistData[groupKey] as any;
  if (Array.isArray(groups)) {
    for (const group of groups) {
      const option = group.options?.find((opt: any) => opt.id === id);
      if (option) return option;
    }
  } 
  // Gère aussi le cas où 'activites' pourrait être une liste simple d'options sans groupe
  if (groups && Array.isArray(groups.options)) {
      return groups.options.find((opt: any) => opt.id === id);
  }
  return null;
};

// Fonction pour trouver les détails dans un objet/dictionnaire (ex: localisations, profils)
const getOptionDetailsFromDict = (groupKey: keyof typeof checklistData, id: string | undefined) => {
  if (!id) return null;
  const dict = checklistData[groupKey] as any;
  return dict?.[id] || null; 
};

// Fonction pour déterminer le libellé de la durée
const getDurationLabel = (duree: FormData['duree'] | undefined) => {
  if (!duree) return "Non défini";
  const map: Record<string, string> = { // On utilise string pour la flexibilité en l'absence d'importation de Duree
    'court': "Courte (moins d'une semaine)",
    'moyen': "Moyenne (1 à 2 semaines)",
    'long': "Longue (1 à 3 mois)",
    'tres-long': "Très longue (plus de 3 mois)",
  };
  return map[duree] || duree;
};

interface Step5OptionsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step5Options = ({ formData, updateFormData }: Step5OptionsProps) => {
  
  // Lecture directe du JSON uniformisé
  const sectionsData = checklistData.categories.options.map((category: any) => ({
    id: category.id,
    label: `${category.emoji} ${category.nom}`,
    desc: category.description,
  }));

  const handleSectionToggle = (sectionId: string) => {
    const allIds = sectionsData.map(s => s.id);
    // Si sectionsInclure est undefined (tout est sélectionné par défaut), on utilise la liste complète
    const current = formData.sectionsInclure === undefined ? allIds : formData.sectionsInclure;
    
    const updated = current.includes(sectionId)
      ? current.filter((id) => id !== sectionId)
      : [...current, sectionId];

    // Logique pour mettre sectionsInclure à undefined si toutes les sections sont sélectionnées
    updateFormData({ sectionsInclure: updated.length === allIds.length ? undefined : updated });
  };

  const calculateDuration = () => {
    if (!formData.dateDepart || !formData.dateRetour) return null;
    const days = Math.ceil(
      (new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const durationDays = calculateDuration();

  // --- NOUVEAU: Récupération des détails pour le récapitulatif ---
  // Utilisez la fonction adaptée pour les listes d'options
  const typeVoyageDetails = getOptionDetailsFromList('typeVoyage', formData.typeVoyage);
  const saisonDetails = getOptionDetailsFromList('saisons', formData.saison);
  const temperatureDetails = getOptionDetailsFromList('temperatures', formData.temperature);
  
  // Localisation utilise le dictionnaire (ajout de la variable qui manque)
  const localisationDetails = getOptionDetailsFromDict('localisations', formData.localisation);

  // Utilisez la fonction adaptée pour les listes groupées
  const selectedActivitiesEmojis = (formData.activites || [])
    .map(id => getOptionDetailsFromGroupedList('activites', id)?.emoji)
    .filter(Boolean);

  // ----------------------------------------------------------------
  // ✅ CORRECTION : Logique unifiée pour l'affichage des Conditions Climatiques
  // ----------------------------------------------------------------
  const selectedConditionsDisplay = (() => {
    if (!formData.conditionsClimatiques || formData.conditionsClimatiques.length === 0) {
      return null;
    }

    // Cas 1 : Seulement "aucune" sélectionnée
    if (formData.conditionsClimatiques.length === 1 && formData.conditionsClimatiques[0] === 'aucune') {
      return (
        <span className="flex items-center gap-1">
          ❌
          <span className="text-sm">Aucune condition particulière</span>
        </span>
      );
    }

    // Cas 2 : Une ou plusieurs conditions réelles sélectionnées (affichage d'emojis)
    const selectedEmojis = formData.conditionsClimatiques
      .filter(id => id !== 'aucune') // Ignore 'aucune' s'il est sélectionné avec d'autres
      .map(id => {
        const detail = getOptionDetailsFromGroupedList('conditionsClimatiques', id);
        if (detail && detail.nom) {
          return detail.nom.split(' ')[0]; // Extrait l'emoji
        }
        return null;
      })
      .filter(Boolean);

    if (selectedEmojis.length > 0) {
      return (
        // Utilise justify-end pour aligner les émojis à droite, même s'ils sont sur plusieurs lignes
        <div className="flex flex-wrap gap-1 mt-1 text-base justify-end"> 
          {selectedEmojis.map((emoji, index) => (
            <span key={index}>{emoji}</span>
          ))}
        </div>
      );
    }
    
    return null; 
  })();
  // ----------------------------------------------------------------
  // Fin de la logique unifiée
  // ----------------------------------------------------------------


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          ⚙️ Personnalisez votre checklist
        </h2>
        <p className="text-muted-foreground">
          Derniers réglages avant de générer votre PDF
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        
        {/* Récapitulatif */}
        <Card className="p-6 bg-muted/30 border-2 border-primary/20 shadow-lg">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-primary">
            📋 Récapitulatif du voyage
          </h3>
          <div className="space-y-2 text-sm">

            
            {/* Ligne 1: Nom du voyage */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Voyage :</span>
              <span className="font-semibold">{formData.nomVoyage || "Non renseigné"}</span>
            </div>

            
            {/* Ligne 2: Date de départ */}
            {formData.dateDepart && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Date de départ :</span>
                <span className="font-semibold">
                  {new Date(formData.dateDepart).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )}
            
            {/* Date de retour OU Durée (si date de retour est absente) */}
            {formData.dateRetour ? (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Date de retour :</span>
                <span className="font-semibold">
                  {new Date(formData.dateRetour).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ) : (
                formData.duree && (
                    <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Durée estimée :</span>
                        <span className="font-semibold">
                            {getDurationLabel(formData.duree)}
                        </span>
                    </div>
                )
            )}

            {/* Durée calculée (si les deux dates sont là) */}
            {durationDays !== null && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Durée calculée :</span>
                <span className="font-semibold">{durationDays} jours</span>
              </div>
            )}

            
            {/* Ligne 3: Destination et Pays */}
            {formData.localisation && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Destination :</span>
                <span className="font-semibold flex flex-col items-end">
                  {localisationDetails?.nom || formData.localisation}
                    {/* Affichage des Drapeaux des pays sélectionnés */}
                    {formData.pays && formData.pays.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 text-base">
                            {formData.pays.map((country) => (
                                <span key={country.code} className="text-xl" title={country.nom}>
                                    {country.flag}
                                </span> 
                            ))}
                        </div>
                    )}
                </span>
              </div>
            )}

            
            {/* Ligne 4: Saison, Température & conditions */}
            {saisonDetails && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Saison :</span>
                <span className="font-semibold">
                    {saisonDetails.emoji} {saisonDetails.nom}
                </span>
              </div>
            )}
            {temperatureDetails && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Température :</span>
                <span className="font-semibold">
                    {temperatureDetails.emoji} {temperatureDetails.nom}
                </span>
              </div>
            )}
            
            {/* ✅ CORRECTION : Conditions Climatiques (Utilise l'élément JSX calculé) */}
            {selectedConditionsDisplay && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Conditions :</span>
                <span className="font-semibold flex flex-col items-end">
                  {selectedConditionsDisplay}
                </span>
              </div>
            )}


            {/* Ligne 5: Activités + Emojis (inchangée car elle était correcte) */}
            {formData.activites && formData.activites.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Activités :</span>
                <span className="font-semibold flex flex-col items-end">
                  {formData.activites.length} sélectionnée(s)
                    {/* Emojis des activités */}
                    <div className="flex flex-wrap gap-1 mt-1 text-base">
                        {selectedActivitiesEmojis.map((emoji, index) => (
                            <span key={index}>{emoji}</span>
                        ))}
                    </div>
                </span>
              </div>
            )}

            
            {/* Ligne 6: Profil + détails Famille */}
            {formData.profil && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Profil :</span>
                <div className="font-semibold text-right flex flex-col items-end">
                    {formData.profil.emoji} {formData.profil.nom}

                  {/* Détails Famille (si profil est 'famille') */}
                  {formData.profil === 'famille' && (
                    <div className="text-sm text-muted-foreground mt-1 font-normal space-y-0.5">
                      {/* Nombre d'enfants */}
                      {formData.nombreEnfants && formData.nombreEnfants > 0 && (
                        <p>{formData.nombreEnfants} enfant(s)</p>
                      )}
                      
                      {/* Détail des âges des enfants */}
                      {formData.agesEnfants && formData.agesEnfants.length > 0 && (
                        <p className="flex flex-wrap justify-end items-center">
                          Âges :{' '}
                          {formData.agesEnfants.map(ageKey => (
                            <span key={ageKey} className="ml-1 font-semibold text-base text-foreground">
                              👶 {ageKey}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
             {/* Type de voyage (inchangé car il était correct) */}
            {typeVoyageDetails && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Type de voyage :</span>
                <span className="font-semibold">
                    {typeVoyageDetails.emoji} {typeVoyageDetails.nom}
                </span>
              </div>
            )}

            {/* Ligne : Confort */}
            {formData.confort && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Confort :</span>
                <span className="font-semibold">
                    {formData.confort.emoji} {formData.confort.nom}
                </span>
              </div>
            )}

          </div>
        </Card>

        
        {/* Sections à inclure */}
        <div className="space-y-4">
          
          <Label className="text-base font-semibold">
            Sections à inclure
          </Label>

          {/* Bouton Tout Sélectionner / Tout Désélectionner */}
          <div className="flex justify-end">
              <button
                  type="button"
                  onClick={() => {
                      const allIds = sectionsData.map(s => s.id);
                      const currentSelected = formData.sectionsInclure || allIds;
                      const shouldSelectAll = currentSelected.length !== allIds.length;
                      
                      updateFormData({ 
                          // Si on sélectionne tout, on envoie undefined. Si on désélectionne tout, on envoie une liste vide.
                          sectionsInclure: shouldSelectAll ? undefined : [] 
                      });
                  }}
                  className="text-sm text-primary hover:underline font-semibold"
              >
                  {(formData.sectionsInclure === undefined || formData.sectionsInclure.length === sectionsData.length)
                      ? 'Tout dé-sélectionner'
                      : 'Tout sélectionner'
                  }
              </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {sectionsData.map((section) => {
              // Vérifie si la section est incluse (si sectionsInclure est undefined, tout est coché)
              const isSelected = formData.sectionsInclure === undefined || formData.sectionsInclure.includes(section.id);
                
              return (
                  <div
                    key={section.id}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                      isSelected ? "border-primary bg-primary/5" : "border-border"
                    )}
                    onClick={() => handleSectionToggle(section.id)}
                  >
                    <Checkbox
                      id={`section-${section.id}`}
                      checked={isSelected}
                      // OnCheckedChange est retiré car le onClick du div parent gère le basculement.
                      onCheckedChange={() => {}} 
                      className="mt-1"
                    />
                    <Label className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base mb-1 flex items-center">
                            {section.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {section.desc}
                        </div>
                    </Label>
                  </div>
              );
            })}
          </div>
        </div>

        {/* Format PDF (Harmonisation avec peer sr-only et cn) */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Format du PDF <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.formatPDF}
            onValueChange={(value) => updateFormData({ formatPDF: value as 'compact' | 'detaille' })}
            className="grid grid-cols-1 gap-3"
          >
            <div>
              <RadioGroupItem value="compact" id="format-compact" className="peer sr-only" />
              <Label
                htmlFor="format-compact"
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                )}
              >
                <div className="font-semibold text-base mb-1">📄 Format compact</div>
                <div className="text-sm text-muted-foreground">Checklist simple et essentielle</div>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="detaille" id="format-detaille" className="peer sr-only" />
              <Label
                htmlFor="format-detaille"
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                )}
              >
                <div className="font-semibold text-base mb-1">📋 Format détaillé</div>
                <div className="text-sm text-muted-foreground">
                  Avec conseils et délais recommandés
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
