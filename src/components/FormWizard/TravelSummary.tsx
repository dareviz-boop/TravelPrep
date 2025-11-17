import { FormData } from "@/types/form";
import { Edit2 } from "lucide-react";
import { checklistData } from "@/utils/checklistUtils";

interface TravelSummaryProps {
  formData: FormData;
  onEditStep: (step: number) => void;
}

// Helper pour formater les dates en DD/MM/YYYY
const formatDateDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper pour calculer la durée entre deux dates
const calculateDuration = (dateDepart: string, dateRetour?: string, duree?: string): string => {
  if (!dateDepart) return "";

  if (dateRetour) {
    const start = new Date(dateDepart);
    const end = new Date(dateRetour);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} jour${days > 1 ? "s" : ""}`;
  }

  // Si pas de date de retour, afficher la durée estimée
  const dureeLabels = {
    "court": "≤ 7 jours",
    "moyen": "8-29 jours",
    "long": "30-90 jours",
    "tres-long": "> 90 jours"
  };
  return dureeLabels[duree as keyof typeof dureeLabels] || "";
};

// Helper pour obtenir le label d'une saison
const getSaisonLabel = (saisonId: string): string => {
  const saison = checklistData.saisons.options.find((s: any) => s.id === saisonId);
  return saison ? `${saison.emoji} ${saison.nom}` : saisonId;
};

// Helper pour obtenir le label d'une température
const getTemperatureLabel = (tempId: string): string => {
  const temp = checklistData.temperatures.options.find((t: any) => t.id === tempId);
  return temp ? `${temp.emoji} ${temp.nom}` : tempId;
};

// Helper pour obtenir le label d'une condition climatique
const getConditionLabel = (conditionId: string): string => {
  for (const groupe of checklistData.conditionsClimatiques) {
    const condition = groupe.options.find((c: any) => c.id === conditionId);
    if (condition) return condition.nom;
  }
  return conditionId;
};

// Helper pour obtenir le label d'une activité
const getActiviteLabel = (activiteId: string): string => {
  const activite = checklistData.activites.options.find((a: any) => a.id === activiteId);
  return activite ? `${activite.emoji} ${activite.nom}` : activiteId;
};

// Helper pour obtenir le label d'un profil
const getProfilLabel = (profilId: string): string => {
  const profil = checklistData.profils.options.find((p: any) => p.id === profilId);
  return profil ? `${profil.emoji} ${profil.nom}` : profilId;
};

// Helper pour obtenir le label d'un type de voyage
const getTypeVoyageLabel = (typeId: string): string => {
  const type = checklistData.typeVoyage.options.find((t: any) => t.id === typeId);
  return type ? `${type.emoji} ${type.nom}` : typeId;
};

// Helper pour obtenir le label d'un confort
const getConfortLabel = (confortId: string): string => {
  const confort = checklistData.confort.options.find((c: any) => c.id === confortId);
  return confort ? `${confort.emoji} ${confort.nom}` : confortId;
};

// Helper pour obtenir le label d'un âge enfant
const getAgeEnfantLabel = (ageId: string): string => {
  const agesLabels = {
    "0-2-ans": "0-2 ans",
    "3-5-ans": "3-5 ans",
    "6-12-ans": "6-12 ans",
    "13+-ans": "13+ ans"
  };
  return agesLabels[ageId as keyof typeof agesLabels] || ageId;
};

export const TravelSummary = ({ formData, onEditStep }: TravelSummaryProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Titre principal */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#EA580C]">
            ⚙️ Personnalisez votre checklist
          </h1>
          <p className="text-gray-600 text-lg">
            Derniers réglages avant de générer votre PDF
          </p>
        </div>

        {/* Carte principale avec récapitulatif */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Titre du récapitulatif */}
          <h2 className="text-2xl font-bold text-gray-800">
            📋 Récapitulatif du voyage
          </h2>

          {/* Étape 1 : Destination */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Étape 1 : Destination
              </h3>
              <button
                onClick={() => onEditStep(1)}
                className="text-[#EA580C] hover:text-[#C2410C] transition-colors"
                aria-label="Modifier la destination"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-600">Voyage :</span>
                <span className="text-gray-800 font-medium">
                  {formData.nomVoyage || "Non renseigné"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Date de départ :</span>
                <span className="text-gray-800 font-medium">
                  {formatDateDDMMYYYY(formData.dateDepart) || "Non renseigné"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Date de retour :</span>
                <span className="text-gray-800 font-medium">
                  {formData.dateRetour ? formatDateDDMMYYYY(formData.dateRetour) : "Non renseigné"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Durée calculée :</span>
                <span className="text-gray-800 font-medium">
                  {calculateDuration(formData.dateDepart, formData.dateRetour, formData.duree)}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Destination :</span>
                <span className="text-gray-800 font-medium">
                  {formData.localisation ?
                    checklistData.localisations[formData.localisation as keyof typeof checklistData.localisations]?.nom.split(' ').slice(1).join(' ')
                    : "Non renseigné"}
                  {formData.pays && formData.pays.length > 0 && (
                    <span className="ml-2">
                      {formData.pays.map(p => p.flag).join(" ")}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-300"></div>

          {/* Étape 2 : Informations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Étape 2 : Informations
              </h3>
              <button
                onClick={() => onEditStep(2)}
                className="text-[#EA580C] hover:text-[#C2410C] transition-colors"
                aria-label="Modifier les informations"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <div className="flex gap-2 flex-wrap">
                <span className="text-gray-600">Saisons :</span>
                <span className="text-gray-800 font-medium flex flex-wrap gap-2">
                  {formData.saison && formData.saison.length > 0
                    ? formData.saison.map((s) => getSaisonLabel(s)).join(" ")
                    : "Non renseigné"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-gray-600">Température :</span>
                <span className="text-gray-800 font-medium flex flex-wrap gap-2">
                  {formData.temperature && formData.temperature.length > 0
                    ? formData.temperature.map((t) => getTemperatureLabel(t)).join(" ")
                    : "Non renseigné"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-gray-600">Conditions :</span>
                <span className="text-gray-800 font-medium flex flex-wrap gap-2">
                  {formData.conditionsClimatiques && formData.conditionsClimatiques.length > 0
                    ? formData.conditionsClimatiques.map((c) => getConditionLabel(c)).join(" ")
                    : "Non renseigné"}
                </span>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-300"></div>

          {/* Étape 3 : Activités */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Étape 3 : Activités
              </h3>
              <button
                onClick={() => onEditStep(3)}
                className="text-[#EA580C] hover:text-[#C2410C] transition-colors"
                aria-label="Modifier les activités"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <div className="flex gap-2 flex-wrap">
                <span className="text-gray-600">Activités :</span>
                <span className="text-gray-800 font-medium flex flex-wrap gap-2">
                  {formData.activites && formData.activites.length > 0
                    ? formData.activites.map((a) => getActiviteLabel(a)).join(" ")
                    : "Non renseigné"}
                </span>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-300"></div>

          {/* Étape 4 : Profil */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Étape 4 : Profil
              </h3>
              <button
                onClick={() => onEditStep(4)}
                className="text-[#EA580C] hover:text-[#C2410C] transition-colors"
                aria-label="Modifier le profil"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-600">Profil :</span>
                <span className="text-gray-800 font-medium">
                  {formData.profil ? getProfilLabel(formData.profil) : "Non renseigné"}
                </span>
              </div>

              {/* Détails Famille */}
              {formData.profil === "famille" && (
                <div className="pl-4 space-y-1">
                  <div className="flex gap-2">
                    <span className="text-gray-600">Nombre enfants :</span>
                    <span className="text-gray-800 font-medium">
                      {formData.nombreEnfants || "Non renseigné"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-600">Âge :</span>
                    <span className="text-gray-800 font-medium">
                      {formData.agesEnfants && formData.agesEnfants.length > 0
                        ? formData.agesEnfants.map((a) => getAgeEnfantLabel(a)).join(", ")
                        : "Non renseigné"}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <span className="text-gray-600">Type de voyage :</span>
                <span className="text-gray-800 font-medium">
                  {formData.typeVoyage ? getTypeVoyageLabel(formData.typeVoyage) : "Non renseigné"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Confort :</span>
                <span className="text-gray-800 font-medium">
                  {formData.confort ? getConfortLabel(formData.confort) : "Non renseigné"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
