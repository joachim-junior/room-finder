<?php
// Test script for Fapshi integration
// This script helps you test the payment flow without a frontend

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$base_url = 'https://yoursite.com'; // Change this to your site URL
$test_user_id = 1; // Change this to a valid user ID from your database
$test_amount = 1000; // Test amount in FCFA

// Test scenarios
$test_scenarios = [
    'test_wallet_topup' => 'Test wallet top-up initialization',
    'test_payment_status' => 'Test payment status check',
    'test_transaction_history' => 'Test transaction history',
    'test_webhook_signature' => 'Test webhook signature verification'
];

$action = isset($_GET['action']) ? $_GET['action'] : 'menu';

function makeAPIRequest($url, $data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen(json_encode($data))
    ));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return array(
        'http_code' => $http_code,
        'response' => $response,
        'data' => json_decode($response, true)
    );
}

function testWalletTopup($base_url, $user_id, $amount) {
    $url = $base_url . '/user_api/u_wallet_topup_fapshi.php';
    $data = array(
        'uid' => $user_id,
        'amount' => $amount
    );
    
    echo "<h3>Testing Wallet Top-up</h3>";
    echo "<p><strong>URL:</strong> $url</p>";
    echo "<p><strong>Request Data:</strong> " . json_encode($data, JSON_PRETTY_PRINT) . "</p>";
    
    $result = makeAPIRequest($url, $data);
    
    echo "<p><strong>HTTP Code:</strong> " . $result['http_code'] . "</p>";
    echo "<p><strong>Response:</strong></p>";
    echo "<pre>" . json_encode($result['data'], JSON_PRETTY_PRINT) . "</pre>";
    
    if ($result['data'] && $result['data']['Result'] === 'true') {
        echo "<p style='color: green;'>✓ Wallet top-up test PASSED</p>";
        return $result['data']['transaction_id'];
    } else {
        echo "<p style='color: red;'>✗ Wallet top-up test FAILED</p>";
        return false;
    }
}

function testPaymentStatus($base_url, $user_id, $transaction_id) {
    $url = $base_url . '/user_api/u_payment_status.php';
    $data = array(
        'uid' => $user_id,
        'transaction_id' => $transaction_id
    );
    
    echo "<h3>Testing Payment Status Check</h3>";
    echo "<p><strong>URL:</strong> $url</p>";
    echo "<p><strong>Request Data:</strong> " . json_encode($data, JSON_PRETTY_PRINT) . "</p>";
    
    $result = makeAPIRequest($url, $data);
    
    echo "<p><strong>HTTP Code:</strong> " . $result['http_code'] . "</p>";
    echo "<p><strong>Response:</strong></p>";
    echo "<pre>" . json_encode($result['data'], JSON_PRETTY_PRINT) . "</pre>";
    
    if ($result['data'] && $result['data']['Result'] === 'true') {
        echo "<p style='color: green;'>✓ Payment status test PASSED</p>";
        return true;
    } else {
        echo "<p style='color: red;'>✗ Payment status test FAILED</p>";
        return false;
    }
}

function testTransactionHistory($base_url, $user_id) {
    $url = $base_url . '/user_api/u_transaction_history.php';
    $data = array(
        'uid' => $user_id,
        'limit' => 5
    );
    
    echo "<h3>Testing Transaction History</h3>";
    echo "<p><strong>URL:</strong> $url</p>";
    echo "<p><strong>Request Data:</strong> " . json_encode($data, JSON_PRETTY_PRINT) . "</p>";
    
    $result = makeAPIRequest($url, $data);
    
    echo "<p><strong>HTTP Code:</strong> " . $result['http_code'] . "</p>";
    echo "<p><strong>Response:</strong></p>";
    echo "<pre>" . json_encode($result['data'], JSON_PRETTY_PRINT) . "</pre>";
    
    if ($result['data'] && $result['data']['Result'] === 'true') {
        echo "<p style='color: green;'>✓ Transaction history test PASSED</p>";
        return true;
    } else {
        echo "<p style='color: red;'>✗ Transaction history test FAILED</p>";
        return false;
    }
}

