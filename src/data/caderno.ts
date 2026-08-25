// Caderno de difíceis — palavras que o usuário erra voltam mais. localStorage (sem login).
export type HardMap = Record<string, { pt: string; n: number }>;
const KEY = "gs_hard_v1";
let listeners: Array<() => void> = [];

export function loadHard(): HardMap {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function save(h: HardMap) {
  try { localStorage.setItem(KEY, JSON.stringify(h)); } catch { /* ignore */ }
  listeners.forEach((f) => f());
}
export function addHard(w?: string, pt?: string) {
  if (!w) return;
  const h = loadHard();
  if (!h[w]) h[w] = { pt: pt || "", n: 0 };
  h[w].n = Math.min(6, (h[w].n || 0) + 2);
  if (pt) h[w].pt = pt;
  save(h);
}
export function easeHard(w?: string) {
  if (!w) return;
  const h = loadHard();
  if (h[w]) { h[w].n -= 1; if (h[w].n <= 0) delete h[w]; save(h); }
}
export function removeHard(w: string) { const h = loadHard(); delete h[w]; save(h); }
export function subscribe(f: () => void) { listeners.push(f); return () => { listeners = listeners.filter((x) => x !== f); }; }
