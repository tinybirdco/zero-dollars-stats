"use client";

import { CodeBlock } from "./CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const SAMPLE_RECORD = {
  timestamp: "2025-03-26 10:02:15",
  event_name: "page_view",
  user_id: "abc123",
  session_id: "session_001",
  ip: "203.0.113.42",
  browser: "Chrome",
  os: "macOS",
  device: "desktop"
};

export function DataSourceCodeBlockMini({
  dataSourceName,
  apiHost,
  workspaceToken,
}: {
  dataSourceName: string;
  apiHost: string;
  workspaceToken: string;
}) {
  return (
    <Tabs
      style={{
        overflow: "hidden",
        backgroundColor: "var(--raven)",
        width: "100%",
      }}
      defaultValue="curl"
      color="dark"
    >
      <TabsList
        style={{
          borderBottom: "1px solid var(--catbird)",
          padding: 8,
          width: "100%",
          height: 40,
        }}
      >
        <TabsTrigger value="curl">cURL</TabsTrigger>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="curl">
        <CodeBlock
          language="bash"
          code={`curl -X POST "${apiHost}/v0/events?name=${dataSourceName}" \\
  -H "Authorization: Bearer ${workspaceToken}" \\
  -d '${JSON.stringify(SAMPLE_RECORD)}'`}
          lineNumbers={false}
          obfuscatedToken={""}
        />
      </TabsContent>
      <TabsContent value="javascript">
        <CodeBlock
          language="javascript"
          code={`const data = ${JSON.stringify(SAMPLE_RECORD, null, 2)};

fetch("${apiHost}/v0/events?name=${dataSourceName}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${workspaceToken}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));`}
          lineNumbers={false}
          obfuscatedToken={workspaceToken}
        />
      </TabsContent>
      <TabsContent value="python">
        <CodeBlock
          language="python"
          code={`import requests

data = ${JSON.stringify(SAMPLE_RECORD, null, 2)}

response = requests.post(
    "${apiHost}/v0/events?name=${dataSourceName}",
    headers={"Authorization": "Bearer ${workspaceToken}"},
    json=data
)
print(response.json())`}
          lineNumbers={false}
          obfuscatedToken={workspaceToken}
        />
      </TabsContent>
    </Tabs>
  );
} 