-- Fapshi Payment Gateway Database Update
-- This file contains all necessary database changes for Fapshi integration
-- Run this file to update your database schema

-- =====================================================
-- 1. UPDATE EXISTING PAYMENT SETTINGS TABLE
-- =====================================================

-- Check if webhook_secret column exists, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'tbl_payment_settings' 
     AND COLUMN_NAME = 'webhook_secret') > 0,
    'SELECT "webhook_secret column already exists" as message',
    'ALTER TABLE `tbl_payment_settings` ADD COLUMN `webhook_secret` varchar(255) DEFAULT NULL AFTER `api_secret`'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing Fapshi record if it exists, or create new one
INSERT INTO `tbl_payment_settings` (`payment_gateway`, `api_key`, `api_secret`, `webhook_secret`, `environment`, `is_active`, `created_at`, `updated_at`) 
VALUES ('fapshi', '', '', '', 'sandbox', 'no', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `webhook_secret` = VALUES(`webhook_secret`),
    `updated_at` = NOW();

-- =====================================================
-- 2. CREATE WALLET TRANSACTIONS TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS `tbl_wallet_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `fapshi_charge_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `error_message` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `uid` (`uid`),
  KEY `status` (`status`),
  KEY `fapshi_charge_id` (`fapshi_charge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. CREATE PAYOUTS TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS `tbl_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payout_id` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'XOF',
  `recipient_phone` varchar(20) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `fapshi_payout_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payout_id` (`payout_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. ENSURE PAYMENT SETTINGS TABLE EXISTS (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS `tbl_payment_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payment_gateway` varchar(50) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `api_secret` varchar(255) NOT NULL,
  `webhook_secret` varchar(255) DEFAULT NULL,
  `environment` enum('sandbox','production') DEFAULT 'sandbox',
  `is_active` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_gateway` (`payment_gateway`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Check if tables exist and have correct structure
SELECT 'tbl_payment_settings' as table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'tbl_payment_settings';

SELECT 'tbl_wallet_transactions' as table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'tbl_wallet_transactions';

SELECT 'tbl_payouts' as table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'tbl_payouts';

-- Check if webhook_secret column exists in payment_settings
SELECT 'webhook_secret_column' as check_name, 
       CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
  AND table_name = 'tbl_payment_settings' 
  AND column_name = 'webhook_secret';

-- =====================================================
-- 6. SAMPLE DATA FOR TESTING (optional)
-- =====================================================

-- Insert sample Fapshi configuration for testing
-- Uncomment the lines below if you want to add sample data

/*
INSERT INTO `tbl_payment_settings` (`payment_gateway`, `api_key`, `api_secret`, `webhook_secret`, `environment`, `is_active`) 
VALUES ('fapshi', 'your_api_key_here', 'your_api_secret_here', 'your_webhook_secret_here', 'sandbox', 'no')
ON DUPLICATE KEY UPDATE 
    `api_key` = VALUES(`api_key`),
    `api_secret` = VALUES(`api_secret`),
    `webhook_secret` = VALUES(`webhook_secret`),
    `updated_at` = NOW();
*/

-- =====================================================
-- 7. CLEANUP AND OPTIMIZATION
-- =====================================================

-- Optimize tables after changes
OPTIMIZE TABLE `tbl_payment_settings`;
OPTIMIZE TABLE `tbl_wallet_transactions`;
OPTIMIZE TABLE `tbl_payouts`;

-- =====================================================
-- 8. FINAL VERIFICATION
-- =====================================================

-- Show final table structure
SELECT 'FINAL VERIFICATION' as message;
SELECT 'tbl_payment_settings columns:' as info;
DESCRIBE `tbl_payment_settings`;

SELECT 'tbl_wallet_transactions columns:' as info;
DESCRIBE `tbl_wallet_transactions`;

SELECT 'tbl_payouts columns:' as info;
DESCRIBE `tbl_payouts`;

-- =====================================================
-- NOTES FOR ADMINISTRATOR
-- =====================================================

/*
IMPORTANT NOTES:

1. BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT
   - Always create a backup before making database changes
   - Test in a development environment first

2. WEBHOOK SECRET CONFIGURATION
   - The webhook_secret is configured separately in your Fapshi dashboard
   - This is different from your API key
   - Configure the webhook secret in your Fapshi dashboard settings

3. API CREDENTIALS
   - API Key and API Secret are used for API authentication
   - These are different from the webhook secret
   - Configure these in the admin panel

4. SECURITY CONSIDERATIONS
   - Store API credentials securely
   - Use HTTPS for webhook endpoints
   - Regularly rotate credentials
   - Monitor webhook logs for security

5. TESTING
   - Test in sandbox mode first
   - Use small amounts for testing
   - Verify webhook signature verification
   - Test all endpoints before going live

6. TROUBLESHOOTING
   - Check database permissions
   - Verify table structure
   - Monitor error logs
   - Test webhook endpoint accessibility

7. POST-INSTALLATION STEPS
   - Configure API credentials in admin panel
   - Set up webhook URL in Fapshi dashboard
   - Test all endpoints using test suite
   - Monitor transactions and webhooks
*/ 