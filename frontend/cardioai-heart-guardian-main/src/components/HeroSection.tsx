import { Button } from "@/components/ui/button";
import { Activity, Heart, Brain } from "lucide-react";
import logo from "@/assets/cardioai-logo.png";

const HeroSection = () => (
  <section id="home" className="gradient-hero pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left content */}
        <div className="animate-reveal">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="CardioAI" className="h-14 w-auto" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] tracking-tight mb-2">
            Cardio<span className="text-gradient">AI</span>
          </h1>
          <p className="font-display text-lg md:text-xl text-primary font-medium mb-5">
            AI-Based Cardiovascular Risk Screening
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mb-8">
            CardioAI leverages patient clinical data — including vitals, ECG findings, and metabolic markers — to estimate cardiovascular disease risk and empower early, data-driven screening decisions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#assessment">Start Assessment</a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative animate-reveal" style={{ animationDelay: "150ms" }}>
          <div className="relative bg-card rounded-3xl border border-border/60 shadow-2xl shadow-primary/5 p-8 md:p-10">
            {/* Decorative pulse ring */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 animate-pulse-ring" />
            
            {/* Mock dashboard */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Heart Rate</p>
                  <p className="font-display text-xl font-bold text-foreground">72 <span className="text-sm font-normal text-muted-foreground">bpm</span></p>
                </div>
              </div>

              {/* ECG line SVG */}
              <svg viewBox="0 0 300 60" className="w-full h-16 text-primary" fill="none">
                <path
                  d="M0 30 L40 30 L50 30 L60 10 L70 50 L80 20 L90 40 L100 30 L140 30 L150 30 L160 8 L170 52 L180 18 L190 42 L200 30 L240 30 L250 30 L260 12 L270 48 L280 22 L290 38 L300 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
              </svg>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/60 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">Blood Pressure</span>
                  </div>
                  <p className="font-display text-lg font-bold text-foreground">120/80</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">AI Risk Score</span>
                  </div>
                  <p className="font-display text-lg font-bold text-cardio-success">Low</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-cardio-success animate-pulse" />
                <span>Real-time AI analysis active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
