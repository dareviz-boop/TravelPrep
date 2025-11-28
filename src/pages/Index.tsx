import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plane, Clock, FileDown, Sparkles } from "lucide-react";
import { TITLES } from "@/constants/messages";
import { ANIMATION_DELAYS } from "@/constants/animations";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-ocean">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-travel opacity-10"></div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="mb-4">
              <span className="inline-block text-5xl mb-2">🌍</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-travel bg-clip-text text-transparent">
              {TITLES.app}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Votre guide de préparation au voyage personnalisé
            </p>
            <p className="text-base md:text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
              Répondez à quelques questions et générez instantanément une checklist PDF complète,
              adaptée à votre destination et votre profil de voyageur.
            </p>
            <Button
              onClick={() => navigate("/generator")}
              size="lg"
              className="h-12 px-6 text-base bg-gradient-sunset hover:opacity-90 text-white font-semibold animate-scale-in"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Créer ma checklist
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à partir l'esprit tranquille ?
          </h2>
          <p className="text-base text-muted-foreground">
            {TITLES.tagline}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">100% Personnalisé</h3>
            <p className="text-sm text-muted-foreground">
              Checklist adaptée à votre destination, durée, activités et profil de voyageur.
              Aucun élément superflu.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: ANIMATION_DELAYS.short }}>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Timeline Complète</h3>
            <p className="text-sm text-muted-foreground">
              Échéances calculées automatiquement de J-90 au retour. Ne manquez plus jamais une
              démarche importante.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: ANIMATION_DELAYS.medium }}>
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileDown className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">PDF Prêt à Imprimer</h3>
            <p className="text-sm text-muted-foreground">
              Format compact, détaillé ou optimisé pour Notion. Téléchargement instantané, pas
              d'inscription requise.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Index;
