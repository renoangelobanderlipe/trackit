import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getLoans } from "@/app/actions/loans";
import LoanListClient from "./components/LoanListClient";

export default async function LoansPage() {
  const result = await getLoans();

  if (!result.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography color="error">Failed to load loans.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <LoanListClient loans={result.data.data} />
    </Container>
  );
}
