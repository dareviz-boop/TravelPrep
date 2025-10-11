import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plane, Clock, FileDown, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-ocean">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-travel opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6">
              <span className="inline-block text-6xl mb-4">🌍</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-travel bg-clip-text text-transparent">
              TravelPrep
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8">
              Votre guide de préparation au voyage personnalisé
            </p>
            <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto">
              Répondez à quelques questions et générez instantanément une checklist PDF complète,
              adaptée à votre destination et votre profil de voyageur.
            </p>
            <Button
              onClick={() => navigate("/generator")}
              size="lg"
              className="h-14 px-8 text-lg bg-gradient-sunset hover:opacity-90 text-white font-semibold animate-scale-in"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Créer ma checklist
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Plane className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">100% Personnalisé</h3>
            <p className="text-muted-foreground">
              Checklist adaptée à votre destination, durée, activités et profil de voyageur.
              Aucun élément superflu.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Timeline Complète</h3>
            <p className="text-muted-foreground">
              Échéances calculées automatiquement de J-90 au retour. Ne manquez plus jamais une
              démarche importante.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileDown className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">PDF Prêt à Imprimer</h3>
            <p className="text-muted-foreground">
              Format compact, détaillé ou optimisé pour Notion. Téléchargement instantané, pas
              d'inscription requise.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-travel rounded-3xl p-12 text-center max-w-3xl mx-auto shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à partir l'esprit tranquille ?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            2 minutes de formulaire = Une checklist complète pour tout votre voyage
          </p>
          <Button
            onClick={() => navigate("/generator")}
            size="lg"
            variant="secondary"
            className="h-14 px-8 text-lg font-semibold"
          >
            Commencer maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
