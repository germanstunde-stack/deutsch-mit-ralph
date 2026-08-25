import { rand, sample, shuffle, type Question } from "../generators";
import type { TypedQ, OrderData } from "../exercises";
import type { Lang } from "../../i18n/types";
import {
  pronouns, seinForms, seinSentences,
  regularVerbs, vowelChangeVerbs, habenForms, verbSentences,
  imperativeVerbs, separableVerbs, separableSentences,
  perfektHabenRegular, perfektHabenIrregular, perfektSein, perfektSentences,
  modalVerbs, modalSentences,
  nounsPlural, pluralSentences,
  caseNouns, caseSentences,
  type Verb, type OrderSentence,
} from "./vocab";

let uid = 0;
function q(x: Omit<Question, "key">): Question { return { key: "a1q" + uid++, ...x }; }

/* ---------- helpers genéricos (reaproveitados por vários capítulos) ---------- */
type PronounKey = "ich" | "du" | "er" | "wir" | "ihr" | "sie";
const PRONOUN_KEYS: PronounKey[] = ["ich", "du", "er", "wir", "ihr", "sie"];
const PRONOUN_LABEL: Record<PronounKey, string> = { ich: "ich", du: "du", er: "er / es / sie", wir: "wir", ihr: "ihr", sie: "sie / Sie" };

interface FormEntry { pron: string; form: string; speak: string; }

function gFormMC(lang: Lang, label: string, forms: FormEntry[]): Question {
  const s = rand(forms);
  const uniqueForms = forms.map((f) => f.form).filter((f, i, a) => a.indexOf(f) === i);
  const wrong = sample(uniqueForms, 3, s.form);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: s.form, correct: true });
  const prompt = lang === "pt"
    ? `Qual forma de <span class="k">${label}</span> vai com <span class="big">${s.pron}</span>?`
    : `Which form of <span class="k">${label}</span> goes with <span class="big">${s.pron}</span>?`;
  return q({ promptHTML: prompt, speak: s.speak, options: shuffle(opts), word: s.form, wordpt: s.pron });
}

function gTypeForm(lang: Lang, label: string, forms: FormEntry[]): TypedQ {
  const s = rand(forms);
  const prompt = lang === "pt"
    ? `Complete com a forma certa de <span class="k">${label}</span>: <span class="big">${s.pron} ___</span>`
    : `Complete with the right form of <span class="k">${label}</span>: <span class="big">${s.pron} ___</span>`;
  return { promptHTML: prompt, answer: s.form, speak: s.speak, word: s.form, wordpt: s.pron };
}

function gOrder(lang: Lang, pool: OrderSentence[]): OrderData {
  const s = rand(pool);
  const title = lang === "pt" ? `Monte a frase: “${s.meaning.pt}”` : `Build the sentence: “${s.meaning.en}”`;
  return { title, chunks: shuffle(s.chunks), answer: s.answer, single: true };
}

interface HasMeaning { inf: string; meaning: Record<Lang, string>; }
interface ConjugatedVerb extends HasMeaning { forms: Record<PronounKey, string>; }

function gVerbMeaningGeneric(lang: Lang, pool: HasMeaning[]): Question {
  const v = rand(pool);
  const opts = sample(pool, 3, v).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: v.meaning[lang], correct: true });
  const prompt = lang === "pt" ? `O que significa <span class="big">${v.inf}</span>?` : `What does <span class="big">${v.inf}</span> mean?`;
  return q({ promptHTML: prompt, speak: v.inf, options: shuffle(opts), word: v.inf, wordpt: v.meaning.pt });
}

function gVerbFormMCGeneric(lang: Lang, pool: ConjugatedVerb[]): Question {
  const v = rand(pool);
  const key = rand(PRONOUN_KEYS);
  const correct = v.forms[key];
  const wrongPool = PRONOUN_KEYS.filter((k) => k !== key).map((k) => v.forms[k]);
  const wrong = sample([...new Set(wrongPool)], 3, correct);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: correct, correct: true });
  const prompt = lang === "pt"
    ? `Qual forma de <span class="k">${v.inf}</span> vai com <span class="big">${PRONOUN_LABEL[key]}</span>?`
    : `Which form of <span class="k">${v.inf}</span> goes with <span class="big">${PRONOUN_LABEL[key]}</span>?`;
  return q({ promptHTML: prompt, speak: `${PRONOUN_LABEL[key]} ${correct}`, options: shuffle(opts), word: correct, wordpt: v.inf });
}

