import { animals, food, colors, greet, phrases, weekdays, months, opposites, measures, cognates, falseFriends, type Noun, type Word } from "./vocab";

export interface Option { label: string; correct: boolean; sw?: string; }
export interface Question { key: string; promptHTML: string; speak?: string; meaning?: string; big?: boolean; options: Option[]; }

let uid = 0;
export function shuffle<T>(a: T[]): T[] { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export function sample<T>(a: T[], n: number, ex?: T): T[] { return shuffle(a.filter((x) => x !== ex)).slice(0, n); }
export function rand<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }
function q(x: Omit<Question, "key">): Question { return { key: "q" + uid++, ...x }; }

const LETTERS = "abcdefghijklmnopqrstuvwxyzäöü".split("");
function letterPool(): [string, string][] {
  const w: [string, string][] = [];
  animals.forEach((a) => w.push([a.de, a.pt]));
  food.forEach((a) => w.push([a.de, a.pt]));
  colors.forEach((a) => w.push([a.de, a.pt]));
  return w.filter((x) => x[0].indexOf(" ") < 0 && x[0].length >= 3 && x[0].length <= 9);
}

function gMissing(): Question {
  const [w, pt] = rand(letterPool());
  const idxs: number[] = [];
  for (let i = 1; i < w.length; i++) if (LETTERS.indexOf(w[i].toLowerCase()) >= 0) idxs.push(i);
  const i = rand(idxs);
  const orig = w[i].toLowerCase();
  const shown = w.slice(0, i) + '<span style="color:var(--brand);border-bottom:3px solid var(--brand)">_</span>' + w.slice(i + 1);
  const opts = sample(LETTERS.filter((l) => l !== orig), 3).map((l) => ({ label: l, correct: false }));
  opts.push({ label: orig, correct: true });
  return q({ promptHTML: '🔊 Ouça e ache a letra que falta: <span class="big" style="letter-spacing:2px">' + shown + "</span>", meaning: "significa: <b>" + pt + "</b>", speak: w, options: opts });
}
function gMeaningNoun(arr: Noun[]): Question {
  const a = rand(arr);
  const opts = sample(arr, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que significa <span class="big">' + a.art + " " + a.de + "</span>?", speak: a.art + " " + a.de, options: opts });
}
function gArticle(arr: Noun[]): Question {
  const a = rand(arr);
  return q({ promptHTML: 'Qual artigo vai com <span class="big">' + a.de + "</span> (" + a.pt + ")?", speak: a.art + " " + a.de, options: [{ label: "der", correct: a.art === "der" }, { label: "die", correct: a.art === "die" }, { label: "das", correct: a.art === "das" }] });
}
function gPickName(arr: Noun[]): Question {
  const a = rand(arr);
  const opts = sample(arr, 3, a).map((o) => ({ label: o.art + " " + o.de, correct: false }));
  opts.push({ label: a.art + " " + a.de, correct: true });
  return q({ promptHTML: 'Ligue ao nome certo: <span class="big">' + a.emo + " " + a.pt + "</span>", big: true, options: opts });
}
function gColorSwatch(): Question {
  const c = rand(colors);
  const opts = sample(colors, 3, c).map((o) => ({ label: o.pt, sw: o.hex, correct: false }));
  opts.push({ label: c.pt, sw: c.hex, correct: true });
  return q({ promptHTML: 'Clique na cor <span class="big">' + c.de + "</span>", speak: c.de, options: opts });
}
function gColorMeaning(): Question {
  const c = rand(colors);
  const opts = sample(colors, 3, c).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: c.pt, correct: true });
  return q({ promptHTML: 'O que quer dizer <span class="big">' + c.de + "</span>?", speak: c.de, options: opts });
}
function gWord(arr: Word[]): Question {
  const a = rand(arr);
  const opts = sample(arr, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que quer dizer <span class="big">' + a.de + "</span>?", speak: a.de.replace("…", ""), options: opts });
}
function gMonth(): Question {
  const m = rand(months);
  const opts = sample(months, 3, m).map((o) => ({ label: o[1], correct: false }));
  opts.push({ label: m[1], correct: true });
  return q({ promptHTML: 'Que mês é <span class="big">' + m[0] + "</span>?", speak: m[0], options: opts });
}
function gOpposite(): Question {
  const p = rand(opposites);
  const flip = Math.random() < 0.5;
  const word = flip ? p.b : p.a, ans = flip ? p.a : p.b;
  const others = sample(opposites, 3, p).map((o) => ({ label: Math.random() < 0.5 ? o.a : o.b, correct: false }));
  others.push({ label: ans, correct: true });
  return q({ promptHTML: 'Qual é o oposto de <span class="big">' + word + "</span>?", speak: word + ", " + ans, big: true, options: others });
}
function gCognate(): Question {
  const a = rand(cognates);
  const opts = sample(cognates, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que significa <span class="big">' + a.de + "</span>?", speak: a.de, options: opts });
}
function gFalse(): Question {
  const f = rand(falseFriends);
  const others = sample(falseFriends, 2, f).map((o) => ({ label: o.real, correct: false }));
  const opts = [{ label: f.real, correct: true }, { label: f.trap, correct: false }, ...others];
  return q({ promptHTML: '⚠️ Falso amigo — <span class="big">' + f.de + "</span> significa?", meaning: 'parece “' + f.trap + "”, mas cuidado…", speak: f.de, options: opts });
}
function gMeasure(): Question {
  const a = rand(measures);
  const opts = sample(measures, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que significa <span class="big">' + a.de + "</span>?", speak: a.art + " " + a.de, options: opts });
}

type Gen = () => Question;
const BANK: Record<string, Gen[]> = {
  alfabeto: [gMissing, gMissing, () => gPickName(animals)],
  numeros: [() => gMeaningNoun(animals)], // números completos vêm na Fase 2 (contas/relógio)
  dias: [gMonth, () => gWord(weekdays)],
  cores: [gColorSwatch, gColorMeaning],
  animais: [() => gPickName(animals), () => gArticle(animals), () => gMeaningNoun(animals)],
  comidas: [() => gPickName(food), () => gArticle(food), () => gMeaningNoun(food)],
  cumprimentos: [() => gWord(greet), () => gWord(phrases)],
  tamanhos: [gOpposite, gMeasure],
  similar: [gCognate, gFalse, gFalse],
};

export function questionsForTopic(id: string, count = 8): Question[] {
  const gens = BANK[id] ?? [gCognate];
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(gens[i % gens.length]());
  return shuffle(out);
}
