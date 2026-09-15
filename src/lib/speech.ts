// Fala em alemão via Web Speech API, com controle de velocidade.
//
// O app ensina Schweizer Hochdeutsch, então a voz preferida é de-CH. Ela existe
// no Windows (com o pacote de idioma) e em alguns Android; no macOS/iOS não
// existe nenhuma. Por isso o fallback pra qualquer voz de-* importa — sem ele o
// navegador leria o alemão com a voz do locale da página, ou seja, em português.
//
// Mundart (dialeto) NÃO tem voz própria: não existe TTS `gsw` em navegador
// nenhum. Passar "gsw" como u.lang faria o navegador desistir e cair no locale
// da página. Então variant "gsw" significa "use a voz de-CH e receba a grafia
// fonética" — quem chama manda o respelling, não a grafia dialetal.
let chVoice: SpeechSynthesisVoice | null = null; // de-CH, preferida
let deVoice: SpeechSynthesisVoice | null = null; // qualquer de-*, fallback
let rate = 0.85;

export type SpeechVariant = "de-CH" | "gsw";

function pickVoice() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  chVoice = vs.find((v) => /^de[-_]CH/i.test(v.lang)) ?? null;
  deVoice = vs.find((v) => /^de[-_]/i.test(v.lang)) ?? null;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export function setSpeechRate(r: number) {
  rate = r;
}
export function getSpeechRate() {
  return rate;
}

/** true quando existe voz suíça de verdade — o app usa pra não prometer
 *  pronúncia suíça quando o que vai sair é uma voz da Alemanha. */
export function hasSwissVoice() {
  return chVoice !== null;
}

function utter(text: string, variant: SpeechVariant) {
  const u = new SpeechSynthesisUtterance(text);
  // sempre de-CH como tag: mesmo sem voz suíça instalada é o alemão certo, e
  // "gsw" não é aceito por motor nenhum.
  u.lang = "de-CH";
  u.rate = variant === "gsw" ? rate * 0.92 : rate; // dialeto um tico mais lento
  const v = chVoice ?? deVoice;
  if (v) u.voice = v;
  return u;
}

export function speak(text: string, variant: SpeechVariant = "de-CH") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter(text, variant));
}

// Fala uma lista de palavras em sequência (o navegador já toca as utterances
// na ordem em que foram enfileiradas) — usado pelos botões "ouvir palavras"
// dos exercícios de ligar/caça-palavras/enumerar, que não têm uma única frase,
// e pelas seções de Geografia e História, que leem parágrafo inteiro.
export function speakAll(texts: string[], variant: SpeechVariant = "de-CH") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  texts.forEach((text) => speechSynthesis.speak(utter(text, variant)));
}
