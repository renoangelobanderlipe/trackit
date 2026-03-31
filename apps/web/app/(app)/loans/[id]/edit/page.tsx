import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { getLoan } from "@/app/actions/loans";
import EditLoanForm from "./EditLoanForm";

export default async function EditLoanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLoan(id);

  if (!result.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography color="error">Loan not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Link href={`/loans/${id}`}>
          <IconButton size="small">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Edit Loan
      </Typography>
      <EditLoanForm loan={result.data.data} />
    </Container>
  );
}
