import { useState } from "react";
import { useTheme } from "./theme";
import { topics } from "./data/topics";
import { TopicView } from "./components/TopicView";
import { Mascot } from "./components/Mascot";
import { BgArt } from "./components/BgArt";
import { CadernoPanel } from "./components/CadernoPanel";
import { Prova } from "./components/Prova";

// LOGIN DESLIGADO por enquanto (código de auth/cadastro/ranking pronto e desligado).
const LEVELS: [string, string, boolean][] = [
  ["A0", "do zero", true], ["A1", "frases", false], ["A2", "dia a dia", false],
  ["B1", "independente", false], ["B2", "fluência", false], ["C1", "avançado", false], ["C2", "executivo", false],
];

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function App() {
  const { dark, toggleTheme, slow, toggleSpeed } = useTheme();
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [frost, setFrost] = useState(false);

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
            <p>Role a página, ouça e pratique cada tema. No fim, a prova. 🎧</p>
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
          <button className="note" onClick={() => jump("caderno")}>📓 Caderno</button>
          {topics.map((t) => (
            <button key={t.id} onClick={() => jump("top-" + t.id)}>{t.icon} {t.name}</button>
          ))}
          <button className="exam" onClick={() => jump("prova")}>📝 Prova</button>
        </div>

        <CadernoPanel />

        <div className={"topics-wrap" + (frost ? " exam-blur" : "")}>
          {topics.map((t, i) => (
            <TopicView key={t.id} id={t.id} onResult={reportResult}
              next={topics[i + 1] ? { id: topics[i + 1].id, label: topics[i + 1].icon + " " + topics[i + 1].name } : null} />
          ))}
        </div>

        <Prova onFrost={setFrost} />

        <footer style={{ marginTop: 28, textAlign: "center", color: "var(--ink-soft)", fontWeight: 700, fontSize: ".8rem" }}>
          GermanStunde · Módulo A0 — feito pra crescer até o C2. Viel Erfolg! 🎉
        </footer>
      </div>
    </>
  );
}
