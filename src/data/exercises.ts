import { animals, food, colors, greet, phrases, weekdays, months, opposites, measures, cognates, falseFriends, helvetisms, type Noun, type Word } from "./vocab";
import { numDE } from "../lib/numbers";
import { rand, sample, shuffle, type Question } from "./generators";
import { buildRound } from "./exSampler";
import { cantons } from "./ch/cantons";
import { CANTON_CENTERS } from "./ch/cantonPaths";

export function norm(s: string): string {
  return (s || "").toString().toLowerCase().trim()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/^(der|die|das)\s+/, "").replace(/\s+/g, " ");
}

export interface TypedQ { promptHTML: string; answer: string; speak?: string; meaning?: string; dictation?: boolean; hard?: boolean; word?: string; wordpt?: string; }
export interface ConnectPair { l: string; r: string; key: string; }
export interface ConnectData { title: string; pairs: ConnectPair[]; single: boolean; }
export interface WSData { title: string; pairs: { w: string; pt: string }[]; size: number; single: boolean; }
export interface EnumData { title: string; items: { emo: string; de: string }[]; single: boolean; }
export interface OrderData { title: string; chunks: string[]; answer: string[]; single: boolean; }
// Verdadeiro/falso em LOTE — várias afirmações num card, nunca uma por card:
// duas opções são 50% de chute, cinco em lote são 3%.
export interface TFStatement { html: string; correct: boolean; speak?: string; }
export interface TFData { title: string; statements: TFStatement[]; single: boolean; }

// Lacunas com banco de palavras compartilhado.
//
// `segments` + `gaps` em vez de uma frase com marcador tipo "Ich ___ aus ___":
// o marcador seria uma segunda fonte de verdade, podendo discordar de
// gaps.length, e palavra composta alemã legitimamente tem underscore. Assim
// vale sempre a invariante segments.length === gaps.length + 1.
//
// Várias linhas dividindo UM banco é o formato que interessa (as quatro linhas
// de uma rima com um banco só). Uma frase só é lines: [uma].
export interface ClozeGap { answer: string }
export interface ClozeLine { segments: string[]; gaps: ClozeGap[]; speak?: string; tr?: string }
export interface ClozeData { title: string; lines: ClozeLine[]; bank: string[]; single: boolean }

// Linha do tempo: pôr eventos em ordem cronológica.
//
// Kind próprio, não variante do "montar frase": o Order pontua tudo-ou-nada sem
// ramo de `single`, e dar crédito parcial a ele mudaria a nota da parte 3 da
// Prova em 11 capítulos — regressão no único componente que libera módulo. Ele
// também compara por VALOR (dois eventos com palavra em comum se confundiriam),
// e o validador trata resposta de `order` como alemão escrito, o que seria falso
// pra rótulo em português.
//
// `events` fica na ordem canônica (cronológica); quem embaralha é o componente.
// Guardar uma cópia já embaralhada seria uma segunda fonte de verdade.
export interface ChronoEvent {
  id: string;
  /** chave de ordenação: o ano na História, o número do mês nos meses. Empate é
   *  permitido de propósito — dois eventos no mesmo ano não podem virar cilada. */
  at: number;
  /** o que o aluno lê */
  label: string;
  /** o que aparece ao corrigir (o ano, "Januar"…); padrão é o próprio `at` */
  show?: string;
}
export interface ChronoData { title: string; events: ChronoEvent[]; single: boolean }

// Clicar o cantão no mapa. Um clique = um ponto, então `single` é sempre true —
// existe só pra honrar a convenção das outras interfaces.
export interface MapData {
  title: string;
  /** código de duas letras, ex. "ZH" */
  answer: string;
  /** subconjunto clicável; sempre contém a resposta */
  choices: string[];
  /** nome alemão do cantão, falado só depois de acertar */
  speak?: string;
  single: boolean;
}

export type ExSpec =
  | { kind: "mc"; gen: () => Question }
  | { kind: "typed"; gen: () => TypedQ }
  | { kind: "dict"; gen: () => TypedQ }
  | { kind: "connect"; gen: () => ConnectData }
  | { kind: "ws"; gen: () => WSData }
  | { kind: "enum"; gen: () => EnumData }
  | { kind: "order"; gen: () => OrderData }
  | { kind: "tf"; gen: () => TFData }
  | { kind: "cloze"; gen: () => ClozeData }
  | { kind: "chrono"; gen: () => ChronoData }
  | { kind: "map"; gen: () => MapData };

