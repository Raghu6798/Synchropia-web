import InfisicalClient from "@infisical/sdk";

let _client: InfisicalClient | null = null;

function getClient(): InfisicalClient {
  if (!_client) {
    _client = new InfisicalClient({
      token: process.env.INFISICAL_TOKEN || "",
      siteUrl: process.env.INFISICAL_SITE_URL || "https://app.infisical.com",
    });
  }
  return _client;
}

export function getVault() {
  const client = getClient();
  const projectId = process.env.INFISICAL_PROJECT_ID || "";
  const environment = process.env.INFISICAL_ENVIRONMENT || "dev";

  return {
    /** Fetch a global secret from / (API keys, DB creds) */
    async getSecret(key: string): Promise<string | null> {
      try {
        const secret = await client.secrets.getSecret({
          projectId,
          environment,
          secretName: key,
          path: "/",
          includeImports: true,
        });
        return secret.secretValue;
      } catch {
        return null;
      }
    },

    /** List all secrets at a path (e.g. /{org_id}/{service}/) */
    async listSecrets(path: string): Promise<Record<string, string>> {
      try {
        const secrets = await client.secrets.listSecrets({
          projectId,
          environment,
          path,
          includeImports: true,
          recursive: false,
        });
        const map: Record<string, string> = {};
        for (const s of secrets.secrets) {
          map[s.secretKey] = s.secretValue;
        }
        return map;
      } catch {
        return {};
      }
    },

    /** Get a single OAuth token field for an org */
    async getOrgTokenField(
      orgId: string,
      service: string,
      field = "access_token",
    ): Promise<string | null> {
      return this.getSecretAtPath(field, `/${orgId}/${service}`);
    },

    /** Get all token fields for (org, service) */
    async getOrgToken(
      orgId: string,
      service: string,
    ): Promise<Record<string, string> | null> {
      const secrets = await this.listSecrets(`/${orgId}/${service}`);
      return Object.keys(secrets).length > 0 ? secrets : null;
    },

    /** Fetch a single secret at an arbitrary path */
    async getSecretAtPath(key: string, path: string): Promise<string | null> {
      try {
        const secret = await client.secrets.getSecret({
          projectId,
          environment,
          secretName: key,
          path,
          includeImports: true,
        });
        return secret.secretValue;
      } catch {
        return null;
      }
    },

    /** Create or update a secret */
    async setSecret(key: string, value: string, path = "/"): Promise<void> {
      try {
        await client.secrets.createSecret({
          projectId,
          environment,
          secretName: key,
          secretValue: value,
          path,
        });
      } catch {
        // If create fails (already exists), try update
        try {
          await client.secrets.updateSecret({
            projectId,
            environment,
            secretName: key,
            secretValue: value,
            path,
          });
        } catch (e) {
          console.error(`Failed to set secret ${key} at ${path}:`, e);
        }
      }
    },

    /** Delete a secret */
    async deleteSecret(key: string, path = "/"): Promise<void> {
      try {
        await client.secrets.deleteSecret({
          projectId,
          environment,
          secretName: key,
          path,
        });
      } catch (e) {
        console.error(`Failed to delete secret ${key} at ${path}:`, e);
      }
    },
  };
}
