import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f0f9ff 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            border: "none",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>{children}</CardContent>
        </Card>
      </Container>
    </Box>
  );
}
