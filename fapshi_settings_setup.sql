-- Fapshi Settings Setup
-- Run this SQL to create the Fapshi settings table

-- Create Fapshi settings table
CREATE TABLE IF NOT EXISTS `tbl_fapshi_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fapshi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `merchant_id` varchar(100) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `api_url` varchar(255) NOT NULL DEFAULT 'https://api.fapshi.com',
  `webhook_url` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 2.50,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default Fapshi settings
INSERT INTO `tbl_fapshi_settings` (`fapshi_enabled`, `merchant_id`, `secret_key`, `api_url`, `webhook_url`, `commission_rate`) 
VALUES (0, '', '', 'https://api.fapshi.com', '', 2.50)
ON DUPLICATE KEY UPDATE 
  `fapshi_enabled` = VALUES(`fapshi_enabled`),
  `merchant_id` = VALUES(`merchant_id`),
  `secret_key` = VALUES(`secret_key`),
  `api_url` = VALUES(`api_url`),
  `webhook_url` = VALUES(`webhook_url`),
  `commission_rate` = VALUES(`commission_rate`);

-- Ensure wallet transactions table has the required columns
ALTER TABLE `tbl_wallet_transactions` 
ADD COLUMN IF NOT EXISTS `user_id` int(11) NOT NULL AFTER `id`,
ADD COLUMN IF NOT EXISTS `transaction_type` enum('deposit','booking','refund','withdrawal') DEFAULT 'deposit' AFTER `amount`,
ADD COLUMN IF NOT EXISTS `payment_gateway` varchar(50) DEFAULT NULL AFTER `payment_method`,
ADD COLUMN IF NOT EXISTS `external_transaction_id` varchar(100) DEFAULT NULL AFTER `fapshi_charge_id`,
ADD COLUMN IF NOT EXISTS `description` text DEFAULT NULL AFTER `error_message`;

-- Update existing records to set user_id if it's NULL
UPDATE `tbl_wallet_transactions` SET `user_id` = `uid` WHERE `user_id` IS NULL OR `user_id` = 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_fapshi_enabled` ON `tbl_fapshi_settings` (`fapshi_enabled`);
CREATE INDEX IF NOT EXISTS `idx_wallet_payment_gateway` ON `tbl_wallet_transactions` (`payment_gateway`);

SELECT 'Fapshi Settings setup completed successfully!' as Status; 