function gTypeVerbFormGeneric(lang: Lang, pool: ConjugatedVerb[]): TypedQ {
  const v = rand(pool);
  const key = rand(PRONOUN_KEYS);
  const correct = v.forms[key];
  const prompt = lang === "pt"
    ? `Complete: <span class="big">${PRONOUN_LABEL[key]} ___</span> (${v.inf})`
    : `Complete: <span class="big">${PRONOUN_LABEL[key]} ___</span> (${v.inf})`;
  return { promptHTML: prompt, answer: correct, speak: `${PRONOUN_LABEL[key]} ${correct}`, word: correct, wordpt: v.inf };
}

/* ---------- capítulo 1: eu, você & sein ---------- */
export function gPronounMeaning(lang: Lang): Question {
  const p = rand(pronouns);
  const opts = sample(pronouns, 3, p).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: p.meaning[lang], correct: true });
  const prompt = lang === "pt" ? `O que significa <span class="big">${p.de}</span>?` : `What does <span class="big">${p.de}</span> mean?`;
  return q({ promptHTML: prompt, speak: p.de, options: shuffle(opts), word: p.de, wordpt: p.meaning.pt });
}

export const gSeinForm = (lang: Lang): Question => gFormMC(lang, "sein", seinForms);
export const gTypeSein = (lang: Lang): TypedQ => gTypeForm(lang, "sein", seinForms);
export const gOrderSein = (lang: Lang): OrderData => gOrder(lang, seinSentences);

/* ---------- capítulo 2: verbos regulares, haben, mudança de vogal ---------- */
const CH2_VERBS: Verb[] = [...regularVerbs, ...vowelChangeVerbs];

export const gVerbMeaning = (lang: Lang): Question => gVerbMeaningGeneric(lang, CH2_VERBS);
export const gVerbFormMC = (lang: Lang): Question => gVerbFormMCGeneric(lang, CH2_VERBS);
export const gTypeVerbForm = (lang: Lang): TypedQ => gTypeVerbFormGeneric(lang, CH2_VERBS);
export const gHabenForm = (lang: Lang): Question => gFormMC(lang, "haben", habenForms);
export const gTypeHaben = (lang: Lang): TypedQ => gTypeForm(lang, "haben", habenForms);
export const gOrderVerb = (lang: Lang): OrderData => gOrder(lang, verbSentences);

/* ---------- capítulo 3: imperativo & verbos separáveis ---------- */
type ImperativeTarget = "du" | "ihr" | "sie";
const IMPERATIVE_TARGETS: ImperativeTarget[] = ["du", "ihr", "sie"];
const IMPERATIVE_LABEL: Record<ImperativeTarget, string> = { du: "du", ihr: "ihr", sie: "Sie" };

export const gImperativeMeaning = (lang: Lang): Question => gVerbMeaningGeneric(lang, imperativeVerbs);

export function gImperativeMC(lang: Lang): Question {
  const v = rand(imperativeVerbs);
  const target = rand(IMPERATIVE_TARGETS);
  const correct = v[target];
  const wrongPool = imperativeVerbs.filter((o) => o.inf !== v.inf).map((o) => o[target]);
  const wrong = sample([...new Set(wrongPool)], 3, correct);
  const opts = wrong.map((f) => ({ label: f + "!", correct: false }));
  opts.push({ label: correct + "!", correct: true });
  const prompt = lang === "pt"
    ? `Qual é o imperativo (${IMPERATIVE_LABEL[target]}) de <span class="big">${v.inf}</span>?`
    : `What's the (${IMPERATIVE_LABEL[target]}) imperative of <span class="big">${v.inf}</span>?`;
  return q({ promptHTML: prompt, speak: correct, options: shuffle(opts), word: correct, wordpt: v.inf });
}

export function gTypeImperative(lang: Lang): TypedQ {
  const v = rand(imperativeVerbs);
  const target = rand(IMPERATIVE_TARGETS);
  const correct = v[target];
  const prompt = lang === "pt"
    ? `Escreva o imperativo (${IMPERATIVE_LABEL[target]}) de <span class="big">${v.inf}</span> (sem pontuação):`
    : `Write the (${IMPERATIVE_LABEL[target]}) imperative of <span class="big">${v.inf}</span> (no punctuation):`;
  return { promptHTML: prompt, answer: correct, speak: correct, word: correct, wordpt: v.inf };
}

export const gSeparableMeaning = (lang: Lang): Question => gVerbMeaningGeneric(lang, separableVerbs);
export const gSeparableFormMC = (lang: Lang): Question => gVerbFormMCGeneric(lang, separableVerbs);
export const gTypeSeparableForm = (lang: Lang): TypedQ => gTypeVerbFormGeneric(lang, separableVerbs);
export const gOrderSeparable = (lang: Lang): OrderData => gOrder(lang, separableSentences);

