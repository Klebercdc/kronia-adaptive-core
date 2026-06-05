import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { useHistory } from "@/hooks/use-workout";
import { findExercise, GROUP_LABELS, type MuscleGroup } from "@/lib/exercises";
import { streakDays, volumeByGroup } from "@/lib/workout";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "KRONIA — Progresso" },
      { name: "description", content: "Evolução, performance e histórico de treinos." },
    ],
  }),
  component: ProgressoPage,
});

function Sparkline({ data }: { data: number[] }) {
  const w = 320;
  const h = 96;
  if (data.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center text-xs text-muted-foreground">
        Treine ao menos 2 vezes para ver sua curva
      </div>
    );
  }
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
  const history = useHistory();

  const stats = useMemo(() => {
    const last14 = history.slice(0, 14).reverse();
    const series = last14.map((s) => Math.round(s.totalVolume));
    const weekCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const week = history.filter((s) => s.finishedAt >= weekCutoff);
    const weekVolume = week.reduce((a, s) => a + s.totalVolume, 0);
    const groupVol = volumeByGroup(7);

    // PRs (best 1RM per exercise from all history)
    const prByExercise = new Map<string, { weight: number; reps: number; oneRM: number; date: number }>();
    for (const sess of history) {
      for (const e of sess.exercises) {
        for (const set of e.sets) {
          if (set.weight <= 0 || set.reps <= 0) continue;
          const rm = Math.round(set.weight * (36 / (37 - set.reps)));
          const prev = prByExercise.get(e.exerciseId);
          if (!prev || rm > prev.oneRM) {
            prByExercise.set(e.exerciseId, { weight: set.weight, reps: set.reps, oneRM: rm, date: sess.finishedAt });
          }
        }
      }
    }
    const prs = [...prByExercise.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    return { series, weekVolume, weekSessions: week.length, groupVol, prs };
  }, [history]);

  const totalGroupVol = Object.values(stats.groupVol).reduce((a, b) => a + b, 0);

  return (
    <AppShell>
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Progresso</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sua curva</h1>
        <p className="text-sm text-muted-foreground mt-1">Últimas {Math.min(history.length, 14)} sessões</p>
      </header>

      <section className="glass-elevated rounded-3xl p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Volume da semana</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight text-glow">
              {(stats.weekVolume / 1000).toFixed(1)} t
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">{stats.weekSessions} sessões</div>
        </div>
        <div className="mt-4">
          <Sparkline data={stats.series} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Treinos" value={String(history.length)} detail="total registrado" />
        <Stat label="Sequência" value={`${streakDays()} d`} detail="streak atual" />
        <Stat
          label="Volume"
          value={`${(stats.weekVolume / 1000).toFixed(1)} t`}
          detail="últimos 7 dias"
        />
        <Stat
          label="Frequência"
          value={`${stats.weekSessions}×`}
          detail="esta semana"
        />
      </section>

      {totalGroupVol > 0 && (
        <section className="mt-6 glass rounded-3xl p-5">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Volume por grupo · 7 dias
          </div>
          <ul className="mt-3 space-y-2.5">
            {(Object.entries(stats.groupVol) as [MuscleGroup, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([g, v]) => {
                const pct = (v / totalGroupVol) * 100;
                return (
                  <li key={g}>
                    <div className="flex items-center justify-between text-xs">
                      <span>{GROUP_LABELS[g]}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {(v / 1000).toFixed(1)} t
                      </span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-[color:var(--border)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[color:var(--glow)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      )}

      <section className="mt-6 glass rounded-3xl p-5">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
          <Trophy className="h-3 w-3" /> Recordes pessoais
        </div>
        {stats.prs.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Conclua um treino para registrar seu primeiro PR.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {stats.prs.map((pr) => {
              const ex = findExercise(pr.id);
              return (
                <li key={pr.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm truncate">{ex?.name ?? pr.id}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {pr.weight}kg × {pr.reps} · 1RM {pr.oneRM}kg
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-3">
                    {new Date(pr.date).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
          Histórico
        </div>
        {history.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-sm text-muted-foreground text-center">
            Nenhum treino registrado ainda.
          </div>
        ) : (
          <ul className="space-y-2">
            {history.slice(0, 20).map((sess) => (
              <li key={sess.id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{sess.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(sess.finishedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      ·{" "}
                      {Math.round((sess.finishedAt - sess.startedAt) / 60000)} min · {sess.totalSets} séries
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm tabular-nums">
                      {(sess.totalVolume / 1000).toFixed(1)} t
                    </div>
                    <div className="text-[10px] text-muted-foreground">volume</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
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
