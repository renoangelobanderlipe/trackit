"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { markInstallmentPaid } from "@/app/actions/installments";
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

  async function handleSubmit() {
    setLoading(true);
    await markInstallmentPaid(installment.id, {
      paid_amount: Number.parseFloat(amount),
      paid_date: date,
      notes: notes || undefined,
    });
    setLoading(false);
    onClose();
    router.refresh();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Mark Payment — {installment.label}</DialogTitle>
      <DialogContent>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
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
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
