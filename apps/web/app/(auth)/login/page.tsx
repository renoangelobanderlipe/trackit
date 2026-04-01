"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";
import TiLogo from "@/components/TiLogo";
import { parseApiError } from "@/lib/format";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      setLoading(false);

      if (!result.ok) {
        setError(parseApiError(result.error));
        return;
      }

      if ("two_factor" in result.data) {
        router.push("/two-factor-challenge");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
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
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to continue to TrackIt
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              size="small"
              sx={{ color: "text.secondary" }}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Remember me for 30 days
            </Typography>
          }
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading || !email || !password}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" align="center" color="text.secondary">
        Don&apos;t have an account?{" "}
        <MuiLink
          component={NextLink}
          href="/register"
          color="primary"
          sx={{ fontWeight: 600, textDecoration: "none" }}
        >
          Create one
        </MuiLink>
      </Typography>
    </Box>
  );
}
