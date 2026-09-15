// Mapa clicável dos 26 cantões.
//
// Inline, não um arquivo em public/: o service worker do app é passthrough sem
// cache de propósito (ver public/sw.js), então um SVG buscado pela rede falha
// offline enquanto o bundle já carregado continua rodando — um mapa em branco.
// Inline também é o que permite um <path> por cantão com clique e foco, e cores
// vindas dos tokens do tema (um <img> não daria nenhuma das duas coisas).
//
// Os contornos e a licença estão em src/data/ch/cantonPaths.ts.
import { CANTON_PATHS, CANTON_CENTERS, MAP_VIEWBOX } from "../data/ch/cantonPaths";

export interface SwissMapProps {
  /** cantão marcado pelo aluno */
  selected?: string | null;
  /** depois de corrigir: o certo e, se errou, o que ele marcou */
  correct?: string | null;
  wrong?: string | null;
  /** quais são clicáveis; ausente = todos (modo Geografia) */
  enabled?: Set<string> | null;
  onPick?: (code: string) => void;
  /** mostra a sigla dentro de cada cantão */
  labels?: boolean;
  className?: string;
}

export function SwissMap({ selected, correct, wrong, enabled, onPick, labels, className }: SwissMapProps) {
  const codes = Object.keys(CANTON_PATHS);
  return (
    <svg className={"chmap" + (className ? " " + className : "")} viewBox={MAP_VIEWBOX} role="img" aria-label="Mapa dos cantões da Suíça">
      {codes.map((code) => {
        const clicavel = !!onPick && (!enabled || enabled.has(code));
        // vermelho é EXCLUSIVO de resposta errada. O vermelho suíço (--ch) não
        // entra aqui: ele e --bad são a mesma família, e um cantão selecionado
        // em vermelho leria como "você errou". Seleção é --brand.
        const estado = correct === code ? " ok" : wrong === code ? " no" : selected === code ? " sel" : "";
        return (
          <path
            key={code}
            d={CANTON_PATHS[code]}
            className={"cn" + (clicavel ? " live" : "") + estado}
            tabIndex={clicavel ? 0 : -1}
            onClick={clicavel ? () => onPick!(code) : undefined}
            onKeyDown={clicavel ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick!(code); } } : undefined}
          >
            <title>{code}</title>
          </path>
        );
      })}
      {labels && codes.map((code) => {
        const [x, y] = CANTON_CENTERS[code];
        const marcado = correct === code || wrong === code || selected === code;
        return <text key={code} className={"cl" + (marcado ? " on" : "")} x={x} y={y}>{code}</text>;
      })}
    </svg>
  );
}
