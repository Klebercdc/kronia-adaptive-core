import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Dumbbell, UtensilsCrossed, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/treino", label: "Treino", icon: Dumbbell },
  { to: "/dieta", label: "Dieta", icon: UtensilsCrossed },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="glass-elevated rounded-2xl px-2 py-2 flex items-center justify-between">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors"
              >
                <div className="relative">
                  <Icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                    strokeWidth={active ? 2.2 : 1.6}
                  />
                  {active && (
                    <span className="absolute -inset-2 rounded-full bg-[color:var(--glow)]/15 blur-md -z-10" />
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-wide transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
