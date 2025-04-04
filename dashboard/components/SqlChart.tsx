"use client";

import { QueryData } from "@/lib/types/sql";
import { cn, formatBytes, formatMilliseconds, formatNumber } from "@/lib/utils";
import formatDate from "date-fns/format";
import { CSSProperties, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./Chart";
import { Skeleton } from "./Skeleton";
import styles from "./SqlChart.module.css";
import { Stack } from "./Stack";
import { Text, TextColor } from "./Text";
import { Tooltip } from "./Tooltip";

export function SqlChart({
  data,
  error,
  isLoading,
  xAxisKey,
  yAxisKey,
  color = yAxisKey === "errors" ? "#DE1616" : "#2D27F7",
  title,
  summaryValue,
  summaryValueLong,
  summaryValueColor,
  unit = "",
  tooltipDateFormat = "yyyy-MM-dd HH:mm",
  axisDateFormat = "HH:mm",
  style,
  type = "line",
  height = 240,
  allowDecimals = true,
  sqlOnExplore,
  limit,
}: {
  data: QueryData | undefined;
  error: string | undefined;
  isLoading: boolean;
  xAxisKey: string;
  yAxisKey: string | string[];
  color?: string | string[];
  title?: string | string[];
  summaryValue?: string | number | (string | number)[];
  summaryValueLong?: string | number | (string | number)[];
  summaryValueColor?: string | string[];
  unit?: string;
  variant?: "table" | "widget";
  tooltipDateFormat?: string;
  axisDateFormat?: string;
  style?: CSSProperties;
  type?: "line" | "bar";
  height?: number;
  allowDecimals?: boolean;
  sqlOnExplore?: string;
  limit?: number | number[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const yAxisKeys = Array.isArray(yAxisKey) ? yAxisKey : [yAxisKey];
  const colors = Array.isArray(color) ? color : [color, "#F9844A"];

  const parsePropsToArray = (prop?: string | number | (string | number)[]) =>
    prop !== undefined ? (Array.isArray(prop) ? prop : [prop]) : [];

  const titles = parsePropsToArray(title);
  const summaryValues = parsePropsToArray(summaryValue);
  const summaryValuesLong = parsePropsToArray(summaryValueLong);
  const summaryValuesColor = parsePropsToArray(summaryValueColor);

  const limits = Array.isArray(limit) ? limit : [limit];

  const baseStyle: CSSProperties = {
    height,
    ...style,
  };

  if (error)
    return (
      <Stack direction="column" align="center" style={baseStyle}>
        <Text
          as="p"
          variant="captioncode"
          color="error"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            wordBreak: "break-all",
          }}
        >
          {error}
        </Text>
      </Stack>
    );

  if (isLoading)
    return (
      <Skeleton style={{ ...baseStyle, border: "1px solid transparent" }} />
    );

  const limitColors = ["#DE1616", "#FF631A"];

  return (
    <Stack
      direction="column"
      gap={titles.length > 1 ? 24 : 32}
      style={baseStyle}
      className={cn(styles.sqlChartCard, sqlOnExplore && styles.clickable)}
    >
      {titles.length > 0 && (
        <Stack direction="column" gap={4} width="100%">
          {summaryValues.map((value, index) => (
            <Stack key={index} width="100%" justify="space-between" gap={16}>
              <Tooltip
                content={sqlOnExplore ? "Open in Explorations" : ""}
                side="top"
              >
                <Text
                  as={sqlOnExplore ? "button" : "span"}
                  variant="bodysemibold"
                  style={{
                    textDecoration: isHovered ? "underline" : "none",
                    cursor: sqlOnExplore ? "pointer" : "default",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {titles[index] || titles[0]}
                </Text>
              </Tooltip>
              <Tooltip content={summaryValuesLong[index]} side="top">
                <Text
                  variant="displayxsmall"
                  color={summaryValuesColor[index] as TextColor}
                  style={{ marginInlineStart: "auto" }}
                >
                  {`${value}${
                    unit === "bytes" || unit === "ms" || value === "--"
                      ? ""
                      : unit || ""
                  }`}
                </Text>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
      )}
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          font: "var(--font-caption-code)",
        }}
      >
        <ChartContainer config={{}} style={{ height: "100%", width: "100%" }}>
          {type === "line" ? (
            <AreaChart
              data={data}
              margin={{ top: 10, right: -8, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray={4}
                stroke="#ECEBFE"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={true}
                stroke="#636679"
                strokeOpacity={0.5}
                tickMargin={8}
                minTickGap={16}
                tickFormatter={(value) => {
                  try {
                    return formatDate(value, axisDateFormat);
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis
                type="number"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={true}
                tickFormatter={(value) => formatter(value, unit)}
                mirror={false}
                minTickGap={0}
                domain={[
                  0,
                  (dataMax: number) =>
                    (limits[0] ?? 0) > dataMax ? limits[0] : roundUp(dataMax),
                ]}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => formatter(Number(value), unit)}
                labelFormatter={(value) => {
                  try {
                    return `${formatDate(value, tooltipDateFormat)} (UTC)`;
                  } catch {
                    return value;
                  }
                }}
              />
              {limits &&
                limits.map((limit, index) => (
                  <ReferenceLine
                    key={index}
                    y={limit}
                    stroke={limitColors[index]}
                    strokeWidth={1}
                    strokeOpacity={1}
                    strokeDasharray="3 3"
                  />
                ))}
              {yAxisKeys.map((key, index) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="linear"
                  fill={colors[index]}
                  stroke={colors[index]}
                  fillOpacity={0.1}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 10, right: -16, left: 8, bottom: 0 }}
              barGap={0}
            >
              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray={4}
                stroke="#ECEBFE"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={true}
                stroke="#636679"
                strokeOpacity={1}
                tickMargin={8}
                minTickGap={16}
                tickFormatter={(value) => {
                  try {
                    return formatDate(value, axisDateFormat);
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis
                type="number"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={true}
                tickFormatter={(value) => formatter(value, unit)}
                mirror={false}
                minTickGap={0}
                allowDecimals={allowDecimals}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => formatter(Number(value), unit)}
                labelFormatter={(value) => {
                  try {
                    return `${formatDate(value, tooltipDateFormat)} (UTC)`;
                  } catch {
                    return value;
                  }
                }}
              />
              {yAxisKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index]}
                  opacity={0.1}
                  activeBar={
                    <SqlChartRectangle
                      stroke={colors[index]}
                      fill={colors[index]}
                    />
                  }
                  shape={
                    <SqlChartRectangle
                      stroke={colors[index]}
                      fill={yAxisKey === "errors" ? "#FDECEC12" : "#ECEBFE12"}
                    />
                  }
                />
              ))}
            </BarChart>
          )}
        </ChartContainer>
      </div>
    </Stack>
  );
}

function formatter(value: number, unit: string) {
  if (unit === "%") {
    return `${formatNumber(value, "0.[00]a")}%`;
  }

  if (unit === "ms") {
    return formatMilliseconds(value);
  }

  if (unit === "bytes") {
    return `${formatBytes(value)}`;
  }

  if (value > 0 && value < 0.001) {
    return formatNumber(value, ".[00000]");
  }

  return `${formatNumber(value, "0.[000]a")}${unit || ""}`;
}

function SqlChartRectangle(props: {
  stroke: string;
  fill: string;
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}) {
  const { x, y, width, value, stroke, fill } = props;
  return (
    <>
      {!!value && (
        <path
          d={`M ${x} ${y} h ${width}`}
          stroke={stroke}
          strokeWidth={3}
          fill="none"
        />
      )}
      <Rectangle {...props} fill={fill} stroke="none" opacity={1} />
    </>
  );
}

// When limits are set, I'm having a hard time setting the proper max value for the y-axis.
// This function rounds up the value to the nearest 10 multiple that makes sense.
// I'd love not to need this but I'm not sure how to do it otherwise with recharts.
function roundUp(value: number): number {
  // For values less than 10, return 10
  if (value < 10) {
    return 10;
  }

  // Find the magnitude (power of 10) of the value
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));

  // Calculate potential rounded values
  const normalized = value / magnitude; // Value between 1 and 9.999...

  if (normalized <= 1.2) {
    return 1.2 * magnitude;
  } else if (normalized <= 1.5) {
    return 1.5 * magnitude;
  } else if (normalized <= 2) {
    return 2 * magnitude;
  } else if (normalized <= 2.5) {
    return 2.5 * magnitude;
  } else if (normalized <= 3) {
    return 3 * magnitude;
  } else if (normalized <= 4) {
    return 4 * magnitude;
  } else if (normalized <= 5) {
    return 5 * magnitude;
  } else if (normalized <= 6) {
    return 6 * magnitude;
  } else if (normalized <= 8) {
    return 8 * magnitude;
  } else {
    return 10 * magnitude;
  }
}
