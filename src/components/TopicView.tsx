import { useRef, useState, type MouseEvent } from "react";
import { CardGrid } from "./Cards";
import { Exercise } from "./Engines";
import { exSpecsForTopic } from "../data/exercises";
import { topics } from "../data/topics";
import { explanations } from "../data/explanations";
import { speak } from "../lib/speech";

export function TopicView({ id, onResult }: { id: string; onResult: (correct: number, wrong: number) => void }) {
  const meta = topics.find((t) => t.id === id)!;
  const [round, setRound] = useState(0);
  const [specs, setSpecs] = useState(() => exSpecsForTopic(id));
  const resolvedRef = useRef<boolean[]>([]);

  function resolve(i: number, c: number, w: number) {
    if (resolvedRef.current[i]) return;
    resolvedRef.current[i] = true;
    onResult(c, w);
  }
  function trocar() {
    const unresolved = specs.filter((_, i) => !resolvedRef.current[i]).length;
    if (unresolved > 0) onResult(0, unresolved); // não-preenchidos contam como erro
    resolvedRef.current = [];
    setSpecs(exSpecsForTopic(id));
    setRound((r) => r + 1);
  }
  function explClick(e: MouseEvent) {
    const t = (e.target as HTMLElement).closest("[data-say]");
    if (t) speak(t.getAttribute("data-say") || "");
  }

  return (
    <section className="panel">
      <h2>{meta.icon} {meta.name}</h2>
      <div className="tsplit">
        <div className="tcol left">
          <div className="subhead">{meta.cardTitle} — clique pra ouvir</div>
          <CardGrid id={id} />
        </div>
        <div className="tcol right">
          <div className="subhead">🗣️ Explicação &amp; pronúncia</div>
          <div className="expl" onClick={explClick} dangerouslySetInnerHTML={{ __html: explanations[id] ?? meta.explanationHTML }} />
          <div className="subhead">🎮 Praticar <span style={{ fontWeight: 400, fontSize: ".75rem", color: "var(--ink-soft)" }}>· conta pro ranking (clique pra ouvir as palavras sublinhadas)</span></div>
          {specs.map((s, i) => (
            <Exercise key={round + "-" + i} spec={s} num={i + 1} onResolve={(c, w) => resolve(i, c, w)} />
          ))}
          <div className="btnrow"><button className="btn ghost" onClick={trocar}>🔁 Trocar exercícios</button></div>
        </div>
      </div>
    </section>
  );
}
