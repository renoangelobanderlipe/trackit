"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twoFactorChallenge } from "@/app/actions/auth";
import TiLogo from "@/components/TiLogo";
import { parseApiError } from "@/lib/format";

export default function TwoFactorChallengePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await twoFactorChallenge(code.trim(), useRecovery);
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

  function toggleMode() {
    setUseRecovery(!useRecovery);
    setCode("");
    setError("");
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
          Two-Factor Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {useRecovery
            ? "Enter one of your recovery codes"
            : "Enter the code from your authenticator app"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label={useRecovery ? "Recovery Code" : "Authentication Code"}
          fullWidth
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={useRecovery ? "xxxxx-xxxxx" : "000000"}
          inputProps={useRecovery ? {} : { maxLength: 6, inputMode: "numeric" }}
          sx={{ mb: 2.5 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading || !code.trim()}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mt: 2.5 }}>
        <Button
          variant="text"
          size="small"
          onClick={toggleMode}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {useRecovery
            ? "Use authenticator app instead"
            : "Use a recovery code instead"}
        </Button>
      </Box>
    </Box>
  );
}
