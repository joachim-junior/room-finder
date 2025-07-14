-- Wallet Settings Setup
-- Run this SQL to create the wallet settings table

-- Create wallet settings table
CREATE TABLE IF NOT EXISTS `tbl_wallet_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `min_deposit` decimal(10,2) NOT NULL DEFAULT 10.00,
  `max_deposit` decimal(10,2) NOT NULL DEFAULT 10000.00,
  `wallet_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `auto_approve_deposits` tinyint(1) NOT NULL DEFAULT 0,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 2.50,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default wallet settings
INSERT INTO `tbl_wallet_settings` (`min_deposit`, `max_deposit`, `wallet_enabled`, `auto_approve_deposits`, `commission_rate`) 
VALUES (10.00, 10000.00, 1, 0, 2.50)
ON DUPLICATE KEY UPDATE 
  `min_deposit` = VALUES(`min_deposit`),
  `max_deposit` = VALUES(`max_deposit`),
  `wallet_enabled` = VALUES(`wallet_enabled`),
  `auto_approve_deposits` = VALUES(`auto_approve_deposits`),
  `commission_rate` = VALUES(`commission_rate`);

-- Update wallet transactions table to include missing columns
ALTER TABLE `tbl_wallet_transactions` 
ADD COLUMN IF NOT EXISTS `user_id` int(11) NOT NULL AFTER `id`,
ADD COLUMN IF NOT EXISTS `transaction_type` enum('deposit','booking','refund','withdrawal') DEFAULT 'deposit' AFTER `amount`,
ADD COLUMN IF NOT EXISTS `payment_gateway` varchar(50) DEFAULT NULL AFTER `payment_method`,
ADD COLUMN IF NOT EXISTS `external_transaction_id` varchar(100) DEFAULT NULL AFTER `fapshi_charge_id`,
ADD COLUMN IF NOT EXISTS `description` text DEFAULT NULL AFTER `error_message`;

-- Update existing records to set user_id if it's NULL
UPDATE `tbl_wallet_transactions` SET `user_id` = `uid` WHERE `user_id` IS NULL OR `user_id` = 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_wallet_user_id` ON `tbl_wallet_transactions` (`user_id`);
CREATE INDEX IF NOT EXISTS `idx_wallet_transaction_type` ON `tbl_wallet_transactions` (`transaction_type`);
CREATE INDEX IF NOT EXISTS `idx_wallet_payment_gateway` ON `tbl_wallet_transactions` (`payment_gateway`);

SELECT 'Wallet Settings setup completed successfully!' as Status; 