"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OwnershipDocuments } from "@/types/host-onboarding";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";

interface DocumentUploadFormProps {
  onUpload: (
    files: File[]
  ) => Promise<{ files: Array<{ url: string; name: string; size: number }> }>;
  onSubmit: (documents: OwnershipDocuments) => void;
  isLoading: boolean;
}

export default function DocumentUploadForm({
  onUpload,
  onSubmit,
  isLoading,
}: DocumentUploadFormProps) {
  const [documents, setDocuments] = useState<OwnershipDocuments>({
    documents: [],
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate files
    for (const file of fileArray) {
      if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
        setErrors((prev) => ({
          ...prev,
          documents: "Please select valid image or PDF files",
        }));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB max
        setErrors((prev) => ({
          ...prev,
          documents: "File size must be less than 10MB",
        }));
        return;
      }
    }

    try {
      setUploading(true);
      setErrors((prev) => ({ ...prev, documents: "" }));

      const response = await onUpload(fileArray);

      if (response.files && response.files.length > 0) {
        const newUrls = response.files.map((file) => file.url);
        setDocuments((prev) => ({
          ...prev,
          documents: [...prev.documents, ...newUrls],
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          documents: "Upload failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({
        ...prev,
        documents: "Upload failed. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({ ...prev, documents: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (documents.documents.length === 0) {
      newErrors.documents = "At least one document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(documents);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Property Ownership Documents
        </h2>
        <p className="text-gray-600">
          Upload documents that prove your ownership or right to rent the
          property
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Area */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Documents
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload property deeds, rental agreements, or other ownership
              documents
            </p>

            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  {uploading ? (
                    <div className="space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Images or PDF files up to 10MB each
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {errors.documents && (
              <div className="flex items-center justify-center text-red-600 mt-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{errors.documents}</span>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Documents */}
        {documents.documents.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              Uploaded Documents ({documents.documents.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.documents.map((url, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Document {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative">
                    {url.toLowerCase().includes(".pdf") ? (
                      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Document ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Document Guidelines:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Property deed or title document</li>
            <li>• Rental agreement or lease contract</li>
            <li>• Property tax receipts</li>
            <li>• Utility bills in your name</li>
            <li>
              • Any other legal document proving ownership or rental rights
            </li>
            <li>• Ensure all text is clearly readable</li>
            <li>• Upload multiple documents if needed</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isLoading || uploading}
            className="w-full"
          >
            {isLoading
              ? "Submitting Documents..."
              : "Submit Documents & Complete Onboarding"}
          </Button>
        </div>
      </form>
    </div>
  );
}
