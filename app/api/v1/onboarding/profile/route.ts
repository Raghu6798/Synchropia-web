import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    oktaDomain,
    githubOrg,
    gitlabGroup,
    jiraDomain,
    sonarCloudOrg,
    slackWorkspace,
  } = body;

  await prisma.organization.update({
    where: { id: session.user.organizationId },
    data: { name, oktaDomain },
  });

  await prisma.onboardingState.upsert({
    where: { organizationId: session.user.organizationId },
    create: {
      organizationId: session.user.organizationId,
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
