import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { getLoan } from "@/app/actions/loans";
import LoanDetailClient from "./components/LoanDetailClient";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLoan(id);

  if (!result.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Link href="/loans">
          <IconButton size="small">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </IconButton>
        </Link>
        <Typography color="error" sx={{ mt: 1 }}>
          Loan not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Link href="/loans">
        <IconButton size="small" sx={{ mb: 1 }}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </IconButton>
      </Link>
      <LoanDetailClient loan={result.data.data} />
    </Container>
  );
}
