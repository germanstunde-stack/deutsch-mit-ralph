import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

interface Row { id: string; display_name: string; correct: number; wrong: number; total: number; accuracy: number; }

export function Ranking() {
  const { profile } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    supabase.from("leaderboard").select("*").limit(50).then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  return (
    <section className="panel">
      <h2>🏆 Ranking</h2>
      <p className="desc">Placar por acertos — cada exercício respondido conta.</p>
      {!rows ? (
        <p className="desc">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="desc">Ninguém pontuou ainda. Seja o primeiro! 🚀</p>
      ) : (
        <ol className="rank">
          {rows.map((r, i) => (
            <li key={r.id} className={profile && r.id === profile.id ? "me" : ""}>
              <span className="pos">{i + 1}º</span>
              <span className="nm">{r.display_name}</span>
              <span className="sc">{r.correct} ✓ · {r.accuracy}%</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