/* ---------- capítulo 4: Perfekt (passado composto) ---------- */
const CH4_PERFEKT = [...perfektHabenRegular, ...perfektHabenIrregular, ...perfektSein];

export const gPerfektMeaning = (lang: Lang): Question => gVerbMeaningGeneric(lang, CH4_PERFEKT);

export function gPerfektPartizipMC(lang: Lang): Question {
  const v = rand(CH4_PERFEKT);
  const wrong = sample(CH4_PERFEKT, 3, v).map((o) => o.partizip);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: v.partizip, correct: true });
  const prompt = lang === "pt"
    ? `Qual é o particípio (Partizip II) de <span class="big">${v.inf}</span>?`
    : `What's the past participle (Partizip II) of <span class="big">${v.inf}</span>?`;
  return q({ promptHTML: prompt, speak: v.partizip, options: shuffle(opts), word: v.partizip, wordpt: v.inf });
}

export function gTypePartizip(lang: Lang): TypedQ {
  const v = rand(CH4_PERFEKT);
  const prompt = lang === "pt"
    ? `Escreva o particípio (Partizip II) de <span class="big">${v.inf}</span>:`
    : `Write the past participle (Partizip II) of <span class="big">${v.inf}</span>:`;
  return { promptHTML: prompt, answer: v.partizip, speak: v.partizip, word: v.partizip, wordpt: v.inf };
}

function pickPerfektAux(v: (typeof CH4_PERFEKT)[number]) {
  const auxForms = v.auxiliary === "haben" ? habenForms : seinForms;
  const key = rand(PRONOUN_KEYS);
  const entry = auxForms.find((f) => f.pron === PRONOUN_LABEL[key])!;
  return { key, auxForms, entry };
}

export function gPerfektAuxMC(lang: Lang): Question {
  const v = rand(CH4_PERFEKT);
  const { key, auxForms, entry } = pickPerfektAux(v);
  const otherAux = v.auxiliary === "haben" ? seinForms : habenForms;
  const wrongPool = [...auxForms.filter((f) => f.pron !== PRONOUN_LABEL[key]).map((f) => f.form), ...otherAux.map((f) => f.form)];
  const wrong = sample([...new Set(wrongPool)], 3, entry.form);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: entry.form, correct: true });
  const prompt = lang === "pt"
    ? `Complete: <span class="big">${PRONOUN_LABEL[key]} ___ ${v.partizip}</span> (${v.inf})`
    : `Complete: <span class="big">${PRONOUN_LABEL[key]} ___ ${v.partizip}</span> (${v.inf})`;
  return q({ promptHTML: prompt, speak: `${PRONOUN_LABEL[key]} ${entry.form} ${v.partizip}`, options: shuffle(opts), word: entry.form, wordpt: v.auxiliary });
}

export function gTypePerfektAux(lang: Lang): TypedQ {
  const v = rand(CH4_PERFEKT);
  const { key, entry } = pickPerfektAux(v);
  const prompt = lang === "pt"
    ? `Complete com o auxiliar certo: <span class="big">${PRONOUN_LABEL[key]} ___ ${v.partizip}</span> (${v.inf})`
    : `Complete with the right auxiliary: <span class="big">${PRONOUN_LABEL[key]} ___ ${v.partizip}</span> (${v.inf})`;
  return { promptHTML: prompt, answer: entry.form, speak: `${PRONOUN_LABEL[key]} ${entry.form} ${v.partizip}`, word: entry.form, wordpt: v.auxiliary };
}

export const gOrderPerfekt = (lang: Lang): OrderData => gOrder(lang, perfektSentences);

/* ---------- capítulo 5: verbos modais ---------- */
export const gModalMeaning = (lang: Lang): Question => gVerbMeaningGeneric(lang, modalVerbs);
export const gModalFormMC = (lang: Lang): Question => gVerbFormMCGeneric(lang, modalVerbs);
export const gTypeModalForm = (lang: Lang): TypedQ => gTypeVerbFormGeneric(lang, modalVerbs);
export const gOrderModal = (lang: Lang): OrderData => gOrder(lang, modalSentences);

/* ---------- capítulo 6: gênero & plural ---------- */
export function gGenderMC(lang: Lang): Question {
  const n = rand(nounsPlural);
  const prompt = lang === "pt"
    ? `Qual artigo vai com <span class="big">${n.de}</span> (${n.meaning.pt})?`
    : `Which article goes with <span class="big">${n.de}</span> (${n.meaning.en})?`;
  return q({
    promptHTML: prompt, speak: `${n.art} ${n.de}`, word: n.de, wordpt: n.meaning.pt,
    options: [{ label: "der", correct: n.art === "der" }, { label: "die", correct: n.art === "die" }, { label: "das", correct: n.art === "das" }],
  });
}

