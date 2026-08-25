import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { usePlayer } from "../auth/AuthProvider";

interface Row { id: string; display_name: string; birthdate: string | null; correct: number; wrong: number; total: number; accuracy: number; }

function fmtDate(d: string | null): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function Ranking() {
  const { profile } = usePlayer();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    supabase.from("leaderboard").select("*").limit(50).then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  return (
    <section className="panel">
      <h2>🏆 Ranking</h2>
      <p className="desc">Placar por acertos — mostra só apelido e data de nascimento. Cada exercício respondido conta.</p>
      {!rows ? (
        <p className="desc">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="desc">Ninguém pontuou ainda. Seja o primeiro! 🚀</p>
      ) : (
        <ol className="rank">
          {rows.map((r, i) => (
            <li key={r.id} className={profile && r.id === profile.id ? "me" : ""}>
              <span className="pos">{i + 1}º</span>
              <span className="nm">{r.display_name} {r.birthdate && <span style={{ color: "var(--ink-soft)", fontWeight: 700, fontSize: ".8rem" }}>· {fmtDate(r.birthdate)}</span>}</span>
              <span className="sc">{r.correct} ✓ · {r.accuracy}%</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
