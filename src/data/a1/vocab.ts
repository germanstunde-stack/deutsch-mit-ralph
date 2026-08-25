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

// ---- Capítulo 3: imperativo & verbos separáveis ----
// du/ihr/sie SEM "!" (pra exercício de escrever não exigir pontuação) — quem
// exibe a frase de verdade (cards, explicação, frases) acrescenta o "!" na hora.
export interface ImperativeVerb { inf: string; meaning: Record<Lang, string>; du: string; ihr: string; sie: string; }
export const imperativeVerbs: ImperativeVerb[] = [
  { inf: "kommen", meaning: { pt: "vir", en: "to come" }, du: "Komm", ihr: "Kommt", sie: "Kommen Sie" },
  { inf: "gehen", meaning: { pt: "ir", en: "to go" }, du: "Geh", ihr: "Geht", sie: "Gehen Sie" },
  { inf: "warten", meaning: { pt: "esperar", en: "to wait" }, du: "Warte", ihr: "Wartet", sie: "Warten Sie" },
  { inf: "essen", meaning: { pt: "comer", en: "to eat" }, du: "Iss", ihr: "Esst", sie: "Essen Sie" },
  { inf: "sprechen", meaning: { pt: "falar", en: "to speak" }, du: "Sprich", ihr: "Sprecht", sie: "Sprechen Sie" },
  { inf: "fahren", meaning: { pt: "dirigir / ir", en: "to drive / go" }, du: "Fahr", ihr: "Fahrt", sie: "Fahren Sie" },
];

export interface Verb6 { inf: string; prefix: string; meaning: Record<Lang, string>; forms: Record<"ich" | "du" | "er" | "wir" | "ihr" | "sie", string>; }
export const separableVerbs: Verb6[] = [
  { inf: "aufstehen", prefix: "auf", meaning: { pt: "levantar-se / acordar", en: "to get up" }, forms: { ich: "stehe auf", du: "stehst auf", er: "steht auf", wir: "stehen auf", ihr: "steht auf", sie: "stehen auf" } },
  { inf: "einkaufen", prefix: "ein", meaning: { pt: "fazer compras", en: "to go shopping" }, forms: { ich: "kaufe ein", du: "kaufst ein", er: "kauft ein", wir: "kaufen ein", ihr: "kauft ein", sie: "kaufen ein" } },
  { inf: "fernsehen", prefix: "fern", meaning: { pt: "assistir TV", en: "to watch TV" }, forms: { ich: "sehe fern", du: "siehst fern", er: "sieht fern", wir: "sehen fern", ihr: "seht fern", sie: "sehen fern" } },
  { inf: "anrufen", prefix: "an", meaning: { pt: "telefonar / ligar", en: "to call (phone)" }, forms: { ich: "rufe an", du: "rufst an", er: "ruft an", wir: "rufen an", ihr: "ruft an", sie: "rufen an" } },
];

export const separableSentences: OrderSentence[] = [
  { chunks: ["ein", "ich", "kaufe", "Brot"], answer: ["ich", "kaufe", "Brot", "ein"], meaning: { pt: "eu compro pão", en: "I buy bread" } },
  { chunks: ["an", "seine", "er", "ruft", "Mutter"], answer: ["er", "ruft", "seine", "Mutter", "an"], meaning: { pt: "ele liga pra mãe dele", en: "he calls his mother" } },
  { chunks: ["fern", "wir", "jeden Abend", "sehen"], answer: ["wir", "sehen", "jeden Abend", "fern"], meaning: { pt: "nós assistimos TV toda noite", en: "we watch TV every evening" } },
  { chunks: ["auf", "früh", "du", "stehst"], answer: ["du", "stehst", "früh", "auf"], meaning: { pt: "você acorda cedo", en: "you get up early" } },
];

// ---- Capítulo 4: Perfekt (passado composto) ----
export interface PerfektVerb { inf: string; partizip: string; auxiliary: "haben" | "sein"; meaning: Record<Lang, string>; }
export const perfektHabenRegular: PerfektVerb[] = [
  { inf: "lernen", partizip: "gelernt", auxiliary: "haben", meaning: { pt: "aprender", en: "to learn" } },
  { inf: "machen", partizip: "gemacht", auxiliary: "haben", meaning: { pt: "fazer", en: "to do / make" } },
  { inf: "spielen", partizip: "gespielt", auxiliary: "haben", meaning: { pt: "jogar / brincar", en: "to play" } },
  { inf: "kaufen", partizip: "gekauft", auxiliary: "haben", meaning: { pt: "comprar", en: "to buy" } },
];
export const perfektHabenIrregular: PerfektVerb[] = [
  { inf: "essen", partizip: "gegessen", auxiliary: "haben", meaning: { pt: "comer", en: "to eat" } },
  { inf: "trinken", partizip: "getrunken", auxiliary: "haben", meaning: { pt: "beber", en: "to drink" } },
  { inf: "finden", partizip: "gefunden", auxiliary: "haben", meaning: { pt: "achar / encontrar", en: "to find" } },
  { inf: "lesen", partizip: "gelesen", auxiliary: "haben", meaning: { pt: "ler", en: "to read" } },
  { inf: "sprechen", partizip: "gesprochen", auxiliary: "haben", meaning: { pt: "falar", en: "to speak" } },
];
export const perfektSein: PerfektVerb[] = [
  { inf: "gehen", partizip: "gegangen", auxiliary: "sein", meaning: { pt: "ir", en: "to go" } },
  { inf: "fahren", partizip: "gefahren", auxiliary: "sein", meaning: { pt: "viajar / dirigir", en: "to drive / go" } },
  { inf: "kommen", partizip: "gekommen", auxiliary: "sein", meaning: { pt: "vir", en: "to come" } },
  { inf: "fliegen", partizip: "geflogen", auxiliary: "sein", meaning: { pt: "voar", en: "to fly" } },
];

export const perfektSentences: OrderSentence[] = [
  { chunks: ["gelernt", "ich", "habe", "Deutsch"], answer: ["ich", "habe", "Deutsch", "gelernt"], meaning: { pt: "eu aprendi alemão", en: "I learned German" } },
  { chunks: ["gegessen", "wir", "haben", "Pizza"], answer: ["wir", "haben", "Pizza", "gegessen"], meaning: { pt: "nós comemos pizza", en: "we ate pizza" } },
  { chunks: ["ist", "er", "gegangen", "nach Hause"], answer: ["er", "ist", "nach Hause", "gegangen"], meaning: { pt: "ele foi pra casa", en: "he went home" } },
  { chunks: ["hat", "sie", "ein Buch", "gelesen"], answer: ["sie", "hat", "ein Buch", "gelesen"], meaning: { pt: "ela leu um livro", en: "she read a book" } },
  { chunks: ["bist", "du", "gefahren", "nach Berlin"], answer: ["du", "bist", "nach Berlin", "gefahren"], meaning: { pt: "você viajou pra Berlim", en: "you went to Berlin" } },
];
