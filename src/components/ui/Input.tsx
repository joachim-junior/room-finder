import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            icon ? "pl-10 pr-4" : "px-4",
            "py-3 rounded-full",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
          ref={ref}
          suppressHydrationWarning={true}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
