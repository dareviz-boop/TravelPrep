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
  // ❌ Ancien code : Liste codée en dur
  /*
  const sectionsData = [
    { id: 'documents', label: '📄 Documents & Administratif', desc: '...' },
    // ...
  ];
  */

  // ✅ NOUVEAU CODE : Lecture directe du JSON uniformisé
  // Crée un tableau d'objets avec les propriétés id, label et desc, directement à partir du JSON
  const sectionsData = checklistData.categories.options.map((category) => ({
    id: category.id,
    label: `${category.emoji} ${category.nom}`, // Utilise l'emoji et le nom du JSON pour créer le label
    desc: category.description, // Utilise la description détaillée du JSON
  }));

  const handleSectionToggle = (sectionId: string) => {
    const allIds = sectionsData.map(s => s.id);
    // Si sectionsInclure est undefined (tout est sélectionné par défaut), on utilise la liste complète
    const current = formData.sectionsInclure === undefined ? allIds : formData.sectionsInclure;
    
    const updated = current.includes(sectionId)
      ? current.filter((id) => id !== sectionId)
      : [...current, sectionId];

    // Logique pour mettre sectionsInclure à undefined si toutes les sections sont sélectionnées
    // pour simplifier le stockage (si la liste est complète, on assume "tout coché").
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
        {/* Récapitulatif (Pas de changement nécessaire ici) */}
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
            {duration !== null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durée :</span>
                <span className="font-semibold">{duration} jours</span>
              </div>
            )}
            {/* ⚠️ NOTE: Les lignes ci-dessous nécessiteront une correction dans d'autres composants si vous uniformisez tous les filtres :
            {formData.localisation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination :</span>
                <span className="font-semibold">
                  {(checklistData.localisations as any)[formData.localisation]?.nom || formData.localisation}
                </span>
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
            */}
            {/* Laissez ces lignes si vous n'avez pas encore uniformisé localisations, profils, et conforts */}
            {formData.localisation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination :</span>
                <span className="font-semibold">
                  {/* Si localisations n'est pas uniformisé, ça peut encore marcher */}
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
                   {/* Si profils n'est pas uniformisé, ça peut encore marcher */}
                  {(checklistData.profils as any)[formData.profil]?.label || formData.profil}
                </span>
              </div>
            )}
            {formData.confort && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confort :</span>
                <span className="font-semibold">
                   {/* Si conforts n'est pas uniformisé, ça peut encore marcher */}
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

          <div className="grid grid-cols-1 gap-2">
            {sectionsData.map((section) => {
                // Vérifie si la section est incluse (si sectionsInclure est undefined, tout est coché)
                const isSelected = formData.sectionsInclure === undefined || formData.sectionsInclure.includes(section.id);
                
                // L'extraction de l'emoji et du titre n'est plus nécessaire car sectionsData le fournit directement
                // const [emoji, ...labelParts] = section.label.split(' ');
                // const title = labelParts.join(' ').trim();
                
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
                              {/* Utilisation directe du label qui contient déjà l'emoji et le nom */}
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

        {/* Format PDF */}
        {/* ... (Reste inchangé) ... */}
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
        {/* ... (Reste inchangé) ... */}
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
