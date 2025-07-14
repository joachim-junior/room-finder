<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';

// Log all webhook requests for debugging
error_log("Fapshi Webhook called: " . file_get_contents('php://input'));

// Get the webhook payload
$payload = file_get_contents('php://input');
$webhook_data = json_decode($payload, true);

// Get headers
$headers = getallheaders();
$signature = isset($headers['X-Fapshi-Signature']) ? $headers['X-Fapshi-Signature'] : '';

// Verify webhook signature
if(!verifyFapshiSignature($payload, $signature)) {
    http_response_code(401);
    echo json_encode(array('error' => 'Invalid signature'));
    exit;
}

// Validate webhook data
if(!$webhook_data || !isset($webhook_data['event_type']) || !isset($webhook_data['data'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'Invalid webhook data'));
    exit;
}

$event_type = $webhook_data['event_type'];
$event_data = $webhook_data['data'];

// Process different event types
switch($event_type) {
    // Payment events
    case 'payment.success':
        handleSuccessfulPayment($event_data);
        break;
    case 'payment.failed':
        handleFailedPayment($event_data);
        break;
    case 'payment.cancelled':
        handleCancelledPayment($event_data);
        break;
    
    // Payout events
    case 'payout.success':
        handleSuccessfulPayout($event_data);
        break;
    case 'payout.failed':
        handleFailedPayout($event_data);
        break;
    case 'payout.cancelled':
        handleCancelledPayout($event_data);
        break;
    
    // Direct Pay events
    case 'direct-pay.success':
        handleSuccessfulDirectPay($event_data);
        break;
    case 'direct-pay.failed':
        handleFailedDirectPay($event_data);
        break;
    case 'direct-pay.cancelled':
        handleCancelledDirectPay($event_data);
        break;
    
    default:
        // Log unknown event types
        error_log("Unknown Fapshi webhook event type: " . $event_type);
        break;
}

// Return success response
http_response_code(200);
echo json_encode(array('status' => 'success'));

// Function to verify Fapshi signature
function verifyFapshiSignature($payload, $signature) {
    global $rstate;
    
    $config = getFapshiConfig($rstate);
    if(!$config) {
        return false;
    }
    
    // Use webhook secret configured in Fapshi dashboard
    $expected_signature = hash_hmac('sha256', $payload, $config['webhook_secret']);
    return hash_equals($expected_signature, $signature);
}

// Function to handle successful payment
function handleSuccessfulPayment($event_data) {
    global $rstate;
    
    $payment_id = $event_data['id'];
    $amount = $event_data['amount'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['transaction_id']) || !isset($metadata['user_id'])) {
        error_log("Missing metadata in successful payment webhook");
        return;
    }
    
    $transaction_id = $metadata['transaction_id'];
    $user_id = $metadata['user_id'];
    
    // Check if transaction exists and is pending
    $transaction_query = $rstate->query("SELECT * FROM tbl_wallet_transactions WHERE transaction_id = '$transaction_id' AND status = 'pending'");
    
    if($transaction_query->num_rows == 0) {
        error_log("Transaction not found or already processed: " . $transaction_id);
        return;
    }
    
    $transaction = $transaction_query->fetch_assoc();
    
    // Verify amounts match
    if($transaction['amount'] != $amount) {
        error_log("Amount mismatch for transaction: " . $transaction_id);
        return;
    }
    
    // Update user wallet balance
    $user_query = $rstate->query("SELECT * FROM tbl_user WHERE id = " . $user_id);
    if($user_query->num_rows == 0) {
        error_log("User not found: " . $user_id);
        return;
    }
    
    $user = $user_query->fetch_assoc();
    $new_balance = $user['wallet'] + $amount;
    
    // Start transaction to ensure data consistency
    $rstate->autocommit(false);
    
    try {
        // Update user wallet
        $update_wallet = $rstate->query("UPDATE tbl_user SET wallet = $new_balance WHERE id = $user_id");
        
        // Update transaction status
        $update_transaction = $rstate->query("UPDATE tbl_wallet_transactions SET status = 'completed', fapshi_payment_id = '$payment_id', completed_at = NOW() WHERE transaction_id = '$transaction_id'");
        
        // Add wallet report entry
        $timestamp = date("Y-m-d H:i:s");
        $h = new Estate();
        $wallet_report_fields = array("uid", "message", "status", "amt", "tdate");
        $wallet_report_values = array($user_id, "Wallet Funded via Fapshi - " . $transaction_id, "Credit", $amount, $timestamp);
        $h->restateinsertdata_Api($wallet_report_fields, $wallet_report_values, "wallet_report");
        
        // Send notification
        sendWalletTopupNotification($user_id, $amount, $transaction_id);
        
        // Commit transaction
        $rstate->commit();
        
        error_log("Successfully processed wallet topup: " . $transaction_id . " for user: " . $user_id);
        
    } catch(Exception $e) {
        // Rollback transaction on error
        $rstate->rollback();
        error_log("Error processing wallet topup: " . $e->getMessage());
    }
    
    $rstate->autocommit(true);
}

