import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input"; // <-- Ajout de l'Input
import { FormData, Profil, Confort, EnfantAge } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { cn } from "@/lib/utils"; // <-- Ajout de cn

interface Step4ProfilProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step4Profil = ({ formData, updateFormData }: Step4ProfilProps) => {
  const profils = checklistData.profils;
  const conforts = checklistData.conforts;
  const typesVoyage = checklistData.typesVoyage.options;

  // Mise à jour de la structure pour inclure les emojis directement
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
            Type de voyageur <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.profil}
            onValueChange={(value) => updateFormData({ profil: value as Profil })}
            className="grid grid-cols-1 md:grid-cols-2 gap-3" // Ajout de 2 colonnes pour les profils
          >
            {Object.entries(profils).map(([key, profil]: [string, any]) => (
              <div key={key}>
                <RadioGroupItem value={key} id={`profil-${key}`} className="peer sr-only" />
                <Label
                  htmlFor={`profil-${key}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  )}
                >
                  <span className="flex-1 cursor-pointer text-base font-medium">{profil.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Champs Enfants (Conditionnel) */}
        {formData.profil === 'famille' && (
          <div className="space-y-6 p-6 bg-muted/30 rounded-xl border-2 border-primary/20 animate-scale-in shadow-inner">
            <div className="space-y-2">
              <Label htmlFor="nombreEnfants" className="text-base font-semibold">
                Nombre d'enfants
              </Label>
              <Input
                id="nombreEnfants"
                type="number"
                min="1"
                max="6"
                value={formData.nombreEnfants || ''}
                onChange={(e) => updateFormData({ nombreEnfants: parseInt(e.target.value) || undefined })}
                className="h-12 text-base max-w-xs focus:border-primary"
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
                          isChecked ? "border-primary bg-primary/5" : "border-border"
                      )}
                      onClick={() => handleAgeEnfantToggle(key as EnfantAge)}
                    >
                      <Checkbox
                        id={`age-${key}`}
                        checked={isChecked}
                        onCheckedChange={() => {}} // Géré par le div parent
                        className="mt-1"
                      />
                      <Label 
                        htmlFor={`age-${key}`} 
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
            Type de voyage <span className="text-primary">*</span>
          </Label>
          <RadioGroup
            value={formData.typeVoyage}
            onValueChange={(value) => updateFormData({ typeVoyage: value as FormData['typeVoyage'] })}
            className="grid grid-cols-1 gap-3"
          >
            {typesVoyage.map((type) => (
              <div key={type.id}>
                <RadioGroupItem value={type.id} id={`typeVoyage-${type.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`typeVoyage-${type.id}`}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  )}
                >
                  <div className="font-semibold text-base mb-1 flex items-center">
                    {/* Affiche l'emoji et le nom du type de voyage */}
                    <span className="mr-2 text-xl">{type.emoji}</span>
                    {type.nom}
                  </div>
                  <div className="text-sm text-muted-foreground ml-7 -mt-1">
                    {type.description}
                  </div>
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
            {Object.entries(conforts).map(([key, confort]: [string, any]) => (
              <div key={key}>
                <RadioGroupItem value={key} id={`confort-${key}`} className="peer sr-only" />
                <Label
                  htmlFor={`confort-${key}`}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  )}
                >
                  <div className="font-semibold text-base mb-1">{confort.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {confort.description}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
