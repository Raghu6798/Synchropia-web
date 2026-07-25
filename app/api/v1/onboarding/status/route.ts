import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json({
      onboarding: false,
      step: 0,
      completed: [],
      isComplete: false,
    });
  }

  const orgId = session.user.organizationId;
  const [onboarding, connections] = await Promise.all([
    prisma.onboardingState.findUnique({ where: { organizationId: orgId } }),
    prisma.serviceConnection.findMany({ where: { organizationId: orgId } }),
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
    profile: onboarding ? { step: onboarding.currentStep } : null,
    services,
  });
}
