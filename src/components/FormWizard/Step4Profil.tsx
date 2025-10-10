import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, Profil, Confort, EnfantAge } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";

interface Step4ProfilProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step4Profil = ({ formData, updateFormData }: Step4ProfilProps) => {
  const profils = checklistData.profils;
  const conforts = checklistData.conforts;

  const agesEnfants = [
    { key: '0-2-ans', label: '0-2 ans (bébé)' },
    { key: '3-5-ans', label: '3-5 ans (jeune enfant)' },
    { key: '6-12-ans', label: '6-12 ans (enfant)' },
    { key: '13+-ans', label: '13+ ans (adolescent)' }
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
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Type de voyageur <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.profil}
            onValueChange={(value) => updateFormData({ profil: value as Profil })}
            className="grid grid-cols-1 gap-3"
          >
            {Object.entries(profils).map(([key, profil]: [string, any]) => (
              <div
                key={key}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.profil === key ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={key} id={`profil-${key}`} />
                <Label htmlFor={`profil-${key}`} className="flex-1 cursor-pointer text-base">
                  {profil.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {formData.profil === 'famille' && (
          <div className="space-y-6 p-6 bg-muted/30 rounded-lg border-2 border-primary/20 animate-scale-in">
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
                className="h-12 text-base max-w-xs"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Âge des enfants</Label>
              <div className="grid grid-cols-1 gap-3">
                {agesEnfants.map(({ key, label }) => (
                  <div
                    key={key}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                      formData.agesEnfants?.includes(key as EnfantAge)
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => handleAgeEnfantToggle(key as EnfantAge)}
                  >
                    <Checkbox
                      id={`age-${key}`}
                      checked={formData.agesEnfants?.includes(key as EnfantAge)}
                      onCheckedChange={() => handleAgeEnfantToggle(key as EnfantAge)}
                    />
                    <Label htmlFor={`age-${key}`} className="flex-1 cursor-pointer text-base">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Niveau de confort souhaité <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.confort}
            onValueChange={(value) => updateFormData({ confort: value as Confort })}
            className="grid grid-cols-1 gap-3"
          >
            {Object.entries(conforts).map(([key, confort]: [string, any]) => (
              <div
                key={key}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  formData.confort === key ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <RadioGroupItem value={key} id={`confort-${key}`} />
                <Label htmlFor={`confort-${key}`} className="flex-1 cursor-pointer">
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
