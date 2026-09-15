// Palavras que as frases de "montar frase" usam e que os cards do capítulo
// ainda não ensinavam.
//
// A regra do app é "nunca cobrar palavra que não foi ensinada". Enquanto as
// frases eram escritas à mão dava pra conferir no olho; agora que elas saem de
// uma fábrica de combinações, a conferência virou script
// (scratchpad/checkVocab.ts) e o que ele apontou está listado aqui.
//
// O vocabulário vale em cadeia: o que o capítulo 2 ensina continua valendo no
// 4. Por isso cada lista só traz o que é NOVO naquele ponto do curso.
import type { Lang } from "../../i18n/types";
import type { CardItem } from "../../components/Cards";

interface Noun { art: "der" | "die" | "das"; de: string; plural?: string; pt: string; en: string }
interface Word { de: string; pt: string; en: string; hint?: string }

/* ---- substantivos ---- */

export const nounsCap1: Noun[] = [
  { art: "der", de: "Freund", plural: "Freunde", pt: "amigo", en: "friend" },
  { art: "der", de: "Bruder", plural: "Brüder", pt: "irmão", en: "brother" },
  { art: "die", de: "Schwester", plural: "Schwestern", pt: "irmã", en: "sister" },
];

export const nounsCap2: Noun[] = [
  { art: "der", de: "Hund", plural: "Hunde", pt: "cachorro", en: "dog" },
  { art: "die", de: "Katze", plural: "Katzen", pt: "gato", en: "cat" },
  { art: "das", de: "Auto", plural: "Autos", pt: "carro", en: "car" },
  { art: "die", de: "Pizza", pt: "pizza", en: "pizza" },
  { art: "das", de: "Brot", pt: "pão", en: "bread" },
  { art: "der", de: "Käse", pt: "queijo", en: "cheese" },
  { art: "die", de: "Suppe", pt: "sopa", en: "soup" },
];

export const nounsCap3: Noun[] = [
  { art: "die", de: "Mutter", plural: "Mütter", pt: "mãe", en: "mother" },
  { art: "der", de: "Vater", plural: "Väter", pt: "pai", en: "father" },
  { art: "der", de: "Abend", plural: "Abende", pt: "noite", en: "evening" },
  { art: "die", de: "Milch", pt: "leite", en: "milk" },
  { art: "das", de: "Obst", pt: "fruta", en: "fruit" },
  { art: "die", de: "Uhr", plural: "Uhren", pt: "hora, relógio", en: "hour, clock" },
];

export const nounsCap4: Noun[] = [
  { art: "das", de: "Buch", plural: "Bücher", pt: "livro", en: "book" },
  { art: "der", de: "Kaffee", pt: "café", en: "coffee" },
  { art: "das", de: "Wasser", pt: "água", en: "water" },
  { art: "der", de: "Tee", pt: "chá", en: "tea" },
];

export const nounsCap10: Noun[] = [
  { art: "der", de: "Zug", plural: "Züge", pt: "trem", en: "train" },
  { art: "das", de: "Fahrrad", plural: "Fahrräder", pt: "bicicleta", en: "bike" },
  { art: "das", de: "Restaurant", plural: "Restaurants", pt: "restaurante", en: "restaurant" },
  { art: "das", de: "Kino", plural: "Kinos", pt: "cinema", en: "cinema" },
  { art: "der", de: "Arzt", plural: "Ärzte", pt: "médico", en: "doctor" },
];

/* ---- verbos ---- */

// "um sieben Uhr" aparece já no capítulo 3, mas as preposições só são
// explicadas no 10 — então a expressão de hora vai no card daqui.
export const tempoCap3: Word[] = [
  { de: "um", pt: "às (hora)", en: "at (time)", hint: "um sieben Uhr · um acht Uhr" },
  { de: "am", pt: "na/no (dia)", en: "on (day)", hint: "am Montag · am Wochenende" },
];

export const verbsCap5: Word[] = [
  { de: "schwimmen", pt: "nadar", en: "to swim" },
  { de: "parken", pt: "estacionar", en: "to park" },
];

// O capítulo 7 é sobre caso — e quem manda no caso é o verbo. Então os verbos
// vão pro card junto com o caso que cada um pede: é a informação que o aluno
// precisa ter na mão pra acertar o exercício.
export const verbsCap7: Word[] = [
  { de: "nehmen", pt: "pegar", en: "to take", hint: "+ Akkusativ · ich nehme, er nimmt" },
  { de: "sehen", pt: "ver", en: "to see", hint: "+ Akkusativ · ich sehe, du siehst" },
  { de: "kennen", pt: "conhecer", en: "to know", hint: "+ Akkusativ · ich kenne, er kennt" },
  { de: "helfen", pt: "ajudar", en: "to help", hint: "+ Dativ! · ich helfe, du hilfst, er hilft" },
  { de: "gehören", pt: "pertencer", en: "to belong", hint: "+ Dativ! · das gehört mir" },
];

export const verbsCap8: Word[] = [
  { de: "lieben", pt: "amar", en: "to love", hint: "+ Akkusativ · ich liebe dich" },
  { de: "danken", pt: "agradecer", en: "to thank", hint: "+ Dativ! · ich danke, er dankt" },
  { de: "gefallen", pt: "agradar, gostar", en: "to please", hint: "+ Dativ! · das gefällt mir" },
  { de: "wissen", pt: "saber", en: "to know", hint: "ich weiss, du weisst, er weiss" },
];

export const verbsCap11: Word[] = [
  { de: "kosten", pt: "custar", en: "to cost", hint: "wie viel kostet das?" },
];

/* ---- adjetivos ---- */

export const adjsCap6: Word[] = [
  { de: "frisch", pt: "fresco", en: "fresh" },
  { de: "offen", pt: "aberto", en: "open" },
];

export const adjsCap9: Word[] = [
  { de: "neu", pt: "novo", en: "new" },
];

/* ---- conversão pra card ---- */

export function nounCards(pool: Noun[], lang: Lang): CardItem[] {
  return pool.map((n) => ({
    deHTML: `<span class="art ${n.art}">${n.art}</span> ${n.de}${n.plural ? `<br><small>die ${n.plural}</small>` : ""}`,
    pt: lang === "pt" ? n.pt : n.en,
    speak: `${n.art} ${n.de}`,
  }));
}

export function wordCards(pool: Word[], lang: Lang): CardItem[] {
  return pool.map((w) => ({
    deHTML: `<b>${w.de}</b>${w.hint ? `<br><small>${w.hint}</small>` : ""}`,
    pt: lang === "pt" ? w.pt : w.en,
    speak: w.de,
  }));
}
