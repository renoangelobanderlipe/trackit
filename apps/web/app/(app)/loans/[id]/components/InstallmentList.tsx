"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { formatDate } from "@/lib/format";
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
      <Box sx={{ p: 0.5 }}>
        {installments.map((inst, idx) => {
          const isPaid = inst.status === "paid";
          const isOverdue = inst.is_overdue;
          const isPartial = inst.status === "partial";

          return (
            <Box
              key={inst.id}
              sx={{
                display: "flex",
                gap: 1.5,
                px: 1.5,
                py: 1.5,
                borderBottom:
                  idx < installments.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
                alignItems: "flex-start",
              }}
            >
              {/* Timeline dot */}
              <Box sx={{ pt: 0.3 }}>
                {isPaid ? (
                  <CheckCircleIcon
                    sx={{ fontSize: 22, color: "success.main" }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{
                      fontSize: 22,
                      color: isOverdue
                        ? "error.main"
                        : isPartial
                          ? "warning.main"
                          : "divider",
                    }}
                  />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.25,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {inst.label} — ₱{inst.amount}
                  </Typography>
                  <Chip
                    label={isOverdue ? "Overdue" : statusLabel(inst.status)}
                    size="small"
                    color={isOverdue ? "error" : statusChipColor(inst.status)}
                    variant={isPaid || isOverdue ? "filled" : "outlined"}
                    sx={{ height: 22, fontSize: "0.65rem" }}
                  />
                </Box>
                <Typography variant="caption">
                  {isPaid
                    ? `Paid ₱${inst.paid_amount} on ${inst.paid_date ? formatDate(inst.paid_date) : "—"}`
                    : isPartial
                      ? `₱${inst.paid_amount} paid · ₱${(Number.parseFloat(inst.amount) - Number.parseFloat(inst.paid_amount)).toFixed(2)} remaining`
                      : `Due ${formatDate(inst.due_date)}`}
                </Typography>
              </Box>

              {/* Action */}
              {!isPaid && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedInstallment(inst)}
                  sx={{
                    minWidth: 0,
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.7rem",
                    borderRadius: 2,
                  }}
                >
                  Pay
                </Button>
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