// ---- typed / dict ----
export const gTypeColor = (): TypedQ => { const c = rand(colors); return { promptHTML: `Escreva <span class="big">${c.pt}</span> em alemão:`, answer: c.de, speak: c.de, word: c.de, wordpt: c.pt }; };
export const gTypeNoun = (arr: Noun[]) => (): TypedQ => { const a = rand(arr); return { promptHTML: `Escreva <span class="big">${a.emo} ${a.pt}</span> em alemão (sem artigo):`, answer: a.de, speak: `${a.art} ${a.de}`, word: a.de, wordpt: a.pt }; };
export const gTypeNumber = (): TypedQ => { const n = rand([1,2,3,4,5,6,7,8,9,10,11,12,15,20]); return { promptHTML: `Escreva o número <span class="big">${n}</span> em alemão:`, answer: numDE(n), speak: numDE(n) }; };
export const gTypeWeekday = (): TypedQ => { const d = rand(weekdays); return { promptHTML: `Escreva <span class="big">${d.pt}-feira</span> em alemão:`, answer: d.de, speak: d.de, word: d.de, wordpt: d.pt }; };
export const gTypeCognate = (): TypedQ => { const a = rand(cognates); return { promptHTML: `Escreva <span class="big">${a.pt}</span> em alemão:`, answer: a.de, speak: a.de, word: a.de, wordpt: a.pt }; };
export const gDictate = (pairs: [string, string][]) => (): TypedQ => { const p = rand(pairs); return { promptHTML: "📝 <b>Ditado</b> — ouça e escreva a palavra:", dictation: true, answer: p[0], speak: p[0], word: p[0], wordpt: p[1] }; };

// ---- connect ----
// `single`: true = vale 1 ponto (tudo-ou-nada), usado na prática por capítulo.
//           false = vale 1 ponto por par certo, usado na Prova A0 (fiel ao protótipo original).
const conNouns = (arr: Noun[], nn = 5, single = true) => (): ConnectData => { const pick = sample(arr, nn); return { title: "Ligue o bicho ao nome:", pairs: pick.map((a) => ({ l: `<span style="font-size:1.5rem">${a.emo}</span>`, r: `${a.art} ${a.de}`, key: a.de })), single }; };
const conColors = (nn = 5, single = true) => (): ConnectData => { const pick = sample(colors, nn); return { title: "Ligue a cor ao nome:", pairs: pick.map((c) => ({ l: `<span style="width:26px;height:26px;border-radius:50%;background:${c.hex};${c.hex === "#FFFFFF" ? "box-shadow:inset 0 0 0 2px var(--border);" : ""}display:inline-block"></span>`, r: c.de, key: c.de })), single }; };
const conOpp = (nn = 5, single = true) => (): ConnectData => { const pick = sample(opposites, nn); return { title: "Ligue cada palavra ao seu oposto:", pairs: pick.map((p) => ({ l: p.a, r: p.b, key: p.a })), single }; };
const conCognate = (nn = 5, single = true) => (): ConnectData => { const pick = sample(cognates, nn); return { title: "Ligue o cognato ao português:", pairs: pick.map((c) => ({ l: c.de, r: c.pt, key: c.de })), single }; };
// suíço ↔ alemão: é o contraste que o capítulo ensina, então ele vira exercício
const conHelv = (nn = 5, single = true) => (): ConnectData => { const pick = sample(helvetisms, nn); return { title: "Ligue a palavra suíça à forma usada na Alemanha:", pairs: pick.map((h) => ({ l: h.ch, r: h.de, key: h.ch })), single }; };

// ---- verdadeiro ou falso (em lote) ----
// Metade das afirmações vem trocada de propósito: a forma alemã apresentada
// como se fosse a suíça. É o erro que o aluno de fato comete, então é o que o
// exercício tem que treinar a reconhecer.
const tfHelv = (nn = 5, single = true) => (): TFData => {
  const pick = sample(helvetisms, nn);
  return {
    title: "Verdadeiro ou falso: é assim que se diz na Suíça?",
    single,
    statements: pick.map((h) => {
      const verdadeiro = Math.random() < 0.5;
      const forma = verdadeiro ? (h.art ? `${h.art} ${h.ch}` : h.ch) : h.de;
      return {
        html: `Na Suíça, “${h.pt}” é <b>${forma}</b>`,
        correct: verdadeiro,
        speak: forma,
      };
    }),
  };
};

