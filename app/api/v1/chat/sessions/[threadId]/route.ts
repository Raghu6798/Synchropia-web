import { NextRequest, NextResponse } from "next/server";

const CORE_BACKEND_URL = process.env.CORE_BACKEND_URL || "http://127.0.0.1:8000";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await context.params;

    const res = await fetch(`${CORE_BACKEND_URL}/api/v1/sessions/${threadId}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          id: threadId,
          title: "New Conversation",
          messages: [],
          runs: [],
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Failed to fetch session detail:", err);
    return NextResponse.json(
      {
        id: "",
        title: "New Conversation",
        messages: [],
        runs: [],
      },
      { status: 200 }
    );
  }
}
