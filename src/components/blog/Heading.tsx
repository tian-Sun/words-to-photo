import clsx from "clsx";

export const Heading = ({
  as: Comp = "h1",
  size = "4xl",
  children,
  className,
}: {
  as?: any;
  size?: "4xl" | "3xl" | "2xl" | "xl";
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Comp
      className={clsx(
        "font-sans font-semibold tracking-tighter text-slate-800",
        size === "4xl" && "text-3xl md:text-4xl",
        size === "3xl" && "text-3xl",
        size === "2xl" && "text-2xl",
        size === "xl" && "text-xl",
        className,
      )}
    >
      {children}
    </Comp>
  );
}; 