import { useEffect, useRef, useState } from "react";
import { CardGrid } from "./Cards";
import { Exercise } from "./Engines";
import { Flashcards } from "./Flashcards";
import { Calc, Clock, Calendar } from "./Tools";
import { ProgressDots } from "./ProgressDots";
import type { ModuleDef } from "../data/modules";
import { speak } from "../lib/speech";
import { sayOnClick } from "../lib/sayDelegation";
import { useScoredRound } from "../lib/scoring";
import { saveTopicScore } from "../data/topicScores";
import { usePlayer } from "../auth/AuthProvider";
import { useI18n } from "../i18n/I18nProvider";
import { supabase } from "../lib/supabase";

const TOPIC_SIZE = 20;

export function TopicView({ id, mod, onResult, next }: { id: string; mod: ModuleDef; onResult: (correct: number, wrong: number) => void; next: { id: string; label: string } | null }) {
  const { session, profile } = usePlayer();
  const { lang, t } = useI18n();
  const meta = mod.topicsFor(lang).find((tp) => tp.id === id)!;
  const [round, setRound] = useState(0);
  const [specs, setSpecs] = useState(() => mod.exSpecsForTopic(id, lang, TOPIC_SIZE));
  const scored = useScoredRound(TOPIC_SIZE);
  const deck = mod.deckForTopic(id, lang);
  const sents = mod.sentencesForTopic(id, profile, lang);
  const submittedRef = useRef(false);

  function goNext() {
    // fecha a rodada atual: quem pulou sem responder perde o ponto (mesma regra do "trocar").
    // flushUnresolved devolve o que ELE somou agora — soma ao "scored.wrong" atual (o state só
    // atualiza no próximo render, então não dá pra ler scored.wrong direto aqui e confiar nele).
    const addedNow = scored.flushUnresolved(() => 1);
    // manda pro ranking (categoria "Exercícios") só uma vez por rodada — global, não filtrado
    // por módulo (mesmo comportamento de hoje, ver plano do A1).
    if (session && !submittedRef.current) {
      submittedRef.current = true;
      supabase.rpc("add_exercise_result", { p_correct: scored.correct, p_wrong: scored.wrong + addedNow }).then(({ error }) => {
        if (error) console.warn("ranking (exercícios):", error.message);
      });
    }
    const target = next ? "top-" + next.id : "prova";
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  }

  function resolve(i: number, c: number, w: number) {
    if (scored.resolve(i, c, w)) onResult(c, w);
  }
  function trocar() {
    const added = scored.flushUnresolved(() => 1);
    if (added > 0) onResult(0, added);
    scored.reset(TOPIC_SIZE);
    submittedRef.current = false;
    setSpecs(mod.exSpecsForTopic(id, lang, TOPIC_SIZE));
    setRound((r) => r + 1);
  }

  // guarda a pontuação da rodada (20 pts) por capítulo — chave prefixada com o módulo
  // pra não colidir entre A0/A1/etc. Só o último round, sem histórico.
  useEffect(() => {
    if (scored.correct + scored.wrong === 0) return;
    saveTopicScore(`${mod.id}:${id}`, { correct: scored.correct, wrong: scored.wrong, total: TOPIC_SIZE, at: Date.now() });
  }, [mod.id, id, scored.correct, scored.wrong]);

  return (
    <section className="panel topic-sec" id={"top-" + id}>
      <h2>{meta.icon} {meta.name}</h2>
      <div className="tsplit">
        <div className="tcol left">
          <div className="subhead">{meta.cardTitle} — {t("card_click_hint")}</div>
          <CardGrid {...mod.cardsForTopic(id, lang)} />
        </div>
        <div className="tcol right">
          <div className="subhead">{t("explanation_title")}</div>
          <div className="expl" onClick={sayOnClick} dangerouslySetInnerHTML={{ __html: mod.explanationsFor(lang)[id] ?? meta.explanationHTML }} />

          {id === "numeros" && (<>
            <div className="subhead">🧮 Calculadora falante <span style={{ fontWeight: 400, fontSize: ".75rem", color: "var(--ink-soft)" }}>· acerte pra ouvir a conta</span></div>
            <Calc />
            <div className="subhead">⏰ Relógio (24h)</div>
            <Clock />
          </>)}
          {id === "dias" && (<>
            <div className="subhead">📅 Calendário</div>
            <Calendar />
          </>)}

          {sents.length > 0 && (<>
            <div className="subhead">{t("example_sentences_title")}</div>
            <div className="sents">
              {sents.map((s, i) => (
                <div className="sent" key={i}>
                  <div className="txt"><span className="de">{s[0]}</span><span className="pt">{s[1]}</span></div>
                  <button className="listen play" onClick={() => speak(s[0])}>🔊</button>
                </div>
              ))}
            </div>
          </>)}

          {deck.length > 0 && (<>
            <div className="subhead">{t("quick_review_title")}</div>
            <Flashcards deck={deck} />
          </>)}

          <div className="subhead">
            {t("practice_title")} <span style={{ fontWeight: 400, fontSize: ".75rem", color: "var(--ink-soft)" }}>{t("practice_hint", { n: TOPIC_SIZE })}</span>
          </div>
          <div className="scorebar">
            <ProgressDots status={scored.status} onJump={(i) => document.getElementById(`ex-${id}-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" })} />
            <span className="scoretag">✅ {scored.correct} · ❌ {scored.wrong}</span>
          </div>
          {specs.map((s, i) => (
            <div id={`ex-${id}-${i}`} key={round + "-" + i}>
              <Exercise spec={s} num={i + 1} onResolve={(c, w) => resolve(i, c, w)} />
            </div>
          ))}
          <div className="btnrow"><button className="btn ghost" onClick={trocar}>{t("retry_btn", { n: TOPIC_SIZE })}</button></div>
          <div className="btnrow" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={goNext}>{next ? t("next_chapter_btn", { label: next.label }) : t("next_exam_btn")}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
