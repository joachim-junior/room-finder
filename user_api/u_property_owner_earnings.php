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

// Optional parameters for pagination and filtering
$limit = isset($data['limit']) ? intval($data['limit']) : 20;
$offset = isset($data['offset']) ? intval($data['offset']) : 0;
$status_filter = isset($data['status']) ? strip_tags(mysqli_real_escape_string($rstate, $data['status'])) : '';

// Check if user exists and is a property owner
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

// Get user info
$user = $rstate->query("SELECT * FROM tbl_user WHERE id = ".$uid)->fetch_assoc();

// Get earning statistics
$earning_stats = getPropertyOwnerEarningStats($uid, $rstate);

// Get recent payouts
$recent_payouts = getPropertyOwnerPayouts($uid, $limit, $offset, $status_filter, $rstate);

// Get total counts for pagination
$total_count = getTotalPayoutsCount($uid, $status_filter, $rstate);

$returnArr = array(
    "ResponseCode" => "200",
    "Result" => "true",
    "ResponseMsg" => "Earnings data retrieved successfully",
    "current_wallet_balance" => $user['wallet'],
    "earning_stats" => $earning_stats,
    "recent_payouts" => $recent_payouts,
    "total_payouts_count" => $total_count,
    "current_page" => floor($offset / $limit) + 1,
    "total_pages" => ceil($total_count / $limit)
);

echo json_encode($returnArr);

function getPropertyOwnerEarningStats($owner_id, $rstate) {
    // Today's earnings
    $today = date('Y-m-d');
    $today_stats = $rstate->query("SELECT 
        COUNT(*) as bookings_today,
        SUM(owner_payout) as earnings_today,
        SUM(commission_amount) as commission_today
        FROM tbl_commission_tracking 
        WHERE property_owner_id = $owner_id AND DATE(created_at) = '$today'")->fetch_assoc();
    
    // This month's earnings
    $month_start = date('Y-m-01');
    $month_stats = $rstate->query("SELECT 
        COUNT(*) as bookings_month,
        SUM(owner_payout) as earnings_month,
        SUM(commission_amount) as commission_month
        FROM tbl_commission_tracking 
        WHERE property_owner_id = $owner_id AND DATE(created_at) >= '$month_start'")->fetch_assoc();
    
    // All time earnings
    $all_time_stats = $rstate->query("SELECT 
        COUNT(*) as total_bookings,
        SUM(owner_payout) as total_earnings,
        SUM(commission_amount) as total_commission_paid,
        SUM(booking_amount) as total_booking_value
        FROM tbl_commission_tracking 
        WHERE property_owner_id = $owner_id")->fetch_assoc();
    
    // Pending earnings
    $pending_stats = $rstate->query("SELECT 
        COUNT(*) as pending_bookings,
        SUM(owner_payout) as pending_earnings
        FROM tbl_commission_tracking 
        WHERE property_owner_id = $owner_id AND status = 'pending'")->fetch_assoc();
    
    return array(
        'today' => array(
            'bookings' => $today_stats['bookings_today'] ?? 0,
            'earnings' => floatval($today_stats['earnings_today'] ?? 0),
            'commission_paid' => floatval($today_stats['commission_today'] ?? 0)
        ),
        'this_month' => array(
            'bookings' => $month_stats['bookings_month'] ?? 0,
            'earnings' => floatval($month_stats['earnings_month'] ?? 0),
            'commission_paid' => floatval($month_stats['commission_month'] ?? 0)
        ),
        'all_time' => array(
            'total_bookings' => $all_time_stats['total_bookings'] ?? 0,
            'total_earnings' => floatval($all_time_stats['total_earnings'] ?? 0),
            'total_commission_paid' => floatval($all_time_stats['total_commission_paid'] ?? 0),
            'total_booking_value' => floatval($all_time_stats['total_booking_value'] ?? 0)
        ),
        'pending' => array(
            'pending_bookings' => $pending_stats['pending_bookings'] ?? 0,
            'pending_earnings' => floatval($pending_stats['pending_earnings'] ?? 0)
        )
    );
}

function getPropertyOwnerPayouts($owner_id, $limit, $offset, $status_filter, $rstate) {
    $where_clause = "WHERE ct.property_owner_id = $owner_id";
    if(!empty($status_filter)) {
        $where_clause .= " AND ct.status = '$status_filter'";
    }
    
    $query = "SELECT 
        ct.*,
        b.prop_title,
        b.check_in,
        b.check_out,
        u.name as customer_name,
        pop.status as payout_status,
        pop.processed_at as payout_processed_at
        FROM tbl_commission_tracking ct
        LEFT JOIN tbl_book b ON ct.booking_id = b.id
        LEFT JOIN tbl_user u ON b.uid = u.id
        LEFT JOIN tbl_property_owner_payouts pop ON ct.id = pop.commission_tracking_id
        $where_clause
        ORDER BY ct.created_at DESC 
        LIMIT $limit OFFSET $offset";
    
    $result = $rstate->query($query);
    $payouts = array();
    
    while($row = $result->fetch_assoc()) {
        $payout = array(
            "booking_id" => $row['booking_id'],
            "property_title" => $row['prop_title'],
            "customer_name" => $row['customer_name'],
            "booking_amount" => floatval($row['booking_amount']),
            "commission_rate" => floatval($row['commission_rate']),
            "commission_amount" => floatval($row['commission_amount']),
            "your_earnings" => floatval($row['owner_payout']),
            "status" => $row['status'],
            "booking_date" => date("jS F Y", strtotime($row['created_at'])),
            "check_in" => $row['check_in'] ? date("jS F Y", strtotime($row['check_in'])) : null,
            "check_out" => $row['check_out'] ? date("jS F Y", strtotime($row['check_out'])) : null,
            "payout_status" => $row['payout_status'],
            "payout_date" => $row['payout_processed_at'] ? date("jS F Y, h:i A", strtotime($row['payout_processed_at'])) : null
        );
        
        $payouts[] = $payout;
    }
    
    return $payouts;
}

function getTotalPayoutsCount($owner_id, $status_filter, $rstate) {
    $where_clause = "WHERE property_owner_id = $owner_id";
    if(!empty($status_filter)) {
        $where_clause .= " AND status = '$status_filter'";
    }
    
    $count_query = $rstate->query("SELECT COUNT(*) as total FROM tbl_commission_tracking $where_clause");
    return $count_query->fetch_assoc()['total'];
}
?>