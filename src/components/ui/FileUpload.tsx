"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
} from "lucide-react";

interface FileUploadProps {
  onUpload: (
    files: File[]
  ) => Promise<{ files: Array<{ url: string; name: string; size: number }> }>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onSuccess?: (urls: string[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function FileUpload({
  onUpload,
  accept = "image/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 5,
  onSuccess,
  onError,
  className = "",
  disabled = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; name: string; size: number }>
  >([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file count
    if (!multiple && fileArray.length > 1) {
      const errorMsg = "Please select only one file";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (fileArray.length > maxFiles) {
      const errorMsg = `Please select no more than ${maxFiles} files`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate files
    for (const file of fileArray) {
      if (maxSize && file.size > maxSize) {
        const errorMsg = `File size must be less than ${Math.round(
          maxSize / (1024 * 1024)
        )}MB`;
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }
    }

    try {
      setUploading(true);
      setError("");

      const response = await onUpload(fileArray);

      if (response.files && response.files.length > 0) {
        const newFiles = [...uploadedFiles, ...response.files];
        setUploadedFiles(newFiles);
        onSuccess?.(response.files.map((f) => f.url));
      } else {
        const errorMsg = "Upload failed. Please try again.";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMsg = "Upload failed. Please try again.";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getFileIcon = (file: { url: string; name: string }) => {
    if (file.name.toLowerCase().includes(".pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <Image className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-400 cursor-pointer"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="space-y-2">
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                {multiple
                  ? "Click to upload files or drag and drop"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">
                {accept === "image/*"
                  ? "Images"
                  : accept === ".pdf"
                  ? "PDF files"
                  : "Files"}{" "}
                up to {Math.round(maxSize / (1024 * 1024))}MB each
              </p>
              {multiple && (
                <p className="text-xs text-gray-500">
                  Maximum {maxFiles} files
                </p>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
