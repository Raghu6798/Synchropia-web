import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ service: string }> },
) {
  const { service } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { selectedResources } = body;

  await prisma.serviceConnection.update({
    where: {
      organizationId_service: {
        organizationId: session.user.organizationId,
        service,
      },
    },
    data: { selectedResources: JSON.stringify(selectedResources ?? []) },
  });

  return NextResponse.json({ ok: true });
}
