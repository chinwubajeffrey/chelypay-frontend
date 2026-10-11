import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/config";
import { decodeJwt } from "@/lib/jwt";
import type { Session } from "@/types";

export async function getToken(): Promise<string | null> {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null;
}

export async function getSession(): Promise<Session | null> {
  const token = await getToken();
  const payload = token ? decodeJwt(token) : null;
  if (!payload || payload.exp * 1000 <= Date.now()) return null;
  return { id: payload.id, username: payload.username };
}
