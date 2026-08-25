import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface Profile { id: string; email: string | null; display_name: string | null; birthdate: string | null; }
interface Ctx {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  saveProfile: (name: string, birthdate: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}
const C = createContext<Ctx>(null!);
export function usePlayer() { return useContext(C); }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function load(uid: string) {
    const { data } = await supabase.from("profiles").select("id,email,display_name,birthdate").eq("id", uid).maybeSingle();
    setProfile((data as Profile) ?? null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) load(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) load(s.user.id);
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Sem senha complexa, sem e-mail de confirmação: tenta entrar; se a conta ainda não existe,
  // cria na hora com a mesma senha (o navegador salva/autopreenche depois). Só falha de verdade
  // se o e-mail já existir e a senha estiver errada.
  async function login(email: string, password: string) {
    email = email.trim();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInError) return {};

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      if (/already registered|already exists/i.test(signUpError.message)) return { error: "Senha incorreta." };
      return { error: signUpError.message };
    }
    if (!data.session) return { needsConfirmation: true };
    return {};
  }
  async function saveProfile(name: string, birthdate: string) {
    if (!session) return { error: "sem sessão" };
    // upsert (não update): se o trigger que cria o profile na hora do cadastro não rodou
    // por algum motivo, isso cria a linha na hora em vez de silenciosamente não fazer nada.
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id, email: session.user.email, display_name: name.trim(), birthdate,
    });
    if (error) return { error: error.message };
    await load(session.user.id);
    return {};
  }
  async function signOut() { await supabase.auth.signOut(); }

  return (
    <C.Provider value={{ loading, session, profile, login, saveProfile, signOut }}>
      {children}
    </C.Provider>
  );
}
