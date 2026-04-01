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

type Props = {
  initialTheme: ThemeMode;
  children: React.ReactNode;
};

export default function Providers({ initialTheme, children }: Props) {
  const [mode, setModeState] = useState<ThemeMode>(initialTheme);
  const [systemPref, setSystemPref] = useState<"light" | "dark">("light");

  // Detect system preference on mount (client only)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPref(mq.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) =>
      setSystemPref(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // For SSR: when mode is "system", default to "light" (matches server)
  // After mount, systemPref updates and the theme corrects itself
  const resolvedMode = mode === "system" ? systemPref : mode;

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    cookieStore.set({
      name: "theme",
      value: newMode,
      path: "/",
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
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
