"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";
import type { LoanDetail } from "@/lib/types";
import DeleteLoanDialog from "./DeleteLoanDialog";
import InstallmentList from "./InstallmentList";

export default function LoanDetailClient({ loan }: { loan: LoanDetail }) {
  const [showDelete, setShowDelete] = useState(false);
  const progress =
    (Number.parseFloat(loan.total_paid) /
      Number.parseFloat(loan.total_amount)) *
    100;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {loan.title}
          </Typography>
          {loan.provider && (
            <Typography variant="body2" color="text.secondary">
              {loan.provider}
            </Typography>
          )}
          <Chip
            label={statusLabel(loan.status)}
            size="small"
            color={statusColor(loan.status)}
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        </Box>
        <Box>
          <Link href={`/loans/${loan.id}/edit`}>
            <IconButton size="small" sx={{ mr: 0.5 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => setShowDelete(true)}
            color="error"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{ my: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2">
            ₱{loan.total_paid} / ₱{loan.total_amount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {loan.payment_frequency.replace("_", " ")} · Started{" "}
            {loan.start_date}
          </Typography>
          {loan.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {loan.notes}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Installments
      </Typography>
      <Card>
        <InstallmentList installments={loan.installments} />
      </Card>

      <DeleteLoanDialog
        loanId={loan.id}
        loanTitle={loan.title}
        open={showDelete}
        onClose={() => setShowDelete(false)}
      />
    </>
  );
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    done: "Done",
  };
  return map[status] ?? status;
}

function statusColor(status: string): "default" | "warning" | "success" {
  const map: Record<string, "default" | "warning" | "success"> = {
    not_started: "default",
    in_progress: "warning",
    done: "success",
  };
  return map[status] ?? "default";
}
