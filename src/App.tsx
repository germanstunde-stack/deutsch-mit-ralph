import { useState } from "react";
import { useTheme } from "./theme";
import { MODULES } from "./data/modules";
import { TopicView } from "./components/TopicView";
import { Mascot } from "./components/Mascot";
import { BgArt } from "./components/BgArt";
import { CadernoPanel } from "./components/CadernoPanel";
import { Prova } from "./components/Prova";
import { Ranking } from "./components/Ranking";
import { AuthProvider, usePlayer } from "./auth/AuthProvider";
import { LoginScreen } from "./auth/LoginScreen";
import { Cadastro } from "./components/Cadastro";
import { I18nProvider, useI18n } from "./i18n/I18nProvider";

const LEVELS: { id: string; sub: string; open: boolean }[] = [
  { id: "A0", sub: "do zero", open: true }, { id: "A1", sub: "frases", open: true }, { id: "A2", sub: "dia a dia", open: false },
  { id: "B1", sub: "independente", open: false }, { id: "B2", sub: "fluência", open: false }, { id: "C1", sub: "avançado", open: false }, { id: "C2", sub: "executivo", open: false },
];

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function AppContent() {
  const { profile, signOut } = usePlayer();
  const { dark, toggleTheme, slow, toggleSpeed } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [activeModule, setActiveModule] = useState("A0");
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [frost, setFrost] = useState(false);

  const mod = MODULES[activeModule];
  const topics = mod.topicsFor(lang);

  function reportResult(correct: number, wrong: number) {
    if (correct === 0 && wrong === 0) return;
    setStats((s) => ({ correct: s.correct + correct, wrong: s.wrong + wrong }));
  }

  return (
    <>
      <BgArt moduleId={activeModule} />
      <div className="wrap">
        <div className="top">
          <div className="brand"><span className="flag">🇩🇪</span><div><small>German</small><b>Stunde</b></div></div>
          <div className="tbtns">
            <span className="tbtn" title={t("score_title")}>✅ {stats.correct} · ❌ {stats.wrong}</span>
            <button className="tbtn" onClick={() => setLang(lang === "en" ? "pt" : "en")} title="idioma / language">{lang === "en" ? "🇬🇧 English" : "🇧🇷 Português"}</button>
            <button className="tbtn" onClick={toggleSpeed} title={t("speed_title")}>{slow ? t("speed_slow") : t("speed_normal")}</button>
            <button className="tbtn" onClick={toggleTheme}>{dark ? t("theme_dark") : t("theme_light")}</button>
            <button className="tbtn" onClick={signOut} title={t("signout_title")}>{t("signout")}</button>
          </div>
        </div>

        <section className="hero">
          <Mascot className="mascot" />
          <div>
            <h1><span className="hallo plush">Hallo{profile?.display_name ? `, ${profile.display_name}` : ""}!</span> {t("welcome")}</h1>
            <p>{t("hero_sub")}</p>
          </div>
        </section>

        <div className="levels">
          {LEVELS.map((lv) => (
            <button key={lv.id} className={"lvl" + (lv.id === activeModule ? " active" : "") + (lv.open ? "" : " locked")}
              title={lv.open ? "" : "em breve"} onClick={() => lv.open && setActiveModule(lv.id)}>
              <div className="bub">{lv.id}</div><span className="lab">{lv.id}</span><span className="sub">{lv.sub}</span>
            </button>
          ))}
        </div>

        <div className="index">
          <button className="note" onClick={() => jump("caderno")}>{t("nav_caderno")}</button>
          {topics.map((tp) => (
            <button key={tp.id} onClick={() => jump("top-" + tp.id)}>{tp.icon} {tp.name}</button>
          ))}
          <button className="exam" onClick={() => jump("prova")}>{t("nav_prova")}</button>
          <button className="note" onClick={() => jump("ranking")}>{t("nav_ranking")}</button>
        </div>

        <CadernoPanel />

        <div className={"topics-wrap" + (frost ? " exam-blur" : "")}>
          {topics.map((tp, i) => (
            <TopicView key={mod.id + ":" + tp.id} id={tp.id} mod={mod} onResult={reportResult}
              next={topics[i + 1] ? { id: topics[i + 1].id, label: topics[i + 1].icon + " " + topics[i + 1].name } : null} />
          ))}
        </div>

        <Prova key={mod.id} mod={mod} onFrost={setFrost} />

        <Ranking />

        <footer style={{ marginTop: 28, textAlign: "center", color: "var(--ink-soft)", fontWeight: 700, fontSize: ".8rem" }}>
          {t("footer", { module: activeModule })}
        </footer>
      </div>
    </>
  );
}

function Gate() {
  const { loading, session, profile } = usePlayer();
  if (loading) return <div className="login-wrap"><div className="login"><p>Carregando…</p></div></div>;
  if (!session) return <LoginScreen />;
  if (!profile?.display_name || !profile?.birthdate) return <Cadastro />;
  return <AppContent />;
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </I18nProvider>
  );
}
