import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (!result.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography color="error">Failed to load dashboard.</Typography>
      </Container>
    );
  }

  const data = result.data;

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 4 }}>
          <Card>
            <CardContent
              sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}
            >
              <Typography variant="h5" fontWeight={700}>
                {data.active_loans_count}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card>
            <CardContent
              sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}
            >
              <Typography variant="h6" fontWeight={700} color="error.main">
                {formatCurrency(data.total_owed)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Owed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card>
            <CardContent
              sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}
            >
              <Typography variant="h6" fontWeight={700} color="success.main">
                {formatCurrency(data.total_paid)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {data.upcoming_payments.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Upcoming Payments
          </Typography>
          <Card sx={{ mb: 3 }}>
            <List disablePadding>
              {data.upcoming_payments.map((payment) => (
                <ListItem key={payment.id} divider>
                  <ListItemText
                    primary={payment.loan.title}
                    secondary={`${payment.label} · Due ${payment.due_date}`}
                  />
                  <Chip
                    label={formatCurrency(payment.amount)}
                    size="small"
                    color={payment.is_overdue ? "error" : "default"}
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </>
      )}

      {data.loans_summary.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Active Loans
          </Typography>
          {data.loans_summary.map((loan) => {
            const progress =
              (Number.parseFloat(loan.total_paid) /
                Number.parseFloat(loan.total_amount)) *
              100;
            return (
              <Card key={loan.id} sx={{ mb: 1.5 }}>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography variant="body1" fontWeight={600}>
                    {loan.title}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{ my: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(loan.total_paid)} /{" "}
                    {formatCurrency(loan.total_amount)}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}

      {data.active_loans_count === 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              No active loans. Create one to get started!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

function formatCurrency(value: string): string {
  const num = Number.parseFloat(value);
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