// ---- lacunas com banco de palavras ----
// Tira uma palavra de conteúdo da frase (>=4 letras, pra não virar caça ao
// artigo) e devolve os pedaços em volta dela. A pontuação grudada na palavra
// fica no pedaço, senão a lacuna pediria "es?" em vez de "es".
function lacunaDe(frase: string, tr: string): ClozeLine | null {
  const palavras = frase.split(" ");
  // frase curta demais não sobra contexto: com "Nein" a linha vira uma lacuna
  // sozinha, que não é leitura, é adivinhação.
  if (palavras.length < 3) return null;
  // A lacuna tem que ser um trecho CONTÍGUO de letras dentro da palavra. Tirar
  // toda pontuação produzia "gehts" a partir de "geht's" — um pedaço que não
  // existe na frase, então indexOf devolvia -1 e os segmentos em volta saíam
  // desalinhados ("Wie geht' [gehts] 's?").
  const cands: { i: number; ini: number; limpo: string }[] = [];
  palavras.forEach((w, i) => {
    const m = w.match(/[A-Za-zÄÖÜäöü]{4,}/);
    if (m && m.index !== undefined) cands.push({ i, ini: m.index, limpo: m[0] });
  });
  if (!cands.length) return null;
  const { i, ini, limpo } = rand(cands);
  const w = palavras[i];
  const antes = palavras.slice(0, i).join(" ") + (i > 0 ? " " : "") + w.slice(0, ini);
  const depois = w.slice(ini + limpo.length) + (i < palavras.length - 1 ? " " + palavras.slice(i + 1).join(" ") : "");
  return { segments: [antes, depois], gaps: [{ answer: limpo }], speak: frase, tr };
}

// Três frases dividindo UM banco: é isso que obriga a ler a frase inteira em
// vez de reconhecer a palavra isolada. Dois distratores entram junto pra o
// banco não se esgotar em eliminação.
const clozeFrases = (pool: Word[], nn = 3, single = true) => (): ClozeData => {
  // sorteia com folga porque lacunaDe recusa frase curta — senão o card sairia
  // com menos linhas que o pedido
  const linhas = sample(pool, pool.length).map((p) => lacunaDe(p.de.replace("…", ""), p.pt)).filter((l): l is ClozeLine => l !== null).slice(0, nn);
  const certas = linhas.map((l) => l.gaps[0].answer);
  const distratores = sample(pool, pool.length)
    .flatMap((p) => p.de.split(" "))
    .map((w) => (w.match(/[A-Za-zÄÖÜäöü]{4,}/) ?? [""])[0])
    .filter((w, i, arr) => w.length >= 4 && !certas.includes(w) && arr.indexOf(w) === i)
    .slice(0, 2);
  return {
    title: "Complete as frases com as palavras do banco:",
    lines: linhas,
    bank: shuffle([...certas, ...distratores]),
    single,
  };
};

// ---- linha do tempo ----
// Estreia com os meses: é conteúdo que o A0 já ensina, a ordem é objetiva, e
// exercita o motor antes de existir a cronologia da Suíça. Sorteia uma JANELA
// contígua (março→julho), não meses soltos — ordenar cinco meses aleatórios
// testa memória de lista, ordenar uma sequência testa o que interessa.
const chronoMeses = (nn = 5, single = true) => (): ChronoData => {
  const ini = Math.floor(Math.random() * (months.length - nn + 1));
  return {
    title: "Ponha os meses em ordem, do primeiro ao último:",
    single,
    events: months.slice(ini, ini + nn).map(([de, pt], k) => ({
      id: de, at: ini + k, label: de, show: pt,
    })),
  };
};

