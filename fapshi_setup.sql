-- Fapshi Payment Integration Setup
-- Run this SQL to create the necessary tables for the property booking system

-- Create payment settings table
CREATE TABLE IF NOT EXISTS `tbl_payment_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gateway` varchar(50) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `secret_key` varchar(255) NOT NULL,
  `sandbox_mode` tinyint(1) DEFAULT 1,
  `callback_url` varchar(255) DEFAULT NULL,
  `return_url` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gateway` (`gateway`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create wallet transactions table
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

-- Insert default Fapshi configuration (you need to update these values)
INSERT INTO `tbl_payment_settings` (`gateway`, `api_key`, `secret_key`, `sandbox_mode`, `callback_url`, `return_url`, `status`) 
VALUES (
  'fapshi',
  'your_fapshi_api_key_here',
  'your_fapshi_secret_key_here',
  1,
  'https://yoursite.com/user_api/fapshi_webhook.php',
  'https://yoursite.com/wallet_success.php',
  1
) ON DUPLICATE KEY UPDATE
  `api_key` = VALUES(`api_key`),
  `secret_key` = VALUES(`secret_key`),
  `sandbox_mode` = VALUES(`sandbox_mode`),
  `callback_url` = VALUES(`callback_url`),
  `return_url` = VALUES(`return_url`),
  `status` = VALUES(`status`);

-- Add indexes for better performance
ALTER TABLE `tbl_wallet_transactions` ADD INDEX `idx_uid_status` (`uid`, `status`);
ALTER TABLE `tbl_wallet_transactions` ADD INDEX `idx_created_at` (`created_at`);

-- Ensure wallet_report table exists and is compatible with existing structure
CREATE TABLE IF NOT EXISTS `wallet_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `message` text NOT NULL,
  `status` enum('Credit','Debit') NOT NULL,
  `amt` decimal(10,2) NOT NULL,
  `tdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `status` (`status`),
  KEY `tdate` (`tdate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Check if tbl_user table exists and add wallet field if needed
-- This assumes the user table exists in your property database
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'tbl_user' AND COLUMN_NAME = 'wallet') > 0,
    'SELECT "Wallet column already exists in tbl_user"',
    'ALTER TABLE `tbl_user` ADD COLUMN `wallet` decimal(10,2) DEFAULT 0.00'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update tbl_book table to include Fapshi payment integration fields if not exists
ALTER TABLE `tbl_book` 
ADD COLUMN IF NOT EXISTS `fapshi_transaction_id` varchar(100) DEFAULT NULL AFTER `transaction_id`,
ADD COLUMN IF NOT EXISTS `fapshi_charge_id` varchar(100) DEFAULT NULL AFTER `fapshi_transaction_id`,
ADD COLUMN IF NOT EXISTS `payment_gateway` varchar(50) DEFAULT NULL AFTER `fapshi_charge_id`,
ADD COLUMN IF NOT EXISTS `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending' AFTER `payment_gateway`;

-- Add indexes to tbl_book for Fapshi integration
ALTER TABLE `tbl_book` ADD INDEX IF NOT EXISTS `idx_fapshi_transaction` (`fapshi_transaction_id`);
ALTER TABLE `tbl_book` ADD INDEX IF NOT EXISTS `idx_fapshi_charge` (`fapshi_charge_id`);
ALTER TABLE `tbl_book` ADD INDEX IF NOT EXISTS `idx_payment_status` (`payment_status`);

-- Create booking payment tracking table
CREATE TABLE IF NOT EXISTS `tbl_booking_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `fapshi_charge_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `gateway_response` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `uid` (`uid`),
  KEY `transaction_id` (`transaction_id`),
  KEY `fapshi_charge_id` (`fapshi_charge_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add foreign key constraints (optional but recommended)
-- Note: Uncomment these if your tables support foreign keys
-- ALTER TABLE `tbl_wallet_transactions` ADD CONSTRAINT `fk_wallet_transactions_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `wallet_report` ADD CONSTRAINT `fk_wallet_report_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `tbl_booking_payments` ADD CONSTRAINT `fk_booking_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `tbl_book`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `tbl_booking_payments` ADD CONSTRAINT `fk_booking_payments_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE;

SELECT 'Fapshi Payment Integration setup completed successfully!' as Status;