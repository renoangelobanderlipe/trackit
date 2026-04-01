import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/loans"];
const authPaths = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth marker cookie (httpOnly, set by server actions after login/register)
  const hasSession =
    request.cookies.has("trackit_authed") &&
    request.cookies.has("laravel_session");

  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authPaths.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
