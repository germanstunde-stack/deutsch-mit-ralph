import { useEffect, useState } from "react";
import { useTheme } from "./theme";
import { MODULES } from "./data/modules";
import { LEVELS, isSection, isLevelUnlocked } from "./data/levels";
import { fetchMastery, computeUnlockedMax } from "./lib/progression";
import { TopicView } from "./components/TopicView";
import { Mascot } from "./components/Mascot";
import { BgArt } from "./components/BgArt";
import { CadernoPanel } from "./components/CadernoPanel";
import { Prova } from "./components/Prova";
import { Ranking } from "./components/Ranking";
import { AuthProvider, usePlayer } from "./auth/AuthProvider";
import { LoginScreen } from "./auth/LoginScreen";
import { Cadastro } from "./components/Cadastro";
import { Welcome } from "./components/Welcome";
import { I18nProvider, useI18n } from "./i18n/I18nProvider";

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function AppContent() {
  const { profile, session, signOut } = usePlayer();
  const { dark, toggleTheme, slow, toggleSpeed } = useTheme();
  const { lang, setLang, t } = useI18n();
  // abre no nível que a pessoa escolheu no cadastro (quem entrou antes dessa
  // funcionalidade não tem escolha salva e continua começando no A0).
  const [activeModule, setActiveModule] = useState(
    () => (profile?.starting_level && MODULES[profile.starting_level] ? profile.starting_level : "A0"),
  );
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [frost, setFrost] = useState(false);
  const [mastery, setMastery] = useState<Record<string, boolean>>({});

  function refreshMastery() {
    if (session) fetchMastery(session.user.id).then(setMastery);
  }
  useEffect(refreshMastery, [session]);

  const unlockedMax = computeUnlockedMax(profile?.starting_level ?? null, mastery);

  // Isto TEM que vir antes de qualquer uso de MODULES[activeModule]: o tsconfig
  // não liga noUncheckedIndexedAccess, então `MODULES[id]` é tipado como
  // ModuleDef mesmo quando o id é de uma seção — e viraria TypeError em runtime
  // na linha seguinte, sem uma palavra do compilador.
  const secao = isSection(activeModule);
  const mod = secao ? null : MODULES[activeModule];
  const topics = mod ? mod.topicsFor(lang) : [];

  function reportResult(correct: number, wrong: number) {
    if (correct === 0 && wrong === 0) return;
    setStats((s) => ({ correct: s.correct + correct, wrong: s.wrong + wrong }));
  }

  return (
    <>
      <BgArt moduleId={activeModule} />
      <div className="wrap">
        <div className="top">
          {/* cruz desenhada em CSS, não o emoji 🇨🇭: no Windows a bandeira não
              renderiza como bandeira, sai como as duas letras "CH" */}
          <div className="brand"><span className="flag chflag" aria-label="Suíça" /><div><small>Swiss</small><b>Stunde</b></div></div>
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
          {LEVELS.map((lv) => {
            // nunca pelo índice do trilho: as seções ficam DEPOIS do C2 no
            // array, e comparar índice as deixaria trancadas até o C1 — o
            // oposto de "sempre abertas".
            const unlocked = isLevelUnlocked(lv, unlockedMax);
            const clickable = lv.builtYet && unlocked;
            const title = !lv.builtYet ? "em breve"
              : lv.kind === "section" ? "sempre aberto, em qualquer nível"
              : !unlocked ? "complete a Prova do módulo anterior com 96% pra desbloquear" : "";
            return (
              <button key={lv.id} className={"lvl" + (lv.kind === "section" ? " section" : "") + (lv.id === activeModule ? " active" : "") + (clickable ? "" : " locked")}
                title={title} onClick={() => clickable && setActiveModule(lv.id)}>
                <div className="bub">{lv.icon ?? lv.id}</div><span className="lab">{lv.icon ? lv.sub : lv.id}</span>{lv.icon ? null : <span className="sub">{lv.sub}</span>}
              </button>
            );
          })}
        </div>

        <div className="index">
          <button className="note" onClick={() => jump("caderno")}>{t("nav_caderno")}</button>
          {topics.map((tp) => (
            <button key={tp.id} onClick={() => jump("top-" + tp.id)}>{tp.icon} {tp.name}</button>
          ))}
          {mod && <button className="exam" onClick={() => jump("prova")}>{t("nav_prova")}</button>}
          <button className="note" onClick={() => jump("ranking")}>{t("nav_ranking")}</button>
        </div>

        <CadernoPanel />

        {/* É esta linha que entrega "seção não tem Prova": o <Prova> era
            renderizado sempre, e uma seção fingindo de módulo mostraria
            "Prova GEO — 0 pontos" com 100*0/0 = NaN. */}
        {mod && (<>
          <div className={"topics-wrap" + (frost ? " exam-blur" : "")}>
            {topics.map((tp, i) => (
              <TopicView key={mod.id + ":" + tp.id} id={tp.id} mod={mod} onResult={reportResult}
                next={topics[i + 1] ? { id: topics[i + 1].id, label: topics[i + 1].icon + " " + topics[i + 1].name } : null} />
            ))}
          </div>

          <Prova key={mod.id} mod={mod} onFrost={setFrost} onSaved={refreshMastery} />
        </>)}

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
  const [justRegistered, setJustRegistered] = useState(false);
  if (loading) return <div className="login-wrap"><div className="login"><p>Carregando…</p></div></div>;
  if (!session) return <LoginScreen />;
  if (!profile?.display_name || !profile?.birthdate) return <Cadastro onDone={() => setJustRegistered(true)} />;
  if (justRegistered) return <Welcome onContinue={() => setJustRegistered(false)} />;
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
