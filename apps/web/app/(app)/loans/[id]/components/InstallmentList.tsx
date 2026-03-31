"use client";

import { CheckmarkCircle02Icon, RecordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Installment } from "@/lib/types";
import PaymentDialog from "./PaymentDialog";

export default function InstallmentList({
  installments,
}: {
  installments: Installment[];
}) {
  const [selectedInstallment, setSelectedInstallment] =
    useState<Installment | null>(null);

  return (
    <>
      <Box>
        {installments.map((inst, idx) => {
          const isPaid = inst.status === "paid";
          const isOverdue = inst.is_overdue;
          const isPartial = inst.status === "partial";
          const remaining =
            Number.parseFloat(inst.amount) -
            Number.parseFloat(inst.paid_amount);

          return (
            <Box
              key={inst.id}
              sx={{
                display: "flex",
                gap: 1.5,
                px: 2,
                py: 1.75,
                borderBottom:
                  idx < installments.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
                alignItems: "center",
                transition: "background-color 0.15s ease",
                "&:hover": { bgcolor: "rgba(0,0,0,0.01)" },
              }}
            >
              {/* Timeline dot */}
              <Box sx={{ flexShrink: 0 }}>
                {isPaid ? (
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={22}
                    color="var(--mui-palette-success-main)"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={RecordIcon}
                    size={22}
                    color={
                      isOverdue
                        ? "var(--mui-palette-error-main)"
                        : isPartial
                          ? "var(--mui-palette-warning-main)"
                          : "var(--mui-palette-divider)"
                    }
                  />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Row 1: Label + Amount */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 0.75,
                    mb: 0.25,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    sx={{ flexShrink: 0 }}
                  >
                    {inst.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {formatCurrency(inst.amount)}
                  </Typography>
                </Box>

                {/* Row 2: Status info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <Chip
                    label={isOverdue ? "Overdue" : statusLabel(inst.status)}
                    size="small"
                    color={isOverdue ? "error" : statusChipColor(inst.status)}
                    variant={isPaid || isOverdue ? "filled" : "outlined"}
                    sx={{
                      height: 20,
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {isPaid
                      ? `Paid ${inst.paid_date ? formatDate(inst.paid_date) : ""}`
                      : isPartial
                        ? `${formatCurrency(inst.paid_amount)} paid · ${formatCurrency(remaining)} left`
                        : formatDate(inst.due_date)}
                  </Typography>
                </Box>
              </Box>

              {/* Action */}
              {!isPaid ? (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setSelectedInstallment(inst)}
                  sx={{
                    minWidth: 0,
                    px: 2,
                    py: 0.5,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    flexShrink: 0,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0 2px 8px rgba(13,148,136,0.3)" },
                  }}
                >
                  Pay
                </Button>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    color: "success.main",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    flexShrink: 0,
                  }}
                >
                  Paid
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {selectedInstallment && (
        <PaymentDialog
          installment={selectedInstallment}
          open={!!selectedInstallment}
          onClose={() => setSelectedInstallment(null)}
        />
      )}
    </>
  );
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    partial: "Partial",
  };
  return map[status] ?? status;
}

function statusChipColor(status: string): "default" | "success" | "warning" {
  const map: Record<string, "default" | "success" | "warning"> = {
    pending: "default",
    paid: "success",
    partial: "warning",
  };
  return map[status] ?? "default";
}
