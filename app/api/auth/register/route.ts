import { NextResponse, type NextRequest } from "next/server";
import { backend, ApiError } from "@/lib/backend";

export async function POST(req: NextRequest) {
  try {
    const data = await backend("/chelypay/auth/register", {
      method: "POST",
      body: await req.text(),
      auth: false,
    });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ success: false, message: e.message }, { status: e.status });
    }
    throw e;
  }
}
