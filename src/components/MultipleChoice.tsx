import { useState } from "react";
import type { Question } from "../data/generators";
import { speak } from "../lib/speech";

export function MultipleChoice({ q, num, onResolve }: { q: Question; num: number; onResolve: (correct: number, wrong: number) => void }) {
  const [answered, setAnswered] = useState(false);
  const [missed, setMissed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  function click(i: number, correct: boolean) {
    if (answered) return;
    if (correct) {
      setAnswered(true); setPicked(i);
      onResolve(missed ? 0 : 1, missed ? 0 : 0); // se já errou, o erro já foi contado
    } else {
      if (!missed) { onResolve(0, 1); setMissed(true); }
      setPicked(i);
      setTimeout(() => setPicked((p) => (p === i ? null : p)), 400);
    }
  }

  return (
    <div className="qcard">
      <p className="q">
        <span className="num">{num}</span>
        <span className="txt" dangerouslySetInnerHTML={{ __html: q.promptHTML }} />
        {q.speak && <button className="listen" onClick={() => speak(q.speak!)}>🔊 ouvir</button>}
      </p>
      {q.meaning && <p className="meaning" dangerouslySetInnerHTML={{ __html: q.meaning }} />}
      <div className="opts">
        {q.options.map((o, i) => {
          const cls = "opt" + (q.big ? " big" : "") + (o.sw ? " swatch" : "") +
            (answered && o.correct ? " correct" : "") + (picked === i && !o.correct ? " wrong" : "") + (answered && !o.correct ? " dim" : "");
          return (
            <button key={i} className={cls}
              style={o.sw ? { background: o.sw, boxShadow: o.sw === "#FFFFFF" ? "inset 0 0 0 3px var(--border)" : undefined } : undefined}
              aria-label={o.sw ? o.label : undefined} onClick={() => click(i, o.correct)}>
              {o.sw ? "" : o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
