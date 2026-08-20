import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let orgId = session.user.organizationId;
  if (!orgId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });
    orgId = dbUser?.organizationId ?? null;
  }

  if (!orgId) {
    return NextResponse.json({ error: "Organization not found" }, { status: 400 });
  }

  await prisma.onboardingState.update({
    where: { organizationId: orgId },
    data: { isComplete: true, completedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
