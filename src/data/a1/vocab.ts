// Vocabulário/gramática do A1. Baseado na sequência oficial do Goethe-Zertifikat
// A1 (Start Deutsch 1), conforme "Grammatik leicht A1" (Hueber Verlag).
import type { Lang } from "../../i18n/types";
import { buildFrames, mergeSentences, verbFrames, separableFrames, perfektFrames, modalFrames, pluralFrames, caseFrames, pronounFrames, articleFrames, prepFrames, questionFrames } from "./sentenceFactory";

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
// `chunks` é opcional: quando não vem, o gOrder embaralha o próprio `answer`
// (é o que as frases geradas pela fábrica fazem — evita manter à mão uma cópia
// embaralhada que pode sair inconsistente com a resposta).
export interface OrderSentence { chunks?: string[]; answer: string[]; meaning: Record<Lang, string>; }

/* ---------- Fábrica de frases (cap. 1: sujeito + sein + adjetivo) ----------
   Em alemão o adjetivo predicativo depois de `sein` NÃO declina, então toda
   combinação é gramatical. O trabalho fino é a tradução: o português precisa
   escolher ser × estar e concordar em gênero/número. Por isso o sujeito carrega
   suas duas formas de cópula e o adjetivo diz de qual ele precisa. */
export type Agr = "ms" | "fs" | "mp" | "fp";

export interface FactorySubject {
  de: string; seinForm: string; agr: Agr; kind: "person" | "thing";
  ptSubj: string; ser: string; estar: string;
  enSubj: string; enBe: string;
}

export interface FactoryPredicate {
  de: string; en: string; link: "ser" | "estar";
  // string = invariável; tupla = [masc.sing, fem.sing, masc.pl, fem.pl]
  pt: string | [string, string, string, string];
  allow: ("person" | "thing")[];
}

// ich/du não têm gênero determinável em português — ficam no masculino. O
// feminino aparece via sujeitos nomeados (Anna) e via "sie" (ela).
export const seinSubjects: FactorySubject[] = [
  { de: "ich", seinForm: "bin", agr: "ms", kind: "person", ptSubj: "eu", ser: "sou", estar: "estou", enSubj: "I", enBe: "am" },
  { de: "du", seinForm: "bist", agr: "ms", kind: "person", ptSubj: "você", ser: "é", estar: "está", enSubj: "you", enBe: "are" },
  { de: "er", seinForm: "ist", agr: "ms", kind: "person", ptSubj: "ele", ser: "é", estar: "está", enSubj: "he", enBe: "is" },
  { de: "sie", seinForm: "ist", agr: "fs", kind: "person", ptSubj: "ela", ser: "é", estar: "está", enSubj: "she", enBe: "is" },
  { de: "wir", seinForm: "sind", agr: "mp", kind: "person", ptSubj: "nós", ser: "somos", estar: "estamos", enSubj: "we", enBe: "are" },
  { de: "ihr", seinForm: "seid", agr: "mp", kind: "person", ptSubj: "vocês", ser: "são", estar: "estão", enSubj: "you all", enBe: "are" },
  { de: "sie", seinForm: "sind", agr: "mp", kind: "person", ptSubj: "eles", ser: "são", estar: "estão", enSubj: "they", enBe: "are" },
  { de: "Anna", seinForm: "ist", agr: "fs", kind: "person", ptSubj: "a Anna", ser: "é", estar: "está", enSubj: "Anna", enBe: "is" },
  { de: "Max", seinForm: "ist", agr: "ms", kind: "person", ptSubj: "o Max", ser: "é", estar: "está", enSubj: "Max", enBe: "is" },
];

// Adjetivos ensinados neste capítulo (aparecem nos cards — ver cards.ts).
export const seinPredicates: FactoryPredicate[] = [
  { de: "müde", en: "tired", link: "estar", pt: ["cansado", "cansada", "cansados", "cansadas"], allow: ["person"] },
  { de: "glücklich", en: "happy", link: "estar", pt: ["feliz", "feliz", "felizes", "felizes"], allow: ["person"] },
  { de: "traurig", en: "sad", link: "estar", pt: ["triste", "triste", "tristes", "tristes"], allow: ["person"] },
  { de: "krank", en: "sick", link: "estar", pt: ["doente", "doente", "doentes", "doentes"], allow: ["person"] },
  { de: "hungrig", en: "hungry", link: "estar", pt: "com fome", allow: ["person"] },
  { de: "durstig", en: "thirsty", link: "estar", pt: "com sede", allow: ["person"] },
  { de: "fertig", en: "ready", link: "estar", pt: ["pronto", "pronta", "prontos", "prontas"], allow: ["person"] },
  { de: "zu Hause", en: "at home", link: "estar", pt: "em casa", allow: ["person"] },
  { de: "gross", en: "tall", link: "ser", pt: ["alto", "alta", "altos", "altas"], allow: ["person"] },
  { de: "klein", en: "short", link: "ser", pt: ["baixo", "baixa", "baixos", "baixas"], allow: ["person"] },
  { de: "jung", en: "young", link: "ser", pt: ["jovem", "jovem", "jovens", "jovens"], allow: ["person"] },
  { de: "alt", en: "old", link: "ser", pt: ["velho", "velha", "velhos", "velhas"], allow: ["person"] },
  { de: "nett", en: "nice", link: "ser", pt: ["legal", "legal", "legais", "legais"], allow: ["person"] },
  { de: "lustig", en: "funny", link: "ser", pt: ["engraçado", "engraçada", "engraçados", "engraçadas"], allow: ["person"] },
  { de: "intelligent", en: "intelligent", link: "ser", pt: ["inteligente", "inteligente", "inteligentes", "inteligentes"], allow: ["person"] },
];

