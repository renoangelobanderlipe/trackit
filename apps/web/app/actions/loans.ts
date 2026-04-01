"use server";

import { revalidatePath } from "next/cache";
import { rpc, rpcMutable } from "@/lib/rpc";
import type {
  CreateLoanPayload,
  LoanDetail,
  PaginatedResponse,
} from "@/lib/types";

export async function getLoans(page = 1, search?: string) {
  const params = new URLSearchParams({ page: String(page), per_page: "20" });
  if (search) params.set("search", search);
  return rpc<PaginatedResponse<LoanDetail>>(`/loans?${params}`);
}

export async function getLoan(id: string) {
  return rpc<{ data: LoanDetail }>(`/loans/${id}`);
}

export async function createLoan(data: CreateLoanPayload) {
  const result = await rpcMutable<{ data: LoanDetail }>("/loans", {
    method: "POST",
    body: data,
  });
  if (result.ok) revalidatePath("/loans");
  return result;
}

export async function updateLoan(
  id: string,
  data: Partial<CreateLoanPayload> & { status?: string },
) {
  const result = await rpcMutable<{ data: LoanDetail }>(`/loans/${id}`, {
    method: "PUT",
    body: data,
  });
  if (result.ok) {
    revalidatePath("/loans");
    revalidatePath(`/loans/${id}`);
  }
  return result;
}

export async function deleteLoan(id: string) {
  const result = await rpcMutable<null>(`/loans/${id}`, { method: "DELETE" });
  if (result.ok) revalidatePath("/loans");
  return result;
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
