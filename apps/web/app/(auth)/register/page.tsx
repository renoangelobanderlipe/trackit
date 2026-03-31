"use client";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/app/actions/auth";

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

    const result = await register(name, email, password, passwordConfirmation);

    setLoading(false);

    if (!result.ok) {
      setError(safeParseError(result.error));
      return;
    }

    router.push("/dashboard");
  }

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Avatar
          sx={{
            mx: "auto",
            mb: 2,
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          }}
        >
          <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography variant="h5" component="h1" gutterBottom>
          Create account
        </Typography>
        <Typography variant="body2">Start tracking your loans</Typography>
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
          disabled={loading}
          sx={{ mb: 2.5 }}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#0d9488",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

function safeParseError(error: string): string {
  try {
    const parsed = JSON.parse(error);
    if (parsed.errors) {
      const firstField = Object.keys(parsed.errors)[0];
      return parsed.errors[firstField][0];
    }
    if (parsed.message) return parsed.message;
    return "Registration failed.";
  } catch {
    return error || "Something went wrong. Please try again.";
  }
}
