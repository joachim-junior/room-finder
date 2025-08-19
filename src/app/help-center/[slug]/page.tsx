"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
  BookOpen,
  Star,
  MessageSquare,
  Share2,
  CheckCircle,
  AlertCircle,
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
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: "BOOKING",
    name: "Booking & Reservations",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "PAYMENT",
    name: "Payments & Billing",
    color: "bg-purple-50 text-purple-700",
  },
  {
    id: "ACCOUNT",
    name: "Account & Profile",
    color: "bg-orange-50 text-orange-700",
  },
  {
    id: "TROUBLESHOOTING",
    name: "Troubleshooting",
    color: "bg-red-50 text-red-700",
  },
];

export default function HelpArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<"helpful" | "not-helpful" | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string);
    }
  }, [params.slug]);

  const fetchArticle = async (slug: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.getHelpArticle(slug);

      if (response.success && response.data) {
        setArticle(response.data);
      } else {
        setError(response.message || "Article not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (isHelpful: boolean) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (ratingSubmitted) return;

    try {
      setSubmittingRating(true);
      const response = await apiClient.rateHelpArticle(article!.id, isHelpful);

      if (response.success) {
        setRating(isHelpful ? "helpful" : "not-helpful");
        setRatingSubmitted(true);
        // Update the article with new rating counts
        if (article) {
          setArticle({
            ...article,
            helpfulCount: isHelpful
              ? article.helpfulCount + 1
              : article.helpfulCount,
            notHelpfulCount: isHelpful
              ? article.notHelpfulCount
              : article.notHelpfulCount + 1,
          });
        }
      } else {
        setError(response.message || "Failed to submit rating");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const getCategoryInfo = (categoryId: string) => {
    return HELP_CATEGORIES.find((cat) => cat.id === categoryId);
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: "Check out this help article on Room Finder",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Article not found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/help-center"
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to help center
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(article.category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/help-center"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to help center
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {categoryInfo && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}
                  >
                    {categoryInfo.name}
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    article.priority
                  )}`}
                >
                  {article.priority}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {article.title}
              </h1>
            </div>

            <Button onClick={shareArticle} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {article.author.firstName} {article.author.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{article.viewCount} views</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Rating Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Was this article helpful?
              </h3>

              {ratingSubmitted ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Thank you for your feedback!</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handleRating(true)}
                    disabled={submittingRating}
                    variant="outline"
                    className={`flex items-center gap-2 ${
                      rating === "helpful"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : ""
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Yes ({article.helpfulCount})
                  </Button>

                  <Button
                    onClick={() => handleRating(false)}
                    disabled={submittingRating}
                    variant="outline"
                    className={`flex items-center gap-2 ${
                      rating === "not-helpful"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : ""
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    No ({article.notHelpfulCount})
                  </Button>

                  {submittingRating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              )}
            </div>

            {/* Related Articles */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Related Articles
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Looking for more help? Check out our{" "}
                  <Link href="/help-center" className="font-medium underline">
                    complete help center
                  </Link>{" "}
                  or{" "}
                  <Link href="/blog" className="font-medium underline">
                    blog articles
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Article Stats */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Article Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{article.viewCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Helpful</span>
                    <span className="font-medium text-green-600">
                      {article.helpfulCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Not Helpful</span>
                    <span className="font-medium text-red-600">
                      {article.notHelpfulCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium">
                      {article.helpfulCount + article.notHelpfulCount > 0
                        ? Math.round(
                            (article.helpfulCount /
                              (article.helpfulCount +
                                article.notHelpfulCount)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              {categoryInfo && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Category
                  </h3>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}
                    >
                      {categoryInfo.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Browse more articles in this category
                  </p>
                </div>
              )}

              {/* Need More Help */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Need More Help?
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/help-center"
                    className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Browse Help Center
                        </p>
                        <p className="text-sm text-gray-600">
                          Find more articles
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/blog"
                    className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Read Blog</p>
                        <p className="text-sm text-gray-600">Tips and guides</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
