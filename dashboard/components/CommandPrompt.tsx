"use client";

import { useState } from "react";
import {
  RiArrowRightLine,
  RiArrowUpLine,
  RiCornerDownLeftLine,
} from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { jsonFetcher } from "@/lib/fetcher";
import { Button } from "./Button";
import { Organization, Workspace } from "@/lib/types";

const samplePrompts = [
  {
    label: "Real-time web analytics",
    prompt:
      "Create a real-time web analytics dashboard with live visitor tracking and key metrics visualization",
  },
  {
    label: "Logs explorer",
    prompt:
      "Build a logs explorer interface with search, filtering, and visualization capabilities",
  },
  {
    label: "AI model monitoring",
    prompt:
      "Develop an AI model monitoring dashboard with performance metrics and model health indicators",
  },
  {
    label: "Product metrics dashboard",
    prompt:
      "Create a product metrics dashboard showing user engagement, retention, and feature usage analytics",
  },
  {
    label: "Ad spend & conversion tracking",
    prompt:
      "Build an ad spend and conversion tracking dashboard with ROI analysis and campaign performance metrics",
  },
];

export default function CommandPrompt() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { userEmail, apiHost, userToken, organizationId, workspaceId, region } =
    useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userToken) {
      router.push("/api/login");
      return;
    }

    try {
      if (!prompt.trim() || isLoading) return;

      setIsLoading(true);

      let currentOrganizationId = organizationId;

      if (!organizationId) {
        const organizationName =
          userEmail.split("@")[0].replaceAll(".", " ").replaceAll("+", "_") +
          Math.random().toString(36).substring(2, 5);

        const organization = await jsonFetcher<Organization>(
          apiHost,
          `/v0/organizations?name=${organizationName}`,
          userToken,
          {
            method: "POST",
          }
        );

        currentOrganizationId = organization.id;
      }

      const workspaceName = await fetch("/api/ai?operation=workspace-name", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      }).then((res) => res.json());

      try {
        const searchParams = new URLSearchParams();
        const wsName =
          workspaceName?.result ?? Math.random().toString(36).substring(2, 15);
        searchParams.set("name", wsName);
        searchParams.set("assign_to_organization_id", currentOrganizationId);
        searchParams.set("from", "ui");

        // Store the prompt in localStorage
        localStorage.setItem(`prompt_${wsName}`, prompt);

        // Create workspace
        const workspace = await jsonFetcher<Workspace>(
          apiHost,
          `/v1/workspaces?${searchParams}`,
          userToken,
          {
            method: "POST",
          }
        );

        router.push(`/workspaces/${workspace.name}`);
      } catch (error) {
        console.error("Error creating workspace:", error);
      }
    } catch (error) {
      console.error("Error executing command:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto items-center">
      <form onSubmit={handleSubmit} className="mb-4 w-full">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-2 group border rounded-lg p-4  pl-5 border-gray-300 focus-within:hover:border-gray-500 focus-within:border-gray-400 transition-colors duration-200">
            <label htmlFor="prompt" className="sr-only">
              Enter your command prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border-none focus:ring-0 resize-none h-[72px] p-0 placeholder:text-gray-500/75 focus:placeholder:text-gray-500"
              placeholder="What do you want to build today?"
              disabled={isLoading}
            />

            <div className="flex items-end justify-between">
              <div className="flex items-center text-sm text-gray-500 font-medium opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 group-hover:opacity-30 group-hover:group-focus-within:opacity-100">
                <span className="flex gap-x-0.5 rounded leading-[100%] text-xs font-semibold text-gray-500 border px-1 py-0.5 mr-1.5">
                  <RiArrowUpLine size={12} />
                  Shift
                </span>{" "}
                +
                <span className="flex gap-x-0.5 rounded leading-[100%] text-xs font-semibold text-gray-500 border px-1 py-0.5 mx-1.5">
                  <RiCornerDownLeftLine size={12} />
                  Return
                </span>{" "}
                for a new line
              </div>
              <Button
                variant={!prompt.trim() ? "outline" : "solid"}
                isLoading={isLoading}
                size="large"
                color={!prompt.trim() ? "secondary" : "primary"}
                type="submit"
                className="!aspect-square !px-2.5"
                style={{
                  transition: "all 0.2s ease-in-out",
                }}
                disabled={isLoading || !prompt.trim()}
              >
                <RiArrowRightLine size={20} />
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className="text-center flex flex-wrap gap-3 w-full justify-center mt-5 max-w-xl">
        {samplePrompts.map((prompt) => (
          <Button
            key={prompt.label}
            onClick={() => setPrompt(prompt.prompt)}
            disabled={isLoading}
            variant="outline"
            color="secondary"
            size="small"
            className="!rounded-full !font-medium !text-gray-700"
          >
            {prompt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
