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
    $api_key = mysqli_real_escape_string($rstate, $_POST['api_key']);
    $secret_key = mysqli_real_escape_string($rstate, $_POST['secret_key']);
    $sandbox_mode = isset($_POST['sandbox_mode']) ? 1 : 0;
    $callback_url = mysqli_real_escape_string($rstate, $_POST['callback_url']);
    $return_url = mysqli_real_escape_string($rstate, $_POST['return_url']);
    $status = isset($_POST['status']) ? 1 : 0;
    
    // Update or insert Fapshi settings
    $query = "INSERT INTO tbl_payment_settings (gateway, api_key, secret_key, sandbox_mode, callback_url, return_url, status) 
              VALUES ('fapshi', '$api_key', '$secret_key', $sandbox_mode, '$callback_url', '$return_url', $status)
              ON DUPLICATE KEY UPDATE 
              api_key = '$api_key', 
              secret_key = '$secret_key', 
              sandbox_mode = $sandbox_mode, 
              callback_url = '$callback_url', 
              return_url = '$return_url', 
              status = $status";
    
    if ($rstate->query($query)) {
        $success_message = "Fapshi settings updated successfully!";
    } else {
        $error_message = "Error updating settings: " . $rstate->error;
    }
}

// Get current settings
$settings_query = $rstate->query("SELECT * FROM tbl_payment_settings WHERE gateway = 'fapshi'");
$settings = $settings_query->num_rows > 0 ? $settings_query->fetch_assoc() : array();

// Get transaction statistics
$stats_query = $rstate->query("SELECT 
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_transactions,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_transactions,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount
    FROM tbl_wallet_transactions 
    WHERE payment_method = 'fapshi'");
$stats = $stats_query->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fapshi Payment Settings</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        h1, h2 {
            color: #333;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"], input[type="url"], textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        input[type="checkbox"] {
            margin-right: 10px;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
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
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .stat-card {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
            text-align: center;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
        }
        .stat-label {
            color: #6c757d;
            margin-top: 5px;
        }
        .recent-transactions {
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .status-completed { color: #28a745; }
        .status-pending { color: #ffc107; }
        .status-failed { color: #dc3545; }
        .status-cancelled { color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Fapshi Payment Settings</h1>
        
        <?php if (isset($success_message)): ?>
            <div class="alert alert-success"><?php echo $success_message; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error_message)): ?>
            <div class="alert alert-error"><?php echo $error_message; ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="api_key">API Key:</label>
                <input type="text" id="api_key" name="api_key" value="<?php echo isset($settings['api_key']) ? htmlspecialchars($settings['api_key']) : ''; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="secret_key">Secret Key:</label>
                <input type="text" id="secret_key" name="secret_key" value="<?php echo isset($settings['secret_key']) ? htmlspecialchars($settings['secret_key']) : ''; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="callback_url">Webhook/Callback URL:</label>
                <input type="url" id="callback_url" name="callback_url" value="<?php echo isset($settings['callback_url']) ? htmlspecialchars($settings['callback_url']) : 'https://yoursite.com/user_api/fapshi_webhook.php'; ?>" required>
                <small>This URL will receive payment notifications from Fapshi</small>
            </div>
            
            <div class="form-group">
                <label for="return_url">Return URL:</label>
                <input type="url" id="return_url" name="return_url" value="<?php echo isset($settings['return_url']) ? htmlspecialchars($settings['return_url']) : 'https://yoursite.com/wallet_success.php'; ?>" required>
                <small>Users will be redirected here after payment</small>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="sandbox_mode" value="1" <?php echo (isset($settings['sandbox_mode']) && $settings['sandbox_mode']) ? 'checked' : ''; ?>>
                    Sandbox Mode (Use for testing)
                </label>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="status" value="1" <?php echo (isset($settings['status']) && $settings['status']) ? 'checked' : ''; ?>>
                    Enable Fapshi Payments
                </label>
            </div>
            
            <button type="submit">Update Settings</button>
        </form>
    </div>
    
    <div class="container">
        <h2>Transaction Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total_transactions']; ?></div>
                <div class="stat-label">Total Transactions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['completed_transactions']; ?></div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['pending_transactions']; ?></div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['failed_transactions']; ?></div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($stats['total_amount']); ?> FCFA</div>
                <div class="stat-label">Total Amount</div>
            </div>
        </div>
        
        <div class="recent-transactions">
            <h3>Recent Transactions</h3>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>User ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $recent_query = $rstate->query("SELECT * FROM tbl_wallet_transactions WHERE payment_method = 'fapshi' ORDER BY created_at DESC LIMIT 10");
                    while ($transaction = $recent_query->fetch_assoc()):
                    ?>
                    <tr>
                        <td><?php echo htmlspecialchars($transaction['transaction_id']); ?></td>
                        <td><?php echo $transaction['uid']; ?></td>
                        <td><?php echo number_format($transaction['amount']); ?> FCFA</td>
                        <td class="status-<?php echo $transaction['status']; ?>">
                            <?php echo ucfirst($transaction['status']); ?>
                        </td>
                        <td><?php echo date('M j, Y H:i', strtotime($transaction['created_at'])); ?></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>