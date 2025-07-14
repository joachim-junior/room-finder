<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';
header('Content-type: text/json');
$data = json_decode(file_get_contents('php://input'), true);

if(empty($data['uid']) || empty($data['transaction_id'])) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Missing required parameters!"
    );
    echo json_encode($returnArr);
    exit;
}

$uid = strip_tags(mysqli_real_escape_string($rstate, $data['uid']));
$transaction_id = strip_tags(mysqli_real_escape_string($rstate, $data['transaction_id']));

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

// Get transaction details
$transaction_query = $rstate->query("SELECT * FROM tbl_wallet_transactions WHERE uid = $uid AND transaction_id = '$transaction_id'");

if($transaction_query->num_rows == 0) {
    $returnArr = array(
        "ResponseCode" => "404",
        "Result" => "false",
        "ResponseMsg" => "Transaction not found!"
    );
    echo json_encode($returnArr);
    exit;
}

$transaction = $transaction_query->fetch_assoc();

// If we have a Fapshi payment ID, check with Fapshi API
if(!empty($transaction['fapshi_payment_id'])) {
    $fapshi_config = getFapshiConfig($rstate);
    if($fapshi_config) {
        $fapshi_status = checkFapshiPaymentStatus($transaction['fapshi_payment_id'], $fapshi_config);
        
        if($fapshi_status['success']) {
            // Update local transaction status if it changed
            $fapshi_status_value = $fapshi_status['data']['status'];
            $local_status = $transaction['status'];
            
            // Map Fapshi status to local status
            $status_mapping = array(
                'pending' => 'pending',
                'success' => 'completed',
                'failed' => 'failed',
                'cancelled' => 'cancelled'
            );
            
            $mapped_status = isset($status_mapping[$fapshi_status_value]) ? $status_mapping[$fapshi_status_value] : $fapshi_status_value;
            
            if($mapped_status !== $local_status) {
                $h = new Estate();
                $update_field = array('status' => $mapped_status);
                $update_where = "WHERE id = " . $transaction['id'];
                $h->restateupdateData_Api($update_field, "tbl_wallet_transactions", $update_where);
                $transaction['status'] = $mapped_status;
            }
        }
    }
}

// Format the response
$status_message = "";
switch($transaction['status']) {
    case 'pending':
        $status_message = "Payment is being processed";
        break;
    case 'completed':
        $status_message = "Payment completed successfully";
        break;
    case 'failed':
        $status_message = "Payment failed";
        break;
    case 'cancelled':
        $status_message = "Payment was cancelled";
        break;
}

$returnArr = array(
    "ResponseCode" => "200",
    "Result" => "true",
    "ResponseMsg" => "Transaction status retrieved successfully",
    "transaction_id" => $transaction['transaction_id'],
    "amount" => $transaction['amount'],
    "status" => $transaction['status'],
    "status_message" => $status_message,
    "payment_method" => $transaction['payment_method'],
    "phone" => $transaction['phone'],
    "created_at" => date("jS F Y, h:i A", strtotime($transaction['created_at'])),
    "completed_at" => $transaction['completed_at'] ? date("jS F Y, h:i A", strtotime($transaction['completed_at'])) : null
);

echo json_encode($returnArr);

// Helper function to get Fapshi configuration
function getFapshiConfig($rstate) {
    $config_query = $rstate->query("SELECT * FROM tbl_payment_settings WHERE gateway = 'fapshi' AND status = 1");
    if($config_query->num_rows > 0) {
        $config = $config_query->fetch_assoc();
        return array(
            'api_user' => $config['api_user'],
            'api_key' => $config['api_key'],
            'base_url' => $config['sandbox_mode'] ? 'https://sandbox.fapshi.com' : 'https://api.fapshi.com'
        );
    }
    return false;
}

// Helper function to check Fapshi payment status
function checkFapshiPaymentStatus($payment_id, $config) {
    $url = $config['base_url'] . '/payment-status/' . $payment_id;
    
    $headers = array(
        'apiuser: ' . $config['api_user'],
        'apikey: ' . $config['api_key'],
        'Content-Type: application/json',
        'Accept: application/json'
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
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
    
    if($http_code === 200 && isset($response_data['status'])) {
        return array(
            'success' => true,
            'data' => $response_data
        );
    } else {
        return array(
            'success' => false,
            'message' => isset($response_data['message']) ? $response_data['message'] : 'Unknown error occurred'
        );
    }
}
?>