const AGR_IDX: Record<Agr, number> = { ms: 0, fs: 1, mp: 2, fp: 3 };
export function ptForm(p: FactoryPredicate, agr: Agr): string {
  return typeof p.pt === "string" ? p.pt : p.pt[AGR_IDX[agr]];
}

function buildSeinSentences(): OrderSentence[] {
  const out: OrderSentence[] = [];
  seinSubjects.forEach((s) => {
    seinPredicates.forEach((p) => {
      if (!p.allow.includes(s.kind)) return;
      out.push({
        answer: [s.de, s.seinForm, p.de],
        meaning: {
          pt: `${s.ptSubj} ${s[p.link]} ${ptForm(p, s.agr)}`,
          en: `${s.enSubj} ${s.enBe} ${p.en}`,
        },
      });
    });
  });
  return out;
}

// escritas à mão (padrões que a fábrica não cobre) + as combinadas
const seinSentencesHand: OrderSentence[] = [
  { chunks: ["ist", "er", "aus", "Berlin"], answer: ["er", "ist", "aus", "Berlin"], meaning: { pt: "ele é de Berlim", en: "he is from Berlin" } },
  { chunks: ["bin", "ich", "glücklich"], answer: ["ich", "bin", "glücklich"], meaning: { pt: "eu estou feliz", en: "I am happy" } },
  { chunks: ["sind", "wir", "Freunde"], answer: ["wir", "sind", "Freunde"], meaning: { pt: "nós somos amigos", en: "we are friends" } },
  { chunks: ["bist", "du", "müde"], answer: ["du", "bist", "müde"], meaning: { pt: "você está cansado", en: "you are tired" } },
  { chunks: ["seid", "glücklich", "ihr"], answer: ["ihr", "seid", "glücklich"], meaning: { pt: "vocês estão felizes", en: "you all are happy" } },
  { chunks: ["ist", "das", "mein Bruder"], answer: ["das", "ist", "mein Bruder"], meaning: { pt: "este é meu irmão", en: "this is my brother" } },
];

export const seinSentences: OrderSentence[] = mergeSentences(seinSentencesHand, buildSeinSentences());

// ---- Capítulo 2: verbos regulares, haben, verbos com mudança de vogal ----
export interface Verb { inf: string; meaning: Record<Lang, string>; forms: Record<"ich" | "du" | "er" | "wir" | "ihr" | "sie", string>; }

