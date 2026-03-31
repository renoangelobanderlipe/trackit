import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export default function LoanDetailLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* Back button */}
      <Skeleton variant="circular" width={32} height={32} sx={{ mb: 1 }} />

      {/* Hero card */}
      <Skeleton
        variant="rounded"
        height={190}
        sx={{
          mb: 2.5,
          borderRadius: 4,
          bgcolor: "rgba(13,148,136,0.08)",
        }}
      />

      {/* Info chips */}
      <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          sx={{ borderRadius: 2 }}
        />
        <Skeleton
          variant="rounded"
          width={70}
          height={24}
          sx={{ borderRadius: 2 }}
        />
        <Skeleton
          variant="rounded"
          width={110}
          height={24}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      {/* Installments label */}
      <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />

      {/* Installment rows */}
      <Skeleton variant="rounded" sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Box>
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.75,
                borderBottom: i < 3 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <Skeleton variant="circular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="50%" height={18} />
                <Skeleton variant="text" width="35%" height={14} />
              </Box>
              <Skeleton
                variant="rounded"
                width={48}
                height={28}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          ))}
        </Box>
      </Skeleton>
    </Container>
  );
}