export function gNounMeaning(lang: Lang): Question {
  const n = rand(nounsPlural);
  const opts = sample(nounsPlural, 3, n).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: n.meaning[lang], correct: true });
  const prompt = lang === "pt" ? `O que significa <span class="big">${n.art} ${n.de}</span>?` : `What does <span class="big">${n.art} ${n.de}</span> mean?`;
  return q({ promptHTML: prompt, speak: `${n.art} ${n.de}`, options: shuffle(opts), word: n.de, wordpt: n.meaning.pt });
}

export function gPluralMC(lang: Lang): Question {
  const n = rand(nounsPlural);
  const wrong = sample(nounsPlural, 3, n).map((o) => o.plural);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: n.plural, correct: true });
  const prompt = lang === "pt"
    ? `Qual é o plural de <span class="big">${n.art} ${n.de}</span>?`
    : `What's the plural of <span class="big">${n.art} ${n.de}</span>?`;
  return q({ promptHTML: prompt, speak: `die ${n.plural}`, options: shuffle(opts), word: n.plural, wordpt: n.de });
}

export function gTypePlural(lang: Lang): TypedQ {
  const n = rand(nounsPlural);
  const prompt = lang === "pt"
    ? `Escreva o plural de <span class="big">${n.art} ${n.de}</span>:`
    : `Write the plural of <span class="big">${n.art} ${n.de}</span>:`;
  return { promptHTML: prompt, answer: n.plural, speak: `die ${n.plural}`, word: n.plural, wordpt: n.de };
}

export const gOrderPlural = (lang: Lang): OrderData => gOrder(lang, pluralSentences);

/* ---------- capítulo 7: Nominativ, Akkusativ & Dativ ---------- */
type CaseKey = "nom" | "akk" | "dat";
const CASE_KEYS: CaseKey[] = ["nom", "akk", "dat"];
const CASE_LABEL = {
  pt: { nom: "nominativo", akk: "acusativo", dat: "dativo" },
  en: { nom: "nominative", akk: "accusative", dat: "dative" },
} as const;

export function gCaseNounMeaning(lang: Lang): Question {
  const n = rand(caseNouns);
  const opts = sample(caseNouns, 3, n).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: n.meaning[lang], correct: true });
  const prompt = lang === "pt" ? `O que significa <span class="big">${n.nom}</span>?` : `What does <span class="big">${n.nom}</span> mean?`;
  return q({ promptHTML: prompt, speak: n.nom, options: shuffle(opts), word: n.de, wordpt: n.meaning.pt });
}

export function gCaseMC(lang: Lang): Question {
  const n = rand(caseNouns);
  const c = rand(CASE_KEYS);
  const correct = n[c];
  const wrongPool = CASE_KEYS.filter((k) => k !== c).map((k) => n[k]);
  const wrong = [...new Set(wrongPool)].filter((f) => f !== correct);
  while (wrong.length < 3) {
    const other = rand(caseNouns.filter((o) => o.de !== n.de));
    const candidate = other[c];
    if (candidate !== correct && !wrong.includes(candidate)) wrong.push(candidate);
  }
  const opts = wrong.slice(0, 3).map((f) => ({ label: f, correct: false }));
  opts.push({ label: correct, correct: true });
  const prompt = lang === "pt"
    ? `Qual é o <span class="k">${CASE_LABEL.pt[c]}</span> de <span class="big">${n.de}</span> (${n.meaning.pt})?`
    : `What's the <span class="k">${CASE_LABEL.en[c]}</span> of <span class="big">${n.de}</span> (${n.meaning.en})?`;
  return q({ promptHTML: prompt, speak: correct, options: shuffle(opts), word: correct, wordpt: n.de });
}

export function gTypeCaseForm(lang: Lang): TypedQ {
  const n = rand(caseNouns);
  const c = rand(CASE_KEYS);
  const prompt = lang === "pt"
    ? `Escreva o <span class="k">${CASE_LABEL.pt[c]}</span> de <span class="big">${n.de}</span> (${n.meaning.pt}):`
    : `Write the <span class="k">${CASE_LABEL.en[c]}</span> of <span class="big">${n.de}</span> (${n.meaning.en}):`;
  return { promptHTML: prompt, answer: n[c], speak: n[c], word: n[c], wordpt: n.de };
}

export const gOrderCase = (lang: Lang): OrderData => gOrder(lang, caseSentences);
