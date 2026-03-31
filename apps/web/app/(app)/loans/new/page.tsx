import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import LoanForm from "../components/LoanForm";

export default function NewLoanPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Link href="/loans">
          <IconButton size="small">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        New Loan
      </Typography>
      <LoanForm />
    </Container>
  );
}