// ---- clique no mapa ----
// Os distratores são os cantões VIZINHOS em posição, não sorteados do país
// inteiro: acertar "qual é Nidwalden" entre Genf, Tessin e Thurgau não prova
// nada, porque dá pra eliminar pela metade do mapa.
const mapCantao = (nn = 4) => (): MapData => {
  const alvo = rand(cantons);
  const [ax, ay] = CANTON_CENTERS[alvo.code];
  const perto = cantons
    .filter((c) => c.code !== alvo.code)
    .map((c) => ({ c, d: Math.hypot(CANTON_CENTERS[c.code][0] - ax, CANTON_CENTERS[c.code][1] - ay) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 6)
    .map((x) => x.c);
  return {
    title: `Clique no cantão de ${alvo.de}${alvo.pt ? " (" + alvo.pt + ")" : ""}:`,
    answer: alvo.code,
    choices: shuffle([alvo.code, ...sample(perto, nn - 1).map((c) => c.code)]),
    speak: alvo.de,
    single: true,
  };
};

// ---- wordsearch ----
const wsFrom = (arr: Noun[], nn = 5, single = true) => (): WSData => { const pick = sample(arr, nn).filter((a) => a.de.length <= 8).map((a) => ({ w: a.de, pt: a.pt })); return { title: "Caça-palavras: clique na 1ª e na última letra. Ao achar, ouça + tradução! 🎁", pairs: pick, size: 9, single }; };

// ---- enumerate ----
const enumFrom = (arr: Noun[], nn = 5, single = true) => (): EnumData => { const pick = sample(arr, nn); return { title: "Enumere: escreva o número da palavra sob cada figura.", items: pick.map((a) => ({ emo: a.emo, de: `${a.art} ${a.de}` })), single }; };

// re-export mc generators via generators.ts questionsForTopic style
import { questionsForTopic, allMcGens } from "./generators";
function mcGen(id: string): () => Question { return () => questionsForTopic(id, 1)[0]; }

// o ditado de números era uma lista de quatro (3, 7, 10, 20), então repetia
// direto; numDE() escreve qualquer número, dá pra cobrir a faixa inteira
const dictNumbers: [string, string][] = [];
for (let n = 0; n <= 100; n++) dictNumbers.push([numDE(n), String(n)]);

const dictColors = colors.map((c) => [c.de, c.pt] as [string, string]);
const dictAnimals = animals.map((a) => [a.de, a.pt] as [string, string]);
const dictFood = food.map((a) => [a.de, a.pt] as [string, string]);

const SPECS: Record<string, ExSpec[]> = {
  alfabeto: [{ kind: "mc", gen: mcGen("alfabeto") }, { kind: "dict", gen: gDictate(dictAnimals) }, { kind: "mc", gen: mcGen("alfabeto") }, { kind: "ws", gen: wsFrom(animals, 4) }],
  numeros: [{ kind: "mc", gen: mcGen("numeros") }, { kind: "typed", gen: gTypeNumber }, { kind: "dict", gen: gDictate(dictNumbers) }, { kind: "mc", gen: mcGen("numeros") }],
  dias: [{ kind: "mc", gen: mcGen("dias") }, { kind: "typed", gen: gTypeWeekday }, { kind: "dict", gen: gDictate(weekdays.map((d) => [d.de, d.pt] as [string, string])) },
    { kind: "chrono", gen: chronoMeses(5) }],
  cores: [{ kind: "mc", gen: mcGen("cores") }, { kind: "connect", gen: conColors(5) }, { kind: "typed", gen: gTypeColor }, { kind: "dict", gen: gDictate(dictColors) }],
  animais: [{ kind: "connect", gen: conNouns(animals, 5) }, { kind: "mc", gen: mcGen("animais") }, { kind: "enum", gen: enumFrom(animals, 5) }, { kind: "dict", gen: gDictate(dictAnimals) }],
  comidas: [{ kind: "connect", gen: conNouns(food, 5) }, { kind: "mc", gen: mcGen("comidas") }, { kind: "ws", gen: wsFrom(food, 4) }, { kind: "dict", gen: gDictate(dictFood) }],
  cumprimentos: [{ kind: "mc", gen: mcGen("cumprimentos") }, { kind: "mc", gen: mcGen("cumprimentos") },
    { kind: "cloze", gen: clozeFrases([...greet, ...phrases], 3) }],
  tamanhos: [{ kind: "connect", gen: conOpp(5) }, { kind: "mc", gen: mcGen("tamanhos") }, { kind: "dict", gen: gDictate(opposites.map((p) => [p.a, p.ptA] as [string, string])) }, { kind: "dict", gen: gDictate(measures.map((m) => [m.de, m.pt] as [string, string])) }],
  // ditado usa a forma SUICA (e a que se escreve); o connect liga suico<->alemao,
  // que e o contraste que o capitulo ensina
  helvetismos: [{ kind: "mc", gen: mcGen("helvetismos") }, { kind: "mc", gen: mcGen("helvetismos") },
    { kind: "dict", gen: gDictate(helvetisms.map((h) => [h.ch, h.pt] as [string, string])) },
    { kind: "connect", gen: conHelv(5) }, { kind: "tf", gen: tfHelv(5) }],
  similar: [{ kind: "map", gen: mapCantao(4) }, { kind: "mc", gen: mcGen("similar") }, { kind: "connect", gen: conCognate(5) }, { kind: "mc", gen: mcGen("similar") }, { kind: "typed", gen: gTypeCognate }, { kind: "dict", gen: gDictate(cognates.map((c) => [c.de, c.pt] as [string, string])) }],
};

export function exSpecsForTopic(id: string, count = 20): ExSpec[] {
  return shuffle(buildRound(SPECS[id] ?? SPECS.similar, count));
}

// ---- Prova A0: 50 pontos em 3 partes, fiel ao protótipo original ----
// Parte 1 · Múltipla escolha (20 pts) — 20 perguntas únicas sorteadas de todos os 9 temas.
// Parte 2 · Escreva / Ditado (10 pts) — 7 "escreva" + 3 ditados, 1 ponto cada.
// Parte 3 · Interativas (20 pts) — 20 exercícios (ligar/enumerar/caça-palavras), cada um
// valendo 1 ponto tudo-ou-nada (single:true), pra fechar 50 perguntas reais = 50 pontos.
const typedGens = [gTypeColor, gTypeNoun(animals), gTypeNoun(food), gTypeNumber, gTypeWeekday, gTypeCognate];
const dictPools = [dictColors, dictAnimals, dictFood];
const interactiveGens: Array<() => ExSpec> = [
  () => ({ kind: "connect", gen: conNouns(animals, 5) }),
  () => ({ kind: "connect", gen: conColors(5) }),
  () => ({ kind: "connect", gen: conOpp(5) }),
  () => ({ kind: "connect", gen: conCognate(5) }),
  () => ({ kind: "enum", gen: enumFrom(food, 5) }),
  () => ({ kind: "enum", gen: enumFrom(animals, 5) }),
  () => ({ kind: "ws", gen: wsFrom(animals, 4) }),
  () => ({ kind: "ws", gen: wsFrom(food, 4) }),
  // `single: true` é obrigatório aqui: a Prova soma só os acertos e divide por
  // um total fixo de 50, então um item que valesse 5 pontos estouraria os 100%.
  () => ({ kind: "tf", gen: tfHelv(5, true) }),
  () => ({ kind: "cloze", gen: clozeFrases([...greet, ...phrases], 3, true) }),
];

export function examSpecsA0(): ExSpec[] {
  // allMcGens() tem menos de 20 geradores únicos — repete em ciclo (cada um ainda sorteia
  // uma palavra/pergunta aleatória por chamada). O buildRound evita que a mesma
  // pergunta caia duas vezes na mesma prova.
  const mcPool = shuffle(allMcGens()).map((gen) => ({ kind: "mc" as const, gen }));
  const part1: ExSpec[] = buildRound(mcPool, 20);
  const part2: ExSpec[] = [
    ...buildRound(shuffle(typedGens).map((gen) => ({ kind: "typed" as const, gen })), 7),
    ...buildRound(shuffle(dictPools).map((pool) => ({ kind: "dict" as const, gen: gDictate(pool) })), 3),
  ];
  // materializa os specs uma vez só (cada fábrica devolve um spec equivalente a
  // cada chamada) pra que o buildRound consiga agrupar a memória por vaga
  const part3Pool = shuffle(interactiveGens).map((make) => make());
  const part3: ExSpec[] = buildRound(part3Pool, 20);
  return [...part1, ...part2, ...part3];
}
export const EXAM_PARTS = [
  { label: "Parte 1 · Múltipla escolha (20 pts)", count: 20 },
  { label: "Parte 2 · Escreva / ditado (10 pts)", count: 10 },
  { label: "Parte 3 · Interativas (20 pts)", count: 20 },
];
export const EXAM_TOTAL = 50;

export { falseFriends };
