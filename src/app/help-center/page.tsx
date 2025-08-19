"use client";

import { useState, useEffect } from "react";
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

export default function HelpCenterPage() {
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
    setPagination((prev) => ({ ...prev, page: parseInt(page) }));

    if (search) {
      searchArticles(search, parseInt(page));
    } else if (category) {
      fetchArticlesByCategory(category, parseInt(page));
    } else {
      fetchArticles(parseInt(page));
    }
  }, [searchParams]);

  const fetchArticles = async (page: number = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.getHelpArticles({
        page,
        limit: 10,
        isPublished: true,
      });

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
      setError(
        err instanceof Error ? err.message : "Failed to load help articles"
      );
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (query: string, page: number = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.searchHelpArticles(query, page, 10);

      if (response.success && response.data) {
        setArticles(response.data.articles || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 10,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1,
        });
      } else {
        setError(response.message || "Failed to search articles");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search articles"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (
    category: string,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.getHelpArticlesByCategory(
        category,
        page,
        10
      );

      if (response.success && response.data) {
        setArticles(response.data.articles || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 10,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1,
        });
      } else {
        setError(response.message || "Failed to load articles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles");
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
    router.push(`/help-center?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("page", page.toString());
    router.push(`/help-center?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    router.push("/help-center");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to your questions and learn how to make the most of
              Room Finder.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Button type="submit" className="px-8">
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`p-6 rounded-lg transition-all text-left ${
                  selectedCategory === category.id
                    ? "bg-blue-50 shadow-md"
                    : "bg-white hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
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
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                Search: "{searchQuery}"
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
                      className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} articles
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            variant={
                              pagination.page === page ? "primary" : "outline"
                            }
                            size="sm"
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
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