// Function to handle successful direct pay
function handleSuccessfulDirectPay($event_data) {
    global $rstate;
    
    $payment_id = $event_data['id'];
    $amount = $event_data['amount'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['transaction_id']) || !isset($metadata['user_id'])) {
        error_log("Missing metadata in successful direct pay webhook");
        return;
    }
    
    $transaction_id = $metadata['transaction_id'];
    $user_id = $metadata['user_id'];
    
    // Check if transaction exists and is pending
    $transaction_query = $rstate->query("SELECT * FROM tbl_wallet_transactions WHERE transaction_id = '$transaction_id' AND status = 'pending'");
    
    if($transaction_query->num_rows == 0) {
        error_log("Transaction not found or already processed: " . $transaction_id);
        return;
    }
    
    $transaction = $transaction_query->fetch_assoc();
    
    // Verify amounts match
    if($transaction['amount'] != $amount) {
        error_log("Amount mismatch for transaction: " . $transaction_id);
        return;
    }
    
    // Update transaction status to completed
    $rstate->query("UPDATE tbl_wallet_transactions SET status = 'completed', fapshi_payment_id = '$payment_id', completed_at = NOW() WHERE transaction_id = '$transaction_id'");
    
    // Send notification
    sendDirectPayNotification($user_id, $amount, $transaction_id);
    
    error_log("Successfully processed direct pay: " . $transaction_id . " for user: " . $user_id);
}

// Function to handle successful payout
function handleSuccessfulPayout($event_data) {
    global $rstate;
    
    $payout_id = $event_data['id'];
    $amount = $event_data['amount'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['payout_id']) || !isset($metadata['user_id'])) {
        error_log("Missing metadata in successful payout webhook");
        return;
    }
    
    $payout_transaction_id = $metadata['payout_id'];
    $user_id = $metadata['user_id'];
    
    // Check if payout exists and is pending
    $payout_query = $rstate->query("SELECT * FROM tbl_payouts WHERE payout_id = '$payout_transaction_id' AND status = 'pending'");
    
    if($payout_query->num_rows == 0) {
        error_log("Payout not found or already processed: " . $payout_transaction_id);
        return;
    }
    
    $payout = $payout_query->fetch_assoc();
    
    // Verify amounts match
    if($payout['amount'] != $amount) {
        error_log("Amount mismatch for payout: " . $payout_transaction_id);
        return;
    }
    
    // Update payout status to completed
    $rstate->query("UPDATE tbl_payouts SET status = 'completed', fapshi_payout_id = '$payout_id', completed_at = NOW() WHERE payout_id = '$payout_transaction_id'");
    
    // Send notification
    sendPayoutNotification($user_id, $amount, $payout_transaction_id);
    
    error_log("Successfully processed payout: " . $payout_transaction_id . " for user: " . $user_id);
}

// Function to handle failed payment
function handleFailedPayment($event_data) {
    global $rstate;
    
    $payment_id = $event_data['id'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['transaction_id'])) {
        error_log("Missing transaction_id in failed payment webhook");
        return;
    }
    
    $transaction_id = $metadata['transaction_id'];
    
    // Update transaction status to failed
    $rstate->query("UPDATE tbl_wallet_transactions SET status = 'failed', fapshi_payment_id = '$payment_id', completed_at = NOW() WHERE transaction_id = '$transaction_id'");
    
    error_log("Payment failed for transaction: " . $transaction_id);
}

