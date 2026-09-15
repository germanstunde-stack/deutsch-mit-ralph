// Clique-pra-ouvir dentro de HTML injetado.
//
// As explicações dos capítulos são strings de HTML com <span data-say="…">, e
// pendurar um onClick em cada span é impossível — o HTML entra por
// dangerouslySetInnerHTML. Então um handler só, no container, acha o alvo pelo
// closest(). A seção de História usa o mesmo mecanismo para tocar frase a frase.
import type { MouseEvent } from "react";
import { speak, type SpeechVariant } from "./speech";

export function sayOnClick(e: MouseEvent, variant: SpeechVariant = "de-CH") {
  const el = (e.target as HTMLElement).closest("[data-say]");
  if (!el) return;
  const txt = el.getAttribute("data-say");
  if (txt) speak(txt, (el.getAttribute("data-variant") as SpeechVariant) ?? variant);
}

// Atributo HTML tem que ser escapado. Hoje todo data-say é escrito à mão e
// nenhum tem aspas; os de Geografia e História são GERADOS a partir do dado, e
// uma aspa no texto truncaria o atributo — o navegador falaria a frase pela
// metade, sem erro nenhum aparecer.
export function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
