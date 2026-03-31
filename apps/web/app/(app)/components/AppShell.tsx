"use client";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
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

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navValue = pathname.startsWith("/loans") ? 1 : 0;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <Box sx={{ pb: "80px" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ px: 2 }}>
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
            }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {children}

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
        elevation={0}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => {
            router.push(newValue === 0 ? "/dashboard" : "/loans");
          }}
          showLabels
          sx={{ px: 2 }}
        >
          <BottomNavigationAction
            label="Dashboard"
            icon={<DashboardRoundedIcon />}
          />
          <BottomNavigationAction
            label="Loans"
            icon={<AccountBalanceWalletIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
