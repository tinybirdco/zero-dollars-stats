"use client";

import { textFetcher } from "@/lib/fetcher";
import { Pipe } from "@/lib/types";
import useSWR from "swr";
import { useAuth } from "./AuthProvider";
import { jsonTheme } from "@/lib/prism";
import { Highlight } from "prism-react-renderer";
import { Stack } from "./Stack";
import { Text } from "./Text";
import { Button } from "./Button";
import { PlayIcon } from "./Icons";
import { useState } from "react";

export function EndpointResponse({
  pipe,
  values,
}: {
  pipe: Pipe;
  values: Record<string, string>;
}) {
  const {
    workspaceToken,
    deploymentId,
    region: portNumber,
    apiHost,
  } = useAuth();
  const params = new URLSearchParams({
    q: "",
    pipe: pipe.name,
    format: "json",
    token: workspaceToken ?? "",
    from: "ui",
  });

  const { isLoading, error } = useSWR(
    `/examples/query.http?${params.toString()}`,
    (path) =>
      typeof workspaceToken === "string"
        ? textFetcher(apiHost, path, workspaceToken, {}, deploymentId)
        : null,
    {
      onSuccess: (data) => {
        if (data) {
          setEndpointUrl(data.replace(":8001", `:${portNumber}`));
        }
      },
    }
  );
  const [endpointUrl, setEndpointUrl] = useState<string | null>(null);

  const {
    data,
    error: errorData,
    isValidating: isLoadingData,
    mutate,
  } = useSWR(
    typeof workspaceToken === "string" ? endpointUrl || null : null,
    (path) =>
      typeof workspaceToken === "string"
        ? textFetcher(apiHost, path, workspaceToken, {}, deploymentId)
        : null
  );

  if (error || errorData) {
    return (
      <Text variant="captioncode" color="error">
        {error?.message || errorData?.message}
      </Text>
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <Stack
      gap={16}
      direction="column"
      style={{
        backgroundColor: "var(--background-01-color)",
        width: "100%",
        padding: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderBottom: "1px solid var(--border-02-color)",
        borderLeft: "1px solid var(--border-02-color)",
        borderRight: "1px solid var(--border-02-color)",
      }}
    >
      <Stack width="100%" justify="space-between" align="flex-start">
        <Text variant="caption" color="01">
          Check out our docs to learn more about customizing your response.
          Parameters with * means required.
        </Text>
        <Button
          size="small"
          onClick={() => {
            if (endpointUrl) {
              const url = new URL(endpointUrl);
              for (const key in values) {
                url.searchParams.set(key, values[key]);
              }
              if (url.toString() === endpointUrl) {
                mutate();
              } else {
                setEndpointUrl(url.toString());
              }
            }
          }}
          isLoading={isLoadingData || isLoading}
        >
          <PlayIcon />
          Run
        </Button>
      </Stack>
      <div
        style={{
          position: "relative",
          font: "var(--font-code)",
          color: "var(--tex-color)",
          width: "100%",
          padding: 0,
          flexShrink: 0,
          paddingInline: 0,
          height: 400,
          overflow: "auto",
        }}
      >
        {data ? (
          <Highlight theme={jsonTheme} code={data} language="json">
            {({ tokens, getLineProps, getTokenProps }) => {
              return (
                <pre
                  style={{
                    paddingLeft: 16,
                    paddingRight: 40,
                    paddingTop: 16,
                    paddingBottom: 16,
                    overflowX: "auto",
                    font: "var(--font-code)",
                    outline: "none",
                  }}
                >
                  {tokens.map((line, i) => {
                    return (
                      <div key={`${line}-${i}`} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span
                            key={`${key}-${token}`}
                            {...getTokenProps({
                              token,
                              style: {
                                wordWrap: "break-word",
                                whiteSpace: "pre-wrap",
                                wordBreak: "normal",
                              },
                            })}
                          />
                        ))}
                      </div>
                    );
                  })}
                </pre>
              );
            }}
          </Highlight>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Stack>
  );
}
