import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors select-none",
          "rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          {
            // Variants
            "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:bg-emerald-800":
              variant === "primary",
            "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200":
              variant === "secondary",
            "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm":
              variant === "outline",
            "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
              variant === "ghost",
            "bg-rose-600 text-white hover:bg-rose-700 shadow-sm":
              variant === "danger",

            // Sizes
            "text-xs px-2.5 py-1.5 gap-1.5": size === "sm",
            "text-sm px-3.5 py-2 gap-2": size === "md",
            "text-base px-4 py-2.5 gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
