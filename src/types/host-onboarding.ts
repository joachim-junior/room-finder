export interface HostProfile {
  fullLegalName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  nationality: string; // Always "Cameroonian"
  residentialAddress: string;
  city: string;
  region: string; // From CAMEROON_REGIONS list
  country: string; // Always "Cameroon"
  postalCode: string;
  alternatePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  whatsapp: string;
  facebookUrl: string;
  instagramUrl: string;
  payoutPhoneNumber: string;
  payoutPhoneName: string;
  idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENCE";
  idNumber: string;
  idExpiryDate: string; // YYYY-MM-DD format
  bio: string;
  languages: string[]; // Array of languages
}

export interface IDVerification {
  idFrontImage: string; // URL of uploaded image
  idBackImage: string; // URL of uploaded image
  selfieImage: string; // URL of uploaded image
}

export interface OwnershipDocuments {
  documents: string[]; // Array of uploaded document URLs
}

export interface OnboardingStatus {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: string;
    hostApprovalStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
    isVerified: boolean;
  };
  profile: {
    completed: boolean;
    data: HostProfile & {
      id: string;
      userId: string;
      hostingSince: string | null;
      propertyCount: number;
      completedAt: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  verification: {
    idVerification:
      | "PENDING"
      | "VERIFIED"
      | "REJECTED"
      | "NOT_REQUIRED"
      | "EXPIRED";
    ownershipVerification:
      | "PENDING"
      | "VERIFIED"
      | "REJECTED"
      | "NOT_REQUIRED"
      | "EXPIRED";
    overall: "PENDING" | "VERIFIED" | "REJECTED" | "NOT_REQUIRED" | "EXPIRED";
    data: {
      id: string;
      userId: string;
      idFrontImage: string;
      idBackImage: string;
      selfieImage: string;
      idVerificationStatus: string;
      idVerifiedAt: string | null;
      idVerifiedBy: string | null;
      idRejectionReason: string | null;
      ownershipDocuments: string[];
      ownershipVerificationStatus: string;
      ownershipVerifiedAt: string | null;
      ownershipVerifiedBy: string | null;
      ownershipRejectionReason: string | null;
      overallVerificationStatus: string;
      verificationCompletedAt: string | null;
      adminNotes: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
  completionPercentage: number;
  nextSteps: Array<{
    step: number;
    title: string;
    description: string;
    required: boolean;
    completed: boolean;
  }>;
}

export interface PayoutEligibleAmount {
  totalEligibleAmount: number; // Available for payout now
  pendingAmount: number; // In 3-day waiting period
  lockedAmount: number; // Locked due to disputes
  totalBalance: number; // Total wallet balance
}

export interface PayoutFees {
  requestedAmount: number;
  withdrawalFee: number;
  netAmount: number; // Amount host will receive
  currency: string;
  note: string; // Explanation of fees
}

export interface PayoutRequestForm {
  amount: number;
  phoneNumber: string; // From host onboarding profile
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  phoneNumber: string;
  requestedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
}

export interface PayoutRequestsResponse {
  requests: PayoutRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const CAMEROON_REGIONS = [
  "Adamaoua",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "Northwest",
  "South",
  "Southwest",
  "West",
];

export const LANGUAGES = [
  "English",
  "French",
  "Pidgin English",
  "Fulfulde",
  "Ewondo",
  "Duala",
  "Bamileke",
  "Other",
];

export const ID_TYPES = [
  { value: "NATIONAL_ID", label: "National ID Card" },
  { value: "PASSPORT", label: "Passport" },
  { value: "DRIVER_LICENCE", label: "Driver's License" },
];
