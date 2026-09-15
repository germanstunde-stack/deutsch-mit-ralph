import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { speak, speakAll } from "../lib/speech";
import { rand, shuffle, type Question } from "../data/generators";
import { norm, type ExSpec, type TypedQ, type ConnectData, type WSData, type EnumData, type OrderData, type TFData, type ClozeData, type ChronoData } from "../data/exercises";
import { MultipleChoice } from "./MultipleChoice";
import { addHard, easeHard } from "../data/caderno";
import type { ExMode, ExamHandle } from "./examTypes";

type Resolve = (correct: number, wrong: number) => void;

/* ---------- Typed / Dictation ---------- */
const Typed = forwardRef<ExamHandle, { q: TypedQ; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Typed({ q, num, onResolve, mode = "practice" }, ref) {
    const [val, setVal] = useState("");
    const [state, setState] = useState<"idle" | "ok" | "no">("idle");
    const [scored, setScored] = useState(false);
    const [revealed, setRevealed] = useState(false);

    useImperativeHandle(ref, () => ({
      getScore: () => (norm(val) === norm(q.answer) ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }),
      reveal: () => { setRevealed(true); setState(norm(val) === norm(q.answer) ? "ok" : "no"); },
    }), [val, q.answer]);

    function check() {
      if (mode === "exam") return; // na prova a nota sai só no "Corrigir" geral
      const ok = norm(val) === norm(q.answer);
      setState(ok ? "ok" : "no");
      if (ok) speak(q.speak || q.answer);
      if (!scored) { setScored(true); onResolve(ok ? 1 : 0, ok ? 0 : 1); if (ok) easeHard(q.word); else addHard(q.word, q.wordpt); }
    }

    const showState = mode === "exam" ? (revealed ? state : "idle") : state;
    return (
      <div className={"qcard" + (q.hard ? " hardq" : "")}>
        <p className="q">
          <span className={"num" + (showState === "ok" ? " ok" : showState === "no" ? " no" : "")}>{num}</span>
          <span className="txt" dangerouslySetInnerHTML={{ __html: q.promptHTML }} />
          {q.speak && <button className={"listen" + (q.dictation ? " big2" : "")} onClick={() => speak(q.speak!)}>🔊 {q.dictation ? "tocar" : "ouvir"}</button>}
        </p>
        <div className="typed">
          <input className={showState === "ok" ? "ok" : showState === "no" ? "no" : ""} value={val} placeholder="escreva em alemão…" spellCheck={false}
            disabled={mode === "exam" && revealed}
            onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} />
          {mode !== "exam" && <button className="ck" onClick={check}>Verificar</button>}
        </div>
        {showState === "ok" && <div className="solution">Richtig! 🎉 ({q.answer})</div>}
        {showState === "no" && <div className="solution" style={{ color: "var(--bad)" }}>Resposta: {q.answer}</div>}
      </div>
    );
  }
);

