import React from "react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string; // accent color
  trackColor?: string; // background ring color
  centerDotColor?: string; // center dot color
}

export const Loader: React.FC<LoaderProps> = ({
  label,
  className,
  size = "md",
  color = "#2563EB", // blue-600
  trackColor = "#E5E7EB", // gray-200 for neutral track
  centerDotColor,
}) => {
  const pxSize = size === "sm" ? 24 : size === "lg" ? 48 : 32;
  const dotPx = size === "sm" ? 6 : size === "lg" ? 10 : 8;
  const ringThickness = Math.max(2, Math.round(pxSize * 0.12));

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className="relative animate-spin"
        style={{
          width: pxSize,
          height: pxSize,
          // Conic gradient for the arc + track
          background: `conic-gradient(${color} 0deg, ${color} 90deg, ${trackColor} 90deg 360deg)`,
          borderRadius: "9999px",
          boxShadow: "0 6px 20px 0 rgba(0,0,0,0.06)",
          // Mask to create a ring (cut out the center)
          WebkitMask:
            "radial-gradient(circle calc(50% - " +
            ringThickness +
            "px), transparent 99%, black 100%)",
          mask:
            "radial-gradient(circle calc(50% - " +
            ringThickness +
            "px), transparent 99%, black 100%)",
        }}
      >
        {/* Center dot (static, not spinning) */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: dotPx,
            height: dotPx,
            transform: "translate(-50%, -50%)",
            borderRadius: "9999px",
            background: centerDotColor || color,
          }}
        />
      </div>

      {label && <div className="mt-3 text-sm text-gray-600">{label}</div>}
    </div>
  );
};
