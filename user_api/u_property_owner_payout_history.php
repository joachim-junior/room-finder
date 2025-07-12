<?php
include '../include/estate.php';

$data = json_decode(file_get_contents('php://input'), true);

// Check if user is logged in
if (!isset($_SESSION['restatename'])) {
    $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Session Expired!!");
} else {
    
    $user_id = $_SESSION['restateid'];
    
    // Check if user owns any properties
    $property_check = $rstate->query("SELECT COUNT(*) as count FROM tbl_property WHERE add_user_id = $user_id");
    $property_count = $property_check->fetch_assoc()['count'];
    
    if ($property_count == 0) {
        $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "You don't own any properties!");
    } else {
        
        try {
            // Get payout history with pagination
            $limit = isset($data['limit']) ? intval($data['limit']) : 20;
            $offset = isset($data['offset']) ? intval($data['offset']) : 0;
            $status_filter = isset($data['status']) ? $data['status'] : '';
            
            // Build WHERE clause for filtering
            $where_conditions = ["property_owner_id = $user_id"];
            if (!empty($status_filter)) {
                $where_conditions[] = "status = '" . $rstate->real_escape_string($status_filter) . "'";
            }
            $where_clause = implode(' AND ', $where_conditions);
            
            // Get payout history
            $payout_history_query = "SELECT 
                payout_id,
                payout_amount,
                mobile_number,
                payment_method,
                description,
                status,
                fapshi_transaction_id,
                error_message,
                created_at,
                updated_at
            FROM tbl_fapshi_payouts 
            WHERE $where_clause 
            ORDER BY created_at DESC 
            LIMIT $limit OFFSET $offset";
            
            $payout_history_result = $rstate->query($payout_history_query);
            $payout_history = [];
            
            if ($payout_history_result) {
                while ($row = $payout_history_result->fetch_assoc()) {
                    $payout_history[] = [
                        'payout_id' => $row['payout_id'],
                        'amount' => number_format($row['payout_amount'], 2),
                        'mobile_number' => $row['mobile_number'],
                        'payment_method' => ucfirst(str_replace('_', ' ', $row['payment_method'])),
                        'description' => $row['description'],
                        'status' => ucfirst($row['status']),
                        'status_color' => getStatusColor($row['status']),
                        'transaction_id' => $row['fapshi_transaction_id'],
                        'error_message' => $row['error_message'],
                        'created_at' => date('M j, Y H:i', strtotime($row['created_at'])),
                        'updated_at' => $row['updated_at'] ? date('M j, Y H:i', strtotime($row['updated_at'])) : null
                    ];
                }
            }
            
            // Get total count for pagination
            $count_query = "SELECT COUNT(*) as total FROM tbl_fapshi_payouts WHERE $where_clause";
            $total_count = $rstate->query($count_query)->fetch_assoc()['total'];
            
            // Get earnings summary
            $earnings_summary = getEarningsSummary($user_id, $rstate);
            
            // Get commission settings for minimum payout amount
            $commission_settings = $rstate->query("SELECT * FROM tbl_commission_settings WHERE id = 1")->fetch_assoc();
            $min_payout_amount = $commission_settings ? floatval($commission_settings['min_payout_amount']) : 1000.0;
            
            // Get payout settings
            $payout_settings = $rstate->query("SELECT * FROM tbl_property_owner_payout_settings WHERE property_owner_id = $user_id")->fetch_assoc();
            
            $returnArr = array(
                "ResponseCode" => "200",
                "Result" => "true",
                "ResponseMsg" => "Payout history retrieved successfully!",
                "earnings_summary" => $earnings_summary,
                "payout_history" => $payout_history,
                "pagination" => [
                    'total' => intval($total_count),
                    'limit' => $limit,
                    'offset' => $offset,
                    'has_more' => ($offset + $limit) < $total_count
                ],
                "settings" => [
                    'min_payout_amount' => number_format($min_payout_amount, 2),
                    'preferred_payment_method' => $payout_settings['preferred_payment_method'] ?? 'mtn_momo',
                    'default_mobile_number' => $payout_settings['default_mobile_number'] ?? '',
                    'auto_payout_enabled' => $payout_settings['auto_payout_enabled'] ?? 0,
                    'auto_payout_threshold' => $payout_settings['auto_payout_threshold'] ?? 0
                ],
                "available_methods" => [
                    ['value' => 'mtn_momo', 'label' => 'MTN Mobile Money'],
                    ['value' => 'orange_money', 'label' => 'Orange Money']
                ]
            );
            
        } catch (Exception $e) {
            error_log("Property owner payout history error: " . $e->getMessage());
            $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Error retrieving payout history!");
        }
    }
}

