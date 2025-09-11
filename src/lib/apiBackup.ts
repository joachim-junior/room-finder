import {
  ApiResponse,
  PaginatedResponse,
  PropertiesResponse,
  Property,
  Booking,
  User,
  Review,
  ReviewsApiResponse,
  Wallet,
  Transaction,
  Notification,
  Enquiry,
  SearchFilters,
  PaymentMethod,
  PaymentInitialization,
  PaymentVerification,
  SupportTicket,
  SupportMessage,
  SupportOptions,
  SupportRequest,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.roomfinder237.com/api/v1";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      
      if (!response.ok) {
        throw new Error(data.message || "Empty response from server");
      }

      if (!data || Object.keys(data).length === 0) {
        console.warn("Empty response data, returning empty object");
        return { success: true, data: {} as T };
      }
      return { success: true, data };
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      if (!this.token) {
        this.token = localStorage.getItem("token");
      }
      return this.token;
    }
    return this.token;
  }

  // Authentication
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role?: "GUEST" | "HOST" | "ADMIN";
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await this.request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      return response;
    } else if ("user" in response && "token" in response) {
      const backendResponse = response as {
        message: string;
        user: User;
        token: string;
      };
      return {
        success: true,
        message: backendResponse.message,
        data: {
          user: backendResponse.user,
        },
      };
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      return response;
    } else if ("token" in response && "user" in response) {
      const backendResponse = response as {
        message: string;
        user: User;
        token: string;
      };
      this.setToken(backendResponse.token);
      return {
        success: true,
        message: backendResponse.message,
        data: {
          user: backendResponse.user,
          token: backendResponse.token,
        },
      };
    }

    return {
      success: false,
      message: "Invalid response from server",
      data: undefined,
    };
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/profile");
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  // Properties
  async getProperties(
    filters?: SearchFilters & { page?: number; limit?: number }
  ): Promise<PropertiesResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const url = `${this.baseUrl}/properties?${params.toString()}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        headers,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }

      if (!response.ok || !data || Object.keys(data).length === 0) {
        console.error("API Error Response:", data);
        throw new Error(data.message || "Empty response from server");
      }

      if (data.properties && Array.isArray(data.properties)) {
        return {
          message: data.message || "Properties retrieved successfully",
          properties: data.properties,
          pagination: data.pagination || {
            page: 1,
            limit: 10,
            total: data.properties.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        return {
          message: "Properties retrieved successfully",
          properties: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
    } catch (error) {
      console.error("API request failed:", error);
      return {
        message: "Properties retrieved successfully",
        properties: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  async getProperty(id: string): Promise<Property> {
    const url = `${this.baseUrl}/properties/${id}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        headers,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }

      if (!response.ok || !data || Object.keys(data).length === 0) {
        console.error("Property API Error Response:", data);
        throw new Error(data.message || "Empty response from server");
      }

      if (data.success && data.data) {
        return data.data;
      } else if (data.property) {
        return data.property;
      } else if (data.id) {
        return data;
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("❌ API request failed:", error);
      throw error;
    }
  }

  async searchProperties(
    query: string,
    filters?: SearchFilters
  ): Promise<ApiResponse<PropertiesResponse>> {
    const params = new URLSearchParams({ q: query });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    return this.request<PropertiesResponse>(
      `/properties/search?${params.toString()}`
    );
  }

  // Bookings
  async calculateFees(
    propertyId: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ): Promise<
    ApiResponse<{
      property: { id: string; title: string; price: number; currency: string };
      booking: {
        checkIn: string;
        checkOut: string;
        nights: number;
        guests: number;
        baseAmount: number;
      };
      fees: {
        hostServiceFee: number;
        hostServiceFeePercent: number;
        guestServiceFee: number;
        guestServiceFeePercent: number;
      };
      totals: {
        baseAmount: number;
        guestServiceFee: number;
        totalGuestPays: number;
        hostServiceFee: number;
        netAmountForHost: number;
        platformRevenue: number;
      };
      currency: string;
    }>
  > {
    const params = new URLSearchParams({
      propertyId,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });

    return this.request(`/bookings/calculate-fees?${params.toString()}`);
  }

  async createBooking(bookingData: {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
    paymentMethod: string;
    phone: string;
  }): Promise<
    ApiResponse<{
      booking: Booking;
      payment: {
        transId: string;
        status: string;
        message: string;
        dateInitiated: string;
      };
    }>
  > {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings(
    status?: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PaginatedResponse<Booking>>(
      `/bookings/my-bookings?${params.toString()}`
    );
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async cancelBooking(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/bookings/${id}/cancel`, {
      method: "PUT",
    });
  }

  async checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    const params = new URLSearchParams({
      propertyId,
      checkIn,
      checkOut,
    });

    return this.request<{ available: boolean }>(
      `/bookings/availability?${params.toString()}`
    );
  }

  // Check if user has booked a specific property
  async hasUserBookedProperty(
    propertyId: string,
    status?: string
  ): Promise<{
    hasBooked: boolean;
    property: { id: string; title: string };
    latestBooking: Booking | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await this.request<{
        hasBooked: boolean;
        property: { id: string; title: string };
        latestBooking: Booking | null;
      }>(`/bookings/has-booked/${propertyId}?${params.toString()}`);

      return (
        response.data || {
          hasBooked: false,
          property: { id: propertyId, title: "" },
          latestBooking: null,
        }
      );
    } catch (error) {
      console.error("Error checking user booking status:", error);
      return {
        hasBooked: false,
        property: { id: propertyId, title: "" },
        latestBooking: null,
      };
    }
  }

  // Reviews
  async getPropertyReviews(
    propertyId: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<ReviewsApiResponse>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<ReviewsApiResponse>(
      `/reviews/property/${propertyId}?${params.toString()}`
    );
  }

  async createReview(reviewData: {
    propertyId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<{ review: Review }>> {
    return this.request<{ review: Review }>("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  // Dashboard Stats - Returns mock data for now
  async getDashboardStats(): Promise<
    ApiResponse<{
      overview: {
        totalBookings: number;
        activeBookings: number;
        totalSpent: number;
        averageRating: number;
        totalReviews: number;
        favoriteProperties: number;
      };
      financial: {
        totalSpent: number;
        averageSpending: number;
        monthlySpending: number;
        spendingLast30Days: number;
        currency: string;
        walletBalance: number;
      };
      bookings: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        cancellationRate: number;
        averageStayDuration: number;
        upcomingBookings: number;
        recentBookings: Array<{
          id: string;
          propertyTitle: string;
          checkIn: string;
          checkOut: string;
          totalPrice: number;
          status: string;
        }>;
      };
      reviews: {
        total: number;
        averageRating: number;
        ratingBreakdown: {
          "5": number;
          "4": number;
          "3": number;
          "2": number;
          "1": number;
        };
        recentReviews: Array<{
          id: string;
          rating: number;
          comment: string;
          propertyTitle: string;
          createdAt: string;
        }>;
      };
      enquiries: {
        total: number;
        pending: number;
        responded: number;
        closed: number;
        responseRate: number;
        recentEnquiries: Array<{
          id: string;
          subject: string;
          status: string;
          propertyTitle: string;
          createdAt: string;
        }>;
      };
      activity: {
        lastLogin: string;
        memberSince: string;
        totalTransactions: number;
        favoriteDestinations: string[];
        preferredPropertyTypes: string[];
      };
      analytics: {
        monthlySpendingTrend: Array<{
          month: number;
          total: number;
        }>;
      };
    }>
  > {
    // Return mock data to get the dashboard working
    return {
      success: true,
      data: {
        overview: {
          totalBookings: 5,
          activeBookings: 2,
          totalSpent: 150000,
          averageRating: 4.5,
          totalReviews: 3,
          favoriteProperties: 2,
        },
        financial: {
          totalSpent: 150000,
          averageSpending: 30000,
          monthlySpending: 45000,
          spendingLast30Days: 75000,
          currency: "XAF",
          walletBalance: 25000,
        },
        bookings: {
          total: 5,
          pending: 1,
          confirmed: 2,
          completed: 2,
          cancelled: 0,
          cancellationRate: 0,
          averageStayDuration: 3,
          upcomingBookings: 2,
          recentBookings: [
            {
              id: "booking1",
              propertyTitle: "Beautiful Apartment in Douala",
              checkIn: "2024-01-15",
              checkOut: "2024-01-18",
              totalPrice: 75000,
              status: "CONFIRMED",
            },
            {
              id: "booking2",
              propertyTitle: "Cozy Studio in Limbe",
              checkIn: "2024-01-20",
              checkOut: "2024-01-22",
              totalPrice: 45000,
              status: "COMPLETED",
            },
          ],
        },
        reviews: {
          total: 3,
          averageRating: 4.5,
          ratingBreakdown: {
            "5": 2,
            "4": 1,
            "3": 0,
            "2": 0,
            "1": 0,
          },
          recentReviews: [
            {
              id: "review1",
              rating: 5,
              comment: "Excellent stay, highly recommended!",
              propertyTitle: "Beautiful Apartment in Douala",
              createdAt: "2024-01-10T10:00:00Z",
            },
          ],
        },
        enquiries: {
          total: 2,
          pending: 1,
          responded: 1,
          closed: 0,
          responseRate: 50,
          recentEnquiries: [
            {
              id: "enquiry1",
              subject: "Availability for next week",
              status: "PENDING",
              propertyTitle: "Beautiful Apartment in Douala",
              createdAt: "2024-01-12T14:30:00Z",
            },
          ],
        },
        activity: {
          lastLogin: new Date().toISOString(),
          memberSince: "2023-06-15T00:00:00Z",
          totalTransactions: 5,
          favoriteDestinations: ["Douala", "Limbe"],
          preferredPropertyTypes: ["APARTMENT", "STUDIO"],
        },
        analytics: {
          monthlySpendingTrend: [
            { month: 1, total: 45000 },
            { month: 2, total: 60000 },
            { month: 3, total: 45000 },
          ],
        },
      },
    };
  }

  // Favorites
  async addToFavorites(
    propertyId: string
  ): Promise<ApiResponse<{ favorite: Property }>> {
    return this.request<{ favorite: Property }>("/favorites", {
      method: "POST",
      body: JSON.stringify({ propertyId }),
    });
  }

  async removeFromFavorites(propertyId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/favorites/${propertyId}`, {
      method: "DELETE",
    });
  }

  async getFavorites(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PropertiesResponse>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PropertiesResponse>(
      `/favorites?${params.toString()}`
    );
  }

  async checkIfFavorited(
    propertyId: string
  ): Promise<ApiResponse<{ isFavorited: boolean }>> {
    return this.request<{ isFavorited: boolean }>(
      `/favorites/check/${propertyId}`
    );
  }

  // Payment Methods
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return this.request<PaymentMethod[]>("/payments/methods");
  }

  async initializePayment(
    bookingId: string,
    paymentMethod: string
  ): Promise<ApiResponse<PaymentInitialization>> {
    return this.request<PaymentInitialization>(
      `/payments/booking/${bookingId}/initialize`,
      {
        method: "POST",
        body: JSON.stringify({ paymentMethod }),
      }
    );
  }

  async verifyPayment(
    bookingId: string
  ): Promise<ApiResponse<PaymentVerification>> {
    return this.request<PaymentVerification>(
      `/payments/booking/${bookingId}/verify`,
      {
        method: "POST",
      }
    );
  }

  // Wallet
  async getWalletBalance(): Promise<ApiResponse<Wallet>> {
    return this.request<Wallet>("/wallet/balance");
  }

  async getTransactionHistory(
    type?: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PaginatedResponse<Transaction>>(
      `/wallet/transactions?${params.toString()}`
    );
  }

  // Notifications
  async getNotifications(
    read?: boolean,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const params = new URLSearchParams();
    if (read !== undefined) params.append("read", String(read));
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PaginatedResponse<Notification>>(
      `/notifications?${params.toString()}`
    );
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>("/notifications/read-all", {
      method: "PUT",
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}`, {
      method: "DELETE",
    });
  }

  // Enquiries
  async createEnquiry(enquiryData: {
    propertyId: string;
    subject: string;
    message: string;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  }): Promise<ApiResponse<{ enquiry: Enquiry }>> {
    return this.request<{ enquiry: Enquiry }>("/enquiries", {
      method: "POST",
      body: JSON.stringify(enquiryData),
    });
  }

  async getEnquiries(
    status?: string,
    priority?: string,
    propertyId?: string,
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
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
      }>
    >
  > {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);
    if (propertyId) params.append("propertyId", propertyId);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<
      PaginatedResponse<{
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
      }>
    >(`/enquiries?${params.toString()}`);
  }

  // Support
  async getSupportOptions(): Promise<ApiResponse<SupportOptions>> {
    return this.request("/support/options");
  }

  async createSupportRequest(supportData: SupportRequest): Promise<
    ApiResponse<{
      ticket: SupportTicket;
    }>
  > {
    return this.request("/support/tickets", {
      method: "POST",
      body: JSON.stringify(supportData),
    });
  }

  async getUserSupportTickets(
    page?: number,
    limit?: number,
    status?: string,
    category?: string
  ): Promise<
    ApiResponse<{
      tickets: SupportTicket[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (status) params.append("status", status);
    if (category) params.append("category", category);

    return this.request(`/support/tickets?${params.toString()}`);
  }

  async getSupportTicket(ticketId: string): Promise<
    ApiResponse<{
      ticket: SupportTicket;
    }>
  > {
    return this.request(`/support/tickets/${ticketId}`);
  }

  async addMessageToSupportTicket(
    ticketId: string,
    messageData: {
      message: string;
      attachments?: string[];
    }
  ): Promise<
    ApiResponse<{
      message: SupportMessage;
    }>
  > {     
    return this.request(`/support/tickets/${ticketId}/messages`, {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

