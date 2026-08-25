import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface Profile { id: string; email: string | null; display_name: string | null; birthdate: string | null; }
interface Ctx {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  sendLink: (email: string) => Promise<{ error?: string }>;
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

  async function sendLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    });
    return { error: error?.message };
  }
  async function saveProfile(name: string, birthdate: string) {
    if (!session) return { error: "sem sessão" };
    const { error } = await supabase.from("profiles").update({ display_name: name.trim(), birthdate }).eq("id", session.user.id);
    if (!error) await load(session.user.id);
    return { error: error?.message };
  }
  async function signOut() { await supabase.auth.signOut(); }

  return (
    <C.Provider value={{ loading, session, profile, sendLink, saveProfile, signOut }}>
      {children}
    </C.Provider>
  );
}
