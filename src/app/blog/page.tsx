"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import {
  Search,
  Calendar,
  User,
  Eye,
  MessageSquare,
  Tag,
  Filter,
  ArrowLeft,
  ArrowRight,
  Clock,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  status: string;
  publishedAt: string;
  viewCount: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count: {
    comments: number;
  };
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  _count: {
    blogs: number;
  };
}

function BlogContent() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get initial params from URL
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    setSearchQuery(search);
    setSelectedTag(tag);
    fetchBlogs(parseInt(page), search, tag);
    fetchTags();
  }, [searchParams]);

  const fetchBlogs = async (
    page: number = 1,
    search: string = "",
    tag: string = ""
  ) => {
    try {
      setLoading(true);
      setError("");

      const params: {
        page: number;
        limit: number;
        status: string;
        search?: string;
        tag?: string;
      } = {
        page,
        limit: 9,
        status: "PUBLISHED",
      };

      if (search) params.search = search;
      if (tag) params.tag = tag;

      console.log("📡 Making API call with params:", params);
      const response = await apiClient.getBlogPosts(params);
      console.log("📦 API response:", response);

      if (response.success && response.data) {
        console.log("✅ Setting blogs:", response.data.blogs);
        setBlogs(response.data.blogs || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 9,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1,
        });
      } else {
        console.error("❌ API response not successful:", response);
        setError(response.message || "Failed to load blog posts");
      }
    } catch (err) {
      console.error("❌ Error fetching blogs:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load blog posts"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await apiClient.getBlogTags();
      if (response.success && response.data) {
        setTags(response.data);
      }
    } catch (err) {
      console.error("Failed to load tags:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedTag) params.set("tag", selectedTag);
    params.set("page", "1");
    router.push(`/blog?${params.toString()}`);
  };

  const handleTagFilter = (tagSlug: string) => {
    const newTag = selectedTag === tagSlug ? "" : tagSlug;
    setSelectedTag(newTag);

    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (newTag) params.set("tag", newTag);
    params.set("page", "1");
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedTag) params.set("tag", selectedTag);
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    router.push("/blog");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Room Finder Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover travel tips, property insights, and stories from our
              community
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
                  placeholder="Search blog posts..."
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

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTagFilter("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Posts
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagFilter(tag.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag.slug
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchQuery || selectedTag) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Search: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {selectedTag && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Tag: {tags.find((t) => t.slug === selectedTag)?.name}
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

        {/* Blog Posts Grid */}
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
              Error loading blog posts
            </p>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📝</span>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              No blog posts found
            </p>
            <p className="text-gray-600">
              {searchQuery || selectedTag
                ? "Try adjusting your search or filters"
                : "Check back soon for new content"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Featured Image */}
                  <div className="relative h-48">
                    <ImageWithPlaceholder
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder-property.svg"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {blog.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>
                            {blog.author.firstName} {blog.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="text-sm font-medium">Read more</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
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

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}
