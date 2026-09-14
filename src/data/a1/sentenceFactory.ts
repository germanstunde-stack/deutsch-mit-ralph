// Fábrica de frases para o "montar frase" dos capítulos 2 a 11.
//
// No capítulo 1 dava pra combinar {sujeito} × {adjetivo} porque só a cópula
// variava (ser/estar). Nos outros capítulos o verbo também conjuga em
// português ("eu venho" / "ele vem" / "nós moramos"), e conjugar PT
// automaticamente sairia errado. Então a unidade combinável aqui é outra:
//
//   frame (começo pronto e já traduzido)  ×  complementos compatíveis
//   ["ich","komme"] "eu venho"            ×  ["aus","Brasilien"] "do Brasil"
//
// O começo é escrito à mão uma vez por (verbo + pessoa); os complementos são
// listas compartilhadas entre frames que aceitam o mesmo tipo. Assim 10 frames
// × 5 complementos viram 50 frases corretas com pouco texto escrito à mão.
import type { OrderSentence } from "./vocab";

export interface Complement { de: string[]; pt: string; en: string }
export interface Frame {
  de: string[];   // chunks do começo, verbo já na 2ª posição
  pt: string;     // começo traduzido ("eu venho")
  en: string;
  comps: Complement[];
  tail?: string[]; // chunks que fecham a frase (particípio, infinitivo, prefixo separável)
  ptTail?: string; // parte final da tradução, quando o alemão joga algo pro fim
  enTail?: string;
}

export function buildFrames(frames: Frame[]): OrderSentence[] {
  const out: OrderSentence[] = [];
  frames.forEach((f) => {
    f.comps.forEach((c) => {
      out.push({
        answer: [...f.de, ...c.de, ...(f.tail ?? [])],
        meaning: {
          pt: [f.pt, c.pt, f.ptTail].filter(Boolean).join(" "),
          en: [f.en, c.en, f.enTail].filter(Boolean).join(" "),
        },
      });
    });
  });
  return out;
}

// Junta as frases escritas à mão com as geradas, sem repetir. Algumas
// combinações da fábrica batem com uma frase que já existia à mão, e uma frase
// duplicada no pool sai sorteada com o dobro de chance das outras.
export function mergeSentences(...pools: OrderSentence[][]): OrderSentence[] {
  const seen = new Set<string>();
  const out: OrderSentence[] = [];
  pools.flat().forEach((s) => {
    const k = s.answer.join(" ").toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(s);
  });
  return out;
}

/* ---------------- complementos compartilhados ---------------- */

const ORIGENS: Complement[] = [
  { de: ["aus", "Brasilien"], pt: "do Brasil", en: "from Brazil" },
  { de: ["aus", "Deutschland"], pt: "da Alemanha", en: "from Germany" },
  { de: ["aus", "Portugal"], pt: "de Portugal", en: "from Portugal" },
  { de: ["aus", "Japan"], pt: "do Japão", en: "from Japan" },
];

// lugar PARADO (wohnen, sein) — "in" + dativo
const LUGARES: Complement[] = [
  { de: ["in", "Berlin"], pt: "em Berlim", en: "in Berlin" },
  { de: ["in", "Hamburg"], pt: "em Hamburgo", en: "in Hamburg" },
  { de: ["in", "München"], pt: "em Munique", en: "in Munich" },
  { de: ["in", "Wien"], pt: "em Viena", en: "in Vienna" },
];

// lugar como DESTINO (fahren, gehen) — cidade pede "nach", não "in".
// "ich bin in Berlin gefahren" seria "dirigi dentro de Berlim", não "fui pra Berlim".
const RUMO_CIDADE: Complement[] = [
  { de: ["nach", "Berlin"], pt: "pra Berlim", en: "to Berlin" },
  { de: ["nach", "Hamburg"], pt: "pra Hamburgo", en: "to Hamburg" },
  { de: ["nach", "München"], pt: "pra Munique", en: "to Munich" },
  { de: ["nach", "Wien"], pt: "pra Viena", en: "to Vienna" },
];

const OBJETOS: Complement[] = [
  { de: ["einen", "Hund"], pt: "um cachorro", en: "a dog" },
  { de: ["eine", "Katze"], pt: "um gato", en: "a cat" },
  { de: ["ein", "Auto"], pt: "um carro", en: "a car" },
  { de: ["einen", "Bruder"], pt: "um irmão", en: "a brother" },
  { de: ["eine", "Schwester"], pt: "uma irmã", en: "a sister" },
];

