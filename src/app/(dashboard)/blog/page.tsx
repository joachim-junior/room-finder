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
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Tag,
  MessageSquare,
  Calendar,
  User,
  Search,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { apiClient, BlogPost, BlogTag } from "@/lib/api";
import { stripHtmlTags } from "@/lib/utils";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
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
    status: "ALL",
    tag: "ALL",
    search: "",
  });

  // Form states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    tagIds: [] as string[],
  });
  const [tagForm, setTagForm] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, [pagination.page, filters]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getBlogPosts({
        page: pagination.page,
        limit: pagination.limit,
        status:
          filters.status === "ALL" ? undefined : filters.status || undefined,
        tag: filters.tag === "ALL" ? undefined : filters.tag || undefined,
        search: filters.search || undefined,
      });

      if (response.success && response.data) {
        setBlogs(response.data.blogs);
        setPagination({
          page: response.data.pagination.currentPage,
          limit: response.data.pagination.itemsPerPage,
          total: response.data.pagination.totalItems,
          pages: response.data.pagination.totalPages,
        });
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to fetch blogs",
        });
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch blogs",
      });
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
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleCreateBlog = async () => {
    if (!blogForm.title || !blogForm.content) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.createBlogPost(blogForm);
      if (response.success && response.data) {
        setBlogs([response.data, ...blogs]);
        setMessage({
          type: "success",
          text: "Blog post created successfully",
        });
        setShowCreateDialog(false);
        resetBlogForm();
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to create blog post",
        });
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
      setMessage({
        type: "error",
        text: "Failed to create blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog) return;

    setLoading(true);
    try {
      const response = await apiClient.updateBlogPost(editingBlog.id, blogForm);
      if (response.success && response.data) {
        setBlogs(
          blogs.map((blog) =>
            blog.id === editingBlog.id ? response.data : blog
          )
        );
        setMessage({
          type: "success",
          text: "Blog post updated successfully",
        });
        setEditingBlog(null);
        resetBlogForm();
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to update blog post",
        });
      }
    } catch (error) {
      console.error("Failed to update blog:", error);
      setMessage({
        type: "error",
        text: "Failed to update blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.deleteBlogPost(blogId);
      if (response.success) {
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
        setMessage({
          type: "success",
          text: "Blog post deleted successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to delete blog post",
        });
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
      setMessage({
        type: "error",
        text: "Failed to delete blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!tagForm.name || !tagForm.slug) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.createBlogTag(tagForm);
      if (response.success && response.data) {
        setTags([...tags, response.data]);
        setMessage({
          type: "success",
          text: "Tag created successfully",
        });
        setShowTagDialog(false);
        setTagForm({ name: "", slug: "" });
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to create tag",
        });
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      setMessage({
        type: "error",
        text: "Failed to create tag",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage || "",
      status: blog.status,
      tagIds: blog.tags.map((tag) => tag.id),
    });
  };

  const resetBlogForm = () => {
    setBlogForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      status: "DRAFT",
      tagIds: [],
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "DRAFT":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "ARCHIVED":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-gray-600">Manage blog posts and content</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTagDialog(true)}
              variant="outline"
              size="sm"
            >
              <Tag className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
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

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search posts..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tag</Label>
                <Select
                  value={filters.tag}
                  onValueChange={(value) =>
                    setFilters({ ...filters, tag: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All tags</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.slug}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() =>
                    setFilters({ status: "ALL", tag: "ALL", search: "" })
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

        {/* Blog Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No blog posts found
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{blog.title}</h3>
                        {getStatusBadge(blog.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {stripHtmlTags(blog.excerpt)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {blog.author.firstName} {blog.author.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {blog.viewCount} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {blog._count.comments} comments
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {blog.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(blog)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteBlog(blog.id)}
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

        {/* Create/Edit Blog Dialog */}
        <Dialog
          open={showCreateDialog || !!editingBlog}
          onOpenChange={() => {
            setShowCreateDialog(false);
            setEditingBlog(null);
            resetBlogForm();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
              <DialogDescription>
                {editingBlog
                  ? "Update the blog post details"
                  : "Create a new blog post"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={blogForm.title}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, title: e.target.value })
                    }
                    placeholder="Enter blog title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={blogForm.slug}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, slug: e.target.value })
                    }
                    placeholder="blog-post-slug"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <RichTextEditor
                  value={blogForm.excerpt}
                  onChange={(value) =>
                    setBlogForm({ ...blogForm, excerpt: value })
                  }
                  placeholder="Brief description of the blog post..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  value={blogForm.content}
                  onChange={(value) =>
                    setBlogForm({ ...blogForm, content: value })
                  }
                  placeholder="Write your blog content here..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={blogForm.featuredImage}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        featuredImage: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={blogForm.status}
                    onValueChange={(
                      value: "DRAFT" | "PUBLISHED" | "ARCHIVED"
                    ) => setBlogForm({ ...blogForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={
                        blogForm.tagIds.includes(tag.id) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const newTagIds = blogForm.tagIds.includes(tag.id)
                          ? blogForm.tagIds.filter((id) => id !== tag.id)
                          : [...blogForm.tagIds, tag.id];
                        setBlogForm({ ...blogForm, tagIds: newTagIds });
                      }}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingBlog(null);
                  resetBlogForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingBlog ? handleUpdateBlog : handleCreateBlog}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingBlog
                  ? "Update Post"
                  : "Create Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Tag Dialog */}
        <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
              <DialogDescription>
                Create a new tag for categorizing blog posts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagName">Tag Name *</Label>
                <Input
                  id="tagName"
                  value={tagForm.name}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, name: e.target.value })
                  }
                  placeholder="Enter tag name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagSlug">Tag Slug *</Label>
                <Input
                  id="tagSlug"
                  value={tagForm.slug}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, slug: e.target.value })
                  }
                  placeholder="tag-slug"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTagDialog(false);
                  setTagForm({ name: "", slug: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTag} disabled={loading}>
                {loading ? "Creating..." : "Create Tag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
