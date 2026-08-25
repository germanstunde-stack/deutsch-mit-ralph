import { useState } from "react";
import { speak } from "../lib/speech";
import { shuffle } from "../data/generators";
import type { Flash } from "../data/extras";

export function Flashcards({ deck }: { deck: Flash[] }) {
  const [order] = useState(() => shuffle(deck));
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const c = order[i] ?? { de: "", pt: "", emo: "🃏" };
  function next() { setFlip(false); setI((x) => (x + 1) % order.length); }
  return (
    <div className="flash">
      <div className="fc" onClick={() => setFlip((f) => !f)}>
        <div>
          <div className="emo">{c.emo}</div>
          {flip ? <div className="pt">{c.pt}</div> : <div className="big">{c.de}</div>}
        </div>
      </div>
      <div className="hintf">Toque no cartão pra virar · {i + 1}/{order.length}</div>
      <div className="nav">
        <button className="btn ghost" style={{ padding: "9px 12px", fontSize: ".9rem" }} onClick={() => speak(c.de.replace(" ↔ ", ", "))}>🔊</button>
        <button className="btn blue" style={{ padding: "9px 12px", fontSize: ".9rem" }} onClick={next}>Próxima →</button>
      </div>
    </div>
  );
}