const COMIDAS: Complement[] = [
  { de: ["Pizza"], pt: "pizza", en: "pizza" },
  { de: ["Brot"], pt: "pão", en: "bread" },
  { de: ["Käse"], pt: "queijo", en: "cheese" },
  { de: ["Suppe"], pt: "sopa", en: "soup" },
];

const BEBIDAS: Complement[] = [
  { de: ["Kaffee"], pt: "café", en: "coffee" },
  { de: ["Wasser"], pt: "água", en: "water" },
  { de: ["Tee"], pt: "chá", en: "tea" },
  { de: ["Milch"], pt: "leite", en: "milk" },
];

const IDIOMAS: Complement[] = [
  { de: ["Deutsch"], pt: "alemão", en: "German" },
  { de: ["Portugiesisch"], pt: "português", en: "Portuguese" },
  { de: ["Englisch"], pt: "inglês", en: "English" },
  { de: ["Spanisch"], pt: "espanhol", en: "Spanish" },
];

const QUANTO: Complement[] = [
  { de: ["viel"], pt: "muito", en: "a lot" },
  { de: ["wenig"], pt: "pouco", en: "little" },
  { de: ["gern"], pt: "com gosto", en: "gladly" },
  { de: ["immer"], pt: "sempre", en: "always" },
];

const HORARIOS: Complement[] = [
  { de: ["um", "sieben", "Uhr"], pt: "às sete horas", en: "at seven" },
  { de: ["um", "acht", "Uhr"], pt: "às oito horas", en: "at eight" },
  { de: ["am", "Montag"], pt: "na segunda", en: "on Monday" },
  { de: ["am", "Wochenende"], pt: "no fim de semana", en: "on the weekend" },
];

/* ---------------- cap. 2: verbos regulares, haben, mudança de vogal --------- */

export const verbFrames: Frame[] = [
  { de: ["ich", "komme"], pt: "eu venho", en: "I come", comps: ORIGENS },
  { de: ["du", "kommst"], pt: "você vem", en: "you come", comps: ORIGENS },
  { de: ["er", "kommt"], pt: "ele vem", en: "he comes", comps: ORIGENS },
  { de: ["ich", "wohne"], pt: "eu moro", en: "I live", comps: LUGARES },
  { de: ["wir", "wohnen"], pt: "nós moramos", en: "we live", comps: LUGARES },
  { de: ["sie", "wohnt"], pt: "ela mora", en: "she lives", comps: LUGARES },
  { de: ["ich", "habe"], pt: "eu tenho", en: "I have", comps: OBJETOS },
  { de: ["du", "hast"], pt: "você tem", en: "you have", comps: OBJETOS },
  { de: ["er", "hat"], pt: "ele tem", en: "he has", comps: OBJETOS },
  { de: ["ich", "esse"], pt: "eu como", en: "I eat", comps: COMIDAS },
  { de: ["sie", "isst"], pt: "ela come", en: "she eats", comps: COMIDAS },
  { de: ["wir", "essen"], pt: "nós comemos", en: "we eat", comps: COMIDAS },
  { de: ["ich", "spreche"], pt: "eu falo", en: "I speak", comps: IDIOMAS },
  { de: ["du", "sprichst"], pt: "você fala", en: "you speak", comps: IDIOMAS },
  { de: ["er", "arbeitet"], pt: "ele trabalha", en: "he works", comps: QUANTO },
  { de: ["ich", "arbeite"], pt: "eu trabalho", en: "I work", comps: QUANTO },
];

/* ---------------- cap. 3: verbos separáveis (prefixo no fim) --------------- */

const CEDO_TARDE: Complement[] = [
  { de: ["früh"], pt: "cedo", en: "early" },
  { de: ["spät"], pt: "tarde", en: "late" },
  { de: ["um", "sieben", "Uhr"], pt: "às sete horas", en: "at seven" },
  { de: ["am", "Montag"], pt: "na segunda", en: "on Monday" },
];

const COMPRAS: Complement[] = [
  { de: ["Brot"], pt: "pão", en: "bread" },
  { de: ["Milch"], pt: "leite", en: "milk" },
  { de: ["Käse"], pt: "queijo", en: "cheese" },
  { de: ["Obst"], pt: "fruta", en: "fruit" },
];

