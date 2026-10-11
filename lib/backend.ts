import { getToken } from "@/lib/session";
import { connection } from "next/server";

// Server-only: the Express API address. No NEXT_PUBLIC_ prefix on purpose.
const API_URL = process.env.API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function messageFrom(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data.slice(0, 200);
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const k of ["message", "error", "msg"]) {
      if (typeof d[k] === "string" && d[k]) return d[k] as string;
    }
  }
  return null;
}

interface Options extends Omit<RequestInit, "headers"> {
  auth?: boolean; // attach the JWT from the cookie (default true)
}

export async function backend<T = unknown>(
  path: string,
  { auth = true, ...init }: Options = {},
): Promise<T> {
  await connection();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("You are not signed in.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Can't reach the ChelyPay server. Check that the backend is running.",
      503,
    );
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new ApiError(
      messageFrom(data) ?? `Request failed (${res.status})`,
      res.status,
    );
  }
  return data as T;
}
