"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/app/actions/auth";
import TiLogo from "@/components/TiLogo";
import { parseApiError } from "@/lib/format";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await forgotPassword(email);
    setLoading(false);

    if (!result.ok) {
      setError(parseApiError(result.error));
      return;
    }

    setSuccess(true);
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
          Reset password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {success
            ? "Check your email for a reset link"
            : "Enter your email and we'll send you a reset link"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {success ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
          We've sent a password reset link to <strong>{email}</strong>. Check
          your inbox and follow the link to set a new password.
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2.5 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Send reset link"}
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
