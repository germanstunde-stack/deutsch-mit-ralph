import { useRef, useState, type MouseEvent } from "react";
import { CardGrid } from "./Cards";
import { Exercise } from "./Engines";
import { Flashcards } from "./Flashcards";
import { Calc, Clock, Calendar } from "./Tools";
import { exSpecsForTopic } from "../data/exercises";
import { topics } from "../data/topics";
import { explanations } from "../data/explanations";
import { sentences, deckForTopic } from "../data/extras";
import { speak } from "../lib/speech";

export function TopicView({ id, onResult, next }: { id: string; onResult: (correct: number, wrong: number) => void; next: { id: string; label: string } | null }) {
  const meta = topics.find((t) => t.id === id)!;
  function goNext() {
    const target = next ? "top-" + next.id : "prova";
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  }
  const [round, setRound] = useState(0);
  const [specs, setSpecs] = useState(() => exSpecsForTopic(id));
  const resolvedRef = useRef<boolean[]>([]);
  const deck = deckForTopic(id);
  const sents = sentences[id];

  function resolve(i: number, c: number, w: number) {
    if (resolvedRef.current[i]) return;
    resolvedRef.current[i] = true;
    onResult(c, w);
  }
  function trocar() {
    const unresolved = specs.filter((_, i) => !resolvedRef.current[i]).length;
    if (unresolved > 0) onResult(0, unresolved);
    resolvedRef.current = [];
    setSpecs(exSpecsForTopic(id));
    setRound((r) => r + 1);
  }
  function explClick(e: MouseEvent) {
    const t = (e.target as HTMLElement).closest("[data-say]");
    if (t) speak(t.getAttribute("data-say") || "");
  }

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

          <div className="subhead">🎮 Praticar <span style={{ fontWeight: 400, fontSize: ".75rem", color: "var(--ink-soft)" }}>· clique pra ouvir as palavras sublinhadas</span></div>
          {specs.map((s, i) => (
            <Exercise key={round + "-" + i} spec={s} num={i + 1} onResolve={(c, w) => resolve(i, c, w)} />
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
