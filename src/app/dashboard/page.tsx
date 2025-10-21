"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Property } from "@/types";
import {
  Card,
  Divider,
  Input,
  Textarea,
  Select,
  ToastContainer,
  Modal,
  Loader,
} from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import {
  Home,
  Calendar,
  Star,
  DollarSign,
  Bell,
  MapPin,
  Wallet,
  MessageSquare,
  UserCheck,
  LogOut,
  ChevronRight,
  User,
  BookOpen,
  Clock,
  CheckCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  X,
  AlertCircle,
  Heart,
  Search,
  RefreshCw,
} from "lucide-react";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import { buildImageUrl } from "@/lib/utils";

interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalHostBookings: number;
  totalReviews: number;
  averageRating: number;
  totalSpent: number;
  currency: string;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  availableProperties: number;
  bookedProperties: number;
  unreadNotifications: number;
  favorites?: number;
}

interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  type: "PAYMENT" | "REFUND" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  reference?: string;
  createdAt: string;
  booking?: {
    id: string;
    property: {
      title: string;
      address: string;
    };
  };
}

type DashboardSection =
  | "overview"
  | "bookings"
  | "properties"
  | "reviews"
  | "favorites"
  | "wallet"
  | "notifications"
  | "enquiries"
  | "host-application"
  | "profile";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalBookings: 0,
    totalHostBookings: 0,
    totalReviews: 0,
    averageRating: 0,
    totalSpent: 0,
    currency: "XAF",
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalEarnings: 0,
    availableProperties: 0,
    bookedProperties: 0,
    unreadNotifications: 0,
  });

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletCurrency, setWalletCurrency] = useState("XAF");
  const [walletTransactions, setWalletTransactions] = useState<
    WalletTransaction[]
  >([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletStats, setWalletStats] = useState({
    totalTransactions: 0,
    totalPayments: 0,
    totalRefunds: 0,
    totalWithdrawals: 0,
    grossEarnings: 0,
    netEarnings: 0,
  });
  const [transactionsPagination, setTransactionsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Host-specific wallet state
  const [hostWalletBalance, setHostWalletBalance] = useState(0);
  const [hostWalletCurrency, setHostWalletCurrency] = useState("XAF");
  const [hostWalletId, setHostWalletId] = useState<string>("");
  const [hostWalletActive, setHostWalletActive] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [hostWalletLoading, setHostWalletLoading] = useState(false);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<string | null>(
    null
  );
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    withdrawalMethod: "MOBILE_MONEY" as
      | "MOBILE_MONEY"
      | "MTN_MOMO"
      | "ORANGE_MONEY",
    phone: "",
    bankDetails: {
      accountNumber: "",
      bankName: "",
    },
  });

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationStats, setNotificationStats] = useState<any>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );
  const [notificationsPagination, setNotificationsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [notificationFilter, setNotificationFilter] = useState<string>("ALL");
  const [notificationPreferences, setNotificationPreferences] =
    useState<any>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [preferencesForm, setPreferencesForm] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookingNotifications: true,
    reviewNotifications: true,
    paymentNotifications: true,
  });

  // Profile state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Host application state
  const [hostApplicationStatus, setHostApplicationStatus] = useState<any>(null);
  const [hostApplicationLoading, setHostApplicationLoading] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    propertyAddress: "",
    propertyType: "APARTMENT" as
      | "APARTMENT"
      | "HOUSE"
      | "VILLA"
      | "CONDO"
      | "STUDIO",
    propertyDescription: "",
    experience: "",
    reason: "",
    additionalNotes: "",
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState<string | null>(
    null
  );

  // Bookings state
  const [hostBookings, setHostBookings] = useState<any[]>([]);
  const [guestBookings, setGuestBookings] = useState<any[]>([]);

  // Properties state
  const [hostProperties, setHostProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [propertiesPagination, setPropertiesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingProperty, setDeletingProperty] = useState(false);

  // Booking management state
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [updatingAction, setUpdatingAction] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState<string>("ALL");
  const [showBookingMenu, setShowBookingMenu] = useState<string | null>(null);
  const [bookingsPagination, setBookingsPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  // Reviews state
  const [hostReviews, setHostReviews] = useState<any[]>([]);
  const [guestReviews, setGuestReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Enquiries state
  const [hostEnquiries, setHostEnquiries] = useState<any[]>([]);
  const [guestEnquiries, setGuestEnquiries] = useState<any[]>([]);
  const [enquiryStats, setEnquiryStats] = useState<any>(null);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState<string | null>(null);
  const [enquiriesPagination, setEnquiriesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [enquiryFilter, setEnquiryFilter] = useState<string>("ALL");
  const [respondingToEnquiry, setRespondingToEnquiry] = useState<string | null>(
    null
  );
  const [enquiryResponse, setEnquiryResponse] = useState<string>("");
  const [showResponseModal, setShowResponseModal] = useState<string | null>(
    null
  );

  // Favorites state
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [favoritesPagination, setFavoritesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    if (user && user.role && (user.role === "HOST" || user.role === "GUEST")) {
      fetchDashboardData();
      fetchWalletData();
      if (user && user.role === "HOST") {
        // Try to fetch host-specific data, but don't let failures break the dashboard
        Promise.allSettled([
          fetchHostApplicationStatus(),
          fetchHostBookings(),
          fetchHostProperties(),
          fetchHostReviews(),
          fetchReviewStats(),
          fetchHostEnquiries(),
          fetchEnquiryStats(),
        ]).then((results) => {
          results.forEach((result, index) => {
            if (result.status === "rejected") {
              console.warn(`Host data fetch ${index} failed:`, result.reason);
            }
          });
        });
      } else {
        // Try to fetch guest-specific data, but don't let failures break the dashboard
        Promise.allSettled([
          fetchGuestBookings(),
          fetchGuestReviews(),
          fetchReviewStats(),
          fetchGuestEnquiries(),
          fetchEnquiryStats(),
          fetchGuestFavorites(),
        ]).then((results) => {
          results.forEach((result, index) => {
            if (result.status === "rejected") {
              console.warn(`Guest data fetch ${index} failed:`, result.reason);
            }
          });
        });
      }
    }
  }, [user]);

  // Debug pagination state changes
  useEffect(() => {
    console.log("🔍 Reviews pagination state changed:", reviewsPagination);
  }, [reviewsPagination]);

  // Debug enquiries pagination state changes
  useEffect(() => {
    console.log("🔍 Enquiries pagination state changed:", enquiriesPagination);
  }, [enquiriesPagination]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      console.log("Current user:", user);
      console.log("User role:", user.role);

      // For HOST users, fetch comprehensive dashboard stats
      if (user && user.role === "HOST") {
        console.log("User is HOST, fetching comprehensive dashboard stats...");
        try {
          const dashboardStatsResponse =
            await apiClient.getHostDashboardStats();
          console.log("Host dashboard stats response:", dashboardStatsResponse);

          if (dashboardStatsResponse.success && dashboardStatsResponse.data) {
            const data = dashboardStatsResponse.data?.data;
            console.log("Host dashboard stats data:", data);

            // Update stats with comprehensive dashboard data
            setStats((prev) => ({
              ...prev,
              // Overview stats

              totalReviews:
                data.reviews?.total || data.overview?.totalReviews || 0,
              totalSpent: data.overview?.totalSpent || 0,
              currency: data.financial?.currency || "XAF",

              // Host-specific stats
              totalProperties: data.hostStats?.totalProperties || 0,
              totalEarnings: data.hostStats?.totalNetEarnings || 0,
              availableProperties: data.hostStats?.totalProperties || 0, // Will be updated by property stats
              bookedProperties: 0, // Will be calculated
              // Notification stats
              unreadNotifications: 0, // Will be updated by notification stats
            }));

            // Update wallet data from dashboard financial data
            if (data.hostStats) {
              console.log("Host stats:", data.hostStats.totalGrossEarnings);
              setWalletBalance(data.financial.walletBalance || 0);
              setWalletCurrency(data.financial.currency || "XAF");
              // Use dashboard stats financial data for consistency

              setWalletStats((prev) => ({
                ...prev,
                totalPayments: data.financial.totalSpent || 0, // Use totalSpent as totalPayments
                totalRefunds: 0, // Will be updated by wallet balance API
                grossEarnings: data.hostStats.totalGrossEarnings || 0,
                netEarnings: data.hostStats.totalNetEarnings || 0,
              }));
            }

            // Fetch host-specific wallet data
            await fetchHostWalletData();

            // Fetch notification data
            await fetchNotifications();
            await fetchNotificationStats();
            await fetchNotificationPreferences();
          }
        } catch (dashboardError) {
          console.warn(
            "Host dashboard stats API not available:",
            dashboardError
          );

          // Fallback to individual API calls
          await fetchIndividualHostStats();
        }
      } else {
        // For GUEST users, fetch guest dashboard stats
        try {
          const dashboardStatsResponse = await apiClient.getDashboardStats();
          console.log(
            "Guest dashboard stats response:",
            dashboardStatsResponse
          );

          if (dashboardStatsResponse.success && dashboardStatsResponse.data) {
            const data = dashboardStatsResponse.data.data;

            setStats((prev) => ({
              ...prev,
              activeBookings: data.overview?.activeBookings || 0,
              completedBookings: data.bookings?.completed || 0,
              cancelledBookings: data.bookings?.cancelled || 0,
              totalSpent: data.overview?.totalSpent || 0,
              totalBookings: data.overview?.totalBookings || 0,
              totalReviews:
                data.reviews?.total || data.overview?.totalReviews || 0,
              averageRating: data.overview?.averageRating || 0,
              currency: data.financial?.currency || "XAF",
            }));

            // Update wallet data from dashboard financial data
            if (data.financial) {
              setWalletBalance(data.financial.walletBalance || 0);
              setWalletCurrency(data.financial.currency || "XAF");
              // Use dashboard stats financial data for consistency
              setWalletStats((prev) => ({
                ...prev,
                totalPayments: data.financial.totalSpent || 0, // Use totalSpent as totalPayments
                totalRefunds: 0, // Will be updated by wallet balance API
                totalWithdrawals: 0,
              }));
            }
          }
        } catch (guestDashboardError) {
          console.warn(
            "Guest dashboard stats API not available:",
            guestDashboardError
          );

          // Fallback to individual API calls
          await fetchIndividualGuestStats();
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualHostStats = async () => {
    // Fetch property stats
    try {
      const propertyStatsResponse = await apiClient.getPropertyStats();
      console.log("Property stats response:", propertyStatsResponse);

      if (propertyStatsResponse.success && propertyStatsResponse.data) {
        const data = propertyStatsResponse.data;
        setStats((prev) => ({
          ...prev,
          totalProperties: data.totalProperties || 0,
          availableProperties: data.availableProperties || 0,
          totalEarnings: data.totalEarnings || 0,
        }));
      }
    } catch (propertyError) {
      console.warn("Property stats API not available:", propertyError);
    }

    // Fetch booking stats
    try {
      const bookingStatsResponse = await apiClient.getBookingStats();
      if (bookingStatsResponse.success && bookingStatsResponse.data) {
        const data = bookingStatsResponse.data;
        setStats((prev) => ({
          ...prev,
          totalBookings: data.totalBookings || 0,
          activeBookings: data.activeBookings || 0,
          completedBookings: data.completedBookings || 0,
          cancelledBookings: data.cancelledBookings || 0,
        }));
      }
    } catch (bookingError) {
      console.warn("Booking stats API not available:", bookingError);
    }

    // Fetch notification stats
    try {
      const notificationStatsResponse = await apiClient.getNotificationStats();
      if (notificationStatsResponse.success && notificationStatsResponse.data) {
        const data = notificationStatsResponse.data;
        setStats((prev) => ({
          ...prev,
          unreadNotifications: data.unreadNotifications || 0,
        }));
      }
    } catch (notificationError) {
      console.warn("Notification stats API not available:", notificationError);
    }
  };

  const fetchIndividualGuestStats = async () => {
    // Fetch booking stats
    try {
      const bookingStatsResponse = await apiClient.getBookingStats();
      if (bookingStatsResponse.success && bookingStatsResponse.data) {
        setStats((prev) => ({
          ...prev,
          totalBookings: bookingStatsResponse.data.totalBookings || 0,
          activeBookings: bookingStatsResponse.data.activeBookings || 0,
          completedBookings: bookingStatsResponse.data.completedBookings || 0,
          cancelledBookings: bookingStatsResponse.data.cancelledBookings || 0,
          totalSpent: bookingStatsResponse.data.totalSpent || 0,
        }));
      }
    } catch (bookingError) {
      console.warn("Booking stats API not available:", bookingError);
    }

    // Fetch notification stats
    try {
      const notificationStatsResponse = await apiClient.getNotificationStats();
      if (notificationStatsResponse.success && notificationStatsResponse.data) {
        setStats((prev) => ({
          ...prev,
          unreadNotifications:
            notificationStatsResponse.data.unreadNotifications || 0,
        }));
      }
    } catch (notificationError) {
      console.warn("Notification stats API not available:", notificationError);
    }
  };

  const fetchWalletData = async () => {
    try {
      setWalletLoading(true);

      // Try to fetch wallet balance
      try {
        const balanceResponse = await apiClient.getWalletBalance();
        if (balanceResponse.success && balanceResponse.data) {
          // Only update balance and currency, don't override dashboard stats data
          if (walletBalance === 0) {
            setWalletBalance(balanceResponse.data.data.balance || 0);
          }
          if (walletCurrency === "XAF") {
            setWalletCurrency(balanceResponse.data.data.currency || "XAF");
          }
          // Update wallet stats with the comprehensive data from wallet balance API
          setWalletStats((prev) => ({
            ...prev,
            totalTransactions: balanceResponse.data.data.totalTransactions || 0,
            totalPayments: balanceResponse.data.data.totalPayments || 0,
            totalRefunds: balanceResponse.data.data.totalRefunds || 0,
            totalWithdrawals: balanceResponse.data.data.totalWithdrawals || 0,
          }));
          console.log("Wallet stats:", walletStats);
        }
      } catch (balanceError) {
        console.warn("Wallet balance API not available:", balanceError);
      }

      // Fetch transactions with pagination
      await fetchTransactions(1);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  const fetchHostApplicationStatus = async () => {
    try {
      setHostApplicationLoading(true);
      console.log("🔍 Fetching host application status...");

      const response = await apiClient.getHostApplicationStatus();
      console.log("🔍 Host application status response:", response);

      if (response.success && response.data) {
        // Normalize API shapes:
        // - New shape (user payload): { hostApprovalStatus, hostApprovalDate, hostApprovalNotes, ... }
        // - Old shape (status payload): { status, reviewedAt, notes }
        const raw: any = response.data;
        const normalized = {
          status: (raw.status || raw.hostApprovalStatus || "").toUpperCase(),
          reviewedAt: raw.reviewedAt || raw.hostApprovalDate || undefined,
          notes: raw.notes || raw.hostApprovalNotes || undefined,
          submittedAt: raw.submittedAt || raw.hostApplicationDate || undefined,
          rejectionReason:
            raw.rejectionReason || raw.hostRejectionReason || undefined,
        };
        console.log(
          "🔍 Setting host application status (normalized):",
          normalized
        );
        setHostApplicationStatus(normalized as any);
      } else {
        console.log("🔍 No host application status data:", response);
      }
    } catch (err) {
      console.warn("Host application status API not available:", err);
    } finally {
      setHostApplicationLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingApplication(true);
    setApplicationError(null);
    setApplicationSuccess(null);

    try {
      const response = await apiClient.applyToBecomeHost(applicationForm);
      if (response.success && response.data) {
        setApplicationSuccess(
          "Application submitted successfully! We'll review it and get back to you soon."
        );
        setHostApplicationStatus(response.data);
        // Reset form
        setApplicationForm({
          propertyAddress: "",
          propertyType: "APARTMENT",
          propertyDescription: "",
          experience: "",
          reason: "",
          additionalNotes: "",
        });
      } else {
        setApplicationError(
          response.message || "Failed to submit application. Please try again."
        );
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setApplicationError("Failed to submit application. Please try again.");
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setApplicationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchHostBookings = async (page: number = 1) => {
    try {
      console.log("Fetching host bookings...");
      const response = await apiClient.getHostBookings(undefined, page, 10);
      console.log("Host bookings response:", response);

      if (response.success && response.data) {
        setHostBookings(response.data.data || []);
        setHostBookings(response.data.data || []);
        setBookingsPagination({
          page: parseInt(response.data.pagination?.page) || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          total: parseInt(response.data.pagination?.total) || 0,
          limit: parseInt(response.data.pagination?.limit) || 10,
        });
        // Update stats with total bookings from bookings API
        setStats((prev) => ({
          ...prev,
          totalHostBookings: response.data?.pagination?.total || 0,
        }));
      }
    } catch (err) {
      console.warn("Host bookings API not available:", err);
    }
  };

  const fetchGuestBookings = async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ) => {
    try {
      const response = await apiClient.getGuestBookings(status, page, limit);
      if (response.success && response.data) {
        // Map API shape: { bookings: Booking[], pagination: { page, limit, total, totalPages } }
        const bookings =
          (response.data as any).bookings || (response.data as any).data || [];
        const p = (response.data as any).pagination || {};

        setGuestBookings(bookings);
        setBookingsPagination({
          currentPage: response.data.pagination?.page || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalItems: response.data.pagination?.totalItems || 0,
          itemsPerPage: response.data.pagination?.limit || 10,
        });
        // Update stats with total bookings from bookings API
        setStats((prev) => ({
          ...prev,
          totalBookings: response.data?.pagination?.total || 0,
        }));
      }
    } catch (err) {
      console.warn("Guest bookings API not available:", err);
    }
  };

  const fetchHostReviews = async (page: number = 1) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);

      const response = await apiClient.getHostReviews(page, 10);

      if (response.success && response.data) {
        setHostReviews(response.data.reviews || []);

        // Ensure pagination values are valid numbers
        const pagination = response.data.pagination || {};

        const newPagination = {
          currentPage: Math.max(
            1,
            parseInt(String(pagination.page || pagination.currentPage || 1))
          ),
          totalPages: Math.max(
            1,
            parseInt(String(pagination.pages || pagination.totalPages || 1))
          ),
          totalItems: Math.max(
            0,
            parseInt(String(pagination.total || pagination.totalItems || 0))
          ),
          itemsPerPage: Math.max(
            1,
            parseInt(String(pagination.limit || pagination.itemsPerPage || 10))
          ),
        };

        console.log("🔍 Setting new pagination state:", newPagination);
        setReviewsPagination(newPagination);
        // Update overview totalReviews from reviews API total
        setStats((prev) => ({
          ...prev,
          totalReviews: newPagination.totalItems,
        }));
      } else {
        console.log(
          "❌ Setting reviews error:",
          response.message || "Failed to fetch reviews"
        );
        setReviewsError(response.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("❌ Error fetching host reviews:", err);
      setReviewsError("Failed to load reviews. Please try again.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchGuestReviews = async (page: number = 1) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);

      const response = await apiClient.getMyReviews(page, 10);
      console.log("Guest reviews response:", response);

      if (response.success && response.data) {
        console.log("✅ Setting guest reviews:", response.data.data);
        console.log("✅ Setting guest pagination:", response.data.pagination);

        setGuestReviews(response.data.data || []);

        // Ensure pagination values are valid numbers (same as host reviews)
        const pagination = response.data.pagination || {};
        console.log("🔍 Raw guest pagination from API:", pagination);
        console.log("🔍 Parsed guest pagination values:", {
          currentPage: parseInt(
            String(pagination.page || pagination.currentPage || 1)
          ),
          totalPages: parseInt(
            String(pagination.pages || pagination.totalPages || 1)
          ),
          totalItems: parseInt(
            String(pagination.total || pagination.totalItems || 0)
          ),
          itemsPerPage: parseInt(
            String(pagination.limit || pagination.itemsPerPage || 10)
          ),
        });

        const newPagination = {
          currentPage: Math.max(
            1,
            parseInt(String(pagination.page || pagination.currentPage || 1))
          ),
          totalPages: Math.max(
            1,
            parseInt(String(pagination.pages || pagination.totalPages || 1))
          ),
          totalItems: Math.max(
            0,
            parseInt(String(pagination.total || pagination.totalItems || 0))
          ),
          itemsPerPage: Math.max(
            1,
            parseInt(String(pagination.limit || pagination.itemsPerPage || 10))
          ),
        };

        console.log("🔍 Setting new guest pagination state:", newPagination);
        setReviewsPagination(newPagination);
      } else {
        console.log(
          "❌ Setting guest reviews error:",
          response.message || "Failed to fetch reviews"
        );
        setReviewsError(response.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching guest reviews:", err);
      setReviewsError("Failed to load reviews. Please try again.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response =
        user?.role === "HOST"
          ? await apiClient.getHostReviewStats()
          : await apiClient.getReviewStats();

      console.log("Review stats response:", response);

      if (response.success && response.data) {
        setReviewStats(response.data);
      } else {
        console.warn("Review stats API returned error:", response.message);
        // Don't throw error, just log as warning
      }
    } catch (err) {
      console.warn("Review stats API not available:", err);
      // Don't throw error, just log as warning
    }
  };

  const fetchHostEnquiries = async (page: number = 1, status?: string) => {
    if (!user || user.role !== "HOST") return;
    try {
      setEnquiriesLoading(true);
      setEnquiriesError(null);

      const response = await apiClient.getEnquiries(
        status,
        undefined,
        undefined,
        page,
        10
      );
      console.log("Host enquiries response:", response);

      if (response.success && response.data) {
        console.log("✅ Setting host enquiries:", response.data.enquiries);
        console.log(
          "✅ Setting host enquiries pagination:",
          response.data.pagination
        );

        setHostEnquiries(response.data.data.enquiries || []);

        // Ensure pagination values are valid numbers
        const pagination = response.data.pagination || {};
        console.log("🔍 Raw host enquiries pagination from API:", pagination);
        console.log("🔍 Parsed host enquiries pagination values:", {
          currentPage: parseInt(
            String(pagination.page || pagination.currentPage || 1)
          ),
          totalPages: parseInt(
            String(pagination.pages || pagination.totalPages || 1)
          ),
          totalItems: parseInt(
            String(pagination.total || pagination.totalItems || 0)
          ),
          itemsPerPage: parseInt(
            String(pagination.limit || pagination.itemsPerPage || 10)
          ),
        });

        const newPagination = {
          currentPage: Math.max(
            1,
            parseInt(String(pagination.page || pagination.currentPage || 1))
          ),
          totalPages: Math.max(
            1,
            parseInt(String(pagination.pages || pagination.totalPages || 1))
          ),
          totalItems: Math.max(
            0,
            parseInt(String(pagination.total || pagination.totalItems || 0))
          ),
          itemsPerPage: Math.max(
            1,
            parseInt(String(pagination.limit || pagination.itemsPerPage || 10))
          ),
        };

        console.log(
          "🔍 Setting new host enquiries pagination state:",
          newPagination
        );
        setEnquiriesPagination(newPagination);
      } else {
        console.log(
          "❌ Setting host enquiries error:",
          response.message || "Failed to fetch enquiries"
        );
        setEnquiriesError(response.message || "Failed to fetch enquiries");
      }
    } catch (err) {
      console.warn("Host enquiries API not available:", err);
      // Don't set error state for permissions issues, just log as warning
      setEnquiriesError(null);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const fetchGuestEnquiries = async (page: number = 1) => {
    try {
      setEnquiriesLoading(true);
      setEnquiriesError(null);

      const response = await apiClient.getEnquiries(
        undefined,
        undefined,
        undefined,
        page,
        10
      );
      console.log("Guest enquiries response:", response);

      if (response.success && response.data) {
        console.log("✅ Setting guest enquiries:", response.data.enquiries);
        console.log(
          "✅ Setting guest enquiries pagination:",
          response.data.pagination
        );

        setGuestEnquiries(response.data.data.enquiries || []);

        // Ensure pagination values are valid numbers
        const pagination = response.data.pagination || {};
        console.log("🔍 Raw guest enquiries pagination from API:", pagination);
        console.log("🔍 Parsed guest enquiries pagination values:", {
          currentPage: parseInt(
            String(pagination.page || pagination.currentPage || 1)
          ),
          totalPages: parseInt(
            String(pagination.pages || pagination.totalPages || 1)
          ),
          totalItems: parseInt(
            String(pagination.total || pagination.totalItems || 0)
          ),
          itemsPerPage: parseInt(
            String(pagination.limit || pagination.itemsPerPage || 10)
          ),
        });

        const newPagination = {
          currentPage: Math.max(
            1,
            parseInt(String(pagination.page || pagination.currentPage || 1))
          ),
          totalPages: Math.max(
            1,
            parseInt(String(pagination.pages || pagination.totalPages || 1))
          ),
          totalItems: Math.max(
            0,
            parseInt(String(pagination.total || pagination.totalItems || 0))
          ),
          itemsPerPage: Math.max(
            1,
            parseInt(String(pagination.limit || pagination.itemsPerPage || 10))
          ),
        };

        console.log(
          "🔍 Setting new guest enquiries pagination state:",
          newPagination
        );
        setEnquiriesPagination(newPagination);
      } else {
        console.log(
          "❌ Setting guest enquiries error:",
          response.message || "Failed to fetch enquiries"
        );
        setEnquiriesError(response.message || "Failed to fetch enquiries");
      }
    } catch (err) {
      console.error("Error fetching guest enquiries:", err);
      setEnquiriesError("Failed to load enquiries. Please try again.");
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const fetchEnquiryStats = async () => {
    try {
      const response = await apiClient.getEnquiryStats();
      console.log("🔍 Enquiry stats response:", response);

      if (response.success && response.data) {
        console.log("🔍 Setting enquiry stats:", response.data);
        setEnquiryStats(response.data.data);
      }
    } catch (err) {
      console.warn("Enquiry stats API not available:", err);
    }
  };

  const fetchGuestFavorites = async (page: number = 1) => {
    try {
      setFavoritesLoading(true);
      setFavoritesError(null);

      const response = await apiClient.getFavorites(page, 10);
      console.log("Guest favorites response:", response);

      if (response.success && response.data) {
        console.log("✅ Setting guest favorites:", response.data.favorites);
        console.log(
          "✅ Setting guest favorites pagination:",
          response.data.pagination
        );

        setFavorites(response.data.data.favorites || []);

        // Ensure pagination values are valid numbers
        const pagination = response.data.pagination || {};
        console.log("🔍 Raw guest favorites pagination from API:", pagination);

        const newPagination = {
          currentPage: Math.max(
            1,
            parseInt(String(pagination.page || pagination.currentPage || 1))
          ),
          totalPages: Math.max(
            1,
            parseInt(String(pagination.pages || pagination.totalPages || 1))
          ),
          totalItems: Math.max(
            0,
            parseInt(String(pagination.total || pagination.totalItems || 0))
          ),
          itemsPerPage: Math.max(
            1,
            parseInt(String(pagination.limit || pagination.itemsPerPage || 10))
          ),
        };

        console.log(
          "🔍 Setting new guest favorites pagination state:",
          newPagination
        );
        setFavoritesPagination(newPagination);

        // Update favorites count in overview stats
        setStats((prev) => ({
          ...prev,
          favorites: response.data.data.favorites.length,
        }));
      } else {
        console.log(
          "❌ Setting guest favorites error:",
          response.message || "Failed to fetch favorites"
        );
        setFavoritesError(response.message || "Failed to fetch favorites");
      }
    } catch (err) {
      console.error("Error fetching guest favorites:", err);
      setFavoritesError("Failed to load favorites. Please try again.");
    } finally {
      setFavoritesLoading(false);
    }
  };

  const fetchHostProperties = async (page: number = 1) => {
    try {
      setPropertiesLoading(true);
      setPropertiesError(null);

      console.log("🔍 Fetching host properties for user:", {
        userId: user?.id,
        userRole: user?.role,
        page: page,
      });

      // Check if user is a host
      if (user?.role !== "HOST") {
        console.log("❌ User is not a host, cannot fetch host properties");
        setPropertiesError("Only hosts can view properties");
        return;
      }

      // Check if user has host approval
      console.log("🔍 User host approval status:", user?.hostApprovalStatus);

      if (user?.hostApprovalStatus === "PENDING") {
        console.log("❌ User host application is pending approval");
        setPropertiesError(
          "Your host application is pending approval. You'll be able to view properties once approved."
        );
        return;
      } else if (user?.hostApprovalStatus === "REJECTED") {
        console.log("❌ User host application was rejected");
        setPropertiesError(
          "Your host application was rejected. Please contact support for more information."
        );
        return;
      } else if (user?.hostApprovalStatus !== "APPROVED") {
        console.log("❌ User is not an approved host");
        setPropertiesError(
          "You need to be an approved host to view properties. Please apply to become a host first."
        );
        return;
      }

      const response = await apiClient.getHostProperties(page, 10);
      console.log("🔍 Raw API response:", response);
      console.log("🔍 Response success:", response.success);
      console.log("🔍 Response data:", response.data);
      console.log("🔍 Response data type:", typeof response.data);
      console.log(
        "🔍 Response data keys:",
        response.data ? Object.keys(response.data) : "No data"
      );
      console.log("🔍 Response message:", response.data?.message);
      console.log("🔍 Response error:", response.data?.error);

      if (response.success && response.data) {
        setHostProperties(response.data.properties);
        setStats((prev) => ({
          ...prev,
          totalProperties: response.data.pagination.total || 0,
        }));
        setPropertiesPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.total,
          itemsPerPage: response.data.pagination.limit,
        });
      } else {
        console.log("❌ Response not successful or no data");
        console.log("❌ Response success:", response.success);
        console.log("❌ Response data:", response.data);
        setPropertiesError(response.message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error("Error fetching host properties:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      setPropertiesError(`Failed to load properties: ${err.message}`);
    } finally {
      setPropertiesLoading(false);
    }
  };

  // Fetch all transactions without pagination
  // Fetch transactions with pagination
  const fetchTransactions = async (page: number = 1) => {
    try {
      setWalletLoading(true);
      const transactionsResponse = await apiClient.getTransactionHistory(
        undefined, // type - fetch all types
        page,
        10 // items per page
      );

      if (transactionsResponse.success && transactionsResponse.data) {
        // Parse the actual API response structure
        const transactionData = transactionsResponse.data.data as unknown as {
          transactions?: WalletTransaction[];
          pagination?: {
            page: number;
            limit: number;
            total: number;
            pages: number;
          };
        };

        const transactions = transactionData.transactions || [];
        console.log("Transactions:", transactions);
        setWalletTransactions(transactions);

        // Update pagination state
        if (transactionData.pagination) {
          setTransactionsPagination({
            currentPage: transactionData.pagination.page,
            totalPages: transactionData.pagination.pages,
            totalItems: transactionData.pagination.total,
            itemsPerPage: transactionData.pagination.limit,
          });
        }

        console.log(
          "Loaded dashboard wallet transactions:",
          transactions.length,
          "transactions, page:",
          page
        );
      } else {
        console.log("No dashboard transactions data:", transactionsResponse);
      }
    } catch (transactionError) {
      console.warn("Transaction history API not available:", transactionError);
    } finally {
      setWalletLoading(false);
    }
  };

  // Host Wallet Functions
  const fetchHostWalletData = async () => {
    if (!user || user.role !== "HOST") return;

    try {
      setHostWalletLoading(true);
      console.log("🔍 Fetching host wallet data...");

      // Fetch host wallet balance
      const balanceResponse = await apiClient.getHostWalletBalance();
      console.log("🔍 Host wallet balance response:", balanceResponse);

      if (balanceResponse.success && balanceResponse.data) {
        setHostWalletBalance(balanceResponse.data.balance);
        setHostWalletCurrency(balanceResponse.data.currency);
        setHostWalletId(balanceResponse.data.walletId);
        setHostWalletActive(balanceResponse.data.isActive);
        console.log("✅ Host wallet balance updated:", balanceResponse.data);
      }

      // Fetch withdrawal history
      const withdrawalResponse = await apiClient.getWithdrawalHistory(1, 10);
      console.log("🔍 Withdrawal history response:", withdrawalResponse);

      if (withdrawalResponse.success && withdrawalResponse.data) {
        setWithdrawalHistory(withdrawalResponse.data.data.withdrawals);
        console.log(
          "✅ Withdrawal history updated:",
          withdrawalResponse.data.withdrawals
        );
      }
    } catch (err) {
      console.error("Error fetching host wallet data:", err);
    } finally {
      setHostWalletLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalForm.amount || !withdrawalForm.withdrawalMethod) {
      setWithdrawalError("Please fill in all required fields");
      return;
    }

    // Validate phone for mobile money methods
    if (
      (withdrawalForm.withdrawalMethod === "MOBILE_MONEY" ||
        withdrawalForm.withdrawalMethod === "MTN_MOMO" ||
        withdrawalForm.withdrawalMethod === "ORANGE_MONEY") &&
      !withdrawalForm.phone
    ) {
      setWithdrawalError(
        "Phone number is required for mobile money withdrawals"
      );
      return;
    }

    try {
      setWithdrawalLoading(true);
      setWithdrawalError(null);

      const withdrawalData = {
        amount: parseFloat(withdrawalForm.amount),
        withdrawalMethod: withdrawalForm.withdrawalMethod,
        phone: withdrawalForm.phone,
      };

      console.log("🔍 Submitting withdrawal request:", withdrawalData);

      const response = await apiClient.withdrawFromWallet(withdrawalData);
      console.log("🔍 Withdrawal response:", response);

      if (response.success && response.data) {
        setWithdrawalSuccess("Withdrawal request submitted successfully!");
        setShowWithdrawalModal(false);
        setWithdrawalForm({
          amount: "",
          withdrawalMethod: "MOBILE_MONEY",
          phone: "",
          bankDetails: { accountNumber: "", bankName: "" },
        });

        // Refresh wallet data
        await fetchHostWalletData();
      } else {
        setWithdrawalError(response.message || "Withdrawal failed");
      }
    } catch (err) {
      console.error("Error processing withdrawal:", err);
      setWithdrawalError("Failed to process withdrawal. Please try again.");
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Notification Functions
  const fetchNotifications = async (page: number = 1, filter?: string) => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);

      const response = await apiClient.getNotifications(
        filter === "UNREAD" ? false : filter === "READ" ? true : undefined,
        page,
        10
      );

      console.log("🔍 Notifications response:", response);

      if (response.success && response.data) {
        // API returns { data: Notification[] } directly
        setNotifications(response.data.data.notifications || []);

        // Ensure pagination values are valid numbers
        const pagination = response.data.data.pagination || {};
        console.log("🔍 Raw notifications pagination from API:", pagination);
        console.log("🔍 Parsed notifications pagination values:", {
          currentPage: parseInt(
            String(pagination.page || pagination.currentPage || 1)
          ),
          totalPages: parseInt(
            String(pagination.pages || pagination.totalPages || 1)
          ),
          totalItems: parseInt(
            String(pagination.total || pagination.totalItems || 0)
          ),
          itemsPerPage: parseInt(
            String(pagination.limit || pagination.itemsPerPage || 10)
          ),
        });

        const newPagination = {
          currentPage: Math.max(
            1,
            parseInt(String(pagination.page || pagination.currentPage || 1))
          ),
          totalPages: Math.max(
            1,
            parseInt(String(pagination.pages || pagination.totalPages || 1))
          ),
          totalItems: Math.max(
            0,
            parseInt(String(pagination.total || pagination.totalItems || 0))
          ),
          itemsPerPage: Math.max(
            1,
            parseInt(String(pagination.limit || pagination.itemsPerPage || 10))
          ),
        };

        console.log(
          "🔍 Setting new notifications pagination state:",
          newPagination
        );
        setNotificationsPagination(newPagination);
      } else {
        console.log(
          "❌ Setting notifications error:",
          response.message || "Failed to fetch notifications"
        );
        setNotificationsError(
          response.message || "Failed to fetch notifications"
        );
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotificationsError("Failed to load notifications. Please try again.");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchNotificationStats = async () => {
    try {
      console.log("🔍 Fetching notification stats...");

      const response = await apiClient.getNotificationStats();
      console.log("🔍 Notification stats response:", response);

      if (response.success && response.data) {
        setNotificationStats(response.data.data);
        console.log("✅ Notification stats updated:", response.data);
      }
    } catch (err) {
      console.error("Error fetching notification stats:", err);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      setPreferencesLoading(true);
      console.log("🔍 Fetching notification preferences...");

      const response = await apiClient.getNotificationPreferences();
      console.log("🔍 Notification preferences response:", response);

      if (response.success && response.data) {
        const prefs = response.data.data || response.data;
        setNotificationPreferences(prefs);
        setPreferencesForm({
          emailNotifications: prefs.emailNotifications ?? true,
          pushNotifications: prefs.pushNotifications ?? true,
          bookingNotifications: prefs.bookingNotifications ?? true,
          reviewNotifications: prefs.reviewNotifications ?? true,
          paymentNotifications: prefs.paymentNotifications ?? true,
        });
        console.log("✅ Notification preferences updated:", prefs);
      }
    } catch (err) {
      console.error("Error fetching notification preferences:", err);
      setPreferencesError("Failed to load notification preferences");
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      console.log("🔍 Marking notification as read:", notificationId);

      const response = await apiClient.markNotificationAsRead(notificationId);
      console.log("🔍 Mark as read response:", response);

      if (response.success) {
        // Update the notification in the list
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: "READ" }
              : notification
          )
        );

        // Refresh stats
        await fetchNotificationStats();
        console.log("✅ Notification marked as read");
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log("🔍 Marking all notifications as read...");

      const response = await apiClient.markAllNotificationsAsRead();
      console.log("🔍 Mark all as read response:", response);

      if (response.success) {
        // Update all notifications in the list
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, status: "READ" }))
        );

        // Refresh stats
        await fetchNotificationStats();
        console.log("✅ All notifications marked as read");
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      console.log("🔍 Deleting notification:", notificationId);

      const response = await apiClient.deleteNotification(notificationId);
      console.log("🔍 Delete notification response:", response);

      if (response.success) {
        // Remove the notification from the list
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );

        // Refresh stats
        await fetchNotificationStats();
        console.log("✅ Notification deleted");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setPreferencesLoading(true);
      setPreferencesError(null);

      console.log("🔍 Updating notification preferences:", preferencesForm);

      const response = await apiClient.updateNotificationPreferences(
        preferencesForm
      );
      console.log("🔍 Update preferences response:", response);

      if (response.success && response.data) {
        const prefs = response.data.data || response.data;
        setNotificationPreferences(prefs);
        setShowPreferencesModal(false);
        console.log("✅ Notification preferences updated:", prefs);
      } else {
        setPreferencesError(response.message || "Failed to update preferences");
      }
    } catch (err) {
      console.error("Error updating notification preferences:", err);
      setPreferencesError("Failed to update preferences. Please try again.");
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Profile Functions
  const handleUpdateProfile = async () => {
    try {
      setProfileLoading(true);

      console.log("🔍 Updating profile:", profileForm);

      console.log("🔍 Sending profile data:", {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
      });

      let response;
      try {
        response = await apiClient.updateProfile({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
          avatar: profileForm.avatar,
        });

        console.log("🔍 Raw API response:", response);
        console.log("🔍 Response type:", typeof response);
        console.log("🔍 Response keys:", Object.keys(response));
        console.log("🔍 Response success:", response.success);
        console.log("🔍 Response data:", response.data);
        console.log("🔍 Response message:", response.message);
      } catch (apiError) {
        console.error("🔍 API call failed:", apiError);
        showError("Update Failed", "Network error. Please try again.");
        return;
      }

      // Handle different response structures
      if (response.success) {
        showSuccess(
          "Profile Updated",
          "Your profile has been updated successfully!"
        );
        console.log("✅ Profile updated successfully");

        // Update the user context with new data if available
        if (response.data?.user) {
          console.log("✅ User data updated:", response.data.user);
        }
      } else if (
        response.message &&
        response.message.includes("successfully")
      ) {
        // Handle case where API returns success message but no success field
        showSuccess("Profile Updated", response.message);
        console.log("✅ Profile updated (success message detected)");
      } else {
        showError(
          "Update Failed",
          response.message || "Failed to update profile"
        );
        console.log("❌ Profile update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showError("Update Failed", "Failed to update profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError("Validation Error", "New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showError(
        "Validation Error",
        "New password must be at least 6 characters long"
      );
      return;
    }

    try {
      setPasswordLoading(true);

      console.log("🔍 Changing password...");

      const response = await apiClient.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      console.log("🔍 Change password response:", response);

      if (response.success) {
        showSuccess(
          "Password Changed",
          "Your password has been changed successfully!"
        );
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        console.log("✅ Password changed successfully");
      } else {
        showError(
          "Password Change Failed",
          response.message || "Failed to change password"
        );
      }
    } catch (err) {
      console.error("Error changing password:", err);
      showError(
        "Password Change Failed",
        "Failed to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Populate profile form with user data
  const populateProfileForm = () => {
    if (user && user.role && (user.role === "HOST" || user.role === "GUEST")) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      console.log("✅ Profile form populated with user data:", user);
    }
  };

  // Populate profile form when user data is available
  useEffect(() => {
    if (user && user.role && (user.role === "HOST" || user.role === "GUEST")) {
      populateProfileForm();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!propertyToDelete) {
      console.error("❌ No property to delete");
      return;
    }

    try {
      setDeletingProperty(true);
      console.log("🗑️ Starting delete process for property:", propertyId);
      console.log("🗑️ Property details:", propertyToDelete);

      const response = await apiClient.deleteProperty(propertyId);
      console.log("🗑️ Delete API response:", response);

      if (response && response.success) {
        console.log("✅ Property deleted successfully!");

        // Ensure we're on the properties section
        setActiveSection("properties");

        // Close modal
        setShowDeleteModal(false);
        setPropertyToDelete(null);

        // Refresh the properties list immediately
        await fetchHostProperties(propertiesPagination.currentPage);

        // Also refresh dashboard stats to update property count
        await fetchDashboardData();

        console.log("✅ Properties list and dashboard stats refreshed");
        console.log("✅ User returned to properties section");
      } else {
        console.error("❌ Property deletion failed:", response);
        const errorMessage = response?.message || "Failed to delete property";
        console.error("Error message:", errorMessage);
        // Keep modal open to show error
        alert(`Delete failed: ${errorMessage}`);
      }
    } catch (err: any) {
      console.error("❌ Exception during property deletion:", err);
      const errorMessage =
        err?.message || "Failed to delete property. Please try again.";
      console.error("Exception message:", errorMessage);
      // Keep modal open to show error
      alert(`Delete failed: ${errorMessage}`);
    } finally {
      setDeletingProperty(false);
      console.log("🗑️ Delete process completed");
    }
  };

  const openDeleteModal = (property: { id: string; title: string }) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  ) => {
    try {
      // Enforce host-only route
      if (user?.role !== "HOST") {
        alert("Only hosts can update booking status");
        return;
      }

      // Find current booking to validate transitions
      const currentBooking = (hostBookings || []).find(
        (b) => b.id === bookingId
      );
      if (!currentBooking) {
        alert("Booking not found");
        return;
      }

      // A host can mark a booking as completed only if the booking is confirmed
      if (newStatus === "COMPLETED" && currentBooking.status !== "CONFIRMED") {
        alert("Booking can only be marked as completed when it is confirmed");
        return;
      }

      setUpdatingBooking(bookingId);
      setUpdatingAction(newStatus);
      console.log("🔄 Updating booking status:", bookingId, "to", newStatus);

      const response = await apiClient.updateBookingStatus(
        bookingId,
        newStatus
      );
      console.log("🔄 Booking status update response:", response);

      if (response.success) {
        console.log("✅ Booking status updated successfully!");

        // Close the menu immediately
        setShowBookingMenu(null);

        // Refresh bookings list with current filter
        if (user?.role === "HOST") {
          await fetchHostBookings(bookingsPagination.currentPage);
        } else {
          await fetchGuestBookings(bookingsPagination.currentPage);
        }

        // Also refresh dashboard stats
        await fetchDashboardData();
      } else {
        console.error("❌ Booking status update failed:", response);
        alert(response.message || "Failed to update booking status");
      }
    } catch (err: any) {
      console.error("❌ Error updating booking status:", err);
      alert(
        err.message || "Failed to update booking status. Please try again."
      );
    } finally {
      setUpdatingBooking(null);
      setUpdatingAction(null);
    }
  };

  const handleBookingOverview = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  const toggleBookingMenu = (bookingId: string) => {
    setShowBookingMenu(showBookingMenu === bookingId ? null : bookingId);
  };

  const handleRespondToEnquiry = async (enquiryId: string) => {
    if (!enquiryResponse.trim()) {
      alert("Please enter a response message");
      return;
    }

    // Validate response length (10-1000 characters per API spec)
    if (enquiryResponse.trim().length < 10) {
      alert("Response must be at least 10 characters long");
      return;
    }

    if (enquiryResponse.trim().length > 1000) {
      alert("Response must not exceed 1000 characters");
      return;
    }

    try {
      setRespondingToEnquiry(enquiryId);
      console.log("🔄 Responding to enquiry:", enquiryId);
      console.log("🔄 Response text:", enquiryResponse);

      const response = await apiClient.respondToEnquiry(
        enquiryId,
        enquiryResponse.trim()
      );
      console.log("🔄 Enquiry response:", response);

      if (response.success) {
        console.log("✅ Enquiry responded successfully!");

        // Close modal and clear response
        setShowResponseModal(null);
        setEnquiryResponse("");

        // Show success message
        alert(
          "Response sent successfully! The guest will be notified via email."
        );

        // Refresh enquiries list
        if (user?.role === "HOST") {
          await fetchHostEnquiries(
            enquiriesPagination.currentPage,
            enquiryFilter !== "ALL" ? enquiryFilter : undefined
          );
        } else {
          await fetchGuestEnquiries(enquiriesPagination.currentPage);
        }

        // Also refresh enquiry stats
        await fetchEnquiryStats();
      } else {
        console.error("❌ Enquiry response failed:", response);
        alert(response.message || "Failed to respond to enquiry");
      }
    } catch (err: any) {
      console.error("❌ Error responding to enquiry:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to respond to enquiry. Please try again.";
      console.error("❌ Error details:", errorMessage);
      alert(errorMessage);
    } finally {
      setRespondingToEnquiry(null);
    }
  };

  const handleUpdateEnquiryStatus = async (
    enquiryId: string,
    status: "PENDING" | "RESPONDED" | "CLOSED" | "SPAM"
  ) => {
    try {
      setRespondingToEnquiry(enquiryId);
      console.log("🔄 Updating enquiry status:", enquiryId, "to", status);

      const response = await apiClient.updateEnquiryStatus(enquiryId, status);
      console.log("🔄 Enquiry status update response:", response);

      if (response.success) {
        console.log("✅ Enquiry status updated successfully!");

        // Refresh enquiries list
        if (user?.role === "HOST") {
          await fetchHostEnquiries(
            enquiriesPagination.currentPage,
            enquiryFilter !== "ALL" ? enquiryFilter : undefined
          );
        } else {
          await fetchGuestEnquiries(enquiriesPagination.currentPage);
        }

        // Also refresh enquiry stats
        await fetchEnquiryStats();
      } else {
        console.error("❌ Enquiry status update failed:", response);
        alert(response.message || "Failed to update enquiry status");
      }
    } catch (err: any) {
      console.error("❌ Error updating enquiry status:", err);
      alert(
        err.message || "Failed to update enquiry status. Please try again."
      );
    } finally {
      setRespondingToEnquiry(null);
    }
  };

  const openResponseModal = (enquiryId: string) => {
    setShowResponseModal(enquiryId);
    setEnquiryResponse("");
  };

  const closeResponseModal = () => {
    setShowResponseModal(null);
    setEnquiryResponse("");
  };

  const handleQuickAction = (action: string) => {
    // Check if user is an approved host for host-specific features
    const isApprovedHost =
      user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED";

    switch (action) {
      case "properties":
        // Only allow access to properties if user is an approved host
        if (isApprovedHost) {
          setActiveSection("properties");
        } else {
          // Redirect to host application if not approved
          setActiveSection("host-application");
        }
        break;
      case "bookings":
        // For bookings, allow access but will show appropriate message in the section
        setActiveSection("bookings");
        break;
      case "wallet":
        // For wallet, allow access but will show appropriate message in the section
        setActiveSection("wallet");
        break;
      case "reviews":
        // For reviews, allow access but will show appropriate message in the section
        setActiveSection("reviews");
        break;
      case "enquiries":
        // For enquiries, allow access but will show appropriate message in the section
        setActiveSection("enquiries");
        break;
      case "notifications":
        setActiveSection("notifications");
        break;
      case "profile":
        setActiveSection("profile");
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSectionIcon = (section: DashboardSection) => {
    switch (section) {
      case "overview":
        return <Home className="h-5 w-5" />;
      case "bookings":
        return <Calendar className="h-5 w-5" />;
      case "properties":
        return <MapPin className="h-5 w-5" />;
      case "reviews":
        return <Star className="h-5 w-5" />;
      case "favorites":
        return <Heart className="h-5 w-5" />;
      case "wallet":
        return <Wallet className="h-5 w-5" />;
      case "notifications":
        return <Bell className="h-5 w-5" />;
      case "enquiries":
        return <MessageSquare className="h-5 w-5" />;
      case "host-application":
        return <UserCheck className="h-5 w-5" />;
      case "profile":
        return <User className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="md" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size="md" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: getSectionIcon("overview") },
    // Only show bookings for approved hosts or all users (guests can have bookings too)
    { id: "bookings", label: "Bookings", icon: getSectionIcon("bookings") },
    // Only show properties for approved hosts
    ...(user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED"
      ? [
          {
            id: "properties",
            label: "Properties",
            icon: getSectionIcon("properties"),
          },
        ]
      : []),
    // Only show reviews for hosts
    ...(user?.role === "HOST"
      ? [
          {
            id: "reviews",
            label: "Reviews",
            icon: getSectionIcon("reviews"),
          },
        ]
      : []),
    // Only show enquiries for approved hosts or all users (guests can have enquiries too)
    { id: "enquiries", label: "Enquiries", icon: getSectionIcon("enquiries") },
    // Show favorites for guests
    ...(user?.role === "GUEST"
      ? [
          {
            id: "favorites",
            label: "Favorites",
            icon: getSectionIcon("favorites"),
          },
        ]
      : []),
    // Show host onboarding for hosts who need to complete onboarding
    ...(user?.role === "HOST" &&
    user?.hostApprovalStatus &&
    user?.hostApprovalStatus !== "APPROVED"
      ? [
          {
            id: "host-onboarding",
            label: "Host Onboarding",
            icon: <User className="h-5 w-5" />,
            onClick: () => router.push("/host-onboarding"),
          },
        ]
      : []),
    // Only show wallet for approved hosts or all users (guests can have wallet too)
    { id: "wallet", label: "Wallet", icon: getSectionIcon("wallet") },
    {
      id: "notifications",
      label: "Notifications",
      icon: getSectionIcon("notifications"),
    },
    {
      id: "profile",
      label: "Profile",
      icon: getSectionIcon("profile"),
    },
  ];

  const renderOverviewSection = () => {
    console.log("Rendering overview section, stats:", stats);
    console.log("User role:", user?.role);

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 text-base">
            Here&apos;s what&apos;s happening with your{" "}
            {user?.role === "HOST" ? "properties" : "bookings"}.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.role === "HOST" ? (
            // Host-specific stats
            <>
              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Total Properties
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.totalProperties || 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Total Bookings
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.totalHostBookings}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Total Earnings
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 break-words leading-tight">
                      {formatCurrency(
                        stats?.totalEarnings || 0,
                        stats?.currency || "XAF"
                      )}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Total Reviews
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {reviewStats?.totalReviews || 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Guest-specific stats
            <>
              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Total Bookings
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.totalBookings || 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Actve Bookings
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.activeBookings || 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Spent
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 break-words leading-tight">
                      {formatCurrency(
                        stats?.totalSpent || 0,
                        stats?.currency || "XAF"
                      )}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Favorite Properties
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.favorites || 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Notifications
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {notificationsPagination.totalItems || 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {user.role === "HOST" &&
              user?.hostApprovalStatus === "APPROVED" && (
                <button
                  onClick={() => handleQuickAction("properties")}
                  className="group bg-white p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Home className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Manage Properties
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              )}

            <button
              onClick={() => handleQuickAction("bookings")}
              className="group bg-white p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user.role === "HOST" ? "View Bookings" : "My Bookings"}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>

            {user.role === "HOST" &&
              user?.hostApprovalStatus === "APPROVED" && (
                <button
                  onClick={() => handleQuickAction("wallet")}
                  className="group bg-white p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <Wallet className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        View Earnings
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              )}

            <button
              onClick={() => handleQuickAction("notifications")}
              className="group bg-white p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Notifications
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>

            {user.role === "GUEST" && (
              <button
                onClick={() => router.push("/search")}
                className="group bg-white p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Search className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Browse Properties
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity Section for Hosts */}
        {user.role === "HOST" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div
                className="bg-white rounded-xl p-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => handleQuickAction("bookings")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {hostBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {booking.property?.title || "Property"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(booking.checkIn)} -{" "}
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            booking.totalPrice,
                            booking.currency || "XAF"
                          )}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {hostBookings.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        No recent bookings
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Summary */}
              <div
                className="bg-white rounded-xl p-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">
                    Wallet Summary
                  </h3>
                  <button
                    onClick={() => handleQuickAction("wallet")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Current Balance
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(walletBalance, walletCurrency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Earnings
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(
                        stats?.totalEarnings || 0,
                        stats?.currency || "XAF"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Recent Transactions
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {walletTransactions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBookingsSection = () => {
    // Check if user is an approved host for host-specific features
    const isApprovedHost =
      user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED";

    // If user is a HOST but not approved, show appropriate message
    if (user?.role === "HOST" && !isApprovedHost) {
      let message = "";
      let actionText = "";

      if (user?.hostApprovalStatus === "PENDING") {
        message =
          "Your host application is pending approval. You'll be able to manage bookings once approved.";
      } else if (user?.hostApprovalStatus === "REJECTED") {
        message =
          "Your host application was rejected. Please contact support for more information.";
      } else {
        message = "You need to be an approved host to manage bookings.";
        actionText = "Apply to Become a Host";
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Host Bookings
            </h1>
            <p className="text-gray-600">Manage your property bookings</p>
          </div>

          <div
            className="bg-white rounded-xl p-8 text-center"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Host Access Required
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
            {actionText && (
              <button
                onClick={() => {
                  setActiveSection("host-application");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      );
    }

    const bookings = user?.role === "HOST" ? hostBookings : guestBookings;

    // Filter bookings based on selected filter
    const filteredBookings = bookings.filter((booking) => {
      if (bookingFilter === "ALL") return true;
      return booking.status === bookingFilter;
    });

    const filterOptions = [
      { value: "ALL", label: "All Bookings", count: bookings.length },
      {
        value: "PENDING",
        label: "Pending",
        count: bookings.filter((b) => b.status === "PENDING").length,
      },
      {
        value: "CONFIRMED",
        label: "Confirmed",
        count: bookings.filter((b) => b.status === "CONFIRMED").length,
      },
      {
        value: "COMPLETED",
        label: "Completed",
        count: bookings.filter((b) => b.status === "COMPLETED").length,
      },
      {
        value: "CANCELLED",
        label: "Cancelled",
        count: bookings.filter((b) => b.status === "CANCELLED").length,
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.role === "HOST" ? "Host Bookings" : "My Bookings"}
          </h1>
          <p className="text-gray-600">
            Manage your {user?.role === "HOST" ? "property" : ""} bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setBookingFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                bookingFilter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-lg p-3"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900 truncate">
                          {booking.propertyTitle || "Property"}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(booking.checkIn)} -{" "}
                        {formatDate(booking.checkOut)} • {booking.guests} guests
                        • {formatCurrency(booking.totalPrice, "XAF")}
                      </p>
                    </div>

                    {/* 3-Dot Menu */}
                    <div className="relative ml-3">
                      <button
                        onClick={() => toggleBookingMenu(booking.id)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {showBookingMenu === booking.id && (
                        <div
                          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-10"
                          style={{
                            border: "1px solid #DDDDDD",
                            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                          }}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleBookingOverview(booking.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              Overview
                            </button>

                            {user?.role === "HOST" &&
                              booking.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateBookingStatus(
                                        booking.id,
                                        "CONFIRMED"
                                      )
                                    }
                                    disabled={updatingBooking === booking.id}
                                    className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center disabled:opacity-50"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    {updatingBooking === booking.id &&
                                    updatingAction === "CONFIRMED"
                                      ? "Confirming..."
                                      : "Confirm"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateBookingStatus(
                                        booking.id,
                                        "CANCELLED"
                                      )
                                    }
                                    disabled={updatingBooking === booking.id}
                                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center disabled:opacity-50"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    {updatingBooking === booking.id &&
                                    updatingAction === "CANCELLED"
                                      ? "Declining..."
                                      : "Decline"}
                                  </button>
                                </>
                              )}

                            {user?.role === "HOST" &&
                              booking.status === "CONFIRMED" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateBookingStatus(
                                        booking.id,
                                        "COMPLETED"
                                      )
                                    }
                                    disabled={updatingBooking === booking.id}
                                    className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center disabled:opacity-50"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4"
                                      />
                                    </svg>
                                    {updatingBooking === booking.id &&
                                    updatingAction === "COMPLETED"
                                      ? "Completing..."
                                      : "Mark as Completed"}
                                  </button>
                                </>
                              )}

                            {user?.role === "GUEST" &&
                              booking.status === "PENDING" && (
                                <button
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "CANCELLED"
                                    )
                                  }
                                  disabled={updatingBooking === booking.id}
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center disabled:opacity-50"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                  {updatingBooking === booking.id &&
                                  updatingAction === "CANCELLED"
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </button>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No {bookingFilter.toLowerCase()} bookings found
                </p>
                <p className="text-xs text-gray-500">
                  {bookingFilter === "ALL"
                    ? user?.role === "HOST"
                      ? "No bookings for your properties yet"
                      : "You haven't made any bookings yet"
                    : `No ${bookingFilter.toLowerCase()} bookings available`}
                </p>
              </div>
            )}

            {/* Pagination */}
            {bookingsPagination.totalPages > 1 && (
              <div
                className="flex items-center justify-between mt-6 pt-6"
                style={{
                  borderTop: "1px solid #DDDDDD",
                }}
              >
                <div className="text-sm text-gray-600">
                  {(() => {
                    const totalItems = bookingsPagination.totalItems || 0;
                    const currentPage = bookingsPagination.currentPage || 1;
                    const itemsPerPage = bookingsPagination.itemsPerPage || 10;

                    if (totalItems === 0) {
                      return "No bookings found";
                    }

                    const startItem = (currentPage - 1) * itemsPerPage + 1;
                    const endItem = Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    );

                    return `Showing ${startItem} to ${endItem} of ${totalItems} bookings`;
                  })()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (user?.role === "HOST") {
                        fetchHostBookings(bookingsPagination.currentPage - 1);
                      } else {
                        fetchGuestBookings(bookingsPagination.currentPage - 1);
                      }
                    }}
                    disabled={bookingsPagination.currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      bookingsPagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      {
                        length: Math.min(5, bookingsPagination.totalPages),
                      },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={(e) => {
                              e.preventDefault();
                              if (user?.role === "HOST") {
                                fetchHostBookings(pageNum);
                              } else {
                                fetchGuestBookings(pageNum);
                              }
                            }}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              bookingsPagination.currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (user?.role === "HOST") {
                        fetchHostBookings(bookingsPagination.currentPage + 1);
                      } else {
                        fetchGuestBookings(bookingsPagination.currentPage + 1);
                      }
                    }}
                    disabled={
                      bookingsPagination.currentPage ===
                      bookingsPagination.totalPages
                    }
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      bookingsPagination.currentPage ===
                      bookingsPagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderReviewsSection = () => {
    // Check if user is an approved host for host-specific features
    const isApprovedHost =
      user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED";

    // If user is a HOST but not approved, show appropriate message
    if (user?.role === "HOST" && !isApprovedHost) {
      let message = "";
      let actionText = "";

      if (user?.hostApprovalStatus === "PENDING") {
        message =
          "Your host application is pending approval. You'll be able to manage reviews once approved.";
      } else if (user?.hostApprovalStatus === "REJECTED") {
        message =
          "Your host application was rejected. Please contact support for more information.";
      } else {
        message = "You need to be an approved host to manage reviews.";
        actionText = "Apply to Become a Host";
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Property Reviews
            </h1>
            <p className="text-gray-600">
              Reviews from guests about your properties
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-8 text-center"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Host Access Required
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
            {actionText && (
              <button
                onClick={() => {
                  setActiveSection("host-application");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      );
    }

    const reviews = user?.role === "HOST" ? hostReviews : guestReviews;

    const renderStarRating = (rating: number) => {
      return (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      );
    };

    const renderRatingBreakdown = () => {
      if (!reviewStats?.ratingBreakdown) return null;

      const breakdown = reviewStats.ratingBreakdown;
      const total = reviewStats?.totalReviews || 0;

      return (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = breakdown[rating] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.role === "HOST" ? "Property Reviews" : "My Reviews"}
          </h1>
          <p className="text-gray-600">
            {user?.role === "HOST"
              ? "Reviews from guests about your properties"
              : "Reviews you've written for properties"}
          </p>
        </div>

        {/* Review Stats */}
        {reviewStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {reviewStats?.totalReviews || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold text-gray-900">
                      {reviewStats.averageRating
                        ? reviewStats.averageRating.toFixed(1)
                        : "0"}
                    </p>
                    {reviewStats.averageRating && (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(reviewStats.averageRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-900 font-bold"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {user?.role === "HOST" &&
              reviewStats.recentReviews !== undefined && (
                <div
                  className="bg-white p-6 rounded-xl"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Recent Reviews
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {reviewStats.recentReviews}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Rating Breakdown */}
        {user?.role === "HOST" && reviewStats?.ratingBreakdown && (
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rating Breakdown
            </h2>
            {renderRatingBreakdown()}
          </div>
        )}

        {/* Reviews List */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          {reviewsLoading ? (
            <div className="text-center py-12">
              <Loader size="md" label="Loading reviews..." className="py-2" />
            </div>
          ) : reviewsError ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-red-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Error loading reviews
              </p>
              <p className="text-xs text-gray-500">{reviewsError}</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg p-4"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {user?.role === "HOST"
                            ? `${review.user?.firstName || "Guest"} ${
                                review.user?.lastName || ""
                              }`
                            : review.property?.title || "Property"}
                        </h3>
                        {renderStarRating(review.rating)}
                      </div>

                      {user?.role === "HOST" && review.property?.title && (
                        <p className="text-sm text-gray-600 mb-2">
                          {review.property.title}
                        </p>
                      )}

                      <p className="text-sm text-gray-700 mb-2">
                        {review.comment}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No reviews found
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === "HOST"
                  ? "No reviews for your properties yet"
                  : "You haven't written any reviews yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {reviewsPagination.totalPages > 1 && (
            <div
              className="flex items-center justify-between mt-6 pt-6"
              style={{
                borderTop: "1px solid #DDDDDD",
              }}
            >
              <div className="text-sm text-gray-600">
                {(() => {
                  const totalItems = reviewsPagination.totalItems || 0;
                  const currentPage = reviewsPagination.currentPage || 1;
                  const itemsPerPage = reviewsPagination.itemsPerPage || 10;
                  const reviews =
                    user?.role === "HOST" ? hostReviews : guestReviews;

                  console.log(
                    "🔍 Pagination info - totalItems:",
                    totalItems,
                    "currentPage:",
                    currentPage,
                    "reviews length:",
                    reviews?.length
                  );

                  // If we have reviews but totalItems is 0, use the actual count
                  const actualTotalItems =
                    totalItems > 0 ? totalItems : reviews?.length || 0;

                  if (actualTotalItems === 0) {
                    return "No reviews found";
                  }

                  const startItem = (currentPage - 1) * itemsPerPage + 1;
                  const endItem = Math.min(
                    currentPage * itemsPerPage,
                    actualTotalItems
                  );

                  return `Showing ${startItem} to ${endItem} of ${actualTotalItems} reviews`;
                })()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(
                      "🔍 Previous button clicked - reviewsPagination:",
                      reviewsPagination
                    );
                    const prevPage = Math.max(
                      1,
                      reviewsPagination.currentPage - 1
                    );
                    console.log(
                      "🔍 Previous button clicked - current page:",
                      reviewsPagination.currentPage,
                      "prev page:",
                      prevPage,
                      "is disabled:",
                      reviewsPagination.currentPage <= 1
                    );
                    if (user?.role === "HOST") {
                      console.log(
                        "🔍 Fetching host reviews for page:",
                        prevPage
                      );
                      fetchHostReviews(prevPage);
                    } else {
                      console.log(
                        "🔍 Fetching guest reviews for page:",
                        prevPage
                      );
                      fetchGuestReviews(prevPage);
                    }
                  }}
                  disabled={reviewsPagination.currentPage <= 1}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    reviewsPagination.currentPage <= 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={{
                    pointerEvents:
                      reviewsPagination.currentPage <= 1 ? "none" : "auto",
                  }}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {(() => {
                    const totalPages = reviewsPagination.totalPages || 1;
                    const currentPage = reviewsPagination.currentPage || 1;
                    const maxVisiblePages = 5;

                    console.log(
                      "🔍 Rendering pagination - currentPage:",
                      currentPage,
                      "totalPages:",
                      totalPages,
                      "reviewsPagination:",
                      reviewsPagination
                    );

                    // Calculate start and end page numbers to show
                    let startPage = Math.max(
                      1,
                      currentPage - Math.floor(maxVisiblePages / 2)
                    );
                    let endPage = Math.min(
                      totalPages,
                      startPage + maxVisiblePages - 1
                    );

                    // Adjust start page if we're near the end
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    return pages.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(
                            "🔍 Page number button clicked - page:",
                            pageNum,
                            "user role:",
                            user?.role
                          );
                          if (user?.role === "HOST") {
                            console.log(
                              "🔍 Fetching host reviews for page:",
                              pageNum
                            );
                            fetchHostReviews(pageNum);
                          } else {
                            console.log(
                              "🔍 Fetching guest reviews for page:",
                              pageNum
                            );
                            fetchGuestReviews(pageNum);
                          }
                        }}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(
                      "🔍 Next button clicked - reviewsPagination:",
                      reviewsPagination
                    );
                    const nextPage = Math.min(
                      reviewsPagination.totalPages,
                      reviewsPagination.currentPage + 1
                    );
                    console.log(
                      "🔍 Next button clicked - current page:",
                      reviewsPagination.currentPage,
                      "next page:",
                      nextPage,
                      "total pages:",
                      reviewsPagination.totalPages,
                      "is disabled:",
                      reviewsPagination.currentPage >=
                        reviewsPagination.totalPages
                    );
                    if (user?.role === "HOST") {
                      console.log(
                        "🔍 Fetching host reviews for page:",
                        nextPage
                      );
                      fetchHostReviews(nextPage);
                    } else {
                      console.log(
                        "🔍 Fetching guest reviews for page:",
                        nextPage
                      );
                      fetchGuestReviews(nextPage);
                    }
                  }}
                  disabled={
                    reviewsPagination.currentPage >=
                    reviewsPagination.totalPages
                  }
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    reviewsPagination.currentPage >=
                    reviewsPagination.totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={{
                    pointerEvents:
                      reviewsPagination.currentPage >=
                      reviewsPagination.totalPages
                        ? "none"
                        : "auto",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEnquiriesSection = () => {
    // Check if user is an approved host for host-specific features
    const isApprovedHost =
      user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED";

    // If user is a HOST but not approved, show appropriate message
    if (user?.role === "HOST" && !isApprovedHost) {
      let message = "";
      let actionText = "";

      if (user?.hostApprovalStatus === "PENDING") {
        message =
          "Your host application is pending approval. You'll be able to manage enquiries once approved.";
      } else if (user?.hostApprovalStatus === "REJECTED") {
        message =
          "Your host application was rejected. Please contact support for more information.";
      } else {
        message = "You need to be an approved host to manage enquiries.";
        actionText = "Apply to Become a Host";
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Property Enquiries
            </h1>
            <p className="text-gray-600">
              Enquiries from guests about your properties
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-8 text-center"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Host Access Required
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
            {actionText && (
              <button
                onClick={() => {
                  setActiveSection("host-application");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      );
    }

    const enquiries = user?.role === "HOST" ? hostEnquiries : guestEnquiries;

    console.log("🔍 Enquiries section debug:", {
      userRole: user?.role,
      hostEnquiries: hostEnquiries,
      guestEnquiries: guestEnquiries,
      selectedEnquiries: enquiries,
      enquiryStats: enquiryStats,
      enquiryFilter: enquiryFilter,
      enquiriesLength: enquiries?.length,
    });

    const getStatusColor = (status: string) => {
      switch (status) {
        case "PENDING":
          return "bg-yellow-100 text-yellow-800";
        case "RESPONDED":
          return "bg-green-100 text-green-800";
        case "CLOSED":
          return "bg-gray-100 text-gray-800";
        case "SPAM":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "URGENT":
          return "bg-red-100 text-red-800";
        case "HIGH":
          return "bg-orange-100 text-orange-800";
        case "NORMAL":
          return "bg-blue-100 text-blue-800";
        case "LOW":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    // Filter enquiries based on selected filter
    const filteredEnquiries = enquiries.filter((enquiry) => {
      if (enquiryFilter === "ALL") return true;
      return enquiry.status === enquiryFilter;
    });

    const filterOptions = [
      { value: "ALL", label: "All Enquiries", count: enquiries.length },
      {
        value: "PENDING",
        label: "Pending",
        count: enquiries.filter((e) => e.status === "PENDING").length,
      },
      {
        value: "RESPONDED",
        label: "Responded",
        count: enquiries.filter((e) => e.status === "RESPONDED").length,
      },
      {
        value: "CLOSED",
        label: "Closed",
        count: enquiries.filter((e) => e.status === "CLOSED").length,
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.role === "HOST" ? "Property Enquiries" : "My Enquiries"}
          </h1>
          <p className="text-gray-600">
            {user?.role === "HOST"
              ? "Enquiries from guests about your properties"
              : "Enquiries you've sent to property hosts"}
          </p>
        </div>

        {/* Enquiry Stats */}
        {enquiryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Enquiries
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {enquiryStats.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {enquiryStats.pending || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Responded</p>
                  <p className="text-xl font-bold text-gray-900">
                    {enquiryStats.responded || 0}
                  </p>
                </div>
              </div>
            </div>

            {user?.role === "HOST" && (
              <div
                className="bg-white p-6 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread</p>
                    <p className="text-xl font-bold text-gray-900">
                      {enquiryStats.unread || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setEnquiryFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                enquiryFilter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        {/* Enquiries List */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          {enquiriesLoading ? (
            <div className="text-center py-12">
              <Loader size="md" label="Loading..." className="py-2" />
              <p className="text-sm text-gray-600 mt-2">Loading enquiries...</p>
            </div>
          ) : enquiriesError ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-red-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Error loading enquiries
              </p>
              <p className="text-xs text-gray-500">{enquiriesError}</p>
            </div>
          ) : filteredEnquiries.length > 0 ? (
            <div className="space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="rounded-lg p-4"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {enquiry.subject}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            enquiry.status
                          )}`}
                        >
                          {enquiry.status}
                        </span>
                        {enquiry.priority && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              enquiry.priority
                            )}`}
                          >
                            {enquiry.priority}
                          </span>
                        )}
                      </div>

                      {user?.role === "HOST" && enquiry.guest && (
                        <p className="text-sm text-gray-600 mb-2">
                          From: {enquiry.guest.firstName}{" "}
                          {enquiry.guest.lastName}
                        </p>
                      )}

                      {user?.role === "GUEST" && enquiry.property && (
                        <p className="text-sm text-gray-600 mb-2">
                          Property: {enquiry.property.title}
                        </p>
                      )}

                      <p className="text-sm text-gray-700 mb-2">
                        {enquiry.message}
                      </p>

                      {enquiry.response && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Response:</span>{" "}
                            {enquiry.response}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        {formatDate(enquiry.createdAt)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {user?.role === "HOST" && (
                      <div className="flex flex-col space-y-2 ml-4">
                        {enquiry.status === "PENDING" && (
                          <button
                            onClick={() => openResponseModal(enquiry.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Respond
                          </button>
                        )}
                        {enquiry.status === "RESPONDED" && (
                          <button
                            onClick={() =>
                              handleUpdateEnquiryStatus(enquiry.id, "CLOSED")
                            }
                            disabled={respondingToEnquiry === enquiry.id}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {respondingToEnquiry === enquiry.id
                              ? "Closing..."
                              : "Mark as Closed"}
                          </button>
                        )}
                        {(enquiry.status === "PENDING" ||
                          enquiry.status === "RESPONDED") && (
                          <button
                            onClick={() =>
                              handleUpdateEnquiryStatus(enquiry.id, "SPAM")
                            }
                            disabled={respondingToEnquiry === enquiry.id}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {respondingToEnquiry === enquiry.id
                              ? "Marking..."
                              : "Mark as Spam"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No {enquiryFilter.toLowerCase()} enquiries found
              </p>
              <p className="text-xs text-gray-500">
                {enquiryFilter === "ALL"
                  ? user?.role === "HOST"
                    ? "No enquiries for your properties yet"
                    : "You haven't sent any enquiries yet"
                  : `No ${enquiryFilter.toLowerCase()} enquiries available`}
              </p>
            </div>
          )}

          {/* Pagination */}
          {enquiriesPagination.totalPages > 1 && (
            <div
              className="flex items-center justify-between mt-6 pt-6"
              style={{
                borderTop: "1px solid #DDDDDD",
              }}
            >
              <div className="text-sm text-gray-600">
                {(() => {
                  const totalItems = enquiriesPagination.totalItems || 0;
                  const currentPage = enquiriesPagination.currentPage || 1;
                  const itemsPerPage = enquiriesPagination.itemsPerPage || 10;
                  const enquiries =
                    user?.role === "HOST" ? hostEnquiries : guestEnquiries;

                  console.log(
                    "🔍 Enquiries pagination info - totalItems:",
                    totalItems,
                    "currentPage:",
                    currentPage,
                    "enquiries length:",
                    enquiries?.length
                  );

                  // If we have enquiries but totalItems is 0, use the actual count
                  const actualTotalItems =
                    totalItems > 0 ? totalItems : enquiries?.length || 0;

                  if (actualTotalItems === 0) {
                    return "No enquiries found";
                  }

                  const startItem = (currentPage - 1) * itemsPerPage + 1;
                  const endItem = Math.min(
                    currentPage * itemsPerPage,
                    actualTotalItems
                  );

                  return `Showing ${startItem} to ${endItem} of ${actualTotalItems} enquiries`;
                })()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(
                      "🔍 Enquiries Previous button clicked - enquiriesPagination:",
                      enquiriesPagination
                    );
                    const prevPage = Math.max(
                      1,
                      enquiriesPagination.currentPage - 1
                    );
                    console.log(
                      "🔍 Enquiries Previous button clicked - current page:",
                      enquiriesPagination.currentPage,
                      "prev page:",
                      prevPage,
                      "is disabled:",
                      enquiriesPagination.currentPage === 1
                    );

                    if (user?.role === "HOST") {
                      console.log(
                        "🔍 Fetching host enquiries for page:",
                        prevPage
                      );
                      fetchHostEnquiries(
                        prevPage,
                        enquiryFilter !== "ALL" ? enquiryFilter : undefined
                      );
                    } else {
                      console.log(
                        "🔍 Fetching guest enquiries for page:",
                        prevPage
                      );
                      fetchGuestEnquiries(prevPage);
                    }
                  }}
                  disabled={enquiriesPagination.currentPage === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    enquiriesPagination.currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={{
                    pointerEvents:
                      enquiriesPagination.currentPage === 1 ? "none" : "auto",
                  }}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {(() => {
                    const totalPages = enquiriesPagination.totalPages || 1;
                    const currentPage = enquiriesPagination.currentPage || 1;
                    const maxVisiblePages = 5;

                    console.log(
                      "🔍 Rendering enquiries pagination - currentPage:",
                      currentPage,
                      "totalPages:",
                      totalPages,
                      "enquiriesPagination:",
                      enquiriesPagination
                    );

                    // Calculate start and end page numbers to show (same logic as reviews)
                    let startPage = Math.max(
                      1,
                      currentPage - Math.floor(maxVisiblePages / 2)
                    );
                    let endPage = Math.min(
                      totalPages,
                      startPage + maxVisiblePages - 1
                    );

                    // Adjust start page if we're near the end
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    return pages.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(
                            "🔍 Enquiries page number button clicked - page:",
                            pageNum,
                            "user role:",
                            user?.role
                          );
                          if (user?.role === "HOST") {
                            console.log(
                              "🔍 Fetching host enquiries for page:",
                              pageNum
                            );
                            fetchHostEnquiries(
                              pageNum,
                              enquiryFilter !== "ALL"
                                ? enquiryFilter
                                : undefined
                            );
                          } else {
                            console.log(
                              "🔍 Fetching guest enquiries for page:",
                              pageNum
                            );
                            fetchGuestEnquiries(pageNum);
                          }
                        }}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          enquiriesPagination.currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(
                      "🔍 Enquiries Next button clicked - enquiriesPagination:",
                      enquiriesPagination
                    );
                    const nextPage = Math.min(
                      enquiriesPagination.totalPages,
                      enquiriesPagination.currentPage + 1
                    );
                    console.log(
                      "🔍 Enquiries Next button clicked - current page:",
                      enquiriesPagination.currentPage,
                      "next page:",
                      nextPage,
                      "total pages:",
                      enquiriesPagination.totalPages,
                      "is disabled:",
                      enquiriesPagination.currentPage ===
                        enquiriesPagination.totalPages
                    );

                    if (user?.role === "HOST") {
                      console.log(
                        "🔍 Fetching host enquiries for page:",
                        nextPage
                      );
                      fetchHostEnquiries(
                        nextPage,
                        enquiryFilter !== "ALL" ? enquiryFilter : undefined
                      );
                    } else {
                      console.log(
                        "🔍 Fetching guest enquiries for page:",
                        nextPage
                      );
                      fetchGuestEnquiries(nextPage);
                    }
                  }}
                  disabled={
                    enquiriesPagination.currentPage ===
                    enquiriesPagination.totalPages
                  }
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    enquiriesPagination.currentPage ===
                    enquiriesPagination.totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={{
                    pointerEvents:
                      enquiriesPagination.currentPage ===
                      enquiriesPagination.totalPages
                        ? "none"
                        : "auto",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Response Modal */}
        {showResponseModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[9999]">
            <div
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Respond to Enquiry
              </h3>

              <textarea
                value={enquiryResponse}
                onChange={(e) => setEnquiryResponse(e.target.value)}
                placeholder="Enter your response..."
                className="w-full p-3 border border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              />

              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={closeResponseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRespondToEnquiry(showResponseModal)}
                  disabled={
                    respondingToEnquiry === showResponseModal ||
                    !enquiryResponse.trim()
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {respondingToEnquiry === showResponseModal
                    ? "Sending..."
                    : "Send Response"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFavoritesSection = () => {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            My Favorite Properties
          </h1>
          <p className="text-gray-600 text-base">
            Properties you&apos;ve saved for future reference.
          </p>
        </div>

        {favoritesLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="md" className="py-6" />
          </div>
        ) : favoritesError ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Error loading favorites
            </p>
            <p className="text-xs text-gray-500">{favoritesError}</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl p-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-start space-x-4">
                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                      {property.images &&
                      property.images.length > 0 &&
                      property.images[0] ? (
                        <ImageWithPlaceholder
                          src={buildImageUrl(property.images[0])}
                          alt={property.title}
                          fill
                          className="object-cover"
                          fallbackSrc="/placeholder-property.svg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {property.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {property.address}, {property.city}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.type}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {property.maxGuests} guests
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(
                              property.price || 0,
                              property.currency || "XAF"
                            )}{" "}
                            / night
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                router.push(`/property/${property.id}`)
                              }
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const response =
                                    await apiClient.removeFromFavorites(
                                      property.id
                                    );
                                  if (response.success) {
                                    showSuccess(
                                      "Property removed from favorites"
                                    );
                                    // Refresh favorites list
                                    fetchGuestFavorites(
                                      favoritesPagination.currentPage
                                    );
                                  } else {
                                    showError(
                                      response.message ||
                                        "Failed to remove from favorites"
                                    );
                                  }
                                } catch (error) {
                                  showError("Failed to remove from favorites");
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {favoritesPagination.totalPages > 1 && (
              <div
                className="flex items-center justify-between mt-6 pt-6"
                style={{
                  borderTop: "1px solid #DDDDDD",
                }}
              >
                <div className="text-sm text-gray-600">
                  {(() => {
                    const totalItems = favoritesPagination.totalItems || 0;
                    const currentPage = favoritesPagination.currentPage || 1;
                    const itemsPerPage = favoritesPagination.itemsPerPage || 10;

                    if (totalItems === 0) {
                      return "No favorites found";
                    }

                    const startItem = (currentPage - 1) * itemsPerPage + 1;
                    const endItem = Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    );

                    return `Showing ${startItem} to ${endItem} of ${totalItems} favorites`;
                  })()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const prevPage = Math.max(
                        1,
                        favoritesPagination.currentPage - 1
                      );
                      fetchGuestFavorites(prevPage);
                    }}
                    disabled={favoritesPagination.currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      favoritesPagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {(() => {
                      const totalPages = favoritesPagination.totalPages;
                      const currentPage = favoritesPagination.currentPage;
                      const pages = [];

                      // Show first page
                      if (totalPages > 0) {
                        pages.push(
                          <button
                            key={1}
                            onClick={(e) => {
                              e.preventDefault();
                              fetchGuestFavorites(1);
                            }}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === 1
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            1
                          </button>
                        );
                      }

                      // Show ellipsis and middle pages
                      if (totalPages > 3) {
                        if (currentPage > 3) {
                          pages.push(
                            <span
                              key="ellipsis1"
                              className="px-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }

                        const startPage = Math.max(2, currentPage - 1);
                        const endPage = Math.min(
                          totalPages - 1,
                          currentPage + 1
                        );

                        for (let i = startPage; i <= endPage; i++) {
                          if (i > 1 && i < totalPages) {
                            pages.push(
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.preventDefault();
                                  fetchGuestFavorites(i);
                                }}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  currentPage === i
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                              >
                                {i}
                              </button>
                            );
                          }
                        }

                        if (currentPage < totalPages - 2) {
                          pages.push(
                            <span
                              key="ellipsis2"
                              className="px-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                      } else {
                        // Show all pages if total pages <= 3
                        for (let i = 2; i <= totalPages; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={(e) => {
                                e.preventDefault();
                                fetchGuestFavorites(i);
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === i
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                      }

                      // Show last page
                      if (totalPages > 1) {
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={(e) => {
                              e.preventDefault();
                              fetchGuestFavorites(totalPages);
                            }}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === totalPages
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const nextPage = Math.min(
                        favoritesPagination.totalPages,
                        favoritesPagination.currentPage + 1
                      );
                      fetchGuestFavorites(nextPage);
                    }}
                    disabled={
                      favoritesPagination.currentPage ===
                      favoritesPagination.totalPages
                    }
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      favoritesPagination.currentPage ===
                      favoritesPagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No favorite properties yet
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Start exploring properties and add them to your favorites!
            </p>
            <button
              onClick={() => router.push("/search")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPropertiesSection = () => {
    // Check if user is an approved host
    const isApprovedHost =
      user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED";

    // If user is not an approved host, show appropriate message
    if (!isApprovedHost) {
      let message = "";
      let actionText = "";
      let actionLink = "";

      if (user?.role !== "HOST") {
        message = "You need to become a host to manage properties.";
        actionText = "Apply to Become a Host";
        actionLink = "#host-application";
      } else if (user?.hostApprovalStatus === "PENDING") {
        message =
          "Your host application is pending approval. You'll be able to manage properties once approved.";
      } else if (user?.hostApprovalStatus === "REJECTED") {
        message =
          "Your host application was rejected. Please contact support for more information.";
      } else {
        message = "You need to be an approved host to manage properties.";
        actionText = "Apply to Become a Host";
        actionLink = "#host-application";
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              My Properties
            </h1>
            <p className="text-gray-600">
              Manage your properties and view their performance
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-8 text-center"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Host Access Required
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
            {actionText && actionLink && (
              <button
                onClick={() => {
                  // Navigate to host application section
                  setActiveSection("host-application");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Properties
          </h1>
          <p className="text-gray-600">
            Manage your properties and view their performance
          </p>
        </div>

        {/* Properties Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-white p-6 rounded-xl"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.totalProperties || 0}
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-6 rounded-xl"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.totalHostBookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-6 rounded-xl"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {reviewStats.averageRating
                    ? reviewStats.averageRating.toFixed(1)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
            {/* Only show Add Property button for approved hosts */}
            {isApprovedHost && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  router.push("/properties/add");
                }}
              >
                Add Property
              </button>
            )}
          </div>

          {propertiesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : propertiesError ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-red-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Error loading properties
              </p>
              <p className="text-xs text-gray-500 mb-4">{propertiesError}</p>
              <button
                onClick={fetchHostProperties}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : hostProperties.length > 0 ? (
            <div className="space-y-4">
              {hostProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {property.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {property.isAvailable ? "Available" : "Unavailable"}
                        </span>
                        {property.isVerified && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {property.address}, {property.city}, {property.state}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{property.bedrooms} bedrooms</span>
                        <span>{property.bathrooms} bathrooms</span>
                        <span>Max {property.maxGuests} guests</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(
                            property.price,
                            property.currency || "XAF"
                          )}
                          /night
                        </span>
                      </div>
                      {property.reviews && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {property.reviews.averageRating || 0}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({property.reviews.totalReviews || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => {
                          router.push(`/properties/edit/${property.id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => openDeleteModal(property)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {hostProperties.length > 0 && (
                <div
                  className="flex items-center justify-between mt-6 pt-6"
                  style={{
                    borderTop: "1px solid #DDDDDD",
                  }}
                >
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const totalItems = propertiesPagination.totalItems || 0;
                      const currentPage = propertiesPagination.currentPage || 1;
                      const itemsPerPage =
                        propertiesPagination.itemsPerPage || 10;

                      console.log("Pagination Debug:", {
                        totalItems,
                        currentPage,
                        itemsPerPage,
                        hostPropertiesLength: hostProperties.length,
                      });

                      // If we have properties but totalItems is 0, use the actual count
                      const actualTotalItems =
                        totalItems > 0 ? totalItems : hostProperties.length;

                      if (actualTotalItems === 0) {
                        return "No properties found";
                      }

                      const startItem = (currentPage - 1) * itemsPerPage + 1;
                      const endItem = Math.min(
                        currentPage * itemsPerPage,
                        actualTotalItems
                      );

                      return `Showing ${startItem} to ${endItem} of ${actualTotalItems} properties`;
                    })()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        fetchHostProperties(
                          propertiesPagination.currentPage - 1
                        );
                      }}
                      disabled={propertiesPagination.currentPage === 1}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        propertiesPagination.currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        {
                          length: Math.min(5, propertiesPagination.totalPages),
                        },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={(e) => {
                                e.preventDefault();
                                fetchHostProperties(pageNum);
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                propertiesPagination.currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        fetchHostProperties(
                          propertiesPagination.currentPage + 1
                        );
                      }}
                      disabled={
                        propertiesPagination.currentPage ===
                        propertiesPagination.totalPages
                      }
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        propertiesPagination.currentPage ===
                        propertiesPagination.totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No properties found
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Start by adding your first property to begin hosting guests
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  router.push("/properties/add");
                }}
              >
                Add Your First Property
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHostApplicationSection = () => {
    console.log("🔍 Host application section debug:", {
      userRole: user?.role,
      hostApprovalStatus: user?.hostApprovalStatus,
      hostApplicationStatus: hostApplicationStatus,
      hostApplicationLoading: hostApplicationLoading,
      applicationForm: applicationForm,
      applicationSuccess: applicationSuccess,
      applicationError: applicationError,
    });

    const getStatusColor = (status: string) => {
      switch (status) {
        case "PENDING":
          return "bg-yellow-100 text-yellow-800";
        case "APPROVED":
          return "bg-green-100 text-green-800";
        case "REJECTED":
          return "bg-red-100 text-red-800";
        case "SUSPENDED":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "PENDING":
          return "⏳";
        case "APPROVED":
          return "✅";
        case "REJECTED":
          return "❌";
        case "SUSPENDED":
          return "⏸️";
        default:
          return "📋";
      }
    };

    // If user is already a host, show status based on approval
    if (user?.role === "HOST") {
      console.log("🔍 Host status check:", {
        hostApprovalStatus: user?.hostApprovalStatus,
        hostApplicationStatus: hostApplicationStatus,
        statusType: typeof user?.hostApprovalStatus,
      });

      // Combine sources: consider approved if either source says APPROVED
      const statusFromApp = hostApplicationStatus?.status?.toUpperCase();
      const statusFromUser = user?.hostApprovalStatus?.toUpperCase();
      const status = statusFromApp || statusFromUser;

      const isApproved =
        statusFromApp === "APPROVED" || statusFromUser === "APPROVED";
      const isPending = (statusFromApp || statusFromUser) === "PENDING";
      const isRejected = (statusFromApp || statusFromUser) === "REJECTED";
      const isSuspended = (statusFromApp || statusFromUser) === "SUSPENDED";

      console.log("🔍 Status analysis:", {
        originalStatus: user?.hostApprovalStatus,
        applicationStatus: hostApplicationStatus?.status,
        normalizedStatus: status,
        isApproved,
        isPending,
        isRejected,
        isSuspended,
        finalStatus: isApproved
          ? "APPROVED"
          : isPending
          ? "PENDING"
          : isRejected
          ? "REJECTED"
          : isSuspended
          ? "SUSPENDED"
          : "UNKNOWN",
      });

      // Debug the actual condition that determines the display
      console.log("🔍 Display logic:", {
        status,
        isApproved,
        isPending,
        isRejected,
        willShowApproved: isApproved,
        willShowPending: isPending,
        willShowRejected: isRejected,
      });

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Host Application
            </h1>
            <p className="text-gray-600 text-base">
              {isApproved
                ? "You are a verified host on our platform."
                : isPending
                ? "Your host application is being reviewed."
                : "Your host application status."}
            </p>
          </div>

          <div
            className="bg-white p-6 rounded-xl"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  isApproved
                    ? "bg-green-50"
                    : isPending
                    ? "bg-yellow-50"
                    : isRejected
                    ? "bg-red-50"
                    : isSuspended
                    ? "bg-gray-50"
                    : "bg-gray-50"
                }`}
              >
                <UserCheck
                  className={`h-5 w-5 ${
                    isApproved
                      ? "text-green-600"
                      : isPending
                      ? "text-yellow-600"
                      : isRejected
                      ? "text-red-600"
                      : isSuspended
                      ? "text-gray-600"
                      : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Host Status:{" "}
                  {isApproved
                    ? "Active"
                    : isPending
                    ? "Pending"
                    : isRejected
                    ? "Rejected"
                    : isSuspended
                    ? "Suspended"
                    : `Unknown (${status})`}
                </h3>
                <p className="text-sm text-gray-600">
                  {isApproved
                    ? "You can now list and manage properties"
                    : isPending
                    ? "Your application is under review"
                    : isRejected
                    ? "Your application was not approved"
                    : isSuspended
                    ? "Your host account is temporarily suspended"
                    : "Status unknown"}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              {isApproved
                ? "Congratulations! Your host application has been approved. You now have access to all host features including property management, booking management, and earnings tracking."
                : isPending
                ? "Your host application is currently being reviewed by our team. We'll notify you once a decision has been made. This process typically takes 2-3 business days."
                : isRejected
                ? "Unfortunately, your host application was not approved at this time. You may reapply in the future or contact support for more information."
                : isSuspended
                ? "Your host account has been temporarily suspended. Please contact support for more information about the suspension and how to resolve it."
                : "Your host application status is currently unknown. Please contact support for assistance."}
            </p>
          </div>
        </div>
      );
    }

    // If application status exists, show status
    if (hostApplicationStatus) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Host Application Status
            </h1>
            <p className="text-gray-600 text-base">
              Track the progress of your host application
            </p>
          </div>

          {hostApplicationLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="md" className="py-6" />
            </div>
          ) : (
            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-2xl">
                  {getStatusIcon(hostApplicationStatus.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Application Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      hostApplicationStatus.status
                    )}`}
                  >
                    {hostApplicationStatus.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Submitted
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(hostApplicationStatus.submittedAt)}
                    </p>
                  </div>
                  {hostApplicationStatus.reviewedAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Reviewed
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(hostApplicationStatus.reviewedAt)}
                      </p>
                    </div>
                  )}
                </div>

                {hostApplicationStatus.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Admin Notes
                    </p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {hostApplicationStatus.notes}
                    </p>
                  </div>
                )}

                {hostApplicationStatus.rejectionReason && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                      {hostApplicationStatus.rejectionReason}
                    </p>
                  </div>
                )}

                {hostApplicationStatus.status === "PENDING" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Estimated Review Time:</strong>{" "}
                      {hostApplicationStatus.estimatedReviewTime ||
                        "3-5 business days"}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      We're currently reviewing your application. You'll receive
                      an email notification once the review is complete.
                    </p>
                  </div>
                )}

                {hostApplicationStatus.status === "REJECTED" && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Your application was not approved. You can submit a new
                      application after addressing the feedback provided.
                    </p>
                    <button
                      onClick={() => setHostApplicationStatus(null)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Submit New Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Show application form
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Become a Host
          </h1>
          <p className="text-gray-600 text-base">
            Apply to become a host and start earning by renting out your
            property
          </p>
        </div>

        {applicationSuccess && (
          <div
            className="p-4 bg-green-50 rounded-xl"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <p className="text-sm text-green-700">{applicationSuccess}</p>
          </div>
        )}

        {applicationError && (
          <div
            className="p-4 bg-red-50 rounded-xl"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <p className="text-sm text-red-700">{applicationError}</p>
          </div>
        )}

        <div
          className="bg-white p-6 rounded-xl"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <form onSubmit={handleSubmitApplication} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address *
              </label>
              <input
                type="text"
                required
                value={applicationForm.propertyAddress}
                onChange={(e) =>
                  handleFormChange("propertyAddress", e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg border border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the full address of your property"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                required
                value={applicationForm.propertyType}
                onChange={(e) =>
                  handleFormChange("propertyType", e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg border border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
                <option value="CONDO">Condo</option>
                <option value="STUDIO">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Description *
              </label>
              <textarea
                required
                value={applicationForm.propertyDescription}
                onChange={(e) =>
                  handleFormChange("propertyDescription", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your property, amenities, and what makes it special"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hosting Experience *
              </label>
              <textarea
                required
                value={applicationForm.experience}
                onChange={(e) => handleFormChange("experience", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your experience with hosting, customer service, or property management"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to become a host? *
              </label>
              <textarea
                required
                value={applicationForm.reason}
                onChange={(e) => handleFormChange("reason", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your motivation for becoming a host"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={applicationForm.additionalNotes}
                onChange={(e) =>
                  handleFormChange("additionalNotes", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information you'd like to share"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • We'll review your application within 3-5 business days
                </li>
                <li>
                  • You'll receive an email notification with the decision
                </li>
                <li>
                  • If approved, you'll gain access to host features immediately
                </li>
                <li>
                  • You can start listing your property and accepting bookings
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submittingApplication}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submittingApplication ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting Application...</span>
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderWalletSection = () => {
    console.log("🔍 Wallet section debug:", {
      userRole: user?.role,
      walletBalance: walletBalance,
      walletCurrency: walletCurrency,
      hostWalletBalance: hostWalletBalance,
      hostWalletActive: hostWalletActive,
      withdrawalHistory: withdrawalHistory,
      walletLoading: walletLoading,
      hostWalletLoading: hostWalletLoading,
    });

    // Check if user is an approved host for host-specific features
    const isApprovedHost =
      user?.role === "HOST" && user?.hostApprovalStatus === "APPROVED";

    // For hosts, show enhanced wallet with earnings and withdrawal features
    if (user?.role === "HOST") {
      // If user is a HOST but not approved, show appropriate message
      if (!isApprovedHost) {
        let message = "";
        let actionText = "";

        if (user?.hostApprovalStatus === "PENDING") {
          message =
            "Your host application is pending approval. You'll be able to manage your wallet once approved.";
        } else if (user?.hostApprovalStatus === "REJECTED") {
          message =
            "Your host application was rejected. Please contact support for more information.";
        } else {
          message = "You need to be an approved host to manage your wallet.";
          actionText = "Apply to Become a Host";
        }

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Host Wallet
              </h1>
              <p className="text-gray-600">
                Manage your earnings and withdrawals
              </p>
            </div>

            <div
              className="bg-white rounded-xl p-8 text-center"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Host Access Required
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
              {actionText && (
                <button
                  onClick={() => {
                    setActiveSection("host-application");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {actionText}
                </button>
              )}
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Host Wallet
              </h1>
              <p className="text-gray-600">
                Manage your earnings and withdrawals
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/payout-requests")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Payout Requests
              </button>
            </div>
          </div>

          {hostWalletLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="md" className="py-6" />
            </div>
          ) : (
            <>
              {/* Wallet Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className="bg-white p-6 rounded-xl"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Balance
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(walletBalance, walletCurrency)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-xl"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Earnings
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          walletStats?.netEarnings || 0,
                          walletCurrency
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-xl"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Withdrawals
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          walletStats.totalWithdrawals || 0,
                          walletCurrency
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-white p-6 rounded-xl"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Transactions
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {walletStats?.totalTransactions || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div
                className="bg-white rounded-xl p-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Transaction History
                </h2>
                <div className="space-y-4">
                  {walletTransactions.length > 0 ? (
                    walletTransactions.slice(0, 10).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                transaction.type === "PAYMENT"
                                  ? "bg-green-100"
                                  : transaction.type === "WITHDRAWAL"
                                  ? "bg-red-100"
                                  : transaction.type === "REFUND"
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {transaction.type === "PAYMENT" ? (
                                <DollarSign className="h-4 w-4 text-green-600" />
                              ) : transaction.type === "WITHDRAWAL" ? (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              ) : transaction.type === "REFUND" ? (
                                <RefreshCw className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Wallet className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(transaction.createdAt)}
                              </p>
                              {transaction.reference && (
                                <p className="text-xs text-gray-500">
                                  Ref: {transaction.reference}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "PAYMENT"
                                ? "text-green-600"
                                : transaction.type === "WITHDRAWAL"
                                ? "text-red-600"
                                : transaction.type === "REFUND"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {transaction.type === "PAYMENT"
                              ? "+"
                              : transaction.type === "WITHDRAWAL"
                              ? "-"
                              : ""}
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency
                            )}
                          </p>
                          <p
                            className={`text-xs px-2 py-1 rounded-full ${
                              transaction.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : transaction.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Withdrawal History */}
              <div
                className="bg-white rounded-xl p-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Withdrawal History
                </h2>
                <div className="space-y-4">
                  {withdrawalHistory?.length > 0 ? (
                    withdrawalHistory?.slice(0, 5).map((withdrawal) => (
                      <div
                        key={withdrawal.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {withdrawal.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(withdrawal.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {withdrawal.metadata?.paymentMethod} -{" "}
                            {withdrawal.metadata?.accountNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">
                            -
                            {formatCurrency(
                              withdrawal.amount,
                              withdrawal.currency
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            Fee:{" "}
                            {formatCurrency(
                              withdrawal.metadata?.withdrawalFee || 0,
                              withdrawal.currency
                            )}
                          </p>
                          <p
                            className={`text-xs ${
                              withdrawal.status === "COMPLETED"
                                ? "text-green-600"
                                : withdrawal.status === "PENDING"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {withdrawal.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No withdrawals yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Withdrawal Modal */}
          {showWithdrawalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Withdraw Funds
                </h3>

                {withdrawalError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{withdrawalError}</p>
                  </div>
                )}

                {withdrawalSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      {withdrawalSuccess}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ({walletCurrency})
                    </label>
                    <input
                      type="number"
                      value={withdrawalForm.amount}
                      onChange={(e) =>
                        setWithdrawalForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      max={walletBalance}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Withdrawal Method
                    </label>
                    <select
                      value={withdrawalForm.withdrawalMethod}
                      onChange={(e) =>
                        setWithdrawalForm((prev) => ({
                          ...prev,
                          withdrawalMethod: e.target.value as
                            | "MOBILE_MONEY"
                            | "MTN_MOMO"
                            | "ORANGE_MONEY",
                        }))
                      }
                      className="w-full px-3 py-2 border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MOBILE_MONEY">Mobile Money (MTN)</option>
                      <option value="ORANGE_MONEY">Orange Money</option>
                    </select>
                  </div>

                  {(withdrawalForm.withdrawalMethod === "MOBILE_MONEY" ||
                    withdrawalForm.withdrawalMethod === "MTN_MOMO" ||
                    withdrawalForm.withdrawalMethod === "ORANGE_MONEY") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={withdrawalForm.phone}
                        onChange={(e) =>
                          setWithdrawalForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+237612345678"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your mobile money account number (with or without
                        +237 prefix)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-2 border border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={withdrawalLoading || !withdrawalForm.amount}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {withdrawalLoading ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // For guests, show regular wallet
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">Manage your wallet and transactions</p>
        </div>

        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <p className="text-gray-600 text-center py-8">
            Guest wallet features coming soon.
          </p>
        </div>
      </div>
    );
  };

  const renderNotificationsSection = () => {
    console.log("🔍 Notifications section debug:", {
      notifications: notifications,
      notificationStats: notificationStats,
      notificationsLoading: notificationsLoading,
      notificationsError: notificationsError,
      notificationsPagination: notificationsPagination,
      notificationFilter: notificationFilter,
      notificationPreferences: notificationPreferences,
      showPreferencesModal: showPreferencesModal,
    });

    const getNotificationIcon = (type: string) => {
      switch (type) {
        case "NEW_BOOKING":
          return <Calendar className="h-5 w-5 text-blue-600" />;
        case "BOOKING_CONFIRMED":
          return <CheckCircle className="h-5 w-5 text-green-600" />;
        case "BOOKING_CANCELLED":
          return <X className="h-5 w-5 text-red-600" />;
        case "NEW_REVIEW":
          return <Star className="h-5 w-5 text-yellow-600" />;
        case "PAYMENT_RECEIVED":
          return <DollarSign className="h-5 w-5 text-green-600" />;
        case "PAYMENT_FAILED":
          return <AlertCircle className="h-5 w-5 text-red-600" />;
        default:
          return <Bell className="h-5 w-5 text-gray-600" />;
      }
    };

    const getNotificationColor = (status: string) => {
      return status === "UNREAD"
        ? "bg-blue-50 border-blue-200"
        : "bg-white border-gray-200";
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with your latest activities
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={async () => {
                await fetchNotificationPreferences();
                setShowPreferencesModal(true);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Preferences
            </button>
            {notificationStats?.unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notification Stats */}
        {notificationStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {notificationStats.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-xl font-bold text-gray-900">
                    {notificationStats.unread || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Read</p>
                  <p className="text-xl font-bold text-gray-900">
                    {notificationStats.read || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setNotificationFilter("ALL");
              fetchNotifications(1, "ALL");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              notificationFilter === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setNotificationFilter("UNREAD");
              fetchNotifications(1, "UNREAD");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              notificationFilter === "UNREAD"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => {
              setNotificationFilter("READ");
              fetchNotifications(1, "READ");
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              notificationFilter === "READ"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Read
          </button>
        </div>

        {/* Notifications List */}
        <div
          className="bg-white rounded-xl"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          {notificationsLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="md" className="py-6" />
            </div>
          ) : notificationsError ? (
            <div className="p-6">
              <p className="text-red-600">{notificationsError}</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 ${getNotificationColor(notification.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {notification.status === "UNREAD" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.status === "UNREAD" && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {notificationsPagination.totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() =>
                fetchNotifications(
                  notificationsPagination.currentPage - 1,
                  notificationFilter
                )
              }
              disabled={notificationsPagination.currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from(
              { length: Math.min(5, notificationsPagination.totalPages) },
              (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => fetchNotifications(page, notificationFilter)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === notificationsPagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 bg-white border border hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              onClick={() =>
                fetchNotifications(
                  notificationsPagination.currentPage + 1,
                  notificationFilter
                )
              }
              disabled={
                notificationsPagination.currentPage >=
                notificationsPagination.totalPages
              }
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Preferences Modal */}
        <Modal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          title="Notification Preferences"
        >
          {preferencesError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{preferencesError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-600">
                  Receive notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferencesForm.emailNotifications}
                onChange={(e) =>
                  setPreferencesForm((prev) => ({
                    ...prev,
                    emailNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Push Notifications
                </p>
                <p className="text-xs text-gray-600">
                  Receive push notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferencesForm.pushNotifications}
                onChange={(e) =>
                  setPreferencesForm((prev) => ({
                    ...prev,
                    pushNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Booking Notifications
                </p>
                <p className="text-xs text-gray-600">
                  New bookings and updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferencesForm.bookingNotifications}
                onChange={(e) =>
                  setPreferencesForm((prev) => ({
                    ...prev,
                    bookingNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Review Notifications
                </p>
                <p className="text-xs text-gray-600">New reviews and ratings</p>
              </div>
              <input
                type="checkbox"
                checked={preferencesForm.reviewNotifications}
                onChange={(e) =>
                  setPreferencesForm((prev) => ({
                    ...prev,
                    reviewNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Payment Notifications
                </p>
                <p className="text-xs text-gray-600">
                  Payment confirmations and issues
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferencesForm.paymentNotifications}
                onChange={(e) =>
                  setPreferencesForm((prev) => ({
                    ...prev,
                    paymentNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowPreferencesModal(false)}
              className="flex-1 px-4 py-2 border border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePreferences}
              disabled={preferencesLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {preferencesLoading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </Modal>
      </div>
    );
  };

  const renderProfileSection = () => {
    console.log("🔍 Profile section debug:", {
      user: user,
      profileForm: profileForm,
      profileLoading: profileLoading,
      showPasswordModal: showPasswordModal,
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account information and security
          </p>
        </div>

        {/* Profile Information */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("🔍 Form submitted, calling handleUpdateProfile");
              handleUpdateProfile();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={profileForm.email}
                disabled
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email address cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="+237612345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL (Optional)
              </label>
              <Input
                type="url"
                value={profileForm.avatar}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    avatar: e.target.value,
                  }))
                }
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {profileLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Account Information */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Type
                </p>
                <p className="text-sm text-gray-600">
                  {user?.role === "HOST" ? "Host" : "Guest"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {user?.role === "HOST"
                  ? "Can list properties"
                  : "Can book properties"}
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Verification
                </p>
                <p className="text-sm text-gray-600">
                  {user?.isVerified ? "Verified" : "Not verified"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {user?.isVerified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600">⚠ Not verified</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Member Since
                </p>
                <p className="text-sm text-gray-600">
                  {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                </p>
              </div>
            </div>

            {user?.role === "HOST" && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Host Status
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.hostApprovalStatus === "APPROVED"
                      ? "Approved"
                      : "Pending"}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {user?.hostApprovalStatus === "APPROVED" ? (
                    <span className="text-green-600">✓ Approved</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Pending</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverviewSection();
      case "bookings":
        return renderBookingsSection();
      case "properties":
        return renderPropertiesSection();
      case "reviews":
        return renderReviewsSection();
      case "enquiries":
        return renderEnquiriesSection();
      case "favorites":
        return renderFavoritesSection();
      case "host-application":
        return renderHostApplicationSection();
      case "wallet":
        return renderWalletSection();
      case "notifications":
        return renderNotificationsSection();
      case "profile":
        return renderProfileSection();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Section coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div
              className="bg-white rounded-xl p-6 shadow-sm"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Dashboard
              </h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        setActiveSection(item.id as DashboardSection);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="pt-4 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && (
              <div
                className="mb-8 p-4 bg-red-50 rounded-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && propertyToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[9999]">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Property
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>"{propertyToDelete.title}"</strong>? This action cannot be
              undone and will permanently remove the property from your
              listings.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={deletingProperty}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProperty(propertyToDelete.id)}
                disabled={deletingProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {deletingProperty ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Property"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
