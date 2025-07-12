<?php
/**
 * Mobile App Configuration File
 * Version: 2.0.0
 * Updated: 2024
 */

// App Configuration
define('APP_VERSION', '2.0.0');
define('API_VERSION', '2.0');
define('MIN_SUPPORTED_VERSION', '1.8.0');

// Security Configuration
define('PASSWORD_MIN_LENGTH', 6);
define('SESSION_TIMEOUT', 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', 5);
define('ACCOUNT_LOCKOUT_DURATION', 900); // 15 minutes

// API Rate Limiting
define('API_RATE_LIMIT_REQUESTS', 100);
define('API_RATE_LIMIT_WINDOW', 3600); // 1 hour

// Database Configuration
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', 'utf8mb4_unicode_ci');

// File Upload Configuration
define('MAX_IMAGE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('UPLOAD_PATH', 'uploads/');

// Notification Configuration
define('NOTIFICATION_BATCH_SIZE', 100);
define('NOTIFICATION_RETRY_ATTEMPTS', 3);

// Wallet Configuration
define('MIN_WALLET_BALANCE', 0);
define('MAX_WALLET_BALANCE', 100000);
define('WALLET_TRANSACTION_LIMIT', 10000);

// Booking Configuration
define('BOOKING_ADVANCE_DAYS', 365); // Maximum days in advance
define('BOOKING_MIN_DURATION', 1); // Minimum booking duration in days
define('BOOKING_MAX_DURATION', 30); // Maximum booking duration in days
define('BOOKING_CANCELLATION_HOURS', 24); // Hours before check-in for free cancellation

// Cache Configuration
define('CACHE_ENABLED', true);
define('CACHE_DEFAULT_TTL', 3600); // 1 hour
define('CACHE_PROPERTY_LIST_TTL', 1800); // 30 minutes
define('CACHE_USER_DATA_TTL', 900); // 15 minutes

// API Response Codes
define('API_SUCCESS', 200);
define('API_BAD_REQUEST', 400);
define('API_UNAUTHORIZED', 401);
define('API_FORBIDDEN', 403);
define('API_NOT_FOUND', 404);
define('API_CONFLICT', 409);
define('API_UNPROCESSABLE', 422);
define('API_RATE_LIMITED', 429);
define('API_SERVER_ERROR', 500);
define('API_SERVICE_UNAVAILABLE', 503);

// Feature Flags
define('FEATURE_SOCIAL_LOGIN', true);
define('FEATURE_PAYMENT_GATEWAY', true);
define('FEATURE_PUSH_NOTIFICATIONS', true);
define('FEATURE_REFERRAL_SYSTEM', true);
define('FEATURE_REVIEW_SYSTEM', true);
define('FEATURE_CHAT_SYSTEM', false);
define('FEATURE_VIDEO_CALLS', false);

// Security Headers
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Content-Security-Policy: default-src \'self\'');
}

// Input Validation Functions
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validateMobile($mobile) {
    return preg_match('/^[0-9]{10,15}$/', $mobile);
}

function validatePassword($password) {
    return strlen($password) >= PASSWORD_MIN_LENGTH;
}

function validateDate($date) {
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) && strtotime($date) !== false;
}

function validateAmount($amount) {
    return is_numeric($amount) && $amount >= 0;
}

// Response Helper Functions
function sendApiResponse($code, $result, $message, $data = null) {
    $response = array(
        "ResponseCode" => (string)$code,
        "Result" => $result ? "true" : "false",
        "ResponseMsg" => $message,
        "timestamp" => date('Y-m-d H:i:s'),
        "api_version" => API_VERSION
    );
    
    if ($data !== null) {
        $response = array_merge($response, $data);
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

function sendSuccessResponse($message, $data = null) {
    sendApiResponse(API_SUCCESS, true, $message, $data);
}

function sendErrorResponse($code, $message) {
    sendApiResponse($code, false, $message);
}

// Database Helper Functions
function getDbConnection() {
    global $rstate;
    if (!$rstate) {
        throw new Exception("Database connection not available");
    }
    return $rstate;
}

function executeQuery($query, $params = [], $types = '') {
    $db = getDbConnection();
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception("Failed to prepare query: " . $db->error);
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }
    
    return $stmt;
}

// Logging Functions
function logApiRequest($endpoint, $user_id = null, $ip = null) {
    $log_data = array(
        'endpoint' => $endpoint,
        'user_id' => $user_id,
        'ip_address' => $ip ?: $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'timestamp' => date('Y-m-d H:i:s'),
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    );
    
    // Log to file or database
    error_log("API Request: " . json_encode($log_data));
}

function logError($message, $context = []) {
    $log_data = array(
        'message' => $message,
        'context' => $context,
        'timestamp' => date('Y-m-d H:i:s'),
        'file' => debug_backtrace()[0]['file'] ?? 'unknown',
        'line' => debug_backtrace()[0]['line'] ?? 'unknown'
    );
    
    error_log("Error: " . json_encode($log_data));
}

// Authentication Helper Functions
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateSecureToken($length = 32) {
    return bin2hex(random_bytes($length));
}

// Utility Functions
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function calculateDistance($lat1, $lon1, $lat2, $lon2) {
    $earth_radius = 6371; // Earth's radius in kilometers
    
    $lat1_rad = deg2rad($lat1);
    $lon1_rad = deg2rad($lon1);
    $lat2_rad = deg2rad($lat2);
    $lon2_rad = deg2rad($lon2);
    
    $delta_lat = $lat2_rad - $lat1_rad;
    $delta_lon = $lon2_rad - $lon1_rad;
    
    $a = sin($delta_lat/2) * sin($delta_lat/2) + cos($lat1_rad) * cos($lat2_rad) * sin($delta_lon/2) * sin($delta_lon/2);
    $c = 2 * atan2(sqrt($a), sqrt(1-$a));
    
    return $earth_radius * $c;
}

function formatCurrency($amount, $currency = 'USD') {
    return number_format($amount, 2) . ' ' . $currency;
}

function isValidImageType($filename) {
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return in_array($extension, ALLOWED_IMAGE_TYPES);
}

// Initialize security headers
setSecurityHeaders();

// Set default timezone
date_default_timezone_set('UTC');

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
?>