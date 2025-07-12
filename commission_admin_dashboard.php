<?php
session_start();
require 'include/reconfig.php';

// Check if admin is logged in (adjust this based on your admin authentication)
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'update_commission_settings':
                $commission_rate = floatval($_POST['commission_rate']);
                $payout_timing = mysqli_real_escape_string($rstate, $_POST['payout_timing']);
                $minimum_payout = floatval($_POST['minimum_payout']);
                $auto_payout = isset($_POST['auto_payout']) ? 1 : 0;
                
                // Update commission settings
                $update_query = "UPDATE tbl_commission_settings SET 
                                commission_rate = $commission_rate,
                                payout_timing = '$payout_timing',
                                minimum_payout = $minimum_payout,
                                auto_payout = $auto_payout,
                                updated_by = 1
                                WHERE id = 1";
                
                if ($rstate->query($update_query)) {
                    $success_message = "Commission settings updated successfully!";
                } else {
                    $error_message = "Error updating settings: " . $rstate->error;
                }
                break;
                
            case 'process_manual_payout':
                $tracking_id = intval($_POST['tracking_id']);
                $result = processManualPayout($tracking_id, $rstate);
                if ($result) {
                    $success_message = "Payout processed successfully!";
                } else {
                    $error_message = "Error processing payout!";
                }
                break;
        }
    }
}

// Get current commission settings
$settings_query = $rstate->query("SELECT * FROM tbl_commission_settings ORDER BY id DESC LIMIT 1");
$settings = $settings_query->num_rows > 0 ? $settings_query->fetch_assoc() : array();

// Get commission analytics
$analytics = getCommissionAnalytics($rstate);

// Get recent bookings with commission data
$recent_bookings = getRecentBookingsWithCommission($rstate);

// Get pending payouts
$pending_payouts = getPendingPayouts($rstate);

