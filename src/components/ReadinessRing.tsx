type Props = {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
};

export function ReadinessRing({ value, size = 168, stroke = 10, label, sublabel }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="readiness" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--glow)" />
            <stop offset="100%" stopColor="var(--glow-soft)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#readiness)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-semibold tracking-tight text-glow">{value}</div>
        {label && <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{label}</div>}
        {sublabel && <div className="text-xs text-muted-foreground/80 mt-0.5">{sublabel}</div>}
      </div>
      <div className="absolute inset-0 rounded-full bg-[color:var(--glow)]/5 blur-2xl -z-10" />
    </div>
  );
}
