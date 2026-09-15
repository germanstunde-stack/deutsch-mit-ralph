// A mecânica de uma rodada de exercícios: gerar as vagas, contar acertos, trocar
// por outras 20, salvar o placar e mandar o resultado pro ranking.
//
// Estava dentro do TopicView, que é o componente de CAPÍTULO — cards à esquerda,
// explicação e exercícios à direita. As seções novas (Geografia, História) têm
// uma tela completamente diferente mas a mesma rodada, então isto saiu de lá em
// vez de ser copiado: copiar significaria duas versões da regra "pular sem
// responder conta como erro" e da que manda pro ranking uma vez só.
import { useEffect, useRef, useState } from "react";
import { useScoredRound } from "./scoring";
import { saveTopicScore } from "../data/topicScores";
import { usePlayer } from "../auth/AuthProvider";
import { supabase } from "./supabase";
import type { ExSpec } from "../data/exercises";

export interface ExerciseRound {
  specs: ExSpec[];
  /** muda a cada "trocar exercícios" — serve de key pra remontar os componentes */
  round: number;
  scored: ReturnType<typeof useScoredRound>;
  resolve: (i: number, correct: number, wrong: number) => void;
  /** troca as 20 vagas por outras; quem não respondeu perde o ponto */
  trocar: () => void;
  /** fecha a rodada e manda pro ranking (uma vez só); devolve os erros somados agora */
  submit: () => number;
}

export function useExerciseRound(opts: {
  size: number;
  make: () => ExSpec[];
  onResult: (correct: number, wrong: number) => void;
  /** chave de localStorage pro placar do capítulo; sem ela, não salva */
  scoreKey?: string;
}): ExerciseRound {
  const { session } = usePlayer();
  const [round, setRound] = useState(0);
  const [specs, setSpecs] = useState<ExSpec[]>(opts.make);
  const scored = useScoredRound(opts.size);
  const submittedRef = useRef(false);

  function submit(): number {
    // fecha a rodada atual: quem pulou sem responder perde o ponto (mesma regra
    // do "trocar"). flushUnresolved devolve o que ELE somou agora — o state só
    // atualiza no próximo render, então não dá pra ler scored.wrong aqui.
    const addedNow = scored.flushUnresolved(() => 1);
    // manda pro ranking (categoria "Exercícios") só uma vez por rodada — global,
    // não filtrado por módulo.
    if (session && !submittedRef.current) {
      submittedRef.current = true;
      supabase.rpc("add_exercise_result", { p_correct: scored.correct, p_wrong: scored.wrong + addedNow }).then(({ error }) => {
        if (error) console.warn("ranking (exercícios):", error.message);
      });
    }
    return addedNow;
  }

  function resolve(i: number, c: number, w: number) {
    if (scored.resolve(i, c, w)) opts.onResult(c, w);
  }

  function trocar() {
    const added = scored.flushUnresolved(() => 1);
    if (added > 0) opts.onResult(0, added);
    scored.reset(opts.size);
    submittedRef.current = false;
    setSpecs(opts.make());
    setRound((r) => r + 1);
  }

  // guarda a pontuação da rodada por capítulo. Só o último round, sem histórico.
  const { scoreKey } = opts;
  useEffect(() => {
    if (!scoreKey) return;
    if (scored.correct + scored.wrong === 0) return;
    saveTopicScore(scoreKey, { correct: scored.correct, wrong: scored.wrong, total: opts.size, at: Date.now() });
  }, [scoreKey, scored.correct, scored.wrong, opts.size]);

  return { specs, round, scored, resolve, trocar, submit };
}
