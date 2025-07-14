<?php 
require 'include/main_head.php';

// Check if user is admin
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
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $fapshi_enabled = isset($_POST['fapshi_enabled']) ? 'yes' : 'no';
    $fapshi_api_key = trim($_POST['fapshi_api_key']);
    $fapshi_api_secret = trim($_POST['fapshi_api_secret']);
    $fapshi_webhook_secret = trim($_POST['fapshi_webhook_secret']);
    $fapshi_environment = isset($_POST['fapshi_sandbox_mode']) ? 'sandbox' : 'production';
    $fapshi_callback_url = trim($_POST['fapshi_callback_url']);
    $fapshi_return_url = trim($_POST['fapshi_return_url']);
    
    // Update settings
    $update_query = "UPDATE tbl_payment_settings SET 
                    api_key = ?, 
                    api_secret = ?, 
                    webhook_secret = ?,
                    environment = ?, 
                    is_active = ?,
                    updated_at = NOW()
                    WHERE payment_gateway = 'fapshi'";
    
    $stmt = $rstate->prepare($update_query);
    $stmt->bind_param('sssss', $fapshi_api_key, $fapshi_api_secret, $fapshi_webhook_secret, $fapshi_environment, $fapshi_enabled);
    
    if($stmt->execute()) {
        $success_message = "Fapshi settings updated successfully!";
    } else {
        $error_message = "Error updating Fapshi settings: " . $stmt->error;
    }
}

// Get current settings
$settings_query = "SELECT * FROM tbl_payment_settings WHERE payment_gateway = 'fapshi'";
$settings_result = $rstate->query($settings_query);

if($settings_result->num_rows == 0) {
    // Create default settings if none exist
    $insert_query = "INSERT INTO tbl_payment_settings (payment_gateway, api_key, api_secret, webhook_secret, environment, is_active, created_at, updated_at) 
                     VALUES ('fapshi', '', '', '', 'sandbox', 'no', NOW(), NOW())";
    $rstate->query($insert_query);
    $settings_result = $rstate->query($settings_query);
}

