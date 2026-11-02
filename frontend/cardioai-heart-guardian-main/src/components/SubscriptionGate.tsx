import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TIERS } from "@/lib/subscription-tiers";

const SubscriptionGate = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="gradient-card rounded-3xl border border-border/60 shadow-xl shadow-primary/5 p-10 md:p-14 text-center animate-reveal">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">
          Sign In Required
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Access the AI-powered cardiovascular risk assessment by signing in to your CardioAI account.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
            <LogIn className="w-4 h-4" /> Sign In
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#pricing">View Plans</a>
          </Button>
        </div>
      </div>
    );
  }

  if (subscription.loading) {
    return (
      <div className="gradient-card rounded-3xl border border-border/60 shadow-xl shadow-primary/5 p-14 text-center animate-reveal">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Checking subscription status…</p>
      </div>
    );
  }

  return (
    <div className="gradient-card rounded-3xl border border-border/60 shadow-xl shadow-primary/5 p-10 md:p-14 text-center animate-reveal">
      <div className="w-16 h-16 rounded-2xl bg-cardio-warning/10 flex items-center justify-center mx-auto mb-6">
        <Lock className="w-7 h-7 text-cardio-warning" />
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cardio-warning/10 text-cardio-warning text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5" /> Upgrade Required
      </span>
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        Premium Feature
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-4">
        The cardiovascular risk assessment tool is available to active subscribers. Choose a plan that fits your practice.
      </p>
      <p className="text-xs text-muted-foreground mb-8">
        Starting at <span className="font-semibold text-foreground">${TIERS.professional.price}/month</span> for individual clinicians
      </p>
      <Button variant="hero" size="lg" asChild>
        <a href="#pricing">View Plans</a>
      </Button>
    </div>
  );
};

export default SubscriptionGate;
