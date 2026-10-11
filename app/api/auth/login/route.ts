import { NextResponse, type NextRequest } from "next/server";
import { backend, ApiError } from "@/lib/backend";
import { decodeJwt } from "@/lib/jwt";
import { TOKEN_COOKIE } from "@/lib/config";
import type { LoginResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const data = await backend<LoginResponse>("/chelypay/auth/login", {
      method: "POST",
      body: await req.text(),
      auth: false,
    });
    const token = data.accessToken;
    const payload = token ? decodeJwt(token) : null;
    if (!token || !payload) {
      return NextResponse.json(
        { success: false, message: "Login worked but no valid token came back." },
        { status: 502 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Matches the JWT's own lifetime (about 20 minutes on this backend).
      maxAge: Math.max(payload.exp - Math.floor(Date.now() / 1000), 0),
    });
    return res;
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    throw e;
  }
}
