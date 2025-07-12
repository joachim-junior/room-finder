-- Fapshi Property Owner Payout System Database Setup
-- Run this SQL to create the necessary tables for property owner payouts integrated with existing payout_setting

-- Update existing payout_setting table to support Fapshi integration
ALTER TABLE `payout_setting` 
ADD COLUMN IF NOT EXISTS `fapshi_transaction_id` varchar(255) DEFAULT NULL AFTER `paypal_id`,
ADD COLUMN IF NOT EXISTS `fapshi_charge_id` varchar(255) DEFAULT NULL AFTER `fapshi_transaction_id`,
ADD COLUMN IF NOT EXISTS `fapshi_response` text AFTER `fapshi_charge_id`,
ADD COLUMN IF NOT EXISTS `processing_fee` decimal(10,2) DEFAULT 0.00 AFTER `fapshi_response`,
ADD COLUMN IF NOT EXISTS `net_amount` decimal(10,2) DEFAULT 0.00 AFTER `processing_fee`;

-- Update r_type enum to include Fapshi payment methods
ALTER TABLE `payout_setting` 
MODIFY COLUMN `r_type` enum('UPI','BANK Transfer','Paypal','MTN_MOMO','Orange_Money','Fapshi') 
CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

-- Add indexes to existing payout_setting table for Fapshi integration
ALTER TABLE `payout_setting` ADD INDEX IF NOT EXISTS `idx_fapshi_transaction` (`fapshi_transaction_id`);
ALTER TABLE `payout_setting` ADD INDEX IF NOT EXISTS `idx_fapshi_charge` (`fapshi_charge_id`);
ALTER TABLE `payout_setting` ADD INDEX IF NOT EXISTS `idx_status_date` (`status`, `r_date`);

-- Table for storing detailed Fapshi payout requests
CREATE TABLE IF NOT EXISTS `tbl_fapshi_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payout_setting_id` int(11) NOT NULL,
  `payout_id` varchar(100) NOT NULL UNIQUE,
  `property_owner_id` int(11) NOT NULL,
  `payout_amount` decimal(10,2) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `payment_method` enum('mtn_momo','orange_money') NOT NULL,
  `description` text,
  `status` enum('pending','processing','completed','failed','cancelled') DEFAULT 'pending',
  `fapshi_transaction_id` varchar(255) DEFAULT NULL,
  `fapshi_response` text,
  `error_message` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payout_setting_id` (`payout_setting_id`),
  KEY `idx_property_owner_id` (`property_owner_id`),
  KEY `idx_payout_id` (`payout_id`),
  KEY `idx_fapshi_transaction_id` (`fapshi_transaction_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for storing property owner payout settings/preferences
CREATE TABLE IF NOT EXISTS `tbl_property_owner_payout_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_owner_id` int(11) NOT NULL UNIQUE,
  `preferred_payment_method` enum('UPI','BANK Transfer','Paypal','MTN_MOMO','Orange_Money') DEFAULT 'MTN_MOMO',
  `default_mobile_number` varchar(20),
  `default_bank_name` varchar(255),
  `default_acc_number` varchar(255),
  `default_acc_name` varchar(255),
  `default_ifsc_code` varchar(255),
  `default_upi_id` varchar(255),
  `default_paypal_id` varchar(255),
  `auto_payout_enabled` tinyint(1) DEFAULT 0,
  `auto_payout_threshold` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_property_owner_id` (`property_owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for tracking payout fees and charges
