import { cn } from "@/lib/utils";

interface CalloutProps {
  emoji?: string;
  children?: React.ReactNode;
  className: string;
  type?: "default" | "warning" | "danger";
}

export function Callout({
  children,
  emoji,
  type = "default",
  className,
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "px-4 py-1 text-body rounded text-sm flex items-center",
        {
          "": type === "default",
          "border-red-500": type === "danger",
          "border-yellow-100": type === "warning",
        },
        className
      )}
      {...props}
    >
      {emoji && <div className="flex items-center w-4 mr-4">{emoji}</div>}
      <div className="w-full">{children}</div>
    </div>
  );
}
