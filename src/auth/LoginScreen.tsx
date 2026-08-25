import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Mascot } from "../components/Mascot";

export function LoginScreen() {
  const { sendCode, verify } = useAuth();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ t: "err" | "ok"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true); setMsg(null);
    const { error } = await sendCode(email.trim());
    setBusy(false);
    if (error) setMsg({ t: "err", m: error });
    else { setStep("code"); setMsg({ t: "ok", m: "Enviamos um código de 6 dígitos pro seu e-mail." }); }
  }
  async function ver() {
    setBusy(true); setMsg(null);
    const { error } = await verify(email.trim(), code.trim());
    setBusy(false);
    if (error) setMsg({ t: "err", m: error });
  }

  return (
    <div className="login-wrap">
      <div className="login">
        <Mascot className="mascot" />
        <h1><span className="hallo plush">Hallo!</span> Deutsch mit Ralph</h1>
        <p>Entre só com seu e-mail — sem senha.</p>
        {step === "email" ? (
          <>
            <input className="field" type="email" autoComplete="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className="btn primary" disabled={busy || !email} onClick={send}>{busy ? "Enviando…" : "Enviar código →"}</button>
          </>
        ) : (
          <>
            <input className="field" inputMode="numeric" autoComplete="one-time-code" placeholder="código de 6 dígitos"
              value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ver()} />
            <button className="btn primary" disabled={busy || !code} onClick={ver}>{busy ? "Verificando…" : "Entrar"}</button>
            <div className="btnrow" style={{ justifyContent: "center" }}>
              <button className="tbtn" onClick={() => { setStep("email"); setMsg(null); }}>← trocar e-mail</button>
            </div>
          </>
        )}
        {msg && <div className={msg.t === "err" ? "err" : "ok"}>{msg.m}</div>}
      </div>
    </div>
  );
}
