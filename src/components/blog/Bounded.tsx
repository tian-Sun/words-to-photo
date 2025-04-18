import clsx from "clsx";

export function Bounded({
  as: Comp = "div",
  size = "base",
  className,
  children,
}: {
  as?: any;
  size?: "small" | "base" | "wide" | "widest";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Comp className={clsx("px-4 py-8 md:px-6 md:py-10 lg:py-12", className)}>
      <div
        className={clsx(
          "mx-auto w-full",
          size === "small" && "max-w-xl",
          size === "base" && "max-w-3xl",
          size === "wide" && "max-w-4xl",
          size === "widest" && "max-w-6xl",
        )}
      >
        {children}
      </div>
    </Comp>
  );
} 