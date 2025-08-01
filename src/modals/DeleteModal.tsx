import Image from "next/image";
import { useState, useEffect } from "react";

import deleteIcon from "@/assets/images/dashboard/icon/icon_22.svg";

const DeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for custom event to open modal
    const handleOpenModal = () => {
      console.log("Opening delete modal");
      setIsOpen(true);
    };

    document.addEventListener("openDeleteModal", handleOpenModal);

    return () => {
      document.removeEventListener("openDeleteModal", handleOpenModal);
    };
  }, []);

  const handleYesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Yes button clicked");
    alert("Delete account functionality would be implemented here");
    handleClose();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Cancel button clicked");
    handleClose();
  };

  const handleClose = () => {
    console.log("Closing delete modal");
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="custom-modal-overlay"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      <div
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "15px",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={handleCancelClick}
          style={{
            position: "absolute",
            right: "15px",
            top: "15px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>

        <div className="text-center">
          <Image src={deleteIcon} alt="" className="lazy-img m-auto mb-3" />
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>Are you sure?</h2>
          <p style={{ marginBottom: "2rem", color: "#666" }}>
            Are you sure to delete your account? All data will be lost.
          </p>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button
              onClick={handleYesClick}
              style={{
                background: "#0072c6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Yes
            </button>
            <button
              onClick={handleCancelClick}
              style={{
                background: "#f8f9fa",
                color: "#333",
                border: "1px solid #dee2e6",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
