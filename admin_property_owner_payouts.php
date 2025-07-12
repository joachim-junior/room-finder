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

// Handle manual payout processing
if(isset($_POST['process_payout'])) {
    $payout_id = $_POST['payout_id'];
    
    // Update payout status to completed
    $update_payout = $rstate->prepare("UPDATE tbl_fapshi_payouts SET status = 'completed', updated_at = NOW() WHERE payout_id = ?");
    $update_payout->bind_param("s", $payout_id);
    
    if($update_payout->execute()) {
        $success_message = "Payout marked as completed successfully!";
    } else {
        $error_message = "Error processing payout.";
    }
}

if(isset($_POST['cancel_payout'])) {
    $payout_id = $_POST['payout_id'];
    
    // Update payout status to cancelled
    $update_payout = $rstate->prepare("UPDATE tbl_fapshi_payouts SET status = 'cancelled', updated_at = NOW() WHERE payout_id = ?");
    $update_payout->bind_param("s", $payout_id);
    
    if($update_payout->execute()) {
        $success_message = "Payout cancelled successfully!";
    } else {
        $error_message = "Error cancelling payout.";
    }
}

// Pagination setup
$limit = 20;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Filter parameters
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';
$method_filter = isset($_GET['method']) ? $_GET['method'] : '';
$owner_filter = isset($_GET['owner_id']) ? $_GET['owner_id'] : '';

// Build WHERE clause
$where_conditions = [];
$params = [];
$param_types = '';

if($status_filter) {
    $where_conditions[] = "fp.status = ?";
    $params[] = $status_filter;
    $param_types .= 's';
}

if($method_filter) {
    $where_conditions[] = "fp.payment_method = ?";
    $params[] = $method_filter;
    $param_types .= 's';
}

