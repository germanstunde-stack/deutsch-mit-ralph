import { useRef, useState, useCallback } from "react";

export type SlotStatus = "pending" | "ok" | "no";

export interface ScoredRound {
  status: SlotStatus[];
  correct: number;
  wrong: number;
  /** Returns true if this call actually applied (first time for slot i). */
  resolve: (i: number, correct: number, wrong: number) => boolean;
  /** Marks every still-pending slot as wrong (weighted by weightOf). Returns the total wrong points added. */
  flushUnresolved: (weightOf: (i: number) => number) => number;
  reset: (size: number) => void;
}

/**
 * Tracks per-slot correct/wrong totals for a fixed-size round of exercises
 * (chapter practice or the exam), guaranteeing each slot resolves exactly once
 * and that leaving slots unanswered is always counted as wrong.
 */
export function useScoredRound(size: number): ScoredRound {
  const resolvedRef = useRef<boolean[]>(Array(size).fill(false));
  const [status, setStatus] = useState<SlotStatus[]>(() => Array(size).fill("pending"));
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const resolve = useCallback((i: number, c: number, w: number) => {
    if (resolvedRef.current[i]) return false;
    resolvedRef.current[i] = true;
    setStatus((s) => { const n = s.slice(); n[i] = w > 0 ? "no" : c > 0 ? "ok" : "pending"; return n; });
    if (c > 0) setCorrect((x) => x + c);
    if (w > 0) setWrong((x) => x + w);
    return true;
  }, []);

  const flushUnresolved = useCallback((weightOf: (i: number) => number) => {
    let added = 0;
    resolvedRef.current.forEach((done, i) => { if (!done) { const w = weightOf(i); if (resolve(i, 0, w)) added += w; } });
    return added;
  }, [resolve]);

  const reset = useCallback((n: number) => {
    resolvedRef.current = Array(n).fill(false);
    setStatus(Array(n).fill("pending"));
    setCorrect(0); setWrong(0);
  }, []);

  return { status, correct, wrong, resolve, flushUnresolved, reset };
}
