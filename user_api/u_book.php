<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

// Input validation
$required_fields = ['prop_id', 'uid', 'check_in', 'check_out', 'subtotal', 'total', 'tax', 'p_method_id', 'book_for', 'prop_price'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Missing required field: " . $field
        );
        echo json_encode($returnArr);
        exit;
    }
}

// Sanitize and validate inputs
$prop_id = filter_var($data['prop_id'], FILTER_VALIDATE_INT);
$uid = filter_var($data['uid'], FILTER_VALIDATE_INT);
$check_in = filter_var($data['check_in'], FILTER_SANITIZE_STRING);
$check_out = filter_var($data['check_out'], FILTER_SANITIZE_STRING);
$subtotal = filter_var($data['subtotal'], FILTER_VALIDATE_FLOAT);
$total = filter_var($data['total'], FILTER_VALIDATE_FLOAT);
$tax = filter_var($data['tax'], FILTER_VALIDATE_FLOAT);
$p_method_id = filter_var($data['p_method_id'], FILTER_VALIDATE_INT);
$book_for = filter_var($data['book_for'], FILTER_SANITIZE_STRING);
$prop_price = filter_var($data['prop_price'], FILTER_VALIDATE_FLOAT);

// Optional fields
$total_day = isset($data['total_day']) ? filter_var($data['total_day'], FILTER_VALIDATE_INT) : 1;
$noguest = isset($data['noguest']) ? filter_var($data['noguest'], FILTER_VALIDATE_INT) : 1;
$add_note = isset($data['add_note']) ? filter_var($data['add_note'], FILTER_SANITIZE_STRING) : '';
$transaction_id = isset($data['transaction_id']) ? filter_var($data['transaction_id'], FILTER_SANITIZE_STRING) : '';
$cou_amt = isset($data['cou_amt']) ? filter_var($data['cou_amt'], FILTER_VALIDATE_FLOAT) : 0;
$wall_amt = isset($data['wall_amt']) ? filter_var($data['wall_amt'], FILTER_VALIDATE_FLOAT) : 0;

// Validate date format
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $check_in) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $check_out)) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Invalid date format. Use YYYY-MM-DD format."
    );
    echo json_encode($returnArr);
    exit;
}

// Validate dates
$check_in_date = new DateTime($check_in);
$check_out_date = new DateTime($check_out);
$today = new DateTime();

if ($check_in_date >= $check_out_date) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Check-out date must be after check-in date"
    );
    echo json_encode($returnArr);
    exit;
}

if ($check_in_date < $today) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Check-in date cannot be in the past"
    );
    echo json_encode($returnArr);
    exit;
}

// Validate book_for value
if (!in_array($book_for, ['self', 'other'])) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Invalid book_for value. Must be 'self' or 'other'"
    );
    echo json_encode($returnArr);
    exit;
}

