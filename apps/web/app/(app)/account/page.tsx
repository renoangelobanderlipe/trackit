import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getProfile } from "@/app/actions/account";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const result = await getProfile();

  if (!result.ok) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography color="error">Failed to load profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <AccountClient user={result.data} />
    </Container>
  );
}
