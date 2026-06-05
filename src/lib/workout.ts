// Workout state + history persisted in localStorage.
// Phase 1 — local only. Will migrate to Lovable Cloud later.

import { EXERCISES, findExercise, type MuscleGroup } from "./exercises";

export interface SetLog {
  weight: number; // kg
  reps: number;
  rpe?: number; // 1-10
  done: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  sets: SetLog[];
}

export interface ActiveSession {
  id: string;
  startedAt: number;
  name: string;
  exercises: SessionExercise[];
}

export interface CompletedSession {
  id: string;
  startedAt: number;
  finishedAt: number;
  name: string;
  exercises: SessionExercise[];
  totalVolume: number;
  totalSets: number;
}

const ACTIVE_KEY = "kronia:active-session";
const HISTORY_KEY = "kronia:history";

const isBrowser = typeof window !== "undefined";

// ---- storage helpers ----
function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}
function remove(key: string) {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

// ---- active session ----
export function getActiveSession(): ActiveSession | null {
  return read<ActiveSession | null>(ACTIVE_KEY, null);
}
export function setActiveSession(s: ActiveSession | null) {
  if (s) write(ACTIVE_KEY, s);
  else remove(ACTIVE_KEY);
  emit();
}
export function startSession(name: string): ActiveSession {
  const s: ActiveSession = {
    id: crypto.randomUUID(),
    startedAt: Date.now(),
    name,
    exercises: [],
  };
  setActiveSession(s);
  return s;
}
export function addExerciseToSession(exerciseId: string) {
  const s = getActiveSession();
  if (!s) return;
  if (s.exercises.find((e) => e.exerciseId === exerciseId)) return;
  s.exercises.push({
    exerciseId,
    sets: [{ weight: 0, reps: 0, done: false }],
  });
  setActiveSession(s);
}
export function removeExerciseFromSession(exerciseId: string) {
  const s = getActiveSession();
  if (!s) return;
  s.exercises = s.exercises.filter((e) => e.exerciseId !== exerciseId);
  setActiveSession(s);
}
export function addSet(exerciseId: string) {
  const s = getActiveSession();
  if (!s) return;
  const ex = s.exercises.find((e) => e.exerciseId === exerciseId);
  if (!ex) return;
  const last = ex.sets[ex.sets.length - 1];
  ex.sets.push({
    weight: last?.weight ?? 0,
    reps: last?.reps ?? 0,
    done: false,
  });
  setActiveSession(s);
}
export function updateSet(
  exerciseId: string,
  index: number,
  patch: Partial<SetLog>,
) {
  const s = getActiveSession();
  if (!s) return;
  const ex = s.exercises.find((e) => e.exerciseId === exerciseId);
  if (!ex || !ex.sets[index]) return;
  ex.sets[index] = { ...ex.sets[index], ...patch };
  setActiveSession(s);
}
export function removeSet(exerciseId: string, index: number) {
  const s = getActiveSession();
  if (!s) return;
  const ex = s.exercises.find((e) => e.exerciseId === exerciseId);
  if (!ex) return;
  ex.sets.splice(index, 1);
  if (ex.sets.length === 0) ex.sets.push({ weight: 0, reps: 0, done: false });
  setActiveSession(s);
}

// ---- finish + history ----
export function finishSession(): CompletedSession | null {
  const s = getActiveSession();
  if (!s) return null;
  const sets = s.exercises.flatMap((e) => e.sets.filter((x) => x.done));
  const totalVolume = sets.reduce((acc, x) => acc + x.weight * x.reps, 0);
  const completed: CompletedSession = {
    id: s.id,
    startedAt: s.startedAt,
    finishedAt: Date.now(),
    name: s.name,
    exercises: s.exercises
      .map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets.filter((x) => x.done),
      }))
      .filter((e) => e.sets.length > 0),
    totalVolume,
    totalSets: sets.length,
  };
  const history = getHistory();
  history.unshift(completed);
  write(HISTORY_KEY, history.slice(0, 200));
  setActiveSession(null);
  return completed;
}
export function cancelSession() {
  setActiveSession(null);
}
export function getHistory(): CompletedSession[] {
  return read<CompletedSession[]>(HISTORY_KEY, []);
}
export function clearHistory() {
  remove(HISTORY_KEY);
  emit();
}

// ---- analytics ----
// Brzycki 1RM
export function oneRepMax(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (36 / (37 - reps)));
}

export function bestSetFor(exerciseId: string): { weight: number; reps: number; oneRM: number } | null {
  const history = getHistory();
  let best: { weight: number; reps: number; oneRM: number } | null = null;
  for (const sess of history) {
    for (const e of sess.exercises) {
      if (e.exerciseId !== exerciseId) continue;
      for (const set of e.sets) {
        const rm = oneRepMax(set.weight, set.reps);
        if (!best || rm > best.oneRM) best = { weight: set.weight, reps: set.reps, oneRM: rm };
      }
    }
  }
  return best;
}

export function volumeByGroup(daysBack = 7): Record<MuscleGroup, number> {
  const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
  const totals = {} as Record<MuscleGroup, number>;
  for (const sess of getHistory()) {
    if (sess.finishedAt < cutoff) continue;
    for (const e of sess.exercises) {
      const ex = findExercise(e.exerciseId);
      if (!ex) continue;
      const v = e.sets.reduce((a, s) => a + s.weight * s.reps, 0);
      totals[ex.group] = (totals[ex.group] ?? 0) + v;
    }
  }
  return totals;
}

export function streakDays(): number {
  const history = getHistory();
  if (!history.length) return 0;
  const days = new Set(
    history.map((s) => new Date(s.finishedAt).toDateString()),
  );
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
}

// ---- subscriptions (cross-component reactivity) ----
type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit() {
  listeners.forEach((fn) => fn());
}
if (isBrowser) {
  window.addEventListener("storage", (e) => {
    if (e.key === ACTIVE_KEY || e.key === HISTORY_KEY) emit();
  });
}

// Suggested workout templates
export const TEMPLATES: { name: string; exerciseIds: string[] }[] = [
  {
    name: "Treino A — Empurrar",
    exerciseIds: ["supino-reto-barra", "desenvolvimento-halteres", "supino-inclinado-halteres", "elevacao-lateral", "triceps-corda", "triceps-frances"],
  },
  {
    name: "Treino B — Puxar",
    exerciseIds: ["barra-fixa", "remada-curvada", "puxada-frontal", "remada-baixa", "rosca-direta", "rosca-martelo"],
  },
  {
    name: "Treino C — Pernas",
    exerciseIds: ["agachamento-livre", "leg-press", "cadeira-extensora", "stiff", "mesa-flexora", "panturrilha-em-pe"],
  },
];

// Curated catalog re-export
export { EXERCISES };
