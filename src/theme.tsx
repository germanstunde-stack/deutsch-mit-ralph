import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setSpeechRate } from "./lib/speech";

type Theme = "system" | "light" | "dark";
interface Ctx { dark: boolean; toggleTheme: () => void; slow: boolean; toggleSpeed: () => void; }
const ThemeCtx = createContext<Ctx>(null!);
export function useTheme() { return useContext(ThemeCtx); }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const r = document.documentElement;
    if (theme === "system") r.removeAttribute("data-theme");
    else r.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => { setSpeechRate(slow ? 0.55 : 0.85); }, [slow]);

  const dark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme:dark)").matches);

  return (
    <ThemeCtx.Provider value={{ dark, toggleTheme: () => setTheme(dark ? "light" : "dark"), slow, toggleSpeed: () => setSlow((s) => !s) }}>
      {children}
    </ThemeCtx.Provider>
  );
}
