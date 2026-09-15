import { forwardRef, useImperativeHandle, useState } from "react";
import type { Question } from "../data/generators";
import { speak } from "../lib/speech";
import { addHard, easeHard } from "../data/caderno";
import type { ExMode, ExamHandle } from "./examTypes";

interface Props { q: Question; num: number; onResolve: (correct: number, wrong: number) => void; mode?: ExMode; }

export const MultipleChoice = forwardRef<ExamHandle, Props>(function MultipleChoice({ q, num, onResolve, mode = "practice" }, ref) {
  const [answered, setAnswered] = useState(false);
  const [missed, setMissed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [resultOk, setResultOk] = useState<boolean | null>(null);
  const [examSel, setExamSel] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctIdx = q.options.findIndex((o) => o.correct);

  useImperativeHandle(ref, () => ({
    getScore: () => (examSel === correctIdx ? { correct: 1, wrong: 0 } : { correct: 0, wrong: 1 }),
    reveal: () => setRevealed(true),
  }), [examSel, correctIdx]);

  function click(i: number, correct: boolean) {
    if (mode === "exam") { if (revealed) return; setExamSel(i); return; }
    if (answered) return;
    if (correct) {
      setAnswered(true); setPicked(i);
      if (!missed) { easeHard(q.word); setResultOk(true); }
      onResolve(missed ? 0 : 1, missed ? 0 : 0); // se já errou, o erro já foi contado
    } else {
      if (!missed) { onResolve(0, 1); setMissed(true); setResultOk(false); addHard(q.word, q.wordpt); }
      setPicked(i);
      setTimeout(() => setPicked((p) => (p === i ? null : p)), 400);
    }
  }

  const say = mode === "exam" ? q.speak : q.speakFull ?? q.speak;
  const showAnswered = mode === "exam" ? revealed : answered;
  const showPicked = mode === "exam" ? examSel : picked;
  const numCls = resultOk === true ? " ok" : resultOk === false ? " no"
    : mode === "exam" && revealed ? (examSel === correctIdx ? " ok" : " no") : "";

  return (
    <div className="qcard">
      <p className="q">
        <span className={"num" + numCls}>{num}</span>
        <span className="txt" dangerouslySetInnerHTML={{ __html: q.promptHTML }} />
        {/* na prática o áudio pode dar a sequência inteira (ouvir "91, 92" é o
            que ensina a contagem); na prova isso entregaria o gabarito, então lá
            toca só o enunciado — mesma regra do "ouvir frase" do montar frase.
            Quando só existe speakFull, o botão some na prova: é o caso de "como
            se escreve 427 em alemão?", onde o único alemão possível é a resposta. */}
        {say && <button className="listen" onClick={() => speak(say)}>🔊 ouvir</button>}
      </p>
      {q.meaning && <p className="meaning" dangerouslySetInnerHTML={{ __html: q.meaning }} />}
      <div className="opts">
        {q.options.map((o, i) => {
          const cls = "opt" + (q.big ? " big" : "") + (o.sw ? " swatch" : "") +
            (showAnswered && o.correct ? " correct" : "") + (showPicked === i && !o.correct ? " wrong" : "") +
            (showAnswered && !o.correct ? " dim" : "") + (mode === "exam" && !revealed && showPicked === i ? " sel" : "");
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
});
