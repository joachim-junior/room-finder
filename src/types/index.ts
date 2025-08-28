export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "GUEST" | "HOST" | "ADMIN";
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  hostApprovalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type:
    | "ROOM"
    | "STUDIO"
    | "APARTMENT"
    | "VILLA"
    | "SUITE"
    | "DORMITORY"
    | "COTTAGE"
    | "PENTHOUSE";
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  isVerified: boolean;
  host: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    isVerified?: boolean;
  };
  reviews?: {
    averageRating: number;
    totalReviews: number;
  };
  averageRating?: number;
  _count?: {
    reviews: number;
    bookings: number;
    favorites?: number;
  };
  isFavorited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  createdAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUNDED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  paymentReference?: string;
  paymentUrl?: string;
  transactionId?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
  property?: Property;
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface Wallet {
  balance: number;
  currency: string;
  isActive?: boolean;
  totalTransactions?: number;
  totalPayments?: number;
  totalRefunds?: number;
  totalWithdrawals?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: "PAYMENT" | "REFUND" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  reference: string;
  metadata?:
    | string
    | {
        bookingId?: string;
        propertyId?: string;
        paymentMethod?: string;
        customerInfo?: {
          name: string;
          phone: string;
          email: string;
        };
        transactionId?: string;
      };
  createdAt: string;
  updatedAt?: string;
  hostServiceFee?: number | null;
  guestServiceFee?: number | null;
  platformRevenue?: number | null;
  netAmount?: number | null;
  walletId?: string;
  userId?: string;
  bookingId?: string;
  booking?: {
    id: string;
    property: {
      title: string;
      address: string;
    };
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PaymentInitialization {
  paymentUrl: string;
  reference: string;
  status: string;
  bookingId: string;
}

export interface PaymentVerification {
  bookingStatus: string;
  paymentStatus: string;
  verificationResult: {
    transId: string;
    status: string;
    amount: number;
    medium: string;
    dateConfirmed: string;
  };
}

export interface Enquiry {
  id: string;
  subject: string;
  message: string;
  status: "PENDING" | "RESPONDED" | "CLOSED" | "SPAM";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  isRead: boolean;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    city: string;
    images: string[];
  };
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  host: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type:
    | "NEW_BOOKING"
    | "BOOKING_CONFIRMED"
    | "BOOKING_CANCELLED"
    | "NEW_REVIEW"
    | "PAYMENT_RECEIVED"
    | "PAYMENT_FAILED"
    | "SYSTEM";
  status: "READ" | "UNREAD";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// For properties API response
export interface PropertiesResponse {
  message: string;
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// For favorites API response
export interface FavoritesResponse {
  message: string;
  favorites: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchFilters {
  city?: string;
  type?: Property["type"];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  amenities?: string[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  isAvailable?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}
