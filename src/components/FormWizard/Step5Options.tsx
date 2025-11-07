import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { checklistData } from "@/utils/checklistUtils";
import { Card } from "@/components/ui/card";

interface Step5OptionsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step5Options = ({ formData, updateFormData }: Step5OptionsProps) => {
  const sectionsData = [
  { id: 'documents', label: '📄 Documents & Administratif', desc: 'Passeport, visas, assurances, copies de sécurité' },
  { id: 'finances', label: '💳 Finances & Argent', desc: 'Cartes bancaires, devises, notifications banque' },
  { id: 'sante', label: '🏥 Santé & Assurances', desc: 'Vaccins, pharmacie, traitements, urgences' },
  { id: 'domicile', label: '🏠 Domicile (avant départ)', desc: 'Clés, courrier, plantes, sécurisation maison' },
  { id: 'technologie', label: '💻 Technologie & Apps', desc: 'Forfait, applications, sauvegardes, matériel' },
  { id: 'reservations', label: '🎫 Réservations & Activités', desc: 'Vols, hébergements, excursions, transports' },
  { id: 'timeline', label: '⏰ Timeline chronologique', desc: 'Planning détaillé de J-90 au retour' },
  { id: 'bagages', label: '🎒 Bagages détaillés', desc: 'Liste vêtements et équipement adapté à votre voyage' },
  { id: 'urgence', label: '🚨 Kit d\'urgence', desc: 'Ce qu\'il faut toujours avoir sur soi' },
  { id: 'apps', label: '📱 Applications recommandées', desc: 'Apps offline et online essentielles' },
];

  const handleSectionToggle = (sectionId: string) => {
    const allIds = sectionsData.map(s => s.id);
    const current = formData.sectionsInclure || allIds;
    
    const updated = current.includes(sectionId)
      ? current.filter((id) => id !== sectionId)
      : [...current, section];
    updateFormData({ sectionsInclure: updated.length === allIds.length ? undefined : updated });
  };

  const calculateDuration = () => {
    if (!formData.dateDepart) return null;
    if (!formData.dateRetour) return null;
    const days = Math.ceil(
      (new Date(formData.dateRetour).getTime() - new Date(formData.dateDepart).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const duration = calculateDuration();

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
        <Card className="p-6 bg-gradient-ocean border-2 border-primary/20">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            📋 Récapitulatif
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Voyage :</span>
              <span className="font-semibold">{formData.nomVoyage || "Non renseigné"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Départ :</span>
              <span className="font-semibold">
                {formData.dateDepart
                  ? new Date(formData.dateDepart).toLocaleDateString("fr-FR")
                  : "Non renseigné"}
              </span>
            </div>
            {duration && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durée :</span>
                <span className="font-semibold">{duration} jours</span>
              </div>
            )}
            {formData.localisation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination :</span>
                <span className="font-semibold">
                  {(checklistData.localisations as any)[formData.localisation]?.nom || formData.localisation}
                </span>
              </div>
            )}
            {formData.activites && formData.activites.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activités :</span>
                <span className="font-semibold">{formData.activites.length} sélectionnée(s)</span>
              </div>
            )}
            {formData.profil && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profil :</span>
                <span className="font-semibold">
                  {(checklistData.profils as any)[formData.profil]?.label || formData.profil}
                </span>
              </div>
            )}
            {formData.confort && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confort :</span>
                <span className="font-semibold">
                  {(checklistData.conforts as any)[formData.confort]?.label || formData.confort}
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
                          // Si on sélectionne tout, on envoie la liste complète. Sinon, une liste vide.
                          sectionsInclure: shouldSelectAll ? allIds : [] 
                      });
                  }}
                  className="text-sm text-primary hover:underline font-semibold"
              >
                  {(formData.sectionsInclure || sectionsData.map(s => s.id)).length === sectionsData.length
                      ? 'Tout dé-sélectionner'
                      : 'Tout sélectionner'
                  }
              </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {sectionsData.map((section) => {
                // Vérifie si la section est incluse
                const isSelected = (formData.sectionsInclure || sectionsData.map(s => s.id)).includes(section.id);
                
                // Extraction de l'emoji et du titre (si le label contient déjà l'emoji)
                const [emoji, ...labelParts] = section.label.split(' ');
                const title = labelParts.join(' ').trim();
                
                return (
                    <div
                      key={section.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        isSelected ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => handleSectionToggle(section.id)}
                    >
                      <Checkbox
                        id={`section-${section.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                        className="mt-1"
                      />
                      <Label htmlFor={`section-${section.id}`} className="flex-1 cursor-pointer">
                          <div className="font-semibold text-base mb-1 flex items-center">
                              <span className="mr-2">{emoji}</span>
                              {title}
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

        {/* Format PDF */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Format du PDF <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.formatPDF}
            onValueChange={(value) => updateFormData({ formatPDF: value as 'compact' | 'detaille' })}
            className="grid grid-cols-1 gap-3"
          >
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                formData.formatPDF === "compact" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <RadioGroupItem value="compact" id="format-compact" />
              <Label htmlFor="format-compact" className="flex-1 cursor-pointer">
                <div className="font-semibold text-base mb-1">📄 Format compact</div>
                <div className="text-sm text-muted-foreground">Checklist simple et essentielle</div>
              </Label>
            </div>
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                formData.formatPDF === "detaille" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <RadioGroupItem value="detaille" id="format-detaille" />
              <Label htmlFor="format-detaille" className="flex-1 cursor-pointer">
                <div className="font-semibold text-base mb-1">📋 Format détaillé</div>
                <div className="text-sm text-muted-foreground">
                  Avec conseils et délais recommandés
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Email optionnel */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold">
            Email{" "}
            <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="h-12 text-base"
          />
          <p className="text-sm text-muted-foreground">
            Pour recevoir votre PDF par email
          </p>
        </div>
      </div>
    </div>
  );
};
