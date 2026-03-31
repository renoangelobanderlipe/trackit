"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (!result.ok) {
      const parsed = safeParseError(result.error);
      setError(parsed);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Sign in
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back to TrackIt
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <Typography variant="body2" align="center" color="text.secondary">
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "inherit", fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

function safeParseError(error: string): string {
  try {
    const parsed = JSON.parse(error);
    if (parsed.errors?.email) return parsed.errors.email[0];
    if (parsed.message) return parsed.message;
    return "Invalid credentials.";
  } catch {
    return error || "Something went wrong. Please try again.";
  }
}
