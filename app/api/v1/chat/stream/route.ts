import { NextRequest, NextResponse } from "next/server";

const CORE_BACKEND_URL = process.env.CORE_BACKEND_URL || "http://127.0.0.1:8000";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstreamRes = await fetch(`${CORE_BACKEND_URL}/api/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      return new NextResponse(
        `data: ${JSON.stringify({
          event: "error",
          message: `Backend returned error ${upstreamRes.status}: ${errText}`,
        })}\n\n`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        }
      );
    }

    if (!upstreamRes.body) {
      return NextResponse.json({ error: "No response body received from swarm backend" }, { status: 502 });
    }

    // Passthrough ReadableStream to client without buffering
    const upstreamReader = upstreamRes.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await upstreamReader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (err: any) {
          const errChunk = new TextEncoder().encode(
            `data: ${JSON.stringify({
              event: "error",
              message: err?.message || "Stream read error occurred",
            })}\n\n`
          );
          controller.enqueue(errChunk);
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: any) {
    return new NextResponse(
      `data: ${JSON.stringify({
        event: "error",
        message: err?.message || "Internal server error while initiating stream proxy",
      })}\n\n`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      }
    );
  }
}
