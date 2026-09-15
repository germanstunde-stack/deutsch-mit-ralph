import { speak } from "../lib/speech";
import { numDE } from "../lib/numbers";
import { alphabet, animals, food, colors, greet, phrases, weekdays, daywords, months, opposites, measures, cognates, falseFriends, helvetisms, type Noun } from "../data/vocab";

export interface CardItem { emo?: string; deHTML: string; pt?: string; ptBad?: string; speak: string; swatch?: string; say?: string; }
export interface CardsData { items: CardItem[]; gridClass: string; legend?: boolean; }

function nounCard(a: Noun): CardItem {
  return { emo: a.emo, deHTML: `<span class="art ${a.art}">${a.art}</span> ${a.de}`, pt: a.pt, speak: `${a.art} ${a.de}` };
}

// Cards do A0 (fiel ao protótipo). Módulos novos (A1+) trazem seus próprios
// cardsForTopic — ver src/data/modules.ts.
export function cardsForTopicA0(id: string): CardsData {
  switch (id) {
    case "alfabeto":
      return { gridClass: "grid tiny", items: alphabet.map(([l, name]) => ({ deHTML: l, say: "🔊 " + name, speak: l })) };
    case "numeros": {
      const list = [...Array(21).keys(), 30, 40, 50, 60, 70, 80, 90, 100, 200, 1000, 21, 47, 99, 345];
      return { gridClass: "grid", items: list.map((n) => ({ emo: String(n), deHTML: numDE(n), speak: numDE(n) })) };
    }
    case "dias":
      return { gridClass: "grid", items: [
        ...weekdays.map((w) => ({ emo: w.emo, deHTML: w.de, pt: w.pt, speak: w.de })),
        ...daywords.map((w) => ({ emo: w.emo, deHTML: w.de, pt: w.pt, speak: w.de })),
        ...months.map(([de, pt]) => ({ emo: "📅", deHTML: de, pt, speak: de })),
      ] };
    case "cores":
      return { gridClass: "grid", items: colors.map((c) => ({ swatch: c.hex, deHTML: c.de, pt: c.pt, speak: c.de })) };
    case "animais":
      return { gridClass: "grid", legend: true, items: animals.map(nounCard) };
    case "comidas":
      return { gridClass: "grid", legend: true, items: food.map(nounCard) };
    case "cumprimentos":
      return { gridClass: "grid", items: [...greet, ...phrases].map((w) => ({ emo: w.emo, deHTML: w.de, pt: w.pt, speak: w.de.replace("…", "") })) };
    case "tamanhos":
      return { gridClass: "grid", items: [
        ...opposites.map((p) => ({ emo: p.emoA + p.emoB, deHTML: `${p.a} ↔ ${p.b}`, pt: `${p.ptA} / ${p.ptB}`, speak: `${p.a}, ${p.b}` })),
        ...measures.map(nounCard),
      ] };
    case "similar":
      return { gridClass: "grid", items: [
        ...cognates.map((c) => ({ emo: c.emo, deHTML: c.de, pt: c.pt, speak: c.de })),
        ...falseFriends.map((f) => ({ emo: f.emo, deHTML: f.de, pt: f.real, ptBad: `❌ não “${f.trap}”`, speak: f.de })),
      ] };
    case "helvetismos":
      // a forma suíça grande (é a que se escreve), a alemã pequena embaixo — o
      // mesmo layout de duas linhas do card de falso amigo
      return { gridClass: "grid", items: helvetisms.map((h) => ({
        emo: h.emo,
        deHTML: (h.art ? `<span class="art ${h.art}">${h.art}</span> ` : "") + h.ch + `<br><small class="dede">🇩🇪 ${h.de}</small>`,
        pt: h.pt,
        speak: (h.art ? h.art + " " : "") + h.ch,
      })) };
    default:
      return { gridClass: "grid", items: [] };
  }
}

export function CardGrid({ items, gridClass, legend }: CardsData) {
  return (
    <>
      {legend && (
        <div className="legend">
          <span><i className="dot" style={{ background: "var(--der)" }} /> der</span>
          <span><i className="dot" style={{ background: "var(--die)" }} /> die</span>
          <span><i className="dot" style={{ background: "var(--das)" }} /> das</span>
        </div>
      )}
      <div className={gridClass}>
        {items.map((it, i) => (
          <button key={i} className="card" onClick={() => speak(it.speak)}>
            {it.swatch ? (
              <span className="emo" style={{ width: 28, height: 28, borderRadius: "50%", background: it.swatch, boxShadow: it.swatch === "#FFFFFF" ? "inset 0 0 0 2px var(--border)" : undefined }} />
            ) : it.emo ? (
              <span className="emo">{it.emo}</span>
            ) : null}
            <span className="de" dangerouslySetInnerHTML={{ __html: it.deHTML }} />
            {it.pt && <span className="pt" style={it.ptBad ? { color: "var(--good)", fontWeight: 800 } : undefined}>{it.pt}</span>}
            {it.ptBad && <span className="pt" style={{ color: "var(--bad)" }}>{it.ptBad}</span>}
            <span className="say">{it.say ?? "🔊"}</span>
          </button>
        ))}
      </div>
    </>
  );
}
