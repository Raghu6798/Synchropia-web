/**
 * Predefined OAuth scopes and auth URLs for each supported service.
 * The system always requests these scopes — no manual scope selection needed.
 */

export interface OAuthScope {
  scope: string;
  description: string;
  category: "read" | "write" | "admin";
}

export interface OAuthServiceConfig {
  id: string;
  label: string;
  icon: string;
  authUrl: string;
  tokenUrl: string;
  scopes: OAuthScope[];
  scopeString: string;
  docUrl: string;
  supportsSelfHosted: boolean;
}

// ── GitHub ──────────────────────────────────────────────────────
const github: OAuthServiceConfig = {
  id: "github",
  label: "GitHub",
  icon: "github",
  authUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  docUrl:
    "https://docs.github.com/en/apps/overview/permissions-required-for-github-apps",
  supportsSelfHosted: false,
  scopeString: "actions,checks,code_quality,commit_statuses,contents,deployments,issues,merge_queues,pull_requests,secret_scanning_alert_dismissal_requests,secret_scanning_alerts,secret_scanning_push_protection_bypass_requests,secrets,variables,webhooks,workflows,metadata",
  scopes: [
    { scope: "actions", description: "Read & Write: GitHub Actions workflows and runs", category: "write" },
    { scope: "checks", description: "Read & Write: Check runs and check suites", category: "write" },
    { scope: "code_quality", description: "Read & Write: Code quality and security analyses", category: "write" },
    { scope: "commit_statuses", description: "Read & Write: Commit statuses", category: "write" },
    { scope: "contents", description: "Read & Write: Repository contents, code, commits, branches", category: "write" },
    { scope: "deployments", description: "Read & Write: Deployments and environments", category: "write" },
    { scope: "issues", description: "Read & Write: Issues, comments, and milestones", category: "write" },
    { scope: "merge_queues", description: "Read & Write: Merge queues", category: "write" },
    { scope: "pull_requests", description: "Read & Write: Pull requests, reviews, and comments", category: "write" },
    { scope: "secret_scanning_alert_dismissal_requests", description: "Read & Write: Secret scanning dismissal requests", category: "write" },
    { scope: "secret_scanning_alerts", description: "Read & Write: Secret scanning alerts", category: "write" },
    { scope: "secret_scanning_push_protection_bypass_requests", description: "Read & Write: Secret scanning push protection bypass requests", category: "write" },
    { scope: "secrets", description: "Read & Write: Repository secrets", category: "admin" },
    { scope: "variables", description: "Read & Write: Repository variables", category: "write" },
    { scope: "webhooks", description: "Read & Write: Repository webhooks", category: "admin" },
    { scope: "workflows", description: "Read & Write: Actions workflow files", category: "write" },
    { scope: "metadata", description: "Read-Only (Mandatory): Repository metadata", category: "read" },
  ],
};

// ── GitLab ──────────────────────────────────────────────────────
const gitlab: OAuthServiceConfig = {
  id: "gitlab",
  label: "GitLab",
  icon: "gitlab",
  authUrl: "https://gitlab.com/oauth/authorize",
  tokenUrl: "https://gitlab.com/oauth/token",
  docUrl: "https://docs.gitlab.com/ee/api/oauth2.html",
  supportsSelfHosted: true,
  scopeString: "api,read_api,read_repository,write_repository",
  scopes: [
    {
      scope: "api",
      description: "Full API access (read/write all resources)",
      category: "admin",
    },
    {
      scope: "read_api",
      description: "Read-only API access",
      category: "read",
    },
    {
      scope: "read_repository",
      description: "Read repos, branches, commits",
      category: "read",
    },
    {
      scope: "write_repository",
      description: "Push commits, create branches and MRs",
      category: "write",
    },
  ],
};

