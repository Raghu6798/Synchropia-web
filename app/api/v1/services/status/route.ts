import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json({ services: {} });
  }

  const connections = await prisma.serviceConnection.findMany({
    where: { organizationId: session.user.organizationId },
  });

  const services: Record<string, any> = {};
  for (const conn of connections) {
    services[conn.service] = {
      connected: true,
      externalOrgName: conn.externalOrgName,
      workspaceUrl: conn.workspaceUrl,
      scope: conn.scope,
      selectedResources: conn.selectedResources
        ? JSON.parse(conn.selectedResources)
        : [],
      expiresAt: conn.expiresAt?.toISOString() ?? null,
    };
  }

  return NextResponse.json({ services });
}