/**
 * Get earnings summary for property owner
 */
function getEarningsSummary($user_id, $rstate) {
    // Get total earnings from completed bookings
    $earnings_query = "SELECT SUM(amount) as total_earnings 
                      FROM tbl_property_owner_payouts 
                      WHERE property_owner_id = $user_id AND status = 'completed'";
    $total_earnings_result = $rstate->query($earnings_query);
    $total_earnings = $total_earnings_result ? floatval($total_earnings_result->fetch_assoc()['total_earnings']) : 0;
    
    // Get pending earnings
    $pending_earnings_query = "SELECT SUM(amount) as pending_earnings 
                              FROM tbl_property_owner_payouts 
                              WHERE property_owner_id = $user_id AND status = 'pending'";
    $pending_earnings_result = $rstate->query($pending_earnings_query);
    $pending_earnings = $pending_earnings_result ? floatval($pending_earnings_result->fetch_assoc()['pending_earnings']) : 0;
    
    // Get total withdrawn amount
    $withdrawn_query = "SELECT SUM(payout_amount) as total_withdrawn 
                       FROM tbl_fapshi_payouts 
                       WHERE property_owner_id = $user_id AND status = 'completed'";
    $withdrawn_result = $rstate->query($withdrawn_query);
    $total_withdrawn = $withdrawn_result ? floatval($withdrawn_result->fetch_assoc()['total_withdrawn']) : 0;
    
    // Get pending withdrawals
    $pending_withdrawals_query = "SELECT SUM(payout_amount) as pending_withdrawals 
                                 FROM tbl_fapshi_payouts 
                                 WHERE property_owner_id = $user_id AND status IN ('pending', 'processing')";
    $pending_withdrawals_result = $rstate->query($pending_withdrawals_query);
    $pending_withdrawals = $pending_withdrawals_result ? floatval($pending_withdrawals_result->fetch_assoc()['pending_withdrawals']) : 0;
    
    // Calculate available balance
    $available_balance = ($total_earnings + $pending_earnings) - ($total_withdrawn + $pending_withdrawals);
    
    // Get today's earnings
    $today = date('Y-m-d');
    $today_earnings_query = "SELECT SUM(amount) as today_earnings 
                           FROM tbl_property_owner_payouts 
                           WHERE property_owner_id = $user_id AND DATE(created_at) = '$today'";
    $today_earnings_result = $rstate->query($today_earnings_query);
    $today_earnings = $today_earnings_result ? floatval($today_earnings_result->fetch_assoc()['today_earnings']) : 0;
    
    // Get this month's earnings
    $month_start = date('Y-m-01');
    $month_earnings_query = "SELECT SUM(amount) as month_earnings 
                           FROM tbl_property_owner_payouts 
                           WHERE property_owner_id = $user_id AND DATE(created_at) >= '$month_start'";
    $month_earnings_result = $rstate->query($month_earnings_query);
    $month_earnings = $month_earnings_result ? floatval($month_earnings_result->fetch_assoc()['month_earnings']) : 0;
    
    return [
        'total_earnings' => number_format($total_earnings, 2),
        'pending_earnings' => number_format($pending_earnings, 2),
        'available_balance' => number_format($available_balance, 2),
        'total_withdrawn' => number_format($total_withdrawn, 2),
        'pending_withdrawals' => number_format($pending_withdrawals, 2),
        'today_earnings' => number_format($today_earnings, 2),
        'month_earnings' => number_format($month_earnings, 2),
        'can_withdraw' => $available_balance > 0
    ];
}

/**
 * Get status color for UI display
 */
function getStatusColor($status) {
    $colors = [
        'pending' => '#ffc107',      // yellow
        'processing' => '#17a2b8',   // blue
        'completed' => '#28a745',    // green
        'failed' => '#dc3545',       // red
        'cancelled' => '#6c757d'     // gray
    ];
    
    return $colors[$status] ?? '#6c757d';
}

echo json_encode($returnArr);
?>