function getCommissionAnalytics($rstate) {
    // Today's stats
    $today = date('Y-m-d');
    $today_stats = $rstate->query("SELECT 
        COUNT(*) as bookings_today,
        SUM(booking_amount) as revenue_today,
        SUM(commission_amount) as commission_today,
        SUM(owner_payout) as payouts_today
        FROM tbl_commission_tracking 
        WHERE DATE(created_at) = '$today'")->fetch_assoc();
    
    // This month's stats
    $month_start = date('Y-m-01');
    $month_stats = $rstate->query("SELECT 
        COUNT(*) as bookings_month,
        SUM(booking_amount) as revenue_month,
        SUM(commission_amount) as commission_month,
        SUM(owner_payout) as payouts_month
        FROM tbl_commission_tracking 
        WHERE DATE(created_at) >= '$month_start'")->fetch_assoc();
    
    // All time stats
    $all_time_stats = $rstate->query("SELECT 
        COUNT(*) as total_bookings,
        SUM(booking_amount) as total_revenue,
        SUM(commission_amount) as total_commission,
        SUM(owner_payout) as total_payouts
        FROM tbl_commission_tracking")->fetch_assoc();
    
    return array(
        'today' => $today_stats,
        'month' => $month_stats,
        'all_time' => $all_time_stats
    );
}

function getRecentBookingsWithCommission($rstate, $limit = 10) {
    $query = "SELECT 
        ct.*,
        b.check_in,
        b.check_out,
        b.prop_title,
        u.name as customer_name,
        uo.name as owner_name
        FROM tbl_commission_tracking ct
        LEFT JOIN tbl_book b ON ct.booking_id = b.id
        LEFT JOIN tbl_user u ON b.uid = u.id
        LEFT JOIN tbl_user uo ON ct.property_owner_id = uo.id
        ORDER BY ct.created_at DESC 
        LIMIT $limit";
    
    $result = $rstate->query($query);
    $bookings = array();
    
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    
    return $bookings;
}

function getPendingPayouts($rstate) {
    $query = "SELECT 
        ct.*,
        b.prop_title,
        u.name as owner_name,
        u.email as owner_email
        FROM tbl_commission_tracking ct
        LEFT JOIN tbl_book b ON ct.booking_id = b.id
        LEFT JOIN tbl_user u ON ct.property_owner_id = u.id
        WHERE ct.status = 'pending'
        ORDER BY ct.created_at ASC";
    
    $result = $rstate->query($query);
    $payouts = array();
    
    while ($row = $result->fetch_assoc()) {
        $payouts[] = $row;
    }
    
    return $payouts;
}

function processManualPayout($tracking_id, $rstate) {
    // Get tracking details
    $tracking = $rstate->query("SELECT * FROM tbl_commission_tracking WHERE id = $tracking_id")->fetch_assoc();
    
    if (!$tracking || $tracking['status'] != 'pending') {
        return false;
    }
    
    // Include the payout processing function from the booking file
    // This is a simplified version - you might want to extract to a separate include file
    return processPropertyOwnerPayoutManual($tracking_id, $tracking['property_owner_id'], $tracking['booking_id'], $tracking['owner_payout'], $rstate);
}

function processPropertyOwnerPayoutManual($tracking_id, $owner_id, $booking_id, $amount, $rstate) {
    try {
        $rstate->autocommit(false);
        
        // Insert payout record
        $timestamp = date("Y-m-d H:i:s");
        $payout_insert = "INSERT INTO tbl_property_owner_payouts (owner_id, booking_id, commission_tracking_id, amount, payout_method, status, processed_at) 
                         VALUES ($owner_id, $booking_id, $tracking_id, $amount, 'wallet', 'completed', '$timestamp')";
        $rstate->query($payout_insert);
        
        // Credit property owner's wallet
        $owner = $rstate->query("SELECT * FROM tbl_user WHERE id = $owner_id")->fetch_assoc();
        if ($owner) {
            $new_balance = $owner['wallet'] + $amount;
            $rstate->query("UPDATE tbl_user SET wallet = $new_balance WHERE id = $owner_id");
            
            // Add wallet report entry
            $report_insert = "INSERT INTO wallet_report (uid, message, status, amt, tdate) 
                             VALUES ($owner_id, 'Manual Payout for Booking #$booking_id', 'Credit', $amount, '$timestamp')";
            $rstate->query($report_insert);
            
            // Update commission tracking status
            $rstate->query("UPDATE tbl_commission_tracking SET status = 'paid', payout_date = '$timestamp' WHERE id = $tracking_id");
            
            $rstate->commit();
            return true;
        }
        
        $rstate->rollback();
        return false;
        
    } catch (Exception $e) {
        $rstate->rollback();
        error_log("Manual payout error: " . $e->getMessage());
        return false;
    } finally {
        $rstate->autocommit(true);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Commission Management Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f7fa;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            border-top: 4px solid;
        }
        .stat-card.today { border-top-color: #4CAF50; }
        .stat-card.month { border-top-color: #2196F3; }
        .stat-card.all-time { border-top-color: #FF9800; }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
            color: #333;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        input[type="number"], select, input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        input[type="number"]:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        input[type="checkbox"] {
            margin-right: 10px;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .btn-success {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        }
        .btn-warning {
            background: linear-gradient(135deg, #FF9800 0%, #f57c00 100%);
        }
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 6px;
            font-weight: 500;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e1e5e9;
        }
        th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        .status-pending { 
            color: #ffc107; 
            font-weight: bold;
        }
        .status-paid { 
            color: #28a745; 
            font-weight: bold;
        }
        .status-cancelled { 
            color: #dc3545; 
            font-weight: bold;
        }
        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 2px solid #e1e5e9;
        }
        .tab {
            padding: 15px 25px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            transition: all 0.3s;
        }
        .tab.active {
            color: #667eea;
            border-bottom: 2px solid #667eea;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .section-title {
            font-size: 1.5em;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Commission Management</h1>
            <p>Manage platform commission settings and track earnings</p>
        </div>

        <?php if (isset($success_message)): ?>
            <div class="alert alert-success"><?php echo $success_message; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error_message)): ?>
            <div class="alert alert-error"><?php echo $error_message; ?></div>
        <?php endif; ?>

        <!-- Analytics Overview -->
        <div class="section-title">Platform Analytics</div>
        <div class="stats-grid">
            <div class="stat-card today">
                <div class="stat-label">Today</div>
                <div class="stat-number"><?php echo number_format($analytics['today']['commission_today'] ?? 0); ?> FCFA</div>
                <div><?php echo $analytics['today']['bookings_today'] ?? 0; ?> bookings</div>
            </div>
            <div class="stat-card month">
                <div class="stat-label">This Month</div>
                <div class="stat-number"><?php echo number_format($analytics['month']['commission_month'] ?? 0); ?> FCFA</div>
                <div><?php echo $analytics['month']['bookings_month'] ?? 0; ?> bookings</div>
            </div>
            <div class="stat-card all-time">
                <div class="stat-label">All Time</div>
                <div class="stat-number"><?php echo number_format($analytics['all_time']['total_commission'] ?? 0); ?> FCFA</div>
                <div><?php echo $analytics['all_time']['total_bookings'] ?? 0; ?> total bookings</div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs">
            <button class="tab active" onclick="showTab('settings')">Commission Settings</button>
            <button class="tab" onclick="showTab('bookings')">Recent Bookings</button>
            <button class="tab" onclick="showTab('pending')">Pending Payouts</button>
        </div>

        <!-- Settings Tab -->
        <div id="settings" class="tab-content active">
            <div class="card">
                <h2>Commission Configuration</h2>
                
                <form method="POST">
                    <input type="hidden" name="action" value="update_commission_settings">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="commission_rate">Commission Rate (%):</label>
                            <input type="number" id="commission_rate" name="commission_rate" 
                                   value="<?php echo $settings['commission_rate'] ?? 10; ?>" 
                                   step="0.01" min="0" max="50" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="minimum_payout">Minimum Payout Amount (FCFA):</label>
                            <input type="number" id="minimum_payout" name="minimum_payout" 
                                   value="<?php echo $settings['minimum_payout'] ?? 100; ?>" 
                                   step="0.01" min="0" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="payout_timing">Payout Timing:</label>
                            <select id="payout_timing" name="payout_timing" required>
                                <option value="immediate" <?php echo ($settings['payout_timing'] ?? 'immediate') == 'immediate' ? 'selected' : ''; ?>>
                                    Immediate (upon booking)
                                </option>
                                <option value="after_checkin" <?php echo ($settings['payout_timing'] ?? '') == 'after_checkin' ? 'selected' : ''; ?>>
                                    After Check-in
                                </option>
                                <option value="manual" <?php echo ($settings['payout_timing'] ?? '') == 'manual' ? 'selected' : ''; ?>>
                                    Manual Approval
                                </option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="auto_payout" value="1" 
                                       <?php echo ($settings['auto_payout'] ?? 1) ? 'checked' : ''; ?>>
                                Enable Automatic Payouts
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit">Update Commission Settings</button>
                </form>
            </div>
        </div>

        <!-- Recent Bookings Tab -->
        <div id="bookings" class="tab-content">
            <div class="card">
                <h2>Recent Bookings with Commission</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Property</th>
                            <th>Customer</th>
                            <th>Property Owner</th>
                            <th>Booking Amount</th>
                            <th>Commission</th>
                            <th>Owner Payout</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent_bookings as $booking): ?>
                        <tr>
                            <td>#<?php echo $booking['booking_id']; ?></td>
                            <td><?php echo htmlspecialchars($booking['prop_title']); ?></td>
                            <td><?php echo htmlspecialchars($booking['customer_name']); ?></td>
                            <td><?php echo htmlspecialchars($booking['owner_name']); ?></td>
                            <td><?php echo number_format($booking['booking_amount']); ?> FCFA</td>
                            <td><?php echo number_format($booking['commission_amount']); ?> FCFA</td>
                            <td><?php echo number_format($booking['owner_payout']); ?> FCFA</td>
                            <td class="status-<?php echo $booking['status']; ?>">
                                <?php echo ucfirst($booking['status']); ?>
                            </td>
                            <td><?php echo date('M j, Y', strtotime($booking['created_at'])); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pending Payouts Tab -->
        <div id="pending" class="tab-content">
            <div class="card">
                <h2>Pending Payouts</h2>
                
                <?php if (empty($pending_payouts)): ?>
                    <p>No pending payouts at the moment.</p>
                <?php else: ?>
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Property</th>
                                <th>Property Owner</th>
                                <th>Payout Amount</th>
                                <th>Commission Rate</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($pending_payouts as $payout): ?>
                            <tr>
                                <td>#<?php echo $payout['booking_id']; ?></td>
                                <td><?php echo htmlspecialchars($payout['prop_title']); ?></td>
                                <td><?php echo htmlspecialchars($payout['owner_name']); ?></td>
                                <td><?php echo number_format($payout['owner_payout']); ?> FCFA</td>
                                <td><?php echo $payout['commission_rate']; ?>%</td>
                                <td><?php echo date('M j, Y', strtotime($payout['created_at'])); ?></td>
                                <td>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="action" value="process_manual_payout">
                                        <input type="hidden" name="tracking_id" value="<?php echo $payout['id']; ?>">
                                        <button type="submit" class="btn-success" 
                                                onclick="return confirm('Process payout for <?php echo htmlspecialchars($payout['owner_name']); ?>?')">
                                            Process Payout
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </div>

    </div>

    <script>
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }
    </script>
</body>
</html>