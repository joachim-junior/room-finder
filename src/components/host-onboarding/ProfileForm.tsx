"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  HostProfile,
  CAMEROON_REGIONS,
  LANGUAGES,
  ID_TYPES,
} from "@/types/host-onboarding";
import { Calendar, MapPin, Phone, Mail, User, CreditCard } from "lucide-react";

interface ProfileFormProps {
  initialData?: HostProfile | null;
  onSubmit: (data: HostProfile) => void;
  isLoading: boolean;
}

export default function ProfileForm({
  initialData,
  onSubmit,
  isLoading,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<HostProfile>({
    fullLegalName: "",
    dateOfBirth: "",
    nationality: "Cameroonian",
    residentialAddress: "",
    city: "",
    region: "",
    country: "Cameroon",
    postalCode: "",
    alternatePhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    whatsapp: "",
    facebookUrl: "",
    instagramUrl: "",
    payoutPhoneNumber: "",
    payoutPhoneName: "",
    idType: "NATIONAL_ID",
    idNumber: "",
    idExpiryDate: "",
    bio: "",
    languages: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Handle status response data structure
      const profileData = {
        fullLegalName: initialData.fullLegalName || "",
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
        nationality: initialData.nationality || "Cameroonian",
        residentialAddress: initialData.residentialAddress || "",
        city: initialData.city || "",
        region: initialData.region || "",
        country: initialData.country || "Cameroon",
        postalCode: initialData.postalCode || "",
        alternatePhone: initialData.alternatePhone || "",
        emergencyContact: initialData.emergencyContact || "",
        emergencyPhone: initialData.emergencyPhone || "",
        whatsapp: initialData.whatsapp || "",
        facebookUrl: initialData.facebookUrl || "",
        instagramUrl: initialData.instagramUrl || "",
        payoutPhoneNumber: initialData.payoutPhoneNumber || "",
        payoutPhoneName: initialData.payoutPhoneName || "",
        idType: initialData.idType || "NATIONAL_ID",
        idNumber: initialData.idNumber || "",
        idExpiryDate: initialData.idExpiryDate
          ? new Date(initialData.idExpiryDate).toISOString().split("T")[0]
          : "",
        bio: initialData.bio || "",
        languages: initialData.languages || [],
      };
      setFormData(profileData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.fullLegalName.trim()) {
      newErrors.fullLegalName = "Full legal name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.dateOfBirth = "Date of birth must be in the past";
      }
    }

    if (!formData.residentialAddress.trim()) {
      newErrors.residentialAddress = "Residential address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.region) {
      newErrors.region = "Region is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Postal code must be 5 digits";
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = "Emergency contact name is required";
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = "Emergency phone is required";
    } else if (!/^\+237[0-9]{9}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = "Phone must be in format +237XXXXXXXXX";
    }

    if (!formData.payoutPhoneNumber.trim()) {
      newErrors.payoutPhoneNumber = "Payout phone number is required";
    } else if (!/^\+237[0-9]{9}$/.test(formData.payoutPhoneNumber)) {
      newErrors.payoutPhoneNumber = "Phone must be in format +237XXXXXXXXX";
    }

    if (!formData.payoutPhoneName.trim()) {
      newErrors.payoutPhoneName = "Payout phone name is required";
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "ID number is required";
    }

    if (!formData.idExpiryDate) {
      newErrors.idExpiryDate = "ID expiry date is required";
    } else {
      const expiryDate = new Date(formData.idExpiryDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.idExpiryDate = "ID must not be expired";
      }
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 50) {
      newErrors.bio = "Bio must be at least 50 characters";
    } else if (formData.bio.length > 500) {
      newErrors.bio = "Bio must not exceed 500 characters";
    }

    if (formData.languages.length === 0) {
      newErrors.languages = "At least one language is required";
    }

    // Optional phone validation
    if (
      formData.alternatePhone &&
      !/^\+237[0-9]{9}$/.test(formData.alternatePhone)
    ) {
      newErrors.alternatePhone = "Phone must be in format +237XXXXXXXXX";
    }

    if (formData.whatsapp && !/^\+237[0-9]{9}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "Phone must be in format +237XXXXXXXXX";
    }

    // URL validation
    if (formData.facebookUrl && !isValidUrl(formData.facebookUrl)) {
      newErrors.facebookUrl = "Please enter a valid URL";
    }

    if (formData.instagramUrl && !isValidUrl(formData.instagramUrl)) {
      newErrors.instagramUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Information
        </h2>
        <p className="text-gray-600">
          Tell us about yourself and your contact information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Legal Name *
              </label>
              <Input
                value={formData.fullLegalName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullLegalName: e.target.value,
                  }))
                }
                placeholder="Enter your full legal name"
                error={errors.fullLegalName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }))
                }
                error={errors.dateOfBirth}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality
              </label>
              <Input
                value={formData.nationality}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Type *
              </label>
              <Select
                value={formData.idType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    idType: e.target.value as any,
                  }))
                }
                options={ID_TYPES}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number *
              </label>
              <Input
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, idNumber: e.target.value }))
                }
                placeholder="Enter your ID number"
                error={errors.idNumber}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Expiry Date *
              </label>
              <Input
                type="date"
                value={formData.idExpiryDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    idExpiryDate: e.target.value,
                  }))
                }
                error={errors.idExpiryDate}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Address Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residential Address *
              </label>
              <Textarea
                value={formData.residentialAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residentialAddress: e.target.value,
                  }))
                }
                placeholder="Enter your full residential address"
                rows={3}
                error={errors.residentialAddress}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="Enter your city"
                  error={errors.city}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <Select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, region: e.target.value }))
                  }
                  options={CAMEROON_REGIONS.map((region) => ({
                    value: region,
                    label: region,
                  }))}
                  placeholder="Select region"
                  error={errors.region}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  placeholder="12345"
                  error={errors.postalCode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name *
              </label>
              <Input
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContact: e.target.value,
                  }))
                }
                placeholder="Enter emergency contact name"
                error={errors.emergencyContact}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Phone *
              </label>
              <Input
                value={formData.emergencyPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyPhone: e.target.value,
                  }))
                }
                placeholder="+237XXXXXXXXX"
                error={errors.emergencyPhone}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Phone
              </label>
              <Input
                value={formData.alternatePhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    alternatePhone: e.target.value,
                  }))
                }
                placeholder="+237XXXXXXXXX"
                error={errors.alternatePhone}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <Input
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))
                }
                placeholder="+237XXXXXXXXX"
                error={errors.whatsapp}
              />
            </div>
          </div>
        </div>

        {/* Payout Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payout Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payout Phone Number *
              </label>
              <Input
                value={formData.payoutPhoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payoutPhoneNumber: e.target.value,
                  }))
                }
                placeholder="+237XXXXXXXXX"
                error={errors.payoutPhoneNumber}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payout Phone Name *
              </label>
              <Input
                value={formData.payoutPhoneName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payoutPhoneName: e.target.value,
                  }))
                }
                placeholder="Name on payout account"
                error={errors.payoutPhoneName}
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Social Media (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <Input
                value={formData.facebookUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    facebookUrl: e.target.value,
                  }))
                }
                placeholder="https://facebook.com/yourprofile"
                error={errors.facebookUrl}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <Input
                value={formData.instagramUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instagramUrl: e.target.value,
                  }))
                }
                placeholder="https://instagram.com/yourprofile"
                error={errors.instagramUrl}
              />
            </div>
          </div>
        </div>

        {/* Bio and Languages */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">About You</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio * ({formData.bio.length}/500 characters)
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell us about yourself, your experience with hosting, and what makes you a great host..."
              rows={4}
              error={errors.bio}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken * ({formData.languages.length} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LANGUAGES.map((language) => (
                <label key={language} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                  />
                  <span className="text-sm text-gray-700">{language}</span>
                </label>
              ))}
            </div>
            {errors.languages && (
              <p className="mt-1 text-sm text-red-600">{errors.languages}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving Profile..." : "Save Profile & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
