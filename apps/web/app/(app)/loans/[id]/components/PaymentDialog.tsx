"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { markInstallmentPaid } from "@/app/actions/installments";
import { formatCurrency } from "@/lib/format";
import type { Installment } from "@/lib/types";

type Props = {
  installment: Installment;
  open: boolean;
  onClose: () => void;
};

export default function PaymentDialog({ installment, open, onClose }: Props) {
  const router = useRouter();
  const remaining =
    Number.parseFloat(installment.amount) -
    Number.parseFloat(installment.paid_amount);
  const [amount, setAmount] = useState(remaining.toFixed(2));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isFullPayment = Number.parseFloat(amount) >= remaining;

  async function handleSubmit() {
    setLoading(true);
    await markInstallmentPaid(installment.id, {
      paid_amount: Number.parseFloat(amount),
      paid_date: date,
      notes: notes || undefined,
    });
    setLoading(false);
    setSuccess(true);

    if (isFullPayment) {
      // Fire confetti for full payment
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
          <CheckCircleOutlineIcon
            sx={{ fontSize: 64, color: "success.main", mb: 1 }}
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
        <TextField
          label="Date Paid"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
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
