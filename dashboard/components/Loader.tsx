import { cn } from "@/lib/utils";
import styles from "./Loader.module.css";

export function Loader({
  className,
  color = "currentColor",
  size = 11,
  width = 1,
  style,
}: {
  className?: string;
  color?: string;
  size?: number;
  width?: number;
  style?: React.CSSProperties;
}) {
  const borderColor = `${color} transparent transparent transparent`;
  const borderWidth = `${width}px`;
  return (
    <div
      className={cn(styles.loader, className)}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      data-testid="loader"
    >
      <div
        style={{
          borderColor,
          borderWidth,
        }}
      />
      <div
        style={{
          borderColor,
          borderWidth,
        }}
      />
      <div
        style={{
          borderColor,
          borderWidth,
        }}
      />
      <div
        style={{
          borderColor,
          borderWidth,
        }}
      />
    </div>
  );
}
