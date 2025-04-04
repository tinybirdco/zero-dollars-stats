"use client";

import { Parameter } from "@/lib/types";
import { Text } from "./Text";
import { Stack } from "./Stack";
import { Input } from "./Input";

export function EndpointParameters({
  parameters,
  onChange,
}: {
  parameters: Parameter[];
  onChange: (params: Record<string, string>) => void;
}) {
  return (
    <Stack
      direction="column"
      width="100%"
      style={{
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        border: "1px solid var(--border-02-color)",
      }}
    >
      {parameters.map((param, index) => (
        <Stack
          key={param.name}
          direction="row"
          justify="space-between"
          align="center"
          style={{
            height: 72,
            paddingLeft: 16,
            paddingRight: 16,
            borderBottom:
              index < parameters.length - 1
                ? "1px solid var(--border-01-color)"
                : "none",
          }}
          width="100%"
          gap={32}
        >
          <Stack gap={4} direction="column">
            <Text>{`${param.name}${param.required ? "*" : ""}`}</Text>
            <Text variant="caption" color="01">
              {param.type}
            </Text>
          </Stack>
          <Text style={{ flex: 1, display: "block" }}>
            {param.description || "-"}
          </Text>
          <Input
            style={{ width: "100%", maxWidth: 300 }}
            placeholder={param.default ? String(param.default) : ""}
            defaultValue={param.default ? String(param.default) : ""}
            onChange={(e) => onChange({ [param.name]: e.target.value })}
          />
        </Stack>
      ))}
    </Stack>
  );
}
