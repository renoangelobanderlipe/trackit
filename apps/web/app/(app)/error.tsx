"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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
      <ErrorOutlineIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
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