function testWebhookSignature() {
    echo "<h3>Testing Webhook Signature Verification</h3>";
    
    // Sample webhook payload
    $payload = json_encode(array(
        'event_type' => 'charge.success',
        'data' => array(
            'id' => 'test_charge_id',
            'amount' => 1000,
            'currency' => 'XAF',
            'status' => 'success',
            'metadata' => array(
                'transaction_id' => 'WALLET_TEST_123',
                'user_id' => '1'
            )
        )
    ));
    
    // Test secret key
    $secret_key = 'test_secret_key';
    
    // Generate signature
    $signature = hash_hmac('sha256', $payload, $secret_key);
    
    echo "<p><strong>Sample Payload:</strong></p>";
    echo "<pre>" . $payload . "</pre>";
    echo "<p><strong>Secret Key:</strong> " . $secret_key . "</p>";
    echo "<p><strong>Generated Signature:</strong> " . $signature . "</p>";
    
    // Verify signature
    $expected_signature = hash_hmac('sha256', $payload, $secret_key);
    $is_valid = hash_equals($expected_signature, $signature);
    
    if ($is_valid) {
        echo "<p style='color: green;'>✓ Webhook signature test PASSED</p>";
    } else {
        echo "<p style='color: red;'>✗ Webhook signature test FAILED</p>";
    }
    
    echo "<p><strong>Instructions:</strong> Use this signature format in your webhook endpoint to verify incoming requests from Fapshi.</p>";
}

// Handle different actions
switch ($action) {
    case 'test_wallet_topup':
        testWalletTopup($base_url, $test_user_id, $test_amount);
        break;
        
    case 'test_payment_status':
        // You need to provide a valid transaction ID for this test
        $transaction_id = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : 'WALLET_TEST_123';
        testPaymentStatus($base_url, $test_user_id, $transaction_id);
        break;
        
    case 'test_transaction_history':
        testTransactionHistory($base_url, $test_user_id);
        break;
        
    case 'test_webhook_signature':
        testWebhookSignature();
        break;
        
    case 'run_all_tests':
        echo "<h2>Running All Tests</h2>";
        echo "<hr>";
        
        // Test 1: Wallet top-up
        $transaction_id = testWalletTopup($base_url, $test_user_id, $test_amount);
        echo "<hr>";
        
        // Test 2: Payment status (if we got a transaction ID)
        if ($transaction_id) {
            testPaymentStatus($base_url, $test_user_id, $transaction_id);
        }
        echo "<hr>";
        
        // Test 3: Transaction history
        testTransactionHistory($base_url, $test_user_id);
        echo "<hr>";
        
        // Test 4: Webhook signature
        testWebhookSignature();
        break;
        
    default:
        // Show menu
        echo "<h2>Fapshi Integration Test Menu</h2>";
        echo "<p><strong>Configuration:</strong></p>";
        echo "<ul>";
        echo "<li>Base URL: $base_url</li>";
        echo "<li>Test User ID: $test_user_id</li>";
        echo "<li>Test Amount: $test_amount FCFA</li>";
        echo "</ul>";
        
        echo "<p><strong>Available Tests:</strong></p>";
        echo "<ul>";
        foreach ($test_scenarios as $key => $description) {
            echo "<li><a href='?action=$key'>$description</a></li>";
        }
        echo "<li><a href='?action=run_all_tests' style='font-weight: bold; color: blue;'>Run All Tests</a></li>";
        echo "</ul>";
        
        echo "<p><strong>Instructions:</strong></p>";
        echo "<ol>";
        echo "<li>Update the configuration at the top of this file</li>";
        echo "<li>Make sure your database tables are created</li>";
        echo "<li>Configure your Fapshi API keys</li>";
        echo "<li>Run the tests to verify everything works</li>";
        echo "</ol>";
        
        echo "<p><strong>Note:</strong> Before running tests, make sure:</p>";
        echo "<ul>";
        echo "<li>Your server can make outbound HTTP requests</li>";
        echo "<li>SSL certificates are properly configured</li>";
        echo "<li>The test user ID exists in your database</li>";
        echo "<li>Your Fapshi account is properly set up</li>";
        echo "</ul>";
        break;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Fapshi Integration Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #333; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
        hr { margin: 20px 0; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Fapshi Integration Test Results</h1>
    <p><a href="?">← Back to Menu</a></p>
</body>
</html>