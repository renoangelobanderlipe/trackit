"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createLoan } from "@/app/actions/loans";
import { formatCurrency, parseApiError } from "@/lib/format";

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
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

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
      notes: notes || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      setError(parseApiError(result.error));
      return;
    }

    router.push(`/loans/${result.data.data.id}`);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Section: Loan Info */}
      <SectionLabel label="Loan Details" />
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
        helperText="Optional — the lending company"
        sx={{ mb: 2 }}
      />

      {/* Section: Payment */}
      <SectionLabel label="Payment Setup" />
      <TextField
        label="Total Amount"
        type="number"
        fullWidth
        required
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  ₱
                </Typography>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        <TextField
          label="Installments"
          type="number"
          fullWidth
          required
          value={numInstallments}
          onChange={(e) => setNumInstallments(e.target.value)}
          placeholder="e.g., 6"
        />
        <TextField
          label="Frequency"
          select
          fullWidth
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          {frequencies.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Collapse in={frequency === "twice_a_month"}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <TextField
            label="1st Due Day"
            type="number"
            fullWidth
            value={dueDay1}
            onChange={(e) => setDueDay1(e.target.value)}
            slotProps={{ htmlInput: { min: 1, max: 31 } }}
            helperText="Day of month"
          />
          <TextField
            label="2nd Due Day"
            type="number"
            fullWidth
            value={dueDay2}
            onChange={(e) => setDueDay2(e.target.value)}
            slotProps={{ htmlInput: { min: 1, max: 31 } }}
            helperText="Day of month"
          />
        </Box>
      </Collapse>

      {/* Preview */}
      <Collapse in={count > 0 && amount > 0}>
        <Box
          sx={{
            mb: 2,
            p: 2,
            background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
            borderRadius: 3,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Per Installment
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "1.25rem" }}>
              {formatCurrency(perInstallment)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Total
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
              {count} payments · {formatCurrency(amount)}
            </Typography>
          </Box>
        </Box>
      </Collapse>

      {/* Section: Schedule */}
      <SectionLabel label="Schedule & Status" />
      <DatePicker
        label="Start Date"
        value={startDate ? dayjs(startDate) : null}
        onChange={(val) => setStartDate(val ? val.format("YYYY-MM-DD") : "")}
        sx={{ mb: 2, width: "100%" }}
      />

      <TextField
        label="Notes"
        fullWidth
        multiline
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes about this loan"
        sx={{ mb: 3 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={
          loading || !title || !totalAmount || !numInstallments || !startDate
        }
      >
        {loading ? "Creating..." : "Create Loan"}
      </Button>
    </Box>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "text.secondary",
        display: "block",
        mb: 1.5,
        mt: 1,
      }}
    >
      {label}
    </Typography>
  );
}
