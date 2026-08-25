import { useState } from "react";
import { speak } from "../lib/speech";
import { numDE, ordDE } from "../lib/numbers";
import { rand } from "../data/generators";
import { months, weekdays } from "../data/vocab";
import { usePlayer } from "../auth/AuthProvider";

/* ---------- Calculadora falante (uma por operação) ---------- */
function CalcRow({ op, word, ax, bx }: { op: string; word: string; ax: number[]; bx: number[] }) {
  const [q, setQ] = useState(() => make());
  function make() {
    let a: number, b: number, res: number;
    if (op === "÷") { b = rand([2, 3, 4]); res = rand([2, 3, 4]); a = b * res; }
    else { a = rand(ax); b = rand(bx); res = op === "+" ? a + b : op === "−" ? a - b : a * b; }
    const say = `${numDE(a)} ${word} ${numDE(b)} ist ${numDE(res)}`;
    const opts = shuffleN([res, res + 1, Math.max(0, res - 1) === res ? res + 2 : Math.max(0, res - 1)]);
    return { a, b, res, say, opts };
  }
  function shuffleN(a: number[]) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const [picked, setPicked] = useState<number | null>(null);
  const [ok, setOk] = useState(false);
  return (
    <div className="tool">
      <span>{q.a}</span><span className="op">{op}</span><span>{q.b}</span><span className="eq">=</span>
      {q.opts.map((o, i) => (
        <button key={i} className="res"
          style={picked === i ? (o === q.res ? { background: "var(--gruen)", color: "#fff" } : { background: "var(--rot)", color: "#fff" }) : undefined}
          onClick={() => { setPicked(i); if (o === q.res) { setOk(true); speak(q.say); } else setTimeout(() => setPicked((p) => (p === i ? null : p)), 500); }}>
          {o}
        </button>
      ))}
      <button style={{ fontSize: ".85rem" }} title="nova conta" onClick={() => { setQ(make()); setPicked(null); setOk(false); }}>🔄</button>
      {ok && <span style={{ fontSize: ".8rem", color: "var(--gruen)", fontWeight: 800 }}>✓</span>}
    </div>
  );
}
export function Calc() {
  return (
    <div>
      <CalcRow op="+" word="plus" ax={[1, 2, 3, 4, 5]} bx={[1, 2, 3, 4, 5]} />
      <CalcRow op="−" word="minus" ax={[6, 7, 8, 9, 10]} bx={[1, 2, 3, 4]} />
      <CalcRow op="×" word="mal" ax={[2, 3, 4, 5]} bx={[2, 3, 4]} />
      <CalcRow op="÷" word="geteilt durch" ax={[]} bx={[]} />
    </div>
  );
}

/* ---------- Relógio 24h ---------- */
export function Clock() {
  const [t, setT] = useState(() => ({ h: Math.floor(Math.random() * 24), m: Math.floor(Math.random() * 60) }));
  const pad = (n: number) => (n < 10 ? "0" : "") + n;
  const ha = ((t.h % 12) + t.m / 60) * 30 - 90, ma = t.m * 6 - 90;
  const hx = 60 + 26 * Math.cos((ha * Math.PI) / 180), hy = 60 + 26 * Math.sin((ha * Math.PI) / 180);
  const mx = 60 + 40 * Math.cos((ma * Math.PI) / 180), my = 60 + 40 * Math.sin((ma * Math.PI) / 180);
  const say = `Es ist ${numDE(t.h)} Uhr ${t.m > 0 ? numDE(t.m) : ""}`;
  const ticks = [];
  for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180; ticks.push(<circle key={i} cx={60 + 48 * Math.sin(a)} cy={60 - 48 * Math.cos(a)} r="2.2" fill="var(--ink-soft)" />); }
  return (
    <div className="clock-wrap">
      <svg className="clock" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="var(--surface)" stroke="var(--brand)" strokeWidth="4" />{ticks}
        <line x1="60" y1="60" x2={hx} y2={hy} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <line x1="60" y1="60" x2={mx} y2={my} stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="60" r="4" fill="var(--ink)" />
      </svg>
      <div style={{ textAlign: "center" }}>
        <div className="plush" style={{ fontSize: "1.3rem" }}>{pad(t.h)}:{pad(t.m)}</div>
        <div className="desc" style={{ margin: "2px 0 6px" }}>{numDE(t.h)} Uhr {t.m > 0 ? numDE(t.m) : ""}</div>
        <button className="btn blue" style={{ padding: "8px 14px", fontSize: ".9rem" }} onClick={() => speak(say)}>🔊 dizer a hora</button>
        <div><button className="mini" style={{ color: "var(--brand-ink)" }} onClick={() => setT({ h: Math.floor(Math.random() * 24), m: Math.floor(Math.random() * 60) })}>🔄 outra hora</button></div>
      </div>
    </div>
  );
}

