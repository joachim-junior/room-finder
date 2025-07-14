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
$date_from = isset($_GET['date_from']) ? $_GET['date_from'] : '';
$date_to = isset($_GET['date_to']) ? $_GET['date_to'] : '';
$property_filter = isset($_GET['property_id']) ? $_GET['property_id'] : '';

// Build WHERE clause
$where_conditions = [];
$params = [];
$param_types = '';

if($status_filter) {
    $where_conditions[] = "ct.status = ?";
    $params[] = $status_filter;
    $param_types .= 's';
}

if($date_from) {
    $where_conditions[] = "DATE(ct.created_at) >= ?";
    $params[] = $date_from;
    $param_types .= 's';
}

if($date_to) {
    $where_conditions[] = "DATE(ct.created_at) <= ?";
    $params[] = $date_to;
    $param_types .= 's';
}

if($property_filter) {
    $where_conditions[] = "ct.property_id = ?";
    $params[] = $property_filter;
    $param_types .= 'i';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count for pagination
$count_query = "SELECT COUNT(*) as total FROM tbl_commission_tracking ct " . $where_clause;
if(!empty($params)) {
    $count_stmt = $rstate->prepare($count_query);
    $count_stmt->bind_param($param_types, ...$params);
    $count_stmt->execute();
    $total_records = $count_stmt->get_result()->fetch_assoc()['total'];
} else {
    $total_records = $rstate->query($count_query)->fetch_assoc()['total'];
}

$total_pages = ceil($total_records / $limit);

// Get commission records with property and booking details
$commission_query = "SELECT ct.*, p.title as property_title, p.owner_id, u.name as owner_name, 
                           b.total as booking_amount, b.book_status
                    FROM tbl_commission_tracking ct 
                    LEFT JOIN tbl_property p ON ct.property_id = p.id 
                    LEFT JOIN tbl_user u ON p.owner_id = u.id 
                    LEFT JOIN tbl_book b ON ct.booking_id = b.id 
                    " . $where_clause . " 
                    ORDER BY ct.created_at DESC 
                    LIMIT ? OFFSET ?";

if(!empty($params)) {
    $params[] = $limit;
    $params[] = $offset;
    $param_types .= 'ii';
    $commission_stmt = $rstate->prepare($commission_query);
    $commission_stmt->bind_param($param_types, ...$params);
    $commission_stmt->execute();
    $commission_result = $commission_stmt->get_result();
} else {
    $commission_stmt = $rstate->prepare($commission_query);
    $commission_stmt->bind_param('ii', $limit, $offset);
    $commission_stmt->execute();
    $commission_result = $commission_stmt->get_result();
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
                  <h3>Commission Reports</h3>
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
                        <h5 class="h5_set"><i class="fa fa-filter"></i> Filter Reports</h5>
                        <form method="GET" class="row">
                            <div class="col-md-2 mb-2">
                                <select class="form-control" name="status">
                                    <option value="">All Statuses</option>
                                    <option value="pending" <?php if($status_filter == 'pending') echo 'selected'; ?>>Pending</option>
                                    <option value="paid" <?php if($status_filter == 'paid') echo 'selected'; ?>>Paid</option>
                                    <option value="cancelled" <?php if($status_filter == 'cancelled') echo 'selected'; ?>>Cancelled</option>
                                </select>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="date" class="form-control" name="date_from" placeholder="From Date" value="<?php echo $date_from; ?>">
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="date" class="form-control" name="date_to" placeholder="To Date" value="<?php echo $date_to; ?>">
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="text" class="form-control" name="property_id" placeholder="Property ID" value="<?php echo $property_filter; ?>">
                            </div>
                            <div class="col-md-4 mb-2">
                                <button type="submit" class="btn btn-primary">Filter</button>
                                <a href="admin_commission_reports.php" class="btn btn-secondary">Reset</a>
                                <button type="button" class="btn btn-success" onclick="exportToCSV()">
                                    <i class="fa fa-download"></i> Export CSV
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                        
                <!-- Commission Reports Table -->
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Property</th>
                                <th>Property Owner</th>
                                <th>Booking Amount</th>
                                <th>Commission Amount</th>
                                <th>Commission Rate</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            if($commission_result->num_rows > 0) {
                                while($commission = $commission_result->fetch_assoc()) { ?>
                                    <tr>
                                        <td><?php echo $commission['id']; ?></td>
                                        <td>
                                            <strong><?php echo htmlspecialchars($commission['property_title'] ?: 'Unknown Property'); ?></strong><br>
                                            <small>ID: <?php echo $commission['property_id']; ?></small>
                                        </td>
                                        <td>
                                            <strong><?php echo htmlspecialchars($commission['owner_name'] ?: 'Unknown Owner'); ?></strong><br>
                                            <small>ID: <?php echo $commission['owner_id']; ?></small>
                                        </td>
                                        <td>
                                            <strong><?php echo number_format($commission['booking_amount'], 2) . ' ' . $set['currency']; ?></strong>
                                        </td>
                                        <td>
                                            <strong><?php echo number_format($commission['commission_amount'], 2) . ' ' . $set['currency']; ?></strong>
                                        </td>
                                        <td>
                                            <span class="badge badge-info"><?php echo $commission['commission_rate']; ?>%</span>
                                        </td>
                                        <td>
                                            <span class="badge <?php 
                                                echo $commission['status'] == 'paid' ? 'badge-success' : 
                                                    ($commission['status'] == 'pending' ? 'badge-warning' : 'badge-danger'); 
                                            ?>">
                                                <?php echo ucfirst($commission['status']); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <small><?php echo date('M j, Y H:i', strtotime($commission['created_at'])); ?></small>
                                        </td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <button type="button" class="btn btn-sm btn-info" onclick="viewDetails(<?php echo $commission['id']; ?>)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <?php if($commission['status'] == 'pending') { ?>
                                                <button type="button" class="btn btn-sm btn-success" onclick="markAsPaid(<?php echo $commission['id']; ?>)">
                                                    <i class="fa fa-check"></i>
                                                </button>
                                                <?php } ?>
                                            </div>
                                        </td>
                                    </tr>
                                <?php }
                            } else { ?>
                                <tr>
                                    <td colspan="9" class="text-center">No commission records found</td>
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
                                <a class="page-link" href="?page=<?php echo ($page-1); ?>&status=<?php echo $status_filter; ?>&date_from=<?php echo $date_from; ?>&date_to=<?php echo $date_to; ?>&property_id=<?php echo $property_filter; ?>">Previous</a>
                            </li>
                        <?php } ?>
                        
                        <?php for($i = max(1, $page-2); $i <= min($total_pages, $page+2); $i++) { ?>
                            <li class="page-item <?php echo ($i == $page) ? 'active' : ''; ?>">
                                <a class="page-link" href="?page=<?php echo $i; ?>&status=<?php echo $status_filter; ?>&date_from=<?php echo $date_from; ?>&date_to=<?php echo $date_to; ?>&property_id=<?php echo $property_filter; ?>"><?php echo $i; ?></a>
                            </li>
                        <?php } ?>
                        
                        <?php if($page < $total_pages) { ?>
                            <li class="page-item">
                                <a class="page-link" href="?page=<?php echo ($page+1); ?>&status=<?php echo $status_filter; ?>&date_from=<?php echo $date_from; ?>&date_to=<?php echo $date_to; ?>&property_id=<?php echo $property_filter; ?>">Next</a>
                            </li>
                        <?php } ?>
                    </ul>
                </nav>
                <?php } ?>
                
                <!-- Summary Statistics -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="h5_set"><i class="fa fa-chart-bar"></i> Commission Summary</h5>
                    </div>
                    
                    <?php 
                    // Get summary statistics
                    $total_commission = $rstate->query("SELECT SUM(commission_amount) as total FROM tbl_commission_tracking WHERE status = 'paid'")->fetch_assoc();
                    $pending_commission = $rstate->query("SELECT SUM(commission_amount) as total FROM tbl_commission_tracking WHERE status = 'pending'")->fetch_assoc();
                    $total_transactions = $rstate->query("SELECT COUNT(*) as total FROM tbl_commission_tracking")->fetch_assoc();
                    $paid_transactions = $rstate->query("SELECT COUNT(*) as total FROM tbl_commission_tracking WHERE status = 'paid'")->fetch_assoc();
                    ?>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="dollar-sign"></i></div>
                                    <div class="sale-content">
                                        <h6>Total Commission Earned</h6>
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
                                        <h6>Pending Commission</h6>
                                        <p><?php echo number_format((float)($pending_commission['total'] ?: 0), 2) . ' ' . $set['currency']; ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="list"></i></div>
                                    <div class="sale-content">
                                        <h6>Total Transactions</h6>
                                        <p><?php echo number_format($total_transactions['total']); ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card sale-chart">
                            <div class="card-body">
                                <div class="sale-detail">
                                    <div class="icon"><i data-feather="check-circle"></i></div>
                                    <div class="sale-content">
                                        <h6>Paid Transactions</h6>
                                        <p><?php echo number_format($paid_transactions['total']); ?></p>
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

<script>
function viewDetails(id) {
    // Implement view details functionality
    alert('View details for commission ID: ' + id);
}

function markAsPaid(id) {
    if(confirm('Are you sure you want to mark this commission as paid?')) {
        // Implement mark as paid functionality
        window.location.href = 'mark_commission_paid.php?id=' + id;
    }
}

function exportToCSV() {
    // Get current filter parameters
    const params = new URLSearchParams(window.location.search);
    window.location.href = 'export_commission_csv.php?' + params.toString();
}
</script>
  </body>
</html> 