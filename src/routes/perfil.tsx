import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChevronRight, Sparkles, Activity, Settings, Shield, Bell } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "KRONIA — Perfil" },
      { name: "description", content: "Preferências, IA e biomarcadores." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  return (
    <AppShell>
      <header className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Perfil</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kleber</h1>
          <p className="text-sm text-muted-foreground mt-1">Plano Kronia · ciclo 4</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="glass-elevated rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[color:var(--glow)]/15 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Inteligência Kronia
        </div>
        <p className="mt-3 text-base leading-relaxed">
          Sua IA está aprendendo seus padrões de treino e recuperação para ajustar a carga antes do tempo. <span className="text-glow">3 adaptações</span> nas últimas 24h.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Mini label="Modelo" value="adaptativo v2" />
          <Mini label="Confiança" value="87%" />
        </div>
      </section>

      <section className="mt-6 space-y-2">
        <Group title="Preferências">
          <Item icon={<Bell className="h-4 w-4" />} label="Notificações inteligentes" right="ativadas" />
          <Item icon={<Settings className="h-4 w-4" />} label="Unidades" right="kg · kcal" />
        </Group>

        <Group title="Biomarcadores">
          <Item icon={<Activity className="h-4 w-4" />} label="HRV (opcional)" right="conectar" />
          <Item icon={<Activity className="h-4 w-4" />} label="Glicemia (opcional)" right="conectar" />
        </Group>

        <Group title="Conta">
          <Item icon={<Shield className="h-4 w-4" />} label="Privacidade e dados" />
          <Item icon={<Settings className="h-4 w-4" />} label="Configurações avançadas" />
        </Group>
      </section>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Kronia · sistema adaptativo
      </p>
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-medium">{value}</div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-1 mt-4 mb-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
      <div className="glass rounded-2xl overflow-hidden divide-y divide-[color:var(--border)]">
        {children}
      </div>
    </div>
  );
}

function Item({ icon, label, right }: { icon: React.ReactNode; label: string; right?: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-[color:var(--accent)]/40 transition-colors">
      <span className="h-8 w-8 rounded-lg glass flex items-center justify-center">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      {right && <span className="text-xs text-muted-foreground">{right}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
