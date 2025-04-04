import { theme } from "@/lib/prism";
import { Highlight } from "prism-react-renderer";
import { Text } from "./Text";
import { CopyButton } from "./CopyButton";
import { Stack } from "./Stack";

export function CodeBlock({
  language,
  code,
  obfuscatedToken,
  lineNumbers = true,
}: {
  language: string;
  code: string;
  obfuscatedToken?: string;
  lineNumbers?: boolean;
}) {
  const obfuscatedCode = obfuscatedToken
    ? code.replace(obfuscatedToken, "********")
    : code;
    
  return (
    <div
      style={{
        backgroundColor: "var(--raven)",
        position: "relative",
        font: "var(--font-code)",
        color: "var(--text-inverse-color)",
        width: "100%",
        padding: 0,
        flexShrink: 0,
        paddingInline: 0,
      }}
    >
      <Highlight theme={theme} code={obfuscatedCode} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => {
          const lineCount = tokens.length;
          const gutterPadLength = Math.max(String(lineCount).length, 2);
          return (
            <pre
              style={{
                paddingLeft: 16,
                paddingRight: 40,
                paddingTop: 16,
                paddingBottom: 16,
                overflowX: "auto",
                font: "var(--font-code)",
                outline: "none",
              }}
            >
              {tokens.map((line, i) => {
                const lineNumber = i + 1;
                const paddedLineGutter = String(lineNumber).padStart(
                  gutterPadLength,
                  " "
                );
                return (
                  <div key={`${line}-${i}`} {...getLineProps({ line })}>
                    {lineNumbers && (
                      <Text
                        color="02"
                        variant="code"
                        style={{ marginRight: 16, userSelect: "none" }}
                      >
                        {paddedLineGutter}
                      </Text>
                    )}
                    {line.map((token, key) => (
                      <span
                        key={`${key}-${token}`}
                        {...getTokenProps({
                          token,
                        })}
                      />
                    ))}
                  </div>
                );
              })}
            </pre>
          );
        }}
      </Highlight>
      <Stack
        justify="center"
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          backgroundColor: "var(--raven)",
          borderRadius: 4,
        }}
      >
        <CopyButton value={code} />
      </Stack>
    </div>
  );
}
