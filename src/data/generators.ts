import { animals, food, colors, greet, phrases, weekdays, months, opposites, measures, cognates, falseFriends, helvetisms, type Noun, type Word } from "./vocab";
import { numDE } from "../lib/numbers";
import { mundartEntries } from "./mundart";

export interface Option { label: string; correct: boolean; sw?: string; }
// speak = o alemão do enunciado. speakFull = versão mais completa tocada só na
// prática (ex.: a sequência "einundneunzig, zweiundneunzig"), porque na prova
// ela entregaria a resposta.
export interface Question { key: string; promptHTML: string; speak?: string; speakFull?: string; meaning?: string; big?: boolean; options: Option[]; word?: string; wordpt?: string; }

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
  return q({ promptHTML: '🔊 Ouça e ache a letra que falta: <span class="big" style="letter-spacing:2px">' + shown + "</span>", meaning: "significa: <b>" + pt + "</b>", speak: w, options: opts, word: w, wordpt: pt });
}
function gMeaningNoun(arr: Noun[]): Question {
  const a = rand(arr);
  const opts = sample(arr, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que significa <span class="big">' + a.art + " " + a.de + "</span>?", speak: a.art + " " + a.de, options: opts, word: a.de, wordpt: a.pt });
}
function gArticle(arr: Noun[]): Question {
  const a = rand(arr);
  return q({ promptHTML: 'Qual artigo vai com <span class="big">' + a.de + "</span> (" + a.pt + ")?", speak: a.art + " " + a.de, word: a.de, wordpt: a.pt, options: [{ label: "der", correct: a.art === "der" }, { label: "die", correct: a.art === "die" }, { label: "das", correct: a.art === "das" }] });
}
function gPickName(arr: Noun[]): Question {
  const a = rand(arr);
  const opts = sample(arr, 3, a).map((o) => ({ label: o.art + " " + o.de, correct: false }));
  opts.push({ label: a.art + " " + a.de, correct: true });
  return q({ promptHTML: 'Ligue ao nome certo: <span class="big">' + a.emo + " " + a.pt + "</span>", big: true, speak: a.art + " " + a.de, options: opts, word: a.de, wordpt: a.pt });
}
function gColorSwatch(): Question {
  const c = rand(colors);
  const opts = sample(colors, 3, c).map((o) => ({ label: o.pt, sw: o.hex, correct: false }));
  opts.push({ label: c.pt, sw: c.hex, correct: true });
  return q({ promptHTML: 'Clique na cor <span class="big">' + c.de + "</span>", speak: c.de, options: opts, word: c.de, wordpt: c.pt });
}
function gColorMeaning(): Question {
  const c = rand(colors);
  const opts = sample(colors, 3, c).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: c.pt, correct: true });
  return q({ promptHTML: 'O que quer dizer <span class="big">' + c.de + "</span>?", speak: c.de, options: opts, word: c.de, wordpt: c.pt });
}
function gWord(arr: Word[]): Question {
  const a = rand(arr);
  const opts = sample(arr, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que quer dizer <span class="big">' + a.de + "</span>?", speak: a.de.replace("…", ""), options: opts, word: a.de, wordpt: a.pt });
}
function gMonth(): Question {
  const m = rand(months);
  const opts = sample(months, 3, m).map((o) => ({ label: o[1], correct: false }));
  opts.push({ label: m[1], correct: true });
  return q({ promptHTML: 'Que mês é <span class="big">' + m[0] + "</span>?", speak: m[0], options: opts, word: m[0], wordpt: m[1] });
}
function gOpposite(): Question {
  const p = rand(opposites);
  const flip = Math.random() < 0.5;
  const word = flip ? p.b : p.a, ans = flip ? p.a : p.b;
  const others = sample(opposites, 3, p).map((o) => ({ label: Math.random() < 0.5 ? o.a : o.b, correct: false }));
  others.push({ label: ans, correct: true });
  return q({ promptHTML: 'Qual é o oposto de <span class="big">' + word + "</span>?", speak: word + ", " + ans, big: true, options: others, word, wordpt: "oposto" });
}
function gCognate(): Question {
  const a = rand(cognates);
  const opts = sample(cognates, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que significa <span class="big">' + a.de + "</span>?", speak: a.de, options: opts, word: a.de, wordpt: a.pt });
}
function gFalse(): Question {
  const f = rand(falseFriends);
  const others = sample(falseFriends, 2, f).map((o) => ({ label: o.real, correct: false }));
  const opts = [{ label: f.real, correct: true }, { label: f.trap, correct: false }, ...others];
  return q({ promptHTML: '⚠️ Falso amigo — <span class="big">' + f.de + "</span> significa?", meaning: 'parece “' + f.trap + "”, mas cuidado…", speak: f.de, options: opts, word: f.de, wordpt: f.real });
}
function gMeasure(): Question {
  const a = rand(measures);
  const opts = sample(measures, 3, a).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: a.pt, correct: true });
  return q({ promptHTML: 'O que significa <span class="big">' + a.de + "</span>?", speak: a.art + " " + a.de, options: opts, word: a.de, wordpt: a.pt });
}

