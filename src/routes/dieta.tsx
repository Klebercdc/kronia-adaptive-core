import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/dieta")({
  head: () => ({
    meta: [
      { title: "KRONIA — Nutrição" },
      { name: "description", content: "Plano nutricional rebalanceado em tempo real." },
    ],
  }),
  component: DietaPage,
});

const meals = [
  { time: "07:30", name: "Café reforçado", kcal: 620, p: 42, c: 70, g: 18, done: true },
  { time: "12:00", name: "Almoço", kcal: 780, p: 58, c: 86, g: 22, done: true },
  { time: "16:00", name: "Pré-treino", kcal: 380, p: 28, c: 52, g: 8, done: false, adapted: true },
  { time: "20:30", name: "Jantar", kcal: 700, p: 70, c: 52, g: 30, done: false },
];

function DietaPage() {
  const target = 2480;
  const consumed = 1400;
  const pct = (consumed / target) * 100;
  return (
    <AppShell>
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Nutrição</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Plano de hoje</h1>
      </header>

      {/* Hero kcal */}
      <section className="glass-elevated rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[color:var(--glow)]/10 blur-3xl pointer-events-none" />
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Calorias</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight text-glow">{consumed.toLocaleString("pt-BR")}</span>
              <span className="text-sm text-muted-foreground">/ {target.toLocaleString("pt-BR")} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Restante</div>
            <div className="mt-2 text-2xl font-medium">{(target - consumed).toLocaleString("pt-BR")}</div>
          </div>
        </div>
        <div className="mt-5 h-1.5 rounded-full bg-[color:var(--border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--glow-soft)] to-[color:var(--glow)] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Macro label="Proteína" value={128} target={198} />
          <Macro label="Carbo" value={158} target={260} />
          <Macro label="Gordura" value={48} target={78} />
        </div>
        <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--glow)]" />
          Kronia adicionou 180 kcal ao pré-treino por baixa disponibilidade energética.
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {meals.map((m) => (
          <article key={m.time} className={`glass rounded-2xl p-4 ${m.done ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] tracking-[0.18em] text-muted-foreground">{m.time}</span>
                  {m.adapted && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--glow)]/15 text-[color:var(--glow)] tracking-wider">
                      REBALANCEADO
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-base font-medium">{m.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">
                  {m.kcal} kcal · P {m.p} · C {m.c} · G {m.g}
                </div>
              </div>
              <button
                aria-label="Adicionar"
                className="h-9 w-9 rounded-xl glass flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

function Macro({ label, value, target }: { label: string; value: number; target: number }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight">{value}<span className="text-xs text-muted-foreground font-normal">/{target}g</span></div>
      <div className="mt-2 h-1 rounded-full bg-[color:var(--border)] overflow-hidden">
        <div className="h-full rounded-full bg-[color:var(--glow)]/80" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
