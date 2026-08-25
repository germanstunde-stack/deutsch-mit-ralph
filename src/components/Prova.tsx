import { useEffect, useRef, useState } from "react";
import { allMcGens, shuffle, type Question } from "../data/generators";
import { gTypeColor, gTypeWeekday, gTypeCognate, gTypeNumber, type TypedQ } from "../data/exercises";
import { MultipleChoice } from "./MultipleChoice";
import { Exercise } from "./Engines";

type Mode = "com" | "sem";
type Item = { kind: "mc"; q: Question } | { kind: "typed"; q: TypedQ };
const KEY = "gs_prova_v1";
const N_MC = 8, N_TYPED = 4;
const TOTAL = N_MC + N_TYPED;

interface Result { date: string; mode: Mode; secs: number; nota: number; total: number; }

function loadResults(): Result[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function saveResult(r: Result) {
  const all = loadResults(); all.unshift(r);
  try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20))); } catch { /* ignore */ }
}

function buildProva(): Item[] {
  const mcGens = shuffle(allMcGens()).slice(0, N_MC);
  const mc: Item[] = mcGens.map((g) => ({ kind: "mc", q: g() }));
  const typedGens = [gTypeColor, gTypeWeekday, gTypeCognate, gTypeNumber];
  const typed: Item[] = shuffle(typedGens).slice(0, N_TYPED).map((g) => ({ kind: "typed", q: g() }));
  return shuffle([...mc, ...typed]);
}

function fmt(s: number) {
  const m = Math.floor(s / 60), ss = s % 60;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

export function Prova({ onFrost }: { onFrost: (on: boolean) => void }) {
  const [phase, setPhase] = useState<"locked" | "pick" | "running" | "done">("locked");
  const [mode, setMode] = useState<Mode>("com");
  const [items, setItems] = useState<Item[]>([]);
  const [secs, setSecs] = useState(0);
  const [nota, setNota] = useState(0);
  const [results, setResults] = useState<Result[]>(() => loadResults());
  const scored = useRef<number>(0);
  const answered = useRef<Set<number>>(new Set());
  const startAt = useRef<number>(0);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setSecs(Math.floor((Date.now() - startAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function begin(m: Mode) {
    setMode(m);
    setItems(buildProva());
    scored.current = 0; answered.current = new Set(); setNota(0);
    startAt.current = Date.now(); setSecs(0);
    setPhase("running");
    if (m === "sem") onFrost(true);
  }

  function record(i: number, correct: number) {
    if (answered.current.has(i)) return;
    answered.current.add(i);
    if (correct > 0) scored.current += 1;
  }

  function corrigir() {
    onFrost(false);
    const n = scored.current;
    setNota(n);
    const r: Result = {
      date: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      mode, secs, nota: n, total: TOTAL,
    };
    saveResult(r);
    setResults(loadResults());
    setPhase("done");
  }

  const pct = Math.round((100 * nota) / TOTAL);

  return (
    <section className="panel topic-sec prova" id="prova">
      <h2>📝 Prova A0</h2>

      {phase === "locked" && (
        <div className="prova-lock">
          <div className="frost">
            <div className="lockcard">
              <div className="big-emoji">🎓</div>
              <p>Prova final do A0 — {TOTAL} questões misturadas (múltipla escolha + escrever). O relógio corre até você clicar em <b>Corrigir</b>.</p>
              <button className="btn primary big" onClick={() => setPhase("pick")}>Começar a prova →</button>
            </div>
          </div>
        </div>
      )}

      {phase === "pick" && (
        <div className="prova-modal">
          <div className="mcard">
            <h3>Como você quer fazer?</h3>
            <div className="modes">
              <button className="modebtn com" onClick={() => begin("com")}>
                <span className="mi">📖</span><b>Com consulta</b>
                <small>Pode rolar e olhar os módulos acima enquanto responde.</small>
              </button>
              <button className="modebtn sem" onClick={() => begin("sem")}>
                <span className="mi">🙈</span><b>Sem consulta</b>
                <small>Os módulos ficam borrados. Só você e a memória!</small>
              </button>
            </div>
            <button className="btn ghost" onClick={() => setPhase("locked")}>Voltar</button>
          </div>
        </div>
      )}

      {(phase === "running" || phase === "done") && (
        <>
          <div className="prova-bar">
            <span className={"tag " + mode}>{mode === "sem" ? "🙈 Sem consulta" : "📖 Com consulta"}</span>
            <span className="clock">⏱️ {fmt(secs)}</span>
            {phase === "done" && <span className="notatag">Nota: <b>{nota}/{TOTAL}</b> · {pct}%</span>}
          </div>

          <div className={"prova-items" + (phase === "done" ? " locked" : "")}>
            {items.map((it, i) => (
              it.kind === "mc"
                ? <MultipleChoice key={i} q={it.q} num={i + 1} onResolve={(c) => record(i, c)} />
                : <Exercise key={i} spec={{ kind: "typed", gen: () => it.q }} num={i + 1} onResolve={(c) => record(i, c)} />
            ))}
          </div>

          {phase === "running" && (
            <div className="btnrow" style={{ marginTop: 12 }}>
              <button className="btn primary big" onClick={corrigir}>✅ Corrigir e ver a nota</button>
            </div>
          )}
          {phase === "done" && (
            <div className="prova-done">
              <div className="notabig">{pct}% <span>· {nota} de {TOTAL} · {fmt(secs)}</span></div>
              <div className="btnrow"><button className="btn primary" onClick={() => setPhase("pick")}>Fazer de novo 🔁</button></div>
            </div>
          )}
        </>
      )}

      {results.length > 0 && (
        <div className="desempenho">
          <div className="subhead">📊 Seu desempenho</div>
          <table className="dtab">
            <thead><tr><th>Quando</th><th>Modo</th><th>Tempo</th><th>Nota</th></tr></thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.mode === "sem" ? "🙈 sem" : "📖 com"}</td>
                  <td>{fmt(r.secs)}</td>
                  <td><b>{r.nota}/{r.total}</b> ({Math.round((100 * r.nota) / r.total)}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
