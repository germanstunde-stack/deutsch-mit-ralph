import { useEffect, useRef, useState } from "react";
import { examSpecsA0, EXAM_PARTS, EXAM_TOTAL, type ExSpec } from "../data/exercises";
import { Exercise } from "./Engines";
import type { ExamHandle } from "./examTypes";
import { usePlayer } from "../auth/AuthProvider";
import { supabase } from "../lib/supabase";

type Mode = "com" | "sem";
const KEY = "gs_prova_v1";

interface Result { date: string; mode: Mode; secs: number; nota: number; total: number; }

function loadResults(): Result[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function saveResult(r: Result) {
  const all = loadResults(); all.unshift(r);
  try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20))); } catch { /* ignore */ }
}

function fmt(s: number) {
  const m = Math.floor(s / 60), ss = s % 60;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

const noop = () => {};

export function Prova({ onFrost }: { onFrost: (on: boolean) => void }) {
  const { session } = usePlayer();
  const [phase, setPhase] = useState<"locked" | "pick" | "running" | "done">("locked");
  const [mode, setMode] = useState<Mode>("com");
  const [items, setItems] = useState<ExSpec[]>([]);
  const [secs, setSecs] = useState(0);
  const [nota, setNota] = useState(0);
  const [results, setResults] = useState<Result[]>(() => loadResults());
  const itemRefs = useRef<Array<ExamHandle | null>>([]);
  const startAt = useRef<number>(0);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setSecs(Math.floor((Date.now() - startAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function begin(m: Mode) {
    setMode(m);
    setItems(examSpecsA0());
    itemRefs.current = [];
    setNota(0);
    startAt.current = Date.now(); setSecs(0);
    setPhase("running");
    if (m === "sem") onFrost(true);
  }

  function corrigir() {
    onFrost(false);
    let earned = 0;
    itemRefs.current.forEach((h) => { if (h) earned += h.getScore().correct; });
    itemRefs.current.forEach((h) => h?.reveal());
    setNota(earned);
    const r: Result = {
      date: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      mode, secs, nota: earned, total: EXAM_TOTAL,
    };
    saveResult(r);
    setResults(loadResults());
    setPhase("done");
    if (session) {
      supabase.from("exam_results").insert({
        user_id: session.user.id, module: "A0",
        mode: mode === "sem" ? "sem_consulta" : "com_consulta",
        score: earned, total: EXAM_TOTAL, duration_sec: secs,
      }).then(({ error }) => { if (error) console.warn("ranking (provas):", error.message); });
    }
  }

  const pct = Math.round((100 * nota) / EXAM_TOTAL);

  // índice inicial de cada parte, a partir das contagens em EXAM_PARTS (20 / 10 / 4)
  let cursor = 0;
  const partStarts = EXAM_PARTS.map((p) => { const start = cursor; cursor += p.count; return start; });

  return (
    <section className="panel topic-sec prova" id="prova">
      <h2>📝 Prova A0</h2>

      {phase === "locked" && (
        <div className="prova-lock">
          <div className="frost">
            <div className="lockcard">
              <div className="big-emoji">🎓</div>
              <p>Prova final do A0 — {EXAM_TOTAL} pontos em 3 partes (múltipla escolha, escrever/ditado e interativas). Nada é revelado até você clicar em <b>Corrigir</b> no final — o relógio corre até lá.</p>
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
            {phase === "done" && <span className="notatag">Nota: <b>{nota}/{EXAM_TOTAL}</b> · {pct}%</span>}
          </div>

          <div className={"prova-items" + (phase === "done" ? " locked" : "")}>
            {EXAM_PARTS.map((part, pi) => (
              <div key={pi}>
                <div className="exam-sec">{part.label}</div>
                {items.slice(partStarts[pi], partStarts[pi] + part.count).map((it, j) => {
                  const i = partStarts[pi] + j;
                  return (
                    <Exercise key={i} spec={it} num={i + 1} mode="exam" onResolve={noop}
                      ref={(el) => { itemRefs.current[i] = el; }} />
                  );
                })}
              </div>
            ))}
          </div>

          {phase === "running" && (
            <div className="btnrow" style={{ marginTop: 12 }}>
              <button className="btn primary big" onClick={corrigir}>✅ Corrigir e ver a nota</button>
            </div>
          )}
          {phase === "done" && (
            <div className="prova-done">
              <div className="notabig">{pct}% <span>· {nota} de {EXAM_TOTAL} · {fmt(secs)}</span></div>
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
