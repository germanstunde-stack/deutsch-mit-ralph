// Monta uma rodada de exercícios sem repetir o mesmo item.
//
// Antes, cada vaga da rodada chamava gen() por conta própria, com sorteio COM
// reposição — num capítulo com 6 frases e 5 vagas, a chance de repetir era ~87%.
// Aqui o conteúdo é gerado na hora de montar a rodada, guardando o que já saiu
// e re-sorteando quando colide. O spec devolvido só entrega o item já pronto,
// então nenhum componente precisa mudar.
import type { ExSpec, TypedQ, ConnectData, WSData, EnumData, OrderData } from "./exercises";
import type { Question } from "./generators";

type ExItem = Question | TypedQ | ConnectData | WSData | EnumData | OrderData;

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
