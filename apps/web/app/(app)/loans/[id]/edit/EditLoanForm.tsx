"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateLoan } from "@/app/actions/loans";
import { parseApiError } from "@/lib/format";
import type { LoanDetail } from "@/lib/types";

export default function EditLoanForm({ loan }: { loan: LoanDetail }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(loan.title);
  const [provider, setProvider] = useState(loan.provider ?? "");
  const [notes, setNotes] = useState(loan.notes ?? "");
  const [status, setStatus] = useState(loan.status);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await updateLoan(loan.id, {
      title,
      provider: provider || undefined,
      notes,
      status,
    });

    setLoading(false);

    if (!result.ok) {
      setError(parseApiError(result.error));
      return;
    }

    router.push(`/loans/${loan.id}`);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Loan Title"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Provider"
        fullWidth
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        placeholder="e.g., Billease, Home Credit"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Status"
        select
        fullWidth
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "not_started" | "in_progress" | "done")
        }
        sx={{ mb: 2 }}
      >
        <MenuItem value="not_started">Not Started</MenuItem>
        <MenuItem value="in_progress">In Progress</MenuItem>
        <MenuItem value="done">Done</MenuItem>
      </TextField>
      <TextField
        label="Notes"
        fullWidth
        multiline
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
}
