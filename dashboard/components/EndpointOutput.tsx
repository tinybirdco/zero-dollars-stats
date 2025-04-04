"use client";

import { Pipe } from "@/lib/types";
import { Stack } from "./Stack";
import { EndpointResponse } from "./EndpointResponse";
import { EndpointParameters } from "./EndpointParameters";
import { getParameters } from "@/lib/pipes";
import { useState } from "react";

export function EndpointOutput({ pipe }: { pipe: Pipe }) {
  const parameters = getParameters(pipe);
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <Stack direction="column" gap={0} width="100%">
      <EndpointParameters
        parameters={parameters}
        onChange={(data) =>
          setValues((curr) => ({
            ...curr,
            ...data,
          }))
        }
      />
      <EndpointResponse pipe={pipe} values={values} />
    </Stack>
  );
}
