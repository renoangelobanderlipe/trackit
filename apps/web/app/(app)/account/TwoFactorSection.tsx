"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import {
  confirmPassword,
  confirmTwoFactor,
  disableTwoFactor,
  enableTwoFactor,
  getConfirmedPasswordStatus,
  getRecoveryCodes,
  getTwoFactorQrCode,
  getTwoFactorSecretKey,
  getTwoFactorStatus,
  regenerateRecoveryCodes,
} from "@/app/actions/two-factor";
import { parseApiError } from "@/lib/format";

type TfaState = "loading" | "disabled" | "setup" | "enabled";

export default function TwoFactorSection() {
  const [state, setState] = useState<TfaState>("loading");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Setup state
  const [qrSvg, setQrSvg] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [confirmCode, setConfirmCode] = useState("");

  // Recovery codes
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showCodes, setShowCodes] = useState(false);

  // Password confirmation dialog
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "enable" | "disable" | "viewCodes" | "regenerateCodes" | null
  >(null);

  useEffect(() => {
    getTwoFactorStatus().then((result) => {
      if (result.ok) {
        setState(
          result.data.enabled && result.data.confirmed ? "enabled" : "disabled",
        );
      } else {
        setState("disabled");
      }
    });
  }, []);

  async function requirePasswordConfirmation(
    action: "enable" | "disable" | "viewCodes" | "regenerateCodes",
  ) {
    const statusResult = await getConfirmedPasswordStatus();
    if (statusResult.ok && statusResult.data.confirmed) {
      await executeAction(action);
      return;
    }
    setPendingAction(action);
    setPassword("");
    setPasswordError("");
    setPasswordDialog(true);
  }

  async function handlePasswordConfirm() {
    setPasswordError("");
    setPasswordLoading(true);
    const result = await confirmPassword(password);
    setPasswordLoading(false);

    if (!result.ok) {
      setPasswordError(parseApiError(result.error));
      return;
    }

    setPasswordDialog(false);
    if (pendingAction) {
      await executeAction(pendingAction);
    }
  }

  async function executeAction(
    action: "enable" | "disable" | "viewCodes" | "regenerateCodes",
  ) {
    setError("");
    setSuccess("");
    setLoading(true);

    switch (action) {
      case "enable": {
        const result = await enableTwoFactor();
        if (!result.ok) {
          setError(parseApiError(result.error));
          setLoading(false);
          return;
        }
        const [qrResult, keyResult] = await Promise.all([
          getTwoFactorQrCode(),
          getTwoFactorSecretKey(),
        ]);
        if (qrResult.ok) setQrSvg(qrResult.data.svg);
        if (keyResult.ok) setSecretKey(keyResult.data.secretKey);
        setState("setup");
        setLoading(false);
        break;
      }
      case "disable": {
        const result = await disableTwoFactor();
        setLoading(false);
        if (!result.ok) {
          setError(parseApiError(result.error));
          return;
        }
        setState("disabled");
        setSuccess("Two-factor authentication has been disabled.");
        setRecoveryCodes([]);
        break;
      }
      case "viewCodes": {
        const result = await getRecoveryCodes();
        setLoading(false);
        if (!result.ok) {
          setError(parseApiError(result.error));
          return;
        }
        setRecoveryCodes(result.data);
        setShowCodes(true);
        break;
      }
      case "regenerateCodes": {
        const result = await regenerateRecoveryCodes();
        setLoading(false);
        if (!result.ok) {
          setError(parseApiError(result.error));
          return;
        }
        setRecoveryCodes(result.data);
        setShowCodes(true);
        setSuccess("Recovery codes have been regenerated.");
        break;
      }
    }
  }

  async function handleConfirmSetup() {
    setError("");
    setLoading(true);
    const result = await confirmTwoFactor(confirmCode);

    if (!result.ok) {
      setError(parseApiError(result.error));
      setLoading(false);
      return;
    }

    const codesResult = await getRecoveryCodes();
    setLoading(false);
    if (codesResult.ok) {
      setRecoveryCodes(codesResult.data);
      setShowCodes(true);
    }
    setState("enabled");
    setSuccess("Two-factor authentication is now enabled.");
    setConfirmCode("");
  }

  async function handleCancelSetup() {
    setLoading(true);
    await disableTwoFactor();
    setLoading(false);
    setState("disabled");
    setQrSvg("");
    setSecretKey("");
    setConfirmCode("");
  }

  if (state === "loading") {
    return (
      <>
        <SectionLabel label="Two-Factor Authentication" />
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rounded" height={36} sx={{ mt: 1.5 }} />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionLabel label="Two-Factor Authentication" />
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
              {success}
            </Alert>
          )}

          {state === "disabled" && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add an extra layer of security to your account using a
                time-based one-time password (TOTP) authenticator app.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={() => requirePasswordConfirmation("enable")}
              >
                {loading ? "Enabling..." : "Enable Two-Factor Authentication"}
              </Button>
            </>
          )}

          {state === "setup" && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Scan the QR code below with your authenticator app (Google
                Authenticator, Authy, etc.), then enter the 6-digit code to
                confirm.
              </Typography>
              {qrSvg && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 2,
                    "& svg": {
                      width: 180,
                      height: 180,
                      borderRadius: 2,
                    },
                  }}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: QR SVG from Fortify, sanitized with DOMPurify
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(qrSvg, {
                      USE_PROFILES: { svg: true },
                    }),
                  }}
                />
              )}
              {secretKey && (
                <Box
                  sx={{
                    bgcolor: "action.hover",
                    borderRadius: 2,
                    p: 1.5,
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    Or enter this key manually:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      wordBreak: "break-all",
                    }}
                  >
                    {secretKey}
                  </Typography>
                </Box>
              )}
              <TextField
                label="Verification Code"
                fullWidth
                autoFocus
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="000000"
                inputProps={{ maxLength: 6, inputMode: "numeric" }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  onClick={handleCancelSetup}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={loading || confirmCode.length < 6}
                  onClick={handleConfirmSetup}
                >
                  {loading ? "Confirming..." : "Confirm"}
                </Button>
              </Box>
            </>
          )}

          {state === "enabled" && (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Chip
                  label="Enabled"
                  color="success"
                  size="small"
                  variant="filled"
                />
                <Typography variant="body2" color="text.secondary">
                  Two-factor authentication is active
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={loading}
                  onClick={() => requirePasswordConfirmation("viewCodes")}
                >
                  View Codes
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={loading}
                  onClick={() => requirePasswordConfirmation("regenerateCodes")}
                >
                  Regenerate Codes
                </Button>
              </Box>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                disabled={loading}
                onClick={() => requirePasswordConfirmation("disable")}
              >
                {loading ? "Disabling..." : "Disable Two-Factor Authentication"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Password Confirmation Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please confirm your password to continue.
          </Typography>
          <TextField
            label="Password"
            type="password"
            fullWidth
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && password) handlePasswordConfirm();
            }}
          />
          {passwordError && (
            <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={passwordLoading || !password}
            onClick={handlePasswordConfirm}
          >
            {passwordLoading ? "Confirming..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recovery Codes Dialog */}
      <Dialog
        open={showCodes}
        onClose={() => setShowCodes(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Recovery Codes</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
            Store these recovery codes in a safe place. Each code can only be
            used once. If you lose access to your authenticator app, you can use
            these codes to sign in.
          </Alert>
          <Box
            sx={{
              bgcolor: "action.hover",
              borderRadius: 2,
              p: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
            }}
          >
            {recoveryCodes.map((code) => (
              <Typography
                key={code}
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                {code}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              navigator.clipboard.writeText(recoveryCodes.join("\n"));
            }}
          >
            Copy All
          </Button>
          <Button variant="contained" onClick={() => setShowCodes(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Typography
      component="h2"
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