CREATE TABLE IF NOT EXISTS `tbl_fapshi_payout_fees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payout_id` varchar(100) NOT NULL,
  `payout_amount` decimal(10,2) NOT NULL,
  `fee_amount` decimal(10,2) DEFAULT 0.00,
  `fee_percentage` decimal(5,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payout_id` (`payout_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Update tbl_payment_settings to include Fapshi configuration if not exists
INSERT INTO `tbl_payment_settings` (`gateway`, `api_key`, `secret_key`, `sandbox_mode`, `callback_url`, `return_url`, `status`) 
VALUES (
  'fapshi_payout',
  'your_fapshi_payout_api_key_here',
  'your_fapshi_payout_secret_key_here',
  1,
  'https://yoursite.com/admin_api/fapshi_payout_webhook.php',
  'https://yoursite.com/admin/payout_success.php',
  1
) ON DUPLICATE KEY UPDATE
  `gateway` = VALUES(`gateway`);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_property_earnings` ON `payout_setting` (`owner_id`, `status`);
CREATE INDEX IF NOT EXISTS `idx_payout_date_range` ON `payout_setting` (`r_date`, `status`);

-- Create a view for easy property owner earnings summary compatible with existing structure
CREATE OR REPLACE VIEW `v_property_owner_earnings_summary` AS
SELECT 
    ps.owner_id as property_owner_id,
    COUNT(ps.id) as total_payout_requests,
    SUM(ps.amt) as total_requested_amount,
    SUM(CASE WHEN ps.status = 'pending' THEN ps.amt ELSE 0 END) as pending_amount,
    SUM(CASE WHEN ps.status = 'completed' THEN ps.amt ELSE 0 END) as completed_amount,
    SUM(CASE WHEN ps.status = 'rejected' THEN ps.amt ELSE 0 END) as rejected_amount,
    COALESCE(fapshi_stats.total_fapshi_payouts, 0) as total_fapshi_payouts,
    COALESCE(fapshi_stats.successful_fapshi_payouts, 0) as successful_fapshi_payouts,
    MAX(ps.r_date) as last_request_date,
    COALESCE(payout_prefs.preferred_payment_method, 'MTN_MOMO') as preferred_payment_method,
    COALESCE(payout_prefs.default_mobile_number, '') as default_mobile_number
FROM `payout_setting` ps
LEFT JOIN `tbl_property_owner_payout_settings` payout_prefs ON ps.owner_id = payout_prefs.property_owner_id
LEFT JOIN (
    SELECT 
        property_owner_id,
        COUNT(*) as total_fapshi_payouts,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_fapshi_payouts
    FROM `tbl_fapshi_payouts`
    GROUP BY property_owner_id
) fapshi_stats ON ps.owner_id = fapshi_stats.property_owner_id
GROUP BY ps.owner_id;

-- Create a view for Fapshi payout transaction details
CREATE OR REPLACE VIEW `v_fapshi_payout_details` AS
SELECT 
    fp.id,
    fp.payout_id,
    fp.property_owner_id,
    fp.payout_amount,
    fp.mobile_number as payout_mobile,
    fp.payment_method,
    fp.description,
    fp.status,
    fp.fapshi_transaction_id,
    fp.error_message,
    fp.created_at,
    fp.updated_at,
    COALESCE(fpf.fee_amount, 0) as fee_amount,
    COALESCE(fpf.net_amount, fp.payout_amount) as net_amount,
    ps.r_date as original_request_date,
    ps.status as original_status
FROM `tbl_fapshi_payouts` fp
LEFT JOIN `tbl_fapshi_payout_fees` fpf ON fp.payout_id = fpf.payout_id
LEFT JOIN `payout_setting` ps ON fp.payout_setting_id = ps.id;

-- Create a view for payout analytics
CREATE OR REPLACE VIEW `v_payout_analytics` AS
SELECT 
    DATE(ps.r_date) as payout_date,
    ps.r_type as payment_method,
    COUNT(ps.id) as total_requests,
    SUM(ps.amt) as total_amount,
    SUM(CASE WHEN ps.status = 'completed' THEN ps.amt ELSE 0 END) as completed_amount,
    SUM(CASE WHEN ps.status = 'pending' THEN ps.amt ELSE 0 END) as pending_amount,
    SUM(CASE WHEN ps.status = 'rejected' THEN ps.amt ELSE 0 END) as rejected_amount,
    AVG(ps.amt) as avg_payout_amount
FROM `payout_setting` ps
GROUP BY DATE(ps.r_date), ps.r_type
ORDER BY payout_date DESC;

-- Create trigger to sync Fapshi payout status with main payout_setting table
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS `tr_sync_fapshi_payout_status` 
AFTER UPDATE ON `tbl_fapshi_payouts`
FOR EACH ROW
BEGIN
    -- Update the main payout_setting table when Fapshi payout status changes
    IF NEW.status != OLD.status THEN
        UPDATE payout_setting SET 
            status = CASE 
                WHEN NEW.status = 'completed' THEN 'completed'
                WHEN NEW.status = 'failed' THEN 'rejected'
                WHEN NEW.status = 'cancelled' THEN 'cancelled'
                ELSE 'pending'
            END,
            fapshi_transaction_id = NEW.fapshi_transaction_id,
            fapshi_response = NEW.fapshi_response
        WHERE id = NEW.payout_setting_id;
    END IF;
END$$
DELIMITER ;

-- Add foreign key constraints (optional but recommended)
-- Note: Uncomment these if your tables support foreign keys
-- ALTER TABLE `tbl_fapshi_payouts` ADD CONSTRAINT `fk_fapshi_payout_setting` 
--   FOREIGN KEY (`payout_setting_id`) REFERENCES `payout_setting` (`id`) ON DELETE CASCADE;

-- ALTER TABLE `tbl_property_owner_payout_settings` ADD CONSTRAINT `fk_payout_settings_owner` 
--   FOREIGN KEY (`property_owner_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE;

SELECT 'Fapshi Property Owner Payout System setup completed successfully!' as Status;