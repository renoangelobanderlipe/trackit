"use client";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AnimatedProgress from "@/components/animations/AnimatedProgress";
import CountUp from "@/components/animations/CountUp";
import FadeIn from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerList";
import { formatCurrency, formatDate } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

export default function DashboardClient({ data }: { data: DashboardData }) {
  const totalOwed = Number.parseFloat(data.total_owed);
  const totalPaid = Number.parseFloat(data.total_paid);

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
            background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5 }}
            >
              Total Outstanding
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              <CountUp value={totalOwed} prefix="₱" />
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Paid
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  <CountUp value={totalPaid} prefix="₱" delay={0.3} />
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Active Loans
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  <CountUp value={data.active_loans_count} delay={0.5} />
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Quick Stats */}
      <StaggerContainer>
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 4 }}>
            <StaggerItem>
              <Card sx={{ textAlign: "center" }}>
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 0.5,
                      width: 36,
                      height: 36,
                      bgcolor: "primary.light",
                      color: "primary.dark",
                    }}
                  >
                    <ReceiptLongIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                    <CountUp value={data.active_loans_count} delay={0.2} />
                  </Typography>
                  <Typography variant="caption">Active</Typography>
                </CardContent>
              </Card>
            </StaggerItem>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <StaggerItem>
              <Card sx={{ textAlign: "center" }}>
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 0.5,
                      width: 36,
                      height: 36,
                      bgcolor: "error.light",
                      color: "error.dark",
                    }}
                  >
                    <TrendingDownIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                    <CountUp value={totalOwed} prefix="₱" delay={0.3} />
                  </Typography>
                  <Typography variant="caption">Owed</Typography>
                </CardContent>
              </Card>
            </StaggerItem>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <StaggerItem>
              <Card sx={{ textAlign: "center" }}>
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 0.5,
                      width: 36,
                      height: 36,
                      bgcolor: "success.light",
                      color: "success.dark",
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                    <CountUp value={totalPaid} prefix="₱" delay={0.4} />
                  </Typography>
                  <Typography variant="caption">Paid</Typography>
                </CardContent>
              </Card>
            </StaggerItem>
          </Grid>
        </Grid>
      </StaggerContainer>

      {/* Upcoming Payments */}
      {data.upcoming_payments.length > 0 && (
        <FadeIn delay={0.3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Upcoming Payments
          </Typography>
          <Card sx={{ mb: 2.5 }}>
            <List disablePadding>
              {data.upcoming_payments.map((payment, idx) => (
                <ListItem
                  key={payment.id}
                  divider={idx < data.upcoming_payments.length - 1}
                  sx={{ px: 2, py: 1.5 }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: payment.is_overdue
                          ? "error.light"
                          : "primary.light",
                        color: payment.is_overdue
                          ? "error.dark"
                          : "primary.dark",
                      }}
                    >
                      {payment.loan.title.slice(0, 2).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {payment.loan.title}
                      </Typography>
                    }
                    secondary={`${payment.label} · Due ${formatDate(payment.due_date)}`}
                  />
                  <Chip
                    label={formatCurrency(payment.amount)}
                    size="small"
                    color={payment.is_overdue ? "error" : "default"}
                    variant={payment.is_overdue ? "filled" : "outlined"}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </FadeIn>
      )}

      {/* Active Loans */}
      {data.loans_summary.length > 0 && (
        <>
          <FadeIn delay={0.4}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Active Loans
            </Typography>
          </FadeIn>
          <StaggerContainer>
            {data.loans_summary.map((loan) => {
              const progress =
                (Number.parseFloat(loan.total_paid) /
                  Number.parseFloat(loan.total_amount)) *
                100;
              return (
                <StaggerItem key={loan.id}>
                  <Card sx={{ mb: 1.5 }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 11,
                              fontWeight: 700,
                              bgcolor: "primary.light",
                              color: "primary.dark",
                            }}
                          >
                            {loan.title.slice(0, 2).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {loan.title}
                          </Typography>
                        </Box>
                        <Typography variant="caption">
                          {Math.round(progress)}%
                        </Typography>
                      </Box>
                      <AnimatedProgress value={progress} />
                      <Typography
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {formatCurrency(loan.total_paid)} /{" "}
                        {formatCurrency(loan.total_amount)}
                      </Typography>
                    </CardContent>
                  </Card>
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
              <AccountBalanceIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
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