const PESSOAS: Complement[] = [
  { de: ["meine", "Mutter"], pt: "minha mãe", en: "my mother" },
  { de: ["meinen", "Bruder"], pt: "meu irmão", en: "my brother" },
  { de: ["meine", "Schwester"], pt: "minha irmã", en: "my sister" },
  { de: ["meinen", "Vater"], pt: "meu pai", en: "my father" },
];

export const separableFrames: Frame[] = [
  { de: ["ich", "stehe"], pt: "eu levanto", en: "I get up", comps: CEDO_TARDE, tail: ["auf"] },
  { de: ["du", "stehst"], pt: "você levanta", en: "you get up", comps: CEDO_TARDE, tail: ["auf"] },
  { de: ["er", "steht"], pt: "ele levanta", en: "he gets up", comps: CEDO_TARDE, tail: ["auf"] },
  { de: ["ich", "kaufe"], pt: "eu compro", en: "I buy", comps: COMPRAS, tail: ["ein"] },
  { de: ["wir", "kaufen"], pt: "nós compramos", en: "we buy", comps: COMPRAS, tail: ["ein"] },
  { de: ["ich", "rufe"], pt: "eu ligo pra", en: "I call", comps: PESSOAS, tail: ["an"] },
  { de: ["er", "ruft"], pt: "ele liga pra", en: "he calls", comps: PESSOAS, tail: ["an"] },
  { de: ["wir", "sehen"], pt: "nós assistimos TV", en: "we watch TV", comps: CEDO_TARDE, tail: ["fern"] },
];

/* ---------------- cap. 4: Perfekt (particípio no fim) --------------------- */

export const perfektFrames: Frame[] = [
  { de: ["ich", "habe"], pt: "eu aprendi", en: "I learned", comps: IDIOMAS, tail: ["gelernt"] },
  { de: ["du", "hast"], pt: "você aprendeu", en: "you learned", comps: IDIOMAS, tail: ["gelernt"] },
  { de: ["wir", "haben"], pt: "nós comemos", en: "we ate", comps: COMIDAS, tail: ["gegessen"] },
  { de: ["er", "hat"], pt: "ele comeu", en: "he ate", comps: COMIDAS, tail: ["gegessen"] },
  { de: ["ich", "habe"], pt: "eu bebi", en: "I drank", comps: BEBIDAS, tail: ["getrunken"] },
  { de: ["sie", "hat"], pt: "ela bebeu", en: "she drank", comps: BEBIDAS, tail: ["getrunken"] },
  { de: ["ich", "habe"], pt: "eu comprei", en: "I bought", comps: OBJETOS, tail: ["gekauft"] },
  { de: ["ich", "bin"], pt: "eu fui", en: "I went", comps: RUMO_CIDADE, tail: ["gefahren"] },
  { de: ["du", "bist"], pt: "você foi", en: "you went", comps: RUMO_CIDADE, tail: ["gefahren"] },
  { de: ["er", "ist"], pt: "ele veio", en: "he came", comps: ORIGENS, tail: ["gekommen"] },
];

/* ---------------- cap. 5: modais (infinitivo no fim) ---------------------- */

export const modalFrames: Frame[] = [
  { de: ["ich", "kann"], pt: "eu sei falar", en: "I can speak", comps: IDIOMAS, tail: ["sprechen"] },
  { de: ["du", "kannst"], pt: "você sabe falar", en: "you can speak", comps: IDIOMAS, tail: ["sprechen"] },
  { de: ["ich", "möchte"], pt: "eu gostaria de beber", en: "I would like to drink", comps: BEBIDAS, tail: ["trinken"] },
  { de: ["er", "möchte"], pt: "ele gostaria de comer", en: "he would like to eat", comps: COMIDAS, tail: ["essen"] },
  { de: ["ich", "muss"], pt: "eu preciso trabalhar", en: "I have to work", comps: QUANTO, tail: ["arbeiten"] },
  { de: ["wir", "müssen"], pt: "nós precisamos levantar", en: "we have to get up", comps: CEDO_TARDE, tail: ["aufstehen"] },
  { de: ["du", "willst"], pt: "você quer morar", en: "you want to live", comps: LUGARES, tail: ["wohnen"] },
  { de: ["ich", "will"], pt: "eu quero comprar", en: "I want to buy", comps: OBJETOS, tail: ["kaufen"] },
  { de: ["du", "sollst"], pt: "você deve comprar", en: "you should buy", comps: COMPRAS, tail: ["einkaufen"] },
];

