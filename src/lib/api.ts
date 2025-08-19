const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "ADMIN" | "HOST" | "GUEST";
    isVerified: boolean;
    avatar: string | null;
    createdAt: string;
  };
  token: string;
}

// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "HOST" | "GUEST";
  isVerified: boolean;
  avatar: string | null;
  hostApprovalStatus?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: string;
  stats?: {
    totalProperties: number;
    totalBookings: number;
    totalEarnings: number;
  };
}

// Property types
export interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  isVerified: boolean;
  host?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviews?: {
    averageRating: number;
    totalReviews: number;
  };
  bookings?: {
    totalBookings: number;
  };
  createdAt: string;
}

// Booking types
export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  paymentStatus: string;
  paymentMethod: string;
  property: {
    id: string;
    title: string;
    host: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

// Analytics types
export interface PlatformOverview {
  users: {
    total: number;
    guests: number;
    hosts: number;
    admins: number;
    newThisMonth: number;
  };
  properties: {
    total: number;
    verified: number;
    pending: number;
    available: number;
    newThisMonth: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    newThisMonth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    platformFees: number;
    averageBookingValue: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    thisMonth: number;
  };
}

// Revenue types
export interface RevenueData {
  totalRevenue: number;
  platformFees: number;
  hostEarnings: number;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    bookings: number;
    platformFees: number;
  }>;
  topEarningHosts: Array<{
    hostId: string;
    hostName: string;
    totalEarnings: number;
    properties: number;
    bookings: number;
  }>;
}

export interface RevenueConfiguration {
  id: string;
  name: string;
  description: string;
  hostServiceFeePercent: number;
  hostServiceFeeMin: number;
  hostServiceFeeMax: number | null;
  guestServiceFeePercent: number;
  guestServiceFeeMin: number;
  guestServiceFeeMax: number | null;
  isActive: boolean;
  appliesToBooking: boolean;
  appliesToWithdrawal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeBreakdown {
  originalAmount: number;
  fees: {
    host: {
      percentage: number;
      amount: number;
      description: string;
    };
    guest: {
      percentage: number;
      amount: number;
      description: string;
    };
  };
  totals: {
    guestPays: number;
    hostReceives: number;
    platformRevenue: number;
  };
  currency: string;
}

export interface RevenueStats {
  totalRevenue: number;
  hostFees: number;
  guestFees: number;
  withdrawalFees: number;
  transactionCount: number;
  breakdown: {
    HOST_FEE: number;
    GUEST_FEE: number;
    WITHDRAWAL_FEE: number;
  };
  period: {
    start: string;
    end: string;
  };
}

// Blog Management interfaces
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  tags: BlogTag[];
  _count: {
    comments: number;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    blogs: number;
  };
}

