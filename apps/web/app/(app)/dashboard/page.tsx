import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getDashboardData } from "@/app/actions/dashboard";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (!result.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography color="error">Failed to load dashboard.</Typography>
      </Container>
    );
  }

  return <DashboardClient data={result.data} />;
}
