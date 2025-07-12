<?php 
require 'include/main_head.php';
if($_SESSION['stype'] == 'Staff')
{
    header('HTTP/1.1 401 Unauthorized');
    ?>
    <style>
    .loader-wrapper
    {
        display:none;
    }
    </style>
    <?php 
    require 'auth.php';
    exit();
}

// Handle form submission
if(isset($_POST['update_fapshi_settings'])) {
    $api_key = $_POST['api_key'];
    $api_secret = $_POST['api_secret'];
    $webhook_secret = $_POST['webhook_secret'];
    $environment = $_POST['environment'];
    $is_active = $_POST['is_active'];
    
    // Update or insert Fapshi settings
    $check_existing = $rstate->query("SELECT id FROM tbl_payment_settings WHERE payment_gateway = 'fapshi'");
    
    if($check_existing->num_rows > 0) {
        // Update existing
        $update_query = $rstate->prepare("UPDATE tbl_payment_settings SET 
            api_key = ?, 
            api_secret = ?, 
            webhook_secret = ?, 
            environment = ?, 
            is_active = ?, 
            updated_at = NOW() 
            WHERE payment_gateway = 'fapshi'");
        $update_query->bind_param("sssss", $api_key, $api_secret, $webhook_secret, $environment, $is_active);
    } else {
        // Insert new
        $update_query = $rstate->prepare("INSERT INTO tbl_payment_settings 
            (payment_gateway, api_key, api_secret, webhook_secret, environment, is_active) 
            VALUES ('fapshi', ?, ?, ?, ?, ?)");
        $update_query->bind_param("sssss", $api_key, $api_secret, $webhook_secret, $environment, $is_active);
    }
    
    if($update_query->execute()) {
        $success_message = "Fapshi settings updated successfully!";
    } else {
        $error_message = "Error updating Fapshi settings.";
    }
}

// Get current Fapshi settings
$fapshi_settings = $rstate->query("SELECT * FROM tbl_payment_settings WHERE payment_gateway = 'fapshi'")->fetch_assoc();
if(!$fapshi_settings) {
    $fapshi_settings = [
        'api_key' => '',
        'api_secret' => '',
        'webhook_secret' => '',
        'environment' => 'sandbox',
        'is_active' => 'no'
    ];
}
?>
    <!-- Loader ends-->
    <!-- page-wrapper Start-->
    <div class="page-wrapper compact-wrapper" id="pageWrapper">
      <!-- Page Header Start-->
      <?php 
      require 'include/inside_top.php';
      ?>
      <!-- Page Header Ends                              -->
      <!-- Page Body Start-->
      <div class="page-body-wrapper">
        <!-- Page Sidebar Start-->
        <?php 
        require 'include/sidebar.php';
        ?>
        <!-- Page Sidebar Ends-->
        <div class="page-body">
          <div class="container-fluid">
            <div class="page-title">
              <div class="row">
                <div class="col-6">
                  <h3>Fapshi Payment Configuration</h3>
                </div>
                <div class="col-6">
                  
                </div>
              </div>
            </div>
          </div>
          <!-- Container-fluid starts-->
          <div class="container-fluid">
            <div class="row">      
               <div class="col-sm-12">
                <div class="card">
                <div class="card-body">
                
                <?php if(isset($success_message)) { ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <?php echo $success_message; ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php } ?>
                
                <?php if(isset($error_message)) { ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <?php echo $error_message; ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php } ?>
                        
                        <h5 class="h5_set"><i class="fa fa-credit-card"></i> Fapshi Payment Gateway Settings</h5>
                <form method="post">
                    <div class="row">
                        <div class="form-group mb-3 col-6">
                            <label><span class="text-danger">*</span> Fapshi API Key</label>
                            <input type="text" class="form-control" 
                                   placeholder="Enter Fapshi API Key" 
                                   value="<?php echo $fapshi_settings['api_key']; ?>" 
                                   name="api_key" required="">
                            <small class="text-muted">Your Fapshi API key from dashboard</small>
                        </div>
                        
                        <div class="form-group mb-3 col-6">
                            <label><span class="text-danger">*</span> Fapshi API Secret</label>
                            <input type="password" class="form-control" 
                                   placeholder="Enter Fapshi API Secret" 
                                   value="<?php echo $fapshi_settings['api_secret']; ?>" 
                                   name="api_secret" required="">
                            <small class="text-muted">Your Fapshi API secret key</small>
                        </div>
                        
                        <div class="form-group mb-3 col-6">
                            <label><span class="text-danger">*</span> Webhook Secret</label>
                            <input type="text" class="form-control" 
                                   placeholder="Enter Webhook Secret" 
                                   value="<?php echo $fapshi_settings['webhook_secret']; ?>" 
                                   name="webhook_secret" required="">
                            <small class="text-muted">Secret key for webhook verification</small>
                        </div>
                        
                        <div class="form-group mb-3 col-3">
                            <label><span class="text-danger">*</span> Environment</label>
                            <select class="form-control" name="environment" required="">
                                <option value="">Select Environment</option>
                                <option value="sandbox" <?php if($fapshi_settings['environment'] == 'sandbox') echo 'selected'; ?>>Sandbox (Test)</option>
                                <option value="production" <?php if($fapshi_settings['environment'] == 'production') echo 'selected'; ?>>Production (Live)</option>
                            </select>
                        </div>
                        
                        <div class="form-group mb-3 col-3">
                            <label><span class="text-danger">*</span> Status</label>
                            <select class="form-control" name="is_active" required="">
                                <option value="">Select Status</option>
                                <option value="yes" <?php if($fapshi_settings['is_active'] == 'yes') echo 'selected'; ?>>Active</option>
                                <option value="no" <?php if($fapshi_settings['is_active'] == 'no') echo 'selected'; ?>>Inactive</option>
                            </select>
                        </div>
                        
                        <div class="col-12">
                            <button type="submit" name="update_fapshi_settings" class="btn btn-primary mb-2">
                                Update Fapshi Settings
                            </button>
                        </div>
                    </div>
                </form>
                
                <!-- Configuration Instructions -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-info-circle"></i> Configuration Instructions</h5>
                        <div class="card">
                            <div class="card-body">
                                <h6>1. Fapshi Account Setup</h6>
                                <ul>
                                    <li>Create an account at <a href="https://fapshi.com" target="_blank">https://fapshi.com</a></li>
                                    <li>Complete your business verification</li>
                                    <li>Navigate to API settings in your dashboard</li>
                                </ul>
                                
                                <h6>2. API Keys</h6>
                                <ul>
                                    <li>Copy your API Key and API Secret from Fapshi dashboard</li>
                                    <li>Generate a webhook secret key (recommended: strong random string)</li>
                                    <li>Use sandbox mode for testing, production for live transactions</li>
                                </ul>
                                
                                <h6>3. Webhook Configuration</h6>
                                <ul>
                                    <li>Set webhook URL in Fapshi dashboard to: <code><?php echo (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST']; ?>/user_api/fapshi_webhook.php</code></li>
                                    <li>Use the same webhook secret configured above</li>
                                    <li>Enable payment confirmation events</li>
                                </ul>
                                
                                <h6>4. Testing</h6>
                                <ul>
                                    <li>Use sandbox mode with test MTN MoMo numbers</li>
                                    <li>Test wallet top-up functionality</li>
                                    <li>Verify webhook notifications are received</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Statistics -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-chart-line"></i> Payment Statistics</h5>
                    </div>
                    
                    <?php 
                    // Get payment statistics
                    $today_payments = $rstate->query("SELECT COUNT(*) as count, SUM(amount) as total FROM tbl_wallet_transactions WHERE DATE(created_at) = CURDATE() AND transaction_type = 'deposit' AND status = 'completed'")->fetch_assoc();
                    $month_payments = $rstate->query("SELECT COUNT(*) as count, SUM(amount) as total FROM tbl_wallet_transactions WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND transaction_type = 'deposit' AND status = 'completed'")->fetch_assoc();
                    $failed_payments = $rstate->query("SELECT COUNT(*) as count FROM tbl_wallet_transactions WHERE transaction_type = 'deposit' AND status = 'failed'")->fetch_assoc();
                    $pending_payments = $rstate->query("SELECT COUNT(*) as count FROM tbl_wallet_transactions WHERE transaction_type = 'deposit' AND status = 'pending'")->fetch_assoc();
                    ?>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="calendar"></i></div>
                                    <div class="sale-content">
                                        <h6>Today's Payments</h6>
                                        <p><?php echo ($today_payments['count'] ?: 0) . ' payments'; ?></p>
                                        <small><?php echo number_format((float)($today_payments['total'] ?: 0), 2) . ' ' . $set['currency']; ?></small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="calendar"></i></div>
                                    <div class="sale-content">
                                        <h6>This Month's Payments</h6>
                                        <p><?php echo ($month_payments['count'] ?: 0) . ' payments'; ?></p>
                                        <small><?php echo number_format((float)($month_payments['total'] ?: 0), 2) . ' ' . $set['currency']; ?></small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="x-circle"></i></div>
                                    <div class="sale-content">
                                        <h6>Failed Payments</h6>
                                        <p><?php echo ($failed_payments['count'] ?: 0) . ' payments'; ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="clock"></i></div>
                                    <div class="sale-content">
                                        <h6>Pending Payments</h6>
                                        <p><?php echo ($pending_payments['count'] ?: 0) . ' payments'; ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Container-fluid Ends-->
        </div>
        <!-- footer start-->
        
      </div>
    </div>
    <!-- latest jquery-->
    <?php 
require 'include/footer.php';
?>
  </body>
</html>