// O capítulo de números não tinha gerador de número nenhum: a única pergunta de
// múltipla escolha dele era o significado de um ANIMAL. Estes três cobram o que
// o capítulo ensina — e como saem de numDE(), o pool é o intervalo inteiro em
// vez de uma lista escrita à mão.
function numeroSorteado(): number {
  // mistura as faixas: 0-20 (formas próprias), 21-99 (a inversão "einundzwanzig")
  // e centenas, que é onde o aluno mais erra
  const r = Math.random();
  if (r < 0.4) return Math.floor(Math.random() * 21);
  if (r < 0.85) return 21 + Math.floor(Math.random() * 79);
  return (1 + Math.floor(Math.random() * 9)) * 100 + Math.floor(Math.random() * 100);
}
function outrosNumeros(n: number, qtd: number): number[] {
  const out = new Set<number>();
  while (out.size < qtd) {
    const c = numeroSorteado();
    if (c !== n) out.add(c);
  }
  return [...out];
}
function gNumberMeaning(): Question {
  const n = numeroSorteado();
  const opts = outrosNumeros(n, 3).map((o) => ({ label: String(o), correct: false }));
  opts.push({ label: String(n), correct: true });
  return q({ promptHTML: 'Que número é <span class="big">' + numDE(n) + "</span>?", speak: numDE(n), options: opts, word: numDE(n), wordpt: String(n) });
}
function gNumberWrite(): Question {
  const n = numeroSorteado();
  const opts = outrosNumeros(n, 3).map((o) => ({ label: numDE(o), correct: false }));
  opts.push({ label: numDE(n), correct: true });
  // sem `speak`: aqui o enunciado é um algarismo, então o único alemão que o
  // botão poderia falar é a própria resposta — só na prática.
  return q({ promptHTML: 'Como se escreve <span class="big">' + n + "</span> em alemão?", speakFull: numDE(n), options: opts, word: numDE(n), wordpt: String(n) });
}
// os distratores têm que ser VIZINHOS da resposta: sorteando do intervalo
// inteiro, "qual vem depois de quarenta?" chegava a oferecer
// "vierhundertsiebenundzwanzig" — implausível e a palavra mais longa do app.
function vizinhos(alvo: number, qtd: number): number[] {
  const out = new Set<number>();
  for (let d = 1; out.size < qtd && d < 12; d++) {
    if (alvo - d > 0) out.add(alvo - d);
    if (out.size < qtd) out.add(alvo + d);
  }
  return shuffle([...out]).slice(0, qtd);
}
function gNumberNext(): Question {
  const n = 1 + Math.floor(Math.random() * 98);
  const opts = vizinhos(n + 1, 3).map((o) => ({ label: numDE(o), correct: false }));
  opts.push({ label: numDE(n + 1), correct: true });
  return q({
    promptHTML: 'Qual vem depois de <span class="big">' + numDE(n) + "</span>?", meaning: String(n) + " → ?",
    speak: numDE(n), speakFull: numDE(n) + ", " + numDE(n + 1),
    options: opts, word: numDE(n + 1), wordpt: String(n + 1),
  });
}

/* ---- helvetismos: o contraste suíço × alemão É o conteúdo do capítulo ---- */

function gHelvSentido(): Question {
  const h = rand(helvetisms);
  const opts = sample(helvetisms, 3, h).map((o) => ({ label: o.pt, correct: false }));
  opts.push({ label: h.pt, correct: true });
  return q({ promptHTML: '🇨🇭 O que significa <span class="big">' + h.ch + "</span>?", speak: (h.art ? h.art + " " : "") + h.ch, options: opts, word: h.ch, wordpt: h.pt });
}
function gHelvDaqui(): Question {
  // dá a forma alemã e pede a suíça: é o sentido em que o aluno precisa produzir
  const h = rand(helvetisms);
  const opts = sample(helvetisms, 3, h).map((o) => ({ label: o.ch, correct: false }));
  opts.push({ label: h.ch, correct: true });
  return q({ promptHTML: 'Nos livros de alemão é <span class="big">' + h.de + "</span> (" + h.pt + "). Como se diz na Suíça?", speak: (h.art ? h.art + " " : "") + h.ch, options: opts, word: h.ch, wordpt: h.pt });
}
function gHelvArtigo(): Question {
  const pool = helvetisms.filter((h) => h.art);
  const h = rand(pool);
  return q({
    promptHTML: 'Qual artigo vai com <span class="big">' + h.ch + "</span> (" + h.pt + ")?",
    speak: h.art + " " + h.ch, word: h.ch, wordpt: h.pt,
    options: [{ label: "der", correct: h.art === "der" }, { label: "die", correct: h.art === "die" }, { label: "das", correct: h.art === "das" }],
  });
}

