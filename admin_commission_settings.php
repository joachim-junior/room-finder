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
if(isset($_POST['update_commission_settings'])) {
    $commission_rate = floatval($_POST['commission_rate']);
    $payout_timing = $_POST['payout_timing'];
    $min_payout_amount = floatval($_POST['min_payout_amount']);
    $auto_payout = $_POST['auto_payout'];
    
    // Update commission settings
    $update_query = $rstate->prepare("UPDATE tbl_commission_settings SET 
        commission_rate = ?, 
        payout_timing = ?, 
        min_payout_amount = ?, 
        auto_payout = ?, 
        updated_at = NOW() 
        WHERE id = 1");
    $update_query->bind_param("dsds", $commission_rate, $payout_timing, $min_payout_amount, $auto_payout);
    
    if($update_query->execute()) {
        $success_message = "Commission settings updated successfully!";
    } else {
        $error_message = "Error updating commission settings.";
    }
}

// Get current commission settings
$commission_settings = $rstate->query("SELECT * FROM tbl_commission_settings WHERE id = 1")->fetch_assoc();
if(!$commission_settings) {
    // Create default settings if not exist
    $rstate->query("INSERT INTO tbl_commission_settings (commission_rate, payout_timing, min_payout_amount, auto_payout) VALUES (10.0, 'immediate', 1000.0, 'yes')");
    $commission_settings = $rstate->query("SELECT * FROM tbl_commission_settings WHERE id = 1")->fetch_assoc();
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
                  <h3>Commission Management</h3>
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
                        
                        <h5 class="h5_set"><i class="fa fa-percent"></i> Commission Settings</h5>
                <form method="post">
                    <div class="row">
                        <div class="form-group mb-3 col-4">
                            <label><span class="text-danger">*</span> Commission Rate (%)</label>
                            <input type="number" step="0.1" min="0" max="100" class="form-control" 
                                   placeholder="Enter Commission Rate" 
                                   value="<?php echo $commission_settings['commission_rate']; ?>" 
                                   name="commission_rate" required="">
                            <small class="text-muted">Percentage of booking amount to deduct as commission</small>
                        </div>
                        
                        <div class="form-group mb-3 col-4">
                            <label><span class="text-danger">*</span> Payout Timing</label>
                            <select class="form-control" name="payout_timing" required="">
                                <option value="">Select Payout Timing</option>
                                <option value="immediate" <?php if($commission_settings['payout_timing'] == 'immediate') echo 'selected'; ?>>Immediate</option>
                                <option value="after_checkin" <?php if($commission_settings['payout_timing'] == 'after_checkin') echo 'selected'; ?>>After Check-in</option>
                                <option value="after_checkout" <?php if($commission_settings['payout_timing'] == 'after_checkout') echo 'selected'; ?>>After Check-out</option>
                                <option value="manual" <?php if($commission_settings['payout_timing'] == 'manual') echo 'selected'; ?>>Manual</option>
                            </select>
                        </div>
                        
                        <div class="form-group mb-3 col-4">
                            <label><span class="text-danger">*</span> Minimum Payout Amount</label>
                            <input type="number" step="0.01" min="0" class="form-control" 
                                   placeholder="Enter Minimum Payout Amount" 
                                   value="<?php echo $commission_settings['min_payout_amount']; ?>" 
                                   name="min_payout_amount" required="">
                            <small class="text-muted">Minimum amount before payout is processed</small>
                        </div>
                        
                        <div class="form-group mb-3 col-4">
                            <label><span class="text-danger">*</span> Auto Payout</label>
                            <select class="form-control" name="auto_payout" required="">
                                <option value="">Select Option</option>
                                <option value="yes" <?php if($commission_settings['auto_payout'] == 'yes') echo 'selected'; ?>>Yes</option>
                                <option value="no" <?php if($commission_settings['auto_payout'] == 'no') echo 'selected'; ?>>No</option>
                            </select>
                            <small class="text-muted">Automatically process payouts to property owners</small>
                        </div>
                        
                        <div class="col-12">
                            <button type="submit" name="update_commission_settings" class="btn btn-primary mb-2">
                                Update Commission Settings
                            </button>
                        </div>
                    </div>
                </form>
                
                <!-- Commission Statistics -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-chart-bar"></i> Commission Statistics</h5>
                    </div>
                    
                    <?php 
                    // Get commission statistics
                    $today_commission = $rstate->query("SELECT SUM(commission_amount) as total FROM tbl_commission_tracking WHERE DATE(created_at) = CURDATE() AND status = 'paid'")->fetch_assoc();
                    $month_commission = $rstate->query("SELECT SUM(commission_amount) as total FROM tbl_commission_tracking WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND status = 'paid'")->fetch_assoc();
                    $total_commission = $rstate->query("SELECT SUM(commission_amount) as total FROM tbl_commission_tracking WHERE status = 'paid'")->fetch_assoc();
                    $pending_payouts = $rstate->query("SELECT SUM(amount) as total FROM tbl_property_owner_payouts WHERE status = 'pending'")->fetch_assoc();
                    ?>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="calendar"></i></div>
                                    <div class="sale-content">
                                        <h6>Today's Commission</h6>
                                        <p><?php echo number_format((float)($today_commission['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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
                                        <h6>This Month's Commission</h6>
                                        <p><?php echo number_format((float)($month_commission['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="trending-up"></i></div>
                                    <div class="sale-content">
                                        <h6>Total Commission</h6>
                                        <p><?php echo number_format((float)($total_commission['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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
                                        <h6>Pending Payouts</h6>
                                        <p><?php echo number_format((float)($pending_payouts['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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