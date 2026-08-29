import { useState } from "react";
import { usePlayer } from "../auth/AuthProvider";
import { Mascot } from "./Mascot";
import { LEVELS } from "../data/levels";
import { MODULES } from "../data/modules";

function summaryFor(levelId: string): string[] | null {
  const mod = MODULES[levelId];
  if (!mod) return null;
  return mod.topicsFor("pt").map((t) => `${t.icon} ${t.name}`);
}

export function Cadastro({ onDone }: { onDone: () => void }) {
  const { saveProfile } = usePlayer();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [level, setLevel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const summary = level ? summaryFor(level) : null;

  async function save() {
    if (!name.trim() || !birth) { setErr("Preencha apelido e data de nascimento."); return; }
    if (!level) { setErr("Escolha o nível de início."); return; }
    setBusy(true); setErr(null);
    const { error } = await saveProfile(name.trim(), birth, level);
    setBusy(false);
    if (error) setErr(error);
    else onDone();
  }

  return (
    <div className="login-wrap">
      <div className="login cadastro">
        <Mascot className="mascot" />
        <h1>Quase lá! 🎉</h1>
        <p>Complete seu cadastro. No ranking aparecem só o <b>apelido</b> e a <b>data de nascimento</b> — nunca seu e-mail.</p>
        <input className="field" placeholder="apelido" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} />
        <label className="desc" style={{ display: "block", textAlign: "left", margin: "0 4px 4px", fontWeight: 800 }}>Data de nascimento</label>
        <input className="field" type="date" max={today} value={birth} onChange={(e) => setBirth(e.target.value)} />

        <label className="desc" style={{ display: "block", textAlign: "left", margin: "10px 4px 4px", fontWeight: 800 }}>Nível de início</label>
        <p className="desc" style={{ textAlign: "left", margin: "0 4px 8px" }}>Já sabe um pouco de alemão? Comece de onde fizer sentido — dá pra revisar os níveis anteriores a qualquer hora, mas só avança pros próximos completando a Prova de cada módulo com 96% de acerto.</p>
        <div className="levels">
          {LEVELS.map((lv) => (
            <button key={lv.id} type="button" className={"lvl" + (level === lv.id ? " active" : "") + (lv.builtYet ? "" : " locked")}
              title={lv.builtYet ? "" : "em breve"} onClick={() => lv.builtYet && setLevel(lv.id)}>
              <div className="bub">{lv.id}</div><span className="lab">{lv.id}</span><span className="sub">{lv.sub}</span>
            </button>
          ))}
        </div>

        {summary && (
          <div className="level-summary">
            <div className="subhead" style={{ marginTop: 0 }}>{summary.length} capítulos do módulo {level}</div>
            <div className="level-summary-list">
              {summary.map((line, i) => <span key={i} className="level-summary-item">{line}</span>)}
            </div>
          </div>
        )}

        <button className="btn primary" style={{ marginTop: 14 }} disabled={busy || !name.trim() || !birth || !level} onClick={save}>{busy ? "Salvando…" : "Confirmar 🚀"}</button>
        {err && <div className="err">{err}</div>}
      </div>
    </div>
  );
}
