"use client";

import { useSql } from "@/lib/sql";
import { SqlDataTable } from "./SqlDataTable";
import { PageContent, PageHeader, PageRoot, PageSection } from "./Page";
import { Text } from "./Text";
import { DataSourceCodeBlock } from "./DataSourceCodeBlock";
import { DataSourceDataFile } from "./DataSourceDataFile";
export function DataSourceDataExplorer({
  dataSourceName,
}: {
  dataSourceName: string;
}) {
  const sqlData = useSql(`SELECT * FROM ${dataSourceName} LIMIT 100`, {
    format: "JSONStrings",
  });
  return (
    <PageRoot className="relative overflow-y-scroll border-t">
      <PageHeader>
        <Text variant="displayxsmall">{dataSourceName}</Text>
      </PageHeader>
      <PageContent style={{ gap: 48 }}>
        <PageSection header="Data preview">
          <SqlDataTable {...sqlData} />
        </PageSection>
        <PageSection header="Ingest data">
          <DataSourceCodeBlock withAi={false} dataSourceName={dataSourceName} />
        </PageSection>
        <PageSection header="Definition">
          <DataSourceDataFile dataSourceName={dataSourceName} />
        </PageSection>
      </PageContent>
    </PageRoot>
  );
}
