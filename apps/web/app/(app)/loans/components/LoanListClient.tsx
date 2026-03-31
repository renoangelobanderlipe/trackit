"use client";

import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Fab from "@mui/material/Fab";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";
import type { Loan } from "@/lib/types";

const statuses = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function LoanListClient({ loans }: { loans: Loan[] }) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? loans : loans.filter((l) => l.status === filter);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Loans
        </Typography>
        <TextField
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {statuses.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {filtered.length === 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              {filter === "all"
                ? "No loans yet. Tap + to create one."
                : `No ${statuses.find((s) => s.value === filter)?.label?.toLowerCase()} loans.`}
            </Typography>
          </CardContent>
        </Card>
      )}

      {filtered.map((loan) => {
        const progress =
          (Number.parseFloat(loan.total_paid) /
            Number.parseFloat(loan.total_amount)) *
          100;
        const paidCount = Math.round((progress / 100) * loan.num_installments);
        return (
          <Link
            key={loan.id}
            href={`/loans/${loan.id}`}
            style={{ textDecoration: "none" }}
          >
            <Card sx={{ mb: 1.5 }}>
              <CardActionArea>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {loan.title}
                    {loan.provider && (
                      <Chip
                        label={loan.provider}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                    <Chip
                      label={statusLabel(loan.status)}
                      size="small"
                      color={statusColor(loan.status)}
                      variant="outlined"
                    />
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{ my: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {paidCount} of {loan.num_installments} paid
                    </span>
                    {loan.next_due_date && (
                      <span>Next: {loan.next_due_date}</span>
                    )}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        );
      })}

      <Link href="/loans/new">
        <Fab color="primary" sx={{ position: "fixed", bottom: 72, right: 16 }}>
          <AddIcon />
        </Fab>
      </Link>
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

function statusColor(
  status: string,
): "default" | "primary" | "warning" | "success" {
  const map: Record<string, "default" | "primary" | "warning" | "success"> = {
    not_started: "default",
    in_progress: "warning",
    done: "success",
  };
  return map[status] ?? "default";
}
