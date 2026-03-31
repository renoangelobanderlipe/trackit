"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import type { Installment } from "@/lib/types";
import PaymentDialog from "./PaymentDialog";

const statusColor: Record<string, "default" | "success" | "error" | "warning"> =
  {
    pending: "default",
    paid: "success",
    overdue: "error",
    partial: "warning",
  };

export default function InstallmentList({
  installments,
}: {
  installments: Installment[];
}) {
  const [selectedInstallment, setSelectedInstallment] =
    useState<Installment | null>(null);

  return (
    <>
      <List disablePadding>
        {installments.map((inst) => (
          <ListItem
            key={inst.id}
            divider
            secondaryAction={
              inst.status !== "paid" ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedInstallment(inst)}
                >
                  Pay
                </Button>
              ) : (
                <CheckCircleIcon color="success" fontSize="small" />
              )
            }
          >
            <ListItemText
              primary={
                <>
                  {inst.label} — ₱{inst.amount}
                  <Chip
                    label={inst.is_overdue ? "overdue" : inst.status}
                    size="small"
                    color={inst.is_overdue ? "error" : statusColor[inst.status]}
                    sx={{ ml: 1 }}
                  />
                </>
              }
              secondary={
                inst.status === "paid"
                  ? `Paid ₱${inst.paid_amount} on ${inst.paid_date}`
                  : inst.status === "partial"
                    ? `Paid ₱${inst.paid_amount} — ₱${(Number.parseFloat(inst.amount) - Number.parseFloat(inst.paid_amount)).toFixed(2)} remaining`
                    : `Due ${inst.due_date}`
              }
            />
          </ListItem>
        ))}
      </List>

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
