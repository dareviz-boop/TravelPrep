import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormData, Profil, Confort, EnfantAge } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { cn } from "@/lib/utils";

interface ProfilOption {
  id: string;
  nom: string;
  emoji: string;
  description: string;
}

interface TypeVoyageOption {
  id: string;
  nom: string;
  emoji: string;
  description: string;
}

interface ConfortOption {
  id: string;
  nom: string;
  emoji: string;
  description: string;
}

interface Step4ProfilProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step4Profil = ({ formData, updateFormData }: Step4ProfilProps) => {
  // L'objet checklistData a été mis à jour pour inclure les options des profils et conforts.
  const profils = checklistData.profils;
  const confort = checklistData.confort;
  const typeVoyage = checklistData.typeVoyage.options;

  const agesEnfants = [
    { key: '0-2-ans', label: '0-2 ans (bébé)', emoji: '🍼' },
    { key: '3-5-ans', label: '3-5 ans (jeune enfant)', emoji: '👶' },
    { key: '6-12-ans', label: '6-12 ans (enfant)', emoji: '👦' },
    { key: '13+-ans', label: '13+ ans (adolescent)', emoji: '🧑' }
  ];

  const handleAgeEnfantToggle = (age: EnfantAge) => {
    const current = formData.agesEnfants || [];
    const updated = current.includes(age)
      ? current.filter((a) => a !== age)
      : [...current, age];
    updateFormData({ agesEnfants: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          👥 Avec qui voyagez-vous ?
        </h2>
        <p className="text-muted-foreground">
          Adaptons votre checklist à vos besoins
        </p>
      </div>
      
      <div className="space-y-8 max-w-2xl mx-auto">
        
        {/* Type de voyageur (Profil) */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Profil de voyageur <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.profil}
            onValueChange={(value) => updateFormData({ profil: value as Profil })}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {(profils.options as ProfilOption[]).map((profil: ProfilOption) => (
              <div key={profil.id}>
                <RadioGroupItem value={profil.id} id={`profil-${profil.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`profil-${profil.id}`}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  )}
                >
                  <span className="flex-1 cursor-pointer">
                    <p className="font-semibold text-base flex items-center">
                        <span className="mr-2">{profil.emoji}</span>
                        {profil.nom}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {profil.description}
                    </p>
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Champs Enfants (Conditionnel) */}
        {formData.profil === 'famille' && (
          <div className="space-y-6 animate-scale-in"> 
            <div className="space-y-2">
              <Label htmlFor="nombreEnfants" className="text-base font-semibold">
                Nombre d'enfants <span className="text-primary">*</span>
              </Label>
              <Input
                id="nombreEnfants"
                type="number"
                min="1"
                max="10"
                value={formData.nombreEnfants || ''}
                onChange={(e) => updateFormData({ nombreEnfants: parseInt(e.target.value) || undefined })}
                className="h-12 text-base max-w-xs border-2 focus-visible:border-primary"
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Âge des enfants <span className="text-primary">*</span></Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agesEnfants.map(({ key, label, emoji }) => {
                  const isChecked = formData.agesEnfants?.includes(key as EnfantAge);
                    
                  return (
                    <div 
                      key={key} 
                      className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50",
                          isChecked ? "border-primary bg-primary/10" : "border-border"
                      )}
                      onClick={() => handleAgeEnfantToggle(key as EnfantAge)}
                    >
                      <Checkbox
                        id={`age-${key}`}
                        checked={isChecked}
                        onCheckedChange={() => {}} 
                        className="mt-1"
                      />
                      <Label 
                        className="flex-1 cursor-pointer text-base font-medium flex items-center"
                      >
                        <span className="mr-2">{emoji}</span>
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Type de voyage */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Type de voyage <span className="text-primary">*</span> {/* CORRECTION : Rendu obligatoire */}
          </Label>
          <RadioGroup
            value={formData.typeVoyage}
            onValueChange={(value) => updateFormData({ typeVoyage: value as FormData['typeVoyage'] })}
            className="grid grid-cols-1 gap-3"
          >
            {(typeVoyage as TypeVoyageOption[]).map((type: TypeVoyageOption) => (
              <div key={type.id}>
                <RadioGroupItem value={type.id} id={`typeVoyage-${type.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`typeVoyage-${type.id}`}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  )}
                >
                  <span className="flex-1 cursor-pointer">
                    <p className="font-semibold text-base flex items-center">
                        <span className="mr-2 text-xl">{type.emoji}</span>
                        {type.nom}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                    </p>
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Niveau de confort souhaité */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Niveau de confort souhaité <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.confort}
            onValueChange={(value) => updateFormData({ confort: value as Confort })}
            className="grid grid-cols-1 gap-3"
          >
            {(confort.options as ConfortOption[]).map((confort: ConfortOption) => (
              <div key={confort.id}>
                <RadioGroupItem value={confort.id} id={`confort-${confort.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`confort-${confort.id}`}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  )}
                >
                  <span className="flex-1 cursor-pointer">
                    <p className="font-semibold text-base flex items-center">
                        <span className="mr-2">{confort.emoji}</span>
                        {confort.nom}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {confort.description}
                    </p>
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div> 
      </div>
    </div>
    );
};
