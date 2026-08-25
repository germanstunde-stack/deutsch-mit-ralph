import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface Profile { id: string; email: string | null; display_name: string | null; }
interface Ctx {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  sendCode: (email: string) => Promise<{ error?: string }>;
  verify: (email: string, token: string) => Promise<{ error?: string }>;
  saveName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthCtx = createContext<Ctx>(null!);
export function useAuth() { return useContext(AuthCtx); }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function loadProfile(uid: string) {
    const { data } = await supabase.from("profiles").select("id,email,display_name").eq("id", uid).maybeSingle();
    setProfile((data as Profile) ?? null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendCode(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    return { error: error?.message };
  }
  async function verify(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    return { error: error?.message };
  }
  async function saveName(name: string) {
    if (!session) return;
    await supabase.from("profiles").update({ display_name: name }).eq("id", session.user.id);
    await loadProfile(session.user.id);
  }
  async function signOut() { await supabase.auth.signOut(); }

  return (
    <AuthCtx.Provider value={{ loading, session, user: session?.user ?? null, profile, sendCode, verify, saveName, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
