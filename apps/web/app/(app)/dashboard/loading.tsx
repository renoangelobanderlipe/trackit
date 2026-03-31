import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function DashboardLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Skeleton variant="text" width={140} height={36} sx={{ mb: 2.5 }} />
      <Skeleton
        variant="rounded"
        height={160}
        sx={{ mb: 2.5, borderRadius: 4 }}
      />
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {[0, 1, 2].map((i) => (
          <Grid key={i} size={{ xs: 4 }}>
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="text" width={160} height={28} sx={{ mb: 1 }} />
      <Skeleton
        variant="rounded"
        height={180}
        sx={{ mb: 2.5, borderRadius: 4 }}
      />
    </Container>
  );
}
