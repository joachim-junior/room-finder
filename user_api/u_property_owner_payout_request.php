<?php
include '../include/estate.php';

$data = json_decode(file_get_contents('php://input'), true);

// Check if user is logged in
if (!isset($_SESSION['restatename'])) {
    $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Session Expired!!");
} else {
    
    // Check required parameters
    if (empty($data['amount']) || empty($data['mobile_number']) || empty($data['payment_method'])) {
        $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Please provide amount, mobile number, and payment method!");
    } else {
        
        $user_id = $_SESSION['restateid'];
        $amount = floatval($data['amount']);
        $mobile_number = trim($data['mobile_number']);
        $payment_method = trim($data['payment_method']); // 'mtn_momo' or 'orange_money'
        $description = isset($data['description']) ? trim($data['description']) : 'Property Owner Payout';
        
        // Validate payment method
        if (!in_array($payment_method, ['mtn_momo', 'orange_money'])) {
            $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Invalid payment method! Use 'mtn_momo' or 'orange_money'");
        } else {
            
            // Check if user owns any properties
            $property_check = $rstate->query("SELECT COUNT(*) as count FROM tbl_property WHERE add_user_id = $user_id");
            $property_count = $property_check->fetch_assoc()['count'];
            
            if ($property_count == 0) {
                $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "You don't own any properties!");
            } else {
                
                // Get commission settings
                $commission_settings = $rstate->query("SELECT * FROM tbl_commission_settings WHERE id = 1")->fetch_assoc();
                $min_payout_amount = $commission_settings ? floatval($commission_settings['min_payout_amount']) : 1000.0;
                
                // Check minimum payout amount
                if ($amount < $min_payout_amount) {
                    $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Minimum payout amount is " . number_format($min_payout_amount, 2) . " " . $set['currency']);
                } else {
                    
                    // Calculate available balance for property owner
                    $earnings_query = "SELECT SUM(amount) as total_earnings 
                                     FROM tbl_property_owner_payouts 
                                     WHERE property_owner_id = $user_id AND status = 'completed'";
                    $total_earnings_result = $rstate->query($earnings_query);
                    $total_earnings = $total_earnings_result ? floatval($total_earnings_result->fetch_assoc()['total_earnings']) : 0;
                    
                    $pending_earnings_query = "SELECT SUM(amount) as pending_earnings 
                                             FROM tbl_property_owner_payouts 
                                             WHERE property_owner_id = $user_id AND status = 'pending'";
                    $pending_earnings_result = $rstate->query($pending_earnings_query);
                    $pending_earnings = $pending_earnings_result ? floatval($pending_earnings_result->fetch_assoc()['pending_earnings']) : 0;
                    
                    $withdrawn_query = "SELECT SUM(payout_amount) as total_withdrawn 
                                      FROM tbl_fapshi_payouts 
                                      WHERE property_owner_id = $user_id AND status = 'completed'";
                    $withdrawn_result = $rstate->query($withdrawn_query);
                    $total_withdrawn = $withdrawn_result ? floatval($withdrawn_result->fetch_assoc()['total_withdrawn']) : 0;
                    
                    $available_balance = ($total_earnings + $pending_earnings) - $total_withdrawn;
                    
                    if ($amount > $available_balance) {
                        $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Insufficient balance! Available: " . number_format($available_balance, 2) . " " . $set['currency']);
                    } else {
                        
                        // Get Fapshi settings
                        $fapshi_settings = $rstate->query("SELECT * FROM tbl_payment_settings WHERE payment_gateway = 'fapshi' AND is_active = 'yes'")->fetch_assoc();
                        
                        if (!$fapshi_settings) {
                            $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Fapshi payment gateway not configured!");
                        } else {
                            
                            // Create payout request in database first
                            $payout_id = 'PAYOUT_' . time() . '_' . $user_id;
                            
                            $payout_insert = $rstate->prepare("INSERT INTO tbl_fapshi_payouts 
                                (payout_id, property_owner_id, payout_amount, mobile_number, payment_method, description, status, created_at) 
                                VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())");
                            $payout_insert->bind_param("sidssss", $payout_id, $user_id, $amount, $mobile_number, $payment_method, $description);
                            
                            if ($payout_insert->execute()) {
                                
                                // Initiate Fapshi transfer
                                $transfer_result = initiateFapshiTransfer($payout_id, $amount, $mobile_number, $payment_method, $description, $fapshi_settings);
                                
                                if ($transfer_result['success']) {
                                    
                                    // Update payout record with Fapshi transaction ID
                                    $update_payout = $rstate->prepare("UPDATE tbl_fapshi_payouts 
                                                                     SET fapshi_transaction_id = ?, 
                                                                         fapshi_response = ?, 
                                                                         status = 'processing',
                                                                         updated_at = NOW() 
                                                                     WHERE payout_id = ?");
                                    $fapshi_response = json_encode($transfer_result['response']);
                                    $update_payout->bind_param("sss", $transfer_result['transaction_id'], $fapshi_response, $payout_id);
                                    $update_payout->execute();
                                    
                                    // Send notification
                                    sendPayoutNotification($user_id, $amount, $mobile_number, $payment_method, $rstate);
                                    
                                    $returnArr = array(
                                        "ResponseCode" => "200", 
                                        "Result" => "true", 
                                        "ResponseMsg" => "Payout request submitted successfully!",
                                        "payout_id" => $payout_id,
                                        "transaction_id" => $transfer_result['transaction_id'],
                                        "amount" => number_format($amount, 2),
                                        "currency" => $set['currency']
                                    );
                                    
                                } else {
                                    
                                    // Update payout status to failed
                                    $update_failed = $rstate->prepare("UPDATE tbl_fapshi_payouts 
                                                                     SET status = 'failed', 
                                                                         error_message = ?, 
                                                                         updated_at = NOW() 
                                                                     WHERE payout_id = ?");
                                    $update_failed->bind_param("ss", $transfer_result['error'], $payout_id);
                                    $update_failed->execute();
                                    
                                    $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Payout failed: " . $transfer_result['error']);
                                }
                                
                            } else {
                                $returnArr = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to create payout request!");
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Initiate Fapshi transfer/payout based on standard API patterns
 */
function initiateFapshiTransfer($payout_id, $amount, $mobile_number, $payment_method, $description, $fapshi_settings) {
    
    $api_key = $fapshi_settings['api_key'];
    $api_secret = $fapshi_settings['api_secret'];
    $environment = $fapshi_settings['environment'];
    
    // Determine Fapshi API base URL
    $base_url = $environment === 'production' 
        ? 'https://api.fapshi.com' 
        : 'https://sandbox.fapshi.com';
    
    // Prepare transfer request data based on common payout API patterns
    $transfer_data = array(
        'amount' => $amount,
        'currency' => 'XAF', // Central African Franc for Cameroon
        'recipient' => array(
            'phone' => $mobile_number,
            'method' => $payment_method
        ),
        'external_reference' => $payout_id,
        'description' => $description,
        'callback_url' => getCurrentDomain() . '/user_api/fapshi_payout_webhook.php'
    );
    
    // Set up cURL for API request
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $base_url . '/v1/payouts', // Standard payout endpoint
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($transfer_data),
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $api_key,
            'X-API-Secret: ' . $api_secret,
            'Accept: application/json'
        ),
    ));
    
    $response = curl_exec($curl);
    $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($curl);
    curl_close($curl);
    
    // Log the API request for debugging
    error_log("Fapshi Payout API Request: " . json_encode($transfer_data));
    error_log("Fapshi Payout API Response: " . $response);
    
    if ($curl_error) {
        return array(
            'success' => false,
            'error' => 'Connection error: ' . $curl_error
        );
    }
    
    $response_data = json_decode($response, true);
    
    if ($http_code >= 200 && $http_code < 300) {
        // Successful response - adapt to actual Fapshi response structure
        $transaction_id = null;
        if (isset($response_data['transaction_id'])) {
            $transaction_id = $response_data['transaction_id'];
        } elseif (isset($response_data['id'])) {
            $transaction_id = $response_data['id'];
        } elseif (isset($response_data['reference'])) {
            $transaction_id = $response_data['reference'];
        } elseif (isset($response_data['payout_id'])) {
            $transaction_id = $response_data['payout_id'];
        }
        
        if ($transaction_id) {
            return array(
                'success' => true,
                'transaction_id' => $transaction_id,
                'response' => $response_data
            );
        }
    }
    
    // Handle error responses
    $error_message = 'Transfer failed';
    if (isset($response_data['message'])) {
        $error_message = $response_data['message'];
    } elseif (isset($response_data['error'])) {
        $error_message = $response_data['error'];
    } elseif (isset($response_data['errors'])) {
        $error_message = is_array($response_data['errors']) ? implode(', ', $response_data['errors']) : $response_data['errors'];
    }
    
    return array(
        'success' => false,
        'error' => $error_message,
        'response' => $response_data
    );
}

/**
 * Get current domain for callback URL
 */
function getCurrentDomain() {
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    return $protocol . '://' . $_SERVER['HTTP_HOST'];
}

/**
 * Send payout notification
 */
function sendPayoutNotification($user_id, $amount, $mobile_number, $payment_method, $rstate) {
    // Get user details
    $user_data = $rstate->query("SELECT name, mobile FROM tbl_user WHERE id = $user_id")->fetch_assoc();
    
    if ($user_data) {
        $message = "Payout request of " . number_format($amount, 2) . " FCFA to " . $mobile_number . " (" . strtoupper($payment_method) . ") has been submitted and is being processed.";
        
        // Here you could integrate with your existing notification system
        // For now, we'll just log it
        error_log("Payout notification for user $user_id: $message");
    }
}

echo json_encode($returnArr);
?>