/* ---------------- cap. 6: gênero & plural -------------------------------- */

const PLURAIS_COISAS: Complement[] = [
  { de: ["zwei", "Bücher"], pt: "dois livros", en: "two books" },
  { de: ["vier", "Äpfel"], pt: "quatro maçãs", en: "four apples" },
  { de: ["zwei", "Autos"], pt: "dois carros", en: "two cars" },
  { de: ["fünf", "Eier"], pt: "cinco ovos", en: "five eggs" },
];

// "ter" aceita gente, "comprar" não — "ich kaufe zwei Söhne" seria "eu compro
// dois filhos". Por isso o pool de comprar fica só nas coisas.
const PLURAIS: Complement[] = [
  ...PLURAIS_COISAS,
  { de: ["drei", "Kinder"], pt: "três filhos", en: "three children" },
  { de: ["zwei", "Söhne"], pt: "dois filhos", en: "two sons" },
  { de: ["zwei", "Schwestern"], pt: "duas irmãs", en: "two sisters" },
];

export const pluralFrames: Frame[] = [
  { de: ["ich", "habe"], pt: "eu tenho", en: "I have", comps: PLURAIS },
  { de: ["du", "hast"], pt: "você tem", en: "you have", comps: PLURAIS },
  { de: ["er", "hat"], pt: "ele tem", en: "he has", comps: PLURAIS },
  { de: ["sie", "hat"], pt: "ela tem", en: "she has", comps: PLURAIS },
  { de: ["wir", "haben"], pt: "nós temos", en: "we have", comps: PLURAIS },
  { de: ["ich", "kaufe"], pt: "eu compro", en: "I buy", comps: PLURAIS_COISAS },
  { de: ["wir", "kaufen"], pt: "nós compramos", en: "we buy", comps: PLURAIS_COISAS },
];

/* ---------------- cap. 7: Nominativ, Akkusativ, Dativ -------------------- */

// "pegar" e "ter" só combinam com coisa ("wir haben die Frau" = "nós temos a
// mulher"); "ver" e "conhecer" aceitam os dois. O caso (den/die/das) é o que o
// capítulo cobra, e ele aparece igual nas duas listas.
const AKK_COISAS: Complement[] = [
  { de: ["den", "Hund"], pt: "o cachorro", en: "the dog" },
  { de: ["die", "Tasche"], pt: "a bolsa", en: "the bag" },
  { de: ["das", "Buch"], pt: "o livro", en: "the book" },
  { de: ["den", "Apfel"], pt: "a maçã", en: "the apple" },
];

const AKK_PESSOAS: Complement[] = [
  { de: ["den", "Mann"], pt: "o homem", en: "the man" },
  { de: ["die", "Frau"], pt: "a mulher", en: "the woman" },
  { de: ["das", "Kind"], pt: "a criança", en: "the child" },
  { de: ["den", "Lehrer"], pt: "o professor", en: "the teacher" },
];

const AKKUSATIVOS: Complement[] = [...AKK_COISAS, ...AKK_PESSOAS];

// "ajudar" rege objeto direto em português e "pertencer" rege "a" — e "a" + "o"
// contrai em "ao". Como a fábrica só concatena, a contração tem que vir pronta
// no complemento; daí as duas listas com o mesmo alemão.
const DATIVOS: Complement[] = [
  { de: ["dem", "Mann"], pt: "o homem", en: "the man" },
  { de: ["der", "Frau"], pt: "a mulher", en: "the woman" },
  { de: ["dem", "Kind"], pt: "a criança", en: "the child" },
  { de: ["dem", "Bruder"], pt: "o irmão", en: "the brother" },
];

const DATIVOS_A: Complement[] = [
  { de: ["dem", "Mann"], pt: "ao homem", en: "the man" },
  { de: ["der", "Frau"], pt: "à mulher", en: "the woman" },
  { de: ["dem", "Kind"], pt: "à criança", en: "the child" },
  { de: ["dem", "Bruder"], pt: "ao irmão", en: "the brother" },
];