// Function to handle failed direct pay
function handleFailedDirectPay($event_data) {
    global $rstate;
    
    $payment_id = $event_data['id'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['transaction_id'])) {
        error_log("Missing transaction_id in failed direct pay webhook");
        return;
    }
    
    $transaction_id = $metadata['transaction_id'];
    
    // Update transaction status to failed
    $rstate->query("UPDATE tbl_wallet_transactions SET status = 'failed', fapshi_payment_id = '$payment_id', completed_at = NOW() WHERE transaction_id = '$transaction_id'");
    
    error_log("Direct pay failed for transaction: " . $transaction_id);
}

// Function to handle failed payout
function handleFailedPayout($event_data) {
    global $rstate;
    
    $payout_id = $event_data['id'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['payout_id'])) {
        error_log("Missing payout_id in failed payout webhook");
        return;
    }
    
    $payout_transaction_id = $metadata['payout_id'];
    
    // Update payout status to failed
    $rstate->query("UPDATE tbl_payouts SET status = 'failed', fapshi_payout_id = '$payout_id', completed_at = NOW() WHERE payout_id = '$payout_transaction_id'");
    
    error_log("Payout failed for transaction: " . $payout_transaction_id);
}

// Function to handle cancelled payment
function handleCancelledPayment($event_data) {
    global $rstate;
    
    $payment_id = $event_data['id'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['transaction_id'])) {
        error_log("Missing transaction_id in cancelled payment webhook");
        return;
    }
    
    $transaction_id = $metadata['transaction_id'];
    
    // Update transaction status to cancelled
    $rstate->query("UPDATE tbl_wallet_transactions SET status = 'cancelled', fapshi_payment_id = '$payment_id', completed_at = NOW() WHERE transaction_id = '$transaction_id'");
    
    error_log("Payment cancelled for transaction: " . $transaction_id);
}

// Function to handle cancelled direct pay
function handleCancelledDirectPay($event_data) {
    global $rstate;
    
    $payment_id = $event_data['id'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['transaction_id'])) {
        error_log("Missing transaction_id in cancelled direct pay webhook");
        return;
    }
    
    $transaction_id = $metadata['transaction_id'];
    
    // Update transaction status to cancelled
    $rstate->query("UPDATE tbl_wallet_transactions SET status = 'cancelled', fapshi_payment_id = '$payment_id', completed_at = NOW() WHERE transaction_id = '$transaction_id'");
    
    error_log("Direct pay cancelled for transaction: " . $transaction_id);
}

// Function to handle cancelled payout
function handleCancelledPayout($event_data) {
    global $rstate;
    
    $payout_id = $event_data['id'];
    $metadata = $event_data['metadata'];
    
    if(!isset($metadata['payout_id'])) {
        error_log("Missing payout_id in cancelled payout webhook");
        return;
    }
    
    $payout_transaction_id = $metadata['payout_id'];
    
    // Update payout status to cancelled
    $rstate->query("UPDATE tbl_payouts SET status = 'cancelled', fapshi_payout_id = '$payout_id', completed_at = NOW() WHERE payout_id = '$payout_transaction_id'");
    
    error_log("Payout cancelled for transaction: " . $payout_transaction_id);
}

