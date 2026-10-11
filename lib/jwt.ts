import type { JwtPayload } from "@/types";

// Decodes (does NOT verify) a JWT payload. Safe to use in proxy.ts because it
// only needs atob. The backend is still the one that verifies the signature.
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as JwtPayload;
    return typeof payload.exp === "number" ? payload : null;
  } catch {
    return null;
  }
}