export const caseFrames: Frame[] = [
  { de: ["ich", "nehme"], pt: "eu pego", en: "I take", comps: AKK_COISAS },
  { de: ["er", "nimmt"], pt: "ele pega", en: "he takes", comps: AKK_COISAS },
  { de: ["wir", "haben"], pt: "nós temos", en: "we have", comps: AKK_COISAS },
  { de: ["ich", "sehe"], pt: "eu vejo", en: "I see", comps: AKKUSATIVOS },
  { de: ["du", "siehst"], pt: "você vê", en: "you see", comps: AKKUSATIVOS },
  { de: ["ich", "kenne"], pt: "eu conheço", en: "I know", comps: AKK_PESSOAS },
  { de: ["ich", "helfe"], pt: "eu ajudo", en: "I help", comps: DATIVOS },
  { de: ["du", "hilfst"], pt: "você ajuda", en: "you help", comps: DATIVOS },
  { de: ["das", "Buch", "gehört"], pt: "o livro pertence", en: "the book belongs to", comps: DATIVOS_A },
  { de: ["das", "Auto", "gehört"], pt: "o carro pertence", en: "the car belongs to", comps: DATIVOS_A },
  { de: ["die", "Tasche", "gehört"], pt: "a bolsa pertence", en: "the bag belongs to", comps: DATIVOS_A },
];

/* ---------------- cap. 8: pronomes no Akkusativ/Dativ -------------------- */

// Objeto e sujeito não podem ser a mesma pessoa: "ich liebe uns" ("eu amo a
// gente") e "er liebt ihn" ("ele ama ele") saem errados ou ambíguos. Então cada
// frame só recebe os pronomes que sobram depois de tirar o próprio sujeito.
const PRON_AKK_EU: Complement[] = [ // sujeito ich / wir
  { de: ["dich"], pt: "você", en: "you" },
  { de: ["ihn"], pt: "ele", en: "him" },
  { de: ["sie"], pt: "ela", en: "her" },
  { de: ["euch"], pt: "vocês", en: "you all" },
];
// "mich"/"mir" ficam fora dos frames com o objeto depois do verbo: em português
// o pronome de 1ª pessoa vira clítico ANTES do verbo ("ele me ama", nunca "ele
// ama mim"), e a fábrica monta a tradução em ordem fixa. Eles entram só nos
// frames cujo português já traz preposição ("isso pertence a mim").
const PRON_AKK_ELE: Complement[] = [ // sujeito er / sie
  { de: ["dich"], pt: "você", en: "you" },
  { de: ["uns"], pt: "a gente", en: "us" },
  { de: ["euch"], pt: "vocês", en: "you all" },
];
const PRON_AKK_ELE_F: Complement[] = [ // sujeito er — "ela" não colide
  ...PRON_AKK_ELE,
  { de: ["sie"], pt: "ela", en: "her" },
];

const PRON_DAT_EU: Complement[] = [ // sujeito ich / wir
  { de: ["dir"], pt: "você", en: "you" },
  { de: ["ihm"], pt: "ele", en: "him" },
  { de: ["ihr"], pt: "ela", en: "her" },
  { de: ["euch"], pt: "vocês", en: "you all" },
];
const PRON_DAT_ELE: Complement[] = [ // sujeito er / sie
  { de: ["dir"], pt: "você", en: "you" },
  { de: ["uns"], pt: "a gente", en: "us" },
  { de: ["euch"], pt: "vocês", en: "you all" },
];
// sujeito é "das" (coisa), então nenhum pronome colide
const PRON_DAT: Complement[] = [
  { de: ["mir"], pt: "mim", en: "me" },
  { de: ["dir"], pt: "você", en: "you" },
  { de: ["ihm"], pt: "ele", en: "him" },
  { de: ["ihr"], pt: "ela", en: "her" },
  { de: ["uns"], pt: "nós", en: "us" },
];

