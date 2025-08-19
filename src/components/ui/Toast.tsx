import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast with a small delay for smooth animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide toast after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for fade out animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-700";
      case "error":
        return "bg-red-50 text-red-700";
      case "info":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div
        className={cn("rounded-xl p-4", getStyles())}
        style={{
          border:
            type === "success"
              ? "1px solid #10B981"
              : type === "error"
              ? "1px solid #EF4444"
              : "1px solid #DDDDDD",
          boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
              className={cn(
                "inline-flex focus:outline-none transition-colors",
                type === "success"
                  ? "text-green-400 hover:text-green-600 focus:text-green-600"
                  : type === "error"
                  ? "text-red-400 hover:text-red-600 focus:text-red-600"
                  : "text-gray-400 hover:text-gray-600 focus:text-gray-600"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Toast };
