import { useSql } from "@/lib/sql";
import { EndpointCodeBlock } from "./EndpointCodeBlock";
import { SqlChart } from "./SqlChart";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./Tabs";

export function EndpointsPreview({
  pipes,
  onComplete,
}: {
  pipes: { name: string; sql: string }[];
  onComplete: () => void;
}) {
  const [selectedPipe, setSelectedPipe] = useState<string>(pipes?.[0].name);

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="flex px-4 py-3">
      <Tabs value={selectedPipe} onValueChange={setSelectedPipe}>
        <TabsList>
          {pipes.map((pipe) => (
            <TabsTrigger key={pipe.name} value={pipe.name}>
              {pipe.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      </div>

      <EndpointPreview
        key={selectedPipe}
        pipeName={selectedPipe}
        onComplete={onComplete}
      />
    </div>
  );
}

export function EndpointPreview({
  pipeName,
  onComplete,
}: {
  pipeName: string;
  onComplete: () => void;
}) {
  const { data, isLoading, error } = useSql<{
    time: string;
    total_requests: number;
  }>(
    `
    SELECT
        time,
        sum(total_requests) AS total_requests
    FROM
        (
            SELECT
                start_datetime,
                count() AS total_requests
            FROM tinybird.pipe_stats_rt
            WHERE start_datetime > now() - interval 120 minute
            AND pipe_name = '${pipeName}'
            GROUP BY start_datetime
        ) AS source
    FULL OUTER JOIN
        (
            SELECT
                toDateTime(
                    arrayJoin(
                        range(
                            toUInt32(toStartOfInterval(now() - interval 120 minute, toIntervalSecond(300))),
                            toUInt32(toStartOfInterval(now(), toIntervalSecond(300))),
                            300
                        )
                    )
                ) AS start_datetime
        ) AS period USING start_datetime
    GROUP BY toStartOfInterval(start_datetime, interval 300 second) AS time
    ORDER BY time ASC
        `,
    { refreshInterval: 2_000 }
  );

  const [initialSummaryValue, setInitialSummaryValue] = useState<number | null>(
    null
  );

  const summaryValue = (data || [])?.reduce(
    (acc, curr) => acc + curr.total_requests,
    0
  );

  useEffect(() => {
    if (initialSummaryValue === null) {
      setInitialSummaryValue(summaryValue);
      return;
    }

    if (summaryValue != initialSummaryValue) {
      setTimeout(() => {
        onComplete();
      }, 2_000);
    }
  }, [initialSummaryValue, summaryValue]);

  return (
    <div>
      <EndpointCodeBlock pipeName={pipeName} withAi={false} />
      <div className="px-4 py-5">
        <SqlChart
          data={data}
          isLoading={isLoading}
          xAxisKey="time"
          yAxisKey={"total_requests"}
          title={`Requests to ${pipeName}`}
          error={error}
          summaryValue={summaryValue}
        />
      </div>
    </div>
  );
}