// Function to send wallet topup notification
function sendWalletTopupNotification($user_id, $amount, $transaction_id) {
    global $rstate, $set;
    
    // Get user data
    $user_query = $rstate->query("SELECT * FROM tbl_user WHERE id = $user_id");
    if($user_query->num_rows == 0) {
        return;
    }
    
    $user = $user_query->fetch_assoc();
    $name = $user['name'];
    
    // Send push notification
    $content = array(
        "en" => $name . ', Your wallet has been credited with ' . $amount . ' FCFA.'
    );
    $heading = array(
        "en" => "Wallet Funded Successfully!"
    );
    
    $fields = array(
        'app_id' => $set['one_key'],
        'included_segments' => array("Active Users"),
        'data' => array("transaction_id" => $transaction_id, "type" => 'wallet_topup'),
        'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $user_id)),
        'contents' => $content,
        'headings' => $heading
    );
    
    $fields = json_encode($fields);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' . $set['one_hash']
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Save notification to database
    $timestamp = date("Y-m-d H:i:s");
    $title = "Wallet Funded Successfully!";
    $description = 'Your wallet has been credited with ' . $amount . ' FCFA.';
    
    $h = new Estate();
    $notification_fields = array("uid", "datetime", "title", "description");
    $notification_values = array($user_id, $timestamp, $title, $description);
    $h->restateinsertdata_Api($notification_fields, $notification_values, "tbl_notification");
}

// Function to send direct pay notification
function sendDirectPayNotification($user_id, $amount, $transaction_id) {
    global $rstate, $set;
    
    // Get user data
    $user_query = $rstate->query("SELECT * FROM tbl_user WHERE id = $user_id");
    if($user_query->num_rows == 0) {
        return;
    }
    
    $user = $user_query->fetch_assoc();
    $name = $user['name'];
    
    // Send push notification
    $content = array(
        "en" => $name . ', Your payment of ' . $amount . ' FCFA has been processed successfully.'
    );
    $heading = array(
        "en" => "Payment Successful!"
    );
    
    $fields = array(
        'app_id' => $set['one_key'],
        'included_segments' => array("Active Users"),
        'data' => array("transaction_id" => $transaction_id, "type" => 'direct_pay'),
        'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $user_id)),
        'contents' => $content,
        'headings' => $heading
    );
    
    $fields = json_encode($fields);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' . $set['one_hash']
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Save notification to database
    $timestamp = date("Y-m-d H:i:s");
    $title = "Payment Successful!";
    $description = 'Your payment of ' . $amount . ' FCFA has been processed successfully.';
    
    $h = new Estate();
    $notification_fields = array("uid", "datetime", "title", "description");
    $notification_values = array($user_id, $timestamp, $title, $description);
    $h->restateinsertdata_Api($notification_fields, $notification_values, "tbl_notification");
}

// Function to send payout notification
function sendPayoutNotification($user_id, $amount, $payout_id) {
    global $rstate, $set;
    
    // Get user data
    $user_query = $rstate->query("SELECT * FROM tbl_user WHERE id = $user_id");
    if($user_query->num_rows == 0) {
        return;
    }
    
    $user = $user_query->fetch_assoc();
    $name = $user['name'];
    
    // Send push notification
    $content = array(
        "en" => $name . ', Your payout of ' . $amount . ' FCFA has been processed successfully.'
    );
    $heading = array(
        "en" => "Payout Successful!"
    );
    
    $fields = array(
        'app_id' => $set['one_key'],
        'included_segments' => array("Active Users"),
        'data' => array("payout_id" => $payout_id, "type" => 'payout'),
        'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $user_id)),
        'contents' => $content,
        'headings' => $heading
    );
    
    $fields = json_encode($fields);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' . $set['one_hash']
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Save notification to database
    $timestamp = date("Y-m-d H:i:s");
    $title = "Payout Successful!";
    $description = 'Your payout of ' . $amount . ' FCFA has been processed successfully.';
    
    $h = new Estate();
    $notification_fields = array("uid", "datetime", "title", "description");
    $notification_values = array($user_id, $timestamp, $title, $description);
    $h->restateinsertdata_Api($notification_fields, $notification_values, "tbl_notification");
}

// Function to get Fapshi configuration
function getFapshiConfig($rstate) {
    $config_query = $rstate->query("SELECT * FROM tbl_payment_settings WHERE gateway = 'fapshi' AND status = 1");
    if($config_query->num_rows > 0) {
        $config = $config_query->fetch_assoc();
        return array(
            'api_user' => $config['api_user'],
            'api_key' => $config['api_key'],
            'webhook_secret' => $config['webhook_secret'],
            'base_url' => $config['sandbox_mode'] ? 'https://sandbox.fapshi.com' : 'https://api.fapshi.com'
        );
    }
    return false;
}
?>