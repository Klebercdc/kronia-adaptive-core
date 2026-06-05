import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ReadinessRing } from "@/components/ReadinessRing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandMark } from "@/components/BrandMark";
import { Sparkles, Dumbbell, Apple, Moon, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRONIA — Hoje" },
      { name: "description", content: "Seu sistema adaptou hoje. Treino, nutrição e recuperação calibrados pela IA." },
    ],
  }),
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function HomePage() {
  return (
    <AppShell>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <BrandMark size={30} />
          <ThemeToggle />
        </div>
        <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--glow)] animate-pulse-soft" />
          Sistema ativo · recalibrado há 14 min
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {greeting()}, <span className="text-glow">Kleber</span>
        </h1>
      </header>

      {/* Adaptation card */}
      <section className="glass-elevated rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[color:var(--glow)]/15 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Adaptação de hoje
        </div>
        <h2 className="text-2xl font-semibold mt-3 leading-tight">
          Seu sistema adaptou <br /> sua rotina para <span className="text-glow">recuperação ativa</span>.
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <AdaptCell icon={<Dumbbell className="h-4 w-4" />} label="Treino" value="-12%" hint="volume" />
          <AdaptCell icon={<Apple className="h-4 w-4" />} label="Nutrição" value="+180" hint="kcal" />
          <AdaptCell icon={<Moon className="h-4 w-4" />} label="Recuperação" value="Alta" hint="prioridade" />
        </div>
      </section>

      {/* Readiness */}
      <section className="mt-6 glass rounded-3xl p-6 flex items-center gap-6">
        <ReadinessRing value={82} label="Prontidão" sublabel="ótima" />
        <div className="flex-1 space-y-3">
          <Metric label="HRV" value="68 ms" trend="+4" />
          <Metric label="Sono" value="7h 42" trend="+0:18" />
          <Metric label="Carga" value="6.4" trend="-0.3" />
        </div>
      </section>

      {/* Summary */}
      <section className="mt-6">
        <SectionTitle>Resumo do dia</SectionTitle>
        <ul className="mt-3 space-y-2">
          <Row title="Treino A — Empurrar" meta="48 min · 6 exercícios" />
          <Row title="Nutrição" meta="2.480 kcal · P 198 / C 260 / G 78" />
          <Row title="Janela de sono" meta="23:10 → 06:50" />
        </ul>
      </section>

      <Link
        to="/treino"
        className="mt-8 w-full flex items-center justify-between glass-elevated rounded-2xl px-5 py-4 ring-glow transition-transform active:scale-[0.99]"
      >
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Próximo passo</div>
          <div className="text-base font-medium mt-0.5">Continuar — iniciar treino</div>
        </div>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </AppShell>
  );
}

function AdaptCell({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold tracking-tight">{value}</div>
      <div className="text-[10px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  const positive = trend.startsWith("+");
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className="text-base font-medium">{value}</span>
        <span className={`text-[11px] ${positive ? "text-[color:var(--glow)]" : "text-muted-foreground"}`}>{trend}</span>
      </span>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{children}</span>
      <span className="flex-1 hairline" />
    </div>
  );
}

function Row({ title, meta }: { title: string; meta: string }) {
  return (
    <li className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{meta}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </li>
  );
}
