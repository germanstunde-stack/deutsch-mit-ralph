import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { LoginScreen } from "./auth/LoginScreen";
import { useTheme } from "./theme";
import { topics } from "./data/topics";
import { TopicView } from "./components/TopicView";
import { Ranking } from "./components/Ranking";
import { Mascot } from "./components/Mascot";
import { supabase } from "./lib/supabase";

const LEVELS: [string, string, boolean][] = [
  ["A0", "do zero", true], ["A1", "frases", false], ["A2", "dia a dia", false],
  ["B1", "independente", false], ["B2", "fluência", false], ["C1", "avançado", false], ["C2", "executivo", false],
];

function NameScreen() {
  const { saveName } = useAuth();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="login-wrap">
      <div className="login">
        <Mascot className="mascot" />
        <h1>Como você quer aparecer?</h1>
        <p>Esse nome vai no ranking. Pode ser seu apelido.</p>
        <input className="field" placeholder="ex.: Ralph" value={name} maxLength={24}
          onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && (setBusy(true), saveName(name.trim()))} />
        <button className="btn primary" disabled={busy || !name.trim()} onClick={() => { setBusy(true); saveName(name.trim()); }}>
          {busy ? "Salvando…" : "Começar 🚀"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { loading, session, profile, signOut } = useAuth();
  const { dark, toggleTheme, slow, toggleSpeed } = useTheme();
  const [tab, setTab] = useState<string>("alfabeto");
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  function reportResult(correct: number, wrong: number) {
    if (correct === 0 && wrong === 0) return;
    setStats((s) => ({ correct: s.correct + correct, wrong: s.wrong + wrong }));
    // grava no ranking (RLS garante que é o próprio usuário)
    supabase.rpc("add_exercise_result", { p_correct: correct, p_wrong: wrong }).then(({ error }) => {
      if (error) console.warn("stats:", error.message);
    });
  }

  if (loading) return <div className="login-wrap"><div className="login"><Mascot className="mascot" /><p className="desc">Carregando…</p></div></div>;
  if (!session) return <LoginScreen />;
  if (profile && !profile.display_name) return <NameScreen />;

  return (
    <div className="wrap">
      <div className="top">
        <div className="brand"><span className="flag">🇩🇪</span><div><small>Deutsch mit</small><b>Ralph</b></div></div>
        <div className="tbtns">
          <span className="tbtn" title="acertos/erros nesta sessão">✅ {stats.correct} · ❌ {stats.wrong}</span>
          <button className="tbtn" onClick={toggleSpeed}>{slow ? "🐇 Normal" : "🐢 Devagar"}</button>
          <button className="tbtn" onClick={toggleTheme}>{dark ? "☀️ Tema" : "🌙 Tema"}</button>
          <button className="tbtn" onClick={() => signOut()}>Sair</button>
        </div>
      </div>

      <section className="hero">
        <Mascot className="mascot" />
        <div>
          <h1><span className="hallo plush">Hallo, {profile?.display_name}!</span> Bem-vindo ao seu app de alemão.</h1>
          <p>Escolha um tema, ouça, pratique — cada acerto/erro vai pro seu ranking. 🎧</p>
        </div>
      </section>

      <div className="levels">
        {LEVELS.map(([lv, sub, open]) => (
          <button key={lv} className={"lvl" + (lv === "A0" ? " active" : "") + (open ? "" : " locked")} title={open ? "" : "em breve"}>
            <div className="bub">{lv}</div><span className="lab">{lv}</span><span className="sub">{sub}</span>
          </button>
        ))}
      </div>

      <div className="index">
        {topics.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => { setTab(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            {t.icon} {t.name}
          </button>
        ))}
        <button className={tab === "ranking" ? "active" : ""} onClick={() => { setTab("ranking"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>🏆 Ranking</button>
      </div>

      {tab === "ranking" ? <Ranking /> : <TopicView key={tab} id={tab} onResult={reportResult} />}
    </div>
  );
}
