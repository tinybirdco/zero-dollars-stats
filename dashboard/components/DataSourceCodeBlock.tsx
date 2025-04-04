"use client";

import { useMeta, useSql } from "@/lib/sql";
import { useAuth } from "./AuthProvider";
import { CodeBlock } from "./CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { TokenUtils } from "@/lib/tokens";
import { useTokens } from "@/lib/hooks/use-tokens";
import useSWR from "swr/immutable";
import { Skeleton } from "./Skeleton";
import { useGenerateCodePrompt } from "@/lib/hooks/use-generate-code-prompt";

export function DataSourceCodeBlock({
  dataSourceName,
  withAi = true,
  apiHost,
  workspaceToken,
}: {
  dataSourceName: string;
  withAi?: boolean;
  apiHost?: string;
  workspaceToken?: string;
}) {

  const { data: columns, isLoading: isLoadingMeta } = useMeta(dataSourceName);
  const { data: records, isLoading: isLoadingSql } = useSql(
    `select * from ${dataSourceName} limit 1`
  );

  const { data, isLoading: isLoadingRecord } = useSWR<{
    result: Record<string, unknown>;
  }>(
    isLoadingMeta || isLoadingSql || records.length
      ? null
      : ["/api/ai?operation=schema", dataSourceName],
    ([path]) =>
      fetch(path, {
        method: "POST",
        body: JSON.stringify({ columns }),
      }).then((res) => res.json())
  );

  const { tokens, isLoading: isLoadingTokens } = useTokens();
  const token =
    TokenUtils.getTokenByResourceAndScope(
      tokens || [],
      dataSourceName,
      "DATASOURCES:APPEND"
    )?.token || workspaceToken;

  let sampleRecord: Record<string, unknown> = records[0] || data?.result || {};

  const { data: codePrompt } = useGenerateCodePrompt(
    "datasource",
    `curl -X POST "${apiHost}/v0/events?name=${dataSourceName}" \\
  -H "Authorization: Bearer <token>" \\
  -d '${JSON.stringify(sampleRecord)}'
  
  columns: ${JSON.stringify(columns)}
  `,
    {
      enabled: !!sampleRecord && !!columns.length && withAi,
    }
  );

  if (isLoadingMeta || isLoadingRecord || isLoadingTokens) {
    return <Skeleton height={200} width="100%" />;
  }

  sampleRecord = records[0] || data?.result || {};

  return (
    <Tabs
      style={{
        overflow: "hidden",
        backgroundColor: "var(--background-dark-color)",
        width: "100%",
      }}
      defaultValue={withAi ? "ai" : "curl"}
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
        {withAi && <TabsTrigger value="ai">AI</TabsTrigger>}
        <TabsTrigger value="curl">cURL</TabsTrigger>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      {withAi && (
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
              code={
                codePrompt?.result?.replaceAll("<token>", token ?? "") ??
                "Generating prompt…"
              }
            />
          </div>
        </TabsContent>
      )}
      <TabsContent value="curl">
        <CodeBlock
          language="bash"
          code={`curl -X POST "${apiHost}/v0/events?name=${dataSourceName}" \\
  -H "Authorization: Bearer ${token}" \\
  -d '${JSON.stringify(sampleRecord)}'`}
          lineNumbers={false}
          obfuscatedToken={token ?? undefined}
        />
      </TabsContent>
      <TabsContent value="javascript">
        <CodeBlock
          language="javascript"
          code={`const data = ${JSON.stringify(sampleRecord, null, 2)};

fetch("${apiHost}/v0/events?name=${dataSourceName}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
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

data = ${JSON.stringify(sampleRecord, null, 2)}

response = requests.post(
    "${apiHost}/v0/events?name=${dataSourceName}",
    headers={"Authorization": "Bearer ${token}"},
    json=data
)
print(response.json())`}
          lineNumbers={false}
          obfuscatedToken={token ?? undefined}
        />
      </TabsContent>
    </Tabs>
  );
}
