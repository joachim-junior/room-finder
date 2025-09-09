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
    // Initialize token from localStorage if available
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

    // Ensure we have the latest token from localStorage
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
        if (!response.ok || !data || Object.keys(data).length === 0) {
          throw new Error(data.message || "Empty response from server");
        }

        if (!data || Object.keys(data).length === 0) {
          console.warn("Empty response data, returning empty object");
          return {};
        }
        return data;
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Public request method for endpoints that don't require authentication
  private async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    console.log("🔍 Making public API request to:", url);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("📦 Response data:", data);

      if (!response.ok || !data || Object.keys(data).length === 0) {
        console.error("❌ API request failed:", data);
        throw new Error(data.message || "Empty response from server");
      }

      console.log("✅ API request successful");
      if (!data || Object.keys(data).length === 0) {
        console.warn("Empty response data, returning empty object");
        return {};
      }
      return data;
    } catch (error) {
      console.error("❌ Public API request failed:", error);
      throw error;
    }
  }

  setToken(token: string | null) {
    console.log("=== SET TOKEN ===");
    console.log("Setting token:", token ? "EXISTS" : "NULL");
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage");
      } else {
        localStorage.removeItem("token");
        console.log("Token removed from localStorage");
      }
    }
    console.log("=== SET TOKEN END ===");
  }

  getToken(): string | null {
    console.log("=== GET TOKEN ===");
    console.log("Current this.token:", this.token ? "EXISTS" : "NULL");

    if (typeof window !== "undefined") {
      // Initialize this.token from localStorage if it's not set
      if (!this.token) {
        console.log("this.token is null, checking localStorage...");
        this.token = localStorage.getItem("token");
        console.log("localStorage token:", this.token ? "FOUND" : "NOT FOUND");
      } else {
        console.log("this.token already exists, using it");
      }
      console.log("=== GET TOKEN END ===");
      return this.token;
    }
    console.log("Not in browser environment, returning this.token");
    console.log("=== GET TOKEN END ===");
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

    // Handle different response structures from backend
    if (response.success && response.data) {
      return response;
    } else if ("user" in response && "token" in response) {
      // Backend returns { message, user, token } structure
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

    // Handle different response structures from backend
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      return response;
    } else if ("token" in response && "user" in response) {
      // Backend returns { message, user, token } structure
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

    // If we reach here, something went wrong
    console.error("Unexpected login response structure:", response);
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

  // Blog & Content (Public - No Authentication Required)
  async getBlogPosts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    tag?: string;
    search?: string;
  }): Promise<
    ApiResponse<{
      blogs: any[];
      pagination: any;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.tag) searchParams.append("tag", params.tag);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return this.publicRequest<{
      blogs: any[];
      pagination: any;
    }>(`/blog${query ? `?${query}` : ""}`);
  }

  async getBlogPost(slug: string): Promise<ApiResponse<any>> {
    return this.publicRequest<any>(`/blog/${slug}`);
  }

  async getBlogTags(): Promise<ApiResponse<any[]>> {
    return this.publicRequest<any[]>("/blog/tags");
  }

  async addBlogComment(
    blogId: string,
    content: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/blog/${blogId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  // Help Center (Public - No Authentication Required)
  async getHelpArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    priority?: string;
    search?: string;
    isPublished?: boolean;
  }): Promise<
    ApiResponse<{
      articles: any[];
      pagination: any;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.category) searchParams.append("category", params.category);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.isPublished !== undefined)
      searchParams.append("isPublished", params.isPublished.toString());

    const query = searchParams.toString();
    return this.publicRequest<{
      articles: any[];
      pagination: any;
    }>(`/help-center${query ? `?${query}` : ""}`);
  }

  async getHelpArticle(slug: string): Promise<ApiResponse<any>> {
    return this.publicRequest<any>(`/help-center/${slug}`);
  }

  async searchHelpArticles(
    query: string,
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      articles: any[];
      pagination: any;
    }>
  > {
    const searchParams = new URLSearchParams();
    searchParams.append("q", query);
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    return this.publicRequest<{
      articles: any[];
      pagination: any;
    }>(`/help-center/search?${searchParams.toString()}`);
  }

  async getHelpArticlesByCategory(
    category: string,
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      category: string;
      articles: any[];
      pagination: any;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    const query = searchParams.toString();
    return this.request<{
      category: string;
      articles: any[];
      pagination: any;
    }>(`/help-center/category/${category}${query ? `?${query}` : ""}`);
  }

  async rateHelpArticle(
    articleId: string,
    isHelpful: boolean
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/help-center/${articleId}/rate`, {
      method: "POST",
      body: JSON.stringify({ isHelpful }),
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
    console.log("🔍 Making API request to:", url);
    console.log("🔍 API Base URL:", this.baseUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Don't add auth header for guest properties endpoint
    console.log("🔍 Request headers:", headers); // if (this.token) {
    //   headers.Authorization = `Bearer ${this.token}`;
    // }

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

      console.log("API Response:", {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
      });

      if (!response.ok || !data || Object.keys(data).length === 0) {
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(
          data.message ||
            "Empty response from server" ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Ensure the response has the expected structure
      if (data.properties && Array.isArray(data.properties)) {
        return {
          message:
            data.message ||
            "Empty response from server" ||
            "Properties retrieved successfully",
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
        console.warn("Unexpected API response structure:", data);
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
      console.error("Request URL:", url);
      console.error("Request headers:", headers);

      // Return a safe fallback instead of throwing
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

    console.log("🔍 Fetching property with URL:", url);
    console.log("🔍 Headers:", headers);

    try {
      const response = await fetch(url, {
        headers,
      });

      console.log("🔍 Response status:", response.status);
      console.log("🔍 Response statusText:", response.statusText);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("🔍 Raw API response:", data);

      if (!response.ok || !data || Object.keys(data).length === 0) {
        console.error("Property API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(data.message || "Empty response from server");
      }

      // Check if the response has the expected structure
      if (data.success && data.data) {
        console.log("✅ Property found with success structure:", data.data);
        return data.data;
      } else if (data.property) {
        console.log(
          "✅ Property found with property structure:",
          data.property
        );
        return data.property;
      } else if (data.id) {
        console.log("✅ Property found with direct structure:", data);
        if (!data || Object.keys(data).length === 0) {
          console.warn("Empty response data, returning empty object");
          return {};
        }
        return data;
      } else {
        console.error("❌ Unexpected response structure:", data);
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("❌ API request failed:", error);
      console.error("❌ Request URL:", url);

      // Return a safe fallback for property details
      return {
        id: "fallback",
        title: "Property Not Found",
        description: "This property is currently unavailable.",
        type: "APARTMENT",
        address: "Address not available",
        city: "City",
        state: "State",
        country: "Country",
        price: 0,
        currency: "XAF",
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 1,
        amenities: [],
        images: [],
        isAvailable: false,
        isVerified: false,
        host: {
          id: "fallback-host",
          firstName: "Host",
          lastName: "Name",
          email: "host@example.com",
        },
        createdAt: new Date().toISOString(),
      };
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

    return this.request<PaginatedResponse<Property>>(
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
    latestBooking: any | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await this.request<{
        hasBooked: boolean;
        property: { id: string; title: string };
        latestBooking: any | null;
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

  // Add createReview method
  async createReview(reviewData: {
    propertyId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<{ review: any }>> {
    return this.request<{ review: any }>("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
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

  async getPaymentHistory(
    page: number = 1,
    limit: number = 10,
    type?: string
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type) {
      params.append("type", type);
    }

    return this.request<PaginatedResponse<Transaction>>(
      `/payments/history?${params.toString()}`
    );
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

  async getNotificationPreferences(): Promise<
    ApiResponse<{
      userId: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      bookingNotifications: boolean;
      reviewNotifications: boolean;
      paymentNotifications: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    return this.request<{
      userId: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      bookingNotifications: boolean;
      reviewNotifications: boolean;
      paymentNotifications: boolean;
      createdAt: string;
      updatedAt: string;
    }>("/notifications/preferences");
  }

  async updateNotificationPreferences(data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    bookingNotifications?: boolean;
    reviewNotifications?: boolean;
    paymentNotifications?: boolean;
  }): Promise<
    ApiResponse<{
      userId: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      bookingNotifications: boolean;
      reviewNotifications: boolean;
      paymentNotifications: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    return this.request<{
      userId: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      bookingNotifications: boolean;
      reviewNotifications: boolean;
      paymentNotifications: boolean;
      createdAt: string;
      updatedAt: string;
    }>("/notifications/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    });
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

    return this.request<PaginatedResponse<Property>>(
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

  async getPropertyFavoriteCount(
    propertyId: string
  ): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>(`/favorites/count/${propertyId}`);
  }

  async getUserFavoriteCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>("/favorites/user/count");
  }

  // User Stats and Activity
  async getUserStats(): Promise<
    ApiResponse<{
      totalProperties: number;
      totalBookings: number;
      totalReviews: number;
      totalSpent: number;
      currency: string;
    }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/users/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("Raw user stats response:", data);

      // The backend returns { message: string, stats: object } format
      if (data.stats) {
        return {
          success: true,
          data: {
            totalProperties: data.stats.totalProperties || 0,
            totalBookings: data.stats.totalBookings || 0,
            totalReviews: data.stats.totalReviews || 0,
            totalSpent: data.stats.totalEarnings || 0, // Backend uses totalEarnings
            currency: "XAF", // Default currency
          },
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Empty response from server" ||
          "Failed to fetch user stats",
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {
        success: false,
        message: "Failed to fetch user stats",
      };
    }
  }

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
    return this.request<{
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
    }>("/users/dashboard-stats");
  }

  async getUserActivity(
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: string;
        type: "BOOKING" | "REVIEW" | "PAYMENT";
        description: string;
        createdAt: string;
        metadata?: Record<string, unknown>;
      }>
    >
  > {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<
      PaginatedResponse<{
        id: string;
        type: "BOOKING" | "REVIEW" | "PAYMENT";
        description: string;
        createdAt: string;
        metadata?: Record<string, unknown>;
      }>
    >(`/users/activity?${params.toString()}`);
  }

  // Booking Stats
  async getBookingStats(): Promise<
    ApiResponse<{
      totalBookings: number;
      activeBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      totalSpent: number;
      currency: string;
    }>
  > {
    return this.request<{
      totalBookings: number;
      activeBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      totalSpent: number;
      currency: string;
    }>("/bookings/stats");
  }

  // Host Properties (if user is a host)
  async getHostProperties(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PropertiesResponse>> {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));

      const url = `${
        this.baseUrl
      }/properties/host/my-properties?${params.toString()}`;
      console.log("🔍 Making API request to:", url);
      console.log("🔍 API Base URL:", this.baseUrl);
      console.log("🔍 Request headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      console.log("🔍 Response status:", response.status);
      console.log("🔍 Response status text:", response.statusText);
      console.log(
        "🔍 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Handle different HTTP status codes
      if (!response.ok || !data || Object.keys(data).length === 0) {
        console.error("🔍 HTTP Error:", response.status, response.statusText);

        let errorMessage = "Server error";
        try {
          const errorData = await response.json();
          console.log("🔍 Error response data:", errorData);
          errorMessage =
            errorData.message ||
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          console.error("🔍 Could not parse error response:", parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        return {
          success: false,
          message: errorMessage,
          error: `HTTP ${response.status}`,
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("🔍 Raw host properties API response:", data);

      // Check if the response has the actual API structure (message, properties, pagination)
      if (data.message && data.properties && data.pagination) {
        return {
          success: true,
          data: {
            properties: data.properties,
            pagination: data.pagination,
          },
        };
      }

      // Check if the response has the expected structure (for backward compatibility)
      if (
        data.success &&
        data.data &&
        data.data.properties &&
        data.data.pagination
      ) {
        return {
          success: true,
          data: {
            properties: data.data.properties,
            pagination: data.data.pagination,
          },
        };
      }
      return {
        success: false,
        message:
          data.message ||
          "Empty response from server" ||
          "Failed to fetch host properties",
        error: data.error || "Invalid response structure",
      };
    } catch (error) {
      console.error("🔍 Error in getHostProperties:", error);
      return {
        success: false,
        message: "Failed to fetch host properties",
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Delete Property
  async deleteProperty(
    propertyId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok || !data || Object.keys(data).length === 0) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP ${response.status}`,
          error: `HTTP ${response.status}`,
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error deleting property:", error);
      return {
        success: false,
        message: "Failed to delete property",
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Property Stats (for hosts)
  async getPropertyStats(): Promise<
    ApiResponse<{
      totalProperties: number;
      availableProperties: number;
      bookedProperties: number;
      totalEarnings: number;
      currency: string;
    }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/properties/host/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("Raw property stats response:", data);

      // The backend returns { message: string, stats: object } format
      // Even when success is false, the data might be in the stats property
      if (data.stats) {
        return {
          success: true,
          data: {
            totalProperties: data.stats.totalProperties || 0,
            availableProperties: data.stats.availableProperties || 0,
            bookedProperties: 0, // Not provided by backend, defaulting to 0
            totalEarnings: data.stats.totalEarnings || 0,
            currency: "XAF", // Default currency
          },
        };
      }

      // If no stats property, return error
      return {
        success: false,
        message:
          data.message ||
          "Empty response from server" ||
          "Failed to fetch property stats",
      };
    } catch (error) {
      console.error("Error fetching property stats:", error);
      return {
        success: false,
        message: "Failed to fetch property stats",
      };
    }
  }

  // Host Bookings
  async getHostBookings(
    status?: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));

      const response = await fetch(
        `${this.baseUrl}/bookings/host/bookings?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("Raw host bookings response:", data);

      // The backend returns { message: string, bookings: array, pagination: object } format
      if (data.bookings && data.pagination) {
        return {
          success: true,
          data: {
            data: data.bookings,
            pagination: data.pagination,
          },
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Empty response from server" ||
          "Failed to fetch host bookings",
      };
    } catch (error) {
      console.error("Error fetching host bookings:", error);
      return {
        success: false,
        message: "Failed to fetch host bookings",
      };
    }
  }

  async getGuestBookings(
    status?: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));

      const response = await fetch(
        `${this.baseUrl}/bookings/my-bookings?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        data = {};
      }
      console.log("Raw guest bookings response:", data);

      // The backend returns { message: string, bookings: array, pagination: object } format
      if (data.bookings && data.pagination) {
        return {
          success: true,
          data: {
            data: data.bookings,
            pagination: data.pagination,
          },
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Empty response from server" ||
          "Failed to fetch guest bookings",
      };
    } catch (error) {
      console.error("Error fetching guest bookings:", error);
      return {
        success: false,
        message: "Failed to fetch guest bookings",
      };
    }
  }

  async updateBookingStatus(
    bookingId: string,
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUNDED"
  ): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${bookingId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Notification Stats
  async getNotificationStats(): Promise<
    ApiResponse<{
      total: number;
      unread: number;
      read: number;
    }>
  > {
    return this.request<{
      total: number;
      unread: number;
      read: number;
    }>("/notifications/stats");
  }

  // Reviews
  async getMyReviews(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Review>>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PaginatedResponse<Review>>(
      `/reviews/my-reviews?${params.toString()}`
    );
  }

  async getHostReviews(
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      reviews: Review[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    try {
      // Fetch and normalize various possible backend response shapes into { reviews, pagination }
      type Pagination = {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
      type ReviewsShape = { reviews?: Review[]; pagination?: Pagination };

      const response = await this.request<
        | ReviewsShape
        | PaginatedResponse<Review>
        | { message: string; reviews?: Review[]; pagination?: Pagination }
      >(`/reviews/host/reviews?${params.toString()}`);

      console.log("🔍 Raw host reviews API response:", response);

      const isPaginated = (d: unknown): d is PaginatedResponse<Review> => {
        return (
          typeof d === "object" &&
          d !== null &&
          Array.isArray((d as { data?: unknown }).data) &&
          typeof (d as { pagination?: unknown }).pagination === "object"
        );
      };

      const isReviewsShape = (d: unknown): d is ReviewsShape => {
        return (
          typeof d === "object" &&
          d !== null &&
          Array.isArray((d as { reviews?: unknown }).reviews) &&
          typeof (d as { pagination?: unknown }).pagination === "object"
        );
      };

      // Handle case where response.data exists
      if (response.data) {
        const dataUnknown = response.data as unknown;
        console.log("🔍 Processing response.data:", dataUnknown);

        if (isPaginated(dataUnknown)) {
          console.log("✅ Found PaginatedResponse format");
          return {
            success: true,
            data: {
              reviews: dataUnknown.data,
              pagination: dataUnknown.pagination,
            },
          };
        }
        if (
          isReviewsShape(dataUnknown) &&
          dataUnknown.reviews &&
          dataUnknown.pagination
        ) {
          console.log("✅ Found ReviewsShape format");
          return {
            success: true,
            data: {
              reviews: dataUnknown.reviews,
              pagination: dataUnknown.pagination,
            },
          };
        }
      }

      // Handle case where response itself has the structure
      const responseUnknown = response as unknown;
      console.log("🔍 Checking response structure directly:", responseUnknown);

      if (isPaginated(responseUnknown)) {
        console.log("✅ Found PaginatedResponse format in response root");
        return {
          success: true,
          data: {
            reviews: responseUnknown.data,
            pagination: responseUnknown.pagination,
          },
        };
      }

      if (
        isReviewsShape(responseUnknown) &&
        responseUnknown.reviews &&
        responseUnknown.pagination
      ) {
        console.log("✅ Found ReviewsShape format in response root");
        return {
          success: true,
          data: {
            reviews: responseUnknown.reviews,
            pagination: responseUnknown.pagination,
          },
        };
      }

      // Handle case where backend returns { message, reviews, pagination } directly
      if (
        typeof responseUnknown === "object" &&
        responseUnknown !== null &&
        "message" in responseUnknown &&
        "reviews" in responseUnknown &&
        Array.isArray((responseUnknown as { reviews: unknown }).reviews) &&
        "pagination" in responseUnknown
      ) {
        console.log("✅ Found direct message/reviews/pagination format");
        const directResponse = responseUnknown as {
          message: string;
          reviews: Review[];
          pagination: Pagination;
        };
        return {
          success: true,
          message: directResponse.message,
          data: {
            reviews: directResponse.reviews,
            pagination: directResponse.pagination,
          },
        };
      }

      console.log("⚠️ No matching format found, using fallback");
      // Fallback - return empty data but preserve success status
      return {
        success: !!response.success,
        message: response.message || "No reviews found",
        data: {
          reviews: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: limit || 10,
          },
        },
      };
    } catch (error) {
      console.error("❌ Error in getHostReviews:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch host reviews",
        data: {
          reviews: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: limit || 10,
          },
        },
      };
    }
  }

  async getReviewStats(): Promise<
    ApiResponse<{
      totalReviews: number;
      averageRating: number;
      fiveStarReviews: number;
      fourStarReviews: number;
      threeStarReviews: number;
      twoStarReviews: number;
      oneStarReviews: number;
    }>
  > {
    return this.request<{
      totalReviews: number;
      averageRating: number;
      fiveStarReviews: number;
      fourStarReviews: number;
      threeStarReviews: number;
      twoStarReviews: number;
      oneStarReviews: number;
    }>("/reviews/stats");
  }

  async getHostReviewStats(): Promise<
    ApiResponse<{
      totalReviews: number;
      averageRating: number;
      ratingBreakdown: { [key: string]: number };
      recentReviews?: number;
    }>
  > {
    type BackendStats = {
      totalReviews?: number;
      averageRating?: number;
      ratingBreakdown?: { [key: string]: number };
      ratingDistribution?: { [key: string]: number };
      fiveStarReviews?: number;
      fourStarReviews?: number;
      threeStarReviews?: number;
      twoStarReviews?: number;
      oneStarReviews?: number;
      recentReviews?: number;
    };

    type Envelope =
      | { stats?: BackendStats }
      | { data?: { stats?: BackendStats } }
      | BackendStats;

    try {
      const response = await this.request<Envelope>("/reviews/host/stats");

      const rawStats: BackendStats | undefined =
        (response as { data?: { stats?: BackendStats } }).data?.stats ??
        (response as { stats?: BackendStats }).stats ??
        ((response as { data?: unknown }).data
          ? undefined
          : (response as unknown as BackendStats));

      if (!rawStats) {
        return {
          success: false,
          message: response.message || "Failed to fetch host review stats",
        };
      }

      const breakdown: { [key: string]: number } = rawStats.ratingBreakdown ||
        rawStats.ratingDistribution || {
          "5": rawStats.fiveStarReviews || 0,
          "4": rawStats.fourStarReviews || 0,
          "3": rawStats.threeStarReviews || 0,
          "2": rawStats.twoStarReviews || 0,
          "1": rawStats.oneStarReviews || 0,
        };

      return {
        success: true,
        data: {
          totalReviews: rawStats.totalReviews || 0,
          averageRating: rawStats.averageRating || 0,
          ratingBreakdown: breakdown,
          recentReviews: rawStats.recentReviews || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching host review stats:", error);
      return { success: false, message: "Failed to fetch host review stats" };
    }
  }

  // Wallet
  async getWalletDetails(): Promise<ApiResponse<Wallet>> {
    return this.request<Wallet>("/wallet/details");
  }

  async getRefundHistory(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PaginatedResponse<Transaction>>(
      `/wallet/refunds?${params.toString()}`
    );
  }

  async getGuestWithdrawalHistory(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<PaginatedResponse<Transaction>>(
      `/wallet/withdrawals?${params.toString()}`
    );
  }

  async processRefund(
    bookingId: string,
    data: { reason: string; amount: number }
  ): Promise<ApiResponse<{ transaction: Transaction }>> {
    return this.request<{ transaction: Transaction }>(
      `/wallet/refund/${bookingId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async withdrawFunds(data: {
    amount: number;
    bankDetails: {
      accountNumber: string;
      bankName: string;
    };
  }): Promise<ApiResponse<{ transaction: Transaction }>> {
    return this.request<{ transaction: Transaction }>("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Host-specific Wallet Functions
  async getHostEarnings(
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      earnings: Array<{
        id: string;
        amount: number;
        currency: string;
        type: string;
        status: string;
        description: string;
        reference: string;
        metadata: {
          bookingId: string;
          propertyId: string;
        };
        hostServiceFee: number;
        guestServiceFee: number;
        platformRevenue: number;
        netAmount: number;
        walletId: string;
        userId: string;
        bookingId: string;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return this.request<{
      earnings: Array<{
        id: string;
        amount: number;
        currency: string;
        type: string;
        status: string;
        description: string;
        reference: string;
        metadata: {
          bookingId: string;
          propertyId: string;
        };
        hostServiceFee: number;
        guestServiceFee: number;
        platformRevenue: number;
        netAmount: number;
        walletId: string;
        userId: string;
        bookingId: string;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/wallet/earnings?${params.toString()}`);
  }

  async getHostWalletBalance(): Promise<
    ApiResponse<{
      balance: number;
      currency: string;
      isActive: boolean;
      walletId: string;
    }>
  > {
    return this.request<{
      balance: number;
      currency: string;
      isActive: boolean;
      walletId: string;
    }>("/wallet/balance");
  }

  async withdrawFromWallet(data: {
    amount: number;
    withdrawalMethod: "MOBILE_MONEY" | "BANK_TRANSFER";
    phone?: string;
    bankDetails?: {
      accountNumber: string;
      bankName: string;
    };
  }): Promise<
    ApiResponse<{
      transaction: {
        id: string;
        amount: number;
        currency: string;
        type: string;
        status: string;
        description: string;
        reference: string;
        metadata: {
          paymentMethod: string;
          accountNumber?: string;
          withdrawalFee: number;
          netAmount: number;
        };
        createdAt: string;
      };
      withdrawalFees: {
        originalAmount: number;
        withdrawalFee: number;
        netAmount: number;
        feePercentage: number;
      };
      newBalance: number;
    }>
  > {
    return this.request<{
      transaction: {
        id: string;
        amount: number;
        currency: string;
        type: string;
        status: string;
        description: string;
        reference: string;
        metadata: {
          paymentMethod: string;
          accountNumber?: string;
          withdrawalFee: number;
          netAmount: number;
        };
        createdAt: string;
      };
      withdrawalFees: {
        originalAmount: number;
        withdrawalFee: number;
        netAmount: number;
        feePercentage: number;
      };
      newBalance: number;
    }>("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getWithdrawalHistory(
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      withdrawals: Array<{
        id: string;
        amount: number;
        currency: string;
        type: string;
        status: string;
        description: string;
        reference: string;
        metadata: {
          paymentMethod: string;
          accountNumber: string;
          withdrawalFee: number;
          netAmount: number;
          fapshiTransactionId?: string;
        };
        createdAt: string;
        updatedAt: string;
      }>;
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

    return this.request<{
      withdrawals: Array<{
        id: string;
        amount: number;
        currency: string;
        type: string;
        status: string;
        description: string;
        reference: string;
        metadata: {
          paymentMethod: string;
          accountNumber: string;
          withdrawalFee: number;
          netAmount: number;
          fapshiTransactionId?: string;
        };
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/wallet/withdrawals?${params.toString()}`);
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

  async getEnquiryStats(): Promise<
    ApiResponse<{
      total: number;
      unread: number;
      pending: number;
      responded: number;
      closed: number;
      spam: number;
    }>
  > {
    return this.request<{
      total: number;
      unread: number;
      pending: number;
      responded: number;
      closed: number;
      spam: number;
    }>("/enquiries/stats");
  }

  async getEnquiry(id: string): Promise<
    ApiResponse<{
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
  > {
    return this.request<{
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
    }>(`/enquiries/${id}`);
  }

  async respondToEnquiry(
    enquiryId: string,
    response: string
  ): Promise<
    ApiResponse<{
      message: string;
      enquiry: {
        id: string;
        response: string;
        respondedAt: string;
        status: string;
      };
    }>
  > {
    return this.request<{
      message: string;
      enquiry: {
        id: string;
        response: string;
        respondedAt: string;
        status: string;
      };
    }>(`/enquiries/${enquiryId}/respond`, {
      method: "POST",
      body: JSON.stringify({ response }),
    });
  }

  async updateEnquiryStatus(
    enquiryId: string,
    status: "PENDING" | "RESPONDED" | "CLOSED" | "SPAM"
  ): Promise<
    ApiResponse<{
      message: string;
      enquiry: {
        id: string;
        status: string;
      };
    }>
  > {
    return this.request<{
      message: string;
      enquiry: {
        id: string;
        status: string;
      };
    }>(`/enquiries/${enquiryId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Host Application
  async submitHostApplication(data: { notes?: string }): Promise<
    ApiResponse<{
      id: string;
      userId: string;
      status: string;
      notes?: string;
      applicationDate: string;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    return this.request<{
      id: string;
      userId: string;
      status: string;
      notes?: string;
      applicationDate: string;
      createdAt: string;
      updatedAt: string;
    }>("/host-applications/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async applyToBecomeHost(data: {
    propertyAddress: string;
    propertyType: "APARTMENT" | "HOUSE" | "VILLA" | "CONDO" | "STUDIO";
    propertyDescription: string;
    experience: string;
    reason: string;
    additionalNotes?: string;
  }): Promise<
    ApiResponse<{
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
      submittedAt: string;
      estimatedReviewTime: string;
    }>
  > {
    return this.request<{
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
      submittedAt: string;
      estimatedReviewTime: string;
    }>("/host-applications/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getHostApplicationStatus(): Promise<
    ApiResponse<{
      status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
      submittedAt: string;
      reviewedAt?: string;
      notes?: string;
      rejectionReason?: string;
    }>
  > {
    return this.request<{
      status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
      submittedAt: string;
      reviewedAt?: string;
      notes?: string;
      rejectionReason?: string;
    }>("/host-applications/status");
  }

  async getHostPropertyStats(): Promise<
    ApiResponse<{
      totalProperties: number;
      availableProperties: number;
      totalBookings: number;
      averageRating: number;
      totalEarnings: number;
      monthlyEarnings: number;
    }>
  > {
    const response = await this.request<{
      message: string;
      stats: {
        totalProperties: number;
        availableProperties: number;
        totalBookings: number;
        averageRating: number;
        totalEarnings: number;
        monthlyEarnings: number;
      };
    }>("/properties/host/stats");

    // Transform the response to match our expected format
    if (response.data && response.data.stats) {
      return {
        success: true,
        data: {
          totalProperties: response.data.stats.totalProperties || 0,
          availableProperties: response.data.stats.availableProperties || 0,
          totalBookings: response.data.stats.totalBookings || 0,
          averageRating: response.data.stats.averageRating || 0,
          totalEarnings: response.data.stats.totalEarnings || 0,
          monthlyEarnings: response.data.stats.monthlyEarnings || 0,
        },
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch property stats",
    };
  }

  // Convenience wrapper for host dashboard stats (same endpoint as user dashboard)
  async getHostDashboardStats(): Promise<
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
    // Reuse same endpoint used for dashboard stats
    return this.request<{
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
    }>("/users/dashboard-stats");
  }

  // Host Enquiries
  async getHostEnquiries(
    page?: number,
    limit?: number,
    status?: string
  ): Promise<
    ApiResponse<{
      enquiries: Array<Record<string, unknown>>;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    const resp = await this.request<
      | {
          enquiries?: Array<Record<string, unknown>>;
          pagination?: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
          };
        }
      | PaginatedResponse<Record<string, unknown>>
    >(`/enquiries/?${params.toString()}`);

    if (resp.data) {
      const dUnknown = resp.data as unknown;
      const hasDirectShape = (
        x: unknown
      ): x is {
        enquiries: Array<Record<string, unknown>>;
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      } =>
        typeof x === "object" &&
        x !== null &&
        Array.isArray((x as { enquiries?: unknown }).enquiries) &&
        typeof (x as { pagination?: unknown }).pagination === "object";

      const isPaginated = (
        x: unknown
      ): x is PaginatedResponse<Record<string, unknown>> =>
        typeof x === "object" &&
        x !== null &&
        Array.isArray((x as { data?: unknown }).data) &&
        typeof (x as { pagination?: unknown }).pagination === "object";

      if (hasDirectShape(dUnknown)) {
        return { success: true, data: dUnknown };
      }
      if (isPaginated(dUnknown)) {
        return {
          success: true,
          data: {
            enquiries: dUnknown.data,
            pagination: dUnknown.pagination,
          },
        };
      }
    }

    return {
      success: !!resp.success,
      message: resp.message,
      data: {
        enquiries: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit || 10,
        },
      },
    };
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
