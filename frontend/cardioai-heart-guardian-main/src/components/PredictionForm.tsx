import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import ResultsPanel from "./ResultsPanel";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionGate from "./SubscriptionGate";
import { useLocation } from "react-router-dom";

interface PredictionResult {
  probability: number;
  risk_score: number;
  risk_label: string;
  risk_color: string;
  threshold: number;
}

const selectFields = {
  sex: [
    { value: "1", label: "Male" },
    { value: "0", label: "Female" },
  ],
  chest_pain_type: [
    { value: "1", label: "Typical Angina" },
    { value: "2", label: "Atypical Angina" },
    { value: "3", label: "Non-Anginal Pain" },
    { value: "4", label: "Asymptomatic" },
  ],
  fasting_blood_sugar: [
    { value: "1", label: "> 120 mg/dl" },
    { value: "0", label: "≤ 120 mg/dl" },
  ],
  resting_ecg: [
    { value: "0", label: "Normal" },
    { value: "1", label: "ST-T Wave Abnormality" },
    { value: "2", label: "Left Ventricular Hypertrophy" },
  ],
  exercise_angina: [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ],
  st_slope: [
    { value: "1", label: "Upsloping" },
    { value: "2", label: "Flat" },
    { value: "3", label: "Downsloping" },
  ],
};

const numberFields = [
  { name: "age", label: "Age", placeholder: "55", unit: "years" },
  { name: "cholesterol", label: "Cholesterol", placeholder: "220", unit: "mg/dl" },
  { name: "resting_bp_s", label: "Resting Blood Pressure", placeholder: "130", unit: "mmHg" },
  { name: "max_heart_rate", label: "Max Heart Rate", placeholder: "150", unit: "bpm" },
  { name: "oldpeak", label: "ST Depression (Oldpeak)", placeholder: "1.0", unit: "" },
];

const PredictionForm = () => {
  const { user, subscription, refreshSubscription } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const checkoutStatus = params.get("checkout");

  if (checkoutStatus !== "success" || !user) return;

  let attempts = 0;

  const run = async () => {
    attempts += 1;
    await refreshSubscription();
    if (attempts >= 10) {
      clearInterval(intervalId);
    }
  };

  run();
  const intervalId = setInterval(run, 2000);

  return () => clearInterval(intervalId);
}, [location.search, user, refreshSubscription]);

  const hasAccess = user && subscription.subscribed;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fd = new FormData(e.currentTarget);
    const body: Record<string, number> = {};
    for (const [key, val] of fd.entries()) {
      body[key] = parseFloat(val as string);
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach prediction server. Ensure the API is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200";

  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <section id="assessment" className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-reveal">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Risk Assessment
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Cardiovascular Risk Prediction
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter patient clinical data below. Our AI model will estimate heart disease probability and classify the risk level.
          </p>
        </div>

        {!hasAccess ? (
          <SubscriptionGate />
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="gradient-card rounded-3xl border border-border/60 shadow-xl shadow-primary/5 p-6 md:p-10 animate-reveal"
              style={{ animationDelay: "100ms" }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8">
                {numberFields.map((f) => (
                  <div key={f.name}>
                    <label htmlFor={f.name} className={labelClass}>
                      {f.label}{" "}
                      {f.unit && (
                        <span className="text-muted-foreground font-normal">({f.unit})</span>
                      )}
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type="number"
                      step="any"
                      required
                      placeholder={f.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-10">
                {Object.entries(selectFields).map(([name, options]) => (
                  <div key={name}>
                    <label htmlFor={name} className={labelClass}>
                      {name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                    <select
                      id={name}
                      name={name}
                      required
                      defaultValue=""
                      className={inputClass + " appearance-none cursor-pointer"}
                    >
                      <option value="" disabled>
                        Select…
                      </option>
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  disabled={loading}
                  className="min-w-[220px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing…
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" /> Predict Risk
                    </>
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-center text-sm text-destructive animate-reveal">
                {error}
              </div>
            )}

            {result && <ResultsPanel result={result} />}
          </>
        )}
      </div>
    </section>
  );
};

export default PredictionForm;