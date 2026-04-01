"use server";

import { cookies } from "next/headers";
import { rpcMutable } from "@/lib/rpc";

export type User = {
  id: string;
  name: string;
  email: string;
};

const IS_PROD = process.env.NODE_ENV === "production";
const SESSION_COOKIE = "trackit-session";

function setAuthCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  rememberMe = false,
) {
  cookieStore.set("trackit_authed", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 28800,
  });
}

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
    setAuthCookie(await cookies(), rememberMe);
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
    setAuthCookie(await cookies());
  }

  return result;
}

export async function getUser() {
  const { rpc } = await import("@/lib/rpc");
  return rpc<User>("/user");
}

export async function logout() {
  const result = await rpcMutable<null>("/logout", { method: "POST" });
  const cookieStore = await cookies();
  cookieStore.delete("trackit_authed");
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("XSRF-TOKEN");
  return result;
}
