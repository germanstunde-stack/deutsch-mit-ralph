// Fala em alemão via Web Speech API, com controle de velocidade.
let deVoice: SpeechSynthesisVoice | null = null;
let rate = 0.85;

function pickVoice() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  deVoice = vs.filter((v) => /de(-|_)/i.test(v.lang))[0] ?? null;
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

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = rate;
  if (deVoice) u.voice = deVoice;
  speechSynthesis.speak(u);
}

// Fala uma lista de palavras em sequência (o navegador já toca as utterances
// na ordem em que foram enfileiradas) — usado pelos botões "ouvir palavras"
// dos exercícios de ligar/caça-palavras/enumerar, que não têm uma única frase.
export function speakAll(texts: string[]) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  texts.forEach((text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = rate;
    if (deVoice) u.voice = deVoice;
    speechSynthesis.speak(u);
  });
}
