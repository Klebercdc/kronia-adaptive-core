import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Dumbbell, UtensilsCrossed, User } from "lucide-react";

const items = [
  { to: "/hoje", label: "Hoje", icon: Home },
  { to: "/treino", label: "Treino", icon: Dumbbell },
  { to: "/dieta", label: "Dieta", icon: UtensilsCrossed },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--border)]"
      style={{
        background: "color-mix(in oklch, var(--background) 78%, transparent)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto max-w-md px-2">
        <div className="flex items-center justify-between h-12">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full"
              >
                <div className="relative">
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors duration-300 ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                    strokeWidth={active ? 2.2 : 1.6}
                  />
                  {active && (
                    <span className="absolute -inset-1.5 rounded-full bg-[color:var(--glow)]/15 blur-md -z-10" />
                  )}
                </div>
                <span
                  className={`text-[9px] tracking-[0.08em] transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-full bg-[color:var(--glow)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