export const regularVerbs: Verb[] = [
  { inf: "kommen", meaning: { pt: "vir", en: "to come" }, forms: { ich: "komme", du: "kommst", er: "kommt", wir: "kommen", ihr: "kommt", sie: "kommen" } },
  { inf: "machen", meaning: { pt: "fazer", en: "to do / make" }, forms: { ich: "mache", du: "machst", er: "macht", wir: "machen", ihr: "macht", sie: "machen" } },
  { inf: "wohnen", meaning: { pt: "morar", en: "to live (reside)" }, forms: { ich: "wohne", du: "wohnst", er: "wohnt", wir: "wohnen", ihr: "wohnt", sie: "wohnen" } },
  { inf: "lieben", meaning: { pt: "amar", en: "to love" }, forms: { ich: "liebe", du: "liebst", er: "liebt", wir: "lieben", ihr: "liebt", sie: "lieben" } },
  { inf: "arbeiten", meaning: { pt: "trabalhar", en: "to work" }, forms: { ich: "arbeite", du: "arbeitest", er: "arbeitet", wir: "arbeiten", ihr: "arbeitet", sie: "arbeiten" } },
  { inf: "heissen", meaning: { pt: "chamar-se", en: "to be called" }, forms: { ich: "heisse", du: "heisst", er: "heisst", wir: "heissen", ihr: "heisst", sie: "heissen" } },
  // estes três aparecem nas frases dos capítulos seguintes ("warum lernst du
  // Deutsch", "was trinkt ihr", "wie oft geht ihr ins Kino"), então precisam ser
  // ensinados aqui, onde a conjugação regular é explicada.
  { inf: "lernen", meaning: { pt: "aprender", en: "to learn" }, forms: { ich: "lerne", du: "lernst", er: "lernt", wir: "lernen", ihr: "lernt", sie: "lernen" } },
  { inf: "trinken", meaning: { pt: "beber", en: "to drink" }, forms: { ich: "trinke", du: "trinkst", er: "trinkt", wir: "trinken", ihr: "trinkt", sie: "trinken" } },
  { inf: "gehen", meaning: { pt: "ir / andar", en: "to go" }, forms: { ich: "gehe", du: "gehst", er: "geht", wir: "gehen", ihr: "geht", sie: "gehen" } },
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

const verbSentencesHand: OrderSentence[] = [
  { chunks: ["komme", "ich", "aus", "Brasilien"], answer: ["ich", "komme", "aus", "Brasilien"], meaning: { pt: "eu venho do Brasil", en: "I come from Brazil" } },
  { chunks: ["einen", "er", "hat", "Hund"], answer: ["er", "hat", "einen", "Hund"], meaning: { pt: "ele tem um cachorro", en: "he has a dog" } },
  { chunks: ["gut", "sprichst", "du", "Deutsch"], answer: ["du", "sprichst", "gut", "Deutsch"], meaning: { pt: "você fala bem alemão", en: "you speak German well" } },
  { chunks: ["wohnen", "in", "wir", "Berlin"], answer: ["wir", "wohnen", "in", "Berlin"], meaning: { pt: "nós moramos em Berlim", en: "we live in Berlin" } },
  { chunks: ["isst", "sie", "gern", "Pizza"], answer: ["sie", "isst", "gern", "Pizza"], meaning: { pt: "ela come pizza com gosto", en: "she likes eating pizza" } },
  { chunks: ["viel", "arbeitet", "er"], answer: ["er", "arbeitet", "viel"], meaning: { pt: "ele trabalha muito", en: "he works a lot" } },
];
export const verbSentences: OrderSentence[] = mergeSentences(verbSentencesHand, buildFrames(verbFrames));

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

const separableSentencesHand: OrderSentence[] = [
  { chunks: ["ein", "ich", "kaufe", "Brot"], answer: ["ich", "kaufe", "Brot", "ein"], meaning: { pt: "eu compro pão", en: "I buy bread" } },
  { chunks: ["an", "seine", "er", "ruft", "Mutter"], answer: ["er", "ruft", "seine", "Mutter", "an"], meaning: { pt: "ele liga pra mãe dele", en: "he calls his mother" } },
  { chunks: ["fern", "wir", "jeden Abend", "sehen"], answer: ["wir", "sehen", "jeden Abend", "fern"], meaning: { pt: "nós assistimos TV toda noite", en: "we watch TV every evening" } },
  { chunks: ["auf", "früh", "du", "stehst"], answer: ["du", "stehst", "früh", "auf"], meaning: { pt: "você acorda cedo", en: "you get up early" } },
];
export const separableSentences: OrderSentence[] = mergeSentences(separableSentencesHand, buildFrames(separableFrames));

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

// ---- Capítulo 6: gênero & plural dos substantivos ----
export interface NounPlural { de: string; art: "der" | "die" | "das"; plural: string; meaning: Record<Lang, string>; }
export const nounsPlural: NounPlural[] = [
  { de: "Tisch", art: "der", plural: "Tische", meaning: { pt: "mesa", en: "table" } },
  { de: "Apfel", art: "der", plural: "Äpfel", meaning: { pt: "maçã", en: "apple" } },
  { de: "Buch", art: "das", plural: "Bücher", meaning: { pt: "livro", en: "book" } },
  { de: "Ei", art: "das", plural: "Eier", meaning: { pt: "ovo", en: "egg" } },
  { de: "Frau", art: "die", plural: "Frauen", meaning: { pt: "mulher", en: "woman" } },
  { de: "Tür", art: "die", plural: "Türen", meaning: { pt: "porta", en: "door" } },
  { de: "Auto", art: "das", plural: "Autos", meaning: { pt: "carro", en: "car" } },
  { de: "Kind", art: "das", plural: "Kinder", meaning: { pt: "criança", en: "child" } },
  { de: "Sohn", art: "der", plural: "Söhne", meaning: { pt: "filho", en: "son" } },
  { de: "Mutter", art: "die", plural: "Mütter", meaning: { pt: "mãe", en: "mother" } },
];

const pluralSentencesHand: OrderSentence[] = [
  { chunks: ["zwei", "ich", "habe", "Bücher"], answer: ["ich", "habe", "zwei", "Bücher"], meaning: { pt: "eu tenho dois livros", en: "I have two books" } },
  { chunks: ["Äpfel", "sind", "die", "frisch"], answer: ["die", "Äpfel", "sind", "frisch"], meaning: { pt: "as maçãs estão frescas", en: "the apples are fresh" } },
  { chunks: ["drei", "hat", "sie", "Kinder"], answer: ["sie", "hat", "drei", "Kinder"], meaning: { pt: "ela tem três filhos", en: "she has three children" } },
  { chunks: ["Türen", "die", "sind", "offen"], answer: ["die", "Türen", "sind", "offen"], meaning: { pt: "as portas estão abertas", en: "the doors are open" } },
];
export const pluralSentences: OrderSentence[] = mergeSentences(pluralSentencesHand, buildFrames(pluralFrames));

// ---- Capítulo 7: Nominativ, Akkusativ & Dativ ----
export interface CaseNoun { de: string; meaning: Record<Lang, string>; nom: string; akk: string; dat: string; }
export const caseNouns: CaseNoun[] = [
  { de: "Mann", meaning: { pt: "homem", en: "man" }, nom: "der Mann", akk: "den Mann", dat: "dem Mann" },
  { de: "Frau", meaning: { pt: "mulher", en: "woman" }, nom: "die Frau", akk: "die Frau", dat: "der Frau" },
  { de: "Kind", meaning: { pt: "criança", en: "child" }, nom: "das Kind", akk: "das Kind", dat: "dem Kind" },
  { de: "Hund", meaning: { pt: "cachorro", en: "dog" }, nom: "der Hund", akk: "den Hund", dat: "dem Hund" },
  { de: "Tasche", meaning: { pt: "bolsa", en: "bag" }, nom: "die Tasche", akk: "die Tasche", dat: "der Tasche" },
  { de: "Buch", meaning: { pt: "livro", en: "book" }, nom: "das Buch", akk: "das Buch", dat: "dem Buch" },
  // estes quatro entraram junto com as frases novas da fábrica: as frases de
  // "montar frase" do capítulo usam eles, então têm que aparecer nos cards antes
  // de serem cobrados.
  { de: "Bruder", meaning: { pt: "irmão", en: "brother" }, nom: "der Bruder", akk: "den Bruder", dat: "dem Bruder" },
  { de: "Apfel", meaning: { pt: "maçã", en: "apple" }, nom: "der Apfel", akk: "den Apfel", dat: "dem Apfel" },
  { de: "Lehrer", meaning: { pt: "professor", en: "teacher" }, nom: "der Lehrer", akk: "den Lehrer", dat: "dem Lehrer" },
  { de: "Auto", meaning: { pt: "carro", en: "car" }, nom: "das Auto", akk: "das Auto", dat: "dem Auto" },
];

const caseSentencesHand: OrderSentence[] = [
  { chunks: ["einen", "ich", "habe", "Hund"], answer: ["ich", "habe", "einen", "Hund"], meaning: { pt: "eu tenho um cachorro", en: "I have a dog" } },
  { chunks: ["dem", "ich", "helfe", "Mann"], answer: ["ich", "helfe", "dem", "Mann"], meaning: { pt: "eu ajudo o homem", en: "I help the man" } },
  { chunks: ["der", "gehört", "Frau", "das Buch"], answer: ["das Buch", "gehört", "der", "Frau"], meaning: { pt: "o livro pertence à mulher", en: "the book belongs to the woman" } },
  { chunks: ["nehme", "ich", "die", "Tasche"], answer: ["ich", "nehme", "die", "Tasche"], meaning: { pt: "eu pego a bolsa", en: "I take the bag" } },
];
export const caseSentences: OrderSentence[] = mergeSentences(caseSentencesHand, buildFrames(caseFrames));

// ---- Capítulo 8: pronomes pessoais (Akk/Dativ) & indefinidos ----
export interface PersonalPronoun { nom: string; akk: string; dat: string; meaning: Record<Lang, string>; }
export const personalPronouns: PersonalPronoun[] = [
  { nom: "ich", akk: "mich", dat: "mir", meaning: { pt: "eu", en: "I" } },
  { nom: "du", akk: "dich", dat: "dir", meaning: { pt: "você", en: "you" } },
  { nom: "er", akk: "ihn", dat: "ihm", meaning: { pt: "ele", en: "he" } },
  { nom: "es", akk: "es", dat: "ihm", meaning: { pt: "isso", en: "it" } },
  { nom: "sie", akk: "sie", dat: "ihr", meaning: { pt: "ela", en: "she" } },
  { nom: "wir", akk: "uns", dat: "uns", meaning: { pt: "nós", en: "we" } },
  { nom: "ihr", akk: "euch", dat: "euch", meaning: { pt: "vocês", en: "you all" } },
  { nom: "sie", akk: "sie", dat: "ihnen", meaning: { pt: "eles / elas", en: "they" } },
  { nom: "Sie", akk: "Sie", dat: "Ihnen", meaning: { pt: "o(a) senhor(a) (formal)", en: "you (formal)" } },
];

export interface IndefPronoun { de: string; meaning: Record<Lang, string>; }
export const indefPronouns: IndefPronoun[] = [
  { de: "alles", meaning: { pt: "tudo", en: "everything" } },
  { de: "etwas", meaning: { pt: "algo", en: "something" } },
  { de: "nichts", meaning: { pt: "nada", en: "nothing" } },
  { de: "man", meaning: { pt: "a gente / se (impessoal)", en: "one / people (impersonal)" } },
];

const pronounSentencesHand: OrderSentence[] = [
  { chunks: ["dich", "ich", "liebe"], answer: ["ich", "liebe", "dich"], meaning: { pt: "eu te amo", en: "I love you" } },
  { chunks: ["gefällt", "mir", "das"], answer: ["das", "gefällt", "mir"], meaning: { pt: "eu gosto disso", en: "I like that" } },
  { chunks: ["ihm", "ich", "helfe"], answer: ["ich", "helfe", "ihm"], meaning: { pt: "eu ajudo ele", en: "I help him" } },
  { chunks: ["nichts", "weiss", "ich"], answer: ["ich", "weiss", "nichts"], meaning: { pt: "eu não sei nada", en: "I know nothing" } },
];
export const pronounSentences: OrderSentence[] = mergeSentences(pronounSentencesHand, buildFrames(pronounFrames));

// ---- Capítulo 9: artigos & possessivos ----
export interface PossessivePerson { pronoun: string; stem: string; meaning: Record<Lang, string>; }
export const possessives: PossessivePerson[] = [
  { pronoun: "ich", stem: "mein", meaning: { pt: "meu / minha", en: "my" } },
  { pronoun: "du", stem: "dein", meaning: { pt: "teu / tua (seu/sua informal)", en: "your (informal)" } },
  { pronoun: "er / es", stem: "sein", meaning: { pt: "dele", en: "his / its" } },
  { pronoun: "sie", stem: "ihr", meaning: { pt: "dela", en: "her" } },
  { pronoun: "wir", stem: "unser", meaning: { pt: "nosso / nossa", en: "our" } },
  { pronoun: "ihr", stem: "euer", meaning: { pt: "vosso / de vocês", en: "your (plural, informal)" } },
];

export interface PossessiveNoun { de: string; art: "der" | "die" | "das"; meaning: Record<Lang, string>; }
export const possessiveNouns: PossessiveNoun[] = [
  { de: "Vater", art: "der", meaning: { pt: "pai", en: "father" } },
  { de: "Mutter", art: "die", meaning: { pt: "mãe", en: "mother" } },
  { de: "Auto", art: "das", meaning: { pt: "carro", en: "car" } },
  { de: "Schwester", art: "die", meaning: { pt: "irmã", en: "sister" } },
  { de: "Bruder", art: "der", meaning: { pt: "irmão", en: "brother" } },
  { de: "Haus", art: "das", meaning: { pt: "casa", en: "house" } },
];

// Uso do artigo definido/indefinido/nulo/negativo (topics 27-29 do livro) —
// exemplos fixos, curados, em vez de gerados a partir de vocabulário solto.
export interface ArticleCase { promptHTML: Record<Lang, string>; speak: string; options: string[]; correct: string; word: string; }
export const articleCases: ArticleCase[] = [
  { promptHTML: { pt: 'Complete: <span class="big">Ich bin ___ Lehrer.</span> (profissão, sem artigo)', en: 'Complete: <span class="big">Ich bin ___ Lehrer.</span> (profession, no article)' }, speak: "Ich bin Lehrer", options: ["ein", "der", "—"], correct: "—", word: "Lehrer" },
  { promptHTML: { pt: 'Complete: <span class="big">Ich möchte ___ Kaffee, bitte.</span> (um café qualquer, 1ª menção)', en: 'Complete: <span class="big">Ich möchte ___ Kaffee, bitte.</span> (any coffee, first mention)' }, speak: "Ich möchte einen Kaffee", options: ["einen", "der", "kein"], correct: "einen", word: "Kaffee" },
  { promptHTML: { pt: 'Complete: <span class="big">___ Studentin kommt aus Nigeria.</span> (a estudante que já conhecemos)', en: 'Complete: <span class="big">___ Studentin kommt aus Nigeria.</span> (the student we already know)' }, speak: "Die Studentin kommt aus Nigeria", options: ["Die", "Eine", "—"], correct: "Die", word: "Studentin" },
  { promptHTML: { pt: 'Complete: <span class="big">Das ist ___ Baum.</span> (negando "ein Baum")', en: 'Complete: <span class="big">Das ist ___ Baum.</span> (negating "ein Baum")' }, speak: "Das ist kein Baum", options: ["kein", "nicht", "keine"], correct: "kein", word: "Baum" },
];

const articleSentencesHand: OrderSentence[] = [
  { chunks: ["Vater", "ist", "mein", "Lehrer"], answer: ["mein", "Vater", "ist", "Lehrer"], meaning: { pt: "meu pai é professor", en: "my father is a teacher" } },
  { chunks: ["Auto", "ist", "sein", "neu"], answer: ["sein", "Auto", "ist", "neu"], meaning: { pt: "o carro dele é novo", en: "his car is new" } },
  { chunks: ["Schwester", "ist", "unsere", "nett"], answer: ["unsere", "Schwester", "ist", "nett"], meaning: { pt: "nossa irmã é legal", en: "our sister is nice" } },
];
export const articleSentences: OrderSentence[] = mergeSentences(articleSentencesHand, buildFrames(articleFrames));

// ---- Capítulo 10: preposições (lugar, tempo, modo) ----
export interface Preposition { de: string; meaning: Record<Lang, string>; example: string; template: string; exampleMeaning: Record<Lang, string>; category: "lugar" | "tempo" | "modo"; }
export const prepositions: Preposition[] = [
  { de: "aus", meaning: { pt: "de (origem)", en: "from (origin)" }, example: "Ich komme aus Deutschland.", template: "Ich komme ___ Deutschland.", exampleMeaning: { pt: "eu venho da Alemanha", en: "I come from Germany" }, category: "lugar" },
  { de: "nach", meaning: { pt: "para (direção, sem artigo)", en: "to (direction, no article)" }, example: "Ich fahre nach Berlin.", template: "Ich fahre ___ Berlin.", exampleMeaning: { pt: "eu vou pra Berlim", en: "I'm going to Berlin" }, category: "lugar" },
  { de: "im", meaning: { pt: "em (lugar parado — in+dem)", en: "in (static place — in+dem)" }, example: "Ich wohne im Haus.", template: "Ich wohne ___ Haus.", exampleMeaning: { pt: "eu moro na casa", en: "I live in the house" }, category: "lugar" },
  { de: "ins", meaning: { pt: "pra dentro de (movimento — in+das)", en: "into (movement — in+das)" }, example: "Wir gehen ins Kino.", template: "Wir gehen ___ Kino.", exampleMeaning: { pt: "nós vamos ao cinema", en: "we're going to the cinema" }, category: "lugar" },
  { de: "auf", meaning: { pt: "em cima de", en: "on top of" }, example: "Das Buch ist auf dem Tisch.", template: "Das Buch ist ___ dem Tisch.", exampleMeaning: { pt: "o livro está em cima da mesa", en: "the book is on the table" }, category: "lugar" },
  { de: "beim", meaning: { pt: "na casa/consultório de (bei+dem)", en: "at (someone's place — bei+dem)" }, example: "Ich bin beim Arzt.", template: "Ich bin ___ Arzt.", exampleMeaning: { pt: "estou no médico", en: "I'm at the doctor's" }, category: "lugar" },
  { de: "zum", meaning: { pt: "para (zu+dem)", en: "to (zu+dem)" }, example: "Ich gehe zum Arzt.", template: "Ich gehe ___ Arzt.", exampleMeaning: { pt: "eu vou ao médico", en: "I'm going to the doctor" }, category: "lugar" },
  { de: "um", meaning: { pt: "às (hora exata)", en: "at (exact time)" }, example: "Ich komme um 20 Uhr.", template: "Ich komme ___ 20 Uhr.", exampleMeaning: { pt: "eu chego às 20h", en: "I arrive at 8pm" }, category: "tempo" },
  { de: "am", meaning: { pt: "em/na (dia)", en: "on (day/date)" }, example: "Am Montag arbeite ich.", template: "___ Montag arbeite ich.", exampleMeaning: { pt: "na segunda eu trabalho", en: "on Monday I work" }, category: "tempo" },
  { de: "im", meaning: { pt: "em (mês/estação)", en: "in (month/season)" }, example: "Im Mai ist es warm.", template: "___ Mai ist es warm.", exampleMeaning: { pt: "em maio está quente", en: "in May it's warm" }, category: "tempo" },
  { de: "vor", meaning: { pt: "antes de", en: "before" }, example: "Vor dem Spiel esse ich.", template: "___ dem Spiel esse ich.", exampleMeaning: { pt: "antes do jogo eu como", en: "before the game I eat" }, category: "tempo" },
  { de: "nach", meaning: { pt: "depois de", en: "after" }, example: "Nach dem Spiel schlafe ich.", template: "___ dem Spiel schlafe ich.", exampleMeaning: { pt: "depois do jogo eu durmo", en: "after the game I sleep" }, category: "tempo" },
  { de: "mit", meaning: { pt: "de (transporte) / com", en: "by (transport) / with" }, example: "Ich fahre mit dem Bus.", template: "Ich fahre ___ dem Bus.", exampleMeaning: { pt: "eu vou de ônibus", en: "I go by bus" }, category: "modo" },
];

const prepSentencesHand: OrderSentence[] = [
  { chunks: ["Deutschland", "ich", "komme", "aus"], answer: ["ich", "komme", "aus", "Deutschland"], meaning: { pt: "eu venho da Alemanha", en: "I come from Germany" } },
  { chunks: ["Bus", "ich", "fahre", "mit", "dem"], answer: ["ich", "fahre", "mit", "dem", "Bus"], meaning: { pt: "eu vou de ônibus", en: "I go by bus" } },
  { chunks: ["Montag", "arbeite", "am", "ich"], answer: ["ich", "arbeite", "am", "Montag"], meaning: { pt: "eu trabalho na segunda", en: "I work on Monday" } },
  { chunks: ["Tisch", "Buch", "ist", "das", "auf", "dem"], answer: ["das", "Buch", "ist", "auf", "dem", "Tisch"], meaning: { pt: "o livro está em cima da mesa", en: "the book is on the table" } },
];
export const prepSentences: OrderSentence[] = mergeSentences(prepSentencesHand, buildFrames(prepFrames));

// ---- Capítulo 11: perguntas & ordem da frase ----
export interface QuestionWord { de: string; meaning: Record<Lang, string>; example: string; exampleMeaning: Record<Lang, string>; }
export const questionWords: QuestionWord[] = [
  { de: "wer", meaning: { pt: "quem", en: "who" }, example: "Wer bist du?", exampleMeaning: { pt: "quem é você?", en: "who are you?" } },
  { de: "was", meaning: { pt: "o quê", en: "what" }, example: "Was machst du?", exampleMeaning: { pt: "o que você faz?", en: "what do you do?" } },
  { de: "wo", meaning: { pt: "onde", en: "where" }, example: "Wo wohnst du?", exampleMeaning: { pt: "onde você mora?", en: "where do you live?" } },
  { de: "wann", meaning: { pt: "quando", en: "when" }, example: "Wann kommst du?", exampleMeaning: { pt: "quando você vem?", en: "when are you coming?" } },
  { de: "warum", meaning: { pt: "por quê", en: "why" }, example: "Warum lernst du Deutsch?", exampleMeaning: { pt: "por que você aprende alemão?", en: "why are you learning German?" } },
  { de: "wie", meaning: { pt: "como", en: "how" }, example: "Wie heisst du?", exampleMeaning: { pt: "qual é o seu nome?", en: "what is your name?" } },
  { de: "woher", meaning: { pt: "de onde", en: "where from" }, example: "Woher kommst du?", exampleMeaning: { pt: "de onde você vem?", en: "where are you from?" } },
];

export interface TransformCase { promptHTML: Record<Lang, string>; speak: string; options: string[]; correct: string; word: string; }
export const yesNoCases: TransformCase[] = [
  { promptHTML: { pt: 'Qual é a pergunta sim/não de: <span class="big">Er kommt.</span>', en: 'What is the yes/no question for: <span class="big">Er kommt.</span>' }, speak: "Kommt er?", options: ["Kommt er?", "Er kommt?", "Wer kommt?"], correct: "Kommt er?", word: "Kommt er?" },
  { promptHTML: { pt: 'Qual é a pergunta sim/não de: <span class="big">Du sprichst Deutsch.</span>', en: 'What is the yes/no question for: <span class="big">Du sprichst Deutsch.</span>' }, speak: "Sprichst du Deutsch?", options: ["Sprichst du Deutsch?", "Du sprichst Deutsch?", "Was sprichst du?"], correct: "Sprichst du Deutsch?", word: "Sprichst du Deutsch?" },
  { promptHTML: { pt: 'Qual é a pergunta sim/não de: <span class="big">Sie ist müde.</span>', en: 'What is the yes/no question for: <span class="big">Sie ist müde.</span>' }, speak: "Ist sie müde?", options: ["Ist sie müde?", "Sie ist müde?", "Wie ist sie?"], correct: "Ist sie müde?", word: "Ist sie müde?" },
];

export const negationCases: TransformCase[] = [
  { promptHTML: { pt: 'Complete a negação: <span class="big">Ich komme ___.</span> (eu não venho)', en: 'Complete the negation: <span class="big">Ich komme ___.</span> (I am not coming)' }, speak: "Ich komme nicht.", options: ["nicht", "kein", "keine"], correct: "nicht", word: "nicht" },
  { promptHTML: { pt: 'Complete a negação: <span class="big">Er ist ___ hier.</span> (ele não está aqui)', en: 'Complete the negation: <span class="big">Er ist ___ hier.</span> (he is not here)' }, speak: "Er ist nicht hier.", options: ["nicht", "kein", "keine"], correct: "nicht", word: "nicht" },
  { promptHTML: { pt: 'Complete: <span class="big">Das ist ___ Auto.</span> (nega "ein Auto", não é UM carro)', en: 'Complete: <span class="big">Das ist ___ Auto.</span> (negates "ein Auto", not A car)' }, speak: "Das ist kein Auto.", options: ["kein", "nicht", "keine"], correct: "kein", word: "kein" },
];

export interface Connector { de: string; meaning: Record<Lang, string>; example: string; exampleMeaning: Record<Lang, string>; }
export const connectors: Connector[] = [
  { de: "und", meaning: { pt: "e", en: "and" }, example: "Ich lerne Deutsch und Englisch.", exampleMeaning: { pt: "eu aprendo alemão e inglês", en: "I learn German and English" } },
  { de: "oder", meaning: { pt: "ou", en: "or" }, example: "Möchtest du Kaffee oder Tee?", exampleMeaning: { pt: "você quer café ou chá?", en: "do you want coffee or tea?" } },
  { de: "aber", meaning: { pt: "mas", en: "but" }, example: "Ich bin müde, aber ich arbeite.", exampleMeaning: { pt: "eu estou cansado, mas eu trabalho", en: "I am tired, but I work" } },
  { de: "denn", meaning: { pt: "porque / pois", en: "because / for" }, example: "Ich bleibe zu Hause, denn ich bin krank.", exampleMeaning: { pt: "eu fico em casa, porque estou doente", en: "I stay home, because I am sick" } },
];

const questionSentencesHand: OrderSentence[] = [
  { chunks: ["heisst", "du", "wie"], answer: ["wie", "heisst", "du"], meaning: { pt: "como você se chama", en: "what is your name" } },
  { chunks: ["kommst", "du", "woher"], answer: ["woher", "kommst", "du"], meaning: { pt: "de onde você vem", en: "where do you come from" } },
  { chunks: ["kommt", "morgen", "er"], answer: ["morgen", "kommt", "er"], meaning: { pt: "amanhã ele vem", en: "tomorrow he is coming" } },
  { chunks: ["nicht", "ich", "komme"], answer: ["ich", "komme", "nicht"], meaning: { pt: "eu não venho", en: "I am not coming" } },
];
export const questionSentences: OrderSentence[] = mergeSentences(questionSentencesHand, buildFrames(questionFrames));

// ---- Capítulo 5: verbos modais ----
export const modalVerbs: Verb[] = [
  { inf: "können", meaning: { pt: "poder / conseguir", en: "can / to be able to" }, forms: { ich: "kann", du: "kannst", er: "kann", wir: "können", ihr: "könnt", sie: "können" } },
  { inf: "müssen", meaning: { pt: "precisar / ter que", en: "must / to have to" }, forms: { ich: "muss", du: "musst", er: "muss", wir: "müssen", ihr: "müsst", sie: "müssen" } },
  { inf: "wollen", meaning: { pt: "querer", en: "to want" }, forms: { ich: "will", du: "willst", er: "will", wir: "wollen", ihr: "wollt", sie: "wollen" } },
  { inf: "möchten", meaning: { pt: "gostaria de", en: "would like" }, forms: { ich: "möchte", du: "möchtest", er: "möchte", wir: "möchten", ihr: "möchtet", sie: "möchten" } },
  { inf: "dürfen", meaning: { pt: "poder (permissão)", en: "may / to be allowed to" }, forms: { ich: "darf", du: "darfst", er: "darf", wir: "dürfen", ihr: "dürft", sie: "dürfen" } },
  { inf: "sollen", meaning: { pt: "dever (conselho/ordem de outro)", en: "should / to be supposed to" }, forms: { ich: "soll", du: "sollst", er: "soll", wir: "sollen", ihr: "sollt", sie: "sollen" } },
];

const modalSentencesHand: OrderSentence[] = [
  { chunks: ["schwimmen", "kann", "ich", "gut"], answer: ["ich", "kann", "gut", "schwimmen"], meaning: { pt: "eu sei nadar bem", en: "I can swim well" } },
  { chunks: ["arbeiten", "muss", "er", "viel"], answer: ["er", "muss", "viel", "arbeiten"], meaning: { pt: "ele precisa trabalhar muito", en: "he has to work a lot" } },
  { chunks: ["Deutsch", "möchte", "lernen", "ich"], answer: ["ich", "möchte", "Deutsch", "lernen"], meaning: { pt: "eu gostaria de aprender alemão", en: "I would like to learn German" } },
  { chunks: ["hier", "du", "darfst", "parken"], answer: ["du", "darfst", "hier", "parken"], meaning: { pt: "você pode estacionar aqui", en: "you may park here" } },
  { chunks: ["früh", "sollen", "aufstehen", "wir"], answer: ["wir", "sollen", "früh", "aufstehen"], meaning: { pt: "nós devemos acordar cedo", en: "we should get up early" } },
];
export const modalSentences: OrderSentence[] = mergeSentences(modalSentencesHand, buildFrames(modalFrames));

const perfektSentencesHand: OrderSentence[] = [
  { chunks: ["gelernt", "ich", "habe", "Deutsch"], answer: ["ich", "habe", "Deutsch", "gelernt"], meaning: { pt: "eu aprendi alemão", en: "I learned German" } },
  { chunks: ["gegessen", "wir", "haben", "Pizza"], answer: ["wir", "haben", "Pizza", "gegessen"], meaning: { pt: "nós comemos pizza", en: "we ate pizza" } },
  { chunks: ["ist", "er", "gegangen", "nach Hause"], answer: ["er", "ist", "nach Hause", "gegangen"], meaning: { pt: "ele foi pra casa", en: "he went home" } },
  { chunks: ["hat", "sie", "ein Buch", "gelesen"], answer: ["sie", "hat", "ein Buch", "gelesen"], meaning: { pt: "ela leu um livro", en: "she read a book" } },
  { chunks: ["bist", "du", "gefahren", "nach Berlin"], answer: ["du", "bist", "nach Berlin", "gefahren"], meaning: { pt: "você viajou pra Berlim", en: "you went to Berlin" } },
];
export const perfektSentences: OrderSentence[] = mergeSentences(perfektSentencesHand, buildFrames(perfektFrames));
