import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "lg";
};

export function Button({
  className,
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 bg-primary font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none",
        size === "lg" && "h-14 rounded-2xl text-base",
        size === "default" && "h-10 rounded-md px-4 py-2 text-sm",
        className,
      )}
      {...props}
    />
  );
}
