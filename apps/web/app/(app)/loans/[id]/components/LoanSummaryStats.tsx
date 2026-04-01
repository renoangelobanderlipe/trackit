"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FadeIn from "@/components/animations/FadeIn";
import { formatCurrency, formatDate } from "@/lib/format";
import type { LoanDetail } from "@/lib/types";

export default function LoanSummaryStats({ loan }: { loan: LoanDetail }) {
  const paidCount = loan.installments.filter((i) => i.status === "paid").length;
  const unpaidInstallments = loan.installments
    .filter((i) => i.status !== "paid")
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );
  const lastUnpaidDueDate = unpaidInstallments.at(-1)?.due_date;

  return (
    <FadeIn delay={0.1}>
      <Card sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <StatCell
            label="Paid"
            value={`${formatCurrency(loan.total_paid)} / ${formatCurrency(loan.total_amount)}`}
            border="right"
          />
          <StatCell
            label="Remaining"
            value={formatCurrency(loan.total_remaining)}
          />
          <StatCell
            label="Installments"
            value={`${paidCount} of ${loan.num_installments} paid`}
            border="right"
            top
          />
          <StatCell
            label={loan.status === "done" ? "Status" : "Est. Payoff"}
            value={
              loan.status === "done"
                ? "Completed"
                : lastUnpaidDueDate
                  ? formatDate(lastUnpaidDueDate)
                  : "-"
            }
            top
          />
        </Box>
      </Card>
    </FadeIn>
  );
}

function StatCell({
  label,
  value,
  border,
  top,
}: {
  label: string;
  value: string;
  border?: "right";
  top?: boolean;
}) {
  return (
    <Box
      sx={{
        p: 2,
        ...(border === "right" && {
          borderRight: 1,
          borderColor: "divider",
        }),
        ...(top && {
          borderTop: 1,
          borderColor: "divider",
        }),
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          fontSize: "0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "text.secondary",
          display: "block",
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
        {value}
      </Typography>
    </Box>
  );
}
