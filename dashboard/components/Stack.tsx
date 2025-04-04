const SPACING_UNIT = 8;

export type StackProps = {
  children: React.ReactNode;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  spacing?: number;
  gap?: number;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  minWidth?: string | number;
  as?: React.ElementType;
  role?: React.AriaRole;
  onClick?: () => void;
  id?: string;
};

export function Stack({
  children,
  style,
  direction = "row",
  justify = "flex-start",
  align = direction === "column" ? "flex-start" : "center",
  wrap = "nowrap",
  spacing = 1,
  gap = spacing * SPACING_UNIT,
  width,
  minWidth = 0,
  as: Component = "div",
  ...props
}: StackProps) {
  return (
    <Component
      style={{
        display: "flex",
        flexDirection: direction,
        gap,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        minWidth,
        width,
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
