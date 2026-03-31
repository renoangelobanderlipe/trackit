"use client";

import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container maxWidth="xs" sx={{ py: 8, textAlign: "center" }}>
      <HugeiconsIcon
        icon={AlertCircleIcon}
        size={56}
        color="var(--mui-palette-text-secondary)"
        style={{ marginBottom: 16 }}
      />
      <Typography variant="h5" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        An unexpected error occurred. Please try again.
      </Typography>
      <Button variant="contained" onClick={reset} size="large">
        Try Again
      </Button>
    </Container>
  );
}