// ── Jira (Atlassian) ────────────────────────────────────────────
const jira: OAuthServiceConfig = {
  id: "jira",
  label: "Jira",
  icon: "jira",
  authUrl: "https://auth.atlassian.com/authorize",
  tokenUrl: "https://auth.atlassian.com/oauth/token",
  docUrl:
    "https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/",
  supportsSelfHosted: false,
  scopeString:
    "read:jira-work,write:jira-work,read:jira-project,offline_access",
  scopes: [
    {
      scope: "read:jira-work",
      description: "Read issues, comments, attachments",
      category: "read",
    },
    {
      scope: "write:jira-work",
      description: "Create and update issues",
      category: "write",
    },
    {
      scope: "read:jira-project",
      description: "Read project metadata and configuration",
      category: "read",
    },
    {
      scope: "offline_access",
      description: "Refresh tokens without user interaction",
      category: "read",
    },
  ],
};

// ── SonarQube / SonarCloud ──────────────────────────────────────
const sonarqube: OAuthServiceConfig = {
  id: "sonarqube",
  label: "SonarQube",
  icon: "sonarqube",
  authUrl: "https://sonarcloud.io/oauth2/authorize",
  tokenUrl: "https://sonarcloud.io/oauth2/token",
  docUrl:
    "https://docs.sonarsource.com/sonarqube/latest/user-guide/user-token/",
  supportsSelfHosted: true,
  scopeString: "project_ANALYSIS",
  scopes: [
    {
      scope: "project_ANALYSIS",
      description: "Run and view code analyses and quality gates",
      category: "read",
    },
  ],
};

// ── Slack (Bot Token) ───────────────────────────────────────────
const slack: OAuthServiceConfig = {
  id: "slack",
  label: "Slack",
  icon: "slack",
  authUrl: "https://slack.com/oauth/v2/authorize",
  tokenUrl: "https://slack.com/api/oauth.v2.access",
  docUrl: "https://api.slack.com/authentication/oauth-v2",
  supportsSelfHosted: false,
  scopeString:
    "channels:history,channels:manage,channels:read,chat:write,chat:write.customize,groups:history,groups:read,groups:write,im:read,mpim:read,pins:write,users:read,users:read.email",
  scopes: [
    {
      scope: "channels:history",
      description:
        "View messages and other content in public channels that the bot has been added to",
      category: "read",
    },
    {
      scope: "channels:manage",
      description:
        "Manage public channels that the bot has been added to and create new ones",
      category: "admin",
    },
    {
      scope: "channels:read",
      description:
        "View basic information about public channels in a workspace",
      category: "read",
    },
    {
      scope: "chat:write",
      description: "Send messages as @bot",
      category: "write",
    },
    {
      scope: "chat:write.customize",
      description:
        "Send messages as @bot with a customized username and avatar",
      category: "write",
    },
    {
      scope: "groups:history",
      description:
        "View messages and other content in private channels that the bot has been added to",
      category: "read",
    },
    {
      scope: "groups:read",
      description:
        "View basic information about private channels that the bot has been added to",
      category: "read",
    },
    {
      scope: "groups:write",
      description:
        "Manage private channels that the bot has been added to and create new ones",
      category: "admin",
    },
    {
      scope: "im:read",
      description:
        "View basic information about direct messages that the bot has been added to",
      category: "read",
    },
    {
      scope: "mpim:read",
      description:
        "View basic information about group direct messages that the bot has been added to",
      category: "read",
    },
    {
      scope: "pins:write",
      description: "Add and remove pinned messages and files",
      category: "write",
    },
    {
      scope: "users:read",
      description: "View people in a workspace",
      category: "read",
    },
    {
      scope: "users:read.email",
      description: "View email addresses of people in a workspace",
      category: "read",
    },
  ],
};

// ── Registry ────────────────────────────────────────────────────
export const OAUTH_SERVICES: Record<string, OAuthServiceConfig> = {
  github,
  gitlab,
  jira,
  sonarqube,
  slack,
};

export function getServiceConfig(
  service: string,
): OAuthServiceConfig | undefined {
  return OAUTH_SERVICES[service];
}

export function getClientCredentials(service: string) {
  const prefix = service.toUpperCase();
  return {
    clientId: process.env[`${prefix}_OAUTH_CLIENT_ID`] || "",
    clientSecret: process.env[`${prefix}_OAUTH_CLIENT_SECRET`] || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/v1/services/${service}/callback`,
  };
}
