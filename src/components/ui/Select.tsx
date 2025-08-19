import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  error?: boolean;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, error, options, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </div>
        )}
        <select
          className={cn(
            "w-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none",
            icon ? "pl-10 pr-10" : "px-4 pr-10",
            "py-3 rounded-full",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
