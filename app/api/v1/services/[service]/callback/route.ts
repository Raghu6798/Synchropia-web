import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServiceConfig, getClientCredentials } from "@/lib/oauth-config";

const prisma = new PrismaClient();

interface CallbackParams {
  code?: string;
  state?: string;
  error?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ service: string }> },
) {
  const { service } = await params;
  const config = getServiceConfig(service);
  if (!config) {
    return NextResponse.json(
      { error: `Unknown service: ${service}` },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(req.url);
  const {
    code,
    state,
    error: oauthError,
  } = Object.fromEntries(searchParams) as CallbackParams;

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/onboarding?error=${oauthError}&service=${service}`, req.url),
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state parameter" },
      { status: 400 },
    );
  }

  let orgId: string;
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64").toString());
    orgId = decoded.orgId;
  } catch {
    return NextResponse.json(
      { error: "Invalid state parameter" },
      { status: 400 },
    );
  }

  const creds = getClientCredentials(service);
  if (!creds.clientId || !creds.clientSecret) {
    return NextResponse.json(
      { error: "OAuth client not configured" },
      { status: 500 },
    );
  }

  // Exchange authorization code for tokens
  const tokenBody = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    code,
    redirect_uri: creds.redirectUri,
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: tokenBody.toString(),
  });

  if (!tokenResponse.ok) {
    const errBody = await tokenResponse.text();
    return NextResponse.redirect(
      new URL(
        `/onboarding?error=token_exchange_failed&service=${service}`,
        req.url,
      ),
    );
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token ?? null;
  const expiresIn = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000)
    : null;
  const scope = tokenData.scope ?? config.scopeString;

  // Fetch external org info using the access token
  let externalOrgId: string | null = null;
  let externalOrgName: string | null = null;
  let workspaceUrl: string | null = null;

  try {
    const discovery = await discoverResources(service, accessToken);
    externalOrgId = discovery.orgId;
    externalOrgName = discovery.orgName;
    workspaceUrl = discovery.workspaceUrl;
  } catch {
    // Non-fatal — continue without discovery
  }

  // Upsert the service connection
  await prisma.serviceConnection.upsert({
    where: { organizationId_service: { organizationId: orgId, service } },
    create: {
      organizationId: orgId,
      service,
      vaultPath: `/${orgId}/${service}`,
      externalOrgId,
      externalOrgName,
      workspaceUrl,
      scope,
      expiresAt: expiresIn,
    },
    update: {
      externalOrgId,
      externalOrgName,
      workspaceUrl,
      scope,
      expiresAt: expiresIn,
    },
  });

  // Store tokens in the credential vault (Infisical)
  await storeTokensInVault(orgId, service, accessToken, refreshToken);

  // Update onboarding state
  const connectionField =
    `${service}Connected` as keyof typeof import("@prisma/client").Prisma.OnboardingStateUpdateInput;
  await prisma.onboardingState.upsert({
    where: { organizationId: orgId },
    create: {
      organizationId: orgId,
      currentStep: 1,
      completedSteps: JSON.stringify([]),
      [connectionField]: true,
    },
    update: { [connectionField]: true },
  });

  return NextResponse.redirect(
    new URL(`/onboarding?connected=${service}`, req.url),
  );
}

async function discoverResources(
  service: string,
  token: string,
): Promise<{
  orgId: string | null;
  orgName: string | null;
  workspaceUrl: string | null;
}> {
  switch (service) {
    case "github": {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      if (!res.ok) return { orgId: null, orgName: null, workspaceUrl: null };
      const data = await res.json();
      return {
        orgId: String(data.id),
        orgName: data.login,
        workspaceUrl: `https://github.com/${data.login}`,
      };
    }
    case "gitlab": {
      const res = await fetch("https://gitlab.com/api/v4/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { orgId: null, orgName: null, workspaceUrl: null };
      const data = await res.json();
      return {
        orgId: String(data.id),
        orgName: data.username,
        workspaceUrl: data.web_url,
      };
    }
    case "jira": {
      // Atlassian OAuth: discover accessible Jira sites/cloud IDs
      const res = await fetch(
        "https://api.atlassian.com/oauth/token/accessible-resources",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return { orgId: null, orgName: null, workspaceUrl: null };
      const sites: any[] = await res.json();
      if (!sites.length)
        return { orgId: null, orgName: null, workspaceUrl: null };
      const site =
        sites.find((s: any) => s.scopes?.includes("read:jira-work")) ??
        sites[0];
      return {
        orgId: site.id,
        orgName: site.name,
        workspaceUrl: `https://${site.url}`,
      };
    }
    case "slack": {
      const res = await fetch("https://slack.com/api/team.info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { orgId: null, orgName: null, workspaceUrl: null };
      const data = await res.json();
      return {
        orgId: data.team?.id ?? null,
        orgName: data.team?.name ?? null,
        workspaceUrl: data.team?.domain
          ? `https://${data.team.domain}.slack.com`
          : null,
      };
    }
    default:
      return { orgId: null, orgName: null, workspaceUrl: null };
  }
}

async function storeTokensInVault(
  orgId: string,
  service: string,
  accessToken: string,
  refreshToken: string | null,
): Promise<void> {
  const { getVault } = await import("@/lib/credential-vault");
  const vault = getVault();
  const path = `/${orgId}/${service}`;

  await vault.setSecret("access_token", accessToken, path);
  if (refreshToken) {
    await vault.setSecret("refresh_token", refreshToken, path);
  }
}
