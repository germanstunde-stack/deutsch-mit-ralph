// Regras que o conteúdo do app tem que cumprir, checadas contra os dados vivos.
//
// A regra de ouro do app é "nunca cobrar palavra que não foi ensinada". Enquanto
// as frases eram escritas à mão dava pra conferir no olho; desde que elas saem
// de uma fábrica de combinações são 600+, e a conferência virou script. A versão
// anterior desse script morava num diretório temporário e sumiu — por isso este
// vive dentro de src/: o `npm run typecheck` compila ele junto com o resto, então
// ele não consegue apodrecer em silêncio quando um formato de dado muda.
//
// Roda sozinho no `npm run dev` (ver src/main.tsx). O guard import.meta.env.DEV
// faz o bundler descartar tudo isto do build de produção.
import { MODULES } from "../modules";
import { mundartEntries, mundartIndexSize } from "../mundart";
import {
  seinSentences, verbSentences, separableSentences, perfektSentences,
  modalSentences, pluralSentences, caseSentences, pronounSentences,
  articleSentences, prepSentences, questionSentences, type OrderSentence,
} from "../a1/vocab";
import {
  CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS,
  CH_GENERO_PLURAL, CH_CASOS, CH_PRONOMES, CH_ARTIGOS, CH_PREPOSICOES, CH_PERGUNTAS,
} from "../a1/exercises";

export interface Violation { rule: string; where: string; what: string; example?: string }

/* ---------------------------------------------------------------- utilidades */

function words(s: string): string[] {
  return s.replace(/<[^>]*>/g, " ").split(/[^A-Za-zÄÖÜäöüßÀ-ÿ]+/).filter(Boolean);
}

// Palavras de estrutura: artigos, pronomes, preposições, numerais, negação. São
// ensinadas na explicação e na tabela do capítulo, não como card de vocabulário.
const GRAMATICA = new Set(`
der die das den dem des ein eine einen einem einer kein keine nichts
ich du er sie es wir ihr man
mich dich ihn uns euch mir dir ihm
mein meine meinen meinem dein deine deinen sein seine unser unsere ihre
in an auf aus mit nach zu zum zur im am ins von bei fuer für und oder aber nicht
bin bist ist sind seid habe hast hat haben
null eins zwei drei vier fuenf fünf sechs sieben acht neun zehn
sehr gern gut viel wenig immer oft frueh früh spaet spät jeden hier da heute morgen
wann warum wo woher wer was wie alt
`.trim().split(/\s+/));

// Nomes próprios, cidades e países: o aluno reconhece na hora e eles não entram
// em card de propósito.
const PROPRIOS = new Set(`
Anna Max Ralph Zürich Bern Basel Luzern Genf Schweiz
Brasilien Deutschland Portugal Japan Italien Frankreich Österreich
Deutsch Portugiesisch Englisch Spanisch Montag Wochenende Uhr Hause
`.trim().split(/\s+/));

/* -------------------------------------------- regra 1: nada não ensinado (A1) */

const A1_CAPS: { id: string; nome: string; frases: OrderSentence[] }[] = [
  { id: CH_EU_VOCE_SEIN, nome: "cap1 sein", frases: seinSentences },
  { id: CH_VERBOS_HABEN, nome: "cap2 verbos", frases: verbSentences },
  { id: CH_IMPERATIVO, nome: "cap3 separáveis", frases: separableSentences },
  { id: CH_PERFEKT, nome: "cap4 Perfekt", frases: perfektSentences },
  { id: CH_MODAIS, nome: "cap5 modais", frases: modalSentences },
  { id: CH_GENERO_PLURAL, nome: "cap6 plural", frases: pluralSentences },
  { id: CH_CASOS, nome: "cap7 casos", frases: caseSentences },
  { id: CH_PRONOMES, nome: "cap8 pronomes", frases: pronounSentences },
  { id: CH_ARTIGOS, nome: "cap9 artigos", frases: articleSentences },
  { id: CH_PREPOSICOES, nome: "cap10 preposições", frases: prepSentences },
  { id: CH_PERGUNTAS, nome: "cap11 perguntas", frases: questionSentences },
];

function checkTaught(): Violation[] {
  const out: Violation[] = [];
  // O vocabulário permitido é acumulado: o que o capítulo 2 ensinou continua
  // valendo no 4. "Ensinado" é derivado dos CARDS, não de uma lista à mão — os
  // cards são a superfície de ensino, então a regra se mantém sozinha.
  const ensinado = new Set<string>();
  A1_CAPS.forEach((cap) => {
    MODULES.A1.cardsForTopic(cap.id, "pt").items.forEach((c) => {
      words(`${c.deHTML} ${c.speak ?? ""}`).forEach((w) => ensinado.add(w));
    });
    const vistos = new Set<string>();
    cap.frases.forEach((f) => {
      words(f.answer.join(" ")).forEach((w) => {
        if (ensinado.has(w) || GRAMATICA.has(w) || PROPRIOS.has(w) || vistos.has(w)) return;
        vistos.add(w);
        out.push({ rule: "vocabulário não ensinado", where: cap.nome, what: w, example: f.answer.join(" ") });
      });
    });
  });
  return out;
}

