import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Replace, Timer, Check, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/treino")({
  head: () => ({
    meta: [
      { title: "KRONIA — Treino" },
      { name: "description", content: "Treino do dia adaptado pela IA Kronia." },
    ],
  }),
  component: TreinoPage,
});

const exercises = [
  { name: "Supino reto com halteres", sets: "4 × 8–10", rest: "90s", load: "32 kg", adapted: true },
  { name: "Desenvolvimento militar", sets: "4 × 8", rest: "90s", load: "26 kg" },
  { name: "Crucifixo inclinado", sets: "3 × 12", rest: "60s", load: "14 kg" },
  { name: "Elevação lateral", sets: "4 × 12", rest: "45s", load: "10 kg" },
  { name: "Tríceps corda", sets: "3 × 12", rest: "60s", load: "22 kg" },
  { name: "Tríceps francês", sets: "3 × 10", rest: "60s", load: "16 kg" },
];

function TreinoPage() {
  const completed = 2;
  const progress = (completed / exercises.length) * 100;
  return (
    <AppShell>
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Treino A · Empurrar</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sessão de hoje</h1>
        <p className="text-sm text-muted-foreground mt-1">48 min estimados · intensidade calibrada</p>
      </header>

      {/* Progress bar */}
      <section className="glass-elevated rounded-3xl p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-[0.2em] text-muted-foreground">Progresso</span>
          <span className="text-foreground/80">{completed}/{exercises.length}</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-[color:var(--border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--glow-soft)] to-[color:var(--glow)] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--glow)]" />
          Kronia reduziu o volume em 12% por baixa recuperação detectada.
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {exercises.map((ex, i) => {
          const done = i < completed;
          return (
            <article
              key={ex.name}
              className={`glass rounded-2xl p-4 transition-all ${done ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {ex.adapted && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--glow)]/15 text-[color:var(--glow)] tracking-wider">
                        ADAPTADO
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-base font-medium truncate">{ex.name}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{ex.sets}</span>
                    <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {ex.rest}</span>
                    <span>{ex.load}</span>
                  </div>
                </div>
                <button
                  aria-label="Substituir"
                  className="h-9 w-9 rounded-xl glass flex items-center justify-center"
                >
                  <Replace className="h-4 w-4" />
                </button>
              </div>
              {done ? (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[color:var(--glow)]">
                  <Check className="h-3.5 w-3.5" /> concluído
                </div>
              ) : (
                <button className="mt-3 w-full flex items-center justify-between rounded-xl px-3 py-2 bg-[color:var(--accent)] text-sm">
                  Iniciar série
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
