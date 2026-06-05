import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen text-foreground">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
          transition={{ duration: 0.38, ease: [0.22, 0.8, 0.2, 1] }}
          className="mx-auto max-w-md px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-24"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
