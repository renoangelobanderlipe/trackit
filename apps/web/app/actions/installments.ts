"use server";

import { revalidatePath } from "next/cache";
import { rpc, rpcMutable } from "@/lib/rpc";
import type {
  Installment,
  InstallmentWithLoan,
  MarkPaidPayload,
} from "@/lib/types";

export async function getUpcomingPayments() {
  return rpc<{ data: InstallmentWithLoan[] }>("/installments/upcoming");
}

export async function markInstallmentPaid(id: string, data: MarkPaidPayload) {
  const result = await rpcMutable<{ data: Installment }>(
    `/installments/${id}/pay`,
    { method: "PATCH", body: data },
  );
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/loans");
  }
  return result;
}

export async function regenerateInstallments(loanId: string) {
  const result = await rpcMutable<{ data: unknown }>(
    `/loans/${loanId}/regenerate-installments`,
    { method: "POST" },
  );
  if (result.ok) {
    revalidatePath("/loans");
  }
  return result;
}

export async function reversePayment(id: string) {
  const result = await rpcMutable<{ data: Installment }>(
    `/installments/${id}/reverse`,
    { method: "PATCH" },
  );
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/loans");
  }
  return result;
}
