-- Fapshi Payment Integration Setup
-- Run this SQL to create the necessary tables

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

-- Ensure wallet_report table exists (it should already exist based on your current code)
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

-- Ensure tbl_user table has wallet field (it should already exist based on your current code)
ALTER TABLE `tbl_user` ADD COLUMN `wallet` decimal(10,2) DEFAULT 0.00 AFTER `email`;

-- Add foreign key constraints (optional but recommended)
ALTER TABLE `tbl_wallet_transactions` ADD CONSTRAINT `fk_wallet_transactions_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE;
ALTER TABLE `wallet_report` ADD CONSTRAINT `fk_wallet_report_user` FOREIGN KEY (`uid`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE;