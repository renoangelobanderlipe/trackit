"use server";

import { rpc, rpcMutable } from "@/lib/rpc";

export async function getTwoFactorStatus() {
  return rpc<{ enabled: boolean; confirmed: boolean }>(
    "/user/two-factor-status",
  );
}

export async function enableTwoFactor() {
  return rpcMutable<null>("/user/two-factor-authentication", {
    method: "POST",
  });
}

export async function disableTwoFactor() {
  return rpcMutable<null>("/user/two-factor-authentication", {
    method: "DELETE",
  });
}

export async function confirmTwoFactor(code: string) {
  return rpcMutable<null>("/user/confirmed-two-factor-authentication", {
    method: "POST",
    body: { code },
  });
}

export async function getTwoFactorQrCode() {
  return rpc<{ svg: string }>("/user/two-factor-qr-code");
}

export async function getTwoFactorSecretKey() {
  return rpc<{ secretKey: string }>("/user/two-factor-secret-key");
}

export async function getRecoveryCodes() {
  return rpc<string[]>("/user/two-factor-recovery-codes");
}

export async function regenerateRecoveryCodes() {
  return rpcMutable<string[]>("/user/two-factor-recovery-codes", {
    method: "POST",
  });
}

export async function confirmPassword(password: string) {
  return rpcMutable<null>("/user/confirm-password", {
    method: "POST",
    body: { password },
  });
}

export async function getConfirmedPasswordStatus() {
  return rpc<{ confirmed: boolean }>("/user/confirmed-password-status");
}
