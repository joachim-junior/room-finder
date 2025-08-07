import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "#007bff",
  text = "Loading...",
}) => {
  const sizeClasses = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className={`spinner-border ${sizeClasses[size]}`}
        style={{ color }}
        role="status"
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <div className="mt-3 text-muted">
          <small>{text}</small>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
