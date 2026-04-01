"use client";
import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

const sharedComponents = {
  MuiCard: {
    defaultProps: { elevation: 0 as const },
    styleOverrides: {
      root: {
        borderRadius: 16,
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.06)" },
        "&:active": { transform: "scale(0.98)" },
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true as const },
    styleOverrides: {
      root: {
        borderRadius: 12,
        textTransform: "none" as const,
        fontWeight: 600,
        padding: "10px 20px",
        transition: "all 0.15s ease",
        "&:active": { transform: "scale(0.97)" },
      },
      contained: {
        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
        "&:hover": {
          background: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
        },
      },
      sizeLarge: { padding: "14px 24px", fontSize: "1rem" },
    },
  },
  MuiTextField: {
    defaultProps: { variant: "outlined" as const },
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 12,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0d9488",
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8, fontWeight: 600, fontSize: "0.7rem" },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 99, height: 8 },
      bar: { borderRadius: 99 },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(13,148,136,0.3)",
        transition: "all 0.15s ease",
        "&:active": { transform: "scale(0.92)" },
      },
    },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: 20 } },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: { "&.Mui-selected": { color: "#0d9488" } },
    },
  },
  MuiSkeleton: {
    styleOverrides: { root: { borderRadius: 12 } },
  },
  MuiDateCalendar: {
    styleOverrides: { root: { borderRadius: 16 } },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontWeight: 500,
        fontSize: "0.8rem",
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: "rgba(13,148,136,0.08)",
          transform: "scale(1.1)",
        },
        "&.Mui-selected": {
          backgroundColor: "#0d9488",
          fontWeight: 700,
          boxShadow: "0 2px 8px rgba(13,148,136,0.35)",
          "&:hover": { backgroundColor: "#0f766e" },
        },
        "&.MuiPickersDay-today": {
          borderColor: "#0d9488",
          borderWidth: 2,
          fontWeight: 700,
        },
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      label: { fontWeight: 700, fontSize: "0.9rem" },
      switchViewButton: { color: "#0d9488" },
    },
  },
  MuiPickerPopper: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
      },
    },
  },
};

export function createAppTheme(mode: "light" | "dark") {
  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: "#0d9488",
        light: "#5eead4",
        dark: "#0f766e",
        contrastText: "#ffffff",
      },
      secondary: { main: "#6366f1", light: "#a5b4fc", dark: "#4338ca" },
      error: { main: "#ef4444", light: "#fca5a5" },
      warning: { main: "#f59e0b", light: "#fde68a" },
      success: { main: "#10b981", light: "#6ee7b7" },
      ...(mode === "light"
        ? {
            background: { default: "#f8fafc", paper: "#ffffff" },
            text: { primary: "#0f172a", secondary: "#64748b" },
            divider: "#e2e8f0",
          }
        : {
            background: { default: "#0c1222", paper: "#1e293b" },
            text: { primary: "#e2e8f0", secondary: "#94a3b8" },
            divider: "#334155",
          }),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "var(--font-geist-sans)",
      h4: { fontWeight: 800, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 700, letterSpacing: "-0.01em" },
      subtitle1: { fontWeight: 600 },
    },
    components: {
      ...sharedComponents,
      MuiAppBar: {
        styleOverrides: {
          root:
            mode === "light"
              ? {
                  backgroundColor: "rgba(248,250,252,0.8)",
                  backdropFilter: "blur(12px)",
                  color: "#0f172a",
                }
              : {
                  backgroundColor: "rgba(12,18,34,0.85)",
                  backdropFilter: "blur(12px)",
                  color: "#e2e8f0",
                },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root:
            mode === "light"
              ? {
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  height: 64,
                }
              : {
                  backgroundColor: "rgba(30,41,59,0.9)",
                  backdropFilter: "blur(12px)",
                  height: 64,
                },
        },
      },
      MuiCard: {
        ...sharedComponents.MuiCard,
        styleOverrides: {
          root: {
            ...sharedComponents.MuiCard.styleOverrides.root,
            border: `1px solid ${mode === "light" ? "#e2e8f0" : "#334155"}`,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            ...sharedComponents.MuiLinearProgress.styleOverrides.root,
            backgroundColor: mode === "light" ? "#e2e8f0" : "#334155",
          },
          bar: sharedComponents.MuiLinearProgress.styleOverrides.bar,
        },
      },
    },
  });
}

// Default export for backward compatibility
const theme = createAppTheme("light");
export default theme;
