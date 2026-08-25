import { animals, food, colors, weekdays, opposites, measures, cognates, falseFriends, type Noun } from "./vocab";
import { numDE } from "../lib/numbers";
import { rand, sample, shuffle, type Question } from "./generators";

export function norm(s: string): string {
  return (s || "").toString().toLowerCase().trim()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/^(der|die|das)\s+/, "").replace(/\s+/g, " ");
}

export interface TypedQ { promptHTML: string; answer: string; speak?: string; meaning?: string; dictation?: boolean; hard?: boolean; word?: string; wordpt?: string; }
export interface ConnectPair { l: string; r: string; key: string; }
export interface ConnectData { title: string; pairs: ConnectPair[]; }
export interface WSData { title: string; pairs: { w: string; pt: string }[]; size: number; }
export interface EnumData { title: string; items: { emo: string; de: string }[]; }

export type ExSpec =
  | { kind: "mc"; gen: () => Question }
  | { kind: "typed"; gen: () => TypedQ }
  | { kind: "dict"; gen: () => TypedQ }
  | { kind: "connect"; gen: () => ConnectData }
  | { kind: "ws"; gen: () => WSData }
  | { kind: "enum"; gen: () => EnumData };

// ---- typed / dict ----
export const gTypeColor = (): TypedQ => { const c = rand(colors); return { promptHTML: `Escreva <span class="big">${c.pt}</span> em alemão:`, answer: c.de, speak: c.de, word: c.de, wordpt: c.pt }; };
export const gTypeNoun = (arr: Noun[]) => (): TypedQ => { const a = rand(arr); return { promptHTML: `Escreva <span class="big">${a.emo} ${a.pt}</span> em alemão (sem artigo):`, answer: a.de, speak: `${a.art} ${a.de}`, word: a.de, wordpt: a.pt }; };
export const gTypeNumber = (): TypedQ => { const n = rand([1,2,3,4,5,6,7,8,9,10,11,12,15,20]); return { promptHTML: `Escreva o número <span class="big">${n}</span> em alemão:`, answer: numDE(n), speak: numDE(n) }; };
export const gTypeWeekday = (): TypedQ => { const d = rand(weekdays); return { promptHTML: `Escreva <span class="big">${d.pt}-feira</span> em alemão:`, answer: d.de, speak: d.de, word: d.de, wordpt: d.pt }; };
export const gTypeCognate = (): TypedQ => { const a = rand(cognates); return { promptHTML: `Escreva <span class="big">${a.pt}</span> em alemão:`, answer: a.de, speak: a.de, word: a.de, wordpt: a.pt }; };
export const gDictate = (pairs: [string, string][]) => (): TypedQ => { const p = rand(pairs); return { promptHTML: "📝 <b>Ditado</b> — ouça e escreva a palavra:", dictation: true, answer: p[0], speak: p[0], word: p[0], wordpt: p[1] }; };

// ---- connect ----
const conNouns = (arr: Noun[], nn = 5) => (): ConnectData => { const pick = sample(arr, nn); return { title: "Ligue o bicho ao nome:", pairs: pick.map((a) => ({ l: `<span style="font-size:1.5rem">${a.emo}</span>`, r: `${a.art} ${a.de}`, key: a.de })) }; };
const conColors = (nn = 5) => (): ConnectData => { const pick = sample(colors, nn); return { title: "Ligue a cor ao nome:", pairs: pick.map((c) => ({ l: `<span style="width:26px;height:26px;border-radius:50%;background:${c.hex};${c.hex === "#FFFFFF" ? "box-shadow:inset 0 0 0 2px var(--border);" : ""}display:inline-block"></span>`, r: c.de, key: c.de })) }; };
const conOpp = (nn = 5) => (): ConnectData => { const pick = sample(opposites, nn); return { title: "Ligue cada palavra ao seu oposto:", pairs: pick.map((p) => ({ l: p.a, r: p.b, key: p.a })) }; };
const conCognate = (nn = 5) => (): ConnectData => { const pick = sample(cognates, nn); return { title: "Ligue o cognato ao português:", pairs: pick.map((c) => ({ l: c.de, r: c.pt, key: c.de })) }; };

