"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/app/actions/auth";
import TiLogo from "@/components/TiLogo";
import { parseApiError } from "@/lib/format";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register(
        name,
        email,
        password,
        passwordConfirmation,
      );
      setLoading(false);

      if (!result.ok) {
        setError(parseApiError(result.error));
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
          Create account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start tracking your loans with TrackIt
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
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
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          required
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={
            loading || !name || !email || !password || !passwordConfirmation
          }
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" align="center" color="text.secondary">
        Already have an account?{" "}
        <MuiLink
          component={NextLink}
          href="/login"
          color="primary"
          sx={{ fontWeight: 600, textDecoration: "none" }}
        >
          Sign in
        </MuiLink>
      </Typography>
    </Box>
  );
}
