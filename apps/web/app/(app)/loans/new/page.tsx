import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import LoanForm from "../components/LoanForm";

export default function NewLoanPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Link href="/loans">
          <IconButton size="small">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </IconButton>
        </Link>
        <Typography variant="h5">New Loan</Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 3, pl: 5.5 }}>
        Set up your loan details and payment schedule.
      </Typography>
      <LoanForm />
    </Container>
  );
}
