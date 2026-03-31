import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function DashboardLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Skeleton variant="text" width={140} height={36} sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[0, 1, 2].map((i) => (
          <Grid key={i} size={{ xs: 4 }}>
            <Skeleton variant="rounded" height={72} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="text" width={160} height={28} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={200} sx={{ mb: 3 }} />
      <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
      {[0, 1].map((i) => (
        <Skeleton key={i} variant="rounded" height={72} sx={{ mb: 1.5 }} />
      ))}
    </Container>
  );
}