// ---- wordsearch ----
const wsFrom = (arr: Noun[], nn = 5) => (): WSData => { const pick = sample(arr, nn).filter((a) => a.de.length <= 8).map((a) => ({ w: a.de, pt: a.pt })); return { title: "Caça-palavras: clique na 1ª e na última letra. Ao achar, ouça + tradução! 🎁", pairs: pick, size: 9 }; };

// ---- enumerate ----
const enumFrom = (arr: Noun[], nn = 5) => (): EnumData => { const pick = sample(arr, nn); return { title: "Enumere: escreva o número da palavra sob cada figura.", items: pick.map((a) => ({ emo: a.emo, de: `${a.art} ${a.de}` })) }; };

// re-export mc generators via generators.ts questionsForTopic style
import { questionsForTopic } from "./generators";
function mcGen(id: string): () => Question { return () => questionsForTopic(id, 1)[0]; }

const dictColors = colors.map((c) => [c.de, c.pt] as [string, string]);
const dictAnimals = animals.map((a) => [a.de, a.pt] as [string, string]);
const dictFood = food.map((a) => [a.de, a.pt] as [string, string]);

const SPECS: Record<string, ExSpec[]> = {
  alfabeto: [{ kind: "mc", gen: mcGen("alfabeto") }, { kind: "dict", gen: gDictate(dictAnimals) }, { kind: "mc", gen: mcGen("alfabeto") }, { kind: "ws", gen: wsFrom(animals, 4) }],
  numeros: [{ kind: "mc", gen: mcGen("numeros") }, { kind: "typed", gen: gTypeNumber }, { kind: "dict", gen: gDictate([[numDE(3),"3"],[numDE(7),"7"],[numDE(10),"10"],[numDE(20),"20"]]) }],
  dias: [{ kind: "mc", gen: mcGen("dias") }, { kind: "typed", gen: gTypeWeekday }, { kind: "dict", gen: gDictate(weekdays.map((d) => [d.de, d.pt] as [string, string])) }],
  cores: [{ kind: "mc", gen: mcGen("cores") }, { kind: "connect", gen: conColors(5) }, { kind: "typed", gen: gTypeColor }, { kind: "dict", gen: gDictate(dictColors) }],
  animais: [{ kind: "connect", gen: conNouns(animals, 5) }, { kind: "mc", gen: mcGen("animais") }, { kind: "enum", gen: enumFrom(animals, 5) }, { kind: "dict", gen: gDictate(dictAnimals) }],
  comidas: [{ kind: "connect", gen: conNouns(food, 5) }, { kind: "mc", gen: mcGen("comidas") }, { kind: "ws", gen: wsFrom(food, 4) }, { kind: "dict", gen: gDictate(dictFood) }],
  cumprimentos: [{ kind: "mc", gen: mcGen("cumprimentos") }, { kind: "mc", gen: mcGen("cumprimentos") }],
  tamanhos: [{ kind: "connect", gen: conOpp(5) }, { kind: "mc", gen: mcGen("tamanhos") }, { kind: "dict", gen: gDictate(opposites.map((p) => [p.a, p.ptA] as [string, string])) }, { kind: "dict", gen: gDictate(measures.map((m) => [m.de, m.pt] as [string, string])) }],
  similar: [{ kind: "mc", gen: mcGen("similar") }, { kind: "connect", gen: conCognate(5) }, { kind: "mc", gen: mcGen("similar") }, { kind: "typed", gen: gTypeCognate }, { kind: "dict", gen: gDictate(cognates.map((c) => [c.de, c.pt] as [string, string])) }],
};

export function exSpecsForTopic(id: string, count = 20): ExSpec[] {
  const base = SPECS[id] ?? SPECS.similar;
  const out: ExSpec[] = [];
  for (let i = 0; i < count; i++) out.push(base[i % base.length]);
  return shuffle(out);
}

export { falseFriends };
