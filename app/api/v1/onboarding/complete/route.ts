import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.onboardingState.update({
    where: { organizationId: session.user.organizationId },
    data: { isComplete: true, completedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
