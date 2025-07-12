<?php
// Fapshi Payout Webhook Handler
// This endpoint receives payout status updates from Fapshi

require_once '../include/estate.php';

// Enable error logging for debugging
error_reporting(E_ALL);
ini_set('log_errors', 1);

// Log webhook receipt
error_log("Fapshi Payout Webhook received at: " . date('Y-m-d H:i:s'));

// Get the raw POST data
$input = file_get_contents('php://input');
error_log("Fapshi Payout Webhook raw input: " . $input);

// Set response header
header('Content-Type: application/json');

try {
    // Decode JSON payload
    $payload = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Fapshi Payout Webhook JSON decode error: " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload']);
        exit;
    }
    
    // Log the decoded payload
    error_log("Fapshi Payout Webhook decoded payload: " . json_encode($payload));
    
    // Get Fapshi settings for webhook verification
    $fapshi_settings = $rstate->query("SELECT * FROM tbl_payment_settings WHERE payment_gateway = 'fapshi' AND is_active = 'yes'")->fetch_assoc();
    
    if (!$fapshi_settings) {
        error_log("Fapshi Payout Webhook: Fapshi settings not found or inactive");
        http_response_code(500);
        echo json_encode(['error' => 'Payment gateway not configured']);
        exit;
    }
    
    // Verify webhook signature if present
    $webhook_secret = $fapshi_settings['webhook_secret'];
    if (!empty($webhook_secret)) {
        $received_signature = $_SERVER['HTTP_X_FAPSHI_SIGNATURE'] ?? $_SERVER['HTTP_X_SIGNATURE'] ?? '';
        
        if (!empty($received_signature)) {
            $expected_signature = hash_hmac('sha256', $input, $webhook_secret);
            
            if (!hash_equals($expected_signature, $received_signature)) {
                error_log("Fapshi Payout Webhook: Invalid signature");
                http_response_code(401);
                echo json_encode(['error' => 'Invalid signature']);
                exit;
            }
        }
    }
    
    // Extract relevant information from payload
    // Adapt these field names based on actual Fapshi webhook structure
    $transaction_id = $payload['transaction_id'] ?? $payload['id'] ?? $payload['reference'] ?? null;
    $external_reference = $payload['external_reference'] ?? $payload['external_id'] ?? $payload['merchant_reference'] ?? null;
    $status = $payload['status'] ?? $payload['transaction_status'] ?? null;
    $amount = $payload['amount'] ?? null;
    $fees = $payload['fees'] ?? $payload['fee'] ?? 0;
    
    error_log("Fapshi Payout Webhook extracted - Transaction ID: $transaction_id, External Ref: $external_reference, Status: $status");
    
    if (!$transaction_id && !$external_reference) {
        error_log("Fapshi Payout Webhook: Missing transaction ID or external reference");
        http_response_code(400);
        echo json_encode(['error' => 'Missing transaction identifier']);
        exit;
    }
    
    // Find the payout record
    $payout_record = null;
    if ($external_reference) {
        $payout_record = $rstate->query("SELECT * FROM tbl_fapshi_payouts WHERE payout_id = '" . $rstate->real_escape_string($external_reference) . "'")->fetch_assoc();
    }
    
    if (!$payout_record && $transaction_id) {
        $payout_record = $rstate->query("SELECT * FROM tbl_fapshi_payouts WHERE fapshi_transaction_id = '" . $rstate->real_escape_string($transaction_id) . "'")->fetch_assoc();
    }
    
    if (!$payout_record) {
        error_log("Fapshi Payout Webhook: Payout record not found for transaction ID: $transaction_id, external ref: $external_reference");
        http_response_code(404);
        echo json_encode(['error' => 'Payout record not found']);
        exit;
    }
    
    error_log("Fapshi Payout Webhook: Found payout record ID: " . $payout_record['id']);
    
    // Map Fapshi status to our status
    $new_status = mapFapshiStatus($status);
    
    if ($new_status !== $payout_record['status']) {
        
        // Start database transaction
        $rstate->begin_transaction();
        
        try {
            // Update payout record
            $update_payout = $rstate->prepare("UPDATE tbl_fapshi_payouts 
                                             SET status = ?, 
                                                 fapshi_transaction_id = COALESCE(?, fapshi_transaction_id),
                                                 fapshi_response = ?,
                                                 updated_at = NOW() 
                                             WHERE id = ?");
            $webhook_response = json_encode($payload);
            $update_payout->bind_param("sssi", $new_status, $transaction_id, $webhook_response, $payout_record['id']);
            $update_payout->execute();
            
            // Record fees if provided
            if ($fees > 0 && $amount > 0) {
                $net_amount = $amount - $fees;
                $fee_percentage = ($fees / $amount) * 100;
                
                $insert_fees = $rstate->prepare("INSERT INTO tbl_fapshi_payout_fees 
                                               (payout_id, payout_amount, fee_amount, fee_percentage, net_amount) 
                                               VALUES (?, ?, ?, ?, ?)
                                               ON DUPLICATE KEY UPDATE 
                                               fee_amount = VALUES(fee_amount),
                                               fee_percentage = VALUES(fee_percentage),
                                               net_amount = VALUES(net_amount)");
                $insert_fees->bind_param("sdddd", $payout_record['payout_id'], $amount, $fees, $fee_percentage, $net_amount);
                $insert_fees->execute();
            }
            
            // Send notification to property owner
            if ($new_status === 'completed') {
                sendPayoutCompletedNotification($payout_record, $rstate);
            } elseif ($new_status === 'failed') {
                sendPayoutFailedNotification($payout_record, $rstate);
            }
            
            // Commit transaction
            $rstate->commit();
            
            error_log("Fapshi Payout Webhook: Successfully updated payout " . $payout_record['payout_id'] . " to status: $new_status");
            
            // Respond with success
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Payout status updated successfully',
                'payout_id' => $payout_record['payout_id'],
                'new_status' => $new_status
            ]);
            
        } catch (Exception $e) {
            // Rollback transaction
            $rstate->rollback();
            error_log("Fapshi Payout Webhook: Database error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
        
    } else {
        // Status hasn't changed
        error_log("Fapshi Payout Webhook: No status change for payout " . $payout_record['payout_id']);
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'No status change required',
            'payout_id' => $payout_record['payout_id']
        ]);
    }
    
} catch (Exception $e) {
    error_log("Fapshi Payout Webhook: Unexpected error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}

/**
 * Map Fapshi status to our internal status
 */
function mapFapshiStatus($fapshi_status) {
    $status_map = [
        'pending' => 'processing',
        'processing' => 'processing',
        'completed' => 'completed',
        'successful' => 'completed',
        'success' => 'completed',
        'failed' => 'failed',
        'error' => 'failed',
        'cancelled' => 'cancelled',
        'canceled' => 'cancelled'
    ];
    
    $normalized_status = strtolower(trim($fapshi_status));
    return $status_map[$normalized_status] ?? 'processing';
}

/**
 * Send notification when payout is completed
 */
function sendPayoutCompletedNotification($payout_record, $rstate) {
    $user_data = $rstate->query("SELECT name, mobile FROM tbl_user WHERE id = " . $payout_record['property_owner_id'])->fetch_assoc();
    
    if ($user_data) {
        $message = "Your payout of " . number_format($payout_record['payout_amount'], 2) . " FCFA to " . $payout_record['mobile_number'] . " has been completed successfully.";
        
        // Log notification (integrate with your notification system)
        error_log("Payout completed notification for user " . $payout_record['property_owner_id'] . ": $message");
        
        // Here you could send SMS, email, or push notification
        // Example: sendSMS($user_data['mobile'], $message);
        // Example: sendEmail($user_data['email'], 'Payout Completed', $message);
    }
}

/**
 * Send notification when payout fails
 */
function sendPayoutFailedNotification($payout_record, $rstate) {
    $user_data = $rstate->query("SELECT name, mobile FROM tbl_user WHERE id = " . $payout_record['property_owner_id'])->fetch_assoc();
    
    if ($user_data) {
        $message = "Your payout request of " . number_format($payout_record['payout_amount'], 2) . " FCFA has failed. Please contact support or try again.";
        
        // Log notification (integrate with your notification system)
        error_log("Payout failed notification for user " . $payout_record['property_owner_id'] . ": $message");
        
        // Here you could send SMS, email, or push notification
        // Example: sendSMS($user_data['mobile'], $message);
        // Example: sendEmail($user_data['email'], 'Payout Failed', $message);
    }
}
?>