try {
    // Check if user exists and get wallet balance
    $user_stmt = $rstate->prepare("SELECT wallet, name FROM tbl_user WHERE id = ? AND status = 1");
    $user_stmt->bind_param("i", $uid);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    
    if ($user_result->num_rows === 0) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "User not found or inactive"
        );
        echo json_encode($returnArr);
        exit;
    }
    
    $user_data = $user_result->fetch_assoc();
    
    // Check if user has sufficient wallet balance
    if ($user_data['wallet'] < $wall_amt) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Insufficient wallet balance",
            "wallet" => $user_data['wallet']
        );
        echo json_encode($returnArr);
        exit;
    }
    
    // Get property details
    $property_stmt = $rstate->prepare("SELECT title, image, add_user_id, status FROM tbl_property WHERE id = ?");
    $property_stmt->bind_param("i", $prop_id);
    $property_stmt->execute();
    $property_result = $property_stmt->get_result();
    
    if ($property_result->num_rows === 0) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Property not found"
        );
        echo json_encode($returnArr);
        exit;
    }
    
    $property_data = $property_result->fetch_assoc();
    
    if ($property_data['status'] != 1) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Property is not available for booking"
        );
        echo json_encode($returnArr);
        exit;
    }
    
    // Check for date conflicts
    $conflict_stmt = $rstate->prepare("SELECT id FROM tbl_book WHERE prop_id = ? AND book_status != 'Cancelled' AND ((check_in BETWEEN ? AND ?) OR (check_out BETWEEN ? AND ?) OR (check_in <= ? AND check_out >= ?))");
    $conflict_stmt->bind_param("issssss", $prop_id, $check_in, $check_out, $check_in, $check_out, $check_in, $check_out);
    $conflict_stmt->execute();
    $conflict_result = $conflict_stmt->get_result();
    
    if ($conflict_result->num_rows > 0) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "Selected dates are already booked"
        );
        echo json_encode($returnArr);
        exit;
    }
    
    // Start transaction
    $rstate->autocommit(FALSE);
    
    try {
        // Create booking
        $timestamp = date("Y-m-d H:i:s");
        $booking_stmt = $rstate->prepare("INSERT INTO tbl_book (prop_id, uid, check_in, check_out, subtotal, total, tax, p_method_id, book_for, prop_price, book_date, add_note, transaction_id, cou_amt, wall_amt, total_day, prop_title, prop_img, add_user_id, noguest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $booking_stmt->bind_param("iissddississdisssii", 
            $prop_id, $uid, $check_in, $check_out, $subtotal, $total, $tax, 
            $p_method_id, $book_for, $prop_price, $timestamp, $add_note, 
            $transaction_id, $cou_amt, $wall_amt, $total_day, 
            $property_data['title'], $property_data['image'], 
            $property_data['add_user_id'], $noguest
        );
        
        if (!$booking_stmt->execute()) {
            throw new Exception("Failed to create booking");
        }
        
        $booking_id = $rstate->insert_id;
        
        // Update wallet balance if wall_amt > 0
        if ($wall_amt > 0) {
            $new_wallet_balance = $user_data['wallet'] - $wall_amt;
            $wallet_update_stmt = $rstate->prepare("UPDATE tbl_user SET wallet = ? WHERE id = ?");
            $wallet_update_stmt->bind_param("di", $new_wallet_balance, $uid);
            $wallet_update_stmt->execute();
            
            // Add wallet transaction record
            $wallet_report_stmt = $rstate->prepare("INSERT INTO wallet_report (uid, message, status, amt, tdate) VALUES (?, ?, 'Debit', ?, ?)");
            $wallet_message = 'Wallet Used in Booking #' . $booking_id;
            $wallet_report_stmt->bind_param("isds", $uid, $wallet_message, $wall_amt, $timestamp);
            $wallet_report_stmt->execute();
        }
        
        // Handle additional guest information for 'other' booking
        if ($book_for === 'other') {
            $required_other_fields = ['fname', 'lname', 'gender', 'email', 'mobile', 'ccode', 'country'];
            foreach ($required_other_fields as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Missing required field for guest: " . $field);
                }
            }
            
            $fname = filter_var($data['fname'], FILTER_SANITIZE_STRING);
            $lname = filter_var($data['lname'], FILTER_SANITIZE_STRING);
            $gender = filter_var($data['gender'], FILTER_SANITIZE_STRING);
            $guest_email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
            $guest_mobile = filter_var($data['mobile'], FILTER_SANITIZE_STRING);
            $guest_ccode = filter_var($data['ccode'], FILTER_SANITIZE_STRING);
            $country = filter_var($data['country'], FILTER_SANITIZE_STRING);
            
            if (!$guest_email) {
                throw new Exception("Invalid guest email format");
            }
            
            $guest_stmt = $rstate->prepare("INSERT INTO tbl_person_record (fname, lname, gender, email, mobile, ccode, country, book_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $guest_stmt->bind_param("sssssssi", $fname, $lname, $gender, $guest_email, $guest_mobile, $guest_ccode, $country, $booking_id);
            $guest_stmt->execute();
        }
        
        // Commit transaction
        $rstate->commit();
        
        // Send notification
        $notification_stmt = $rstate->prepare("INSERT INTO tbl_notification (uid, datetime, title, description) VALUES (?, ?, ?, ?)");
        $notification_title = "Booking Confirmed!";
        $notification_desc = "Your booking #" . $booking_id . " has been confirmed.";
        $notification_stmt->bind_param("isss", $uid, $timestamp, $notification_title, $notification_desc);
        $notification_stmt->execute();
        
        // Send push notification
        if (!empty($set['one_key']) && !empty($set['one_hash'])) {
            $content = array("en" => $user_data['name'] . ', Your Booking #' . $booking_id . ' Has Been Confirmed.');
            $heading = array("en" => "Booking Confirmed!");
            
            $fields = array(
                'app_id' => $set['one_key'],
                'included_segments' => array("Active Users"),
                'data' => array("booking_id" => $booking_id, "type" => 'booking'),
                'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $uid)),
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
            
            curl_exec($ch);
            curl_close($ch);
        }
        
        // Get updated wallet balance
        $updated_wallet_stmt = $rstate->prepare("SELECT wallet FROM tbl_user WHERE id = ?");
        $updated_wallet_stmt->bind_param("i", $uid);
        $updated_wallet_stmt->execute();
        $updated_wallet_result = $updated_wallet_stmt->get_result();
        $updated_wallet = $updated_wallet_result->fetch_assoc()['wallet'];
        
        $returnArr = array(
            "ResponseCode" => "200",
            "Result" => "true",
            "ResponseMsg" => "Booking confirmed successfully!",
            "wallet" => $updated_wallet,
            "booking_id" => $booking_id,
            "booking_details" => array(
                "id" => $booking_id,
                "check_in" => $check_in,
                "check_out" => $check_out,
                "total" => $total,
                "property_title" => $property_data['title']
            )
        );
        
    } catch (Exception $e) {
        $rstate->rollback();
        throw $e;
    }
    
    // Re-enable autocommit
    $rstate->autocommit(TRUE);
    
} catch (Exception $e) {
    error_log("Booking error: " . $e->getMessage());
    $returnArr = array(
        "ResponseCode" => "500",
        "Result" => "false",
        "ResponseMsg" => "Booking failed: " . $e->getMessage()
    );
}

echo json_encode($returnArr);
?>