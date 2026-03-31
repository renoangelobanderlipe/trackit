"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteLoan } from "@/app/actions/loans";

type Props = {
  loanId: string;
  loanTitle: string;
  open: boolean;
  onClose: () => void;
};

export default function DeleteLoanDialog({
  loanId,
  loanTitle,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteLoan(loanId);
    router.push("/loans");
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Loan</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{loanTitle}</strong>? This
          will also delete all installments and cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
