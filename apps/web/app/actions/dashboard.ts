"use server";

import { rpc } from "@/lib/rpc";
import type { DashboardData } from "@/lib/types";

export async function getDashboardData() {
  return rpc<DashboardData>("/dashboard");
}
