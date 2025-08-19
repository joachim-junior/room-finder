import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none",
          "px-4 py-3 rounded-lg",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        style={{
          border: "1px solid #DDDDDD",
          boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
