"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testBlogApi = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🧪 Testing blog API...");

      const response = await apiClient.getBlogPosts({ page: 1, limit: 5 });
      console.log("📦 Blog API response:", response);

      setResult(response);
    } catch (err) {
      console.error("❌ Blog API test failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testTagsApi = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🧪 Testing tags API...");

      const response = await apiClient.getBlogTags();
      console.log("📦 Tags API response:", response);

      setResult(response);
    } catch (err) {
      console.error("❌ Tags API test failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={testBlogApi}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Blog API
        </button>

        <button
          onClick={testTagsApi}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          Test Tags API
        </button>
      </div>

      {loading && <div className="text-blue-600">Loading...</div>}

      {error && (
        <div className="text-red-600 bg-red-100 p-4 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">API Response:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
