import { useState } from "react";
import { useTheme } from "./theme";
import { topics } from "./data/topics";
import { TopicView } from "./components/TopicView";
import { Mascot } from "./components/Mascot";
import { BgArt } from "./components/BgArt";

// LOGIN DESLIGADO por enquanto (o código de auth/cadastro/ranking está pronto em
// auth/AuthProvider, auth/LoginScreen, components/Cadastro, components/Ranking e na
// migração 0003 — é só religar quando o envio de e-mail estiver configurado).

const LEVELS: [string, string, boolean][] = [
  ["A0", "do zero", true], ["A1", "frases", false], ["A2", "dia a dia", false],
  ["B1", "independente", false], ["B2", "fluência", false], ["C1", "avançado", false], ["C2", "executivo", false],
];

export default function App() {
  const { dark, toggleTheme, slow, toggleSpeed } = useTheme();
  const [tab, setTab] = useState<string>("alfabeto");
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  function reportResult(correct: number, wrong: number) {
    if (correct === 0 && wrong === 0) return;
    setStats((s) => ({ correct: s.correct + correct, wrong: s.wrong + wrong }));
  }

  return (
    <>
    <BgArt />
    <div className="wrap">
      <div className="top">
        <div className="brand"><span className="flag">🇩🇪</span><div><small>German</small><b>Stunde</b></div></div>
        <div className="tbtns">
          <span className="tbtn" title="acertos/erros nesta sessão">✅ {stats.correct} · ❌ {stats.wrong}</span>
          <button className="tbtn" onClick={toggleSpeed}>{slow ? "🐇 Normal" : "🐢 Devagar"}</button>
          <button className="tbtn" onClick={toggleTheme}>{dark ? "☀️ Tema" : "🌙 Tema"}</button>
        </div>
      </div>

      <section className="hero">
        <Mascot className="mascot" />
        <div>
          <h1><span className="hallo plush">Hallo!</span> Bem-vindo à GermanStunde.</h1>
          <p>Escolha um tema, ouça e pratique. 🎧</p>
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

      {tab === "ranking" ? (
        <section className="panel">
          <h2>🏆 Ranking</h2>
          <p className="desc">O ranking entre pessoas liga junto com o login (em breve). Por enquanto, seu placar desta sessão:</p>
          <div className="stat-row">
            <div className="stat"><div className="v">{stats.correct}</div><div className="k">acertos</div></div>
            <div className="stat"><div className="v">{stats.wrong}</div><div className="k">erros</div></div>
            <div className="stat"><div className="v">{stats.correct + stats.wrong > 0 ? Math.round((100 * stats.correct) / (stats.correct + stats.wrong)) : 0}%</div><div className="k">aproveitamento</div></div>
          </div>
        </section>
      ) : (
        <TopicView key={tab} id={tab} onResult={reportResult} />
      )}
    </div>
    </>
  );
}
