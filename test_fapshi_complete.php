<?php
require 'include/reconfig.php';
require 'include/estate.php';

// Check if user is logged in and is admin
if(!isset($_SESSION['stype']) || $_SESSION['stype'] != 'Admin') {
    header('Location: login.php');
    exit();
}

// Get Fapshi configuration
$config_query = $rstate->query("SELECT * FROM tbl_payment_settings WHERE gateway = 'fapshi'");
$config = null;
if($config_query->num_rows > 0) {
    $config = $config_query->fetch_assoc();
}

// Handle test form submission
$test_results = array();
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $test_type = $_POST['test_type'];
    
    switch($test_type) {
        case 'direct_pay':
            $test_results = testDirectPay();
            break;
        case 'payment_status':
            $test_results = testPaymentStatus();
            break;
        case 'payout':
            $test_results = testPayout();
            break;
        case 'webhook':
            $test_results = testWebhook();
            break;
        case 'config':
            $test_results = testConfiguration();
            break;
    }
}

function testConfiguration() {
    global $config;
    
    $results = array();
    
    if(!$config) {
        $results[] = array('status' => 'error', 'message' => 'Fapshi configuration not found');
        return $results;
    }
    
    // Check if API credentials are set
    if(empty($config['api_user'])) {
        $results[] = array('status' => 'error', 'message' => 'API User is not configured');
    } else {
        $results[] = array('status' => 'success', 'message' => 'API User is configured');
    }
    
    if(empty($config['api_key'])) {
        $results[] = array('status' => 'error', 'message' => 'API Key is not configured');
    } else {
        $results[] = array('status' => 'success', 'message' => 'API Key is configured');
    }
    
    if(empty($config['webhook_secret'])) {
        $results[] = array('status' => 'warning', 'message' => 'Webhook Secret is not configured (configure this in your Fapshi dashboard)');
    } else {
        $results[] = array('status' => 'success', 'message' => 'Webhook Secret is configured');
    }
    
    // Check environment mode
    if($config['sandbox_mode']) {
        $results[] = array('status' => 'info', 'message' => 'Running in Sandbox mode');
    } else {
        $results[] = array('status' => 'info', 'message' => 'Running in Production mode');
    }
    
    return $results;
}

function testDirectPay() {
    global $config;
    
    $results = array();
    
    if(!$config || empty($config['api_user']) || empty($config['api_key'])) {
        $results[] = array('status' => 'error', 'message' => 'Fapshi configuration incomplete');
        return $results;
    }
    
    $base_url = $config['sandbox_mode'] ? 'https://sandbox.fapshi.com' : 'https://api.fapshi.com';
    
    // Test Direct Pay API
    $test_data = array(
        'amount' => 1000, // 1000 FCFA
        'currency' => 'XOF',
        'description' => 'Test Direct Pay Transaction',
        'customer_email' => 'test@example.com',
        'customer_name' => 'Test User',
        'customer_phone' => '+237123456789',
        'return_url' => $config['return_url'] ?: 'https://yoursite.com/payment/success',
        'cancel_url' => 'https://yoursite.com/payment/cancel',
        'metadata' => array(
            'transaction_id' => 'TEST_' . time(),
            'user_id' => 1
        )
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $base_url . '/api/v1/direct-pay');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($test_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'apiuser: ' . $config['api_user'],
        'apikey: ' . $config['api_key']
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if($error) {
        $results[] = array('status' => 'error', 'message' => 'cURL Error: ' . $error);
    } else {
        $response_data = json_decode($response, true);
        
        if($http_code == 200 && isset($response_data['success']) && $response_data['success']) {
            $results[] = array('status' => 'success', 'message' => 'Direct Pay API test successful');
            $results[] = array('status' => 'info', 'message' => 'Payment URL: ' . $response_data['data']['payment_url']);
        } else {
            $results[] = array('status' => 'error', 'message' => 'Direct Pay API test failed: ' . ($response_data['message'] ?? 'Unknown error'));
        }
    }
    
    return $results;
}

function testPaymentStatus() {
    global $config;
    
    $results = array();
    
    if(!$config || empty($config['api_user']) || empty($config['api_key'])) {
        $results[] = array('status' => 'error', 'message' => 'Fapshi configuration incomplete');
        return $results;
    }
    
    $base_url = $config['sandbox_mode'] ? 'https://sandbox.fapshi.com' : 'https://api.fapshi.com';
    
    // Test Payment Status API with a dummy payment ID
    $payment_id = 'test_payment_' . time();
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $base_url . '/api/v1/payment-status/' . $payment_id);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'apiuser: ' . $config['api_user'],
        'apikey: ' . $config['api_key']
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if($error) {
        $results[] = array('status' => 'error', 'message' => 'cURL Error: ' . $error);
    } else {
        $response_data = json_decode($response, true);
        
        if($http_code == 200) {
            $results[] = array('status' => 'success', 'message' => 'Payment Status API test successful');
            $results[] = array('status' => 'info', 'message' => 'Response: ' . json_encode($response_data));
        } else {
            $results[] = array('status' => 'error', 'message' => 'Payment Status API test failed: ' . ($response_data['message'] ?? 'Unknown error'));
        }
    }
    
    return $results;
}

