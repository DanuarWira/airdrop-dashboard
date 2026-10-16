import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "tier-s"
    | "tier-a"
    | "tier-b"
    | "tier-c"
    | "emerald"
    | "blue"
    | "amber"
    | "rose"
    | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md border transition-colors",
        {
          // Semantic Tiers & Variants
          "bg-emerald-50 text-emerald-800 border-emerald-200":
            variant === "tier-s" || variant === "emerald",
          "bg-sky-50 text-sky-800 border-sky-200":
            variant === "tier-a" || variant === "blue",
          "bg-amber-50 text-amber-800 border-amber-200":
            variant === "tier-b" || variant === "amber",
          "bg-slate-100 text-slate-700 border-slate-200":
            variant === "tier-c" || variant === "neutral",
          "bg-rose-50 text-rose-800 border-rose-200":
            variant === "rose",

          // Sizes
          "text-[11px] px-2 py-0.5 leading-4": size === "sm",
          "text-xs px-2.5 py-1 leading-4": size === "md",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
