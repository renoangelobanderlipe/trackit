"use client";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
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

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navValue = pathname.startsWith("/loans") ? 1 : 0;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <Box sx={{ pb: 8 }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            TrackIt
          </Typography>
          <IconButton onClick={handleLogout} size="small" title="Logout">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box>{children}</Box>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
        elevation={3}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => {
            router.push(newValue === 0 ? "/dashboard" : "/loans");
          }}
          showLabels
        >
          <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
          <BottomNavigationAction
            label="Loans"
            icon={<AccountBalanceWalletIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
