import { shuffle } from "../generators";
import { buildRound } from "../exSampler";
import type { ExSpec } from "../exercises";
import type { Lang } from "../../i18n/types";
import {
  gPronounMeaning, gSeinForm, gTypeSein, gOrderSein, gAdjMeaning,
  gVerbMeaning, gVerbFormMC, gTypeVerbForm, gHabenForm, gTypeHaben, gOrderVerb,
  gImperativeMeaning, gImperativeMC, gTypeImperative, gSeparableMeaning, gSeparableFormMC, gTypeSeparableForm, gOrderSeparable,
  gPerfektMeaning, gPerfektPartizipMC, gTypePartizip, gPerfektAuxMC, gTypePerfektAux, gOrderPerfekt,
  gModalMeaning, gModalFormMC, gTypeModalForm, gOrderModal,
  gGenderMC, gNounMeaning, gPluralMC, gTypePlural, gOrderPlural,
  gCaseNounMeaning, gCaseMC, gTypeCaseForm, gOrderCase,
  gPronCaseMC, gTypePronCase, gIndefMeaning, gOrderPronoun,
  gPossMeaning, gPossMC, gTypePoss, gArticleUsage, gOrderArticle,
  gPrepMeaning, gPrepCategoryMC, gPrepFillMC, gTypePrep, gOrderPrep,
  gQWMeaning, gQWFillMC, gTypeQW, gYesNoMC, gNegationMC, gConnectorMeaning, gOrderQuestion,
  gDictVerbMeaning, gDictReverseMC, gDictTypeVerb,
} from "./generators";

export const CH_EU_VOCE_SEIN = "eu-voce-sein";
export const CH_VERBOS_HABEN = "verbos-regulares-haben";
export const CH_IMPERATIVO = "imperativo-separaveis";
export const CH_PERFEKT = "perfekt";
export const CH_MODAIS = "verbos-modais";
export const CH_GENERO_PLURAL = "genero-plural";
export const CH_CASOS = "nominativ-akkusativ-dativ";
export const CH_PRONOMES = "pronomes-indefinidos";
export const CH_ARTIGOS = "artigos-possessivos";
export const CH_PREPOSICOES = "preposicoes";
export const CH_PERGUNTAS = "perguntas-ordem-frase";
export const CH_DICIONARIO_VERBOS = "dicionario-verbos";

// Os 11 capítulos de gramática do A1 (ordem oficial do "Grammatik leicht A1")
// + o dicionário de verbos, um catálogo de vocabulário à parte (não ensina
// gramática nova, só reúne e treina a memorização de todos os verbos vistos).
export const CHAPTER_IDS = [CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS, CH_GENERO_PLURAL, CH_CASOS, CH_PRONOMES, CH_ARTIGOS, CH_PREPOSICOES, CH_PERGUNTAS, CH_DICIONARIO_VERBOS];

// `aud` = pra quem esta lista de exercícios é. A Prova é uma corrida de 50
// itens, então um capítulo pode mandar pra lá só parte do que oferece na
// prática (é o caso do capítulo de textos, cuja compreensão de passagem longa
// quebraria o ritmo do exame). O default cobre os capítulos que não se importam,
// então nenhum deles precisou mudar — e o braço "exam" falha FECHADO: só vai pro
// exame o que alguém escreveu lá explicitamente.
type SpecAudience = "practice" | "exam";

