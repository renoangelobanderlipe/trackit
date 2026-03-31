"use server";

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
  return rpcMutable<{ data: Installment }>(`/installments/${id}/pay`, {
    method: "PATCH",
    body: data,
  });
}
