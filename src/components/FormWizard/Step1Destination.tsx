import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DatePicker } from "@/components/ui/date-picker";
import { FormData, Localisation, Pays } from "@/types/form";
import { checklistData, getPaysOptions } from "@/utils/checklistUtils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Step1DestinationProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

// Fonction utilitaire pour récupérer la liste complète des pays pour l'option "Multi-destinations"
const getAllPaysOptions = (): Pays[] => {
  if (!checklistData.localisations) return [];

  // Récupère toutes les valeurs (objets de zones) et les fusionne
  const allPays = Object.values(checklistData.localisations)
    // Filtre la zone 'multi-destinations' elle-même, car elle n'a pas de liste de pays dans le JSON
    .filter((loc) => loc.code !== 'multi-destinations')
    .flatMap((loc) => loc.pays || []); // Utilise flatMap pour créer un tableau simple

  // 🟢 AJOUT : Tri par ordre alphabétique du nom français
  return allPays.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
};

export const Step1Destination = ({ formData, updateFormData }: Step1DestinationProps) => {
  const { toast } = useToast();
  const [showPaysSelector, setShowPaysSelector] = useState(false);
  const [open, setOpen] = useState(false);
  const [paysOptions, setPaysOptions] = useState<Pays[]>([]);
  const [knowsReturnDate, setKnowsReturnDate] = useState(!!formData.dateRetour); // Initialise à true si dateRetour existe
  const [searchValue, setSearchValue] = useState(""); // État pour le texte de recherche

  // Synchroniser knowsReturnDate avec formData.dateRetour
  // 🔧 FIX: Synchronisation complète au montage et lors des changements
  useEffect(() => {
    setKnowsReturnDate(!!formData.dateRetour);
  }, [formData.dateRetour]);
  
  // NOUVEAU : Récupération dynamique des localisations (Zones Géographiques)
  const localisations: { value: Localisation; label: string; emoji: string }[] = Object.entries(
    checklistData.localisations
  ).map(([key, data]) => {
    // data.nom est de la forme "🇪🇺 Europe". On extrait l'emoji et le label.
    const parts = data.nom.split(' ');
    const emoji = parts[0];
    const label = parts.slice(1).join(' '); // Reconstruit le label si le nom est composé de plusieurs mots

    return {
      value: key as Localisation, // La clé est le code (ex: 'europe')
      label: label,
      emoji: emoji,
    };
  });
  
  // NOUVEAU : Calcul de la liste complète des pays pour le sélecteur "Multi-destinations" (maintenant triée)
  const allPaysOptions = getAllPaysOptions();


  useEffect(() => {
    if (formData.localisation && formData.localisation !== 'multi-destinations') {
      // getPaysOptions lit déjà checklistData.localisations[formData.localisation].pays
      const options = getPaysOptions(formData.localisation);
      // 🟢 AJOUT : Tri par ordre alphabétique du nom français pour la zone spécifique
      options.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
      setPaysOptions(options);
    } else {
      setPaysOptions([]);
    }
  }, [formData.localisation]);

  const handlePaysSelect = (pays: Pays) => {
    const currentPays = formData.pays || [];
    const isAlreadySelected = currentPays.find(p => p.code === pays.code);
    
    // Détermine la limite basée sur le type de localisation
    const maxPays = formData.localisation === 'multi-destinations' ? 10 : 3;

    if (isAlreadySelected) {
      updateFormData({ pays: currentPays.filter(p => p.code !== pays.code) });
    } else if (currentPays.length < maxPays) {
      updateFormData({ pays: [...currentPays, pays] });
    } else if (formData.localisation !== 'multi-destinations') {
        // Affiche un toast uniquement pour la limite de 3 pays par zone
        toast({
            title: "Limite atteinte",
            description: "❌ Vous ne pouvez sélectionner que 3 pays maximum par zone.",
            variant: "destructive"
        });
    }
  };

  const handlePaysRemove = (code: string) => {
    updateFormData({ pays: formData.pays.filter(p => p.code !== code) });
  };
  
  // Fonctions de validation et utilitaires
  const validateYear = (dateString: string): boolean => {
    if (!dateString) return true;
    const year = dateString.split('-')[0];
    return year.length === 4;
  };

  const isFutureDate = (dateString: string): boolean => {
    if (!dateString) return true;
    const selected = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  };

  /**
   * Convertit une Date en string YYYY-MM-DD sans problème de fuseau horaire
   * @param date - La date à convertir
   * @returns String au format YYYY-MM-DD
   */
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Obtient la date de demain à 00:00:00
   * @returns Date object pour demain à minuit
   */
  const getTomorrowDate = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };
  // Fin Fonctions de validation


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          ✈️ Où pars-tu en voyage ?
        </h2>
        <p className="text-foreground/70 text-lg">
          Choisis ta destination pour personnaliser ta checklist
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Nom du voyage */}
        <div className="space-y-3">
          <Label htmlFor="nomVoyage" className="text-lg font-bold text-foreground">
            Nom du voyage <span className="text-primary">*</span>
          </Label>
          <Input
            id="nomVoyage"
            placeholder="Ex: Voyage au pays des pandas - 2028"
            value={formData.nomVoyage}
            onChange={(e) => updateFormData({ nomVoyage: e.target.value })}
            className="h-14 text-base border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
            required
          />
          <p className="text-sm text-muted-foreground">
            Donne un nom à ton voyage pour l'identifier facilement
          </p>
        </div>

        {/* Zone géographique (Utilise la liste dynamique 'localisations') */}
        <div className="space-y-4">
          <Label className="text-lg font-bold text-foreground">
            Zone géographique <span className="text-primary">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* L'itération reste la même, mais utilise la nouvelle source de données */}
            {localisations.map((loc) => (
              <button
                key={loc.value}
                type="button"
                onClick={() => {
                  updateFormData({ localisation: loc.value, pays: [] });
                  setShowPaysSelector(loc.value !== 'multi-destinations');
                }}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center hover:shadow-md",
                  formData.localisation === loc.value
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="text-3xl mb-2">{loc.emoji}</div>
                <div className="text-sm font-bold text-foreground">{loc.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de pays - MONO DESTINATION */}
        {formData.localisation && formData.localisation !== 'multi-destinations' && (
          <div className="space-y-4 bg-card p-6 rounded-xl border-2 border-border shadow-sm">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-bold text-foreground">
                Pays spécifiques <span className="text-muted-foreground text-sm font-normal">(max 3, optionnel)</span>
              </Label>
            </div>

            {/* Pays sélectionnés */}
            {formData.pays.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.pays.map((pays) => (
                  <div
                    key={pays.code}
                    className="flex items-center gap-2 bg-primary/10 border-2 border-primary rounded-lg px-3 py-2"
                  >
                    <span className="text-lg">{pays.flag}</span>
                    <span className="text-sm font-bold text-foreground">{pays.nom}</span>
                    <button
                      type="button"
                      onClick={() => handlePaysRemove(pays.code)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Combobox (La couleur du focus/ring est gérée par --primary, ce qui est correct pour l'orange) */}
            {formData.pays.length < 3 && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-14 border-2"
                  >
                    <span className="text-muted-foreground">
                      Rechercher un pays...
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                      <CommandGroup>
                        {/* Utilise la liste triée via l'useEffect */}
                        {paysOptions.map((pays) => {
                          const isSelected = formData.pays.find(p => p.code === pays.code);
                          return (
                            <CommandItem
                              key={pays.code}
                              value={`${pays.nom} ${pays.nomEn}`}
                              onSelect={() => {
                                handlePaysSelect(pays);
                                setSearchValue(""); // Effacer le texte de recherche
                                // Garder le popover ouvert pour permettre plusieurs sélections
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  // La coche utilise ici la couleur "foreground" par défaut, mais est visible
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="mr-2">{pays.flag}</span>
                              {pays.nom}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            
            <p className="text-sm text-muted-foreground">
              Affine ta checklist en sélectionnant des pays spécifiques
            </p>
          </div>
        )}
          
        {/* Sélecteur de pays - MULTI DESTINATIONS */}
        {formData.localisation === 'multi-destinations' && (
          <div className="space-y-4 bg-card p-6 rounded-xl border-2 border-border shadow-sm">
            
            <div className="flex items-center justify-between">
              <Label className="text-lg font-bold text-foreground">
                Vos destinations <span className="text-muted-foreground text-sm font-normal">(max 10)</span>
              </Label>
            </div>
      
            {/* Pays sélectionnés */}
            {formData.pays.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.pays.map((pays) => (
                  <div
                    key={pays.code}
                    className="flex items-center gap-2 bg-primary/10 border-2 border-primary rounded-lg px-3 py-2"
                  >
                    <span className="text-lg">{pays.flag}</span>
                    <span className="text-sm font-bold text-foreground">{pays.nom}</span>
                    <button
                      type="button"
                      onClick={() => handlePaysRemove(pays.code)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
      
            {/* Combobox mis à jour : utilise 'allPaysOptions' (maintenant trié) */}
            {formData.pays.length < 10 && (  
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-14 border-2"
                  >
                    <span className="text-muted-foreground">
                      Rechercher un pays...
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                      <CommandGroup>
                        {/* Utilisation de la liste complète des pays (maintenant triée) */}
                        {allPaysOptions.map((pays) => {
                          const isSelected = formData.pays.find(p => p.code === pays.code);
                          return (
                            <CommandItem
                              key={pays.code}
                              value={`${pays.nom} ${pays.nomEn}`}
                              onSelect={() => {
                                handlePaysSelect(pays);
                                setSearchValue(""); // Effacer le texte de recherche
                                // Garder le popover ouvert pour permettre plusieurs sélections
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="mr-2">{pays.flag}</span>
                              {pays.nom}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            
            <p className="text-sm text-muted-foreground">
              Sélectionnez tous les pays de votre itinéraire.
            </p>
          </div>
        )}

        
{/*            CONTENU A NE PAS SUPPRIMER, les prochaines lignes sont mises en commentaires en vue d'être utilisé plus tard             */}

        {/* Villes / Étapes importantes (Inchangé) */}
{/*         <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">       */}
{/*           <Label htmlFor="villesEtapes" className="text-lg font-bold text-foreground">                                              */}
{/*             Villes et étapes principales <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>             */}
{/*           </Label>                                                                                                                  */}
{/*           <Input                                                                                                                    */}
{/*             id="villesEtapes"                                                                                                       */}
{/*             placeholder="Ex: Tokyo, Osaka, Kyoto, ou Route 66"                                                                      */}
{/*             value={formData.villesEtapes || ''}                                                                                     */}
{/*             onChange={(e) => updateFormData({ villesEtapes: e.target.value })}                                                      */}
{/*             className="h-14 text-base border-2 focus:border-primary"                                                                */}
{/*           />                                                                                                                        */}
{/*           <p className="text-sm text-muted-foreground">                                                                             */}
{/*             Séparez les villes/étapes par une virgule pour adapter certaines recommandations (ex: transport).                       */}
{/*           </p>                                                                                                                      */}
{/*         </div>                                                                                                                      */}
{/*                                    FIN DU CONTENU A NE PAS SUPPRIMER                                                                */}


        {/* Date de départ */}
        <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <Label className="text-lg font-bold text-foreground">
            Date de départ <span className="text-primary">*</span>
          </Label>
          <DatePicker
            date={formData.dateDepart ? new Date(formData.dateDepart) : undefined}
            onSelect={(selectedDate) => {
              if (!selectedDate) {
                updateFormData({ dateDepart: '' });
                return;
              }

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (selectedDate <= today) {
                toast({
                  title: "Date invalide",
                  description: "❌ La date de départ doit être dans le futur",
                  variant: "destructive"
                });
                return;
              }

              // Format YYYY-MM-DD sans problème de fuseau horaire
              const dateString = formatDateToString(selectedDate);

              // Vérifier si la nouvelle date de départ est après la date de retour
              if (formData.dateRetour) {
                const returnDate = new Date(formData.dateRetour);
                if (selectedDate >= returnDate) {
                  // Effacer la date de retour si elle devient invalide
                  setKnowsReturnDate(false);
                  updateFormData({ dateDepart: dateString, dateRetour: '' });
                  toast({
                    title: "Date de retour effacée",
                    description: "La date de retour a été effacée car elle est antérieure à la nouvelle date de départ",
                  });
                  return;
                }
              }

              updateFormData({ dateDepart: dateString });
            }}
            minDate={getTomorrowDate()}
            maxDate={new Date('9999-12-31')}
            placeholder="Choisir la date de départ"
          />
          <p className="text-sm text-muted-foreground">
            On calculera automatiquement tes échéances
          </p>

          {/* Bouton pour afficher la durée estimée */}
          {formData.dateDepart && !knowsReturnDate && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setKnowsReturnDate(true);
              }}
              className="w-full mt-3 border-2 hover:bg-primary/5 hover:border-primary/50"
            >
              📅 Je connais ma date de retour
            </Button>
          )}
        </div>

        {/* Date de retour - seulement si l'utilisateur connaît la date */}
        {knowsReturnDate && formData.dateDepart && (
          <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-lg font-bold text-foreground">
                Date de retour <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setKnowsReturnDate(false);
                  // Ne pas effacer dateRetour pour conserver la valeur si l'utilisateur change d'avis
                }}
                className="text-sm hover:bg-primary/10 border-2"
              >
                📅 Je ne connais pas ma date de retour
              </Button>
            </div>
            <DatePicker
              date={formData.dateRetour ? new Date(formData.dateRetour) : undefined}
              onSelect={(selectedDate) => {
                if (!selectedDate) {
                  updateFormData({ dateRetour: '' });
                  return;
                }

                if (formData.dateDepart) {
                  const departDate = new Date(formData.dateDepart);

                  if (selectedDate <= departDate) {
                    toast({
                      title: "Date invalide",
                      description: "❌ La date de retour doit être après la date de départ",
                      variant: "destructive"
                    });
                    return;
                  }
                }

                // Format YYYY-MM-DD sans problème de fuseau horaire
                const dateString = formatDateToString(selectedDate);
                updateFormData({ dateRetour: dateString });
              }}
              minDate={formData.dateDepart ? (() => {
                const minReturn = new Date(formData.dateDepart);
                minReturn.setDate(minReturn.getDate() + 1);
                minReturn.setHours(0, 0, 0, 0);
                return minReturn;
              })() : getTomorrowDate()}
              placeholder="Choisir la date de retour"
            />
            {formData.dateRetour && formData.dateRetour.length === 10 && (
              <p className="text-sm text-primary font-bold flex items-center gap-2">
                ✓ Durée : {Math.ceil((new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) / (1000 * 60 * 60 * 24))} jours
              </p>
            )}
          </div>
        )}

        {/* Durée estimée - affichée par défaut */}
        {formData.dateDepart && !knowsReturnDate && (
          <div className="space-y-4 bg-card p-6 rounded-xl border-2 border-border shadow-sm">
            <Label className="text-lg font-bold text-foreground">
              Durée estimée du voyage <span className="text-primary">*</span>
            </Label>
            <RadioGroup
              value={formData.duree}
              onValueChange={(value) => updateFormData({ duree: value as FormData['duree'] })}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { value: 'court', label: 'Court', desc: '≤ 7 jours' },
                { value: 'moyen', label: 'Moyen', desc: '8-29 jours' },
                { value: 'long', label: 'Long', desc: '30-90 jours' },
                { value: 'tres-long', label: 'Très long', desc: '> 90 jours' },
              ].map((option) => (
                <div key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.value}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 cursor-pointer transition-all",
                      "hover:bg-primary/5 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                    )}
                  >
                    <span className="text-sm font-bold text-foreground">{option.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">{option.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
};
