import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

const Divider: React.FC<DividerProps> = ({
  className,
  orientation = "horizontal",
  size = "md",
}) => {
  const sizes = {
    sm: orientation === "horizontal" ? "h-px" : "w-px",
    md: orientation === "horizontal" ? "h-0.5" : "w-0.5",
    lg: orientation === "horizontal" ? "h-1" : "w-1",
  };

  return (
    <div
      className={cn(
        "bg-gray-200",
        sizes[size],
        orientation === "horizontal" ? "w-full" : "h-full",
        className
      )}
      style={{
        backgroundColor: "#e5e7eb",
        border: orientation === "vertical" ? "1px solid #e5e7eb" : "none",
      }}
    />
  );
};

export { Divider };
