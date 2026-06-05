import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-foreground">
      <div className="mx-auto max-w-md px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-32 animate-float-in">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
