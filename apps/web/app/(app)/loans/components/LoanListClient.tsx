"use client";

import {
  Cancel01Icon,
  FilterHorizontalIcon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { type LoanFilters, saveLoanFilters } from "@/app/actions/loans";
import AnimatedProgress from "@/components/animations/AnimatedProgress";
import FadeIn from "@/components/animations/FadeIn";
import PulsingFab from "@/components/animations/PulsingFab";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerList";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { LoanDetail } from "@/lib/types";

const statuses = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

type Props = {
  loans: LoanDetail[];
  savedFilters?: LoanFilters;
};

export default function LoanListClient({ loans, savedFilters }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState(
    savedFilters?.status ?? "all",
  );
  const [providerFilter, setProviderFilter] = useState(
    savedFilters?.provider ?? "all",
  );
  const [dateFrom, setDateFrom] = useState(savedFilters?.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(savedFilters?.dateTo ?? "");

  const hasDateFilter = dateFrom && dateTo;
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (providerFilter !== "all" ? 1 : 0) +
    (hasDateFilter ? 1 : 0);

  const providers = [
    ...new Set(loans.map((l) => l.provider).filter(Boolean)),
  ] as string[];

  // Apply filters
  let baseFiltered = loans;
  if (statusFilter !== "all") {
    baseFiltered = baseFiltered.filter((l) => l.status === statusFilter);
  }
  if (providerFilter !== "all") {
    baseFiltered = baseFiltered.filter((l) => l.provider === providerFilter);
  }

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

  function persistFilters(
    s = statusFilter,
    p = providerFilter,
    df = dateFrom,
    dt = dateTo,
  ) {
    saveLoanFilters({
      status: s,
      provider: p,
      dateFrom: df,
      dateTo: dt,
    });
  }

  function clearAllFilters() {
    setStatusFilter("all");
    setProviderFilter("all");
    setDateFrom("");
    setDateTo("");
    persistFilters("all", "all", "", "");
  }

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Loans</Typography>
        <IconButton onClick={() => setDrawerOpen(true)}>
          <Badge
            badgeContent={activeFilterCount}
            color="primary"
            invisible={activeFilterCount === 0}
          >
            <HugeiconsIcon icon={FilterHorizontalIcon} size={20} />
          </Badge>
        </IconButton>
      </Box>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2 }}>
          {statusFilter !== "all" && (
            <Chip
              label={statuses.find((s) => s.value === statusFilter)?.label}
              size="small"
              onDelete={() => {
                setStatusFilter("all");
                persistFilters("all", providerFilter, dateFrom, dateTo);
              }}
              color="primary"
              variant="outlined"
            />
          )}
          {providerFilter !== "all" && (
            <Chip
              label={providerFilter}
              size="small"
              onDelete={() => {
                setProviderFilter("all");
                persistFilters(statusFilter, "all", dateFrom, dateTo);
              }}
              color="primary"
              variant="outlined"
            />
          )}
          {hasDateFilter && (
            <Chip
              label={`${formatDateShort(dateFrom)} → ${formatDateShort(dateTo)}`}
              size="small"
              onDelete={() => {
                setDateFrom("");
                setDateTo("");
                persistFilters(statusFilter, providerFilter, "", "");
              }}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Range Summary */}
      {rangeSummary && (
        <Card
          sx={{
            mb: 2,
            border: "none",
            background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
          }}
        >
          <CardContent
            sx={{
              py: 2,
              "&:last-child": { pb: 2 },
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={800} color="primary.main">
              {formatCurrency(rangeSummary.total)}
            </Typography>
            <Typography variant="caption">
              {rangeSummary.count} installment
              {rangeSummary.count !== 1 ? "s" : ""} due in range
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filtered.length === 0 && !rangeSummary && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <HugeiconsIcon
              icon={Invoice01Icon}
              size={48}
              color="var(--mui-palette-text-secondary)"
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {activeFilterCount > 0 ? "No matching loans" : "No loans yet"}
            </Typography>
            <Typography variant="body2">
              {activeFilterCount > 0
                ? "Try adjusting your filters."
                : "Tap + to create your first loan."}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Loan Cards */}
      <StaggerContainer>
        {filtered.map(({ loan, matching }) => {
          const progress =
            (Number.parseFloat(loan.total_paid) /
              Number.parseFloat(loan.total_amount)) *
            100;
          const paidCount = Math.round(
            (progress / 100) * loan.num_installments,
          );

          const matchInfo = matching
            ? {
                count: matching.length,
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
            <StaggerItem key={loan.id}>
              <Link
                href={`/loans/${loan.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card sx={{ mb: 1 }}>
                  <CardActionArea sx={{ borderRadius: 4 }}>
                    <CardContent
                      sx={{ px: 2, py: 1.5, "&:last-child": { pb: 1.5 } }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                            noWrap
                            sx={{ fontSize: "0.85rem" }}
                          >
                            {loan.title}
                          </Typography>
                          <Chip
                            label={statusLabel(loan.status)}
                            size="small"
                            color={statusColor(loan.status)}
                            variant={
                              loan.status === "done" ? "filled" : "outlined"
                            }
                            sx={{
                              height: 20,
                              fontSize: "0.6rem",
                              flexShrink: 0,
                              "& .MuiChip-label": { px: 0.75 },
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.25,
                          }}
                        >
                          {loan.provider && (
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.68rem", flexShrink: 0 }}
                            >
                              {loan.provider}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.68rem",
                              color: "text.disabled",
                            }}
                          >
                            {matchInfo
                              ? `${matchInfo.count} in range · ${formatCurrency(matchInfo.remaining)}`
                              : `${paidCount}/${loan.num_installments} paid`}
                          </Typography>
                          {!matchInfo && loan.next_due_date && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.68rem",
                                color: "text.disabled",
                                ml: "auto",
                              }}
                            >
                              {formatDateShort(loan.next_due_date)}
                            </Typography>
                          )}
                        </Box>
                        <AnimatedProgress
                          value={progress}
                          sx={{ mt: 0.75, height: 4 }}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <PulsingFab href="/loans/new" />

      {/* Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Handle — fixed top */}
        <Box sx={{ pt: 1.5, pb: 1, flexShrink: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              bgcolor: "divider",
              borderRadius: 2,
              mx: "auto",
            }}
          />
        </Box>

        {/* Header — fixed top */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            pb: 2,
            flexShrink: 0,
          }}
        >
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </IconButton>
        </Box>

        {/* Scrollable content */}
        <Box sx={{ overflowY: "auto", flex: 1, px: 2.5 }}>
          {/* Status */}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              display: "block",
              color: "text.primary",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Status
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            {statuses.map((s) => (
              <Chip
                key={s.value}
                label={s.label}
                size="small"
                variant={statusFilter === s.value ? "filled" : "outlined"}
                color={statusFilter === s.value ? "primary" : "default"}
                onClick={() => setStatusFilter(s.value)}
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: "0.73rem",
                  height: 36,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  ...(statusFilter === s.value && {
                    boxShadow: "0 2px 8px rgba(13,148,136,0.3)",
                  }),
                  "&:hover": {
                    transform: "translateY(-1px)",
                  },
                }}
              />
            ))}
          </Box>

          {/* Provider */}
          {providers.length > 0 && (
            <>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  display: "block",
                  color: "text.primary",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Provider
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  mb: 3,
                  mx: -2.5,
                  px: 2.5,
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  "&::-webkit-scrollbar": { display: "none" },
                  // Fade edges to hint scrollability
                  maskImage:
                    providers.length > 4
                      ? "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)"
                      : "none",
                }}
              >
                <Chip
                  label="All"
                  size="small"
                  variant={providerFilter === "all" ? "filled" : "outlined"}
                  color={providerFilter === "all" ? "primary" : "default"}
                  onClick={() => setProviderFilter("all")}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.73rem",
                    height: 32,
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-1px)" },
                  }}
                />
                {providers.map((p) => (
                  <Chip
                    key={p}
                    label={p}
                    size="small"
                    variant={providerFilter === p ? "filled" : "outlined"}
                    color={providerFilter === p ? "primary" : "default"}
                    onClick={() => setProviderFilter(p)}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.73rem",
                      height: 32,
                      flexShrink: 0,
                      scrollSnapAlign: "start",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      ...(providerFilter === p && {
                        boxShadow: "0 2px 8px rgba(13,148,136,0.3)",
                      }),
                      "&:hover": { transform: "translateY(-1px)" },
                    }}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Date Range */}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              display: "block",
              color: "text.primary",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mb: 1,
            }}
          >
            Date Range
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
            <DatePicker
              label="From"
              value={dateFrom ? dayjs(dateFrom) : null}
              onChange={(val) =>
                setDateFrom(val ? val.format("YYYY-MM-DD") : "")
              }
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            <DatePicker
              label="To"
              value={dateTo ? dayjs(dateTo) : null}
              onChange={(val) => setDateTo(val ? val.format("YYYY-MM-DD") : "")}
              minDate={dateFrom ? dayjs(dateFrom) : undefined}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Box>
        </Box>

        {/* Actions — fixed bottom */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            px: 2.5,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              clearAllFilters();
              setDrawerOpen(false);
            }}
            sx={{ borderRadius: 3, py: 1.25 }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              persistFilters();
              setDrawerOpen(false);
            }}
            sx={{ borderRadius: 3, py: 1.25 }}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
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
