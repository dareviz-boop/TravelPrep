import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
  return Object.values(checklistData.localisations)
    // Filtre la zone 'multi-destinations' elle-même, car elle n'a pas de liste de pays dans le JSON
    .filter((loc) => loc.code !== 'multi-destinations')
    .flatMap((loc) => loc.pays || []); // Utilise flatMap pour créer un tableau simple
};

export const Step1Destination = ({ formData, updateFormData }: Step1DestinationProps) => {
  const { toast } = useToast();
  const [showPaysSelector, setShowPaysSelector] = useState(false);
  const [open, setOpen] = useState(false);
  const [paysOptions, setPaysOptions] = useState<Pays[]>([]);
  
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
  
  // NOUVEAU : Calcul de la liste complète des pays pour le sélecteur "Multi-destinations"
  const allPaysOptions = getAllPaysOptions();


  useEffect(() => {
    if (formData.localisation && formData.localisation !== 'multi-destinations') {
      // getPaysOptions lit déjà checklistData.localisations[formData.localisation].pays
      const options = getPaysOptions(formData.localisation);
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
  
  // Fonctions de validation (laissé inchangé)
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
  // Fin Fonctions de validation


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3 text-primary">
          🌍 Où pars-tu en voyage ?
        </h2>
        <p className="text-foreground/70 text-lg">
          Choisis ta destination pour personnaliser ta checklist
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Nom du voyage (Inchangé) */}
        <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <Label htmlFor="nomVoyage" className="text-lg font-bold text-foreground">
            Nom du voyage <span className="text-primary">*</span>
          </Label>
          <Input
            id="nomVoyage"
            placeholder="Ex: Voyage au pays des pandas - 2028"
            value={formData.nomVoyage}
            onChange={(e) => updateFormData({ nomVoyage: e.target.value })}
            className="h-14 text-base border-2 focus:border-primary"
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

            {/* Pays sélectionnés (La sélection orange est correcte ici) */}
            {formData.pays.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.pays.map((pays) => (
                  <div
                    key={pays.code}
                    className="flex items-center gap-2 bg-primary/10 border-2 border-primary/30 rounded-lg px-3 py-2"
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
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                      <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                      <CommandGroup>
                        {paysOptions.map((pays) => {
                          const isSelected = formData.pays.find(p => p.code === pays.code);
                          return (
                            <CommandItem
                              key={pays.code}
                              value={`${pays.nom} ${pays.nomEn}`}
                              onSelect={() => {
                                handlePaysSelect(pays);
                                // On ferme la popover si on a atteint 3 pays pour cette zone
                                if (formData.pays.length >= 2) { 
                                  setOpen(false);
                                }
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
      
            {/* Pays sélectionnés (La sélection orange est correcte ici) */}
            {formData.pays.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.pays.map((pays) => (
                  <div
                    key={pays.code}
                    className="flex items-center gap-2 bg-primary/10 border-2 border-primary/30 rounded-lg px-3 py-2"
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
      
            {/* Combobox mis à jour : utilise 'allPaysOptions' */}
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
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                      <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                      <CommandGroup>
                        {/* Utilisation de la liste complète des pays */}
                        {allPaysOptions.map((pays) => { 
                          const isSelected = formData.pays.find(p => p.code === pays.code);
                          return (
                            <CommandItem
                              key={pays.code}
                              value={`${pays.nom} ${pays.nomEn}`}
                              onSelect={() => {
                                handlePaysSelect(pays);
                                // On ne ferme PAS la popover pour permettre la multi-sélection rapide
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
          
        {/* Villes / Étapes importantes (Inchangé) */}
        <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
          <Label htmlFor="villesEtapes" className="text-lg font-bold text-foreground">
            Villes et étapes principales <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
          </Label>
          <Input
            id="villesEtapes"
            placeholder="Ex: Tokyo, Osaka, Kyoto, ou Route 66"
            value={formData.villesEtapes || ''}
            onChange={(e) => updateFormData({ villesEtapes: e.target.value })}
            className="h-14 text-base border-2 focus:border-primary"
          />
          <p className="text-sm text-muted-foreground">
            Séparez les villes/étapes par une virgule pour adapter certaines recommandations (ex: transport).
          </p>
        </div>
        
        {/* Dates (Inchangé) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
            <Label htmlFor="dateDepart" className="text-lg font-bold text-foreground">
              Date de départ <span className="text-primary">*</span>
            </Label>
            <Input
              id="dateDepart"
              type="date"
              value={formData.dateDepart}
              onChange={(e) => {
                const value = e.target.value;
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Validation : la date doit être dans le futur
                if (selectedDate <= today) {
                  toast({
                    title: "Date invalide",
                    description: "❌ La date de départ doit être dans le futur",
                    variant: "destructive"
                  });
                  return;
                }
                
                updateFormData({ dateDepart: value });
              }}
              className="h-14 text-base border-2 focus:border-primary"
              required
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            />
            <p className="text-sm text-muted-foreground">
              On calculera automatiquement tes échéances
            </p>
          </div>

          div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
            <Label htmlFor="dateRetour" className="text-lg font-bold text-foreground">
              Date de retour <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
            </Label>
            <Input
              id="dateRetour"
              type="date"
              value={formData.dateRetour || ''}
              onChange={(e) => {
                const value = e.target.value;
                
                // Si la valeur est vide, on met à jour et on sort
                if (!value) {
                  updateFormData({ dateRetour: value });
                  return;
                }
                
                // 🛑 CORRECTION MAJEURE: Si la chaîne de date n'est pas complète (YYYY-MM-DD = 10 caractères)
                // on met à jour la valeur MAIS on SAUTE la validation pour éviter l'erreur.
                // Note : Certains navigateurs comme Safari peuvent ne pas fournir la date dans le format YYYY-MM-DD
                // tant qu'elle n'est pas complète.

                const isDateComplete = value.length === 10;
                
                // On met TOUJOURS à jour la valeur
                updateFormData({ dateRetour: value });

                // On ne valide que si la chaîne est complète ET qu'il existe une date de départ
                if (isDateComplete && formData.dateDepart) {
                  const selectedDate = new Date(value);
                  const departDate = new Date(formData.dateDepart);
                
                  // Validation : la date de retour doit être après la date de départ
                  if (selectedDate <= departDate) {
                    toast({
                      title: "Date invalide",
                      description: "❌ La date de retour doit être après la date de départ",
                      variant: "destructive"
                    });
                  }
                }
              }}
              className="h-14 text-base border-2 focus:border-primary"
              min={formData.dateDepart || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            />
            {formData.dateDepart && formData.dateRetour && (
              <p className="text-sm text-accent font-bold flex items-center gap-2">
                ✓ Durée : {Math.ceil((new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) / (1000 * 60 * 60 * 24))} jours
              </p>
            )}
          </div>
        </div>

        {/* Durée si pas de date retour (Bloc corrigé pour la couleur et le défaut) */}
        {formData.dateDepart && !formData.dateRetour && (
          <div className="space-y-4 bg-card p-6 rounded-xl border-2 border-border shadow-sm">
            <Label className="text-lg font-bold text-foreground">
              Durée estimée du voyage <span className="text-primary">*</span>
            </Label>
            <RadioGroup
              value={formData.duree || "moyen"} // <-- CORRECTION: Défaut sur 'moyen'
              onValueChange={(value) => updateFormData({ duree: value as FormData['duree'] })}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { value: 'court', label: 'Court', desc: '≤ 7 jours' },
                { value: 'moyen', label: 'Moyen', desc: '8-21 jours' },
                { value: 'long', label: 'Long', desc: '22-90 jours' },
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
                      "flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/5 cursor-pointer transition-all",
                      // 🟢 CORRECTION: Utilisation de 'accent' (vert) pour la sélection 🟢
                      "hover:border-accent/50 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10" 
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