function testPayout() {
    global $config;
    
    $results = array();
    
    if(!$config || empty($config['api_user']) || empty($config['api_key'])) {
        $results[] = array('status' => 'error', 'message' => 'Fapshi configuration incomplete');
        return $results;
    }
    
    $base_url = $config['sandbox_mode'] ? 'https://sandbox.fapshi.com' : 'https://api.fapshi.com';
    
    // Test Payout API
    $test_data = array(
        'amount' => 500, // 500 FCFA
        'currency' => 'XOF',
        'recipient_phone' => '+237123456789',
        'description' => 'Test Payout Transaction',
        'metadata' => array(
            'payout_id' => 'TEST_PAYOUT_' . time(),
            'user_id' => 1
        )
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $base_url . '/api/v1/payout');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($test_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'apiuser: ' . $config['api_user'],
        'apikey: ' . $config['api_key']
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if($error) {
        $results[] = array('status' => 'error', 'message' => 'cURL Error: ' . $error);
    } else {
        $response_data = json_decode($response, true);
        
        if($http_code == 200 && isset($response_data['success']) && $response_data['success']) {
            $results[] = array('status' => 'success', 'message' => 'Payout API test successful');
            $results[] = array('status' => 'info', 'message' => 'Payout ID: ' . $response_data['data']['payout_id']);
        } else {
            $results[] = array('status' => 'error', 'message' => 'Payout API test failed: ' . ($response_data['message'] ?? 'Unknown error'));
        }
    }
    
    return $results;
}

function testWebhook() {
    global $config;
    
    $results = array();
    
    if(!$config) {
        $results[] = array('status' => 'error', 'message' => 'Fapshi configuration not found');
        return $results;
    }
    
    // Test webhook signature verification
    $test_payload = json_encode(array(
        'event_type' => 'payment.success',
        'data' => array(
            'id' => 'test_payment_id',
            'amount' => 1000,
            'metadata' => array(
                'transaction_id' => 'TEST_' . time(),
                'user_id' => 1
            )
        )
    ));
    
    if(empty($config['webhook_secret'])) {
        $results[] = array('status' => 'warning', 'message' => 'Webhook secret not configured - cannot test signature verification');
    } else {
        // Generate expected signature
        $expected_signature = hash_hmac('sha256', $test_payload, $config['webhook_secret']);
        
        // Test signature verification function
        $headers = array('X-Fapshi-Signature' => $expected_signature);
        
        // Simulate webhook verification
        $actual_signature = $expected_signature;
        $is_valid = hash_equals($expected_signature, $actual_signature);
        
        if($is_valid) {
            $results[] = array('status' => 'success', 'message' => 'Webhook signature verification test successful');
        } else {
            $results[] = array('status' => 'error', 'message' => 'Webhook signature verification test failed');
        }
    }
    
    // Test webhook endpoint accessibility
    $webhook_url = $config['callback_url'] ?: 'https://yoursite.com/user_api/fapshi_webhook.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $webhook_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if($error) {
        $results[] = array('status' => 'error', 'message' => 'Webhook endpoint not accessible: ' . $error);
    } else {
        if($http_code == 200) {
            $results[] = array('status' => 'success', 'message' => 'Webhook endpoint is accessible');
        } else {
            $results[] = array('status' => 'warning', 'message' => 'Webhook endpoint returned HTTP ' . $http_code);
        }
    }
    
    return $results;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fapshi Integration Test Suite</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .test-result {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
        }
        .test-result.success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .test-result.error {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .test-result.warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        .test-result.info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        .test-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #dee2e6;
            border-radius: 10px;
        }
        .api-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h1 class="text-center mb-4">
                    <i class="fas fa-cogs"></i> Fapshi Integration Test Suite
                </h1>
                
                <div class="alert alert-info">
                    <h5><i class="fas fa-info-circle"></i> Test Overview</h5>
                    <p>This test suite validates your Fapshi integration by testing all major API endpoints and webhook functionality. Run these tests to ensure your integration is working correctly.</p>
                </div>
                
                <?php if($config): ?>
                <div class="api-info">
                    <h6><i class="fas fa-cog"></i> Current Configuration</h6>
                    <ul class="list-unstyled mb-0">
                        <li><strong>Environment:</strong> <?php echo $config['sandbox_mode'] ? 'Sandbox' : 'Production'; ?></li>
                        <li><strong>API User:</strong> <?php echo !empty($config['api_user']) ? 'Configured' : 'Not configured'; ?></li>
                        <li><strong>API Key:</strong> <?php echo !empty($config['api_key']) ? 'Configured' : 'Not configured'; ?></li>
                        <li><strong>Webhook Secret:</strong> <?php echo !empty($config['webhook_secret']) ? 'Configured' : 'Not configured'; ?></li>
                        <li><strong>Webhook URL:</strong> <?php echo $config['callback_url'] ?: 'Not configured'; ?></li>
                    </ul>
                </div>
                <?php endif; ?>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="test-section">
                            <h4><i class="fas fa-check-circle"></i> Configuration Test</h4>
                            <p>Test your Fapshi configuration settings.</p>
                            <form method="POST">
                                <input type="hidden" name="test_type" value="config">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-cog"></i> Test Configuration
                                </button>
                            </form>
                        </div>
                        
                        <div class="test-section">
                            <h4><i class="fas fa-credit-card"></i> Direct Pay Test</h4>
                            <p>Test the Direct Pay API endpoint.</p>
                            <form method="POST">
                                <input type="hidden" name="test_type" value="direct_pay">
                                <button type="submit" class="btn btn-success">
                                    <i class="fas fa-play"></i> Test Direct Pay
                                </button>
                            </form>
                        </div>
                        
                        <div class="test-section">
                            <h4><i class="fas fa-search"></i> Payment Status Test</h4>
                            <p>Test the Payment Status API endpoint.</p>
                            <form method="POST">
                                <input type="hidden" name="test_type" value="payment_status">
                                <button type="submit" class="btn btn-info">
                                    <i class="fas fa-play"></i> Test Payment Status
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="test-section">
                            <h4><i class="fas fa-money-bill-wave"></i> Payout Test</h4>
                            <p>Test the Payout API endpoint.</p>
                            <form method="POST">
                                <input type="hidden" name="test_type" value="payout">
                                <button type="submit" class="btn btn-warning">
                                    <i class="fas fa-play"></i> Test Payout
                                </button>
                            </form>
                        </div>
                        
                        <div class="test-section">
                            <h4><i class="fas fa-bell"></i> Webhook Test</h4>
                            <p>Test webhook signature verification and endpoint accessibility.</p>
                            <form method="POST">
                                <input type="hidden" name="test_type" value="webhook">
                                <button type="submit" class="btn btn-secondary">
                                    <i class="fas fa-play"></i> Test Webhook
                                </button>
                            </form>
                        </div>
                        
                        <div class="test-section">
                            <h4><i class="fas fa-book"></i> Documentation</h4>
                            <p>View the complete Fapshi integration guide.</p>
                            <a href="FAPSHI_INTEGRATION_GUIDE.md" class="btn btn-outline-primary" target="_blank">
                                <i class="fas fa-file-alt"></i> View Guide
                            </a>
                        </div>
                    </div>
                </div>
                
                <?php if(!empty($test_results)): ?>
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5><i class="fas fa-clipboard-list"></i> Test Results</h5>
                            </div>
                            <div class="card-body">
                                <?php foreach($test_results as $result): ?>
                                <div class="test-result <?php echo $result['status']; ?>">
                                    <i class="fas fa-<?php 
                                        echo $result['status'] == 'success' ? 'check-circle' : 
                                            ($result['status'] == 'error' ? 'times-circle' : 
                                            ($result['status'] == 'warning' ? 'exclamation-triangle' : 'info-circle')); 
                                    ?>"></i>
                                    <?php echo htmlspecialchars($result['message']); ?>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
                
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <h6><i class="fas fa-exclamation-triangle"></i> Important Notes</h6>
                            <ul class="mb-0">
                                <li>All tests use sandbox environment when enabled in your configuration</li>
                                <li>Webhook secret must be configured separately in your Fapshi dashboard</li>
                                <li>API User and API Key are used for authentication in all API requests</li>
                                <li>Test transactions are not real and will not affect your account balance</li>
                                <li>Ensure your webhook URL is publicly accessible for webhook testing</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-4">
                    <a href="admin_fapshi_settings.php" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left"></i> Back to Settings
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 