import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export default function DashboardLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* Title */}
      <Skeleton variant="text" width={120} height={36} sx={{ mb: 2.5 }} />

      {/* Hero card */}
      <Skeleton
        variant="rounded"
        height={170}
        sx={{
          mb: 2.5,
          borderRadius: 4,
          bgcolor: "rgba(13,148,136,0.08)",
        }}
      />

      {/* Upcoming payments label */}
      <Skeleton variant="text" width={130} height={16} sx={{ mb: 1 }} />

      {/* Upcoming payment rows */}
      <Skeleton
        variant="rounded"
        sx={{ borderRadius: 4, mb: 2.5 }}
        height={0}
      />
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            mb: i < 2 ? 0 : 2.5,
            borderBottom: i < 2 ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          <Skeleton variant="circular" width={8} height={8} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={14} />
          </Box>
          <Skeleton
            variant="rounded"
            width={60}
            height={24}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      ))}

      {/* Active loans label */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Skeleton variant="text" width={90} height={16} />
        <Skeleton variant="text" width={50} height={14} />
      </Box>

      {/* Active loan cards */}
      {[0, 1].map((i) => (
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
