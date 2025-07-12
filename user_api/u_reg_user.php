<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

// Input validation
if (empty($data['name']) || empty($data['mobile']) || empty($data['password']) || empty($data['ccode'])) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Missing required fields: name, mobile, password, and country code are required"
    );
    echo json_encode($returnArr);
    exit;
}

// Sanitize and validate inputs
$name = filter_var(trim($data['name']), FILTER_SANITIZE_STRING);
$mobile = filter_var(trim($data['mobile']), FILTER_SANITIZE_STRING);
$password = trim($data['password']);
$ccode = filter_var(trim($data['ccode']), FILTER_SANITIZE_STRING);
$email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL) : '';

// Validate name length
if (strlen($name) < 2 || strlen($name) > 50) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Name must be between 2 and 50 characters"
    );
    echo json_encode($returnArr);
    exit;
}

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

// Validate password strength
if (strlen($password) < 6) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Password must be at least 6 characters long"
    );
    echo json_encode($returnArr);
    exit;
}

// Validate email if provided
if (!empty($data['email']) && !$email) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Invalid email format"
    );
    echo json_encode($returnArr);
    exit;
}

try {
    // Check if mobile number already exists
    $check_mobile_stmt = $rstate->prepare("SELECT id FROM tbl_user WHERE mobile = ? AND ccode = ?");
    $check_mobile_stmt->bind_param("ss", $mobile, $ccode);
    $check_mobile_stmt->execute();
    $mobile_result = $check_mobile_stmt->get_result();
    
    if ($mobile_result->num_rows > 0) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Mobile number already registered"
        );
        echo json_encode($returnArr);
        exit;
    }
    
    // Check if email already exists (if provided)
    if (!empty($email)) {
        $check_email_stmt = $rstate->prepare("SELECT id FROM tbl_user WHERE email = ?");
        $check_email_stmt->bind_param("s", $email);
        $check_email_stmt->execute();
        $email_result = $check_email_stmt->get_result();
        
        if ($email_result->num_rows > 0) {
            $returnArr = array(
                "ResponseCode" => "401",
                "Result" => "false",
                "ResponseMsg" => "Email already registered"
            );
            echo json_encode($returnArr);
            exit;
        }
    }
    
    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Prepare registration data
    $timestamp = date("Y-m-d H:i:s");
    $status = 1; // Active by default
    $wallet = 0; // Default wallet balance
    
    // Insert new user
    $insert_stmt = $rstate->prepare("INSERT INTO tbl_user (name, mobile, ccode, email, password, rdate, status, wallet) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $insert_stmt->bind_param("ssssssii", $name, $mobile, $ccode, $email, $hashed_password, $timestamp, $status, $wallet);
    
    if ($insert_stmt->execute()) {
        $user_id = $rstate->insert_id;
        
        // Get the newly created user data
        $get_user_stmt = $rstate->prepare("SELECT id, name, email, mobile, ccode, wallet, rdate, status FROM tbl_user WHERE id = ?");
        $get_user_stmt->bind_param("i", $user_id);
        $get_user_stmt->execute();
        $user_result = $get_user_stmt->get_result();
        $user_data = $user_result->fetch_assoc();
        
        // Send welcome notification
        $content = array(
            "en" => "Welcome to our platform, " . $name . "! Your account has been created successfully."
        );
        $heading = array(
            "en" => "Welcome!"
        );
        
        // Insert notification into database
        $notification_stmt = $rstate->prepare("INSERT INTO tbl_notification (uid, datetime, title, description) VALUES (?, ?, ?, ?)");
        $notification_title = "Welcome!";
        $notification_desc = "Welcome to our platform! Your account has been created successfully.";
        $notification_stmt->bind_param("isss", $user_id, $timestamp, $notification_title, $notification_desc);
        $notification_stmt->execute();
        
        // Send push notification (if OneSignal is configured)
        if (!empty($set['one_key']) && !empty($set['one_hash'])) {
            $fields = array(
                'app_id' => $set['one_key'],
                'included_segments' => array("Active Users"),
                'data' => array("user_id" => $user_id, "type" => 'welcome'),
                'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $user_id)),
                'contents' => $content,
                'headings' => $heading
            );
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json; charset=utf-8',
                'Authorization: Basic ' . $set['one_hash']
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
            
            $response = curl_exec($ch);
            curl_close($ch);
        }
        
        $returnArr = array(
            "UserLogin" => $user_data,
            "currency" => $set['currency'] ?? 'USD',
            "app_version" => "2.0.0",
            "server_time" => $timestamp,
            "ResponseCode" => "200",
            "Result" => "true",
            "ResponseMsg" => "Registration successful! Welcome to our platform."
        );
    } else {
        $returnArr = array(
            "ResponseCode" => "500",
            "Result" => "false",
            "ResponseMsg" => "Registration failed. Please try again."
        );
    }
    
    // Close prepared statements
    $check_mobile_stmt->close();
    if (isset($check_email_stmt)) $check_email_stmt->close();
    $insert_stmt->close();
    if (isset($get_user_stmt)) $get_user_stmt->close();
    if (isset($notification_stmt)) $notification_stmt->close();
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    $returnArr = array(
        "ResponseCode" => "500",
        "Result" => "false",
        "ResponseMsg" => "Server error occurred. Please try again later."
    );
}

echo json_encode($returnArr);
?>