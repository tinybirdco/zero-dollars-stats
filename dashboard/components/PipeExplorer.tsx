"use client";

import { usePipe } from "@/lib/hooks/use-pipe";
import { Pipe } from "@/lib/types";

import { EndpointCodeBlock } from "./EndpointCodeBlock";
import { EndpointOutput } from "./EndpointOutput";
import { EndpointExecutionLog } from "./EndpointExecutionLog";
import {
  PageContent,
  PageError,
  PageHeader,
  PageLoading,
  PageRoot,
  PageSection,
} from "./Page";
import { Stack } from "./Stack";
import { Text } from "./Text";

export function PipeExplorer({ pipeName }: { pipeName: string }) {
  const { data, isLoading, error } = usePipe<Pipe>(pipeName);

  if (isLoading) return <PageLoading />;
  if (error) return <PageError>Error loading pipe: {error}</PageError>;
  if (!data) return null;

  return (
    <PageRoot className="relative overflow-y-scroll border-t">
      <PageHeader>
        <Stack direction="column" spacing={0.5}>
          <Text variant="displayxsmall">{pipeName}</Text>
          <Text variant="body" color="01">
            {data?.description || "No description"}
          </Text>
        </Stack>
      </PageHeader>
      <PageContent style={{ gap: 48 }}>
        <PageSection header="How to query this endpoint">
          <EndpointCodeBlock pipeName={pipeName} withAi={false} />
        </PageSection>
        <PageSection header="Parameters and output">
          <EndpointOutput pipe={data} />
        </PageSection>
        <PageSection header="Execution Log">
          <EndpointExecutionLog pipeName={pipeName} />
        </PageSection>
      </PageContent>
    </PageRoot>
  );
}
