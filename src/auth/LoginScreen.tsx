import { useState } from "react";
import { usePlayer } from "./AuthProvider";
import { Mascot } from "../components/Mascot";

export function LoginScreen() {
  const { sendLink } = usePlayer();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    if (!email.trim()) return;
    setBusy(true); setErr(null);
    const { error } = await sendLink(email.trim());
    setBusy(false);
    if (error) setErr(error);
    else setSent(true);
  }

  return (
    <div className="login-wrap">
      <div className="login">
        <Mascot className="mascot" />
        <h1><span className="hallo plush">Hallo!</span> GermanStunde</h1>
        {sent ? (
          <>
            <p>📬 Enviamos um <b>link de acesso</b> para <b>{email}</b>. Abra o e-mail e clique no link — você só faz isso <b>uma vez</b>.</p>
            <button className="tbtn" onClick={() => { setSent(false); setEmail(""); }}>usar outro e-mail</button>
          </>
        ) : (
          <>
            <p>Entre com seu e-mail. Na 1ª vez confirmamos por um link; depois é só entrar.</p>
            <input className="field" type="email" autoComplete="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className="btn primary" disabled={busy || !email.trim()} onClick={send}>{busy ? "Enviando…" : "Enviar link de acesso →"}</button>
          </>
        )}
        {err && <div className="err">{err}</div>}
      </div>
    </div>
  );
}
