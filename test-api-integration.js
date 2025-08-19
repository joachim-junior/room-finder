// Test script to verify API integration for Add Property functionality
// Run this in the browser console or as a Node.js script

const API_BASE_URL = "https://api.roomfinder237.com/api/v1";

// Test 1: Check if the API is accessible
async function testApiAccessibility() {
  console.log("🧪 Testing API Accessibility...");
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log("✅ API is accessible:", data);
    return true;
  } catch (error) {
    console.error("❌ API is not accessible:", error);
    return false;
  }
}

// Test 2: Test image upload endpoint
async function testImageUpload() {
  console.log("🧪 Testing Image Upload...");

  // Create a mock file for testing
  const mockFile = new File(["mock image content"], "test-image.jpg", {
    type: "image/jpeg",
  });

  const formData = new FormData();
  formData.append("images", mockFile);

  try {
    const response = await fetch(`${API_BASE_URL}/uploads/multiple`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") || "test-token"
        }`,
      },
    });

    const data = await response.json();
    console.log("✅ Image upload response:", data);
    return data.success;
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    return false;
  }
}

// Test 3: Test property creation endpoint
async function testPropertyCreation() {
  console.log("🧪 Testing Property Creation...");

  const testProperty = {
    title: "Test Property",
    description: "This is a test property for API testing",
    type: "APARTMENT",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    country: "Cameroon",
    zipCode: "12345",
    latitude: 4.0095,
    longitude: 9.2085,
    price: 50000,
    currency: "XAF",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ["WiFi", "Air Conditioning"],
    images: [],
  };

  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("token") || "test-token"
        }`,
      },
      body: JSON.stringify(testProperty),
    });

    const data = await response.json();
    console.log("✅ Property creation response:", data);
    return data.success;
  } catch (error) {
    console.error("❌ Property creation failed:", error);
    return false;
  }
}

// Test 4: Test authentication
async function testAuthentication() {
  console.log("🧪 Testing Authentication...");

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("⚠️ No token found in localStorage");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("✅ Authentication test response:", data);
    return data.success;
  } catch (error) {
    console.error("❌ Authentication test failed:", error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting API Integration Tests...\n");

  const results = {
    apiAccess: await testApiAccessibility(),
    auth: await testAuthentication(),
    imageUpload: await testImageUpload(),
    propertyCreation: await testPropertyCreation(),
  };

  console.log("\n📊 Test Results Summary:");
  console.log("API Accessibility:", results.apiAccess ? "✅ PASS" : "❌ FAIL");
  console.log("Authentication:", results.auth ? "✅ PASS" : "❌ FAIL");
  console.log("Image Upload:", results.imageUpload ? "✅ PASS" : "❌ FAIL");
  console.log(
    "Property Creation:",
    results.propertyCreation ? "✅ PASS" : "❌ FAIL"
  );

  const allPassed = Object.values(results).every((result) => result);
  console.log(
    "\n🎯 Overall Result:",
    allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"
  );

  return results;
}

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testApiIntegration = runAllTests;
  console.log(
    "🔧 Test functions available. Run 'testApiIntegration()' to start testing."
  );
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runAllTests,
    testApiAccessibility,
    testAuthentication,
    testImageUpload,
    testPropertyCreation,
  };
}
