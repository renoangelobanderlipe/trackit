"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import confetti from "canvas-confetti";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { markInstallmentPaid } from "@/app/actions/installments";
import { decimalSubtract, formatCurrency, parseApiError } from "@/lib/format";
import type { Installment } from "@/lib/types";

type Props = {
  installment: Installment;
  open: boolean;
  onClose: () => void;
};

export default function PaymentDialog({ installment, open, onClose }: Props) {
  const router = useRouter();
  const remaining = decimalSubtract(
    installment.amount,
    installment.paid_amount,
  );
  const [amount, setAmount] = useState(remaining);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isFullPayment =
    Number.parseFloat(amount) >= Number.parseFloat(remaining);

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const result = await markInstallmentPaid(installment.id, {
      paid_amount: Number.parseFloat(amount),
      paid_date: date,
      notes: notes || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      setError(parseApiError(result.error));
      return;
    }

    setSuccess(true);

    if (isFullPayment) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0d9488", "#5eead4", "#10b981", "#f59e0b"],
      });
    }

    setTimeout(
      () => {
        setSuccess(false);
        onClose();
        router.refresh();
      },
      isFullPayment ? 1500 : 600,
    );
  }

  if (success) {
    return (
      <Dialog open={open} fullWidth maxWidth="xs">
        <DialogContent sx={{ textAlign: "center", py: 5 }}>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={64}
            color="var(--mui-palette-success-main)"
            style={{ marginBottom: 8 }}
          />
          <Typography variant="h6" fontWeight={700}>
            {isFullPayment ? "Fully Paid!" : "Payment Recorded"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(amount)} recorded for {installment.label}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Mark Payment — {installment.label}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            textAlign: "center",
            py: 1,
            mb: 2,
            bgcolor: "rgba(13,148,136,0.06)",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Remaining
          </Typography>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            {formatCurrency(remaining)}
          </Typography>
        </Box>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
        />
        <DatePicker
          label="Date Paid"
          value={dayjs(date)}
          onChange={(val) => setDate(val ? val.format("YYYY-MM-DD") : "")}
          sx={{ mb: 2, width: "100%" }}
        />
        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: 3 }}
        >
          {loading
            ? "Saving..."
            : isFullPayment
              ? "Pay in Full"
              : "Record Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
