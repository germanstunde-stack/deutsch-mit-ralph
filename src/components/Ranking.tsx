import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { usePlayer } from "../auth/AuthProvider";

interface ExRow { id: string; display_name: string; birthdate: string | null; correct: number; wrong: number; total: number; accuracy: number; }
interface ProvaRow { id: string; display_name: string; birthdate: string | null; mode: string; melhor: number; soma: number; media: number; tentativas: number; total: number; }

function fmtDate(d: string | null): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function ExerciciosTable({ rows, meId }: { rows: ExRow[] | null; meId?: string }) {
  if (!rows) return <p className="desc">Carregando…</p>;
  if (rows.length === 0) return <p className="desc">Ninguém pontuou ainda. Seja o primeiro! 🚀</p>;
  return (
    <ol className="rank">
      {rows.map((r, i) => (
        <li key={r.id} className={meId && r.id === meId ? "me" : ""}>
          <span className="pos">{i + 1}º</span>
          <span className="nm">{r.display_name} {r.birthdate && <span style={{ color: "var(--ink-soft)", fontWeight: 700, fontSize: ".8rem" }}>· {fmtDate(r.birthdate)}</span>}</span>
          <span className="sc">{r.correct} ✓ · {r.accuracy}%</span>
        </li>
      ))}
    </ol>
  );
}

function ProvasTable({ rows, meId }: { rows: ProvaRow[] | null; meId?: string }) {
  if (!rows) return <p className="desc">Carregando…</p>;
  if (rows.length === 0) return <p className="desc">Ninguém fez essa prova ainda. Seja o primeiro! 🚀</p>;
  const sorted = [...rows].sort((a, b) => b.melhor - a.melhor);
  return (
    <div className="dtab-wrap">
      <table className="dtab">
        <thead><tr><th>#</th><th>Nome</th><th>Melhor</th><th>Soma</th><th>Média</th><th>Tentativas</th></tr></thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={r.id} className={meId && r.id === meId ? "me" : ""}>
              <td>{i + 1}º</td>
              <td>{r.display_name} {r.birthdate && <span style={{ color: "var(--ink-soft)", fontWeight: 700, fontSize: ".78rem" }}>· {fmtDate(r.birthdate)}</span>}</td>
              <td><b>{r.melhor}/{r.total}</b></td>
              <td>{r.soma}</td>
              <td>{r.media}</td>
              <td>{r.tentativas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Ranking() {
  const { profile } = usePlayer();
  const [exRows, setExRows] = useState<ExRow[] | null>(null);
  const [comRows, setComRows] = useState<ProvaRow[] | null>(null);
  const [semRows, setSemRows] = useState<ProvaRow[] | null>(null);
  const [tab, setTab] = useState<"exercicios" | "com" | "sem">("exercicios");

  function refresh() {
    supabase.from("leaderboard").select("*").limit(50).then(({ data }) => setExRows((data as ExRow[]) ?? []));
    supabase.from("leaderboard_provas").select("*").eq("mode", "com_consulta").then(({ data }) => setComRows((data as ProvaRow[]) ?? []));
    supabase.from("leaderboard_provas").select("*").eq("mode", "sem_consulta").then(({ data }) => setSemRows((data as ProvaRow[]) ?? []));
  }
  // busca de novo sempre que essa seção entra na tela — pega resultados que acabaram de ser
  // enviados (exercício/prova) sem precisar dar F5.
  useEffect(() => {
    const el = document.getElementById("ranking");
    if (!el) { refresh(); return; }
    const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) refresh(); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="panel" id="ranking">
      <h2>🏆 Ranking</h2>
      <p className="desc">Placar entre todos os alunos — só apelido e data de nascimento aparecem, nunca o e-mail.</p>
      <div className="btnrow">
        <button className={"tbtn" + (tab === "exercicios" ? " active" : "")} onClick={() => setTab("exercicios")}>🎯 Exercícios</button>
        <button className={"tbtn" + (tab === "com" ? " active" : "")} onClick={() => setTab("com")}>📖 Provas com consulta</button>
        <button className={"tbtn" + (tab === "sem" ? " active" : "")} onClick={() => setTab("sem")}>🙈 Provas sem consulta</button>
        <button className="tbtn" onClick={refresh} title="atualizar placar">🔄</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {tab === "exercicios" && <ExerciciosTable rows={exRows} meId={profile?.id} />}
        {tab === "com" && <ProvasTable rows={comRows} meId={profile?.id} />}
        {tab === "sem" && <ProvasTable rows={semRows} meId={profile?.id} />}
      </div>
    </section>
  );
}