/* --------------------------------- regra 2: nenhum ß no currículo (ortografia) */

// A Suíça nunca escreve ß. As únicas strings que podem conter o caractere são as
// que ENSINAM essa regra ("se você vir ß, é texto da Alemanha").
// Basta a string citar a Alemanha: ela está contrastando as duas grafias de
// propósito. Uma frase alemã de exercício nunca contém a palavra "Alemanha".
const SS_ALLOW = [/Alemanha/i];

function checkNoEszett(): Violation[] {
  const out: Violation[] = [];
  const bate = (s: string) => s.includes("ß") && !SS_ALLOW.some((re) => re.test(s));
  (["A0", "A1"] as const).forEach((modId) => {
    const mod = MODULES[modId];
    const expl = mod.explanationsFor("pt");
    mod.topicsFor("pt").forEach((tp) => {
      mod.cardsForTopic(tp.id, "pt").items.forEach((c) => {
        if (bate(c.deHTML) || bate(c.speak ?? "")) {
          out.push({ rule: "ß no currículo", where: `${modId}/${tp.id} (card)`, what: c.speak || c.deHTML });
        }
      });
      const html = expl[tp.id] ?? tp.explanationHTML;
      if (bate(html)) out.push({ rule: "ß no currículo", where: `${modId}/${tp.id} (explicação)`, what: "…" + html.slice(Math.max(0, html.indexOf("ß") - 40), html.indexOf("ß") + 20) + "…" });
      mod.sentencesForTopic(tp.id, null, "pt").forEach((s) => {
        if (bate(s[0])) out.push({ rule: "ß no currículo", where: `${modId}/${tp.id} (frase)`, what: s[0] });
      });
    });
  });
  A1_CAPS.forEach((cap) => {
    cap.frases.forEach((f) => {
      const frase = f.answer.join(" ");
      if (bate(frase)) out.push({ rule: "ß no currículo", where: cap.nome, what: frase });
    });
  });
  return out;
}

/* ------------------------------------ regras 3-5: Mundart nunca é cobrado escrito */

// Dialeto suíço não tem ortografia oficial, então cobrar digitação seria inventar
// gabarito. Os geradores usam só "mc", mas isso é convenção; estas regras tornam
// a garantia mecânica — se alguém um dia puser uma grafia dialetal como resposta
// de ditado ou de montar-frase, o check quebra.
function checkMundart(): Violation[] {
  const out: Violation[] = [];
  const dialetais = new Set(mundartEntries.map((e) => e.mundart.toLowerCase()));

  (["A0", "A1"] as const).forEach((modId) => {
    const mod = MODULES[modId];
    mod.topicsFor("pt").forEach((tp) => {
      // sorteia várias rodadas porque os exercícios são gerados, não fixos
      for (let r = 0; r < 6; r++) {
        mod.exSpecsForTopic(tp.id, "pt", 20).forEach((spec) => {
          if (spec.kind !== "typed" && spec.kind !== "dict" && spec.kind !== "order") return;
          let alvo = "";
          try {
            const item = spec.gen() as { answer?: string | string[] };
            alvo = Array.isArray(item.answer) ? item.answer.join(" ") : item.answer ?? "";
          } catch { return; }
          if (dialetais.has(alvo.toLowerCase())) {
            out.push({ rule: "Mundart cobrado escrito", where: `${modId}/${tp.id} (${spec.kind})`, what: alvo });
          }
        });
      }
    });
  });

  if (mundartIndexSize() !== mundartEntries.length) {
    out.push({ rule: "colisão no índice de Mundart", where: "mundart.ts", what: `${mundartEntries.length} entradas viraram ${mundartIndexSize()} chaves` });
  }
  return out;
}

/* ------------------------------------------------------------------ execução */

export function runVocabChecks(): Violation[] {
  return [...checkTaught(), ...checkNoEszett(), ...checkMundart()];
}

export function reportVocabChecks() {
  let v: Violation[];
  try {
    v = runVocabChecks();
  } catch (e) {
    console.error("[conteúdo] o validador quebrou:", e);
    return;
  }
  if (v.length === 0) {
    console.info("%c[conteúdo] ✅ regras de vocabulário e ortografia OK", "color:#2FB16B;font-weight:bold");
    return;
  }
  console.group(`%c[conteúdo] ⚠️ ${v.length} violação(ões)`, "color:#FF5A5F;font-weight:bold");
  console.table(v);
  console.groupEnd();
}
