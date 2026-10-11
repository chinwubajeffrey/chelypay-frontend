import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/config";
import { decodeJwt } from "@/lib/jwt";
import type { Session } from "@/types";

export async function getToken(): Promise<string | null> {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null;
}

// No expiry check here on purpose: proxy.ts rejects expired tokens before any
// dashboard page renders, and the backend verifies the signature on every call.
// (Date.now() is not allowed while prerendering under Cache Components.)
export async function getSession(): Promise<Session | null> {
  const token = await getToken();
  const payload = token ? decodeJwt(token) : null;
  if (!payload) return null;
  return { id: payload.id, username: payload.username };
}