export const pronounFrames: Frame[] = [
  { de: ["ich", "liebe"], pt: "eu amo", en: "I love", comps: PRON_AKK_EU },
  { de: ["ich", "kenne"], pt: "eu conheço", en: "I know", comps: PRON_AKK_EU },
  { de: ["wir", "sehen"], pt: "nós vemos", en: "we see", comps: PRON_AKK_EU },
  { de: ["er", "liebt"], pt: "ele ama", en: "he loves", comps: PRON_AKK_ELE_F },
  { de: ["er", "kennt"], pt: "ele conhece", en: "he knows", comps: PRON_AKK_ELE_F },
  { de: ["sie", "sieht"], pt: "ela vê", en: "she sees", comps: PRON_AKK_ELE },
  { de: ["ich", "helfe"], pt: "eu ajudo", en: "I help", comps: PRON_DAT_EU },
  { de: ["wir", "danken"], pt: "nós agradecemos a", en: "we thank", comps: PRON_DAT_EU },
  { de: ["sie", "hilft"], pt: "ela ajuda", en: "she helps", comps: PRON_DAT_ELE },
  { de: ["er", "dankt"], pt: "ele agradece a", en: "he thanks", comps: PRON_DAT_ELE },
  { de: ["das", "gehört"], pt: "isso pertence a", en: "that belongs to", comps: PRON_DAT },
  { de: ["das", "gefällt"], pt: "isso agrada a", en: "that pleases", comps: PRON_DAT },
];

/* ---------------- cap. 9: artigos & possessivos --------------------------
   Aqui o "ist" fica no começo alemão, mas em português o verbo (ser/estar)
   anda junto do adjetivo — então o complemento carrega o verbo traduzido.
   Só adjetivos invariáveis em gênero, já que o sujeito muda de gênero. */

const SER_ESTAR_INV: Complement[] = [
  { de: ["intelligent"], pt: "é inteligente", en: "is intelligent" },
  { de: ["jung"], pt: "é jovem", en: "is young" },
  { de: ["nett"], pt: "é legal", en: "is nice" },
  { de: ["glücklich"], pt: "está feliz", en: "is happy" },
  { de: ["traurig"], pt: "está triste", en: "is sad" },
  { de: ["krank"], pt: "está doente", en: "is sick" },
];

export const articleFrames: Frame[] = [
  { de: ["mein", "Vater", "ist"], pt: "meu pai", en: "my father", comps: SER_ESTAR_INV },
  { de: ["meine", "Mutter", "ist"], pt: "minha mãe", en: "my mother", comps: SER_ESTAR_INV },
  { de: ["mein", "Bruder", "ist"], pt: "meu irmão", en: "my brother", comps: SER_ESTAR_INV },
  { de: ["meine", "Schwester", "ist"], pt: "minha irmã", en: "my sister", comps: SER_ESTAR_INV },
  { de: ["dein", "Vater", "ist"], pt: "seu pai", en: "your father", comps: SER_ESTAR_INV },
  { de: ["sein", "Bruder", "ist"], pt: "o irmão dele", en: "his brother", comps: SER_ESTAR_INV },
  { de: ["ihre", "Mutter", "ist"], pt: "a mãe dela", en: "her mother", comps: SER_ESTAR_INV },
  { de: ["unsere", "Schwester", "ist"], pt: "nossa irmã", en: "our sister", comps: SER_ESTAR_INV },
];

/* ---------------- cap. 10: preposições ----------------------------------- */

const TRANSPORTES: Complement[] = [
  { de: ["mit", "dem", "Bus"], pt: "de ônibus", en: "by bus" },
  { de: ["mit", "dem", "Auto"], pt: "de carro", en: "by car" },
  { de: ["mit", "dem", "Zug"], pt: "de trem", en: "by train" },
  { de: ["mit", "dem", "Fahrrad"], pt: "de bicicleta", en: "by bike" },
];

const DESTINOS: Complement[] = [
  { de: ["ins", "Kino"], pt: "ao cinema", en: "to the cinema" },
  { de: ["ins", "Restaurant"], pt: "ao restaurante", en: "to the restaurant" },
  { de: ["zum", "Arzt"], pt: "ao médico", en: "to the doctor" },
  { de: ["nach", "Hause"], pt: "pra casa", en: "home" },
];

const POSICOES: Complement[] = [
  { de: ["auf", "dem", "Tisch"], pt: "em cima da mesa", en: "on the table" },
  { de: ["im", "Haus"], pt: "na casa", en: "in the house" },
  { de: ["im", "Auto"], pt: "no carro", en: "in the car" },
];

