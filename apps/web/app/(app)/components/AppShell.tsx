"use client";

import {
  DashboardSquare02Icon,
  Logout01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import TiLogo from "@/components/TiLogo";

const NAV_HEIGHT = 64;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navValue = pathname.startsWith("/loans") ? 1 : 0;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <Box
      sx={{
        pb: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      {/*
        iOS pattern: AppBar background bleeds into safe area (behind status bar).
        Toolbar content stays below the safe area via padding-top.
      */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar
          sx={{
            px: 2,
            minHeight: 56,
            pt: "env(safe-area-inset-top, 0px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >
            <TiLogo size="sm" />
            <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
              TrackIt
            </Typography>
          </Box>
          <IconButton
            onClick={handleLogout}
            size="small"
            aria-label="Logout"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "error.main" },
              "&:active": { transform: "scale(0.9)" },
            }}
          >
            <HugeiconsIcon icon={Logout01Icon} size={18} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {children}

      {/*
        iOS pattern: Bottom nav background extends behind home indicator.
        Nav items sit above the safe area via padding-bottom on the container.
      */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: "1px solid",
          borderColor: "divider",
          pb: "env(safe-area-inset-bottom, 0px)",
        }}
        elevation={0}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => {
            router.push(newValue === 0 ? "/dashboard" : "/loans");
          }}
          showLabels
          sx={{
            px: 2,
            height: NAV_HEIGHT,
            "& .MuiBottomNavigationAction-root": {
              "&:active": { transform: "scale(0.92)" },
              transition: "transform 0.1s ease",
            },
          }}
        >
          <BottomNavigationAction
            label="Dashboard"
            icon={<HugeiconsIcon icon={DashboardSquare02Icon} size={22} />}
          />
          <BottomNavigationAction
            label="Loans"
            icon={<HugeiconsIcon icon={Wallet01Icon} size={22} />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
