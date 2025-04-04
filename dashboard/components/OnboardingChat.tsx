import { useGetProjectPrompt } from "@/lib/hooks/use-get-project-prompt";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChevronDownIcon } from "./Icons";
import { cn } from "@/lib/utils";
import { Loader } from "./Loader";
import { RiCheckLine } from "@remixicon/react";
import { useDatasources } from "@/lib/hooks/use-datasources";
import { useAi } from "@/lib/hooks/use-ai";
import { usePipes } from "@/lib/hooks/use-pipes";
import { DataSourcePreview } from "./DataSourcePreview";
import { EndpointsPreview } from "./EndpointPreview";
import { Button } from "./Button";

export function OnboardingChat() {
  const { prompt } = useGetProjectPrompt();
  const { workspaceToken } = useAuth();
  // this has four steps after the workspace has been generated

  // 1. start ingesting some data based on a datasource created
  //    -> a custom AI message to explain the user the datasources created
  //    -> code snippet in multiple languages + realtime preview
  // 2. link to any generated API endpoint so you can make requests
  //    -> a custom AI message to explain the user the API endpoints created
  //    -> code snippet in multiple languages + realtime check of new requests
  // 3. what next? claim this project
  //    -> link to docs
  //    -> link to dashboard
  //    -> download the code / export to github

  const [step, setStep] = useState<number>(0);

  const { data: datasources, isLoading: areDatasourcesLoading } =
    useDatasources({ enabled: true });

  const { data: datasourcesAi, isLoading: datasourcesAiLoading } = useAi(
    `Let the user know they should ingest some data. Be concise, tell them that ingesting is the next step.Talk to them about the datasources created for them: ${JSON.stringify(
      (datasources || []).map((ds) => ({ name: ds.name, sql: ds.sql }))
    )}`,
    {
      enabled: !areDatasourcesLoading && (datasources || []).length > 0,
    }
  );

  const { data: pipes, isLoading: arePipesLoading } = usePipes({
    enabled: step > 0,
  });

  const {
    data: pipesAi,
    isLoading: pipesAiLoading,
    error: pipesAiError,
  } = useAi(
    `Skip the project introduction. Let the user know they should query some data, they already know what the project is about. Be concise, tell them that querying is the next step.Talk to them about the pipes created for them: ${JSON.stringify(
      (pipes || []).map((p) => ({ name: p.name, sql: p.sql }))
    )}`,
    {
      enabled: step > 0 && !arePipesLoading && (pipes || []).length > 0,
    }
  );

  return (
    <div className="space-y-8">
      <Step
        message={datasourcesAi?.result ?? ""}
        actionComponent={
          <DataSourcePreview
            dataSourceName={datasources?.[0]?.name ?? ""}
            onComplete={() => setStep(1)}
          />
        }
        state={step > 0 ? "completed" : "pending"}
      />
      {step >= 1 ? (
        <Step
          message={pipesAi?.result ?? ""}
          actionComponent={
            pipes && pipes.length > 0 ? (
              <EndpointsPreview
                pipes={pipes ?? []}
                onComplete={() => setStep(2)}
              />
            ) : null
          }
          state={step > 1 ? "completed" : "pending"}
        />
      ) : null}
      {step >= 2 ? (
        <Step
          message="You're ready to go! Continue to Tinybird to start using your project, or download the code and go to town."
          actionComponent={<div className="flex gap-x-2">
            <Button size="medium">Continue to Tinybird</Button>
            <Button size="medium" variant="outline" color="secondary">Download code</Button>
          </div>}
          state={step > 2 ? "completed" : "pending"}
        />
      ) : null}
    </div>
  );
}

const Step = ({
  message,
  actionComponent,
  state = "pending",
}: {
  message: string;
  actionComponent: React.ReactNode;
  state: "pending" | "completed";
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (state === "completed") {
      setIsCollapsed(true);
    }
  }, [state]);

  return (
    <div>
      <ChatMessage message={message} role="assistant" />

      {/** make the action component collapse and expand based on the state  */}
      <div className="space-y-4">
        <button
          className="flex items-center gap-x-0 group hover:opacity-80 pl-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <MessageStatus status={state} />

          <ChevronDownIcon
            size={16}
            className={cn(
              isCollapsed && "rotate-0",
              "transition-transform duration-200 rotate-180 ease-in-out"
            )}
          />
        </button>

        <div
          className={cn(
            "ml-10 transition-all overflow-hidden relative duration-200",
            isCollapsed ? "h-0" : "h-auto"
          )}
        >
          {actionComponent}
        </div>
      </div>
    </div>
  );
};

const MessageStatus = ({
  status = "pending",
}: {
  status: "pending" | "completed";
}) => {
  const label = () => {
    switch (status) {
      case "pending":
        return "Waiting for new data";
      case "completed":
        return "Step completed";
    }
  };

  const icon = () => {
    switch (status) {
      case "pending":
        return <Loader />;
      case "completed":
        return <RiCheckLine className="text-green-600 w-4 h-4" />;
    }
  };

  return (
    <div className="flex gap-5 items-center rounded-md px-2 py-1">
      {icon()}
      <span className="text-sm text-gray-700">{label()}</span>
    </div>
  );
};
