import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getLoanFilters, getLoans } from "@/app/actions/loans";
import LoanListClient from "./components/LoanListClient";

export default async function LoansPage() {
  const [loansResult, filtersResult] = await Promise.all([
    getLoans(),
    getLoanFilters(),
  ]);

  if (!loansResult.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography color="error">Failed to load loans.</Typography>
      </Container>
    );
  }

  const savedFilters = filtersResult.ok ? filtersResult.data : undefined;

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <LoanListClient
        loans={loansResult.data.data}
        savedFilters={savedFilters}
      />
    </Container>
  );
}
