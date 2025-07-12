# SQL Files Upload Troubleshooting Guide

## Issues Identified

Your SQL file upload errors are caused by **MySQL database connectivity issues**. Here's a comprehensive analysis and solution:

### 1. **Root Cause Analysis**

**Primary Issue**: MySQL server is not running or properly configured.

**Evidence**:
- Database connection in `include/reconfig.php`:
  ```php
  $rstate = new mysqli("localhost", "root", "", "room-finder");
  ```
- Connection attempts fail with socket errors
- Application expects database "room-finder" to exist

### 2. **SQL Files Overview**

You have three important SQL setup files:

1. **`commission_system_setup.sql`** (4.9KB) - Commission system for property owners
2. **`fapshi_payout_setup.sql`** (5.5KB) - Fapshi payment payout system  
3. **`fapshi_setup.sql`** (3.3KB) - Fapshi payment integration

### 3. **Step-by-Step Solutions**

#### **Solution 1: Quick Docker MySQL Setup (Recommended)**

```bash
# Start MySQL container
docker run --name mysql-room-finder -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=room-finder -d mysql:8.0

# Wait for MySQL to be ready
sleep 30

# Import SQL files
mysql -h localhost -u root -proot room-finder < commission_system_setup.sql
mysql -h localhost -u root -proot room-finder < fapshi_setup.sql
mysql -h localhost -u root -proot room-finder < fapshi_payout_setup.sql
```

#### **Solution 2: Manual MySQL Setup**

```bash
# 1. Initialize MySQL (if not done)
sudo mysqld --initialize-insecure --user=mysql --basedir=/usr --datadir=/var/lib/mysql

# 2. Start MySQL daemon
sudo mysqld_safe --user=mysql &

# 3. Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS \`room-finder\`;"

# 4. Import SQL files
mysql -u root room-finder < commission_system_setup.sql
mysql -u root room-finder < fapshi_setup.sql
mysql -u root room-finder < fapshi_payout_setup.sql
```

#### **Solution 3: Update Database Configuration**

If you're using a different database setup, update `include/reconfig.php`:

```php
<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Update these credentials as needed
$host = "localhost";        // Your MySQL host
$username = "root";         // Your MySQL username  
$password = "your_password"; // Your MySQL password
$database = "room-finder";   // Your database name

$rstate = new mysqli($host, $username, $password, $database);

try {
    $rstate->set_charset("utf8mb4");
} catch(Exception $e) {
    error_log($e->getMessage());
    die("Database connection failed: " . $e->getMessage());
}

// Rest of your code...
?>
```

### 4. **SQL Files Content Summary**

#### **Commission System Setup** (`commission_system_setup.sql`)
- Creates `tbl_commission_settings` table
- Creates `tbl_commission_tracking` table  
- Creates `tbl_property_owner_payouts` table
- Creates `tbl_platform_earnings` table
- Adds wallet and user_type columns to `tbl_user`
- Sets up foreign key constraints and indexes

#### **Fapshi Setup** (`fapshi_setup.sql`)
- Creates `tbl_payment_settings` table
- Creates `tbl_wallet_transactions` table
- Ensures `wallet_report` table exists
- Adds wallet column to `tbl_user` table
- Sets up foreign key constraints

#### **Fapshi Payout Setup** (`fapshi_payout_setup.sql`)
- Creates `tbl_fapshi_payouts` table
- Creates `tbl_property_owner_payout_settings` table
- Creates `tbl_fapshi_payout_fees` table
- Creates helpful views for reporting
- Sets up indexes for performance

### 5. **Common Import Errors & Solutions**

#### **Error: "Table already exists"**
```bash
# Solution: Use IF NOT EXISTS or DROP tables first
mysql -u root room-finder -e "DROP TABLE IF EXISTS tbl_commission_settings;"
```

#### **Error: "Foreign key constraint fails"**
```bash
# Solution: Import in correct order (dependencies first)
# 1. First: fapshi_setup.sql
# 2. Second: commission_system_setup.sql  
# 3. Third: fapshi_payout_setup.sql
```

#### **Error: "Access denied"**
```bash
# Solution: Check MySQL user permissions
mysql -u root -e "GRANT ALL PRIVILEGES ON \`room-finder\`.* TO 'root'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
```

### 6. **Testing Database Connection**

After setup, test your PHP connection:

```php
<?php
// Test file: test_db_connection.php
require 'include/reconfig.php';

try {
    $result = $rstate->query("SELECT 'Database connected successfully!' as message");
    $row = $result->fetch_assoc();
    echo $row['message'];
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
```

### 7. **Backup & Recovery**

Before making changes:

```bash
# Backup existing data
mysqldump -u root -p room-finder > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore if needed
mysql -u root -p room-finder < backup_20240101_120000.sql
```

### 8. **Environment-Specific Notes**

**For Development**:
- Use Docker for consistent environment
- Enable MySQL error logging
- Set up proper user permissions

**For Production**:
- Use strong passwords
- Set up SSL connections
- Regular backups
- Monitor performance

### 9. **Troubleshooting Commands**

```bash
# Check MySQL status
sudo systemctl status mysql
# or
sudo service mysql status

# View MySQL logs
sudo tail -f /var/log/mysql/error.log

# Check MySQL socket
ls -la /var/run/mysqld/

# Test connection
mysql -u root -p -e "SELECT VERSION();"
```

### 10. **Next Steps**

1. **Set up MySQL** using Solution 1 (Docker) or Solution 2 (Manual)
2. **Import SQL files** in the correct order
3. **Test connection** with the PHP test script
4. **Update configuration** if using different credentials
5. **Test application** functionality

### 11. **Contact Support**

If you continue experiencing issues:
- Check MySQL error logs
- Verify file permissions
- Ensure correct database credentials
- Test with a simple MySQL client first

---

**Last Updated**: $(date)
**Files Involved**: `commission_system_setup.sql`, `fapshi_setup.sql`, `fapshi_payout_setup.sql`, `include/reconfig.php`