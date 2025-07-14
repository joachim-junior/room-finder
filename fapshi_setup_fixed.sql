-- Fapshi Payment Integration Setup - FIXED VERSION
-- Run this SQL to create the necessary tables

-- Create payment settings table
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
INSERT INTO `tbl_payment_settings` (`payment_gateway`, `api_key`, `api_secret`, `environment`, `is_active`) 
VALUES (
  'fapshi',
  'your_fapshi_api_key_here',
  'your_fapshi_secret_key_here',
  'sandbox',
  'no'
) ON DUPLICATE KEY UPDATE
  `api_key` = VALUES(`api_key`),
  `api_secret` = VALUES(`api_secret`),
  `environment` = VALUES(`environment`),
  `is_active` = VALUES(`is_active`);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_uid_status` ON `tbl_wallet_transactions` (`uid`, `status`);
CREATE INDEX IF NOT EXISTS `idx_created_at` ON `tbl_wallet_transactions` (`created_at`);

-- Ensure wallet_report table exists
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

-- Add wallet column to tbl_user if it doesn't exist
SET @sql = (
  SELECT IF(
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = DATABASE() AND table_name = 'tbl_user' AND column_name = 'wallet') = 0,
    'ALTER TABLE `tbl_user` ADD COLUMN `wallet` decimal(10,2) DEFAULT 0.00 AFTER `email`',
    'SELECT "wallet column already exists" as info'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraints only if tbl_user table exists
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'ALTER TABLE `tbl_wallet_transactions` ADD CONSTRAINT `fk_wallet_transactions_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE',
  'SELECT "tbl_user table not found, skipping foreign key for wallet_transactions" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'ALTER TABLE `wallet_report` ADD CONSTRAINT `fk_wallet_report_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE',
  'SELECT "tbl_user table not found, skipping foreign key for wallet_report" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Fapshi setup completed successfully!' as Status;
