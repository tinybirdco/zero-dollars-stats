import React from "react";
import { useAnimatedNumber } from "@/lib/hooks/use-animated-number";

export function AnimatedCounter({
  value,
  duration = 750,
}: {
  value: number;
  duration?: number;
}) {
  const animatedValue = useAnimatedNumber(value, duration);
  const padded = animatedValue.toString().padStart(8, "0");

  return <span>{padded}</span>;
}