<?php
/**
 * Database Connection Test Script
 * Use this to diagnose MySQL connection issues
 */

echo "<h2>Database Connection Test</h2>";

// Test 1: Basic connection parameters
echo "<h3>1. Testing Connection Parameters</h3>";
$host = "localhost";
$username = "root";
$password = "";
$database = "room-finder";

echo "Host: $host<br>";
echo "Username: $username<br>";
echo "Password: " . (empty($password) ? "(empty)" : "(set)") . "<br>";
echo "Database: $database<br><br>";

// Test 2: Check if MySQL extension is loaded
echo "<h3>2. Testing MySQL Extension</h3>";
if (extension_loaded('mysqli')) {
    echo "✓ MySQLi extension is loaded<br>";
} else {
    echo "✗ MySQLi extension is NOT loaded<br>";
    die("Please install php-mysqli extension");
}

// Test 3: Test connection without database
echo "<h3>3. Testing Connection (without database)</h3>";
$connection = @new mysqli($host, $username, $password);
if ($connection->connect_error) {
    echo "✗ Connection failed: " . $connection->connect_error . "<br>";
    echo "Error code: " . $connection->connect_errno . "<br>";
} else {
    echo "✓ Connection to MySQL server successful<br>";
    echo "MySQL version: " . $connection->server_info . "<br>";
}

// Test 4: Test connection with database
echo "<h3>4. Testing Connection (with database)</h3>";
$connection_with_db = @new mysqli($host, $username, $password, $database);
if ($connection_with_db->connect_error) {
    echo "✗ Connection to database failed: " . $connection_with_db->connect_error . "<br>";
    echo "Error code: " . $connection_with_db->connect_errno . "<br>";
    
    // Try to create database
    if ($connection && !$connection->connect_error) {
        echo "<br>Attempting to create database...<br>";
        if ($connection->query("CREATE DATABASE IF NOT EXISTS `$database`")) {
            echo "✓ Database '$database' created successfully<br>";
        } else {
            echo "✗ Failed to create database: " . $connection->error . "<br>";
        }
    }
} else {
    echo "✓ Connection to database '$database' successful<br>";
}

// Test 5: Test with existing configuration
echo "<h3>5. Testing with existing configuration</h3>";
if (file_exists('include/reconfig.php')) {
    echo "Found reconfig.php file<br>";
    try {
        include 'include/reconfig.php';
        if (isset($rstate)) {
            echo "✓ Configuration loaded successfully<br>";
            
            // Test a simple query
            try {
                $result = $rstate->query("SELECT 'Test successful!' as message");
                if ($result) {
                    $row = $result->fetch_assoc();
                    echo "✓ Query test: " . $row['message'] . "<br>";
                } else {
                    echo "✗ Query failed: " . $rstate->error . "<br>";
                }
            } catch (Exception $e) {
                echo "✗ Query exception: " . $e->getMessage() . "<br>";
            }
        } else {
            echo "✗ No \$rstate variable found in configuration<br>";
        }
    } catch (Exception $e) {
        echo "✗ Configuration error: " . $e->getMessage() . "<br>";
    }
} else {
    echo "✗ include/reconfig.php not found<br>";
}

// Test 6: Check required tables
echo "<h3>6. Checking Required Tables</h3>";
$required_tables = [
    'tbl_user', 'tbl_setting', 'tbl_prop',
    'tbl_commission_settings', 'tbl_commission_tracking',
    'tbl_fapshi_payouts', 'tbl_payment_settings'
];

if (isset($rstate) && !$rstate->connect_error) {
    foreach ($required_tables as $table) {
        $result = $rstate->query("SHOW TABLES LIKE '$table'");
        if ($result && $result->num_rows > 0) {
            echo "✓ Table '$table' exists<br>";
        } else {
            echo "✗ Table '$table' missing<br>";
        }
    }
} else {
    echo "Cannot check tables - no database connection<br>";
}

// Test 7: System information
echo "<h3>7. System Information</h3>";
echo "PHP version: " . phpversion() . "<br>";
echo "Operating system: " . php_uname() . "<br>";
echo "MySQL socket: " . ini_get('mysqli.default_socket') . "<br>";
echo "MySQL port: " . ini_get('mysqli.default_port') . "<br>";

// Test 8: Common solutions
echo "<h3>8. Common Solutions</h3>";
echo "<strong>If connection fails, try these solutions:</strong><br>";
echo "1. Start MySQL: <code>sudo systemctl start mysql</code><br>";
echo "2. Check MySQL status: <code>sudo systemctl status mysql</code><br>";
echo "3. Reset MySQL root password: <code>sudo mysql_secure_installation</code><br>";
echo "4. Create database manually: <code>mysql -u root -p -e \"CREATE DATABASE room-finder;\"</code><br>";
echo "5. Import SQL files: <code>mysql -u root -p room-finder < commission_system_setup.sql</code><br>";

// Clean up connections
if (isset($connection)) {
    $connection->close();
}
if (isset($connection_with_db)) {
    $connection_with_db->close();
}

echo "<hr>";
echo "<p><strong>Test completed.</strong> Check the results above to identify any issues.</p>";
?>