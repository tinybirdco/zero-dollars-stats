
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import numeral from "numeral";
import { UTCDate } from "@date-fns/utc";
import { transpose } from "date-fns/transpose";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function kFormatter(value: number): string {
  return value > 999 ? `${(value / 1000).toFixed(1)}K` : String(value)
}

export function formatMinSec(totalSeconds: number) {
  if (isNaN(totalSeconds)) return '0s'

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const padTo2Digits = (value: number) => value.toString().padStart(2, '0')
  return `${minutes ? `${minutes}m` : ''} ${padTo2Digits(seconds)}s`
}

export function formatPercentage(value: number) {
  return `${value ? (value * 100).toFixed(2) : '0'}%`
}


// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(
  value: number | null | undefined,
  format = "0.[0]a"
) {
  return numeral(value ?? 0).format(format);
}

export function formatBytes(value: number | null | undefined) {
  return formatNumber(value, "0.0 b");
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : plural || singular + "s";
}

export function timeAgo(date: string) {
  return formatDistanceToNow(transpose(new Date(date), UTCDate), {
    addSuffix: true,
  });
}

export function createUniqueId() {
  return `${new Date().valueOf()}${Math.random()}`;
}

export function createShortId() {
  return createUniqueId().slice(-4);
}

export function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateRandomNumber(min = 0, max = 0) {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}

export function formatMilliseconds(ms: number): string {
  if (ms < 1000) return `${formatNumber(ms, "0.[00]a")}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${formatNumber(seconds, "0.[00]a")}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${formatNumber(minutes, "0.[00]a")}m`;
  const hours = Math.floor(minutes / 60);
  return `${formatNumber(hours, "0.[00]a")}h`;
}

export const isDevelopmentEnvironment =
  (process.env.TINYBIRD_ENV || process.env.NEXT_PUBLIC_TINYBIRD_ENV) === "dev";

export const isWadusEnvironment =
  (process.env.TINYBIRD_ENV || process.env.NEXT_PUBLIC_TINYBIRD_ENV) ===
  "wadus";

export function generateAlphanumericString(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}
