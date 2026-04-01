"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import FadeIn from "@/components/animations/FadeIn";
import { formatCurrency } from "@/lib/format";
import type { LoanBreakdown, MonthlyPayment } from "@/lib/types";

const CHART_COLORS = [
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("default", { month: "short" });
}

export default function DashboardCharts({
  monthlyPayments,
  loanBreakdown,
}: {
  monthlyPayments: MonthlyPayment[];
  loanBreakdown: LoanBreakdown[];
}) {
  const theme = useTheme();
  const textColor = theme.palette.text.secondary;

  if (!monthlyPayments?.length && (!loanBreakdown || loanBreakdown.length <= 1))
    return null;

  return (
    <>
      {monthlyPayments?.length > 0 && (
        <FadeIn delay={0.3}>
          <SectionLabel label="Payment History" />
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <BarChart
                height={220}
                series={[
                  {
                    data: monthlyPayments.map((p) =>
                      Number.parseFloat(p.total),
                    ),
                    color: "#0d9488",
                    valueFormatter: (v) =>
                      v != null ? formatCurrency(String(v)) : "",
                  },
                ]}
                xAxis={[
                  {
                    data: monthlyPayments.map((p) => formatMonth(p.month)),
                    scaleType: "band",
                    tickLabelStyle: {
                      fill: textColor,
                      fontSize: 11,
                    },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fill: textColor,
                      fontSize: 11,
                    },
                  },
                ]}
                margin={{ top: 10, bottom: 30, left: 60, right: 10 }}
                hideLegend
              />
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {loanBreakdown?.length > 1 && (
        <FadeIn delay={0.4}>
          <SectionLabel label="Balance by Loan" />
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <PieChart
                  height={220}
                  width={320}
                  series={[
                    {
                      data: loanBreakdown.map((l, i) => ({
                        id: i,
                        value: Number.parseFloat(l.remaining),
                        label: l.title,
                        color: CHART_COLORS[i % CHART_COLORS.length],
                      })),
                      innerRadius: 50,
                      paddingAngle: 2,
                      cornerRadius: 4,
                      valueFormatter: (v) => formatCurrency(String(v.value)),
                    },
                  ]}
                  margin={{ top: 10, bottom: 10, left: 10, right: 120 }}
                />
              </Box>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Typography
      component="h2"
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
      {label}
    </Typography>
  );
}
