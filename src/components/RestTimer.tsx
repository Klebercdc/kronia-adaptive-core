import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer as TimerIcon, X } from "lucide-react";

const PRESETS = [60, 90, 120, 180];

export function RestTimer({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(true);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if ("vibrate" in navigator) navigator.vibrate?.(200);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  function pick(sec: number) {
    setDuration(sec);
    setRemaining(sec);
    setRunning(true);
  }
  function reset() {
    setRemaining(duration);
    setRunning(true);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = duration ? (remaining / duration) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-12 z-40 px-4 pb-4">
      <div className="mx-auto max-w-md glass-elevated rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <TimerIcon className="h-3.5 w-3.5" /> Descanso
          </div>
          <button onClick={onClose} aria-label="Fechar" className="h-7 w-7 rounded-lg glass flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-5xl font-semibold tabular-nums text-center tracking-tight">
          {mm}:{ss}
        </div>

        <div className="mt-3 h-1 rounded-full bg-[color:var(--border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--glow-soft)] to-[color:var(--glow)] transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => pick(p)}
              className={`rounded-xl py-2 text-xs ${
                duration === p ? "bg-[color:var(--glow)]/20 text-foreground" : "glass text-muted-foreground"
              }`}
            >
              {p < 60 ? `${p}s` : `${p / 60}'${p % 60 ? p % 60 : ""}`}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-xl py-2.5 glass flex items-center justify-center gap-2 text-sm"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pausar" : "Continuar"}
          </button>
          <button
            onClick={reset}
            className="rounded-xl py-2.5 glass flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
