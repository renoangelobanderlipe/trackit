"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createAppTheme } from "./theme";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  mode: "system",
  setMode: () => {},
  resolvedMode: "light",
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

function getInitialMode(): ThemeMode {
  if (typeof document === "undefined") return "system";
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("theme="));
  return (cookie?.split("=")[1] as ThemeMode) ?? "system";
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [systemPref, setSystemPref] = useState<"light" | "dark">(
    getSystemPreference,
  );

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setSystemPref(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedMode = mode === "system" ? systemPref : mode;

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    document.cookie = `theme=${newMode}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  }, []);

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  const contextValue = useMemo(
    () => ({ mode, setMode, resolvedMode }),
    [mode, setMode, resolvedMode],
  );

  return (
    <ThemeContext value={contextValue}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeContext>
  );
}