export interface BlogComment {
  id: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

// Help Center Management interfaces
export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category:
    | "GETTING_STARTED"
    | "BOOKING"
    | "PAYMENT"
    | "ACCOUNT"
    | "TROUBLESHOOTING";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface HelpCenterStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  categoryStats: Array<{
    _count: { id: number };
    category: string;
  }>;
  priorityStats: Array<{
    _count: { id: number };
    priority: string;
  }>;
  topArticles: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    helpfulCount: number;
    category: string;
  }>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    console.log("API Client: Setting token:", token ? "Present" : "Missing");
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log("API Client: Making request with token");
    } else {
      console.log("API Client: Making request without token");
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const url = `${this.baseUrl}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Your API returns the data directly
        return {
          success: true,
          data: data,
          message: data.message || "Login successful",
        };
      } else {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // User endpoints
  async getUsers(params?: {
    role?: string;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: User[]; pagination: PaginationInfo }>> {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append("role", params.role);
    if (params?.isVerified !== undefined)
      searchParams.append("isVerified", params.isVerified.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return this.request<{ users: User[]; pagination: PaginationInfo }>(
      `/admin/users?${searchParams}`
    );
  }

  async getUser(id: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/admin/users/${id}`);
  }

  async updateUser(
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async suspendUser(
    id: string,
    reason: string,
    duration: string
  ): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/admin/users/${id}/suspend`, {
      method: "PUT",
      body: JSON.stringify({ reason, duration }),
    });
  }

  // Property endpoints
  async getProperties(params?: {
    isVerified?: boolean;
    type?: string;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{ properties: Property[]; pagination: PaginationInfo }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.isVerified !== undefined)
      searchParams.append("isVerified", params.isVerified.toString());
    if (params?.type) searchParams.append("type", params.type);
    if (params?.city) searchParams.append("city", params.city);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return this.request<{ properties: Property[]; pagination: PaginationInfo }>(
      `/admin/properties?${searchParams}`
    );
  }

  async verifyProperty(
    id: string,
    isVerified: boolean,
    notes?: string
  ): Promise<ApiResponse<{ property: Property }>> {
    return this.request<{ property: Property }>(
      `/admin/properties/${id}/verify`,
      {
        method: "PUT",
        body: JSON.stringify({ isVerified, notes }),
      }
    );
  }

  async deleteProperty(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/properties/${id}`, {
      method: "DELETE",
    });
  }

  // Booking endpoints
  async getBookings(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{ bookings: Booking[]; pagination: PaginationInfo }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return this.request<{ bookings: Booking[]; pagination: PaginationInfo }>(
      `/admin/bookings?${searchParams}`
    );
  }

  async updateBookingStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/admin/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    });
  }

  // Analytics endpoints
  async getPlatformOverview(): Promise<ApiResponse<PlatformOverview>> {
    try {
      const url = `${this.baseUrl}/admin/analytics/overview`;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      console.log("Making request to:", url);
      console.log("Token:", this.token ? "Present" : "Missing");

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        return {
          success: true,
          data: data.data || data, // Handle both wrapped and unwrapped responses
          message: data.message || "Data fetched successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to fetch analytics data",
        };
      }
    } catch (error) {
      console.error("Analytics API request failed:", error);
      throw error;
    }
  }

  async getRevenueAnalytics(params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<RevenueData>> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);

    return this.request<RevenueData>(
      `/admin/analytics/revenue?${searchParams}`
    );
  }

  // Revenue Configuration endpoints
  async getRevenueConfigs(): Promise<ApiResponse<RevenueConfiguration[]>> {
    return this.request<RevenueConfiguration[]>("/revenue/configs");
  }

  async createRevenueConfig(data: {
    name: string;
    description: string;
    hostServiceFeePercent: number;
    hostServiceFeeMin: number;
    hostServiceFeeMax?: number;
    guestServiceFeePercent: number;
    guestServiceFeeMin: number;
    guestServiceFeeMax?: number;
    isActive?: boolean;
    appliesToBooking: boolean;
    appliesToWithdrawal: boolean;
  }): Promise<ApiResponse<RevenueConfiguration>> {
    return this.request<RevenueConfiguration>("/revenue/configs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRevenueConfig(
    id: string,
    data: Partial<RevenueConfiguration>
  ): Promise<ApiResponse<RevenueConfiguration>> {
    return this.request<RevenueConfiguration>(`/revenue/configs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async activateRevenueConfig(
    id: string
  ): Promise<ApiResponse<RevenueConfiguration>> {
    return this.request<RevenueConfiguration>(
      `/revenue/configs/${id}/activate`,
      {
        method: "PUT",
      }
    );
  }

  // Fee calculation endpoints
  async getFeeBreakdown(params: {
    amount: number;
    currency: string;
  }): Promise<ApiResponse<FeeBreakdown>> {
    const searchParams = new URLSearchParams();
    searchParams.append("amount", params.amount.toString());
    searchParams.append("currency", params.currency);

    return this.request<FeeBreakdown>(`/revenue/fee-breakdown?${searchParams}`);
  }

  async calculateFees(data: {
    amount: number;
    currency: string;
  }): Promise<ApiResponse<FeeBreakdown>> {
    return this.request<FeeBreakdown>("/revenue/calculate-fees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Revenue statistics endpoints
  async getRevenueStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<RevenueStats>> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);

    return this.request<RevenueStats>(`/revenue/stats?${searchParams}`);
  }

  async getCurrentMonthRevenueStats(): Promise<ApiResponse<RevenueStats>> {
    try {
      console.log("API Client: Making request to /revenue/stats/current-month");
      const response = await this.request<RevenueStats>(
        "/revenue/stats/current-month"
      );
      console.log("API Client: Revenue stats response:", response);
      return response;
    } catch (error) {
      console.error("API Client: Revenue stats request failed:", error);
      throw error;
    }
  }

  // Blog Management endpoints
  async getBlogPosts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    tag?: string;
    search?: string;
  }): Promise<ApiResponse<{ blogs: BlogPost[]; pagination: PaginationInfo }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.tag) searchParams.append("tag", params.tag);
    if (params?.search) searchParams.append("search", params.search);

    return this.request<{ blogs: BlogPost[]; pagination: PaginationInfo }>(
      `/blog?${searchParams}`
    );
  }

  async createBlogPost(data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    tagIds?: string[];
  }): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>("/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(
    id: string,
    data: Partial<BlogPost>
  ): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/blog/${id}`, {
      method: "DELETE",
    });
  }

  async getBlogTags(): Promise<ApiResponse<BlogTag[]>> {
    return this.request<BlogTag[]>("/blog/tags");
  }

  async createBlogTag(data: {
    name: string;
    slug: string;
  }): Promise<ApiResponse<BlogTag>> {
    return this.request<BlogTag>("/blog/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async moderateBlogComment(
    id: string,
    data: { isApproved: boolean }
  ): Promise<ApiResponse<BlogComment>> {
    return this.request<BlogComment>(`/blog/comments/${id}/moderate`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Help Center Management endpoints
  async getHelpArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    priority?: string;
    search?: string;
    isPublished?: boolean;
  }): Promise<
    ApiResponse<{ articles: HelpArticle[]; pagination: PaginationInfo }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.category) searchParams.append("category", params.category);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.isPublished !== undefined)
      searchParams.append("isPublished", params.isPublished.toString());

    return this.request<{
      articles: HelpArticle[];
      pagination: PaginationInfo;
    }>(`/help-center?${searchParams}`);
  }

  async createHelpArticle(data: {
    title: string;
    slug: string;
    content: string;
    category:
      | "GETTING_STARTED"
      | "BOOKING"
      | "PAYMENT"
      | "ACCOUNT"
      | "TROUBLESHOOTING";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    isPublished: boolean;
  }): Promise<ApiResponse<HelpArticle>> {
    return this.request<HelpArticle>("/help-center", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateHelpArticle(
    id: string,
    data: Partial<HelpArticle>
  ): Promise<ApiResponse<HelpArticle>> {
    return this.request<HelpArticle>(`/help-center/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteHelpArticle(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/help-center/${id}`, {
      method: "DELETE",
    });
  }

  async getHelpCenterStats(): Promise<ApiResponse<HelpCenterStats>> {
    return this.request<HelpCenterStats>("/help-center/stats/overview");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Initialize token from localStorage if available
if (typeof window !== "undefined") {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    try {
      const authData = JSON.parse(authStorage);
      if (authData.state?.token) {
        apiClient.setToken(authData.state.token);
        console.log("Token restored from localStorage");
      }
    } catch (error) {
      console.error("Failed to restore token from localStorage:", error);
    }
  }
}
