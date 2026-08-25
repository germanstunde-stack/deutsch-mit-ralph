import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./types";
import { pt, type DictKey } from "./dict.pt";
import { en } from "./dict.en";

const DICTS: Record<Lang, Record<DictKey, string>> = { pt, en };
const KEY = "gs_lang_v1";

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: (key: DictKey, vars?: Record<string, string | number>) => string; }
const I18nCtx = createContext<Ctx>(null!);
export function useI18n() { return useContext(I18nCtx); }

function loadLang(): Lang {
  try { return localStorage.getItem(KEY) === "en" ? "en" : "pt"; } catch { return "pt"; }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  useEffect(() => {
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  function t(key: DictKey, vars?: Record<string, string | number>): string {
    let s = DICTS[lang][key];
    if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  }

  return <I18nCtx.Provider value={{ lang, setLang: setLangState, t }}>{children}</I18nCtx.Provider>;
}
