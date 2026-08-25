import { useState } from "react";
import { usePlayer } from "../auth/AuthProvider";
import { Mascot } from "./Mascot";

export function Cadastro() {
  const { saveProfile } = usePlayer();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function save() {
    if (!name.trim() || !birth) { setErr("Preencha apelido e data de nascimento."); return; }
    setBusy(true); setErr(null);
    const { error } = await saveProfile(name.trim(), birth);
    setBusy(false);
    if (error) setErr(error);
  }

  return (
    <div className="login-wrap">
      <div className="login">
        <Mascot className="mascot" />
        <h1>Quase lá! 🎉</h1>
        <p>Complete seu cadastro. No ranking aparecem só o <b>apelido</b> e a <b>data de nascimento</b> — nunca seu e-mail.</p>
        <input className="field" placeholder="apelido" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} />
        <label className="desc" style={{ display: "block", textAlign: "left", margin: "0 4px 4px", fontWeight: 800 }}>Data de nascimento</label>
        <input className="field" type="date" max={today} value={birth} onChange={(e) => setBirth(e.target.value)} />
        <button className="btn primary" disabled={busy || !name.trim() || !birth} onClick={save}>{busy ? "Salvando…" : "Entrar 🚀"}</button>
        {err && <div className="err">{err}</div>}
      </div>
    </div>
  );
}
