import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <div className="relative">
          <input type="checkbox" className="sr-only" ref={ref} {...props} />
          <div
            className={cn(
              "h-4 w-4 rounded border flex items-center justify-center transition-colors",
              "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
              error && "border-red-500",
              className
            )}
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            {props.checked && <Check className="h-3 w-3 text-primary" />}
          </div>
        </div>
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
