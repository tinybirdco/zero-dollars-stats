"use client";

import { TokenUtils } from "@/lib/tokens";
import { useAuth } from "./AuthProvider";
import { CodeBlock } from "./CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { useTokens } from "@/lib/hooks/use-tokens";
import useSWR from "swr";
import { textFetcher } from "@/lib/fetcher";
import { useState } from "react";
import { Text } from "./Text";
import { useGenerateCodePrompt } from "@/lib/hooks/use-generate-code-prompt";

export function EndpointCodeBlock({
  pipeName,
  withAi = true,
}: {
  pipeName: string;
  withAi?: boolean;
}) {
  const {
    workspaceToken,
    deploymentId,
    region: portNumber,
    apiHost,
  } = useAuth();

  const { tokens, isLoading: isLoadingTokens } = useTokens();
  const params = new URLSearchParams({
    q: "",
    pipe: pipeName,
    format: "json",
    from: "ui",
  });
  const [endpoint, setEndpoint] = useState<string | null>(null);

  const token =
    TokenUtils.getTokenByResourceAndScope(tokens ?? [], pipeName, "PIPES:READ")
      ?.token || workspaceToken;

  const { isLoading, error } = useSWR(
    isLoadingTokens && !token
      ? null
      : `/examples/query.http?${params.toString()}`,
    (path) => textFetcher(apiHost, path, token as string, {}, deploymentId),
    {
      onSuccess: (data) => {
        setEndpoint(data.replace(":8001", `:${portNumber}`));
      },
    }
  );

  const {
    data,
    error: error2,
    isLoading: isLoading2,
    isValidating: isValidating2,
  } = useSWR(
    endpoint,
    () => (endpoint ? fetch(endpoint).then((res) => res.text()) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    }
  );

  const { data: codePrompt } = useGenerateCodePrompt(
    "endpoint",
    `curl -X GET "${endpoint}" \n\n: Endpoint response example: ${data}`,
    { enabled: !!endpoint && !!data && withAi }
  );

  if (isLoading || isLoadingTokens) {
    return <div className="h-[200px] bg-gray-100"></div>;
  }

  if (error || !endpoint) {
    return (
      <Text color="error" variant="captioncode">
        {error?.message ?? "Error loading endpoint"}
      </Text>
    );
  }

  return (
    <Tabs
      style={{
        overflow: "hidden",
        backgroundColor: "var(--background-dark-color)",
        width: "100%",
      }}
      defaultValue={withAi ? "ai" : "http"}
      color="dark"
    >
      <TabsList
        style={{
          borderBottom: "1px solid var(--border-03-color)",
          padding: 8,
          width: "100%",
          height: 40,
        }}
      >
        <TabsTrigger value="ai">AI</TabsTrigger>
        <TabsTrigger value="http">HTTP</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="ai">
        <div className="max-h-[320px]">
          <div
            className="text-sm px-5 py-3 font-medium"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            Copy and paste this into your AI app to generate code.
          </div>
          <CodeBlock
            language="bash"
            code={codePrompt?.result ?? "Generating prompt…"}
            lineNumbers={false}
            obfuscatedToken={token ?? undefined}
          />
        </div>
      </TabsContent>
      <TabsContent value="http">
        <CodeBlock
          language="bash"
          code={endpoint}
          lineNumbers={false}
          obfuscatedToken={token ?? undefined}
        />
      </TabsContent>
      <TabsContent value="curl">
        <CodeBlock
          language="bash"
          code={`curl -X GET "${endpoint}"`}
          lineNumbers={false}
          obfuscatedToken={token ?? undefined}
        />
      </TabsContent>
      <TabsContent value="javascript">
        <CodeBlock
          language="javascript"
          code={`fetch("${endpoint}")
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));`}
          lineNumbers={false}
          obfuscatedToken={token ?? undefined}
        />
      </TabsContent>
      <TabsContent value="python">
        <CodeBlock
          language="python"
          code={`import requests

response = requests.get(
    "${endpoint}"
)
print(response.json())`}
          lineNumbers={false}
          obfuscatedToken={token ?? undefined}
        />
      </TabsContent>
    </Tabs>
  );
}
