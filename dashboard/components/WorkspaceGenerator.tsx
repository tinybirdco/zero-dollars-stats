import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useParams } from "next/navigation";
import { jsonFetcher } from "@/lib/fetcher";
import { Loader } from "./Loader";
import { cn, cx } from "@/lib/utils";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiErrorWarningFill,
} from "@remixicon/react";

type Deployment = {
  id: string;
  live: boolean;
};

export function WorkspaceGenerator({
  isGenerationComplete,
  onGenerationComplete,
}: {
  isGenerationComplete: boolean;
  onGenerationComplete: () => void;
}) {
  const logsRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [isCheckingDeployments, setIsCheckingDeployments] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { apiHost, userToken, workspaceToken } = useAuth();
  const { workspaceName } = useParams();

  // Add effect to auto-collapse when generation completes
  useEffect(() => {
    if (isGenerationComplete) {
      setIsCollapsed(true);
    }
  }, [isGenerationComplete]);

  const handleRetry = () => {
    setLogs([]);
    setHasError(false);
    // Reconnect websocket
    if (socketRef.current) {
      socketRef.current.close();
    }
    setConnected(false);
  };

  // Check for existing deployments first
  useEffect(() => {
    async function checkDeployments() {
      if (!workspaceToken) return;

      try {
        const response = await jsonFetcher<{ deployments: Deployment[] }>(
          apiHost,
          "/v1/deployments",
          workspaceToken
        );

        const hasLiveDeployment = response.deployments.some((d) => d.live);
        if (hasLiveDeployment) {
          console.log("Found live deployment, skipping generation");
          onGenerationComplete();
        }
        setIsCheckingDeployments(false);
      } catch (error) {
        console.error("Error checking deployments:", error);
        setIsCheckingDeployments(false);
      }
    }

    checkDeployments();
  }, [apiHost, workspaceToken, onGenerationComplete]);

  // Connect to WebSocket when component mounts and no live deployments found
  useEffect(() => {
    if (isCheckingDeployments ) return;

    // Create WebSocket connection
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws"
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "log") {
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              ...data.message.split("\n").filter((line: string) => line.trim()),
            ]);
          }, 500 + 500 * logs.length);

          // Check if the command has completed (just look for promote completion)
          if (data.message.includes("Deployed successfully")) {
            onGenerationComplete();
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    socketRef.current = socket;

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [onGenerationComplete, isCheckingDeployments]);

  useEffect(() => {
    if (logsRef.current) {
      // scrolll to the bottom smoothly
      logsRef.current.scrollTo({
        top: logsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  // Send generation command when connected and have workspace token
  useEffect(() => {
    if (
      connected &&
      workspaceToken &&
      socketRef.current?.readyState === WebSocket.OPEN &&
      workspaceName &&
      !isCheckingDeployments &&
      !hasError
    ) {
      // Get the stored prompt
      const storedPrompt = localStorage.getItem(`prompt_${workspaceName}`);
      if (!storedPrompt) {
        console.error("No prompt found for workspace:", workspaceName);
        setHasError(true);
        return;
      }

      socketRef.current.send(
        JSON.stringify({
          type: "tb_create",
          prompt: storedPrompt,
          userHost: apiHost,
          token: workspaceToken,
          userToken: userToken,
          workspaceName: workspaceName,
        })
      );
    }
  }, [
    connected,
    workspaceToken,
    apiHost,
    userToken,
    workspaceName,
    isCheckingDeployments,
    hasError,
  ]);

  return (
    <div className="pb-4 flex flex-col gap-y-3">
      <button
        className="flex items-center gap-x-0 group hover:opacity-80"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <GenerationStatus
          status={
            isCheckingDeployments
              ? "connecting"
              : hasError
              ? "error"
              : isGenerationComplete
              ? "success"
              : "loading"
          }
        />

        <RiArrowDownSLine
          size={16}
          className={cn(
            isCollapsed && "rotate-0",
            "transition-transform duration-200 rotate-180 ease-in-out"
          )}
        />
      </button>

      <div
        className={cx(
          "transition-all duration-200 ease-in-out ml-10",
          isCollapsed ? "h-0" : "h-[92px]",
          "overflow-hidden relative rounded-lg",
          hasError && "bg-red-50"
        )}
      >
        <div
          ref={logsRef}
          className="font-mono flex flex-col gap-1 h-[92px] overflow-y-scroll via-transparent rounded bg-slate-100 px-4"
        >
          {logs.map((log, index) => (
            <p
              key={`msg` + index}
              className={cx(
                "whitespace-pre-wrap text-xs text-gray-600 leading-[150%]",
                index === logs.length - 1 &&
                  !hasError &&
                  "text-gray-600 font-semibold mb-4",
                hasError && index === logs.length - 1 && "text-red-600 mb-4"
              )}
            >
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const GenerationStatus = ({
  status = "connecting",
}: {
  status: "loading" | "connecting" | "success" | "error";
}) => {
  const label = () => {
    switch (status) {
      case "loading":
        return "Generating data project…";
      case "connecting":
        return "Connecting to Tinybird…";
      case "success":
        return "Data project generated successfully!";
      case "error":
        return "Error generating data project.";
    }
  };

  const icon = () => {
    switch (status) {
      case "loading":
        return <Loader />;
      case "connecting":
        return <Loader />;
      case "success":
        return <RiCheckLine className="text-green-600 w-4 h-4" />;
      case "error":
        return <RiErrorWarningFill className="text-red-600 w-4 h-4" />;
    }
  };

  return (
    <div className="flex gap-5 items-center rounded-md px-2 py-1">
      {icon()}
      <span className="text-sm text-gray-700">{label()}</span>
    </div>
  );
};
