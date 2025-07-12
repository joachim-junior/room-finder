-- Fapshi Property Owner Payout System Database Setup - FIXED VERSION
-- Run this SQL to create the necessary tables for property owner payouts

-- Table for storing Fapshi payout requests
CREATE TABLE IF NOT EXISTS `tbl_fapshi_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `preferred_payment_method` enum('mtn_momo','orange_money') DEFAULT 'mtn_momo',
  `default_mobile_number` varchar(20),
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

-- Insert commission settings only if table exists and use correct column names
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_commission_settings') > 0,
  'INSERT INTO `tbl_commission_settings` (`commission_rate`, `payout_timing`, `minimum_payout`, `auto_payout`) 
   VALUES (10.0, "immediate", 1000.0, 1) 
   ON DUPLICATE KEY UPDATE 
     `commission_rate` = VALUES(`commission_rate`),
     `payout_timing` = VALUES(`payout_timing`),
     `minimum_payout` = VALUES(`minimum_payout`),
     `auto_payout` = VALUES(`auto_payout`)',
  'SELECT "Commission settings table not found, skipping insert" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure Fapshi payment settings exist
INSERT INTO `tbl_payment_settings` (`payment_gateway`, `api_key`, `api_secret`, `environment`, `is_active`) 
VALUES ('fapshi', '', '', 'sandbox', 'no') 
ON DUPLICATE KEY UPDATE `payment_gateway` = VALUES(`payment_gateway`);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_property_earnings` ON `tbl_property_owner_payouts` (`property_owner_id`, `status`);
CREATE INDEX IF NOT EXISTS `idx_commission_tracking_owner` ON `tbl_commission_tracking` (`property_owner_id`, `status`);

-- Add foreign key constraints only if referenced tables exist
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'ALTER TABLE `tbl_fapshi_payouts` ADD CONSTRAINT `fk_fapshi_payout_owner` FOREIGN KEY (`property_owner_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE',
  'SELECT "tbl_user table not found, skipping foreign key constraint" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'ALTER TABLE `tbl_property_owner_payout_settings` ADD CONSTRAINT `fk_payout_settings_owner` FOREIGN KEY (`property_owner_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE',
  'SELECT "tbl_user table not found, skipping foreign key constraint" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create views only if all required tables exist
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_property_owner_payouts') > 0
  AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'CREATE OR REPLACE VIEW `v_property_owner_earnings_summary` AS
   SELECT 
       pop.property_owner_id,
       u.name as owner_name,
       u.mobile as owner_mobile,
       COUNT(pop.id) as total_bookings,
       SUM(pop.amount) as total_earnings,
       SUM(CASE WHEN pop.status = "pending" THEN pop.amount ELSE 0 END) as pending_earnings,
       SUM(CASE WHEN pop.status = "completed" THEN pop.amount ELSE 0 END) as completed_earnings,
       COALESCE(payout_stats.total_withdrawn, 0) as total_withdrawn,
       (SUM(pop.amount) - COALESCE(payout_stats.total_withdrawn, 0)) as available_balance,
       MAX(pop.created_at) as last_booking_date
   FROM `tbl_property_owner_payouts` pop
   LEFT JOIN `tbl_user` u ON pop.property_owner_id = u.id
   LEFT JOIN (
       SELECT 
           property_owner_id,
           SUM(payout_amount) as total_withdrawn
       FROM `tbl_fapshi_payouts`
       WHERE status = "completed"
       GROUP BY property_owner_id
   ) payout_stats ON pop.property_owner_id = payout_stats.property_owner_id
   GROUP BY pop.property_owner_id',
  'SELECT "Required tables not found, skipping view creation" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create payout details view
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_fapshi_payouts') > 0
  AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'CREATE OR REPLACE VIEW `v_fapshi_payout_details` AS
   SELECT 
       fp.id,
       fp.payout_id,
       fp.property_owner_id,
       u.name as owner_name,
       u.mobile as owner_mobile,
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
       COALESCE(fpf.net_amount, fp.payout_amount) as net_amount
   FROM `tbl_fapshi_payouts` fp
   LEFT JOIN `tbl_user` u ON fp.property_owner_id = u.id
   LEFT JOIN `tbl_fapshi_payout_fees` fpf ON fp.payout_id = fpf.payout_id',
  'SELECT "Required tables not found, skipping view creation" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Fapshi Property Owner Payout System setup completed successfully!' as Status;