export const prepFrames: Frame[] = [
  { de: ["ich", "fahre"], pt: "eu vou", en: "I go", comps: TRANSPORTES },
  { de: ["wir", "fahren"], pt: "nós vamos", en: "we go", comps: TRANSPORTES },
  { de: ["er", "fährt"], pt: "ele vai", en: "he goes", comps: TRANSPORTES },
  { de: ["ich", "gehe"], pt: "eu vou", en: "I go", comps: DESTINOS },
  { de: ["wir", "gehen"], pt: "nós vamos", en: "we go", comps: DESTINOS },
  { de: ["das", "Buch", "ist"], pt: "o livro está", en: "the book is", comps: POSICOES },
  { de: ["die", "Tasche", "ist"], pt: "a bolsa está", en: "the bag is", comps: POSICOES },
  { de: ["ich", "komme"], pt: "eu venho", en: "I come", comps: ORIGENS },
  { de: ["ich", "arbeite"], pt: "eu trabalho", en: "I work", comps: HORARIOS },
  { de: ["er", "kommt"], pt: "ele vem", en: "he comes", comps: HORARIOS },
];

/* ---------------- cap. 11: perguntas & ordem da frase -------------------- */

// Uma pergunta com W-Wort já PEDE um dado, então o complemento tem que
// preencher outra vaga. "wo wohnst du in Berlin" ("onde você mora em Berlim")
// se responde sozinha e não é frase de verdade. Regra usada aqui: wann pede
// tempo → complemento de lugar/meio; warum pede motivo → objeto; wie oft pede
// frequência → meio/destino; was pede o objeto → modo. Nas perguntas que não
// sobra vaga nenhuma, a variedade vem da PESSOA, não do complemento.
const SEM_COMPLEMENTO: Complement[] = [{ de: [], pt: "", en: "" }];

const MODO: Complement[] = [
  { de: ["gern"], pt: "com gosto", en: "gladly" },
  { de: ["oft"], pt: "com frequência", en: "often" },
  { de: ["immer"], pt: "sempre", en: "always" },
];

export const questionFrames: Frame[] = [
  { de: ["wann", "kommst", "du"], pt: "quando você vem", en: "when do you come", comps: DESTINOS },
  { de: ["wann", "kommt", "ihr"], pt: "quando vocês vêm", en: "when do you all come", comps: DESTINOS },
  { de: ["wann", "fährst", "du"], pt: "quando você vai", en: "when do you go", comps: TRANSPORTES },
  { de: ["warum", "lernst", "du"], pt: "por que você aprende", en: "why do you learn", comps: IDIOMAS },
  { de: ["warum", "lernt", "er"], pt: "por que ele aprende", en: "why does he learn", comps: IDIOMAS },
  { de: ["wie", "oft", "fährst", "du"], pt: "com que frequência você vai", en: "how often do you go", comps: TRANSPORTES },
  { de: ["wie", "oft", "geht", "ihr"], pt: "com que frequência vocês vão", en: "how often do you all go", comps: DESTINOS },
  { de: ["was", "isst", "du"], pt: "o que você come", en: "what do you eat", comps: MODO },
  { de: ["was", "trinkt", "ihr"], pt: "o que vocês bebem", en: "what do you all drink", comps: MODO },
  { de: ["wo", "wohnst", "du"], pt: "onde você mora", en: "where do you live", comps: SEM_COMPLEMENTO },
  { de: ["wo", "wohnt", "er"], pt: "onde ele mora", en: "where does he live", comps: SEM_COMPLEMENTO },
  { de: ["wo", "wohnt", "ihr"], pt: "onde vocês moram", en: "where do you all live", comps: SEM_COMPLEMENTO },
  { de: ["woher", "kommst", "du"], pt: "de onde você vem", en: "where do you come from", comps: SEM_COMPLEMENTO },
  { de: ["woher", "kommt", "sie"], pt: "de onde ela vem", en: "where does she come from", comps: SEM_COMPLEMENTO },
  { de: ["wer", "ist", "das"], pt: "quem é esse", en: "who is that", comps: SEM_COMPLEMENTO },
  { de: ["was", "machst", "du"], pt: "o que você faz", en: "what do you do", comps: SEM_COMPLEMENTO },
  { de: ["was", "macht", "ihr"], pt: "o que vocês fazem", en: "what do you all do", comps: SEM_COMPLEMENTO },
  { de: ["wie", "alt", "bist", "du"], pt: "quantos anos você tem", en: "how old are you", comps: SEM_COMPLEMENTO },
  { de: ["wie", "geht", "es", "dir"], pt: "como você está", en: "how are you", comps: SEM_COMPLEMENTO },
  { de: ["wie", "viel", "kostet", "das"], pt: "quanto custa isso", en: "how much does that cost", comps: SEM_COMPLEMENTO },
];
