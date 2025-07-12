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

// Pagination setup
$limit = 20;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Filter parameters
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';
$type_filter = isset($_GET['type']) ? $_GET['type'] : '';
$user_filter = isset($_GET['user_id']) ? $_GET['user_id'] : '';

// Build WHERE clause
$where_conditions = [];
$params = [];
$param_types = '';

if($status_filter) {
    $where_conditions[] = "status = ?";
    $params[] = $status_filter;
    $param_types .= 's';
}

if($type_filter) {
    $where_conditions[] = "transaction_type = ?";
    $params[] = $type_filter;
    $param_types .= 's';
}

if($user_filter) {
    $where_conditions[] = "user_id = ?";
    $params[] = $user_filter;
    $param_types .= 'i';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count for pagination
$count_query = "SELECT COUNT(*) as total FROM tbl_wallet_transactions " . $where_clause;
if(!empty($params)) {
    $count_stmt = $rstate->prepare($count_query);
    $count_stmt->bind_param($param_types, ...$params);
    $count_stmt->execute();
    $total_records = $count_stmt->get_result()->fetch_assoc()['total'];
} else {
    $total_records = $rstate->query($count_query)->fetch_assoc()['total'];
}

$total_pages = ceil($total_records / $limit);

// Get transactions with user details
$transactions_query = "SELECT wt.*, u.name as user_name, u.mobile as user_mobile 
                      FROM tbl_wallet_transactions wt 
                      LEFT JOIN tbl_user u ON wt.user_id = u.id 
                      " . $where_clause . " 
                      ORDER BY wt.created_at DESC 
                      LIMIT ? OFFSET ?";

if(!empty($params)) {
    $params[] = $limit;
    $params[] = $offset;
    $param_types .= 'ii';
    $transactions_stmt = $rstate->prepare($transactions_query);
    $transactions_stmt->bind_param($param_types, ...$params);
    $transactions_stmt->execute();
    $transactions_result = $transactions_stmt->get_result();
} else {
    $transactions_stmt = $rstate->prepare($transactions_query);
    $transactions_stmt->bind_param('ii', $limit, $offset);
    $transactions_stmt->execute();
    $transactions_result = $transactions_stmt->get_result();
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
                  <h3>Wallet Transactions</h3>
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
                
                <!-- Filters -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-filter"></i> Filter Transactions</h5>
                        <form method="GET" class="row">
                            <div class="col-md-3 mb-2">
                                <select class="form-control" name="status">
                                    <option value="">All Statuses</option>
                                    <option value="pending" <?php if($status_filter == 'pending') echo 'selected'; ?>>Pending</option>
                                    <option value="completed" <?php if($status_filter == 'completed') echo 'selected'; ?>>Completed</option>
                                    <option value="failed" <?php if($status_filter == 'failed') echo 'selected'; ?>>Failed</option>
                                </select>
                            </div>
                            <div class="col-md-3 mb-2">
                                <select class="form-control" name="type">
                                    <option value="">All Types</option>
                                    <option value="deposit" <?php if($type_filter == 'deposit') echo 'selected'; ?>>Deposit</option>
                                    <option value="booking" <?php if($type_filter == 'booking') echo 'selected'; ?>>Booking</option>
                                    <option value="refund" <?php if($type_filter == 'refund') echo 'selected'; ?>>Refund</option>
                                </select>
                            </div>
                            <div class="col-md-3 mb-2">
                                <input type="text" class="form-control" name="user_id" placeholder="User ID" value="<?php echo $user_filter; ?>">
                            </div>
                            <div class="col-md-3 mb-2">
                                <button type="submit" class="btn btn-primary">Filter</button>
                                <a href="admin_wallet_transactions.php" class="btn btn-secondary">Reset</a>
                            </div>
                        </form>
                    </div>
                </div>
                        
                <!-- Transactions Table -->
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Gateway</th>
                                <th>Transaction ID</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            if($transactions_result->num_rows > 0) {
                                while($transaction = $transactions_result->fetch_assoc()) { ?>
                                    <tr>
                                        <td><?php echo $transaction['id']; ?></td>
                                        <td>
                                            <strong><?php echo htmlspecialchars($transaction['user_name'] ?: 'Unknown'); ?></strong><br>
                                            <small><?php echo htmlspecialchars($transaction['user_mobile'] ?: ''); ?></small>
                                        </td>
                                        <td>
                                            <span class="badge <?php 
                                                echo $transaction['transaction_type'] == 'deposit' ? 'badge-success' : 
                                                    ($transaction['transaction_type'] == 'booking' ? 'badge-warning' : 'badge-info'); 
                                            ?>">
                                                <?php echo ucfirst($transaction['transaction_type']); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <strong><?php echo number_format($transaction['amount'], 2) . ' ' . $set['currency']; ?></strong>
                                        </td>
                                        <td>
                                            <span class="badge <?php 
                                                echo $transaction['status'] == 'completed' ? 'badge-success' : 
                                                    ($transaction['status'] == 'pending' ? 'badge-warning' : 'badge-danger'); 
                                            ?>">
                                                <?php echo ucfirst($transaction['status']); ?>
                                            </span>
                                        </td>
                                        <td><?php echo htmlspecialchars($transaction['payment_gateway'] ?: '-'); ?></td>
                                        <td>
                                            <small><?php echo htmlspecialchars($transaction['external_transaction_id'] ?: '-'); ?></small>
                                        </td>
                                        <td>
                                            <small><?php echo date('M j, Y H:i', strtotime($transaction['created_at'])); ?></small>
                                        </td>
                                        <td>
                                            <small><?php echo htmlspecialchars($transaction['description'] ?: '-'); ?></small>
                                        </td>
                                    </tr>
                                <?php }
                            } else { ?>
                                <tr>
                                    <td colspan="9" class="text-center">No transactions found</td>
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
                                <a class="page-link" href="?page=<?php echo ($page-1); ?>&status=<?php echo $status_filter; ?>&type=<?php echo $type_filter; ?>&user_id=<?php echo $user_filter; ?>">Previous</a>
                            </li>
                        <?php } ?>
                        
                        <?php for($i = max(1, $page-2); $i <= min($total_pages, $page+2); $i++) { ?>
                            <li class="page-item <?php echo ($i == $page) ? 'active' : ''; ?>">
                                <a class="page-link" href="?page=<?php echo $i; ?>&status=<?php echo $status_filter; ?>&type=<?php echo $type_filter; ?>&user_id=<?php echo $user_filter; ?>"><?php echo $i; ?></a>
                            </li>
                        <?php } ?>
                        
                        <?php if($page < $total_pages) { ?>
                            <li class="page-item">
                                <a class="page-link" href="?page=<?php echo ($page+1); ?>&status=<?php echo $status_filter; ?>&type=<?php echo $type_filter; ?>&user_id=<?php echo $user_filter; ?>">Next</a>
                            </li>
                        <?php } ?>
                    </ul>
                </nav>
                <?php } ?>
                
                <!-- Summary Statistics -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-chart-bar"></i> Transaction Summary</h5>
                    </div>
                    
                    <?php 
                    // Get summary statistics
                    $total_deposits = $rstate->query("SELECT SUM(amount) as total FROM tbl_wallet_transactions WHERE transaction_type = 'deposit' AND status = 'completed'")->fetch_assoc();
                    $total_bookings = $rstate->query("SELECT SUM(amount) as total FROM tbl_wallet_transactions WHERE transaction_type = 'booking' AND status = 'completed'")->fetch_assoc();
                    $pending_amount = $rstate->query("SELECT SUM(amount) as total FROM tbl_wallet_transactions WHERE status = 'pending'")->fetch_assoc();
                    $failed_amount = $rstate->query("SELECT SUM(amount) as total FROM tbl_wallet_transactions WHERE status = 'failed'")->fetch_assoc();
                    ?>
                    
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
                                        <h6>Pending Amount</h6>
                                        <p><?php echo number_format((float)($pending_amount['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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
                                        <h6>Failed Amount</h6>
                                        <p><?php echo number_format((float)($failed_amount['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
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