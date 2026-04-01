"use server";

import { cookies } from "next/headers";
import { rpcMutable } from "@/lib/rpc";

export type User = {
  id: string;
  name: string;
  email: string;
};

export async function login(
  email: string,
  password: string,
  rememberMe = false,
) {
  const result = await rpcMutable<User>("/login", {
    method: "POST",
    body: { email, password },
  });

  if (result.ok) {
    const cookieStore = await cookies();
    cookieStore.set("trackit_authed", "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 28800, // 30 days or 8 hours
    });
  }

  return result;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
) {
  const result = await rpcMutable<User>("/register", {
    method: "POST",
    body: {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    },
  });

  if (result.ok) {
    const cookieStore = await cookies();
    cookieStore.set("trackit_authed", "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 28800,
    });
  }

  return result;
}

export async function getUser() {
  // Use dynamic import to avoid pulling rpcMutable into server components
  const { rpc } = await import("@/lib/rpc");
  return rpc<User>("/user");
}

export async function logout() {
  const result = await rpcMutable<null>("/logout", { method: "POST" });
  const cookieStore = await cookies();
  cookieStore.delete("trackit_authed");
  cookieStore.delete("laravel_session");
  cookieStore.delete("XSRF-TOKEN");
  return result;
}
