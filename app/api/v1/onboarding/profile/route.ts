import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    oktaDomain,
  } = body;

  let orgId = session.user.organizationId;

  if (!orgId) {
    // Create new organization
    const org = await prisma.organization.create({
      data: { name, oktaDomain },
    });
    orgId = org.id;

    // Update user's organizationId
    await prisma.user.update({
      where: { id: session.user.id },
      data: { organizationId: orgId, role: "org_admin" },
    });
  } else {
    // Update existing organization
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

  return NextResponse.json({ ok: true });
}
