import { useMemo, useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { EXERCISES, GROUP_LABELS, type MuscleGroup } from "@/lib/exercises";

interface Props {
  onPick: (exerciseId: string) => void;
  onClose: () => void;
  excludeIds?: string[];
}

const GROUPS: ("todos" | MuscleGroup)[] = [
  "todos",
  "peito",
  "costas",
  "ombros",
  "biceps",
  "triceps",
  "quadriceps",
  "posterior",
  "gluteos",
  "panturrilha",
  "abdomen",
];

export function ExercisePickerSheet({ onPick, onClose, excludeIds = [] }: Props) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<"todos" | MuscleGroup>("todos");

  const filtered = useMemo(() => {
    return EXERCISES.filter((e) => {
      if (excludeIds.includes(e.id)) return false;
      if (group !== "todos" && e.group !== group) return false;
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, group, excludeIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full mx-auto max-w-md bg-[color:var(--background)] border-t border-[color:var(--border)] rounded-t-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold">Adicionar exercício</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-lg glass flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                group === g
                  ? "bg-[color:var(--glow)]/20 text-foreground"
                  : "glass text-muted-foreground"
              }`}
            >
              {g === "todos" ? "Todos" : GROUP_LABELS[g]}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 mt-2 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10">Nenhum exercício encontrado</div>
          )}
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                onPick(ex.id);
                onClose();
              }}
              className="w-full glass rounded-xl px-3 py-3 flex items-center justify-between gap-3 text-left"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{ex.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {GROUP_LABELS[ex.group]} · {ex.equipment}
                </div>
              </div>
              <Plus className="h-4 w-4 text-[color:var(--glow)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
