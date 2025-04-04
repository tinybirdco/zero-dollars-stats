"use client";
import { useSql } from "@/lib/sql";
import { SqlDataTable } from "./SqlDataTable";

import { Stack } from "./Stack";

export function EndpointExecutionLog({ pipeName }: { pipeName: string }) {
  const tableSql = `SELECT * FROM tinybird.pipe_stats_rt 
  where pipe_name = '${pipeName}' 
  and start_datetime > now() - interval 1 hour`;

  const { data, meta, isLoading, error } = useSql(tableSql);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 4,
        border: "1px solid var(--border-02-color)",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="column"
        style={{
          maxHeight: 400,
          width: "100%",
          borderTop: "1px solid var(--border-02-color)",
        }}
      >
        <SqlDataTable
          data={data}
          meta={meta}
          isLoading={isLoading}
          error={error}
        />
      </Stack>
    </div>
  );
}
