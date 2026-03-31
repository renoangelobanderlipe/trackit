"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createLoan } from "@/app/actions/loans";

const frequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "twice_a_month", label: "Twice a Month" },
  { value: "biweekly", label: "Biweekly" },
  { value: "weekly", label: "Weekly" },
];

export default function LoanForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [numInstallments, setNumInstallments] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [dueDay1, setDueDay1] = useState("15");
  const [dueDay2, setDueDay2] = useState("25");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("not_started");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Compute installment preview
  const amount = Number.parseFloat(totalAmount) || 0;
  const count = Number.parseInt(numInstallments) || 0;
  const perInstallment = count > 0 ? amount / count : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await createLoan({
      title,
      provider: provider || undefined,
      total_amount: Number.parseFloat(totalAmount),
      num_installments: Number.parseInt(numInstallments),
      payment_frequency: frequency,
      ...(frequency === "twice_a_month"
        ? { due_days: [Number.parseInt(dueDay1), Number.parseInt(dueDay2)] }
        : {}),
      start_date: startDate,
      status,
      notes: notes || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      setError("Failed to create loan. Please check your inputs.");
      return;
    }

    router.push(`/loans/${result.data.data.id}`);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Loan Title"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Phone Installment"
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
        label="Total Amount"
        type="number"
        fullWidth
        required
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Number of Installments"
        type="number"
        fullWidth
        required
        value={numInstallments}
        onChange={(e) => setNumInstallments(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Payment Frequency"
        select
        fullWidth
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        sx={{ mb: 2 }}
      >
        {frequencies.map((f) => (
          <MenuItem key={f.value} value={f.value}>
            {f.label}
          </MenuItem>
        ))}
      </TextField>

      {frequency === "twice_a_month" && (
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="First Due Day"
            type="number"
            fullWidth
            value={dueDay1}
            onChange={(e) => setDueDay1(e.target.value)}
            slotProps={{ htmlInput: { min: 1, max: 31 } }}
          />
          <TextField
            label="Second Due Day"
            type="number"
            fullWidth
            value={dueDay2}
            onChange={(e) => setDueDay2(e.target.value)}
            slotProps={{ htmlInput: { min: 1, max: 31 } }}
          />
        </Box>
      )}

      <TextField
        label="Start Date"
        type="date"
        fullWidth
        required
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Status"
        select
        fullWidth
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 2 }}
      />

      {count > 0 && amount > 0 && (
        <Box
          sx={{
            mb: 2,
            p: 2.5,
            background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Installment Preview
          </Typography>
          <Typography
            variant="h5"
            fontWeight={800}
            color="primary.main"
            sx={{ my: 0.5 }}
          >
            ₱{perInstallment.toFixed(2)}
          </Typography>
          <Typography variant="caption">
            {count} payments · {frequency.replace(/_/g, " ")}
          </Typography>
        </Box>
      )}

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
        {loading ? "Creating..." : "Create Loan"}
      </Button>
    </Box>
  );
}
