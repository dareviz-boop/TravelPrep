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
        <h2 className="text-4xl font-bold mb-3 text-primary">
          🌍 Commençons par les bases
        </h2>
        <p className="text-foreground/70 text-lg">
          Quelques informations essentielles sur ton voyage
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
            placeholder="Ex: Roadtrip Australie 2025"
            value={formData.nomVoyage}
            onChange={(e) => updateFormData({ nomVoyage: e.target.value })}
            className="h-14 text-base border-2 focus:border-primary"
            required
          />
          <p className="text-sm text-muted-foreground">
            Donne un nom à ton voyage pour l'identifier facilement
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
              onChange={(e) => updateFormData({ dateDepart: e.target.value })}
              className="h-14 text-base border-2 focus:border-primary"
              required
              min={new Date().toISOString().split('T')[0]}
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
              onChange={(e) => updateFormData({ dateRetour: e.target.value })}
              className="h-14 text-base border-2 focus:border-primary"
              min={formData.dateDepart || new Date().toISOString().split('T')[0]}
            />
            {formData.dateDepart && formData.dateRetour && (
              <p className="text-sm text-accent font-bold flex items-center gap-2">
                ✓ Durée : {Math.ceil((new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) / (1000 * 60 * 60 * 24))} jours
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
