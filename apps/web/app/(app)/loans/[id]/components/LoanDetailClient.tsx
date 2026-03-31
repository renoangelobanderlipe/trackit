"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";
import AnimatedProgress from "@/components/animations/AnimatedProgress";
import Confetti from "@/components/animations/Confetti";
import FadeIn from "@/components/animations/FadeIn";
import { formatDate } from "@/lib/format";
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
      {loan.status === "done" && <Confetti />}

      {/* Hero */}
      <FadeIn>
        <Card
          sx={{
            mb: 2.5,
            border: "none",
            background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    fontSize: 16,
                    fontWeight: 700,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {loan.title.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                    {loan.title}
                  </Typography>
                  {loan.provider && (
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {loan.provider}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Link href={`/loans/${loan.id}/edit`}>
                  <IconButton
                    size="small"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Link>
                <IconButton
                  onClick={() => setShowDelete(true)}
                  size="small"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.6)", mb: 0.5 }}
            >
              Total Amount
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              ₱{loan.total_amount}
            </Typography>

            <AnimatedProgress
              value={progress}
              sx={{
                mb: 1,
                height: 8,
                bgcolor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "white",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                ₱{loan.total_paid} paid
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Info Row */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2.5,
          flexWrap: "wrap",
        }}
      >
        <Chip
          label={statusLabel(loan.status)}
          size="small"
          color={statusColor(loan.status)}
          variant={loan.status === "done" ? "filled" : "outlined"}
        />
        <Chip
          label={loan.payment_frequency.replace(/_/g, " ")}
          size="small"
          variant="outlined"
        />
        <Chip
          label={`Started ${formatDate(loan.start_date)}`}
          size="small"
          variant="outlined"
        />
      </Box>

      {loan.notes && (
        <Card sx={{ mb: 2.5 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
            >
              Notes
            </Typography>
            <Typography variant="body2" color="text.primary">
              {loan.notes}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Installments */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
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
