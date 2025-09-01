"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { SupportRequest, SupportOptions } from "@/types";
import { Button, Input, Textarea, Select, Card } from "@/components/ui";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  User,
  Home,
  CreditCard,
  Shield,
  Settings,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I cancel my booking?",
    answer:
      "You can cancel your booking by going to your Dashboard > Bookings section and clicking &apos;Cancel&apos; on the specific booking. Please note our cancellation policy applies.",
    category: "BOOKING_ISSUES",
  },
  {
    id: "2",
    question: "When will I be charged for my booking?",
    answer:
      "Payment is processed immediately when you confirm your booking. You&apos;ll receive a confirmation email with your payment receipt.",
    category: "PAYMENTS_BILLING",
  },
  {
    id: "3",
    question: "How do I update my profile information?",
    answer:
      "Go to Dashboard > Profile section where you can update your personal information, contact details, and preferences.",
    category: "ACCOUNT_MANAGEMENT",
  },
  {
    id: "4",
    question: "What if I can&apos;t access my account?",
    answer:
      "If you&apos;re having trouble logging in, try using the &apos;Forgot Password&apos; link on the login page. If issues persist, contact our support team.",
    category: "ACCOUNT_MANAGEMENT",
  },
  {
    id: "5",
    question: "How do I become a host?",
    answer:
      "Click &apos;Become a Host&apos; in the main menu and fill out the application form. Our team will review your application within 2-3 business days.",
    category: "TECHNICAL_SUPPORT",
  },
  {
    id: "6",
    question: "What payment methods do you accept?",
    answer:
      "We accept Mobile Money, Orange Money, and major credit cards. All payments are processed securely through our platform.",
    category: "PAYMENTS_BILLING",
  },
];

export default function SupportPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState<SupportRequest>({
    subject: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  });
  const [supportOptions, setSupportOptions] = useState<SupportOptions | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportOptions = async () => {
      try {
        const response = await apiClient.getSupportOptions();
        if (response.success && response.data) {
          setSupportOptions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch support options:", error);
        // Use fallback options if API fails
        setSupportOptions({
          categories: [
            { value: "BOOKING_ISSUES", label: "Booking Issues" },
            { value: "PAYMENTS_BILLING", label: "Payments & Billing" },
            { value: "ACCOUNT_MANAGEMENT", label: "Account Management" },
            { value: "TECHNICAL_SUPPORT", label: "Technical Support" },
            { value: "SAFETY_SECURITY", label: "Safety & Security" },
          ],
          priorities: [
            { value: "LOW", label: "Low - General inquiry" },
            { value: "MEDIUM", label: "Medium - Standard issue" },
            { value: "HIGH", label: "High - Urgent issues" },
            { value: "URGENT", label: "Urgent - Critical issues" },
          ],
          statuses: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSupportOptions();
  }, []);

  const handleInputChange = (field: keyof SupportRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.description) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.createSupportRequest(formData);

      if (response.success) {
        setIsSubmitted(true);
        addToast(
          "Support request submitted successfully! We&apos;ll get back to you soon.",
          "success"
        );
        setFormData({
          subject: "",
          description: "",
          category: "",
          priority: "MEDIUM",
        });
      } else {
        addToast(
          response.message || "Failed to submit support request",
          "error"
        );
      }
    } catch (error) {
      console.error("Support request error:", error);
      addToast("Failed to submit support request. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    const iconMap: Record<string, any> = {
      BOOKING_ISSUES: Home,
      PAYMENTS_BILLING: CreditCard,
      ACCOUNT_MANAGEMENT: User,
      TECHNICAL_SUPPORT: Settings,
      SAFETY_SECURITY: Shield,
    };
    return iconMap[categoryValue] || HelpCircle;
  };

  const filteredFaqs =
    selectedFaqCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedFaqCategory);

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading support options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Get the support you need. We&apos;re here to help with any
              questions or issues you might have.
            </p>
            {user && (
              <div className="flex justify-center space-x-4">
                <Link href="/support/tickets">
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View My Tickets
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card
              className="p-8"
              style={{
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "20px",
              }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Submit a Support Request
                </h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We've received your support request and will get back to you
                    within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Info Display */}
                  {user && (
                    <div
                      className="p-4 rounded-lg bg-gray-50"
                      style={{ border: "1px solid rgb(221, 221, 221)" }}
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        Account Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        <strong>Name:</strong> {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Role:</strong> {user.role}
                      </p>
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      required
                      options={
                        supportOptions?.categories.map((cat) => ({
                          value: cat.value,
                          label: cat.label,
                        })) || []
                      }
                      disabled={!supportOptions}
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <Select
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange(
                          "priority",
                          e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"
                        )
                      }
                      options={
                        supportOptions?.priorities.map((pri) => ({
                          value: pri.value,
                          label: pri.label,
                        })) || []
                      }
                      disabled={!supportOptions}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Please provide detailed information about your issue or question..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Support Request
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card
              className="p-6"
              style={{
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">
                      support@roomfinder237.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">+237 681 101 063</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Support Categories */}
            <Card
              className="p-6"
              style={{
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Support Categories
              </h3>
              <div className="space-y-3">
                {supportOptions?.categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.value);
                  return (
                    <div
                      key={category.value}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {category.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card
              className="p-6 bg-red-50"
              style={{
                border: "1px solid rgb(239, 68, 68)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Emergency Support
              </h3>
              <p className="text-sm text-red-700 mb-4">
                For urgent safety issues or emergencies during your stay
              </p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-900">
                  +237 6XX XXX XXX
                </span>
              </div>
              <p className="text-xs text-red-600 mt-2">
                Available 24/7 for emergencies
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find quick answers to common questions
            </p>
          </div>

          {/* FAQ Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setSelectedFaqCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFaqCategory === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{ border: "1px solid rgb(221, 221, 221)" }}
            >
              All Questions
            </button>
            {supportOptions?.categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedFaqCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFaqCategory === category.value
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                style={{ border: "1px solid rgb(221, 221, 221)" }}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card
                  key={faq.id}
                  className="overflow-hidden"
                  style={{
                    border: "1px solid rgb(221, 221, 221)",
                    borderRadius: "20px",
                  }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-4">
                      <div
                        className="pt-2"
                        style={{ borderTop: "1px solid rgb(221, 221, 221)" }}
                      >
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-600">
                  No questions match the selected category. Try selecting "All
                  Questions" or contact support directly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 text-center">
          <div
            className="bg-white rounded-xl p-8"
            style={{
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "20px",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is available
              to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  (window.location.href = "mailto:support@roomfinder237.com")
                }
                variant="outline"
                className="flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button
                onClick={() => (window.location.href = "tel:+2376XXXXXXX")}
                variant="outline"
                className="flex items-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
