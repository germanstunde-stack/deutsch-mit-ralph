// Schwiizerdütsch — a língua FALADA.
//
// A Suíça alemã é diglóssica: escreve-se Hochdeutsch, fala-se dialeto. São
// funções separadas, não formal × informal. O app ensina e cobra a forma
// escrita; o dialeto entra aqui como camada de RECONHECIMENTO, porque:
//
// 1. Não existe ortografia oficial. Cada um escreve como acha que soa, e a
//    forma varia por cantão (Grüezi em ZH, Grüessech em BE, Salü em BS).
//    Cobrar isso digitado seria inventar um gabarito. Por isso os exercícios de
//    Mundart são só de múltipla escolha — e como `Question` nem tem campo de
//    resposta escrita, a regra vale por construção, não por disciplina.
// 2. Não existe voz TTS de dialeto em navegador nenhum. O campo `say` é uma
//    regrafia pensada pra uma voz alemã produzir algo próximo do som suíço —
//    aproximação, não transcrição fonética.
//
// As formas abaixo são as da região de Zurique salvo indicação em `regiao`,
// porque é o maior cantão e o que o aluno mais ouve em mídia e transporte.

export interface MundartEntry {
  /** forma em Schweizer Hochdeutsch — a chave, e o que o aluno escreve */
  hoch: string;
  /** grafia dialetal, ilustrativa (não há uma oficial) */
  mundart: string;
  /** regrafia pra voz alemã chegar perto do som; cai pra `mundart` se faltar */
  say?: string;
  /** nota curta em português */
  hint?: string;
  /** quando a forma muda de cantão pra cantão */
  regiao?: string;
}

export const mundartEntries: MundartEntry[] = [
  { hoch: "Guten Tag", mundart: "Grüezi", say: "Grüetsi", hint: "o cumprimento padrão, a qualquer hora do dia", regiao: "Zurique e boa parte do país; em Berna: Grüessech" },
  { hoch: "Hallo", mundart: "Hoi", say: "Hoi", hint: "informal, entre conhecidos" },
  { hoch: "Guten Morgen", mundart: "Guete Morge", say: "Guete Morge" },
  { hoch: "Guten Abend", mundart: "Guete Abig", say: "Guete Abig" },
  { hoch: "Auf Wiedersehen", mundart: "Uf Wiederluege", say: "Uf Widerluege", hint: "o “até logo” formal ao sair" },
  { hoch: "Tschüss", mundart: "Tschüss / Ciao", say: "Tschüss", hint: "Ciao vem do italiano e é usadíssimo" },
  { hoch: "Danke", mundart: "Merci", say: "Mersi", hint: "do francês — “Merci vilmal” é “muito obrigado”" },
  { hoch: "Bitte", mundart: "Bitte / Gärn gschee", say: "Gärn gschee", hint: "“Gärn gschee” = de nada" },
  { hoch: "Entschuldigung", mundart: "Exgüsi", say: "Exküsi", hint: "do francês “excusez”" },
  { hoch: "Wie geht's?", mundart: "Wie gaht's?", say: "Wie gats", hint: "responde-se “Guet, merci”" },
  { hoch: "Ja", mundart: "Jo", say: "Jo" },
  { hoch: "Nein", mundart: "Nei", say: "Nei" },
  { hoch: "ein bisschen", mundart: "es bitzeli", say: "es bitseli", hint: "“um pouquinho” — você vai ouvir muito" },
  { hoch: "das Kind", mundart: "s Chind", say: "s Chind", hint: "o k do alemão vira um som raspado de garganta: Kind → Chind" },
  { hoch: "die Küche", mundart: "d Chuchi", say: "d Chuchi", hint: "mesma troca: Küche → Chuchi" },
  { hoch: "klein", mundart: "chlii", say: "chlii" },
  { hoch: "das Haus", mundart: "s Huus", say: "s Huus", hint: "o ditongo au vira uu" },
  { hoch: "die Kartoffel", mundart: "s Härdöpfel", say: "s Härdöpfel", hint: "literalmente “maçã da terra”, como o francês pomme de terre" },
  { hoch: "das Velo", mundart: "s Velo", say: "s Felo", hint: "o artigo das encolhe pra “s”" },
  { hoch: "ich bin", mundart: "i bi", say: "i bi", hint: "os pronomes encurtam: ich → i, du → du, wir → mir" },
];

// Índice pela forma escrita. Chave própria (minúscula, sem artigo) em vez do
// norm() de exercises.ts: importar de lá criaria ciclo, e aqui basta isto.
function chave(s: string): string {
  return s.toLowerCase().trim().replace(/^(der|die|das)\s+/, "").replace(/\s+/g, " ");
}

const INDEX = new Map(mundartEntries.map((e) => [chave(e.hoch), e]));

export function mundartFor(standard?: string): MundartEntry | undefined {
  return standard ? INDEX.get(chave(standard)) : undefined;
}

/** usado pelo validador: confirma que nenhuma chave colide */
export function mundartIndexSize(): number {
  return INDEX.size;
}
