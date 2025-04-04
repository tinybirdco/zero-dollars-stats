import { useSql } from "@/lib/sql";
import { DataSourceCodeBlock } from "./DataSourceCodeBlock";
import { DataSourceIcon } from "./DataSourceIcon";
import { Loader } from "./Loader";
import { SqlDataTable } from "./SqlDataTable";
import { useEffect, useState } from "react";

export function DataSourcePreview({
  dataSourceName,
  onComplete,
}: {
  dataSourceName: string;
  onComplete: () => void;
}) {
  const [initialCount, setInitialCount] = useState<number | null>(null);

  const sqlData = useSql(
    `
      SELECT * FROM ${dataSourceName} LIMIT 5
    `,
    { refreshInterval: 2_000 }
  );
  

  const { data: datasourceCount } = useSql(
    `
      SELECT COUNT(*) as count FROM ${dataSourceName}
    `,
    { refreshInterval: 2_000 }
  );

  const count = datasourceCount?.[0]?.count as number;

  useEffect(() => {
    if (datasourceCount && datasourceCount?.length > 0) {
      const count = datasourceCount[0].count as number;

      if (initialCount === null) {
        setInitialCount(count);
        return;
      }

      if (count > initialCount) {
        setTimeout(() => {
          onComplete();
        }, 2_000);
      }
    }
  }, [datasourceCount, initialCount]);

  return (
    <div className="border bg-white rounded-md overflow-hidden">
      <DataSourceCodeBlock dataSourceName={dataSourceName} withAi={false} />
      <div className="py-4 px-5 flex items-center gap-x-2.5">
        <DataSourceIcon />
        <span className="text-sm font-medium block flex-1">{dataSourceName}</span>

        <span className="text-sm text-gray-600 block">
          {initialCount === null
            ? "Waiting for data..."
            : `${count} rows`}
        </span>
      </div>
      {sqlData.isLoading ? (
        <div className="py-4 px-5">
          <Loader />
        </div>
      ) : (
        <SqlDataTable {...sqlData} />
      )}
    </div>
  );
}
