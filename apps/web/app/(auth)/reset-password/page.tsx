"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/app/actions/auth";
import TiLogo from "@/components/TiLogo";
import { parseApiError } from "@/lib/format";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await resetPassword(
      token,
      email,
      password,
      passwordConfirmation,
    );
    setLoading(false);

    if (!result.ok) {
      setError(parseApiError(result.error));
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token || !email) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Invalid reset link
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This password reset link is invalid or has expired.
        </Typography>
        <MuiLink
          component={NextLink}
          href="/forgot-password"
          color="primary"
          sx={{ fontWeight: 600, textDecoration: "none" }}
        >
          Request a new link
        </MuiLink>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <TiLogo size="lg" />
        </Box>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 800, mb: 0.5 }}
        >
          Set new password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your new password for {email}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {success ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
          Password reset successfully. Redirecting to sign in...
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={!!passwordConfirmation && passwordConfirmation !== password}
            helperText={
              passwordConfirmation && passwordConfirmation !== password
                ? "Passwords do not match"
                : undefined
            }
            sx={{ mb: 2.5 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={
              loading ||
              !password ||
              !passwordConfirmation ||
              password !== passwordConfirmation
            }
          >
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </Box>
      )}

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <MuiLink
          component={NextLink}
          href="/login"
          color="primary"
          sx={{ fontWeight: 600, textDecoration: "none" }}
        >
          Back to sign in
        </MuiLink>
      </Box>
    </Box>
  );
}
