<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';
header('Content-type: text/json');
$data = json_decode(file_get_contents('php://input'), true);

if(empty($data['uid'])) {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Missing user ID!"
    );
    echo json_encode($returnArr);
    exit;
}

$uid = strip_tags(mysqli_real_escape_string($rstate, $data['uid']));

// Optional parameters for pagination
$limit = isset($data['limit']) ? intval($data['limit']) : 20;
$offset = isset($data['offset']) ? intval($data['offset']) : 0;

// Optional status filter
$status_filter = isset($data['status']) ? strip_tags(mysqli_real_escape_string($rstate, $data['status'])) : '';

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

// Build query
$where_clause = "WHERE uid = $uid";
if(!empty($status_filter)) {
    $where_clause .= " AND status = '$status_filter'";
}

// Get transaction history
$query = "SELECT * FROM tbl_wallet_transactions $where_clause ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
$transaction_query = $rstate->query($query);

// Get total count for pagination
$count_query = $rstate->query("SELECT COUNT(*) as total FROM tbl_wallet_transactions $where_clause");
$total_count = $count_query->fetch_assoc()['total'];

$transactions = array();
while($row = $transaction_query->fetch_assoc()) {
    $status_message = "";
    switch($row['status']) {
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

    $transaction = array(
        "id" => $row['id'],
        "transaction_id" => $row['transaction_id'],
        "amount" => $row['amount'],
        "status" => $row['status'],
        "status_message" => $status_message,
        "payment_method" => $row['payment_method'],
        "created_at" => date("jS F Y, h:i A", strtotime($row['created_at'])),
        "completed_at" => $row['completed_at'] ? date("jS F Y, h:i A", strtotime($row['completed_at'])) : null
    );
    
    $transactions[] = $transaction;
}

$returnArr = array(
    "ResponseCode" => "200",
    "Result" => "true",
    "ResponseMsg" => "Transaction history retrieved successfully",
    "transactions" => $transactions,
    "total_count" => $total_count,
    "current_page" => floor($offset / $limit) + 1,
    "total_pages" => ceil($total_count / $limit)
);

echo json_encode($returnArr);
?>