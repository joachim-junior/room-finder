<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';
header('Content-type: text/json');
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);

// Validate required parameters
if(empty($data['uid']) || empty($data['amount'])) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Missing required parameters!"
    );
    echo json_encode($returnArr);
    exit;
}

$uid = strip_tags(mysqli_real_escape_string($rstate, $data['uid']));
$amount = floatval(strip_tags(mysqli_real_escape_string($rstate, $data['amount'])));

// Validate minimum amount (adjust as needed)
if($amount < 500) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Minimum top-up amount is 500 FCFA!"
    );
    echo json_encode($returnArr);
    exit;
}

// Check if user exists
$checkUser = mysqli_num_rows(mysqli_query($rstate, "SELECT * FROM tbl_user WHERE id = ".$uid));
if($checkUser == 0) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "User not found!"
    );
    echo json_encode($returnArr);
    exit;
}

// Get user details
$user = $rstate->query("SELECT * FROM tbl_user WHERE id = ".$uid)->fetch_assoc();

// Generate unique transaction ID
$transaction_id = 'WALLET_' . time() . '_' . $uid;

// Store pending transaction in database
$timestamp = date("Y-m-d H:i:s");
$table = "tbl_wallet_transactions";
$field_values = array("uid", "transaction_id", "amount", "status", "payment_method", "created_at");
$data_values = array($uid, $transaction_id, $amount, 'pending', 'fapshi', $timestamp);

$h = new Estate();
$transaction_db_id = $h->restateinsertdata_Api_Id($field_values, $data_values, $table);

if(!$transaction_db_id) {
    $returnArr = array(
        "ResponseCode" => "500",
        "Result" => "false",
        "ResponseMsg" => "Failed to create transaction record!"
    );
    echo json_encode($returnArr);
    exit;
}

// Fapshi API Integration
$fapshi_config = getFapshiConfig($rstate);
if(!$fapshi_config) {
    $returnArr = array(
        "ResponseCode" => "500",
        "Result" => "false",
        "ResponseMsg" => "Payment system configuration error!"
    );
    echo json_encode($returnArr);
    exit;
}

// Create Fapshi charge
$charge_data = array(
    'amount' => $amount,
    'currency' => 'XAF', // Central African CFA Franc
    'email' => $user['email'],
    'callback_url' => $fapshi_config['callback_url'],
    'return_url' => $fapshi_config['return_url'],
    'description' => 'Wallet Top-up - ' . $transaction_id,
    'metadata' => array(
        'transaction_id' => $transaction_id,
        'user_id' => $uid,
        'type' => 'wallet_topup'
    )
);

$fapshi_response = createFapshiCharge($charge_data, $fapshi_config);

if($fapshi_response['success']) {
    // Update transaction with Fapshi charge ID
    $update_field = array('fapshi_charge_id' => $fapshi_response['data']['id']);
    $update_where = "WHERE id = " . $transaction_db_id;
    $h->restateupdateData_Api($update_field, $table, $update_where);
    
    $returnArr = array(
        "ResponseCode" => "200",
        "Result" => "true",
        "ResponseMsg" => "Payment initialized successfully!",
        "payment_url" => $fapshi_response['data']['hosted_url'],
        "transaction_id" => $transaction_id,
        "amount" => $amount
    );
} else {
    // Update transaction status to failed
    $update_field = array('status' => 'failed', 'error_message' => $fapshi_response['message']);
    $update_where = "WHERE id = " . $transaction_db_id;
    $h->restateupdateData_Api($update_field, $table, $update_where);
    
    $returnArr = array(
        "ResponseCode" => "500",
        "Result" => "false",
        "ResponseMsg" => "Payment initialization failed: " . $fapshi_response['message']
    );
}

echo json_encode($returnArr);

// Helper function to get Fapshi configuration
function getFapshiConfig($rstate) {
    $config_query = $rstate->query("SELECT * FROM tbl_payment_settings WHERE gateway = 'fapshi' AND status = 1");
    if($config_query->num_rows > 0) {
        $config = $config_query->fetch_assoc();
        return array(
            'api_key' => $config['api_key'],
            'secret_key' => $config['secret_key'],
            'base_url' => $config['sandbox_mode'] ? 'https://sandbox.fapshi.com' : 'https://api.fapshi.com',
            'callback_url' => $config['callback_url'],
            'return_url' => $config['return_url']
        );
    }
    return false;
}

// Helper function to create Fapshi charge
function createFapshiCharge($charge_data, $config) {
    $url = $config['base_url'] . '/v1/charges';
    
    $headers = array(
        'Authorization: Bearer ' . $config['api_key'],
        'Content-Type: application/json',
        'Accept: application/json'
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($charge_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if($response === false) {
        return array(
            'success' => false,
            'message' => 'Network error occurred'
        );
    }
    
    $response_data = json_decode($response, true);
    
    if($http_code === 201 && isset($response_data['data'])) {
        return array(
            'success' => true,
            'data' => $response_data['data']
        );
    } else {
        return array(
            'success' => false,
            'message' => isset($response_data['message']) ? $response_data['message'] : 'Unknown error occurred'
        );
    }
}
?>