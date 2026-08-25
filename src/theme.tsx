import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setSpeechRate, setVoicePref, type VoicePref } from "./lib/speech";

type Theme = "system" | "light" | "dark";
const VOICE_CYCLE: VoicePref[] = ["random", "female", "male"];
interface Ctx { dark: boolean; toggleTheme: () => void; slow: boolean; toggleSpeed: () => void; voicePref: VoicePref; cycleVoice: () => void; }
const ThemeCtx = createContext<Ctx>(null!);
export function useTheme() { return useContext(ThemeCtx); }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [slow, setSlow] = useState(false);
  const [voicePref, setVoicePrefState] = useState<VoicePref>("random");

  useEffect(() => {
    const r = document.documentElement;
    if (theme === "system") r.removeAttribute("data-theme");
    else r.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => { setSpeechRate(slow ? 0.55 : 0.85); }, [slow]);
  useEffect(() => { setVoicePref(voicePref); }, [voicePref]);

  const dark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme:dark)").matches);

  function cycleVoice() {
    setVoicePrefState((v) => VOICE_CYCLE[(VOICE_CYCLE.indexOf(v) + 1) % VOICE_CYCLE.length]);
  }

  return (
    <ThemeCtx.Provider value={{ dark, toggleTheme: () => setTheme(dark ? "light" : "dark"), slow, toggleSpeed: () => setSlow((s) => !s), voicePref, cycleVoice }}>
      {children}
    </ThemeCtx.Provider>
  );
}
