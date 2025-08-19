import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-background",
      outlined: "bg-background border",
      elevated: "bg-background shadow-lg",
    };

    const cardStyle =
      variant === "outlined"
        ? {
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            borderRadius: "9999px", // pill style
          }
        : variant === "elevated"
        ? {
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            borderRadius: "9999px", // pill style
          }
        : {
            borderRadius: "9999px", // pill style
          };

    return (
      <div
        className={cn("rounded-xl p-6", variants[variant], className)}
        style={cardStyle}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
