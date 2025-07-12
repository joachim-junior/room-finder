<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Input validation
if (empty($data['mobile']) || empty($data['password']) || empty($data['ccode'])) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Missing required fields: mobile, password, and country code are required"
    );
    echo json_encode($returnArr);
    exit;
}

// Sanitize inputs
$mobile = filter_var(trim($data['mobile']), FILTER_SANITIZE_STRING);
$ccode = filter_var(trim($data['ccode']), FILTER_SANITIZE_STRING);
$password = trim($data['password']);

// Validate email format if mobile field contains email
if (filter_var($mobile, FILTER_VALIDATE_EMAIL)) {
    $email_or_mobile = $mobile;
    $field_type = 'email';
} else {
    // Validate mobile number format
    if (!preg_match('/^[0-9]{10,15}$/', $mobile)) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Invalid mobile number format"
        );
        echo json_encode($returnArr);
        exit;
    }
    $email_or_mobile = $mobile;
    $field_type = 'mobile';
}

try {
    // Check if user exists and is active using prepared statements
    $stmt = $rstate->prepare("SELECT id, name, email, mobile, ccode, password, wallet, profile_picture, rdate, status FROM tbl_user WHERE (mobile = ? OR email = ?) AND ccode = ? AND status = 1");
    $stmt->bind_param("sss", $email_or_mobile, $email_or_mobile, $ccode);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Invalid credentials or account not found"
        );
    } else {
        $user = $result->fetch_assoc();
        
        // For backward compatibility - check if password is hashed
        $password_valid = false;
        if (password_verify($password, $user['password'])) {
            // Modern hashed password
            $password_valid = true;
        } elseif ($user['password'] === $password) {
            // Legacy plain text password - hash it for next time
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $update_stmt = $rstate->prepare("UPDATE tbl_user SET password = ? WHERE id = ?");
            $update_stmt->bind_param("si", $hashed_password, $user['id']);
            $update_stmt->execute();
            $password_valid = true;
        }
        
        if ($password_valid) {
            // Update last login timestamp
            $login_time = date("Y-m-d H:i:s");
            $update_login_stmt = $rstate->prepare("UPDATE tbl_user SET last_login = ? WHERE id = ?");
            $update_login_stmt->bind_param("si", $login_time, $user['id']);
            $update_login_stmt->execute();
            
            // Remove password from response for security
            unset($user['password']);
            
            $returnArr = array(
                "UserLogin" => $user,
                "currency" => $set['currency'] ?? 'USD',
                "app_version" => "2.0.0",
                "server_time" => $login_time,
                "ResponseCode" => "200",
                "Result" => "true",
                "ResponseMsg" => "Login successful!"
            );
        } else {
            $returnArr = array(
                "ResponseCode" => "401",
                "Result" => "false",
                "ResponseMsg" => "Invalid credentials"
            );
        }
    }
    
    $stmt->close();
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    $returnArr = array(
        "ResponseCode" => "500",
        "Result" => "false",
        "ResponseMsg" => "Server error occurred. Please try again later."
    );
}

echo json_encode($returnArr);
?>