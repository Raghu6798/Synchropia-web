import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    oktaDomain,
  } = body;

  const userId = session.user.id;
  let orgId = session.user.organizationId;

  if (!orgId) {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    orgId = dbUser?.organizationId ?? null;
  }

  if (!orgId) {
    const newOrg = await prisma.organization.create({
      data: { name: name || "My Organization", oktaDomain },
    });
    orgId = newOrg.id;
    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: orgId, role: "owner" },
    });
  } else {
    await prisma.organization.update({
      where: { id: orgId },
      data: { name, oktaDomain },
    });
  }

  await prisma.onboardingState.upsert({
    where: { organizationId: orgId },
    create: {
      organizationId: orgId,
      currentStep: 1,
      completedSteps: JSON.stringify([0]),
    },
    update: {
      currentStep: 1,
      completedSteps: JSON.stringify([0]),
    },
  });

  return NextResponse.json({ ok: true, organizationId: orgId });
}
