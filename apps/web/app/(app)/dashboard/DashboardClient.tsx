"use client";

import { ArrowRight01Icon, Invoice01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import AnimatedProgress from "@/components/animations/AnimatedProgress";
import CountUp from "@/components/animations/CountUp";
import FadeIn from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerList";
import { formatCurrency, formatDate, formatDateShort } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

export default function DashboardClient({ data }: { data: DashboardData }) {
  const totalOwed = Number.parseFloat(data.total_owed);
  const totalPaid = Number.parseFloat(data.total_paid);
  const progressPercent = totalOwed > 0 ? (totalPaid / totalOwed) * 100 : 0;

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <FadeIn>
        <Typography variant="h5" sx={{ mb: 2.5 }}>
          Dashboard
        </Typography>
      </FadeIn>

      {/* Hero Card */}
      <FadeIn delay={0.1}>
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
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 140,
              height: 140,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.05)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.03)",
            }}
          />
          <CardContent sx={{ p: 2.5, position: "relative" }}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Total Outstanding
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "2rem",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              <CountUp value={totalOwed} prefix="₱" />
            </Typography>

            <AnimatedProgress
              value={progressPercent}
              sx={{
                mb: 0.75,
                height: 6,
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
              <Box sx={{ display: "flex", gap: 2.5 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem" }}
                  >
                    Paid
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      lineHeight: 1.2,
                    }}
                  >
                    <CountUp value={totalPaid} prefix="₱" delay={0.3} />
                  </Typography>
                </Box>
                {data.overdue_count > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,200,200,0.8)",
                        fontSize: "0.6rem",
                      }}
                    >
                      Overdue
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        lineHeight: 1.2,
                        color: "#fca5a5",
                      }}
                    >
                      {data.overdue_count}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem" }}
                  >
                    Active
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      lineHeight: 1.2,
                    }}
                  >
                    <CountUp value={data.active_loans_count} delay={0.5} />
                  </Typography>
                </Box>
              </Box>
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
                  {Math.round(progressPercent)}%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Upcoming Payments */}
      {data.upcoming_payments.length > 0 && (
        <FadeIn delay={0.2}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "text.secondary",
              display: "block",
              mb: 1,
            }}
          >
            Upcoming Payments
          </Typography>
          <Card sx={{ mb: 2.5 }}>
            {data.upcoming_payments.map((payment, idx) => (
              <Box
                key={payment.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderBottom:
                    idx < data.upcoming_payments.length - 1
                      ? "1px solid"
                      : "none",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: payment.is_overdue ? "error.main" : "primary.main",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    noWrap
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {payment.loan.title}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: "0.68rem" }}>
                    {payment.label} · {formatDate(payment.due_date)}
                  </Typography>
                </Box>
                <Chip
                  label={formatCurrency(payment.amount)}
                  size="small"
                  color={payment.is_overdue ? "error" : "default"}
                  variant={payment.is_overdue ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 700,
                    height: 24,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              </Box>
            ))}
          </Card>
        </FadeIn>
      )}

      {/* Active Loans — matching loan list style */}
      {data.loans_summary.length > 0 && (
        <>
          <FadeIn delay={0.3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "text.secondary",
                }}
              >
                Active Loans
              </Typography>
              <Link href="/loans" style={{ textDecoration: "none" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                  }}
                >
                  View all
                  <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                </Typography>
              </Link>
            </Box>
          </FadeIn>
          <StaggerContainer>
            {data.loans_summary.map((loan) => {
              const progress =
                (Number.parseFloat(loan.total_paid) /
                  Number.parseFloat(loan.total_amount)) *
                100;
              const paidCount = Math.round(
                (progress / 100) * loan.num_installments,
              );
              return (
                <StaggerItem key={loan.id}>
                  <Link
                    href={`/loans/${loan.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card sx={{ mb: 1 }}>
                      <CardActionArea sx={{ borderRadius: 4 }}>
                        <CardContent
                          sx={{
                            px: 2,
                            py: 1.5,
                            "&:last-child": { pb: 1.5 },
                          }}
                        >
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
                              label={`${Math.round(progress)}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: "0.6rem",
                                fontWeight: 700,
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
                              {paidCount}/{loan.num_installments} paid
                            </Typography>
                            {loan.next_due_date && (
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
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </>
      )}

      {data.active_loans_count === 0 && (
        <FadeIn delay={0.2}>
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <HugeiconsIcon
                icon={Invoice01Icon}
                size={48}
                color="var(--mui-palette-text-secondary)"
              />
              <Typography variant="body1" fontWeight={600} gutterBottom>
                No active loans
              </Typography>
              <Typography variant="body2">
                Create your first loan to start tracking!
              </Typography>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </Container>
  );
}