/* ---------- Calendário navegável ---------- */
export function Calendar() {
  const { profile } = usePlayer();
  const today = new Date();
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const wd = weekdays[(today.getDay() + 6) % 7], mo0 = months[today.getMonth()];
  const mo = months[view.m];
  const birth = profile?.birthdate ? new Date(profile.birthdate + "T00:00:00") : null;
  const startCol = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const dim = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startCol; i++) cells.push(<div className="cd empty" key={"e" + i} />);
  for (let d = 1; d <= dim; d++) {
    const isT = d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();
    const isBday = !!birth && d === birth.getDate() && view.m === birth.getMonth();
    cells.push(
      <div className={"cd" + (isT ? " today" : "") + (isBday ? " bday" : "")} key={d} title={isBday ? "Seu aniversário! 🎂" : undefined}
        onClick={() => speak(`der ${ordDE(d)} ${mo[0]} ${numDE(view.y)}`)}>{isBday ? "🎂" : d}</div>
    );
  }
  function shift(dm: number, dy: number) {
    setView((v) => { let m = v.m + dm, y = v.y + dy; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } return { y, m }; });
  }
  return (
    <div className="today">
      <div className="big">Heute: {wd.de}, der {today.getDate()}. {mo0[0]} {today.getFullYear()}</div>
      <div className="desc" style={{ margin: "2px 0 8px" }}>
        Hoje: {wd.pt}-feira, {today.getDate()} de {mo0[1]} de {today.getFullYear()} ·{" "}
        <span className="say" style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => speak(`Heute ist ${wd.de}, der ${ordDE(today.getDate())} ${mo0[0]} ${numDE(today.getFullYear())}`)}>🔊 ouvir</span>
      </div>
      <div className="calnav">
        <button className="tbtn" title="ano -" onClick={() => shift(0, -1)}>«</button>
        <button className="tbtn" title="mês -" onClick={() => shift(-1, 0)}>‹</button>
        <span className="cmo">{mo[0]} {view.y}</span>
        <button className="tbtn" title="mês +" onClick={() => shift(1, 0)}>›</button>
        <button className="tbtn" title="ano +" onClick={() => shift(0, 1)}>»</button>
      </div>
      <div className="desc" style={{ textAlign: "center", margin: "4px 0 6px" }}>{mo[1]} de {view.y}</div>
      <div className="calgrid">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((h) => <div className="cd hd" key={h}>{h}</div>)}
        {cells}
      </div>
      <div className="btnrow" style={{ justifyContent: "center" }}>
        <button className="btn ghost" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={() => setView({ y: today.getFullYear(), m: today.getMonth() })}>📍 Hoje</button>
      </div>
      <div className="desc" style={{ marginTop: 6, textAlign: "center" }}>Clique num dia pra ouvir a data.</div>
      {birth && (
        <div className="desc" style={{ marginTop: 4, textAlign: "center", fontWeight: 800 }}>
          🎂 Seu aniversário: {birth.getDate()} de {months[birth.getMonth()][1]}
        </div>
      )}
    </div>
  );
}
