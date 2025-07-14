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
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $min_deposit = floatval($_POST['min_deposit']);
    $max_deposit = floatval($_POST['max_deposit']);
    $wallet_enabled = isset($_POST['wallet_enabled']) ? 1 : 0;
    $auto_approve_deposits = isset($_POST['auto_approve_deposits']) ? 1 : 0;
    $wallet_commission_rate = floatval($_POST['wallet_commission_rate']);
    
    // Update settings
    $update_query = "UPDATE tbl_wallet_settings SET 
                    min_deposit = ?, 
                    max_deposit = ?, 
                    wallet_enabled = ?, 
                    auto_approve_deposits = ?, 
                    commission_rate = ?,
                    updated_at = NOW()
                    WHERE id = 1";
    
    $stmt = $rstate->prepare($update_query);
    $stmt->bind_param('ddiii', $min_deposit, $max_deposit, $wallet_enabled, $auto_approve_deposits, $wallet_commission_rate);
    
    if($stmt->execute()) {
        $success_message = "Wallet settings updated successfully!";
    } else {
        $error_message = "Error updating wallet settings: " . $stmt->error;
    }
}

// Get current settings
$settings_query = "SELECT * FROM tbl_wallet_settings WHERE id = 1";
$settings_result = $rstate->query($settings_query);

if($settings_result->num_rows == 0) {
    // Create default settings if none exist
    $insert_query = "INSERT INTO tbl_wallet_settings (min_deposit, max_deposit, wallet_enabled, auto_approve_deposits, commission_rate, created_at, updated_at) 
                     VALUES (10.00, 10000.00, 1, 0, 2.5, NOW(), NOW())";
    $rstate->query($insert_query);
    $settings_result = $rstate->query($settings_query);
}

$settings = $settings_result->fetch_assoc();
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
                  <h3>Wallet Settings</h3>
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
                            <h5 class="h5_set"><i class="fa fa-cog"></i> General Settings</h5>
                            
                            <div class="form-group">
                                <label for="wallet_enabled">Enable Wallet System</label>
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="wallet_enabled" name="wallet_enabled" <?php echo $settings['wallet_enabled'] ? 'checked' : ''; ?>>
                                    <label class="custom-control-label" for="wallet_enabled">Enable wallet functionality for users</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="auto_approve_deposits">Auto-approve Deposits</label>
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="auto_approve_deposits" name="auto_approve_deposits" <?php echo $settings['auto_approve_deposits'] ? 'checked' : ''; ?>>
                                    <label class="custom-control-label" for="auto_approve_deposits">Automatically approve deposit transactions</label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="min_deposit">Minimum Deposit Amount (<?php echo $set['currency']; ?>)</label>
                                <input type="number" class="form-control" id="min_deposit" name="min_deposit" 
                                       value="<?php echo $settings['min_deposit']; ?>" step="0.01" min="0" required>
                                <div class="invalid-feedback">
                                    Please enter a valid minimum deposit amount.
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="max_deposit">Maximum Deposit Amount (<?php echo $set['currency']; ?>)</label>
                                <input type="number" class="form-control" id="max_deposit" name="max_deposit" 
                                       value="<?php echo $settings['max_deposit']; ?>" step="0.01" min="0" required>
                                <div class="invalid-feedback">
                                    Please enter a valid maximum deposit amount.
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <h5 class="h5_set"><i class="fa fa-percentage"></i> Commission Settings</h5>
                            
                            <div class="form-group">
                                <label for="wallet_commission_rate">Wallet Commission Rate (%)</label>
                                <input type="number" class="form-control" id="wallet_commission_rate" name="wallet_commission_rate" 
                                       value="<?php echo $settings['commission_rate']; ?>" step="0.1" min="0" max="100" required>
                                <div class="invalid-feedback">
                                    Please enter a valid commission rate between 0 and 100.
                                </div>
                                <small class="form-text text-muted">Percentage of transaction amount charged as platform fee</small>
                            </div>
                            
                            <div class="alert alert-info">
                                <h6><i class="fa fa-info-circle"></i> Commission Information</h6>
                                <p class="mb-0">The commission rate applies to all wallet transactions. This helps cover platform costs and maintain service quality.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-12">
                            <h5 class="h5_set"><i class="fa fa-chart-bar"></i> Wallet Statistics</h5>
                        </div>
                        
                        <?php 
                        // Get wallet statistics
                        $total_users = $rstate->query("SELECT COUNT(DISTINCT user_id) as total FROM tbl_wallet_transactions")->fetch_assoc();
                        $total_deposits = $rstate->query("SELECT SUM(amount) as total FROM tbl_wallet_transactions WHERE transaction_type = 'deposit' AND status = 'completed'")->fetch_assoc();
                        $total_bookings = $rstate->query("SELECT SUM(amount) as total FROM tbl_wallet_transactions WHERE transaction_type = 'booking' AND status = 'completed'")->fetch_assoc();
                        $pending_transactions = $rstate->query("SELECT COUNT(*) as total FROM tbl_wallet_transactions WHERE status = 'pending'")->fetch_assoc();
                        ?>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6">
                            <div class="card sale-chart">
                                <div class="card-body">
                                    <div class="sale-detail">
                                        <div class="icon"><i data-feather="users"></i></div>
                                        <div class="sale-content">
                                            <h6>Active Users</h6>
                                            <p><?php echo number_format($total_users['total']); ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6">
                            <div class="card sale-chart">
                                <div class="card-body">
                                    <div class="sale-detail">
                                        <div class="icon"><i data-feather="arrow-down-circle"></i></div>
                                        <div class="sale-content">
                                            <h6>Total Deposits</h6>
                                            <p><?php echo number_format((float)($total_deposits['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6">
                            <div class="card sale-chart">
                                <div class="card-body">
                                    <div class="sale-detail">
                                        <div class="icon"><i data-feather="arrow-up-circle"></i></div>
                                        <div class="sale-content">
                                            <h6>Total Bookings</h6>
                                            <p><?php echo number_format((float)($total_bookings['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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
                                            <h6>Pending Transactions</h6>
                                            <p><?php echo number_format($pending_transactions['total']); ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">
                                <i class="fa fa-save"></i> Save Settings
                            </button>
                            <a href="admin_wallet_transactions.php" class="btn btn-secondary">
                                <i class="fa fa-list"></i> View Transactions
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
        
      </div>
    </div>
    <!-- latest jquery-->
    <?php 
require 'include/footer.php';
?>
  </body>
</html> 