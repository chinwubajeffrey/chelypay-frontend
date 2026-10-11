import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "@/lib/jwt";
import { TOKEN_COOKIE } from "@/lib/config";

// Next 16 renamed middleware.ts to proxy.ts. It runs before a page renders.
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const payload = token ? decodeJwt(token) : null;
  const valid = !!payload && payload.exp * 1000 > Date.now();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (pathname.startsWith("/dashboard") && !valid) {
    const url = new URL("/login", request.url);
    if (token) url.searchParams.set("expired", "1");
    const res = NextResponse.redirect(url);
    if (token) res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  // The "expired" flag stops a redirect loop when the backend rejects a token
  // that still looks valid to us.
  if (isAuthPage && valid && !searchParams.has("expired")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
