import { Shield, Activity, Brain, HeartPulse } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Risk Estimation",
    description: "Machine learning models trained on clinical datasets deliver rapid, data-driven cardiovascular risk assessments.",
  },
  {
    icon: HeartPulse,
    title: "Early Screening Support",
    description: "Identify at-risk patients earlier by combining routine clinical parameters with intelligent pattern recognition.",
  },
  {
    icon: Shield,
    title: "Clinical Decision Support",
    description: "Augment physician judgment with objective, reproducible risk scores that integrate seamlessly into clinical workflows.",
  },
  {
    icon: Activity,
    title: "Preventive Care Focus",
    description: "Shift care upstream — enabling proactive lifestyle interventions and targeted follow-ups before events occur.",
  },
];

const FeaturesSection = () => (
  <section id="about" className="py-20 md:py-28">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="text-center mb-14 animate-reveal">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">Why CardioAI</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Smarter Cardiovascular Screening
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Purpose-built for hospitals, clinics, and preventive care programs seeking evidence-based risk stratification.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group gradient-card rounded-2xl border border-border/50 p-7 shadow-md shadow-primary/3 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 animate-reveal"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
