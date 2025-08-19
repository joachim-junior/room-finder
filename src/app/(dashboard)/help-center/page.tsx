"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { apiClient, HelpArticle, HelpCenterStats } from "@/lib/api";
import { stripHtmlTags } from "@/lib/utils";

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [stats, setStats] = useState<HelpCenterStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    category: "ALL",
    priority: "ALL",
    search: "",
    isPublished: "ALL",
  });

  // Form states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HelpArticle | null>(
    null
  );
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    content: "",
    category: "GETTING_STARTED" as
      | "GETTING_STARTED"
      | "BOOKING"
      | "PAYMENT"
      | "ACCOUNT"
      | "TROUBLESHOOTING",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    isPublished: false,
  });

  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, [pagination.page, filters]);

  // Temporary test function
  const testArticlesAPI = async () => {
    try {
      console.log("Testing articles API with minimal params...");
      const response = await apiClient.getHelpArticles({
        page: 1,
        limit: 10,
      });
      console.log("Test response:", response);
    } catch (error) {
      console.error("Test failed:", error);
    }
  };

  // Call test on mount
  useEffect(() => {
    testArticlesAPI();
  }, []);

  // Test create article
  const testCreateArticle = async () => {
    try {
      console.log("Testing create article API...");
      const testArticle = {
        title: "Test Article",
        slug: "test-article",
        content: "<p>This is a test article content.</p>",
        category: "GETTING_STARTED" as const,
        priority: "MEDIUM" as const,
        isPublished: true,
      };
      const response = await apiClient.createHelpArticle(testArticle);
      console.log("Create test response:", response);
    } catch (error) {
      console.error("Create test failed:", error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      console.log("Fetching articles with params:", {
        page: pagination.page,
        limit: pagination.limit,
        category: filters.category === "ALL" ? undefined : filters.category,
        priority: filters.priority === "ALL" ? undefined : filters.priority,
        search: filters.search || undefined,
        isPublished:
          filters.isPublished === "ALL"
            ? undefined
            : filters.isPublished === "true",
      });

      const response = await apiClient.getHelpArticles({
        page: pagination.page,
        limit: pagination.limit,
        category:
          filters.category === "ALL"
            ? undefined
            : filters.category || undefined,
        priority:
          filters.priority === "ALL"
            ? undefined
            : filters.priority || undefined,
        search: filters.search || undefined,
        isPublished:
          filters.isPublished === "ALL"
            ? undefined
            : filters.isPublished === "true",
      });

      console.log("Articles API response:", response);

      if (response.success && response.data) {
        console.log("Setting articles:", response.data.articles);
        setArticles(response.data.articles);
        setPagination({
          page: response.data.pagination.currentPage,
          limit: response.data.pagination.itemsPerPage,
          total: response.data.pagination.totalItems,
          pages: response.data.pagination.totalPages,
        });
      } else {
        console.error("Articles API error:", response.message);
        setMessage({
          type: "error",
          text: response.message || "Failed to fetch articles",
        });
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch articles",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.getHelpCenterStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleCreateArticle = async () => {
    if (!articleForm.title || !articleForm.content) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.createHelpArticle(articleForm);
      if (response.success && response.data) {
        setArticles([response.data, ...articles]);
        setMessage({
          type: "success",
          text: "Help article created successfully",
        });
        setShowCreateDialog(false);
        resetArticleForm();
        fetchStats(); // Refresh stats
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to create help article",
        });
      }
    } catch (error) {
      console.error("Failed to create article:", error);
      setMessage({
        type: "error",
        text: "Failed to create help article",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle) return;

    setLoading(true);
    try {
      const response = await apiClient.updateHelpArticle(
        editingArticle.id,
        articleForm
      );
      if (response.success && response.data) {
        setArticles(
          articles.map((article) =>
            article.id === editingArticle.id ? response.data : article
          )
        );
        setMessage({
          type: "success",
          text: "Help article updated successfully",
        });
        setEditingArticle(null);
        resetArticleForm();
        fetchStats(); // Refresh stats
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to update help article",
        });
      }
    } catch (error) {
      console.error("Failed to update article:", error);
      setMessage({
        type: "error",
        text: "Failed to update help article",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.deleteHelpArticle(articleId);
      if (response.success) {
        setArticles(articles.filter((article) => article.id !== articleId));
        setMessage({
          type: "success",
          text: "Help article deleted successfully",
        });
        fetchStats(); // Refresh stats
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to delete help article",
        });
      }
    } catch (error) {
      console.error("Failed to delete article:", error);
      setMessage({
        type: "error",
        text: "Failed to delete help article",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (article: HelpArticle) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      category: article.category,
      priority: article.priority,
      isPublished: article.isPublished,
    });
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: "",
      slug: "",
      content: "",
      category: "GETTING_STARTED",
      priority: "MEDIUM",
      isPublished: false,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case "HIGH":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "GETTING_STARTED":
        return <Badge variant="outline">Getting Started</Badge>;
      case "BOOKING":
        return <Badge variant="outline">Booking</Badge>;
      case "PAYMENT":
        return <Badge variant="outline">Payment</Badge>;
      case "ACCOUNT":
        return <Badge variant="outline">Account</Badge>;
      case "TROUBLESHOOTING":
        return <Badge variant="outline">Troubleshooting</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Help Center Management</h1>
            <p className="text-gray-600">
              Manage help articles and support content
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
            <Button variant="outline" onClick={testCreateArticle}>
              Test Create
            </Button>
          </div>
        </div>

        {message && (
          <Alert
            className={
              message.type === "error" ? "border-red-200" : "border-green-200"
            }
          >
            <AlertDescription
              className={
                message.type === "error" ? "text-red-800" : "text-green-800"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Articles</p>
                    <p className="text-2xl font-bold">{stats.totalArticles}</p>
                  </div>
                  <HelpCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.publishedArticles}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.draftArticles}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold">
                      {stats.categoryStats.length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search articles..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All categories</SelectItem>
                    <SelectItem value="GETTING_STARTED">
                      Getting Started
                    </SelectItem>
                    <SelectItem value="BOOKING">Booking</SelectItem>
                    <SelectItem value="PAYMENT">Payment</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                    <SelectItem value="TROUBLESHOOTING">
                      Troubleshooting
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) =>
                    setFilters({ ...filters, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All priorities</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.isPublished}
                  onValueChange={(value) =>
                    setFilters({ ...filters, isPublished: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() =>
                    setFilters({
                      category: "ALL",
                      priority: "ALL",
                      search: "",
                      isPublished: "ALL",
                    })
                  }
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Articles List */}
        <Card>
          <CardHeader>
            <CardTitle>Help Articles ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No help articles found
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{article.title}</h3>
                        {getPriorityBadge(article.priority)}
                        {getCategoryBadge(article.category)}
                        {article.isPublished ? (
                          <Badge className="bg-green-100 text-green-800">
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {stripHtmlTags(article.content).substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author.firstName} {article.author.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.viewCount} views
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {article.helpfulCount} helpful
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {article.notHelpfulCount} not helpful
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(article)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page - 1,
                      })
                    }
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Article Dialog */}
        <Dialog
          open={showCreateDialog || !!editingArticle}
          onOpenChange={() => {
            setShowCreateDialog(false);
            setEditingArticle(null);
            resetArticleForm();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle
                  ? "Edit Help Article"
                  : "Create New Help Article"}
              </DialogTitle>
              <DialogDescription>
                {editingArticle
                  ? "Update the help article details"
                  : "Create a new help article"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, title: e.target.value })
                    }
                    placeholder="Enter article title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={articleForm.slug}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, slug: e.target.value })
                    }
                    placeholder="help-article-slug"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={articleForm.category}
                    onValueChange={(
                      value:
                        | "GETTING_STARTED"
                        | "BOOKING"
                        | "PAYMENT"
                        | "ACCOUNT"
                        | "TROUBLESHOOTING"
                    ) => setArticleForm({ ...articleForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GETTING_STARTED">
                        Getting Started
                      </SelectItem>
                      <SelectItem value="BOOKING">Booking</SelectItem>
                      <SelectItem value="PAYMENT">Payment</SelectItem>
                      <SelectItem value="ACCOUNT">Account</SelectItem>
                      <SelectItem value="TROUBLESHOOTING">
                        Troubleshooting
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={articleForm.priority}
                    onValueChange={(
                      value: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
                    ) => setArticleForm({ ...articleForm, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isPublished">Status</Label>
                  <Select
                    value={articleForm.isPublished ? "true" : "false"}
                    onValueChange={(value) =>
                      setArticleForm({
                        ...articleForm,
                        isPublished: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Draft</SelectItem>
                      <SelectItem value="true">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  value={articleForm.content}
                  onChange={(value) =>
                    setArticleForm({ ...articleForm, content: value })
                  }
                  placeholder="Write your help article content here..."
                  className="min-h-[300px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingArticle(null);
                  resetArticleForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingArticle ? handleUpdateArticle : handleCreateArticle
                }
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingArticle
                  ? "Update Article"
                  : "Create Article"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
