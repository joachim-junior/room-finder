"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Search,
  BookOpen,
  HelpCircle,
  Filter,
  ArrowRight,
  Star,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  priority: string;
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const HELP_CATEGORIES = [
  {
    id: "GETTING_STARTED",
    name: "Getting Started",
    description: "Learn the basics of using Room Finder",
    icon: "🚀",
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: "BOOKING",
    name: "Booking & Reservations",
    description: "Everything about booking properties",
    icon: "🏠",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "PAYMENT",
    name: "Payments & Billing",
    description: "Payment methods and billing questions",
    icon: "💳",
    color: "bg-purple-50 text-purple-700",
  },
  {
    id: "ACCOUNT",
    name: "Account & Profile",
    description: "Managing your account and profile",
    icon: "👤",
    color: "bg-orange-50 text-orange-700",
  },
  {
    id: "TROUBLESHOOTING",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    icon: "🔧",
    color: "bg-red-50 text-red-700",
  },
];

function HelpCenterContent() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get initial params from URL
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    setSearchQuery(search);
    setSelectedCategory(category);
    fetchArticles(parseInt(page), search, category);
  }, [searchParams]);

  const fetchArticles = async (
    page: number = 1,
    search: string = "",
    category: string = ""
  ) => {
    try {
      setLoading(true);
      setError("");

      const params: {
        page: number;
        limit: number;
        search?: string;
        category?: string;
      } = {
        page,
        limit: 10,
      };

      if (search) params.search = search;
      if (category) params.category = category;

      const response = await apiClient.getHelpArticles(params);

      if (response.success && response.data) {
        setArticles(response.data.articles || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 10,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1,
        });
      } else {
        setError(response.message || "Failed to load help articles");
      }
    } catch (err) {
      console.error("Error fetching help articles:", err);
      setError("Failed to load help articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("page", "1");
    router.push(`/help-center?${params.toString()}`);
  };

  const handleCategoryFilter = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(newCategory);

    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (newCategory) params.set("category", newCategory);
    params.set("page", "1");
    router.push(`/help-center?${newCategory}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("page", page.toString());
    router.push(`/help-center?${params.toString()}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    router.push("/help-center");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and get support for using Room
              Finder
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="px-6">
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Search: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {selectedCategory && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Category:{" "}
                  {HELP_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Articles */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Error loading articles
            </p>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              No articles found
            </p>
            <p className="text-gray-600">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filters"
                : "Check back soon for help articles"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          <Link
                            href={`/help-center/${article.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            article.priority
                          )}`}
                        >
                          {article.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>
                            {article.author.firstName} {article.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{article.viewCount} views</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{article.helpfulCount} helpful</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{article.notHelpfulCount} not helpful</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/help-center/${article.slug}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="text-sm font-medium">Read more</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function HelpCenterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelpCenterContent />
    </Suspense>
  );
}
