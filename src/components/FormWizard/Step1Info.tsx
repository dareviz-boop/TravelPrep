import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";

interface Step1InfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step1Info = ({ formData, updateFormData }: Step1InfoProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-travel bg-clip-text text-transparent">
          🌍 Commençons par les bases
        </h2>
        <p className="text-muted-foreground">
          Quelques informations essentielles sur votre voyage
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="nomVoyage" className="text-base font-semibold">
            Nom du voyage <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nomVoyage"
            placeholder="Ex: Roadtrip Australie 2025"
            value={formData.nomVoyage}
            onChange={(e) => updateFormData({ nomVoyage: e.target.value })}
            className="h-12 text-base"
            required
          />
          <p className="text-sm text-muted-foreground">
            Donnez un nom à votre voyage pour l'identifier facilement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateDepart" className="text-base font-semibold">
              Date de départ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dateDepart"
              type="date"
              value={formData.dateDepart}
              onChange={(e) => updateFormData({ dateDepart: e.target.value })}
              className="h-12 text-base"
              required
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-sm text-muted-foreground">
              Nous calculerons automatiquement vos échéances
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateRetour" className="text-base font-semibold">
              Date de retour <span className="text-muted-foreground text-sm">(optionnel)</span>
            </Label>
            <Input
              id="dateRetour"
              type="date"
              value={formData.dateRetour || ''}
              onChange={(e) => updateFormData({ dateRetour: e.target.value })}
              className="h-12 text-base"
              min={formData.dateDepart || new Date().toISOString().split('T')[0]}
            />
            {formData.dateDepart && formData.dateRetour && (
              <p className="text-sm text-accent font-medium">
                Durée : {Math.ceil((new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) / (1000 * 60 * 60 * 24))} jours
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
