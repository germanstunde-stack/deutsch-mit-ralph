import { useEffect, useState, type MouseEvent } from "react";
import { CardGrid } from "./Cards";
import { Exercise } from "./Engines";
import { Flashcards } from "./Flashcards";
import { Calc, Clock, Calendar } from "./Tools";
import { ProgressDots } from "./ProgressDots";
import { exSpecsForTopic } from "../data/exercises";
import { topics } from "../data/topics";
import { explanations } from "../data/explanations";
import { sentences, deckForTopic } from "../data/extras";
import { speak } from "../lib/speech";
import { useScoredRound } from "../lib/scoring";
import { saveTopicScore } from "../data/topicScores";

const TOPIC_SIZE = 20;

export function TopicView({ id, onResult, next }: { id: string; onResult: (correct: number, wrong: number) => void; next: { id: string; label: string } | null }) {
  const meta = topics.find((t) => t.id === id)!;
  const [round, setRound] = useState(0);
  const [specs, setSpecs] = useState(() => exSpecsForTopic(id, TOPIC_SIZE));
  const scored = useScoredRound(TOPIC_SIZE);
  const deck = deckForTopic(id);
  const sents = sentences[id];

  function goNext() {
    // fecha a rodada atual: quem pulou sem responder perde o ponto (mesma regra do "trocar").
    scored.flushUnresolved(() => 1);
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
    setSpecs(exSpecsForTopic(id, TOPIC_SIZE));
    setRound((r) => r + 1);
  }
  function explClick(e: MouseEvent) {
    const t = (e.target as HTMLElement).closest("[data-say]");
    if (t) speak(t.getAttribute("data-say") || "");
  }

  // guarda a pontuação da rodada (20 pts) por capítulo — só o último round, sem histórico.
  useEffect(() => {
    if (scored.correct + scored.wrong === 0) return;
    saveTopicScore(id, { correct: scored.correct, wrong: scored.wrong, total: TOPIC_SIZE, at: Date.now() });
  }, [id, scored.correct, scored.wrong]);

  return (
    <section className="panel topic-sec" id={"top-" + id}>
      <h2>{meta.icon} {meta.name}</h2>
      <div className="tsplit">
        <div className="tcol left">
          <div className="subhead">{meta.cardTitle} — clique pra ouvir</div>
          <CardGrid id={id} />
        </div>
        <div className="tcol right">
          <div className="subhead">🗣️ Explicação &amp; pronúncia</div>
          <div className="expl" onClick={explClick} dangerouslySetInnerHTML={{ __html: explanations[id] ?? meta.explanationHTML }} />

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

          {sents && (<>
            <div className="subhead">💬 Frases de exemplo</div>
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
            <div className="subhead">🃏 Revisão rápida</div>
            <Flashcards deck={deck} />
          </>)}

          <div className="subhead">
            🎮 Praticar <span style={{ fontWeight: 400, fontSize: ".75rem", color: "var(--ink-soft)" }}>· clique pra ouvir as palavras sublinhadas · vale {TOPIC_SIZE} pontos</span>
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
          <div className="btnrow"><button className="btn ghost" onClick={trocar}>🔁 Trocar exercícios (20 novos)</button></div>
          <div className="btnrow" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={goNext}>{next ? `Próximo: ${next.label} →` : "Ir pra Prova 📝 →"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
