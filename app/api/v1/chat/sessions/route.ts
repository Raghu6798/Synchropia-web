import { NextRequest, NextResponse } from "next/server";

const CORE_BACKEND_URL = process.env.CORE_BACKEND_URL || "http://127.0.0.1:8000";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id") || "";
    const orgId = searchParams.get("org_id") || "";

    const queryUrl = new URL(`${CORE_BACKEND_URL}/api/v1/sessions`);
    if (userId) queryUrl.searchParams.set("user_id", userId);
    if (orgId) queryUrl.searchParams.set("org_id", orgId);

    const res = await fetch(queryUrl.toString(), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ sessions: [] }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ sessions: data }, { status: 200 });
  } catch (err: any) {
    console.error("Failed to fetch sessions from backend:", err);
    return NextResponse.json({ sessions: [] }, { status: 200 });
  }
}
