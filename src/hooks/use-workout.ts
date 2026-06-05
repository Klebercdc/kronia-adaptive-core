import { useEffect, useState } from "react";
import {
  getActiveSession,
  getHistory,
  subscribe,
  type ActiveSession,
  type CompletedSession,
} from "@/lib/workout";

export function useActiveSession(): ActiveSession | null {
  const [s, setS] = useState<ActiveSession | null>(null);
  useEffect(() => {
    setS(getActiveSession());
    return subscribe(() => setS(getActiveSession()));
  }, []);
  return s;
}

export function useHistory(): CompletedSession[] {
  const [h, setH] = useState<CompletedSession[]>([]);
  useEffect(() => {
    setH(getHistory());
    return subscribe(() => setH(getHistory()));
  }, []);
  return h;
}
