"use client";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  updateTheme,
} from "@/app/actions/account";
import { logout } from "@/app/actions/auth";
import { parseApiError } from "@/lib/format";

type User = {
  id: string;
  name: string;
  email: string;
  theme_preference: string | null;
};

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function AccountClient({ user }: { user: User }) {
  const router = useRouter();

  // Profile
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Theme
  const [theme, setTheme] = useState(user.theme_preference ?? "system");

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteErr, setDeleteErr] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleProfileSave() {
    setProfileMsg("");
    setProfileErr("");
    setProfileLoading(true);
    const result = await updateProfile({ name, email });
    setProfileLoading(false);
    if (!result.ok) {
      setProfileErr(parseApiError(result.error));
      return;
    }
    setProfileMsg("Profile updated.");
  }

  async function handlePasswordChange() {
    setPasswordMsg("");
    setPasswordErr("");
    setPasswordLoading(true);
    const result = await changePassword({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
    setPasswordLoading(false);
    if (!result.ok) {
      setPasswordErr(parseApiError(result.error));
      return;
    }
    setPasswordMsg("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleThemeChange(value: string) {
    setTheme(value);
    await updateTheme(value as "light" | "dark" | "system");
  }

  async function handleDelete() {
    setDeleteErr("");
    setDeleteLoading(true);
    const result = await deleteAccount(deletePassword);
    setDeleteLoading(false);
    if (!result.ok) {
      setDeleteErr(parseApiError(result.error));
      return;
    }
    await logout();
    router.push("/login");
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2.5 }}>
        Account
      </Typography>

      {/* Profile */}
      <SectionLabel label="Profile" />
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
            <Avatar
              sx={{
                width: 52,
                height: 52,
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {name}
              </Typography>
              <Typography variant="caption">{email}</Typography>
            </Box>
          </Box>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          {profileMsg && (
            <Alert severity="success" sx={{ mb: 1.5, borderRadius: 3 }}>
              {profileMsg}
            </Alert>
          )}
          {profileErr && (
            <Alert severity="error" sx={{ mb: 1.5, borderRadius: 3 }}>
              {profileErr}
            </Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            disabled={profileLoading || (!name && !email)}
            onClick={handleProfileSave}
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <SectionLabel label="Password" />
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {passwordMsg && (
            <Alert severity="success" sx={{ mb: 1.5, borderRadius: 3 }}>
              {passwordMsg}
            </Alert>
          )}
          {passwordErr && (
            <Alert severity="error" sx={{ mb: 1.5, borderRadius: 3 }}>
              {passwordErr}
            </Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            disabled={
              passwordLoading ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            onClick={handlePasswordChange}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <SectionLabel label="Appearance" />
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {themes.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                variant={theme === t.value ? "filled" : "outlined"}
                color={theme === t.value ? "primary" : "default"}
                onClick={() => handleThemeChange(t.value)}
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  height: 36,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  ...(theme === t.value && {
                    boxShadow: "0 2px 8px rgba(13,148,136,0.3)",
                  }),
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <SectionLabel label="Danger Zone" />
      <Card sx={{ mb: 3, borderColor: "error.light" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => setDeleteOpen(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will permanently delete your account, all loans, and payment
            history. Enter your password to confirm.
          </Typography>
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          {deleteErr && (
            <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
              {deleteErr}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteLoading || !deletePassword}
            onClick={handleDelete}
          >
            {deleteLoading ? "Deleting..." : "Delete Forever"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "text.secondary",
        display: "block",
        mb: 1,
      }}
    >
      {label}
    </Typography>
  );
}