$settings = $settings_result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fapshi Configuration - Admin Panel</title>
</head>
<body>
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
                  <h3>Fapshi Configuration</h3>
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
                        <i class="fa fa-check-circle"></i> <?php echo $success_message; ?>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                <?php } ?>
                
                <?php if(isset($error_message)) { ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fa fa-exclamation-circle"></i> <?php echo $error_message; ?>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                <?php } ?>
                
                <form method="POST" class="needs-validation" novalidate>
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="h5_set"><i class="fa fa-toggle-on"></i> General Settings</h5>
                            
                            <div class="form-group">
                                <label for="fapshi_enabled">Enable Fapshi Payment Gateway</label>
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="fapshi_enabled" name="fapshi_enabled" <?php echo $settings['is_active'] == 'yes' ? 'checked' : ''; ?>>
                                    <label class="custom-control-label" for="fapshi_enabled">Enable Fapshi payment processing</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="fapshi_api_key">API Key</label>
                                <input type="text" class="form-control" id="fapshi_api_key" name="fapshi_api_key" 
                                       value="<?php echo htmlspecialchars($settings['api_key']); ?>" required>
                                <div class="invalid-feedback">
                                    Please enter your Fapshi API Key.
                                </div>
                                <small class="form-text text-muted">Your API key for authentication</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="fapshi_api_secret">API Secret</label>
                                <input type="password" class="form-control" id="fapshi_api_secret" name="fapshi_api_secret" 
                                       value="<?php echo htmlspecialchars($settings['api_secret']); ?>" required>
                                <div class="invalid-feedback">
                                    Please enter your Fapshi API Secret.
                                </div>
                                <small class="form-text text-muted">Your secret API key for authentication</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="fapshi_webhook_secret">Webhook Secret</label>
                                <input type="password" class="form-control" id="fapshi_webhook_secret" name="fapshi_webhook_secret" 
                                       value="<?php echo htmlspecialchars($settings['webhook_secret']); ?>" required>
                                <div class="invalid-feedback">
                                    Please enter your Fapshi Webhook Secret.
                                </div>
                                <small class="form-text text-muted">Webhook secret configured in your Fapshi dashboard</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="fapshi_sandbox_mode">Environment Mode</label>
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="fapshi_sandbox_mode" name="fapshi_sandbox_mode" <?php echo $settings['environment'] == 'sandbox' ? 'checked' : ''; ?>>
                                    <label class="custom-control-label" for="fapshi_sandbox_mode">Enable Sandbox Mode (uncheck for production)</label>
                                </div>
                                <small class="form-text text-muted">Use sandbox environment for testing, disable for live transactions</small>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <h5 class="h5_set"><i class="fa fa-cog"></i> Advanced Settings</h5>
                            
                            <div class="form-group">
                                <label for="fapshi_callback_url">Webhook URL</label>
                                <input type="url" class="form-control" id="fapshi_callback_url" name="fapshi_callback_url" 
                                       value="<?php echo htmlspecialchars($settings['callback_url'] ?? ''); ?>">
                                <div class="invalid-feedback">
                                    Please enter a valid webhook URL.
                                </div>
                                <small class="form-text text-muted">URL for receiving payment notifications (e.g., https://yoursite.com/user_api/fapshi_webhook.php)</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="fapshi_return_url">Return URL</label>
                                <input type="url" class="form-control" id="fapshi_return_url" name="fapshi_return_url" 
                                       value="<?php echo htmlspecialchars($settings['return_url'] ?? ''); ?>">
                                <div class="invalid-feedback">
                                    Please enter a valid return URL.
                                </div>
                                <small class="form-text text-muted">URL where users are redirected after payment completion</small>
                            </div>
                            
                            <div class="alert alert-info">
                                <h6><i class="fa fa-info-circle"></i> Fapshi API Credentials</h6>
                                <p class="mb-0">Fapshi uses API Key and API Secret for authentication. These credentials must be included in the headers of every API request.</p>
                            </div>
                            
                            <div class="alert alert-warning">
                                <h6><i class="fa fa-exclamation-triangle"></i> Webhook Secret</h6>
                                <p class="mb-0">The webhook secret is configured separately in your Fapshi dashboard and is used to verify webhook signatures. This is different from your API secret.</p>
                            </div>
                            
                            <div class="alert alert-warning">
                                <h6><i class="fa fa-exclamation-triangle"></i> Security Notice</h6>
                                <p class="mb-0">Keep your API credentials and webhook secret secure and never share them publicly. Your API Key and API Secret combination is essentially your username and password for the Fapshi API.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-12">
                            <h5 class="h5_set"><i class="fa fa-chart-bar"></i> Fapshi Transaction Statistics</h5>
                        </div>
                        
                        <?php 
                        // Get Fapshi transaction statistics
                        $stats_query = "SELECT 
                            COUNT(*) as total_transactions,
                            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_transactions,
                            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_transactions,
                            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
                            SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount
                            FROM tbl_wallet_transactions 
                            WHERE payment_method = 'fapshi'";
                        
                        $stats_result = $rstate->query($stats_query);
                        $stats = $stats_result->fetch_assoc();
                        ?>
                        
                        <div class="col-md-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <h4><?php echo number_format($stats['total_transactions']); ?></h4>
                                    <p>Total Transactions</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3">
                            <div class="card bg-success text-white">
                                <div class="card-body">
                                    <h4><?php echo number_format($stats['successful_transactions']); ?></h4>
                                    <p>Successful</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3">
                            <div class="card bg-warning text-white">
                                <div class="card-body">
                                    <h4><?php echo number_format($stats['pending_transactions']); ?></h4>
                                    <p>Pending</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3">
                            <div class="card bg-danger text-white">
                                <div class="card-body">
                                    <h4><?php echo number_format($stats['failed_transactions']); ?></h4>
                                    <p>Failed</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-12 mt-3">
                            <div class="card bg-info text-white">
                                <div class="card-body">
                                    <h4><?php echo number_format($stats['total_amount'], 2); ?> FCFA</h4>
                                    <p>Total Amount Processed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">
                                <i class="fa fa-save"></i> Save Fapshi Settings
                            </button>
                            
                            <a href="test_fapshi_complete.php" class="btn btn-info" target="_blank">
                                <i class="fa fa-test-tube"></i> Test Fapshi Integration
                            </a>
                        </div>
                    </div>
                </form>
                
                </div>
                </div>
               </div>
            </div>
          </div>
          <!-- Container-fluid Ends-->
        </div>
        <!-- footer start-->
        <?php require 'include/footer.php'; ?>
        <!-- footer end-->
      </div>
    </div>
    <!-- latest jquery-->
    <script src="assets/js/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap js-->
    <script src="assets/js/bootstrap/popper.min.js"></script>
    <script src="assets/js/bootstrap/bootstrap.min.js"></script>
    <!-- feather icon js-->
    <script src="assets/js/icons/feather-icon/feather.min.js"></script>
    <script src="assets/js/icons/feather-icon/feather-icon.js"></script>
    <!-- Sidebar jquery-->
    <script src="assets/js/sidebar-menu.js"></script>
    <!-- Custom js-->
    <script src="assets/js/script.js"></script>
    <script>
        // Form validation
        (function() {
            'use strict';
            window.addEventListener('load', function() {
                var forms = document.getElementsByClassName('needs-validation');
                var validation = Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    }, false);
                });
            }, false);
        })();
    </script>
</body>
</html>