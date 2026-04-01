import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export default function AccountLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Skeleton variant="text" width={100} height={36} sx={{ mb: 2.5 }} />
      <Skeleton variant="text" width={60} height={16} sx={{ mb: 1 }} />
      <Skeleton
        variant="rounded"
        height={240}
        sx={{ mb: 3, borderRadius: 4 }}
      />
      <Skeleton variant="text" width={70} height={16} sx={{ mb: 1 }} />
      <Skeleton
        variant="rounded"
        height={220}
        sx={{ mb: 3, borderRadius: 4 }}
      />
      <Skeleton variant="text" width={90} height={16} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={60} sx={{ mb: 3, borderRadius: 4 }} />
    </Container>
  );
}
