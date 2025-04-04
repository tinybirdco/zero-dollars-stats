import { Remark } from "react-remark";
import { TinybirdWhite } from "./Icons";
import { Loader } from "./Loader";

export function ChatMessage({
  message,
  isLoading = false,
  role = "assistant",
}: {
  message: string;
  isLoading?: boolean;
  role?: "assistant" | "user";
}) {
  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col items-center">
        {role === "assistant" ? (
          <div className="flex items-center justify-center rounded-md bg-gray-900 w-8 h-8 shrink-0">
            <TinybirdWhite />
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-md bg-[var(--neutral-00-color)] border w-8 h-8 shrink-0" />
        )}
      </div>
      <article className="py-1 mb-2">
        <h5 className="text-sm font-medium mb-1">
          {role === "assistant" ? "Tinybird" : "You"}
        </h5>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="remark text-gray-700 -mb-4">
            <Remark>{message}</Remark>
          </div>
        )}
      </article>
    </div>
  );
}
