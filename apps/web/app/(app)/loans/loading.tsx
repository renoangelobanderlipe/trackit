import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export default function LoansLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Skeleton variant="text" width={100} height={36} sx={{ mb: 2 }} />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} variant="rounded" height={88} sx={{ mb: 1.5 }} />
      ))}
    </Container>
  );
}
