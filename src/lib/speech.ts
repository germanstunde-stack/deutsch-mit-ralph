// Fala em alemão via Web Speech API, com controle de velocidade e voz (masc./fem./aleatória).
export type VoicePref = "auto" | "female" | "male" | "random";

let deVoices: SpeechSynthesisVoice[] = [];
let rate = 0.85;
let voicePref: VoicePref = "auto";

// Nomes comuns de vozes alemãs por SO/navegador — a Web Speech API não expõe gênero
// diretamente, então classificamos pelo nome. Sem correspondência = "unknown" (serve
// pros dois lados como reserva, se o sistema só tiver uma voz instalada).
const FEMALE_HINTS = ["katja", "petra", "marlene", "anna", "helena", "ingrid", "amala", "elke", "seraphina", "hedda", "google deutsch", "female"];
const MALE_HINTS = ["stefan", "hans", "markus", "klaus", "conrad", "florian", "michael", "ralf", "male"];

function classify(name: string): "female" | "male" | "unknown" {
  const n = name.toLowerCase();
  if (FEMALE_HINTS.some((h) => n.includes(h))) return "female";
  if (MALE_HINTS.some((h) => n.includes(h))) return "male";
  return "unknown";
}

function pickVoices() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  deVoices = vs.filter((v) => /de(-|_)/i.test(v.lang));
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  pickVoices();
  speechSynthesis.onvoiceschanged = pickVoices;
}

export function setSpeechRate(r: number) {
  rate = r;
}
export function getSpeechRate() {
  return rate;
}

export function setVoicePref(p: VoicePref) {
  voicePref = p;
}
export function getVoicePref() {
  return voicePref;
}
// vozes de cada gênero realmente disponíveis nesse navegador — usado pra saber se vale
// a pena mostrar a opção (se só existir 1 voz de alemão, feminina/masculina não fazem diferença).
export function availableVoiceGenders(): { female: boolean; male: boolean } {
  return { female: deVoices.some((v) => classify(v.name) === "female"), male: deVoices.some((v) => classify(v.name) === "male") };
}

function pickCurrentVoice(): SpeechSynthesisVoice | null {
  if (deVoices.length === 0) return null;
  if (voicePref === "random") return deVoices[Math.floor(Math.random() * deVoices.length)];
  if (voicePref === "female" || voicePref === "male") {
    const matches = deVoices.filter((v) => classify(v.name) === voicePref);
    if (matches.length > 0) return matches[0];
  }
  return deVoices[0];
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = rate;
  const v = pickCurrentVoice();
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
