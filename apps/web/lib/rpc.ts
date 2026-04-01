import { cookies } from "next/headers";

const LARAVEL_URL = process.env.LARAVEL_URL ?? "http://localhost:8000";
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type RpcOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

type RpcResponse<T> =
  | {
      data: T;
      ok: true;
    }
  | {
      error: string;
      status: number;
      ok: false;
    };

const REQUEST_TIMEOUT = 15000; // 15 seconds

function withTimeout(ms: number): { signal: AbortSignal } {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal };
}

/**
 * Build Cookie header from cookie store using raw (decoded) values.
 * cookieStore.toString() URL-encodes values which Laravel can't decrypt.
 */
async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

/**
 * Read-only RPC call. Safe for Server Components.
 * Forwards cookies but does NOT set cookies back.
 */
export async function rpc<T>(
  path: string,
  options: RpcOptions = {},
): Promise<RpcResponse<T>> {
  const { method = "GET", body, headers = {} } = options;

  const url = `${LARAVEL_URL}/api${path}`;
  const cookieHeader = await buildCookieHeader();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: FRONTEND_URL,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    ...withTimeout(REQUEST_TIMEOUT),
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      error: text || res.statusText,
      status: res.status,
      ok: false,
    };
  }

  if (res.status === 204) {
    return { data: null as T, ok: true };
  }

  const data = (await res.json()) as T;
  return { data, ok: true };
}

/**
 * Mutable RPC call that forwards Set-Cookie headers back to browser.
 * Only use in Server Actions and Route Handlers (NOT Server Components).
 */
export async function rpcMutable<T>(
  path: string,
  options: RpcOptions = {},
): Promise<RpcResponse<T>> {
  const { method = "GET", body, headers = {} } = options;

  const url = `${LARAVEL_URL}/api${path}`;
  const cookieHeader = await buildCookieHeader();

  const cookieStore = await cookies();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: FRONTEND_URL,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...withTimeout(REQUEST_TIMEOUT),
  });

  // Store response cookies on the Next.js domain for future rpc() calls
  let setCookieHeaders: string[] = [];
  try {
    setCookieHeaders = res.headers.getSetCookie?.() ?? [];
  } catch {
    // getSetCookie may not be available in all runtimes
    const raw = res.headers.get("set-cookie");
    if (raw) setCookieHeaders = [raw];
  }
  for (const setCookie of setCookieHeaders) {
    try {
      const [nameValue] = setCookie.split(";");
      const eqIndex = nameValue.indexOf("=");
      if (eqIndex > 0) {
        const name = nameValue.slice(0, eqIndex).trim();
        const value = decodeURIComponent(nameValue.slice(eqIndex + 1));
        const isXsrf = name === "XSRF-TOKEN";
        cookieStore.set(name, value, {
          path: "/",
          httpOnly: !isXsrf, // XSRF-TOKEN must be readable by JS for double-submit pattern
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: Number(process.env.SESSION_LIFETIME ?? 120) * 60,
        });
      }
    } catch {
      // Cookie storage may fail in some contexts — non-fatal
    }
  }

  if (!res.ok) {
    const text = await res.text();
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[rpcMutable] ${method} ${path} error: ${text.slice(0, 300)}`,
      );
    }
    return {
      error: text || res.statusText,
      status: res.status,
      ok: false,
    };
  }

  if (res.status === 204) {
    return { data: null as T, ok: true };
  }

  const data = (await res.json()) as T;
  return { data, ok: true };
}
