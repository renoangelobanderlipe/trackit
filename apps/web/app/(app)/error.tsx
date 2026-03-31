"use client";

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
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        An unexpected error occurred. Please try again.
      </Typography>
      <Button variant="contained" onClick={reset}>
        Try Again
      </Button>
    </Container>
  );
}
