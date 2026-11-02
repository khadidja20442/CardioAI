interface PredictionResult {
  probability: number;
  risk_score: number;
  risk_label: string;
  risk_color: string;
  threshold: number;
}

const colorMap: Record<string, { bg: string; text: string; ring: string; bar: string }> = {
  green: { bg: "bg-cardio-success/10", text: "text-cardio-success", ring: "ring-cardio-success/30", bar: "bg-cardio-success" },
  yellow: { bg: "bg-cardio-warning/10", text: "text-cardio-warning", ring: "ring-cardio-warning/30", bar: "bg-cardio-warning" },
  red: { bg: "bg-cardio-danger/10", text: "text-cardio-danger", ring: "ring-cardio-danger/30", bar: "bg-cardio-danger" },
};

const interpretations: Record<string, string> = {
  green: "Based on the provided clinical parameters, the estimated cardiovascular risk is within a low range. Continued monitoring and healthy lifestyle practices are recommended.",
  yellow: "The analysis indicates a moderate cardiovascular risk. Further clinical evaluation and proactive lifestyle modifications may be advisable.",
  red: "The estimated risk is elevated. Comprehensive clinical assessment, diagnostic workup, and timely intervention are strongly recommended.",
};

const ResultsPanel = ({ result }: { result: PredictionResult }) => {
  const color = result.risk_color?.toLowerCase() || "green";
  const styles = colorMap[color] || colorMap.green;
  const pct = Math.round(result.probability * 100);

  return (
    <div className="mt-10 animate-reveal">
      <div className="gradient-card rounded-3xl border border-border/60 shadow-xl shadow-primary/5 p-6 md:p-10">
        <h3 className="font-display text-xl font-bold text-foreground text-center mb-8">
          Prediction Results
        </h3>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {/* Probability */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Probability</p>
            <p className={`font-display text-4xl font-bold ${styles.text}`}>{pct}%</p>
          </div>

          {/* Risk Score */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Risk Score</p>
            <p className="font-display text-4xl font-bold text-foreground tabular-nums">
              {result.risk_score?.toFixed(2)}
            </p>
          </div>

          {/* Risk Label */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Classification</p>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ring-1 ${styles.bg} ${styles.text} ${styles.ring}`}>
              {result.risk_label}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>0%</span>
            <span>Risk Level</span>
            <span>100%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${styles.bar} transition-all duration-700 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Threshold marker */}
          {result.threshold != null && (
            <div className="relative h-0">
              <div
                className="absolute -top-3 w-0.5 h-3 bg-foreground/40"
                style={{ left: `${result.threshold * 100}%` }}
              />
              <p
                className="absolute top-1 text-[10px] text-muted-foreground -translate-x-1/2"
                style={{ left: `${result.threshold * 100}%` }}
              >
                Threshold
              </p>
            </div>
          )}
        </div>

        {/* Interpretation */}
        <div className={`rounded-2xl ${styles.bg} p-5 mt-6`}>
          <p className="text-sm leading-relaxed text-foreground/80">
            <span className="font-semibold">Clinical Interpretation: </span>
            {interpretations[color] || interpretations.green}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
