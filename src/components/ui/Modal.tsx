import React, { forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Divider } from "./Divider";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, className }, ref) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          ref={ref}
          className={cn(
            "relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden",
            className
          )}
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <Divider />
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
