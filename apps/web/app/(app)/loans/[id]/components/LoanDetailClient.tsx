"use client";

import { Delete01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { formatCurrency, formatDate } from "@/lib/format";
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
            background:
              "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)",
            color: "white",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Decorative circle */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.05)",
            }}
          />
          <CardContent sx={{ p: 2.5, position: "relative" }}>
            {/* Top row: title + actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}
                >
                  {loan.title}
                </Typography>
                {loan.provider && (
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}
                  >
                    {loan.provider}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.25,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  p: 0.25,
                }}
              >
                <Link href={`/loans/${loan.id}/edit`}>
                  <IconButton
                    size="small"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                  </IconButton>
                </Link>
                <IconButton
                  onClick={() => setShowDelete(true)}
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": { color: "#fca5a5" },
                  }}
                >
                  <HugeiconsIcon icon={Delete01Icon} size={16} />
                </IconButton>
              </Box>
            </Box>

            {/* Amount */}
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Total Amount
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.75rem",
                lineHeight: 1.2,
                mb: 1.5,
                letterSpacing: "-0.02em",
              }}
            >
              {formatCurrency(loan.total_amount)}
            </Typography>

            {/* Progress */}
            <AnimatedProgress
              value={progress}
              sx={{
                mb: 0.75,
                height: 6,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.15)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "white",
                  borderRadius: 3,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}
              >
                {formatCurrency(loan.total_paid)} paid
              </Typography>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 1.5,
                  px: 1,
                  py: 0.125,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                >
                  {Math.round(progress)}%
                </Typography>
              </Box>
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
