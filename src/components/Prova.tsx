import { useEffect, useRef, useState } from "react";
import type { ModuleDef } from "../data/modules";
import type { ExSpec } from "../data/exercises";
import { Exercise } from "./Engines";
import type { ExamHandle } from "./examTypes";
import { usePlayer } from "../auth/AuthProvider";
import { useI18n } from "../i18n/I18nProvider";
import { supabase } from "../lib/supabase";

type Mode = "com" | "sem";

interface Result { date: string; mode: Mode; secs: number; nota: number; total: number; }

function loadResults(key: string): Result[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function saveResult(key: string, r: Result) {
  const all = loadResults(key); all.unshift(r);
  try { localStorage.setItem(key, JSON.stringify(all.slice(0, 20))); } catch { /* ignore */ }
}

function fmt(s: number) {
  const m = Math.floor(s / 60), ss = s % 60;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

const noop = () => {};

export function Prova({ mod, onFrost, onSaved }: { mod: ModuleDef; onFrost: (on: boolean) => void; onSaved?: () => void }) {
  const { session } = usePlayer();
  const { lang, t } = useI18n();
  const storageKey = `gs_prova_v1:${mod.id}`;
  const [phase, setPhase] = useState<"locked" | "pick" | "running" | "done">("locked");
  const [mode, setMode] = useState<Mode>("com");
  const [items, setItems] = useState<ExSpec[]>([]);
  const [secs, setSecs] = useState(0);
  const [nota, setNota] = useState(0);
  const [results, setResults] = useState<Result[]>(() => loadResults(storageKey));
  const itemRefs = useRef<Array<ExamHandle | null>>([]);
  const startAt = useRef<number>(0);

  // troca de módulo (ou o "locked" reinicial): volta ao estado travado e recarrega o
  // histórico daquele módulo específico.
  useEffect(() => {
    setPhase("locked");
    setResults(loadResults(storageKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod.id]);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => setSecs(Math.floor((Date.now() - startAt.current) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  function begin(m: Mode) {
    setMode(m);
    setItems(mod.examSpecsFor(lang));
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
      mode, secs, nota: earned, total: mod.examTotal,
    };
    saveResult(storageKey, r);
    setResults(loadResults(storageKey));
    setPhase("done");
    if (session) {
      supabase.from("exam_results").insert({
        user_id: session.user.id, module: mod.id,
        mode: mode === "sem" ? "sem_consulta" : "com_consulta",
        score: earned, total: mod.examTotal, duration_sec: secs,
      }).then(({ error }) => {
        if (error) console.warn("ranking (provas):", error.message);
        else onSaved?.();
      });
    }
  }

  const pct = Math.round((100 * nota) / mod.examTotal);
  const examParts = mod.examPartsFor(lang);

  // índice inicial de cada parte, a partir das contagens de examParts
  let cursor = 0;
  const partStarts = examParts.map((p) => { const start = cursor; cursor += p.count; return start; });

  return (
    <section className="panel topic-sec prova" id="prova">
      <h2>{t("exam_title", { module: mod.id })}</h2>

      {phase === "locked" && (
        <div className="prova-lock">
          <div className="frost">
            <div className="lockcard">
              <div className="big-emoji">🎓</div>
              <p>{t("exam_lock_desc", { module: mod.id, total: mod.examTotal })}</p>
              <button className="btn primary big" onClick={() => setPhase("pick")}>{t("exam_start_btn")}</button>
            </div>
          </div>
        </div>
      )}

      {phase === "pick" && (
        <div className="prova-modal">
          <div className="mcard">
            <h3>{t("exam_pick_title")}</h3>
            <div className="modes">
              <button className="modebtn com" onClick={() => begin("com")}>
                <span className="mi">📖</span><b>{t("exam_mode_com_title")}</b>
                <small>{t("exam_mode_com_desc")}</small>
              </button>
              <button className="modebtn sem" onClick={() => begin("sem")}>
                <span className="mi">🙈</span><b>{t("exam_mode_sem_title")}</b>
                <small>{t("exam_mode_sem_desc")}</small>
              </button>
            </div>
            <button className="btn ghost" onClick={() => setPhase("locked")}>{t("exam_back_btn")}</button>
          </div>
        </div>
      )}

      {(phase === "running" || phase === "done") && (
        <>
          <div className="prova-bar">
            <span className={"tag " + mode}>{mode === "sem" ? t("exam_mode_sem_tag") : t("exam_mode_com_tag")}</span>
            <span className="clock">⏱️ {fmt(secs)}</span>
            {phase === "done" && <span className="notatag">{t("exam_score_label")} <b>{nota}/{mod.examTotal}</b> · {pct}%</span>}
          </div>

          <div className={"prova-items" + (phase === "done" ? " locked" : "")}>
            {examParts.map((part, pi) => (
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
              <button className="btn primary big" onClick={corrigir}>{t("exam_correct_btn")}</button>
            </div>
          )}
          {phase === "done" && (
            <div className="prova-done">
              <div className="notabig">{pct}% <span>· {nota} de {mod.examTotal} · {fmt(secs)}</span></div>
              <div className="btnrow"><button className="btn primary" onClick={() => setPhase("pick")}>{t("exam_retry_btn")}</button></div>
            </div>
          )}
        </>
      )}

      {results.length > 0 && (
        <div className="desempenho">
          <div className="subhead">{t("exam_performance_title")}</div>
          <table className="dtab">
            <thead><tr><th>{t("exam_col_when")}</th><th>{t("exam_col_mode")}</th><th>{t("exam_col_time")}</th><th>{t("exam_col_score")}</th></tr></thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.mode === "sem" ? t("exam_mode_sem_short") : t("exam_mode_com_short")}</td>
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
