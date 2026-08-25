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

export interface SeinForm { pron: string; form: string; speak: string; meaning: Record<Lang, string>; }
export const seinForms: SeinForm[] = [
  { pron: "ich", form: "bin", speak: "ich bin", meaning: { pt: "eu sou / estou", en: "I am" } },
  { pron: "du", form: "bist", speak: "du bist", meaning: { pt: "você é / está", en: "you are" } },
  { pron: "er / es / sie", form: "ist", speak: "er ist", meaning: { pt: "ele/ela é / está", en: "he/she/it is" } },
  { pron: "wir", form: "sind", speak: "wir sind", meaning: { pt: "nós somos / estamos", en: "we are" } },
  { pron: "ihr", form: "seid", speak: "ihr seid", meaning: { pt: "vocês são / estão", en: "you all are" } },
  { pron: "sie / Sie", form: "sind", speak: "sie sind", meaning: { pt: "eles são / o(a) sr(a) é (formal)", en: "they are / you are (formal)" } },
];

// Frases embaralhadas pro engine "montar frase" (ordem da frase / Satzklammer).
// Formato genérico, reaproveitado por qualquer capítulo.
export interface OrderSentence { chunks: string[]; answer: string[]; meaning: Record<Lang, string>; }
export const seinSentences: OrderSentence[] = [
  { chunks: ["ist", "er", "aus", "Berlin"], answer: ["er", "ist", "aus", "Berlin"], meaning: { pt: "ele é de Berlim", en: "he is from Berlin" } },
  { chunks: ["bin", "ich", "glücklich"], answer: ["ich", "bin", "glücklich"], meaning: { pt: "eu estou feliz", en: "I am happy" } },
  { chunks: ["sind", "wir", "Freunde"], answer: ["wir", "sind", "Freunde"], meaning: { pt: "nós somos amigos", en: "we are friends" } },
  { chunks: ["bist", "du", "müde"], answer: ["du", "bist", "müde"], meaning: { pt: "você está cansado", en: "you are tired" } },
  { chunks: ["seid", "glücklich", "ihr"], answer: ["ihr", "seid", "glücklich"], meaning: { pt: "vocês estão felizes", en: "you all are happy" } },
  { chunks: ["ist", "das", "mein Bruder"], answer: ["das", "ist", "mein Bruder"], meaning: { pt: "este é meu irmão", en: "this is my brother" } },
];

// ---- Capítulo 2: verbos regulares, haben, verbos com mudança de vogal ----
export interface Verb { inf: string; meaning: Record<Lang, string>; forms: Record<"ich" | "du" | "er" | "wir" | "ihr" | "sie", string>; }

export const regularVerbs: Verb[] = [
  { inf: "kommen", meaning: { pt: "vir", en: "to come" }, forms: { ich: "komme", du: "kommst", er: "kommt", wir: "kommen", ihr: "kommt", sie: "kommen" } },
  { inf: "machen", meaning: { pt: "fazer", en: "to do / make" }, forms: { ich: "mache", du: "machst", er: "macht", wir: "machen", ihr: "macht", sie: "machen" } },
  { inf: "wohnen", meaning: { pt: "morar", en: "to live (reside)" }, forms: { ich: "wohne", du: "wohnst", er: "wohnt", wir: "wohnen", ihr: "wohnt", sie: "wohnen" } },
  { inf: "lieben", meaning: { pt: "amar", en: "to love" }, forms: { ich: "liebe", du: "liebst", er: "liebt", wir: "lieben", ihr: "liebt", sie: "lieben" } },
  { inf: "arbeiten", meaning: { pt: "trabalhar", en: "to work" }, forms: { ich: "arbeite", du: "arbeitest", er: "arbeitet", wir: "arbeiten", ihr: "arbeitet", sie: "arbeiten" } },
  { inf: "heißen", meaning: { pt: "chamar-se", en: "to be called" }, forms: { ich: "heiße", du: "heißt", er: "heißt", wir: "heißen", ihr: "heißt", sie: "heißen" } },
];

export const vowelChangeVerbs: Verb[] = [
  { inf: "fahren", meaning: { pt: "dirigir / viajar", en: "to drive / go" }, forms: { ich: "fahre", du: "fährst", er: "fährt", wir: "fahren", ihr: "fahrt", sie: "fahren" } },
  { inf: "sehen", meaning: { pt: "ver", en: "to see" }, forms: { ich: "sehe", du: "siehst", er: "sieht", wir: "sehen", ihr: "seht", sie: "sehen" } },
  { inf: "essen", meaning: { pt: "comer", en: "to eat" }, forms: { ich: "esse", du: "isst", er: "isst", wir: "essen", ihr: "esst", sie: "essen" } },
  { inf: "sprechen", meaning: { pt: "falar", en: "to speak" }, forms: { ich: "spreche", du: "sprichst", er: "spricht", wir: "sprechen", ihr: "sprecht", sie: "sprechen" } },
  { inf: "lesen", meaning: { pt: "ler", en: "to read" }, forms: { ich: "lese", du: "liest", er: "liest", wir: "lesen", ihr: "lest", sie: "lesen" } },
  { inf: "geben", meaning: { pt: "dar", en: "to give" }, forms: { ich: "gebe", du: "gibst", er: "gibt", wir: "geben", ihr: "gebt", sie: "geben" } },
];

export interface HabenForm { pron: string; form: string; speak: string; meaning: Record<Lang, string>; }
export const habenForms: HabenForm[] = [
  { pron: "ich", form: "habe", speak: "ich habe", meaning: { pt: "eu tenho", en: "I have" } },
  { pron: "du", form: "hast", speak: "du hast", meaning: { pt: "você tem", en: "you have" } },
  { pron: "er / es / sie", form: "hat", speak: "er hat", meaning: { pt: "ele/ela tem", en: "he/she/it has" } },
  { pron: "wir", form: "haben", speak: "wir haben", meaning: { pt: "nós temos", en: "we have" } },
  { pron: "ihr", form: "habt", speak: "ihr habt", meaning: { pt: "vocês têm", en: "you all have" } },
  { pron: "sie / Sie", form: "haben", speak: "sie haben", meaning: { pt: "eles têm / o(a) sr(a) tem (formal)", en: "they have / you have (formal)" } },
];

export const verbSentences: OrderSentence[] = [
  { chunks: ["komme", "ich", "aus", "Brasilien"], answer: ["ich", "komme", "aus", "Brasilien"], meaning: { pt: "eu venho do Brasil", en: "I come from Brazil" } },
  { chunks: ["einen", "er", "hat", "Hund"], answer: ["er", "hat", "einen", "Hund"], meaning: { pt: "ele tem um cachorro", en: "he has a dog" } },
  { chunks: ["gut", "sprichst", "du", "Deutsch"], answer: ["du", "sprichst", "gut", "Deutsch"], meaning: { pt: "você fala bem alemão", en: "you speak German well" } },
  { chunks: ["wohnen", "in", "wir", "Berlin"], answer: ["wir", "wohnen", "in", "Berlin"], meaning: { pt: "nós moramos em Berlim", en: "we live in Berlin" } },
  { chunks: ["isst", "sie", "gern", "Pizza"], answer: ["sie", "isst", "gern", "Pizza"], meaning: { pt: "ela come pizza com gosto", en: "she likes eating pizza" } },
  { chunks: ["viel", "arbeitet", "er"], answer: ["er", "arbeitet", "viel"], meaning: { pt: "ele trabalha muito", en: "he works a lot" } },
];
