"use client";

import { useParams } from "next/navigation";
import { createContext, useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { jsonFetcher } from "@/lib/fetcher";
import { useDefaultOrganization } from "@/lib/hooks/use-default-organization";

type Workspace = {
  id: string;
  name: string;
  token: string;
  plan: string;
  created_at: string;
  members: Array<{ id: string; role: string }>;
  organization: { id: string; name: string };
  max_seats: number;
};

type Entity = {
  type: "datasource" | "pipe";
  data: Record<string, unknown>;
};

type AuthState = {
  userToken: string;
  workspaceToken: string;
  workspaceId: string;
  workspaceName: string;
  organizationId: string;
};

type AuthContextType = {
  workspaceToken: string;
  userToken: string;
  region: string;
  provider: string;
  apiHost: string;
  userEmail: string;
  workspaceId: string;
  deploymentId: string;
  organizationId: string;
  currentEntity: Entity | null;
  setCurrentEntity: (entity: Entity | null) => void;
  updateWorkspaceToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  workspaceToken: null as any,
  userToken: "",
  region: "",
  provider: "",
  apiHost: "",
  userEmail: "",
  workspaceId: "",
  deploymentId: "",
  organizationId: "",
  currentEntity: null,
  setCurrentEntity: () => {},
  updateWorkspaceToken: () => {},
});

export function AuthProvider({
  children,
  userToken,
  userEmail,
  workspaceId,
  apiHost,
}: {
  children: React.ReactNode;
  userToken: string;
  userEmail: string;
  workspaceId: string;
  apiHost: string;
}) {
  const {
    provider = "gcp",
    region = "europe-west2",
    workspaceName: routeWorkspaceName,
  } = useParams();

  const defaultOrganizationId = useDefaultOrganization(apiHost, userToken);

  const workspaceParts = (routeWorkspaceName as string)?.split("~") || "";
  const workspaceName = workspaceParts[0] || "";
  const deploymentId = workspaceParts[1] || "";

  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  const { data: authState, error } = useSWR<AuthState>(
    workspaceName ? `workspace-token-${workspaceName}` : null,
    async () => {
      const token = await fetchWorkspaceToken(
        apiHost,
        userToken,
        workspaceName
      );
      return {
        userToken,
        workspaceToken: token.token,
        workspaceId,
        workspaceName,
        organizationId: token.organizationId,
      };
    },
    {
      fallbackData: {
        userToken,
        workspaceToken: null as any,
        workspaceId,
        workspaceName,
        organizationId: defaultOrganizationId ?? "",
      },
      refreshInterval: 30000, // Poll every 30 seconds
    }
  );

  // Function to update the workspace token
  const updateWorkspaceToken = (token: string) => {
    if (authState) {
      // This will trigger a revalidation
      mutate(`workspace-token-${workspaceName}`, {
        ...authState,
        workspaceToken: token,
      } as AuthState);
    }
  };

  if (error) {
    console.error("Error fetching workspace token:", error);
    return <div>Failed to load workspace</div>;
  }

  return !authState ? (
    <>loading…</>
  ) : (
    <AuthContext.Provider
      value={{
        userEmail,
        region: region as string,
        provider: provider as string,
        apiHost,
        deploymentId,
        ...authState,
        updateWorkspaceToken,
        currentEntity,
        setCurrentEntity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

async function fetchWorkspaceToken(
  apiHost: string,
  userToken: string,
  workspaceName: string | null
): Promise<{ token: string; organizationId: string }> {
  // 1. Fetch list of workspaces
  const userWithWorkspaces = await jsonFetcher<{
    workspaces: Workspace[];
  }>(apiHost, "/v1/user/workspaces", userToken);

  // 2. Find the workspace matching the name, or the first
  const workspace = userWithWorkspaces?.workspaces.find(
    (w) => w.name === workspaceName
  );

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // 3. Fetch workspace tokens
  const wsTokensResponse = await fetch(
    `${apiHost}/v0/workspaces/${workspace.id}/tokens?token=${userToken}`
  );
  const wsTokens = await wsTokensResponse.json();

  // 4. Get the first token
  const firstToken = wsTokens.tokens.find((t: { scopes: { type: string }[] }) =>
    t.scopes.some((sc) => sc.type === "ADMIN_USER")
  )?.token;

  if (!firstToken) {
    throw new Error("No tokens available for this workspace");
  }

  return {
    token: firstToken,
    organizationId: workspace.organization.id,
  };
}