if($owner_filter) {
    $where_conditions[] = "fp.property_owner_id = ?";
    $params[] = $owner_filter;
    $param_types .= 'i';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count for pagination
$count_query = "SELECT COUNT(*) as total FROM tbl_fapshi_payouts fp " . $where_clause;
if(!empty($params)) {
    $count_stmt = $rstate->prepare($count_query);
    $count_stmt->bind_param($param_types, ...$params);
    $count_stmt->execute();
    $total_records = $count_stmt->get_result()->fetch_assoc()['total'];
} else {
    $total_records = $rstate->query($count_query)->fetch_assoc()['total'];
}

$total_pages = ceil($total_records / $limit);

// Get payouts with property owner details
$payouts_query = "SELECT fp.*, u.name as owner_name, u.mobile as owner_mobile, u.email as owner_email,
                         COUNT(p.id) as property_count
                  FROM tbl_fapshi_payouts fp 
                  LEFT JOIN tbl_user u ON fp.property_owner_id = u.id 
                  LEFT JOIN tbl_property p ON fp.property_owner_id = p.add_user_id
                  " . $where_clause . " 
                  GROUP BY fp.id
                  ORDER BY fp.created_at DESC 
                  LIMIT ? OFFSET ?";

if(!empty($params)) {
    $params[] = $limit;
    $params[] = $offset;
    $param_types .= 'ii';
    $payouts_stmt = $rstate->prepare($payouts_query);
    $payouts_stmt->bind_param($param_types, ...$params);
    $payouts_stmt->execute();
    $payouts_result = $payouts_stmt->get_result();
} else {
    $payouts_stmt = $rstate->prepare($payouts_query);
    $payouts_stmt->bind_param('ii', $limit, $offset);
    $payouts_stmt->execute();
    $payouts_result = $payouts_stmt->get_result();
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
                  <h3>Property Owner Payouts</h3>
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
                
                <!-- Filters -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-filter"></i> Filter Payouts</h5>
                        <form method="GET" class="row">
                            <div class="col-md-3 mb-2">
                                <select class="form-control" name="status">
                                    <option value="">All Statuses</option>
                                    <option value="pending" <?php if($status_filter == 'pending') echo 'selected'; ?>>Pending</option>
                                    <option value="processing" <?php if($status_filter == 'processing') echo 'selected'; ?>>Processing</option>
                                    <option value="completed" <?php if($status_filter == 'completed') echo 'selected'; ?>>Completed</option>
                                    <option value="failed" <?php if($status_filter == 'failed') echo 'selected'; ?>>Failed</option>
                                    <option value="cancelled" <?php if($status_filter == 'cancelled') echo 'selected'; ?>>Cancelled</option>
                                </select>
                            </div>
                            <div class="col-md-3 mb-2">
                                <select class="form-control" name="method">
                                    <option value="">All Methods</option>
                                    <option value="mtn_momo" <?php if($method_filter == 'mtn_momo') echo 'selected'; ?>>MTN Mobile Money</option>
                                    <option value="orange_money" <?php if($method_filter == 'orange_money') echo 'selected'; ?>>Orange Money</option>
                                </select>
                            </div>
                            <div class="col-md-3 mb-2">
                                <input type="text" class="form-control" name="owner_id" placeholder="Owner ID" value="<?php echo $owner_filter; ?>">
                            </div>
                            <div class="col-md-3 mb-2">
                                <button type="submit" class="btn btn-primary">Filter</button>
                                <a href="admin_property_owner_payouts.php" class="btn btn-secondary">Reset</a>
                            </div>
                        </form>
                    </div>
                </div>
                        
                <!-- Payouts Table -->
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th>Payout ID</th>
                                <th>Property Owner</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Mobile Number</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            if($payouts_result->num_rows > 0) {
                                while($payout = $payouts_result->fetch_assoc()) { ?>
                                    <tr>
                                        <td>
                                            <small><?php echo htmlspecialchars($payout['payout_id']); ?></small>
                                            <?php if($payout['fapshi_transaction_id']) { ?>
                                                <br><span class="badge badge-info">Fapshi: <?php echo substr($payout['fapshi_transaction_id'], 0, 10); ?>...</span>
                                            <?php } ?>
                                        </td>
                                        <td>
                                            <strong><?php echo htmlspecialchars($payout['owner_name'] ?: 'Unknown'); ?></strong><br>
                                            <small>ID: <?php echo $payout['property_owner_id']; ?></small><br>
                                            <small><?php echo htmlspecialchars($payout['owner_mobile'] ?: ''); ?></small><br>
                                            <small><?php echo $payout['property_count']; ?> properties</small>
                                        </td>
                                        <td>
                                            <strong><?php echo number_format($payout['payout_amount'], 2) . ' ' . $set['currency']; ?></strong>
                                        </td>
                                        <td>
                                            <span class="badge <?php 
                                                echo $payout['payment_method'] == 'mtn_momo' ? 'badge-warning' : 'badge-primary'; 
                                            ?>">
                                                <?php echo ucfirst(str_replace('_', ' ', $payout['payment_method'])); ?>
                                            </span>
                                        </td>
                                        <td><?php echo htmlspecialchars($payout['mobile_number']); ?></td>
                                        <td>
                                            <span class="badge <?php 
                                                echo $payout['status'] == 'completed' ? 'badge-success' : 
                                                    ($payout['status'] == 'processing' ? 'badge-info' : 
                                                    ($payout['status'] == 'pending' ? 'badge-warning' : 
                                                    ($payout['status'] == 'failed' ? 'badge-danger' : 'badge-secondary'))); 
                                            ?>">
                                                <?php echo ucfirst($payout['status']); ?>
                                            </span>
                                            <?php if($payout['error_message']) { ?>
                                                <br><small class="text-danger"><?php echo htmlspecialchars($payout['error_message']); ?></small>
                                            <?php } ?>
                                        </td>
                                        <td>
                                            <small><?php echo date('M j, Y H:i', strtotime($payout['created_at'])); ?></small>
                                            <?php if($payout['updated_at'] && $payout['updated_at'] != $payout['created_at']) { ?>
                                                <br><small class="text-muted">Updated: <?php echo date('M j, H:i', strtotime($payout['updated_at'])); ?></small>
                                            <?php } ?>
                                        </td>
                                        <td>
                                            <?php if($payout['status'] == 'pending' || $payout['status'] == 'processing') { ?>
                                                <form method="POST" style="display: inline-block;">
                                                    <input type="hidden" name="payout_id" value="<?php echo $payout['payout_id']; ?>">
                                                    <button type="submit" name="process_payout" class="btn btn-sm btn-success" 
                                                            onclick="return confirm('Mark this payout as completed?')">
                                                        Complete
                                                    </button>
                                                </form>
                                                <form method="POST" style="display: inline-block;">
                                                    <input type="hidden" name="payout_id" value="<?php echo $payout['payout_id']; ?>">
                                                    <button type="submit" name="cancel_payout" class="btn btn-sm btn-danger" 
                                                            onclick="return confirm('Cancel this payout?')">
                                                        Cancel
                                                    </button>
                                                </form>
                                            <?php } else { ?>
                                                <span class="text-muted">No actions</span>
                                            <?php } ?>
                                        </td>
                                    </tr>
                                <?php }
                            } else { ?>
                                <tr>
                                    <td colspan="8" class="text-center">No payouts found</td>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <?php if($total_pages > 1) { ?>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <?php if($page > 1) { ?>
                            <li class="page-item">
                                <a class="page-link" href="?page=<?php echo ($page-1); ?>&status=<?php echo $status_filter; ?>&method=<?php echo $method_filter; ?>&owner_id=<?php echo $owner_filter; ?>">Previous</a>
                            </li>
                        <?php } ?>
                        
                        <?php for($i = max(1, $page-2); $i <= min($total_pages, $page+2); $i++) { ?>
                            <li class="page-item <?php echo ($i == $page) ? 'active' : ''; ?>">
                                <a class="page-link" href="?page=<?php echo $i; ?>&status=<?php echo $status_filter; ?>&method=<?php echo $method_filter; ?>&owner_id=<?php echo $owner_filter; ?>"><?php echo $i; ?></a>
                            </li>
                        <?php } ?>
                        
                        <?php if($page < $total_pages) { ?>
                            <li class="page-item">
                                <a class="page-link" href="?page=<?php echo ($page+1); ?>&status=<?php echo $status_filter; ?>&method=<?php echo $method_filter; ?>&owner_id=<?php echo $owner_filter; ?>">Next</a>
                            </li>
                        <?php } ?>
                    </ul>
                </nav>
                <?php } ?>
                
                <!-- Summary Statistics -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-chart-bar"></i> Payout Summary</h5>
                    </div>
                    
                    <?php 
                    // Get summary statistics
                    $total_payouts = $rstate->query("SELECT SUM(payout_amount) as total FROM tbl_fapshi_payouts WHERE status = 'completed'")->fetch_assoc();
                    $pending_payouts = $rstate->query("SELECT COUNT(*) as count, SUM(payout_amount) as total FROM tbl_fapshi_payouts WHERE status IN ('pending', 'processing')")->fetch_assoc();
                    $failed_payouts = $rstate->query("SELECT COUNT(*) as count FROM tbl_fapshi_payouts WHERE status = 'failed'")->fetch_assoc();
                    $today_payouts = $rstate->query("SELECT COUNT(*) as count, SUM(payout_amount) as total FROM tbl_fapshi_payouts WHERE DATE(created_at) = CURDATE()")->fetch_assoc();
                    ?>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="check-circle"></i></div>
                                    <div class="sale-content">
                                        <h6>Total Completed Payouts</h6>
                                        <p><?php echo number_format((float)($total_payouts['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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
                                        <p><?php echo ($pending_payouts['count'] ?: 0) . ' payouts'; ?></p>
                                        <small><?php echo number_format((float)($pending_payouts['total'] ?: 0), 2) . ' ' . $set['currency']; ?></small>
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
                                        <h6>Failed Payouts</h6>
                                        <p><?php echo ($failed_payouts['count'] ?: 0) . ' payouts'; ?></p>
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
                                        <h6>Today's Payouts</h6>
                                        <p><?php echo ($today_payouts['count'] ?: 0) . ' payouts'; ?></p>
                                        <small><?php echo number_format((float)($today_payouts['total'] ?: 0), 2) . ' ' . $set['currency']; ?></small>
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