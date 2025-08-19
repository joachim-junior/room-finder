import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full";

    const variants = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
      outline:
        "border bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary",
      ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-primary",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 py-3 text-base",
    };

    const buttonStyle =
      variant === "outline"
        ? {
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }
        : {
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={buttonStyle}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
