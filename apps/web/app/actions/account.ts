"use server";

import { revalidatePath } from "next/cache";
import { rpc, rpcMutable } from "@/lib/rpc";

export async function updateProfile(data: { name?: string; email?: string }) {
  const result = await rpcMutable<{ id: string; name: string; email: string }>(
    "/user/profile",
    { method: "PUT", body: data },
  );
  if (result.ok) revalidatePath("/account");
  return result;
}

export async function changePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return rpcMutable<{ message: string }>("/user/password", {
    method: "PUT",
    body: data,
  });
}

export async function updateTheme(theme: "light" | "dark" | "system") {
  return rpcMutable<{ theme_preference: string }>("/user/theme", {
    method: "PUT",
    body: { theme_preference: theme },
  });
}

export async function deleteAccount(password: string) {
  return rpcMutable<null>("/user", {
    method: "DELETE",
    body: { password },
  });
}

export async function getProfile() {
  return rpc<{
    id: string;
    name: string;
    email: string;
    theme_preference: string | null;
  }>("/user");
}
