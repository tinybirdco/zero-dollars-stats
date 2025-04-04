"use client";

import { textFetcher } from "@/lib/fetcher";
import { useAuth } from "./AuthProvider";
import useSWR from "swr";
import { Skeleton } from "./Skeleton";
import { PrismGrammar, Prism } from "prism-react-renderer";
import { CodeBlock } from "./CodeBlock";

const datasourceGrammar = {
  keyword:
    /\b(?:DESCRIPTION|SCHEMA|ENGINE|ENGINE_PARTITION_KEY|ENGINE_SORTING_KEY|ENGINE_TTL|ENGINE_VERSION|ENGINE_SIGN|IMPORT_SERVICE|EXPORT_SERVICE|SHARED_WITH)\b/,
  column: {
    pattern:
      /(`[^`]+`)\s+((?:String|UInt8|UInt16|UInt32|UInt64|Int8|Int16|Int32|Int64|Float32|Float64|Boolean|DateTime|Date|Array|Nullable|LowCardinality)(?:$$[^)]*$$)?)/,
    inside: {
      columnName: /`[^`]+`/,
      columnType:
        /\b(?:String|UInt8|UInt16|UInt32|UInt64|Int8|Int16|Int32|Int64|Float32|Float64|Boolean|DateTime|Date|Array|Nullable|LowCardinality)(?:$$[^)]*$$)?/,
    },
  },
  operator: />/,
  number: /\b\d+(?:\.\d+)?\b/,
} satisfies PrismGrammar;

(typeof global !== "undefined" ? global : window).Prism = Prism;
Prism.languages.datasource = datasourceGrammar;

export function DataSourceDataFile({
  dataSourceName,
}: {
  dataSourceName: string;
}) {
  const { apiHost, workspaceToken, deploymentId } = useAuth();
  const { isLoading, data: schema = "" } = useSWR(
    typeof workspaceToken === "string"
      ? `/v0/datasources/${dataSourceName}.datasource`
      : null,
    (path) => textFetcher(apiHost, path, workspaceToken ?? "", {}, deploymentId)
  );
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 4,
        backgroundColor: "var(--background-dark-color)",
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Skeleton height={400} />
      ) : (
        <CodeBlock code={schema.trim()} language="datasource" />
      )}
    </div>
  );
}
