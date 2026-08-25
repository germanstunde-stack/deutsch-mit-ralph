import { useEffect, useMemo, useState } from "react";
import { loadHard, removeHard, subscribe, type HardMap } from "../data/caderno";
import { MultipleChoice } from "./MultipleChoice";
import { shuffle, sample, type Question } from "../data/generators";
import { speak } from "../lib/speech";

// pool de significados-distratores (caso o caderno tenha poucas palavras)
const FILLER = ["cachorro","gato","casa","água","pão","vermelho","azul","segunda","obrigado","grande","pequeno","peixe","leite","verde","amarelo","mesa","porta","livro","bom dia","adeus"];

let uid = 0;
function buildDrill(hard: HardMap): Question[] {
  const words = Object.keys(hard);
  const allPt = words.map((w) => hard[w].pt).filter(Boolean);
  return shuffle(words).map((w) => {
    const pt = hard[w].pt || "?";
    const pool = [...new Set([...allPt.filter((p) => p !== pt), ...FILLER.filter((p) => p !== pt)])];
    const opts = sample(pool, 3).map((p) => ({ label: p, correct: false }));
    opts.push({ label: pt, correct: true });
    return {
      key: "cad" + uid++,
      promptHTML: 'O que significa <span class="big">' + w + "</span>?",
      speak: w, options: shuffle(opts), word: w, wordpt: pt,
    };
  });
}

export function CadernoPanel({ onResult }: { onResult: (correct: number, wrong: number) => void }) {
  const [hard, setHard] = useState<HardMap>(() => loadHard());
  const [drilling, setDrilling] = useState(false);
  const [drill, setDrill] = useState<Question[]>([]);
  const [round, setRound] = useState(0);

  useEffect(() => subscribe(() => setHard(loadHard())), []);

  const entries = useMemo(() => Object.entries(hard).sort((a, b) => b[1].n - a[1].n), [hard]);
  const count = entries.length;

  function treinar() {
    setDrill(buildDrill(hard));
    setDrilling(true);
    setRound((r) => r + 1);
  }

  return (
    <section className="panel topic-sec caderno" id="caderno">
      <h2>📓 Caderno de difíceis</h2>
      {count === 0 ? (
        <p className="desc">Quando você errar uma palavra nos exercícios, ela aparece aqui pra treinar de novo. Por enquanto está vazio — bom sinal! 🎉</p>
      ) : (
        <>
          <p className="desc">Estas são as palavras que você mais erra. Clique pra ouvir, ou treine só elas. As que você acertar somem daqui.</p>
          <div className="hardlist">
            {entries.map(([w, info]) => (
              <span key={w} className={"hardchip lv" + Math.min(3, Math.ceil(info.n / 2))}>
                <button className="hw" onClick={() => speak(w)} title="ouvir">🔊 {w}</button>
                <em>{info.pt}</em>
                <button className="rm" onClick={() => removeHard(w)} title="já sei essa">×</button>
              </span>
            ))}
          </div>
          <div className="btnrow" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={treinar}>🎯 Treinar difíceis ({count})</button>
          </div>

          {drilling && (
            <div className="drill" key={round}>
              <div className="subhead">🎯 Treino das difíceis</div>
              {drill.map((q, i) => (
                <MultipleChoice key={round + "-" + i} q={q} num={i + 1} onResolve={onResult} />
              ))}
              <div className="btnrow" style={{ marginTop: 10 }}>
                <button className="btn ghost" onClick={() => setDrilling(false)}>Fechar treino</button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
