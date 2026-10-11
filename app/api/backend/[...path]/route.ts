import { NextResponse, type NextRequest } from "next/server";
import { backend, ApiError } from "@/lib/backend";

// One gateway for all browser -> backend calls. It adds the JWT from the
// httpOnly cookie, so JavaScript in the browser never touches the token.
// Only these top-level resources are reachable; /user/* is deliberately blocked.
const ALLOWED = new Set(["account", "transaction", "Ai"]);

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!ALLOWED.has(path[0])) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const hasBody = req.method !== "GET" && req.method !== "DELETE";
  try {
    const data = await backend(`/chelypay/${path.join("/")}${req.nextUrl.search}`, {
      method: req.method,
      body: hasBody ? await req.text() : undefined,
    });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    throw e;
  }
}

export { handler as GET, handler as POST, handler as DELETE };
