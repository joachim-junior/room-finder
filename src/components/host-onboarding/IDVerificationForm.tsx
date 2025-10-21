"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IDVerification } from "@/types/host-onboarding";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  CreditCard,
  User,
} from "lucide-react";

interface IDVerificationFormProps {
  onUpload: (
    files: File[]
  ) => Promise<{ files: Array<{ url: string; name: string; size: number }> }>;
  onSubmit: (verification: IDVerification) => void;
  isLoading: boolean;
}

export default function IDVerificationForm({
  onUpload,
  onSubmit,
  isLoading,
}: IDVerificationFormProps) {
  const [verification, setVerification] = useState<IDVerification>({
    idFrontImage: "",
    idBackImage: "",
    selfieImage: "",
  });

  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = async (type: keyof IDVerification, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Please select a valid image file",
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [type]: "File size must be less than 5MB",
      }));
      return;
    }

    try {
      setUploading(type);
      setErrors((prev) => ({ ...prev, [type]: "" }));

      const response = await onUpload([file]);

      if (response.files && response.files.length > 0) {
        setVerification((prev) => ({
          ...prev,
          [type]: response.files[0].url,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [type]: "Upload failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({
        ...prev,
        [type]: "Upload failed. Please try again.",
      }));
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = (type: keyof IDVerification) => {
    setVerification((prev) => ({
      ...prev,
      [type]: "",
    }));
    setErrors((prev) => ({ ...prev, [type]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!verification.idFrontImage) {
      newErrors.idFrontImage = "Front ID image is required";
    }

    if (!verification.idBackImage) {
      newErrors.idBackImage = "Back ID image is required";
    }

    if (!verification.selfieImage) {
      newErrors.selfieImage = "Selfie image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(verification);
    }
  };

  const ImageUploadCard = ({
    type,
    title,
    description,
    icon: Icon,
    required = true,
  }: {
    type: keyof IDVerification;
    title: string;
    description: string;
    icon: any;
    required?: boolean;
  }) => {
    const imageUrl = verification[type];
    const isUploading = uploading === type;
    const error = errors[type];

    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          {imageUrl ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(type)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  Uploaded successfully
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    {isUploading ? (
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
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(type, file);
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center text-red-600 mt-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ID Verification
        </h2>
        <p className="text-gray-600">
          Upload clear photos of your ID documents for verification
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploadCard
            type="idFrontImage"
            title="Front of ID"
            description="Upload a clear photo of the front of your ID card, passport, or driver's license"
            icon={CreditCard}
            required
          />

          <ImageUploadCard
            type="idBackImage"
            title="Back of ID"
            description="Upload a clear photo of the back of your ID card or driver's license"
            icon={CreditCard}
            required
          />
        </div>

        <div className="max-w-md mx-auto">
          <ImageUploadCard
            type="selfieImage"
            title="Selfie with ID"
            description="Take a selfie holding your ID next to your face. Make sure your face and ID are clearly visible"
            icon={User}
            required
          />
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Photo Guidelines:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure all text is clearly readable</li>
            <li>• Use good lighting and avoid shadows</li>
            <li>• Keep the document flat and straight</li>
            <li>• Avoid glare and reflections</li>
            <li>• Make sure the entire document is visible</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isLoading || uploading !== null}
            className="w-full"
          >
            {isLoading
              ? "Submitting Verification..."
              : "Submit ID Verification"}
          </Button>
        </div>
      </form>
    </div>
  );
}
