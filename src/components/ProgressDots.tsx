import type { SlotStatus } from "../lib/scoring";

export function ProgressDots({ status, onJump }: { status: SlotStatus[]; onJump?: (i: number) => void }) {
  return (
    <div className="progdots" role="list">
      {status.map((s, i) => (
        <button
          key={i}
          type="button"
          role="listitem"
          className={"pdot " + s}
          title={`Exercício ${i + 1}` + (s === "ok" ? " · certo" : s === "no" ? " · errado" : " · não respondido")}
          onClick={() => onJump?.(i)}
        />
      ))}
    </div>
  );
}
