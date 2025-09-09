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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
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

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (!response.ok) {
        console.error("❌ API request failed:", data);
        throw new Error(data.message || "An error occurred");
      }

      console.log("✅ API request successful");
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Don't add auth header for guest properties endpoint
    // if (this.token) {
    //   headers.Authorization = `Bearer ${this.token}`;
    // }

    try {
      const response = await fetch(url, {
        headers,
      });

      const data = await response.json();

      console.log("API Response:", {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
      });

      if (!response.ok) {
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Ensure the response has the expected structure
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

      const data = await response.json();
      console.log("🔍 Raw API response:", data);

      if (!response.ok) {
        console.error("Property API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(data.message || "An error occurred");
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
