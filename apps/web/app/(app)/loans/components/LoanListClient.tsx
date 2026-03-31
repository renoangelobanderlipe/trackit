"use client";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import type { LoanDetail } from "@/lib/types";

const statuses = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function LoanListClient({ loans }: { loans: LoanDetail[] }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const hasDateFilter = dateFrom && dateTo;

  // Build unique provider list from data
  const providers = [
    ...new Set(loans.map((l) => l.provider).filter(Boolean)),
  ] as string[];

  // Apply status + provider filters
  let baseFiltered = loans;
  if (statusFilter !== "all") {
    baseFiltered = baseFiltered.filter((l) => l.status === statusFilter);
  }
  if (providerFilter !== "all") {
    baseFiltered = baseFiltered.filter((l) => l.provider === providerFilter);
  }

  // Apply date range filter and compute matching installments per loan
  const filtered = hasDateFilter
    ? baseFiltered
        .map((loan) => {
          const matching = loan.installments.filter(
            (i) => i.due_date >= dateFrom && i.due_date <= dateTo,
          );
          return { loan, matching };
        })
        .filter(({ matching }) => matching.length > 0)
    : baseFiltered.map((loan) => ({ loan, matching: null }));

  // Compute date range summary
  const rangeSummary = hasDateFilter
    ? filtered.reduce(
        (acc, { matching }) => {
          const installments = matching ?? [];
          return {
            count: acc.count + installments.length,
            total:
              acc.total +
              installments.reduce(
                (sum, i) =>
                  sum +
                  (Number.parseFloat(i.amount) -
                    Number.parseFloat(i.paid_amount)),
                0,
              ),
          };
        },
        { count: 0, total: 0 },
      )
    : null;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Loans
        </Typography>
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {statuses.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
        {providers.length > 0 && (
          <TextField
            select
            size="small"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="all">All Providers</MenuItem>
            {providers.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
        <TextField
          type="date"
          size="small"
          label="From"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
        <TextField
          type="date"
          size="small"
          label="To"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1 }}
        />
        {hasDateFilter && (
          <Button
            size="small"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            sx={{ minWidth: 0, p: 0.5 }}
          >
            <ClearIcon fontSize="small" />
          </Button>
        )}
      </Box>

      {rangeSummary && (
        <Card sx={{ mb: 2, bgcolor: "primary.50" }}>
          <CardContent
            sx={{
              py: 1.5,
              "&:last-child": { pb: 1.5 },
              textAlign: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {formatCurrency(rangeSummary.total)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {rangeSummary.count} installment
              {rangeSummary.count !== 1 ? "s" : ""} due · {dateFrom} → {dateTo}
            </Typography>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              {hasDateFilter
                ? "No installments due in this date range."
                : statusFilter === "all"
                  ? "No loans yet. Tap + to create one."
                  : `No ${statuses.find((s) => s.value === statusFilter)?.label?.toLowerCase()} loans.`}
            </Typography>
          </CardContent>
        </Card>
      )}

      {filtered.map(({ loan, matching }) => {
        const progress =
          (Number.parseFloat(loan.total_paid) /
            Number.parseFloat(loan.total_amount)) *
          100;
        const paidCount = Math.round((progress / 100) * loan.num_installments);

        // When date filtered, show matching installment info instead of overall progress
        const matchInfo = matching
          ? {
              count: matching.length,
              total: matching.reduce(
                (sum, i) => sum + Number.parseFloat(i.amount),
                0,
              ),
              remaining: matching.reduce(
                (sum, i) =>
                  sum +
                  (Number.parseFloat(i.amount) -
                    Number.parseFloat(i.paid_amount)),
                0,
              ),
            }
          : null;

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
                    {matchInfo ? (
                      <>
                        <span>
                          {matchInfo.count} installment
                          {matchInfo.count !== 1 ? "s" : ""} in range
                        </span>
                        <span>{formatCurrency(matchInfo.remaining)} due</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {paidCount} of {loan.num_installments} paid
                        </span>
                        {loan.next_due_date && (
                          <span>Next: {loan.next_due_date}</span>
                        )}
                      </>
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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
