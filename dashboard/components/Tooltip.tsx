"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import styles from "./Tooltip.module.css";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(styles.content, className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider };

export function Tooltip({
  content,
  children,
  side = "right",
  shortcut,
  asChild = true,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: TooltipPrimitive.TooltipContentProps["side"];
  shortcut?: React.ReactNode;
  asChild?: boolean;
}) {
  if (!content) {
    return children;
  }

  return (
    <TooltipRoot>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {content}
        {shortcut && (
          <div style={{ marginLeft: 4, display: "inline-flex" }}>
            {shortcut}
          </div>
        )}
      </TooltipContent>
    </TooltipRoot>
  );
}
