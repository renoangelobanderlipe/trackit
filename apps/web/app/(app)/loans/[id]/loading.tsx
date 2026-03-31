import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export default function LoanDetailLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Skeleton variant="circular" width={32} height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={180} height={36} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
      <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={300} />
    </Container>
  );
}
