import { NextRequest, NextResponse } from "next/server";
import { getServiceConfig, getClientCredentials } from "@/lib/oauth-config";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.organizationId) {
    return NextResponse.json(
      { error: "Unauthorized — no org context" },
      { status: 401 },
    );
  }

  const creds = getClientCredentials(service);
  if (!creds.clientId) {
    return NextResponse.json(
      {
        error: `${config.label} OAuth not configured — missing ${service.toUpperCase()}_OAUTH_CLIENT_ID`,
      },
      { status: 500 },
    );
  }

  const state = Buffer.from(
    JSON.stringify({ orgId: session.user.organizationId, service }),
  ).toString("base64");

  const authParams = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: creds.redirectUri,
    response_type: "code",
    scope: config.scopeString,
    state,
  });

  if (service === "github") authParams.set("prompt", "consent");
  if (service === "jira") authParams.set("audience", "api.atlassian.com");

  const authorizeUrl = `${config.authUrl}?${authParams.toString()}`;
  return NextResponse.redirect(authorizeUrl);
}
