import { Check, Shield, Building2, Users, Handshake, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TIERS } from "@/lib/subscription-tiers";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    key: "professional" as const,
    icon: Users,
    name: "Clinical Professional",
    audience: "For individual doctors, cardiologists, and screening specialists",
    price: TIERS.professional.price,
    priceId: TIERS.professional.price_id,
    features: [
      "Individual AI risk assessment access",
      "Patient risk scoring dashboard",
      "Unlimited monthly predictions",
      "Result export & history",
    ],
    cta: "Start Professional Plan",
    popular: false,
  },
  {
    key: "institution" as const,
    icon: Building2,
    name: "Healthcare Institution",
    audience: "For hospitals, clinics, and cardiology departments",
    price: TIERS.institution.price,
    priceId: TIERS.institution.price_id,
    features: [
      "Multi-user institutional access",
      "Advanced risk analytics",
      "Priority support & onboarding",
      "Custom integration options",
      "Audit-ready reporting",
    ],
    cta: "Get Institution Access",
    popular: true,
  },
  {
    key: "preventive" as const,
    icon: Shield,
    name: "Preventive Care Program",
    audience: "For screening initiatives and population health projects",
    price: null,
    priceId: null,
    features: [
      "Population-scale screening",
      "Cohort risk stratification",
      "Program analytics dashboard",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
  {
    key: "partner" as const,
    icon: Handshake,
    name: "Health-Tech Partner",
    audience: "For enterprise collaboration and API integration",
    price: null,
    priceId: null,
    features: [
      "API access & custom models",
      "White-label deployment",
      "SLA-backed uptime",
      "Joint research opportunities",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const PricingSection = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planKey: string) => {
  if (!user) {
    navigate("/auth");
    return;
  }
  setLoadingPlan(planKey);
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId },
    });
    if (error) throw error;
    if (data?.url) window.location.href = data.url;
  } catch {
    toast({ variant: "destructive", title: "Checkout failed", description: "Please try again." });
  } finally {
    setLoadingPlan(null);
  }
};

  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-14 animate-reveal">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Plans for Every Healthcare Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're an individual clinician or a large institution, CardioAI offers flexible plans to support AI-powered cardiovascular screening at every scale.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const isActive = subscription.subscribed && subscription.tierKey === plan.key;
            return (
              <div
                key={plan.key}
                className={`relative flex flex-col gradient-card rounded-2xl border shadow-md transition-all duration-300 animate-reveal ${
                  plan.popular
                    ? "border-primary/40 shadow-lg shadow-primary/8 scale-[1.02] lg:scale-105"
                    : "border-border/50 shadow-primary/3 hover:shadow-lg hover:shadow-primary/8"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide shadow-md shadow-primary/25">
                    Most Popular
                  </div>
                )}

                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <plan.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{plan.audience}</p>

                  <div className="mb-6">
                    {plan.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-bold text-foreground">${plan.price}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                    ) : (
                      <span className="font-display text-xl font-bold text-foreground">Custom</span>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <div className="flex items-center justify-center gap-2 h-12 rounded-xl bg-cardio-success/10 text-cardio-success text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      Your Active Plan
                    </div>
                  ) : plan.priceId ? (
                    <Button
                      variant={plan.popular ? "hero" : "outline"}
                      size="lg"
                      className="w-full"
                      disabled={loadingPlan === plan.key}
                      onClick={() => handleCheckout(plan.priceId!, plan.key)}
                    >
                      {loadingPlan === plan.key ? "Redirecting…" : plan.cta}
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a href="mailto:sales@cardioai.health">{plan.cta}</a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-muted-foreground animate-reveal" style={{ animationDelay: "300ms" }}>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure billing via Stripe</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Professional healthcare use</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI-powered screening support</span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