/* ---- Mundart: só RECONHECIMENTO, nunca produção escrita ----
   Todos são "mc", então não existe campo onde digitar — a regra "dialeto não se
   escreve" vale por construção. E `word` guarda sempre o Hochdeutsch: se
   guardasse a grafia dialetal, o Caderno passaria a treinar uma escrita que não
   tem forma certa. */

function gMundartSentido(): Question {
  const e = rand(mundartEntries);
  const opts = sample(mundartEntries, 3, e).map((o) => ({ label: o.hoch, correct: false }));
  opts.push({ label: e.hoch, correct: true });
  return q({
    promptHTML: '🗣️ Você ouve <span class="big">' + e.mundart + "</span> na rua. Em Hochdeutsch é?",
    meaning: e.hint, speak: e.say ?? e.mundart,
    options: opts, word: e.hoch, wordpt: e.hint ?? "",
  });
}
function gMundartEscuta(): Question {
  // sem texto no enunciado: o aluno só tem o áudio, que é a situação real
  const e = rand(mundartEntries);
  const opts = sample(mundartEntries, 3, e).map((o) => ({ label: o.hoch, correct: false }));
  opts.push({ label: e.hoch, correct: true });
  return q({
    promptHTML: '🔊 <b>Dialeto</b> — ouça e escolha o que foi dito:',
    speak: e.say ?? e.mundart,
    options: opts, word: e.hoch, wordpt: e.hint ?? "",
  });
}
function gMundartQualOuve(): Question {
  const e = rand(mundartEntries);
  const opts = sample(mundartEntries, 3, e).map((o) => ({ label: o.mundart, correct: false }));
  opts.push({ label: e.mundart, correct: true });
  return q({
    promptHTML: 'Escrito é <span class="big">' + e.hoch + "</span>. O que você ouve na Suíça?",
    speak: e.say ?? e.mundart,
    options: opts, word: e.hoch, wordpt: e.hint ?? "",
  });
}

type Gen = () => Question;
const BANK: Record<string, Gen[]> = {
  alfabeto: [gMissing, gMissing, () => gPickName(animals)],
  numeros: [gNumberMeaning, gNumberWrite, gNumberNext],
  dias: [gMonth, () => gWord(weekdays)],
  cores: [gColorSwatch, gColorMeaning],
  animais: [() => gPickName(animals), () => gArticle(animals), () => gMeaningNoun(animals)],
  comidas: [() => gPickName(food), () => gArticle(food), () => gMeaningNoun(food)],
  cumprimentos: [() => gWord(greet), () => gWord(phrases), gMundartSentido, gMundartEscuta],
  tamanhos: [gOpposite, gMeasure],
  similar: [gCognate, gFalse, gFalse],
  helvetismos: [gHelvSentido, gHelvDaqui, gHelvArtigo, gMundartQualOuve],
};

export function questionsForTopic(id: string, count = 8): Question[] {
  const gens = BANK[id] ?? [gCognate];
  // ordem sorteada dos tipos de pergunta: com count=1 (como o mcGen chama) a
  // versão antiga pegava sempre gens[0], então gArticle/gMeaningNoun/gFalse etc.
  // nunca apareciam na prática — só na Prova, que usa allMcGens().
  const order = shuffle(gens.map((_, i) => i));
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(gens[order[i % order.length]]());
  return shuffle(out);
}

// para a prova (todos os MC)
export function allMcGens(): Gen[] {
  return [
    gMissing, () => gPickName(animals), () => gArticle(animals), () => gMeaningNoun(animals),
    () => gPickName(food), () => gArticle(food), () => gMeaningNoun(food),
    gColorSwatch, gColorMeaning, () => gWord(greet), () => gWord(phrases),
    gMonth, () => gWord(weekdays), gOpposite, gMeasure, gCognate, gFalse,
    // a prova do A0 nao tinha nenhuma pergunta de numero, embora o modulo tenha
    // um capitulo so pra isso
    gNumberMeaning, gNumberWrite, gNumberNext,
    gHelvSentido, gHelvDaqui, gHelvArtigo,
    gMundartSentido, gMundartEscuta, gMundartQualOuve,
  ];
}
