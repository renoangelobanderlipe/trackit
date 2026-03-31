"use server";

import { rpc, rpcMutable } from "@/lib/rpc";
import type { CreateLoanPayload, Loan, LoanDetail } from "@/lib/types";

export async function getLoans() {
  return rpc<{ data: LoanDetail[] }>("/loans");
}

export async function getLoan(id: string) {
  return rpc<{ data: LoanDetail }>(`/loans/${id}`);
}

export async function createLoan(data: CreateLoanPayload) {
  return rpcMutable<{ data: LoanDetail }>("/loans", {
    method: "POST",
    body: data,
  });
}

export async function updateLoan(
  id: string,
  data: Partial<CreateLoanPayload> & { status?: string },
) {
  return rpcMutable<{ data: LoanDetail }>(`/loans/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteLoan(id: string) {
  return rpcMutable<null>(`/loans/${id}`, { method: "DELETE" });
}

export type LoanFilters = {
  status?: string;
  provider?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getLoanFilters() {
  return rpc<LoanFilters>("/loan-filters");
}

export async function saveLoanFilters(filters: LoanFilters) {
  return rpcMutable<LoanFilters>("/loan-filters", {
    method: "PUT",
    body: filters,
  });
}
