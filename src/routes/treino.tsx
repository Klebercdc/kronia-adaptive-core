import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExercisePickerSheet } from "@/components/ExercisePickerSheet";
import { RestTimer } from "@/components/RestTimer";
import { useActiveSession } from "@/hooks/use-workout";
import { findExercise, GROUP_LABELS } from "@/lib/exercises";
import {
  addExerciseToSession,
  addSet,
  bestSetFor,
  cancelSession,
  finishSession,
  oneRepMax,
  removeExerciseFromSession,
  removeSet,
  startSession,
  TEMPLATES,
  updateSet,
} from "@/lib/workout";
import { Check, Plus, Timer as TimerIcon, Trash2, Trophy, X } from "lucide-react";

export const Route = createFileRoute("/treino")({
  head: () => ({
    meta: [
      { title: "KRONIA — Treino" },
      { name: "description", content: "Registre seu treino com carga, repetições e RPE." },
    ],
  }),
  component: TreinoPage,
});

function TreinoPage() {
  const session = useActiveSession();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  if (!session) {
    return (
      <AppShell>
        <header className="mb-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Treino</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Começar agora</h1>
          <p className="text-sm text-muted-foreground mt-1">Escolha um modelo ou inicie do zero.</p>
        </header>

        <div className="space-y-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                startSession(t.name);
                t.exerciseIds.forEach((id) => addExerciseToSession(id));
              }}
              className="w-full glass-elevated rounded-2xl p-5 text-left active:scale-[0.99] transition"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Modelo</div>
              <div className="mt-1 text-lg font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t.exerciseIds.length} exercícios
              </div>
            </button>
          ))}

          <button
            onClick={() => startSession("Treino livre")}
            className="w-full glass rounded-2xl p-5 text-left active:scale-[0.99] transition"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Em branco</div>
            <div className="mt-1 text-lg font-semibold">Treino livre</div>
            <div className="text-xs text-muted-foreground mt-1">Adicione seus exercícios</div>
          </button>
        </div>
      </AppShell>
    );
  }

  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = session.exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.done).length,
    0,
  );
  const progress = totalSets ? (doneSets / totalSets) * 100 : 0;
  const elapsedMin = Math.floor((Date.now() - session.startedAt) / 60000);

  return (
    <AppShell>
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Em andamento</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight truncate">{session.name}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {elapsedMin} min · {doneSets}/{totalSets} séries
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Cancelar treino atual?")) cancelSession();
          }}
          className="h-9 w-9 rounded-xl glass flex items-center justify-center shrink-0"
          aria-label="Cancelar"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="h-1.5 rounded-full bg-[color:var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[color:var(--glow-soft)] to-[color:var(--glow)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="mt-5 space-y-4">
        {session.exercises.map((se) => {
          const ex = findExercise(se.exerciseId);
          if (!ex) return null;
          const best = bestSetFor(se.exerciseId);
          return (
            <article key={se.exerciseId} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-medium truncate">{ex.name}</h3>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {GROUP_LABELS[ex.group]} · {ex.equipment}
                  </div>
                </div>
                <button
                  onClick={() => removeExerciseFromSession(se.exerciseId)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {best && (
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-[color:var(--glow)]">
                  <Trophy className="h-3 w-3" /> melhor: {best.weight}kg × {best.reps} · 1RM {best.oneRM}kg
                </div>
              )}

              <div className="mt-3 grid grid-cols-[20px_1fr_1fr_1fr_28px_32px] gap-x-2 gap-y-1.5 items-center text-[11px] text-muted-foreground">
                <div></div>
                <div className="text-center">kg</div>
                <div className="text-center">reps</div>
                <div className="text-center">RPE</div>
                <div></div>
                <div></div>
                {se.sets.map((s, i) => (
                  <SetRow
                    key={i}
                    index={i}
                    set={s}
                    onChange={(p) => updateSet(se.exerciseId, i, p)}
                    onDone={() => {
                      const rpeOk = s.weight > 0 && s.reps > 0;
                      if (!s.done && rpeOk) setTimerOpen(true);
                      updateSet(se.exerciseId, i, { done: !s.done });
                    }}
                    onRemove={() => removeSet(se.exerciseId, i)}
                  />
                ))}
              </div>

              <button
                onClick={() => addSet(se.exerciseId)}
                className="mt-3 w-full rounded-xl py-2 text-xs glass flex items-center justify-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar série
              </button>
            </article>
          );
        })}

        <button
          onClick={() => setPickerOpen(true)}
          className="w-full glass-elevated rounded-2xl p-4 flex items-center justify-center gap-2 text-sm ring-glow"
        >
          <Plus className="h-4 w-4" /> Adicionar exercício
        </button>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={() => setTimerOpen((v) => !v)}
          className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm"
        >
          <TimerIcon className="h-4 w-4" /> Descanso
        </button>
        <button
          onClick={() => {
            const done = finishSession();
            if (done) alert(`Treino salvo! Volume: ${done.totalVolume.toLocaleString("pt-BR")} kg`);
          }}
          disabled={doneSets === 0}
          className="rounded-2xl py-3 text-sm bg-[color:var(--glow)]/20 text-foreground disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" /> Finalizar
        </button>
      </div>

      {pickerOpen && (
        <ExercisePickerSheet
          onClose={() => setPickerOpen(false)}
          onPick={(id) => addExerciseToSession(id)}
          excludeIds={session.exercises.map((e) => e.exerciseId)}
        />
      )}
      {timerOpen && <RestTimer onClose={() => setTimerOpen(false)} />}
    </AppShell>
  );
}

function SetRow({
  index,
  set,
  onChange,
  onDone,
  onRemove,
}: {
  index: number;
  set: { weight: number; reps: number; rpe?: number; done: boolean };
  onChange: (p: Partial<{ weight: number; reps: number; rpe?: number }>) => void;
  onDone: () => void;
  onRemove: () => void;
}) {
  const rm = oneRepMax(set.weight, set.reps);
  return (
    <>
      <div className="text-[11px] text-muted-foreground text-center">{index + 1}</div>
      <NumInput value={set.weight} onChange={(v) => onChange({ weight: v })} step={2.5} done={set.done} />
      <NumInput value={set.reps} onChange={(v) => onChange({ reps: v })} step={1} done={set.done} />
      <NumInput
        value={set.rpe ?? 0}
        onChange={(v) => onChange({ rpe: v || undefined })}
        step={0.5}
        max={10}
        done={set.done}
        placeholder="—"
      />
      <button
        onClick={onDone}
        className={`h-7 w-7 rounded-md flex items-center justify-center ${
          set.done ? "bg-[color:var(--glow)] text-black" : "glass"
        }`}
        aria-label="Concluir"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onRemove}
        className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground/60"
        aria-label="Remover série"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {rm > 0 && set.done && (
        <div className="col-span-6 text-[10px] text-muted-foreground/70 pl-6 -mt-1">
          ≈ 1RM {rm}kg
        </div>
      )}
    </>
  );
}

function NumInput({
  value,
  onChange,
  step = 1,
  max,
  done,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
  done?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      max={max}
      min={0}
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      placeholder={placeholder ?? "0"}
      className={`w-full rounded-lg px-2 py-1.5 text-sm text-center tabular-nums outline-none border ${
        done
          ? "bg-[color:var(--glow)]/10 border-[color:var(--glow)]/30 text-foreground"
          : "bg-transparent border-[color:var(--border)] text-foreground"
      }`}
    />
  );
}
