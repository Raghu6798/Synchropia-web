import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ service: string }> },
) {
  const { service } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken(session.user.organizationId, service);
  if (!token) {
    return NextResponse.json(
      { error: "Service not connected" },
      { status: 404 },
    );
  }

  const resources = await fetchResources(service, token);
  return NextResponse.json({ resources });
}

async function getToken(
  orgId: string,
  service: string,
): Promise<string | null> {
  const { getVault } = await import("@/lib/credential-vault");
  const vault = getVault();
  return vault.getOrgTokenField(orgId, service, "access_token");
}

async function fetchResources(service: string, token: string): Promise<any[]> {
  switch (service) {
    case "github": {
      const res = await fetch(
        "https://api.github.com/user/repos?per_page=100&type=all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      if (!res.ok) return [];
      const repos = await res.json();
      return repos.map((r: any) => ({
        id: String(r.id),
        name: r.full_name,
        type: "repository",
        visibility: r.visibility,
        language: r.language,
        updatedAt: r.updated_at,
        stars: r.stargazers_count,
      }));
    }
    case "gitlab": {
      const res = await fetch(
        "https://gitlab.com/api/v4/projects?owned=true&per_page=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return [];
      const projects = await res.json();
      return projects.map((p: any) => ({
        id: String(p.id),
        name: p.path_with_namespace,
        type: "project",
        visibility: p.visibility,
        defaultBranch: p.default_branch,
        language: p.programming_language,
      }));
    }
    case "slack": {
      const res = await fetch(
        "https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=200",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.channels || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        type: "channel",
        memberCount: c.num_members,
        topic: c.topic?.value || "",
        isPrivate: c.is_private,
      }));
    }
    case "jira": {
      const res = await fetch(
        "https://api.atlassian.com/ex/jira/d5596465-e1b1-4201-95c1-9b3a3c68a1d1/rest/api/2/project",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return [];
      const projects = await res.json();
      return projects.map((p: any) => ({
        id: p.id,
        key: p.key,
        name: p.name,
        type: "project",
        lead: p.lead?.displayName,
      }));
    }
    case "sonarqube": {
      const res = await fetch(
        "https://sonarcloud.io/api/projects/search?ps=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.components || []).map((p: any) => ({
        id: p.key,
        key: p.key,
        name: p.name,
        type: "project",
        quality: p.qualityGate,
        lastAnalysis: p.lastAnalysisDate,
      }));
    }
    default:
      return [];
  }
}
