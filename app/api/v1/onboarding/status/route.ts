import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
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
    return NextResponse.json({
      onboarding: false,
      step: 0,
      completed: [],
      isComplete: false,
      profile: null,
      services: {},
    });
  }

  const [onboarding, connections, organization] = await Promise.all([
    prisma.onboardingState.findUnique({ where: { organizationId: orgId } }),
    prisma.serviceConnection.findMany({ where: { organizationId: orgId } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  const services: Record<string, { connected: boolean; orgName?: string }> = {};
  for (const conn of connections) {
    services[conn.service] = {
      connected: true,
      orgName: conn.externalOrgName ?? undefined,
    };
  }

  return NextResponse.json({
    onboarding: true,
    step: onboarding?.currentStep ?? 0,
    completed: onboarding ? JSON.parse(onboarding.completedSteps) : [],
    isComplete: onboarding?.isComplete ?? false,
    profile: organization ? { name: organization.name, oktaDomain: organization.oktaDomain } : null,
    services,
  });
}
