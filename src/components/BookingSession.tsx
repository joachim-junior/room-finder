"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Property, Booking } from "@/types";
import { Button, Modal, Input, Select, Textarea } from "@/components/ui";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
} from "lucide-react";

interface BookingSessionProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  initialBookingData?: {
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
  };
  feeCalculation?: FeeCalculation | null;
  inDrawer?: boolean;
  calculatingFees?: boolean;
  onBookingSuccess?: (booking: any) => void;
}

type BookingStep =
  | "details"
  | "summary"
  | "payment"
  | "processing"
  | "success"
  | "error";

interface FeeCalculation {
  property: { id: string; title: string; price: number; currency: string };
  booking: {
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    baseAmount: number;
  };
  fees: {
    hostServiceFee: number;
    hostServiceFeePercent: number;
    guestServiceFee: number;
    guestServiceFeePercent: number;
  };
  totals: {
    baseAmount: number;
    guestServiceFee: number;
    totalGuestPays: number;
    hostServiceFee: number;
    netAmountForHost: number;
    platformRevenue: number;
  };
  currency: string;
}

export default function BookingSession({
  property,
  isOpen,
  onClose,
  initialBookingData,
  feeCalculation,
  inDrawer = false,
  calculatingFees = false,
  onBookingSuccess,
}: BookingSessionProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Determine initial step based on whether we have booking data
  const getInitialStep = (): BookingStep => {
    if (
      initialBookingData?.checkIn &&
      initialBookingData?.checkOut &&
      initialBookingData?.guests
    ) {
      return "summary"; // Go to summary step if we have the data
    }
    return "details";
  };

  const [currentStep, setCurrentStep] = useState<BookingStep>(getInitialStep());
  const [bookingData, setBookingData] = useState({
    checkIn: initialBookingData?.checkIn || "",
    checkOut: initialBookingData?.checkOut || "",
    guests: initialBookingData?.guests || 1,
    specialRequests: initialBookingData?.specialRequests || "",
    paymentMethod: "MOBILE_MONEY",
    phone: user?.phone || "",
  });

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [pollingProgress, setPollingProgress] = useState<{
    attempts: number;
    maxAttempts: number;
    status: string;
  } | null>(null);

  // Calculate nights
  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Fee calculation is now handled by parent component

  // Reset step when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      const newStep = getInitialStep();
      setCurrentStep(newStep);

      // Update booking data if we have initial data
      if (initialBookingData) {
        setBookingData((prev) => ({
          ...prev,
          checkIn: initialBookingData.checkIn || prev.checkIn,
          checkOut: initialBookingData.checkOut || prev.checkOut,
          guests: initialBookingData.guests || prev.guests,
          specialRequests:
            initialBookingData.specialRequests || prev.specialRequests,
        }));
      }
    }
  }, [isOpen, initialBookingData]);

  // Create booking with direct payment
  const handleCreateBooking = async () => {
    if (!user) {
      setError("Please log in to book this property");
      return;
    }

    if (!bookingData.phone) {
      setError("Phone number is required for payment processing");
      return;
    }

    // Validate phone number format (Cameroon format: 6XXXXXXXX)
    const phoneRegex = /^6\d{8}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/\D/g, ""))) {
      setError(
        "Phone number must be in format: 6XXXXXXXX (Cameroon mobile number)"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.createBooking({
        propertyId: property.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests,
        paymentMethod: bookingData.paymentMethod,
        phone: bookingData.phone,
      });

      console.log("Booking API response:", response);

      // Check if the response indicates success
      if (
        response &&
        (response.success || response.message?.includes("successfully"))
      ) {
        // Extract booking data from response - handle different response structures
        let bookingData = response.data?.booking;
        let paymentData = response.data?.payment;

        // Fallback: check if booking is directly in response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!bookingData && (response as any).booking) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          bookingData = (response as any).booking;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!paymentData && (response as any).payment) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          paymentData = (response as any).payment;
        }

        console.log("Booking data:", bookingData);
        console.log("Payment data:", paymentData);

        if (bookingData) {
          setBooking(bookingData);
          setCurrentStep("processing");

          // Start polling for payment status in background
          pollPaymentStatus(bookingData.id);

          console.log(
            "Payment initiated:",
            paymentData?.message || "Payment request sent"
          );
        } else {
          console.error("No booking data in response:", response);
          setError("Booking created but no booking data received");
          setCurrentStep("error");
        }
      } else {
        // Handle error response
        console.error("Booking failed:", response);
        const errorMessage =
          response.message || response.error || "Failed to create booking";
        setError(errorMessage);
        setCurrentStep("error");
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
      setCurrentStep("error");
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (bookingId: string) => {
    const maxAttempts = 100; // 5 minutes with 3-second intervals (5 * 60 / 3 = 100)
    let attempts = 0;

    console.log(`Starting payment status polling for booking ${bookingId}`);

    const poll = async () => {
      attempts++;
      console.log(
        `Polling attempt ${attempts}/${maxAttempts} for booking ${bookingId}`
      );

      // Update polling progress (background only)
      setPollingProgress({
        attempts,
        maxAttempts,
        status: "Processing...",
      });

      if (attempts >= maxAttempts) {
        console.log("Payment polling timeout reached");
        setPollingProgress(null);
        setError(
          "Payment verification timeout. Please check your payment status manually."
        );
        setCurrentStep("error");
        return;
      }

      try {
        const response = await apiClient.verifyPayment(bookingId);
        console.log(`Payment status response (attempt ${attempts}):`, response);

        if (response.success && response.data) {
          const status = response.data.data.paymentStatus;
          console.log(`Payment status: ${status}`);

          // Update status in progress (background only)
          setPollingProgress((prev) =>
            prev
              ? {
                  ...prev,
                  status: "Processing...",
                }
              : null
          );

          if (status === "COMPLETED" || status === "SUCCESSFUL") {
            console.log("Payment completed successfully!");
            setPollingProgress(null);
            setCurrentStep("success");

            // Call the success callback if provided
            if (onBookingSuccess && booking) {
              onBookingSuccess(booking);
            }
            return;
          } else if (status === "FAILED") {
            console.log("Payment failed");
            setPollingProgress(null);
            setError("Payment failed. Please try again.");
            setCurrentStep("error");
            return;
          } else if (status === "EXPIRED") {
            console.log("Payment expired");
            setPollingProgress(null);
            setError("Payment request expired. Please try again.");
            setCurrentStep("error");
            return;
          } else {
            console.log(
              `Payment still pending (${status}), continuing to poll...`
            );
            // If still pending, continue polling
          }
        } else {
          console.log(
            "Payment verification response not successful:",
            response
          );
          setPollingProgress((prev) =>
            prev
              ? {
                  ...prev,
                  status: "Processing...",
                }
              : null
          );
        }
      } catch (error) {
        console.error(
          `Payment verification error (attempt ${attempts}):`,
          error
        );
        setPollingProgress((prev) =>
          prev
            ? {
                ...prev,
                status: "Processing...",
              }
            : null
        );
        // Continue polling even if there's an error, as the payment might still be processing
      }

      // Schedule next poll in 3 seconds
      setTimeout(poll, 3000);
    };

    // Start polling immediately
    poll();
  };

  // Handle success
  const handleSuccess = () => {
    onClose();
    router.push(`/dashboard`);
  };

  // Handle retry
  const handleRetry = () => {
    setCurrentStep("details");
    setError("");
    setBooking(null);
    setPollingProgress(null);
  };

  // Reset on close
  const handleClose = () => {
    onClose();
    setCurrentStep("details");
    setError("");
    setBooking(null);
    setPollingProgress(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "details":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          checkIn: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          checkOut: e.target.value,
                        }))
                      }
                      min={
                        bookingData.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <Select
                    value={bookingData.guests.toString()}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value),
                      }))
                    }
                    options={Array.from(
                      { length: property.maxGuests || 1 },
                      (_, i) => ({
                        value: (i + 1).toString(),
                        label: `${i + 1} guest${i !== 0 ? "s" : ""}`,
                      })
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <Textarea
                    value={bookingData.specialRequests}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        specialRequests: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>
            </div>

            {calculatingFees ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Calculating Fees...</h4>
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              </div>
            ) : (
              feeCalculation && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Property:</span>
                      <span className="font-medium">{property.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nights:</span>
                      <span>
                        {feeCalculation.booking.nights} night
                        {feeCalculation.booking.nights !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base amount:</span>
                      <span>
                        {feeCalculation.totals.baseAmount.toLocaleString()}{" "}
                        {feeCalculation.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Service fee (
                        {feeCalculation.fees.guestServiceFeePercent}
                        %):
                      </span>
                      <span>
                        {feeCalculation.totals.guestServiceFee.toLocaleString()}{" "}
                        {feeCalculation.currency}
                      </span>
                    </div>
                    <div
                      className="flex justify-between font-medium text-lg pt-2 border-t"
                      style={{ borderTop: "1px solid rgb(221, 221, 221)" }}
                    >
                      <span>Total:</span>
                      <span>
                        {feeCalculation.totals.totalGuestPays.toLocaleString()}{" "}
                        {feeCalculation.currency}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}

            <Button
              onClick={() => setCurrentStep("summary")}
              disabled={
                loading || !bookingData.checkIn || !bookingData.checkOut
              }
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all"
            >
              Continue to Summary
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          checkIn: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          checkOut: e.target.value,
                        }))
                      }
                      min={
                        bookingData.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <Select
                    value={bookingData.guests.toString()}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value),
                      }))
                    }
                    options={Array.from(
                      { length: property.maxGuests || 1 },
                      (_, i) => ({
                        value: (i + 1).toString(),
                        label: `${i + 1} guest${i !== 0 ? "s" : ""}`,
                      })
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <Textarea
                    value={bookingData.specialRequests}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        specialRequests: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>
            </div>

            {feeCalculation && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Pricing Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Property:</span>
                    <span className="font-medium">{property.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>
                      {new Date(bookingData.checkIn).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>
                      {new Date(bookingData.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{bookingData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>
                      {feeCalculation.booking.nights} night
                      {feeCalculation.booking.nights !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base amount:</span>
                    <span>
                      {feeCalculation.totals.baseAmount.toLocaleString()}{" "}
                      {feeCalculation.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Service fee ({feeCalculation.fees.guestServiceFeePercent}
                      %):
                    </span>
                    <span>
                      {feeCalculation.totals.guestServiceFee.toLocaleString()}{" "}
                      {feeCalculation.currency}
                    </span>
                  </div>
                  <div
                    className="flex justify-between font-medium text-lg pt-2"
                    style={{ borderTop: "1px solid rgb(221, 221, 221)" }}
                  >
                    <span>Total:</span>
                    <span>
                      {feeCalculation.totals.totalGuestPays.toLocaleString()}{" "}
                      {feeCalculation.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => setCurrentStep("payment")}
              disabled={
                loading || !bookingData.checkIn || !bookingData.checkOut
              }
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all"
            >
              Continue to Payment
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-4">
            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    bookingData.paymentMethod === "MOBILE_MONEY"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MOBILE_MONEY"
                    checked={bookingData.paymentMethod === "MOBILE_MONEY"}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">MTN Mobile Money</div>
                      <div className="text-sm text-gray-600">
                        Pay with MTN Mobile Money
                      </div>
                    </div>
                  </div>
                </label>
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    bookingData.paymentMethod === "ORANGE_MONEY"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ORANGE_MONEY"
                    checked={bookingData.paymentMethod === "ORANGE_MONEY"}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">Orange Money</div>
                      <div className="text-sm text-gray-600">
                        Pay with Orange Money
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Required for Payment)
              </label>
              <Input
                type="tel"
                value={bookingData.phone}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="6XXXXXXXX (Cameroon mobile number)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll send a payment request to this number
              </p>
            </div>

            {/* Special Requests */}
            {bookingData.specialRequests && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  {bookingData.specialRequests}
                </div>
              </div>
            )}

            <Button
              onClick={handleCreateBooking}
              disabled={loading || !bookingData.phone}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  Pay Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        );

      case "processing":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Payment Request Sent
              </h3>
              <p className="text-gray-600">
                A payment request has been sent to your phone number. Please
                check your mobile money app and enter your PIN to complete the
                payment.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What happens next:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• You&apos;ll receive a notification on your phone</li>
                <li>
                  •{" "}
                  {bookingData.paymentMethod === "MOBILE_MONEY"
                    ? "Dial *126# to confirm the payment"
                    : bookingData.paymentMethod === "ORANGE_MONEY"
                    ? "Dial #150*50# to confirm the payment"
                    : "Enter your mobile money PIN to confirm"}
                </li>
                <li>• Payment will be processed immediately</li>
                <li>• Booking will be confirmed automatically</li>
              </ul>
            </div>
            <div className="text-xs text-gray-500">
              <p>You can close this window and check your dashboard later.</p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your booking has been confirmed. You will receive a confirmation
                email shortly.
              </p>
            </div>
            <Button
              onClick={handleSuccess}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
            >
              View Booking Details
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Booking Failed
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Try Again
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full py-3 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  const content = (
    <div className="relative flex flex-col h-full">
      {!inDrawer && (
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Book {property.title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && currentStep !== "error" && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1 min-h-0 px-4 py-2 w-full">
        {renderStep()}
      </div>
    </div>
  );

  if (inDrawer) {
    return content;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      {content}
    </Modal>
  );
}
