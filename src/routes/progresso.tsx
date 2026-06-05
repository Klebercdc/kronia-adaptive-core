import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "KRONIA — Progresso" },
      { name: "description", content: "Evolução, performance, aderência e recuperação." },
    ],
  }),
  component: ProgressoPage,
});

const series = [38, 42, 40, 48, 52, 50, 58, 62, 60, 68, 72, 70, 78, 82];

function Sparkline({ data }: { data: number[] }) {
  const w = 320;
  const h = 96;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  const area = `${d} L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--glow)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--glow)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#area)" />
      <path d={d} fill="none" stroke="var(--glow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressoPage() {
  return (
    <AppShell>
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Progresso</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sua curva</h1>
        <p className="text-sm text-muted-foreground mt-1">Últimas 14 sessões</p>
      </header>

      <section className="glass-elevated rounded-3xl p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Performance</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight text-glow">+18.4%</div>
          </div>
          <div className="text-right text-xs text-muted-foreground">vs ciclo anterior</div>
        </div>
        <div className="mt-4">
          <Sparkline data={series} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Aderência" value="94%" detail="28 de 30 dias" />
        <Stat label="Recuperação" value="Alta" detail="HRV 68 ms" />
        <Stat label="Volume" value="42.8 t" detail="semana" />
        <Stat label="Carga" value="6.4" detail="média semanal" />
      </section>

      <section className="mt-6 glass rounded-3xl p-5">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Marcos</div>
        <ul className="mt-3 space-y-3">
          {[
            { t: "PR · Supino 88 kg", d: "há 3 dias" },
            { t: "Sequência de 12 treinos", d: "esta semana" },
            { t: "Janela de recuperação otimizada", d: "ontem" },
          ].map((m) => (
            <li key={m.t} className="flex items-center justify-between">
              <span className="text-sm">{m.t}</span>
              <span className="text-xs text-muted-foreground">{m.d}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{detail}</div>
    </div>
  );
}
