import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </IconButton>
        </Link>
        Edit Loan
      </Typography>
      <EditLoanForm loan={result.data.data} />
    </Container>
  );
}
