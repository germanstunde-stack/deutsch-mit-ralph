// Monta uma rodada de exercícios sem repetir o mesmo item.
//
// Antes, cada vaga da rodada chamava gen() por conta própria, com sorteio COM
// reposição — num capítulo com 6 frases e 5 vagas, a chance de repetir era ~87%.
// Aqui o conteúdo é gerado na hora de montar a rodada, guardando o que já saiu
// e re-sorteando quando colide. O spec devolvido só entrega o item já pronto,
// então nenhum componente precisa mudar.
import type { ExSpec, TypedQ, ConnectData, WSData, EnumData, OrderData, TFData, ClozeData, ChronoData } from "./exercises";
import type { Question } from "./generators";

type ExItem = Question | TypedQ | ConnectData | WSData | EnumData | OrderData | TFData | ClozeData | ChronoData;

const MAX_TRIES = 8;

function clean(s: string): string {
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

// Identidade do exercício: o que faz o aluno sentir "já vi esse". Ignora os
// distratores (duas perguntas sobre a mesma palavra são a mesma pergunta) e
// ordena as listas dos exercícios de múltiplos itens, senão uma permutação dos
// mesmos 5 pares passaria como item novo.
export function itemKey(kind: ExSpec["kind"], item: ExItem): string {
  switch (kind) {
    case "mc": {
      const q = item as Question;
      return `mc|${clean(q.promptHTML)}|${clean(q.options.find((o) => o.correct)?.label ?? "")}`;
    }
    case "typed":
    case "dict": {
      // o ditado tem prompt fixo ("ouça e escreva"), então a resposta é que identifica
      const q = item as TypedQ;
      return `${kind}|${clean(q.promptHTML)}|${clean(q.answer)}`;
    }
    case "order": {
      // nunca por `chunks` — ele é embaralhado a cada chamada
      const o = item as OrderData;
      return `order|${clean(o.answer.join(" "))}`;
    }
    case "connect": {
      const c = item as ConnectData;
      return `connect|${clean(c.title)}|${c.pairs.map((p) => p.key).sort().join(",")}`;
    }
    case "ws": {
      const w = item as WSData;
      return `ws|${clean(w.title)}|${w.pairs.map((p) => p.w).sort().join(",")}`;
    }
    case "enum": {
      const e = item as EnumData;
      return `enum|${clean(e.title)}|${e.items.map((i) => i.de).sort().join(",")}`;
    }
    case "cloze": {
      // nunca pelo `bank`: ele tem os distratores e é embaralhado. A identidade
      // é o texto com as lacunas preenchidas. O título fica de fora de
      // propósito — a mesma frase pedida por dois capítulos É o mesmo exercício.
      const c = item as ClozeData;
      const cheio = c.lines.map((ln) =>
        ln.segments.reduce((acc, seg, i) => acc + seg + (i < ln.gaps.length ? `[${ln.gaps[i].answer}]` : ""), ""),
      ).join(" / ");
      return `cloze|${clean(cheio)}`;
    }
    case "chrono": {
      // por id, ordenado. Não por ano (dois eventos podem dividir um) nem por
      // rótulo (é traduzível, então a versão em inglês pareceria item novo).
      const c = item as ChronoData;
      return `chrono|${c.events.map((e) => e.id).sort().join(",")}`;
    }
    case "tf": {
      // ordenado porque o componente embaralha as afirmações; e o =1/=0 no fim
      // mantém "Bern é a capital (verdadeiro)" distinto da mesma frase marcada
      // como falsa — senão as duas versões contariam como o mesmo exercício.
      const t = item as TFData;
      return `tf|${clean(t.title)}|${t.statements.map((s) => `${clean(s.html)}=${s.correct ? 1 : 0}`).sort().join(",")}`;
    }
    default: {
      // Um `kind` novo sem case aqui devolveria undefined em runtime — e como o
      // tsconfig não liga noImplicitReturns, isso passa batido na compilação.
      // Set.has(undefined) faria TODO item parecer repetido e a anti-repetição
      // desligaria em silêncio. O `never` transforma o esquecimento em erro de
      // tipo; o throw cobre o caso de um kind vir de dado, não de código.
      const nunca: never = kind;
      throw new Error(`itemKey: falta o case do exercício "${String(nunca)}"`);
    }
  }
}

// spec que já carrega o conteúdo pronto (o cast é seguro: o item veio do gen()
// deste mesmo spec, então o tipo bate com o kind).
function frozen(spec: ExSpec, item: ExItem): ExSpec {
  return { kind: spec.kind, gen: () => item } as ExSpec;
}

/**
 * Gera `count` exercícios ciclando `base` (vaga i usa base[i % base.length]),
 * evitando repetir o mesmo item. Cada posição do ciclo tem sua própria memória,
 * então um pool pequeno não atrapalha os outros.
 *
 * Quando o pool se esgota (mais vagas que itens disponíveis), começa uma época
 * nova: limpa a memória e só evita repetir o item imediatamente anterior. Assim
 * 5 vagas num pool de 6 dão 5 frases distintas, e 20 vagas num pool de 6 dão
 * ciclos de 6 sem repetição em sequência — nunca trava nem estoura.
 */
export function buildRound(base: ExSpec[], count: number): ExSpec[] {
  if (base.length === 0) return [];
  const state = base.map(() => ({ seen: new Set<string>(), last: "" }));
  const out: ExSpec[] = [];

  for (let i = 0; i < count; i++) {
    const slot = i % base.length;
    const spec = base[slot];
    const st = state[slot];

    let chosen: ExItem | null = null;
    let chosenKey = "";
    let fallback: ExItem | null = null;
    let fallbackKey = "";

    for (let t = 0; t < MAX_TRIES; t++) {
      let item: ExItem;
      try {
        item = spec.gen() as ExItem;
      } catch {
        break; // gerador quebrado: cai no fallback abaixo
      }
      const key = itemKey(spec.kind, item);
      if (!st.seen.has(key)) { chosen = item; chosenKey = key; break; }
      // já saiu nesta época: serve de reserva, desde que não seja o último mostrado
      if (!fallback || key !== st.last) { fallback = item; fallbackKey = key; }
    }

    if (!chosen && fallback) {
      st.seen.clear(); // pool esgotado — recomeça a época
      chosen = fallback;
      chosenKey = fallbackKey;
    }
    if (!chosen) { out.push(spec); continue; } // nem gerar deu: mantém o spec preguiçoso

    st.seen.add(chosenKey);
    st.last = chosenKey;
    out.push(frozen(spec, chosen));
  }
  return out;
}
