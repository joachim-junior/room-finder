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
    "created_at" => date("jS F Y, h:i A", strtotime($transaction['created_at'])),
    "completed_at" => $transaction['completed_at'] ? date("jS F Y, h:i A", strtotime($transaction['completed_at'])) : null
);

echo json_encode($returnArr);
?>