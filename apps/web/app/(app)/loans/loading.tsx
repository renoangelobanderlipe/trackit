import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export default function LoansLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Skeleton variant="text" width={80} height={36} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>

      {/* Loan cards */}
      {[0, 1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={72}
          sx={{ mb: 1, borderRadius: 4 }}
        />
      ))}
    </Container>
  );
}
