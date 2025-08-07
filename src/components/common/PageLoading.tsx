import React from "react";

interface PageLoadingProps {
  isLoading: boolean;
  text?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({
  isLoading,
  text = "Loading page...",
}) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">{text}</span>
        </div>
        <div className="mt-3">
          <p className="text-muted mb-0">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
