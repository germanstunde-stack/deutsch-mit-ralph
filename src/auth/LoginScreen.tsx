import { useState } from "react";
import { usePlayer } from "./AuthProvider";
import { Mascot } from "../components/Mascot";

export function LoginScreen() {
  const { login } = usePlayer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  async function go() {
    if (!email.trim() || !password) return;
    setBusy(true); setErr(null);
    const { error, needsConfirmation } = await login(email, password);
    setBusy(false);
    if (error) setErr(error);
    else if (needsConfirmation) setPendingConfirm(true);
    // sucesso: onAuthStateChange do AuthProvider assume a partir daqui.
  }

  return (
    <div className="login-wrap">
      <div className="login">
        <Mascot className="mascot" />
        <h1><span className="hallo plush">Grüezi!</span> SwissStunde</h1>
        {pendingConfirm ? (
          <p>📬 Sua conta foi criada, mas o Supabase pediu confirmação por e-mail. Confira sua caixa de entrada, ou peça pra desativar essa confirmação nas configurações do projeto.</p>
        ) : (
          <>
            <p>Digite seu e-mail e uma senha. Na 1ª vez a conta é criada na hora — sem confirmação, sem complicação. O navegador pode salvar a senha pra você.</p>
            <input className="field" type="email" autoComplete="username" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
            <input className="field" type="password" autoComplete="current-password" placeholder="senha"
              value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
            <button className="btn primary" disabled={busy || !email.trim() || !password} onClick={go}>{busy ? "Entrando…" : "Entrar 🚀"}</button>
          </>
        )}
        {err && <div className="err">{err}</div>}
      </div>
    </div>
  );
}