function specsForChapter(id: string, lang: Lang, aud: SpecAudience = "practice"): ExSpec[] {
  void aud; // ainda não há capítulo que diferencie — o de textos vai usar
  switch (id) {
    case CH_EU_VOCE_SEIN:
      return [
        { kind: "mc", gen: () => gPronounMeaning(lang) },
        { kind: "mc", gen: () => gSeinForm(lang) },
        { kind: "mc", gen: () => gAdjMeaning(lang) },
        { kind: "typed", gen: () => gTypeSein(lang) },
        { kind: "order", gen: () => gOrderSein(lang) },
      ];
    case CH_VERBOS_HABEN:
      return [
        { kind: "mc", gen: () => gVerbMeaning(lang) },
        { kind: "mc", gen: () => gVerbFormMC(lang) },
        { kind: "typed", gen: () => gTypeVerbForm(lang) },
        { kind: "mc", gen: () => gHabenForm(lang) },
        { kind: "typed", gen: () => gTypeHaben(lang) },
        { kind: "order", gen: () => gOrderVerb(lang) },
      ];
    case CH_IMPERATIVO:
      return [
        { kind: "mc", gen: () => gImperativeMeaning(lang) },
        { kind: "mc", gen: () => gImperativeMC(lang) },
        { kind: "typed", gen: () => gTypeImperative(lang) },
        { kind: "mc", gen: () => gSeparableMeaning(lang) },
        { kind: "mc", gen: () => gSeparableFormMC(lang) },
        { kind: "typed", gen: () => gTypeSeparableForm(lang) },
        { kind: "order", gen: () => gOrderSeparable(lang) },
      ];
    case CH_PERFEKT:
      return [
        { kind: "mc", gen: () => gPerfektMeaning(lang) },
        { kind: "mc", gen: () => gPerfektPartizipMC(lang) },
        { kind: "typed", gen: () => gTypePartizip(lang) },
        { kind: "mc", gen: () => gPerfektAuxMC(lang) },
        { kind: "typed", gen: () => gTypePerfektAux(lang) },
        { kind: "order", gen: () => gOrderPerfekt(lang) },
      ];
    case CH_MODAIS:
      return [
        { kind: "mc", gen: () => gModalMeaning(lang) },
        { kind: "mc", gen: () => gModalFormMC(lang) },
        { kind: "typed", gen: () => gTypeModalForm(lang) },
        { kind: "order", gen: () => gOrderModal(lang) },
      ];
    case CH_GENERO_PLURAL:
      return [
        { kind: "mc", gen: () => gGenderMC(lang) },
        { kind: "mc", gen: () => gNounMeaning(lang) },
        { kind: "mc", gen: () => gPluralMC(lang) },
        { kind: "typed", gen: () => gTypePlural(lang) },
        { kind: "order", gen: () => gOrderPlural(lang) },
      ];
    case CH_CASOS:
      return [
        { kind: "mc", gen: () => gCaseNounMeaning(lang) },
        { kind: "mc", gen: () => gCaseMC(lang) },
        { kind: "typed", gen: () => gTypeCaseForm(lang) },
        { kind: "order", gen: () => gOrderCase(lang) },
      ];
    case CH_PRONOMES:
      return [
        { kind: "mc", gen: () => gPronCaseMC(lang) },
        { kind: "typed", gen: () => gTypePronCase(lang) },
        { kind: "mc", gen: () => gIndefMeaning(lang) },
        { kind: "order", gen: () => gOrderPronoun(lang) },
      ];
    case CH_ARTIGOS:
      return [
        { kind: "mc", gen: () => gPossMeaning(lang) },
        { kind: "mc", gen: () => gPossMC(lang) },
        { kind: "typed", gen: () => gTypePoss(lang) },
        { kind: "mc", gen: () => gArticleUsage(lang) },
        { kind: "order", gen: () => gOrderArticle(lang) },
      ];
    case CH_PREPOSICOES:
      return [
        { kind: "mc", gen: () => gPrepMeaning(lang) },
        { kind: "mc", gen: () => gPrepCategoryMC(lang) },
        { kind: "mc", gen: () => gPrepFillMC(lang) },
        { kind: "typed", gen: () => gTypePrep(lang) },
        { kind: "order", gen: () => gOrderPrep(lang) },
      ];
    case CH_PERGUNTAS:
      return [
        { kind: "mc", gen: () => gQWMeaning(lang) },
        { kind: "mc", gen: () => gQWFillMC(lang) },
        { kind: "typed", gen: () => gTypeQW(lang) },
        { kind: "mc", gen: () => gYesNoMC(lang) },
        { kind: "mc", gen: () => gNegationMC(lang) },
        { kind: "mc", gen: () => gConnectorMeaning(lang) },
        { kind: "order", gen: () => gOrderQuestion(lang) },
      ];
    case CH_DICIONARIO_VERBOS:
      return [
        { kind: "mc", gen: () => gDictVerbMeaning(lang) },
        { kind: "mc", gen: () => gDictReverseMC(lang) },
        { kind: "typed", gen: () => gDictTypeVerb(lang) },
      ];
    default:
      return [{ kind: "mc", gen: () => gPronounMeaning(lang) }];
  }
}

export function exSpecsForTopic(id: string, lang: Lang, count = 20): ExSpec[] {
  return shuffle(buildRound(specsForChapter(id, lang), count));
}

// Em que parte da Prova cada tipo de exercício cai. Antes eram três `filter`
// soltos, e um tipo novo não casava com nenhum — sumia da Prova sem aviso.
// `Record<ExSpec["kind"], …>` é exaustivo: tipo novo sem classificação não
// compila. "off" = nunca entra em Prova (as seções de Geografia e História não
// têm Prova, então os exercícios exclusivos delas ficam de fora por tipo).
type Bucket = "mc" | "written" | "interactive" | "off";
const BUCKET: Record<ExSpec["kind"], Bucket> = {
  mc: "mc",
  typed: "written",
  dict: "written",
  connect: "interactive",
  ws: "interactive",
  enum: "interactive",
  order: "interactive",
  tf: "interactive",
  cloze: "written",
};

// ---- Prova A1: mesmo formato 50 pts / 3 partes do A0 ----
export function examSpecsFor(lang: Lang): ExSpec[] {
  // "exam" em vez de "practice": o capítulo que quiser mandar só parte dos seus
  // exercícios pra Prova decide isso dentro dele mesmo (ver specsForChapter).
  const all = CHAPTER_IDS.flatMap((id) => specsForChapter(id, lang, "exam"));
  const mc: ExSpec[] = all.filter((s) => BUCKET[s.kind] === "mc");
  const typedDict: ExSpec[] = all.filter((s) => BUCKET[s.kind] === "written");
  const interactive: ExSpec[] = all.filter((s) => BUCKET[s.kind] === "interactive");

  const part1: ExSpec[] = shuffle(buildRound(shuffle(mc), 20));
  const pool2: ExSpec[] = typedDict.length ? typedDict : mc;
  const part2: ExSpec[] = buildRound(shuffle(pool2), 10);
  const pool3: ExSpec[] = interactive.length ? interactive : mc;
  const part3: ExSpec[] = shuffle(buildRound(shuffle(pool3), 20));
  return [...part1, ...part2, ...part3];
}

export function examPartsFor(lang: Lang): { label: string; count: number }[] {
  return lang === "pt"
    ? [
        { label: "Parte 1 · Múltipla escolha (20 pts)", count: 20 },
        { label: "Parte 2 · Escreva / ditado (10 pts)", count: 10 },
        { label: "Parte 3 · Interativas (20 pts)", count: 20 },
      ]
    : [
        { label: "Part 1 · Multiple choice (20 pts)", count: 20 },
        { label: "Part 2 · Write / dictation (10 pts)", count: 10 },
        { label: "Part 3 · Interactive (20 pts)", count: 20 },
      ];
}

export const EXAM_TOTAL = 50;