/* ---------- Connect (ligar) ---------- */
const Connect = forwardRef<ExamHandle, { data: ConnectData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Connect({ data, num, onResolve, mode = "practice" }, ref) {
    const boxRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [leftOrder] = useState(() => shuffle(data.pairs));
    const [rightOrder] = useState(() => shuffle(data.pairs));
    const [conn, setConn] = useState<Record<string, string>>({});
    const [selL, setSelL] = useState<string | null>(null);
    const [corrected, setCorrected] = useState(false);
    const [fb, setFb] = useState<{ m: string; ok: boolean } | null>(null);
    const [autoResolved, setAutoResolved] = useState(false);
    const keys = data.pairs.map((p) => p.key);

    function countCorrect(c: Record<string, string>) { let n = 0; keys.forEach((k) => { if (c[k] === k) n++; }); return n; }

    useImperativeHandle(ref, () => ({
      getScore: () => {
        const c = countCorrect(conn);
        return data.single ? (c === keys.length ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }) : { correct: c, wrong: keys.length - c };
      },
      reveal: () => {
        const filled = { ...conn }; keys.forEach((k) => { if (filled[k] === undefined) filled[k] = k; });
        setConn(filled); setCorrected(true);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [conn, data.single, keys.length]);

    function draw() {
      const svg = svgRef.current, box = boxRef.current;
      if (!svg || !box) return;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const br = box.getBoundingClientRect();
      Object.keys(conn).forEach((lk) => {
        const a = leftRefs.current[lk], b = rightRefs.current[conn[lk]];
        if (!a || !b) return;
        const ar = a.getBoundingClientRect(), brr = b.getBoundingClientRect();
        const col = !corrected ? "var(--brand)" : conn[lk] === lk ? "var(--good)" : "var(--bad)";
        const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
        ln.setAttribute("x1", String(ar.right - br.left)); ln.setAttribute("y1", String(ar.top + ar.height / 2 - br.top));
        ln.setAttribute("x2", String(brr.left - br.left)); ln.setAttribute("y2", String(brr.top + brr.height / 2 - br.top));
        ln.setAttribute("stroke", col); ln.setAttribute("stroke-width", "4"); ln.setAttribute("stroke-linecap", "round");
        svg.appendChild(ln);
      });
    }
    useEffect(() => { draw(); }); // redraw after every render

    // prática: some sozinho assim que ficar 100% certo, sem precisar clicar em Corrigir
    useEffect(() => {
      if (mode !== "practice" || corrected || autoResolved) return;
      if (Object.keys(conn).length !== keys.length) return;
      const c = countCorrect(conn);
      if (c === keys.length) {
        setAutoResolved(true); setCorrected(true);
        setFb({ m: `${c} / ${keys.length} certas 🎉`, ok: true });
        onResolve(data.single ? 1 : c, 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conn]);

    function clickL(k: string) {
      if (corrected) return;
      if (conn[k] !== undefined) { const n = { ...conn }; delete n[k]; setConn(n); setSelL(null); }
      else setSelL(selL === k ? null : k);
    }
    function clickR(rk: string) {
      if (corrected || !selL) return;
      const n: Record<string, string> = {};
      Object.keys(conn).forEach((lk) => { if (conn[lk] !== rk) n[lk] = conn[lk]; });
      n[selL] = rk; setConn(n); setSelL(null);
    }
    function corrigir() {
      if (corrected) return;
      const c = countCorrect(conn);
      const filled = { ...conn }; keys.forEach((k) => { if (filled[k] === undefined) filled[k] = k; });
      setConn(filled); setCorrected(true);
      setFb({ m: `${c} / ${keys.length} certas` + (c === keys.length ? " 🎉" : " — verde = certo, vermelho = errado."), ok: c === keys.length });
      onResolve(data.single ? (c === keys.length ? 1 : 0) : c, data.single ? (c === keys.length ? 0 : 1) : keys.length - c);
    }

    const allCorrect = corrected && countCorrect(conn) === keys.length;
    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (corrected ? (allCorrect ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
          <button className="listen" onClick={() => speakAll(keys)}>🔊 ouvir palavras</button>
        </p>
        <div className="connect" ref={boxRef}>
          <div className="colc">
            {leftOrder.map((p) => (
              <button key={p.key} ref={(el) => { leftRefs.current[p.key] = el; }}
                className={"cbtn" + (selL === p.key ? " sel" : "") + (conn[p.key] !== undefined ? " done" : "")}
                onClick={() => clickL(p.key)} dangerouslySetInnerHTML={{ __html: p.l }} />
            ))}
          </div>
          <div className="colc">
            {rightOrder.map((p) => {
              const used = Object.values(conn).includes(p.key);
              return <button key={p.key} ref={(el) => { rightRefs.current[p.key] = el; }} className={"cbtn" + (used ? " done" : "")} onClick={() => clickR(p.key)}>{p.r}</button>;
            })}
          </div>
          <svg className="lines" ref={svgRef} />
        </div>
        {mode !== "exam" && !corrected && <div className="btnrow"><button className="btn blue" onClick={corrigir}>✅ Corrigir</button><button className="btn ghost" onClick={() => { setConn({}); setSelL(null); }}>🔁 Refazer</button></div>}
        {mode !== "exam" && fb && <p className="fb" style={{ color: fb.ok ? "var(--good)" : "var(--bad)" }}>{fb.m}</p>}
      </div>
    );
  }
);

/* ---------- Word search ---------- */
function buildWS(data: WSData) {
  const size = data.size;
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placed: { word: string; cells: string[] }[] = [];
  const trans: Record<string, { orig: string; pt: string }> = {};
  data.pairs.forEach((p) => { trans[p.w.toUpperCase()] = { orig: p.w, pt: p.pt }; });
  function tryPlace(word: string) {
    const w = word.toUpperCase();
    for (let att = 0; att < 60; att++) {
      const dir = rand([[0, 1], [1, 0]]);
      const r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
      const er = r + dir[0] * (w.length - 1), ec = c + dir[1] * (w.length - 1);
      if (er >= size || ec >= size) continue;
      let ok = true;
      for (let i = 0; i < w.length; i++) { const rr = r + dir[0] * i, cc = c + dir[1] * i; if (grid[rr][cc] && grid[rr][cc] !== w[i]) { ok = false; break; } }
      if (!ok) continue;
      const cells: string[] = [];
      for (let i = 0; i < w.length; i++) { const rr = r + dir[0] * i, cc = c + dir[1] * i; grid[rr][cc] = w[i]; cells.push(rr + "-" + cc); }
      placed.push({ word: w, cells }); return true;
    }
    return false;
  }
  const used = data.pairs.map((p) => p.w).filter(tryPlace);
  const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = rand(AZ);
  return { grid, placed, trans, used: used.map((w) => w.toUpperCase()) };
}

const WordSearch = forwardRef<ExamHandle, { data: WSData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function WordSearch({ data, num, onResolve, mode = "practice" }, ref) {
    const [{ grid, placed, trans, used }] = useState(() => buildWS(data));
    const [found, setFound] = useState<Record<string, boolean>>({});
    const [first, setFirst] = useState<string | null>(null);
    const [foundCells, setFoundCells] = useState<Record<string, boolean>>({});
    const [done, setDone] = useState(false);
    const foundCount = Object.keys(found).length;

    useImperativeHandle(ref, () => ({
      getScore: () => data.single
        ? (foundCount === used.length ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 })
        : { correct: foundCount, wrong: used.length - foundCount },
      reveal: () => {
        const nc = { ...foundCells };
        placed.forEach((pl) => { if (!found[pl.word]) pl.cells.forEach((p) => (nc[p] = true)); });
        setFoundCells(nc); setDone(true);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [foundCount, foundCells, found, placed, used.length, data.single]);

    // prática: some sozinho assim que todas as palavras forem achadas, sem precisar clicar em Corrigir
    useEffect(() => {
      if (mode !== "practice" || done) return;
      if (used.length > 0 && foundCount === used.length) {
        setDone(true);
        onResolve(data.single ? 1 : foundCount, 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [foundCount]);

    function between(a: string, b: string): string[] | null {
      const [ar, ac] = a.split("-").map(Number), [br, bc] = b.split("-").map(Number);
      const dr = br - ar, dc = bc - ac;
      if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
      const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
      const sr = dr === 0 ? 0 : dr / Math.abs(dr), sc = dc === 0 ? 0 : dc / Math.abs(dc);
      const out: string[] = []; for (let i = 0; i < len; i++) out.push(`${ar + sr * i}-${ac + sc * i}`); return out;
    }
    function pick(pos: string) {
      if (done) return;
      if (!first) { setFirst(pos); return; }
      const path = between(first, pos); const f = first; setFirst(null);
      if (!path) return;
      const str = path.map((p) => { const [r, c] = p.split("-").map(Number); return grid[r][c]; }).join("");
      const rev = str.split("").reverse().join("");
      let hit: string | null = null;
      used.forEach((w) => { if ((str === w || rev === w) && !found[w]) hit = w; });
      void f;
      if (hit) {
        const info = trans[hit] ?? { orig: hit, pt: "" }; speak(info.orig);
        setFound((s) => ({ ...s, [hit!]: true }));
        setFoundCells((s) => { const n = { ...s }; path.forEach((p) => (n[p] = true)); return n; });
      }
    }
    function corrigir() {
      if (done) return;
      const nc = { ...foundCells };
      placed.forEach((pl) => { if (!found[pl.word]) pl.cells.forEach((p) => (nc[p] = true)); });
      setFoundCells(nc); setDone(true);
      onResolve(data.single ? (foundCount === used.length ? 1 : 0) : foundCount, data.single ? (foundCount === used.length ? 0 : 1) : used.length - foundCount);
    }

    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (done ? (foundCount === used.length ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
          <button className="listen" onClick={() => speakAll(used.map((w) => trans[w]?.orig ?? w))}>🔊 ouvir palavras</button>
        </p>
        <div className="ws">
          {grid.map((row, r) => (
            <div className="wr" key={r}>
              {row.map((ch, c) => {
                const pos = `${r}-${c}`;
                return <button key={c} className={"wc" + (first === pos ? " pick" : "") + (foundCells[pos] ? " found" : "")} onClick={() => pick(pos)}>{ch}</button>;
              })}
            </div>
          ))}
        </div>
        <div className="wswords">
          {used.map((w) => {
            const info = trans[w] ?? { pt: "" };
            return <span key={w} className={"ww" + (found[w] || done ? " done" : "")}>{w}{(found[w] || done) && info.pt ? <span style={{ color: found[w] ? "var(--good)" : "var(--ink-soft)", fontWeight: 900 }}> {found[w] ? "✓" : "("}{info.pt}{found[w] ? "" : ")"}</span> : null}</span>;
          })}
        </div>
        {mode !== "exam" && !done && <div className="btnrow"><button className="btn blue" onClick={corrigir}>✅ Corrigir</button></div>}
      </div>
    );
  }
);

/* ---------- Enumerate ---------- */
const Enumerate = forwardRef<ExamHandle, { data: EnumData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Enumerate({ data, num, onResolve, mode = "practice" }, ref) {
    const n = data.items.length;
    const [listOrder] = useState(() => shuffle(data.items.map((_, i) => i)));
    const numberOf = useMemo(() => { const m: Record<number, number> = {}; listOrder.forEach((idx, pos) => (m[idx] = pos + 1)); return m; }, [listOrder]);
    const [figOrder] = useState(() => shuffle(data.items.map((_, i) => i)));
    const [vals, setVals] = useState<Record<number, string>>({});
    const [checked, setChecked] = useState(false);

    function countCorrect(v: Record<number, string>) { let c = 0; figOrder.forEach((idx) => { if (Number(v[idx]) === numberOf[idx]) c++; }); return c; }

    useImperativeHandle(ref, () => ({
      getScore: () => {
        const c = countCorrect(vals);
        return data.single ? (c === n ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }) : { correct: c, wrong: n - c };
      },
      reveal: () => setChecked(true),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [vals, data.single, n]);

    // prática: some sozinho assim que todos os campos estiverem preenchidos e certos
    useEffect(() => {
      if (mode !== "practice" || checked) return;
      const filledAll = figOrder.every((idx) => vals[idx] !== undefined && vals[idx] !== "");
      if (!filledAll) return;
      const c = countCorrect(vals);
      if (c === n) { setChecked(true); onResolve(data.single ? 1 : c, 0); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vals]);

    function verify() {
      if (checked) return;
      const c = countCorrect(vals);
      setChecked(true);
      onResolve(data.single ? (c === n ? 1 : 0) : c, data.single ? (c === n ? 0 : 1) : n - c);
    }

    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (checked ? (countCorrect(vals) === n ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
          <button className="listen" onClick={() => speakAll(data.items.map((it) => it.de))}>🔊 ouvir palavras</button>
        </p>
        <div className="enumlist">
          {listOrder.map((idx, pos) => <div key={idx}><span className="n">{pos + 1}</span> {data.items[idx].de}</div>)}
        </div>
        <div className="enum">
          {figOrder.map((idx) => {
            const ok = checked ? Number(vals[idx]) === numberOf[idx] : undefined;
            return (
              <div className="ei" key={idx}>
                <div className="emo">{data.items[idx].emo}</div>
                <input inputMode="numeric" maxLength={2} className={ok === undefined ? "" : ok ? "ok" : "no"} value={vals[idx] ?? ""} disabled={checked}
                  onChange={(e) => setVals((v) => ({ ...v, [idx]: e.target.value }))} />
              </div>
            );
          })}
        </div>
        {mode !== "exam" && !checked && <div className="btnrow"><button className="btn blue" onClick={verify}>✅ Verificar</button></div>}
      </div>
    );
  }
);

/* ---------- Order (montar frase) ---------- */
const Order = forwardRef<ExamHandle, { data: OrderData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Order({ data, num, onResolve, mode = "practice" }, ref) {
    const [poolOrder] = useState(() => shuffle(data.chunks.map((_, i) => i)));
    const [placed, setPlaced] = useState<number[]>([]);
    const [corrected, setCorrected] = useState(false);
    const [autoResolved, setAutoResolved] = useState(false);

    function isCorrect(p: number[]) {
      return p.length === data.answer.length && p.every((idx, pos) => data.chunks[idx] === data.answer[pos]);
    }

    useImperativeHandle(ref, () => ({
      getScore: () => (isCorrect(placed) ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }),
      reveal: () => setCorrected(true),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [placed]);

    // prática: some sozinho assim que a frase montada ficar certa, sem precisar clicar em Corrigir
    useEffect(() => {
      if (mode !== "practice" || corrected || autoResolved) return;
      if (placed.length !== data.answer.length) return;
      if (isCorrect(placed)) { setAutoResolved(true); setCorrected(true); onResolve(1, 0); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placed]);

    function addChunk(idx: number) { if (!corrected && !placed.includes(idx)) setPlaced((p) => [...p, idx]); }
    function removeChunk(idx: number) { if (!corrected) setPlaced((p) => p.filter((i) => i !== idx)); }
    function corrigir() {
      if (corrected) return;
      const ok = isCorrect(placed);
      setCorrected(true);
      onResolve(ok ? 1 : 0, ok ? 0 : 1);
    }

    const ok = isCorrect(placed);
    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (corrected ? (ok ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
          {/* na prática, ouvir a frase certa é o apoio de pronúncia/ritmo — é assim
              que se aprende ordem de frase de ouvido. Na prova, que vale nota e
              libera o próximo módulo, só toca o que o aluno montou. */}
          <button className="listen" disabled={mode === "exam" && placed.length === 0}
            onClick={() => speak(mode === "exam" ? placed.map((idx) => data.chunks[idx]).join(" ") : data.answer.join(" "))}>
            🔊 ouvir frase
          </button>
        </p>
        <div className="orderbuilt">
          {placed.length === 0 && <span className="ph">…</span>}
          {placed.map((idx, pos) => (
            <button key={pos} disabled={mode === "exam" && corrected}
              className={"chunk placed" + (corrected ? (data.chunks[idx] === data.answer[pos] ? " ok" : " no") : "")}
              onClick={() => removeChunk(idx)}>{data.chunks[idx]}</button>
          ))}
        </div>
        <div className="orderpool">
          {poolOrder.filter((idx) => !placed.includes(idx)).map((idx) => (
            <button key={idx} className="chunk" disabled={corrected} onClick={() => addChunk(idx)}>{data.chunks[idx]}</button>
          ))}
        </div>
        {mode !== "exam" && !corrected && (
          <div className="btnrow">
            <button className="btn blue" onClick={corrigir}>✅ Corrigir</button>
            <button className="btn ghost" onClick={() => setPlaced([])}>🔁 Refazer</button>
          </div>
        )}
        {corrected && <p className="fb" style={{ color: ok ? "var(--good)" : "var(--bad)" }}>{ok ? "Richtig! 🎉" : `Resposta certa: ${data.answer.join(" ")}`}</p>}
      </div>
    );
  }
);

/* ---------- TrueFalse (verdadeiro ou falso em lote) ---------- */
// Em lote de propósito: uma afirmação por card daria 50% de acerto no chute.
// Cinco em lote com `single` põem o chute cego em 3%.
const TrueFalse = forwardRef<ExamHandle, { data: TFData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function TrueFalse({ data, num, onResolve, mode = "practice" }, ref) {
    const n = data.statements.length;
    const [order] = useState(() => shuffle(data.statements.map((_, i) => i)));
    const [picks, setPicks] = useState<Record<number, boolean>>({});
    const [checked, setChecked] = useState(false);

    function countCorrect(p: Record<number, boolean>) {
      let c = 0;
      order.forEach((idx) => { if (p[idx] === data.statements[idx].correct) c++; });
      return c;
    }

    useImperativeHandle(ref, () => ({
      getScore: () => {
        const c = countCorrect(picks);
        return data.single ? (c === n ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }) : { correct: c, wrong: n - c };
      },
      reveal: () => setChecked(true),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [picks, data.single, n]);

    // prática: resolve sozinho quando tudo está marcado e certo
    useEffect(() => {
      if (mode !== "practice" || checked) return;
      if (order.some((idx) => picks[idx] === undefined)) return;
      const c = countCorrect(picks);
      if (c === n) { setChecked(true); onResolve(data.single ? 1 : c, 0); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picks]);

    function verify() {
      if (checked) return;
      const c = countCorrect(picks);
      setChecked(true);
      onResolve(data.single ? (c === n ? 1 : 0) : c, data.single ? (c === n ? 0 : 1) : n - c);
    }

    const acertos = countCorrect(picks);
    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (checked ? (acertos === n ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
          {/* lê todas as afirmações, inclusive as falsas — o áudio não entrega
              nada aqui, então não precisa do bloqueio de prova que o Order tem */}
          <button className="listen" onClick={() => speakAll(order.map((i) => data.statements[i].speak ?? "").filter(Boolean))}>🔊 ouvir</button>
        </p>
        <div className="tflist">
          {order.map((idx) => {
            const st = data.statements[idx];
            const escolha = picks[idx];
            return (
              <div className="tfrow" key={idx}>
                <span className="st" dangerouslySetInnerHTML={{ __html: st.html }} />
                {[true, false].map((val) => {
                  const marcado = escolha === val;
                  const cls = "opt"
                    + (!checked && marcado ? " sel" : "")
                    + (checked && val === st.correct ? " correct" : "")
                    + (checked && marcado && val !== st.correct ? " wrong" : "")
                    + (checked && val !== st.correct && !marcado ? " dim" : "");
                  return (
                    <button key={String(val)} className={cls} disabled={checked}
                      onClick={() => setPicks((p) => ({ ...p, [idx]: val }))}>
                      {val ? "✅ certo" : "❌ errado"}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        {mode !== "exam" && !checked && <div className="btnrow"><button className="btn blue" onClick={verify}>✅ Verificar</button></div>}
        {mode !== "exam" && checked && <p className="fb" style={{ color: acertos === n ? "var(--good)" : "var(--bad)" }}>{acertos} / {n} {acertos === n ? "🎉" : ""}</p>}
      </div>
    );
  }
);

/* ---------- Cloze (lacunas com banco de palavras) ---------- */
// Dois cliques, igual ao Connect: escolhe a palavra no banco, escolhe a lacuna.
// Clicar numa lacuna preenchida devolve a palavra pro banco.
const Cloze = forwardRef<ExamHandle, { data: ClozeData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Cloze({ data, num, onResolve, mode = "practice" }, ref) {
    // as lacunas são indexadas de forma contínua entre as linhas
    const gaps = useMemo(() => data.lines.flatMap((ln, li) => ln.gaps.map((g, gi) => ({ ...g, li, gi }))), [data.lines]);
    const n = gaps.length;
    const [bankOrder] = useState(() => shuffle(data.bank.map((_, i) => i)));
    const [sel, setSel] = useState<number | null>(null);
    const [fills, setFills] = useState<Record<number, number>>({}); // lacuna -> índice no banco
    const [checked, setChecked] = useState(false);

    // por VALOR, não por índice: se o banco tem "in" duas vezes, pôr a outra
    // cópia na lacuna continua certo. Mesmo espírito do Connect, que compara
    // pela chave do par e não pela posição.
    function gapOk(i: number) {
      const b = fills[i];
      return b !== undefined && norm(data.bank[b]) === norm(gaps[i].answer);
    }
    function countCorrect() { let c = 0; for (let i = 0; i < n; i++) if (gapOk(i)) c++; return c; }

    useImperativeHandle(ref, () => ({
      getScore: () => {
        const c = countCorrect();
        return data.single ? (c === n ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }) : { correct: c, wrong: n - c };
      },
      reveal: () => {
        // preenche o que ficou vazio com a resposta certa (padrão do Connect)
        setFills((f) => {
          const novo = { ...f };
          gaps.forEach((g, i) => {
            if (novo[i] !== undefined) return;
            const b = data.bank.findIndex((w, bi) => norm(w) === norm(g.answer) && !Object.values(novo).includes(bi));
            if (b >= 0) novo[i] = b;
          });
          return novo;
        });
        setChecked(true);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [fills, data.single, n]);

    useEffect(() => {
      if (mode !== "practice" || checked) return;
      if (Object.keys(fills).length !== n) return;
      if (countCorrect() === n) { setChecked(true); onResolve(data.single ? 1 : n, 0); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fills]);

    function clickGap(i: number) {
      if (checked) return;
      if (fills[i] !== undefined) { setFills((f) => { const x = { ...f }; delete x[i]; return x; }); return; }
      if (sel === null) return;
      setFills((f) => ({ ...f, [i]: sel }));
      setSel(null);
    }
    function verify() {
      if (checked) return;
      const c = countCorrect();
      setChecked(true);
      onResolve(data.single ? (c === n ? 1 : 0) : c, data.single ? (c === n ? 0 : 1) : n - c);
    }

    const usados = new Set(Object.values(fills));
    const acertos = countCorrect();
    let idx = -1; // contador contínuo de lacunas ao percorrer as linhas
    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (checked ? (acertos === n ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
          {/* só na prática: na prova o áudio da frase completa entregaria as lacunas */}
          {mode !== "exam" && data.lines.some((l) => l.speak) && (
            <button className="listen" onClick={() => speakAll(data.lines.map((l) => l.speak ?? "").filter(Boolean))}>🔊 ouvir</button>
          )}
        </p>
        <div className="clztext">
          {data.lines.map((ln, li) => (
            <p className="clzline" key={li}>
              {ln.segments.map((seg, si) => {
                const temLacuna = si < ln.gaps.length;
                if (temLacuna) idx++;
                const i = idx;
                return (
                  <span key={si}>
                    {seg}
                    {temLacuna && (
                      <button className={"gap" + (fills[i] !== undefined ? " filled" : "") + (checked ? (gapOk(i) ? " ok" : " no") : "")}
                        disabled={checked} onClick={() => clickGap(i)}>
                        {fills[i] !== undefined ? data.bank[fills[i]] : " "}
                      </button>
                    )}
                  </span>
                );
              })}
              {ln.tr && <span className="clztr">{ln.tr}</span>}
            </p>
          ))}
        </div>
        <div className="wswords">
          {bankOrder.map((b) => (
            <button key={b} className={"ww" + (sel === b ? " pick" : "") + (usados.has(b) ? " used" : "")}
              disabled={checked || usados.has(b)} onClick={() => setSel(sel === b ? null : b)}>{data.bank[b]}</button>
          ))}
        </div>
        {mode !== "exam" && !checked && <div className="btnrow"><button className="btn blue" onClick={verify}>✅ Verificar</button><button className="btn ghost" onClick={() => { setFills({}); setSel(null); }}>🔁 Refazer</button></div>}
        {mode !== "exam" && checked && <p className="fb" style={{ color: acertos === n ? "var(--good)" : "var(--bad)" }}>{acertos} / {n} {acertos === n ? "🎉" : ""}</p>}
      </div>
    );
  }
);

/* ---------- Chrono (linha do tempo) ---------- */
// Crédito parcial por PARES ADJACENTES, testados pela chave de ordenação.
// Posição exata seria
// cruel: inserir um evento no topo desloca todos os outros e zeraria quem sabia
// a sequência inteira. Par adjacente se explica numa linha e — o que decide — é
// RENDERIZÁVEL: o conector entre duas linhas é o ponto, verde ou vermelho.
// O teste é `<=`, então dois eventos do mesmo ano saem de graça, não viram
// armadilha.
const Chrono = forwardRef<ExamHandle, { data: ChronoData; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Chrono({ data, num, onResolve, mode = "practice" }, ref) {
    const n = data.events.length;
    const [poolOrder] = useState(() => shuffle(data.events.map((_, i) => i)));
    const [slots, setSlots] = useState<(number | null)[]>(() => Array(n).fill(null));
    const [checked, setChecked] = useState(false);

    // um par só conta quando as duas vagas estão preenchidas
    function pairOk(p: number) {
      const a = slots[p], b = slots[p + 1];
      if (a === null || b === null) return false;
      return data.events[a].at <= data.events[b].at;
    }
    function countPairs() { let c = 0; for (let p = 0; p < n - 1; p++) if (pairOk(p)) c++; return c; }

    useImperativeHandle(ref, () => ({
      getScore: () => {
        const ok = countPairs();
        const cheio = slots.every((s) => s !== null);
        return data.single
          ? (cheio && ok === n - 1 ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 })
          : { correct: ok, wrong: n - 1 - ok };
      },
      reveal: () => {
        setSlots((s) => {
          const novo = s.slice();
          const usados = new Set(novo.filter((x): x is number => x !== null));
          // preenche o que ficou vazio na ordem canônica (padrão do Connect)
          let proximo = 0;
          novo.forEach((v, i) => {
            if (v !== null) return;
            while (usados.has(proximo)) proximo++;
            novo[i] = proximo; usados.add(proximo);
          });
          return novo;
        });
        setChecked(true);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [slots, data.single, n]);

    useEffect(() => {
      if (mode !== "practice" || checked) return;
      if (slots.some((s) => s === null)) return;
      if (countPairs() === n - 1) { setChecked(true); onResolve(data.single ? 1 : n - 1, 0); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slots]);

    function colocar(ev: number) {
      if (checked) return;
      const vaga = slots.indexOf(null);
      if (vaga < 0) return;
      setSlots((s) => { const x = s.slice(); x[vaga] = ev; return x; });
    }
    function tirar(vaga: number) {
      if (checked) return;
      setSlots((s) => { const x = s.slice(); x[vaga] = null; return x; });
    }
    function verify() {
      if (checked) return;
      const ok = countPairs();
      const cheio = slots.every((s) => s !== null);
      setChecked(true);
      onResolve(
        data.single ? (cheio && ok === n - 1 ? 1 : 0) : ok,
        data.single ? (cheio && ok === n - 1 ? 0 : 1) : n - 1 - ok,
      );
    }

    const acertos = countPairs();
    const naPool = poolOrder.filter((i) => !slots.includes(i));
    return (
      <div className="qcard">
        <p className="q">
          <span className={"num" + (checked ? (acertos === n - 1 ? " ok" : " no") : "")}>{num}</span>
          <span className="txt">{data.title}</span>
        </p>
        <div className="chrono">
          {slots.map((ev, i) => (
            <div key={i}>
              {/* a vaga em si não fica verde nem vermelha: a nota é por LIGAÇÃO,
                  e pintar a vaga sugeriria que a posição isolada é que conta */}
              <button className={"slot" + (ev !== null ? " filled" : "")}
                disabled={checked} onClick={() => ev !== null && tirar(i)}>
                <span className="n">{i + 1}</span>
                <span className="ev">{ev === null ? "…" : data.events[ev].label}</span>
                {checked && ev !== null && <span className="yr">{data.events[ev].show ?? data.events[ev].at}</span>}
              </button>
              {i < n - 1 && <div className={"link" + (checked ? (pairOk(i) ? " ok" : " no") : "")} />}
            </div>
          ))}
        </div>
        {naPool.length > 0 && (
          <div className="chronopool">
            {naPool.map((i) => (
              <button key={i} className="chunk" disabled={checked} onClick={() => colocar(i)}>{data.events[i].label}</button>
            ))}
          </div>
        )}
        {mode !== "exam" && !checked && (
          <div className="btnrow">
            <button className="btn blue" onClick={verify}>✅ Corrigir</button>
            <button className="btn ghost" onClick={() => setSlots(Array(n).fill(null))}>🔁 Refazer</button>
          </div>
        )}
        {mode !== "exam" && checked && (
          <p className="fb" style={{ color: acertos === n - 1 ? "var(--good)" : "var(--bad)" }}>
            {acertos} / {n - 1} ligações na ordem certa {acertos === n - 1 ? "🎉" : "— o traço verde liga dois eventos na ordem certa."}
          </p>
        )}
      </div>
    );
  }
);

/* ---------- dispatcher ---------- */
export const Exercise = forwardRef<ExamHandle, { spec: ExSpec; num: number; onResolve: Resolve; mode?: ExMode }>(
  function Exercise({ spec, num, onResolve, mode = "practice" }, ref) {
    // gera uma vez por spec — as vagas da rodada agora são objetos distintos
    // (ver buildRound), então trocar o spec troca o conteúdo mesmo que o React
    // reaproveite a instância.
    const data = useMemo(() => spec.gen(), [spec]);
    switch (spec.kind) {
      case "mc": return <MultipleChoice ref={ref} q={data as Question} num={num} onResolve={onResolve} mode={mode} />;
      case "typed":
      case "dict": return <Typed ref={ref} q={data as TypedQ} num={num} onResolve={onResolve} mode={mode} />;
      case "connect": return <Connect ref={ref} data={data as ConnectData} num={num} onResolve={onResolve} mode={mode} />;
      case "ws": return <WordSearch ref={ref} data={data as WSData} num={num} onResolve={onResolve} mode={mode} />;
      case "enum": return <Enumerate ref={ref} data={data as EnumData} num={num} onResolve={onResolve} mode={mode} />;
      case "order": return <Order ref={ref} data={data as OrderData} num={num} onResolve={onResolve} mode={mode} />;
      case "tf": return <TrueFalse ref={ref} data={data as TFData} num={num} onResolve={onResolve} mode={mode} />;
      case "cloze": return <Cloze ref={ref} data={data as ClozeData} num={num} onResolve={onResolve} mode={mode} />;
      case "chrono": return <Chrono ref={ref} data={data as ChronoData} num={num} onResolve={onResolve} mode={mode} />;
    }
    // Sem isto, um `kind` novo sem case aqui não renderiza NADA — e, pior, na
    // Prova o ref fica null e o item vale zero calado, sem erro nenhum. Fica
    // depois do switch (e não como `default:`) pra todo case continuar
    // retornando; o `never` transforma o esquecimento em erro de compilação,
    // igual à guarda que o itemKey já tem.
    const nunca: never = spec;
    throw new Error(`Exercise: falta o case do exercício "${String((nunca as ExSpec).kind)}"`);
  }
);
