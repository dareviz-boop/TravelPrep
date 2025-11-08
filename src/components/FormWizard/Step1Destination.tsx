import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export const Step1Destination = ({ formData, updateFormData }: Step1DestinationProps) => {
  const { toast } = useToast();
  const [showPaysSelector, setShowPaysSelector] = useState(false);
  const [open, setOpen] = useState(false);
  const [paysOptions, setPaysOptions] = useState<Pays[]>([]);

  useEffect(() => {
    if (formData.localisation && formData.localisation !== 'multi-destinations') {
      const options = getPaysOptions(formData.localisation);
      setPaysOptions(options);
    } else {
      setPaysOptions([]);
    }
  }, [formData.localisation]);

  const handlePaysSelect = (pays: Pays) => {
    if (!formData.pays.find(p => p.code === pays.code)) {
      if (formData.pays.length < 3) {
        updateFormData({ pays: [...formData.pays, pays] });
      }
    } else {
      updateFormData({ pays: formData.pays.filter(p => p.code !== pays.code) });
    }
  };

  const handlePaysRemove = (code: string) => {
    updateFormData({ pays: formData.pays.filter(p => p.code !== code) });
  };

  const localisations: { value: Localisation; label: string; emoji: string }[] = [
    { value: 'europe', label: 'Europe', emoji: '🇪🇺' },
    { value: 'asie', label: 'Asie', emoji: '🏯' },
    { value: 'afrique', label: 'Afrique', emoji: '🦁' },
    { value: 'amerique-nord', label: 'Amérique du Nord', emoji: '🗽' },
    { value: 'amerique-centrale-caraibes', label: 'Caraïbes', emoji: '🏝️' },
    { value: 'amerique-sud', label: 'Amérique du Sud', emoji: '🦙' },
    { value: 'oceanie', label: 'Océanie', emoji: '🦘' },
    { value: 'multi-destinations', label: 'Multi-destinations', emoji: '🌐' },
  ];

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
        {/* Nom du voyage */}
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

        {/* Zone géographique */}
        <div className="space-y-4">
          <Label className="text-lg font-bold text-foreground">
            Zone géographique <span className="text-primary">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        {/* Sélecteur de pays */}
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

            {/* Combobox */}
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
                                if (formData.pays.length >= 2) {
                                  setOpen(false);
                                }
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
              Affine ta checklist en sélectionnant des pays spécifiques
            </p>
          </div>
        )}
          
            {formData.localisation === 'multi-destinations' && (
        <div className="space-y-4 bg-card p-6 rounded-xl border-2 border-border shadow-sm">
          
          {/* Titre mis à jour */}
          <div className="flex items-center justify-between">
            <Label className="text-lg font-bold text-foreground">
              Vos destinations <span className="text-muted-foreground text-sm font-normal">(ex: 10 max)</span>
            </Label>
          </div>
      
          {/* Pays sélectionnés (Code identique au bloc 1) */}
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
      
          {/* Combobox mis à jour (limite et source des données) */}
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
                      
                      {/* ATTENTION : Utilise la liste COMPLÈTE des pays */}
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
          
          {/* Texte d'aide mis à jour */}
          <p className="text-sm text-muted-foreground">
            Sélectionnez tous les pays de votre itinéraire.
          </p>
        </div>
      )}
        
        {/* Villes / Étapes importantes (Optionnel) */}
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
        
        {/* Dates */}
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

          <div className="space-y-3 bg-card p-6 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow">
            <Label htmlFor="dateRetour" className="text-lg font-bold text-foreground">
              Date de retour <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
            </Label>
            <Input
              id="dateRetour"
              type="date"
              value={formData.dateRetour || ''}
              onChange={(e) => {
                const value = e.target.value;
                
                if (!value) {
                  updateFormData({ dateRetour: value });
                  return;
                }
                
                const selectedDate = new Date(value);
                const departDate = new Date(formData.dateDepart);
                
                // Validation : la date de retour doit être après la date de départ
                if (selectedDate <= departDate) {
                  toast({
                    title: "Date invalide",
                    description: "❌ La date de retour doit être après la date de départ",
                    variant: "destructive"
                  });
                  return;
                }
                
                updateFormData({ dateRetour: value });
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

        {/* Durée si pas de date retour */}
        {formData.dateDepart && !formData.dateRetour && (
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
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/5 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
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
