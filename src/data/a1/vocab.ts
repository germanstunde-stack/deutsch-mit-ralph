// Vocabulário/gramática do A1. Baseado na sequência oficial do Goethe-Zertifikat
// A1 (Start Deutsch 1), conforme "Grammatik leicht A1" (Hueber Verlag).
import type { Lang } from "../../i18n/types";

export interface Pronoun { de: string; meaning: Record<Lang, string>; }
export const pronouns: Pronoun[] = [
  { de: "ich", meaning: { pt: "eu", en: "I" } },
  { de: "du", meaning: { pt: "você (informal)", en: "you (informal, singular)" } },
  { de: "er", meaning: { pt: "ele", en: "he" } },
  { de: "es", meaning: { pt: "isso / ele-neutro", en: "it" } },
  { de: "sie", meaning: { pt: "ela / eles, elas", en: "she / they" } },
  { de: "wir", meaning: { pt: "nós", en: "we" } },
  { de: "ihr", meaning: { pt: "vocês (informal)", en: "you all (informal)" } },
  { de: "Sie", meaning: { pt: "o(a) senhor(a) / vocês (formal)", en: "you (formal, singular or plural)" } },
];

export interface SeinForm { pron: string; form: string; meaning: Record<Lang, string>; }
export const seinForms: SeinForm[] = [
  { pron: "ich", form: "bin", meaning: { pt: "eu sou / estou", en: "I am" } },
  { pron: "du", form: "bist", meaning: { pt: "você é / está", en: "you are" } },
  { pron: "er / es / sie", form: "ist", meaning: { pt: "ele/ela é / está", en: "he/she/it is" } },
  { pron: "wir", form: "sind", meaning: { pt: "nós somos / estamos", en: "we are" } },
  { pron: "ihr", form: "seid", meaning: { pt: "vocês são / estão", en: "you all are" } },
  { pron: "sie / Sie", form: "sind", meaning: { pt: "eles são / o(a) sr(a) é (formal)", en: "they are / you are (formal)" } },
];

export interface SeinSentence { chunks: string[]; answer: string[]; meaning: Record<Lang, string>; }
export const seinSentences: SeinSentence[] = [
  { chunks: ["ist", "er", "aus", "Berlin"], answer: ["er", "ist", "aus", "Berlin"], meaning: { pt: "ele é de Berlim", en: "he is from Berlin" } },
  { chunks: ["bin", "ich", "glücklich"], answer: ["ich", "bin", "glücklich"], meaning: { pt: "eu estou feliz", en: "I am happy" } },
  { chunks: ["sind", "wir", "Freunde"], answer: ["wir", "sind", "Freunde"], meaning: { pt: "nós somos amigos", en: "we are friends" } },
  { chunks: ["bist", "du", "müde"], answer: ["du", "bist", "müde"], meaning: { pt: "você está cansado", en: "you are tired" } },
  { chunks: ["seid", "glücklich", "ihr"], answer: ["ihr", "seid", "glücklich"], meaning: { pt: "vocês estão felizes", en: "you all are happy" } },
  { chunks: ["ist", "das", "mein Bruder"], answer: ["das", "ist", "mein Bruder"], meaning: { pt: "este é meu irmão", en: "this is my brother" } },
];
