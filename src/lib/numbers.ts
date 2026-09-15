const ONES = ["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"];
const TENS = ["","","zwanzig","dreissig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];

export function numDE(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10), u = n % 10;
    if (u === 0) return TENS[t];
    return (u === 1 ? "ein" : ONES[u]) + "und" + TENS[t];
  }
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    const hb = (h === 1 ? "ein" : ONES[h]) + "hundert";
    return r === 0 ? hb : hb + numDE(r);
  }
  if (n === 1000) return "tausend";
  const th = Math.floor(n / 1000), rr = n % 1000;
  return (th === 1 ? "ein" : ONES[th]) + "tausend" + (rr ? numDE(rr) : "");
}

export function ordDE(n: number): string {
  const irr: Record<number, string> = { 1: "erste", 3: "dritte", 7: "siebte", 8: "achte" };
  if (irr[n]) return irr[n];
  return numDE(n) + (n < 20 ? "te" : "ste");
}
