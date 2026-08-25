import { useEffect, useMemo, useRef, useState } from "react";
import { speak } from "../lib/speech";
import { rand, shuffle, type Question } from "../data/generators";
import { norm, type ExSpec, type TypedQ, type ConnectData, type WSData, type EnumData } from "../data/exercises";
import { MultipleChoice } from "./MultipleChoice";

type Resolve = (correct: number, wrong: number) => void;

/* ---------- Typed / Dictation ---------- */
function Typed({ q, num, onResolve }: { q: TypedQ; num: number; onResolve: Resolve }) {
  const [val, setVal] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "no">("idle");
  const [scored, setScored] = useState(false);
  function check() {
    const ok = norm(val) === norm(q.answer);
    setState(ok ? "ok" : "no");
    if (ok) speak(q.speak || q.answer);
    if (!scored) { setScored(true); onResolve(ok ? 1 : 0, ok ? 0 : 1); }
  }
  return (
    <div className={"qcard" + (q.hard ? " hardq" : "")}>
      <p className="q">
        <span className="num">{num}</span>
        <span className="txt" dangerouslySetInnerHTML={{ __html: q.promptHTML }} />
        {q.speak && <button className={"listen" + (q.dictation ? " big2" : "")} onClick={() => speak(q.speak!)}>🔊 {q.dictation ? "tocar" : "ouvir"}</button>}
      </p>
      <div className="typed">
        <input className={state === "ok" ? "ok" : state === "no" ? "no" : ""} value={val} placeholder="escreva em alemão…" spellCheck={false}
          onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} />
        <button className="ck" onClick={check}>Verificar</button>
      </div>
      {state === "ok" && <div className="solution">Richtig! 🎉 ({q.answer})</div>}
      {state === "no" && <div className="solution" style={{ color: "var(--bad)" }}>Resposta: {q.answer}</div>}
    </div>
  );
}

/* ---------- Connect (ligar) ---------- */
function Connect({ data, onResolve }: { data: ConnectData; onResolve: Resolve }) {
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
  const keys = data.pairs.map((p) => p.key);

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
    let correct = 0; keys.forEach((k) => { if (conn[k] === k) correct++; });
    const filled = { ...conn }; keys.forEach((k) => { if (filled[k] === undefined) filled[k] = k; });
    setConn(filled); setCorrected(true);
    setFb({ m: `${correct} / ${keys.length} certas` + (correct === keys.length ? " 🎉" : " — verde = certo, vermelho = errado."), ok: correct === keys.length });
    onResolve(correct, keys.length - correct);
  }

  return (
    <div className="qcard">
      <p className="q"><span className="txt">{data.title}</span></p>
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
      {!corrected && <div className="btnrow"><button className="btn blue" onClick={corrigir}>✅ Corrigir</button><button className="btn ghost" onClick={() => { setConn({}); setSelL(null); }}>🔁 Refazer</button></div>}
      {fb && <p className="fb" style={{ color: fb.ok ? "var(--good)" : "var(--bad)" }}>{fb.m}</p>}
    </div>
  );
}

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

function WordSearch({ data, onResolve }: { data: WSData; onResolve: Resolve }) {
  const [{ grid, placed, trans, used }] = useState(() => buildWS(data));
  const [found, setFound] = useState<Record<string, boolean>>({});
  const [first, setFirst] = useState<string | null>(null);
  const [foundCells, setFoundCells] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const foundCount = Object.keys(found).length;

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
    onResolve(foundCount, used.length - foundCount);
  }

  return (
    <div className="qcard">
      <p className="q"><span className="txt">{data.title}</span></p>
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
      {!done && <div className="btnrow"><button className="btn blue" onClick={corrigir}>✅ Corrigir</button></div>}
    </div>
  );
}

/* ---------- Enumerate ---------- */
function Enumerate({ data, onResolve }: { data: EnumData; onResolve: Resolve }) {
  const n = data.items.length;
  const [listOrder] = useState(() => shuffle(data.items.map((_, i) => i)));
  const numberOf = useMemo(() => { const m: Record<number, number> = {}; listOrder.forEach((idx, pos) => (m[idx] = pos + 1)); return m; }, [listOrder]);
  const [figOrder] = useState(() => shuffle(data.items.map((_, i) => i)));
  const [vals, setVals] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  function verify() {
    if (checked) return;
    let correct = 0; figOrder.forEach((idx) => { if (Number(vals[idx]) === numberOf[idx]) correct++; });
    setChecked(true); onResolve(correct, n - correct);
  }
  return (
    <div className="qcard">
      <p className="q"><span className="txt">{data.title}</span></p>
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
      {!checked && <div className="btnrow"><button className="btn blue" onClick={verify}>✅ Verificar</button></div>}
    </div>
  );
}

/* ---------- dispatcher ---------- */
export function Exercise({ spec, num, onResolve }: { spec: ExSpec; num: number; onResolve: Resolve }) {
  const data = useMemo(() => spec.gen(), []); // gera uma vez por instância
  switch (spec.kind) {
    case "mc": return <MultipleChoice q={data as Question} num={num} onResolve={onResolve} />;
    case "typed":
    case "dict": return <Typed q={data as TypedQ} num={num} onResolve={onResolve} />;
    case "connect": return <Connect data={data as ConnectData} onResolve={onResolve} />;
    case "ws": return <WordSearch data={data as WSData} onResolve={onResolve} />;
    case "enum": return <Enumerate data={data as EnumData} onResolve={onResolve} />;
  }
}
