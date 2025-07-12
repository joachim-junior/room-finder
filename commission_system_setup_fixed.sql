-- Commission System Setup - FIXED VERSION
-- Run this SQL to create commission-related tables and settings

-- Add commission settings table
CREATE TABLE IF NOT EXISTS `tbl_commission_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 10.00,
  `payout_timing` enum('immediate','after_checkin','manual') DEFAULT 'immediate',
  `minimum_payout` decimal(10,2) DEFAULT 100.00,
  `auto_payout` tinyint(1) DEFAULT 1,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default commission settings
INSERT INTO `tbl_commission_settings` (`commission_rate`, `payout_timing`, `minimum_payout`, `auto_payout`) 
VALUES (10.00, 'immediate', 100.00, 1)
ON DUPLICATE KEY UPDATE 
  `commission_rate` = VALUES(`commission_rate`),
  `payout_timing` = VALUES(`payout_timing`);

-- Create commission tracking table
CREATE TABLE IF NOT EXISTS `tbl_commission_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `property_owner_id` int(11) NOT NULL,
  `booking_amount` decimal(10,2) NOT NULL,
  `commission_rate` decimal(5,2) NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `owner_payout` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `payout_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `property_owner_id` (`property_owner_id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create property owner payouts table
CREATE TABLE IF NOT EXISTS `tbl_property_owner_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_owner_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `commission_tracking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payout_method` varchar(50) DEFAULT 'wallet',
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `transaction_reference` varchar(100) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_owner_id` (`property_owner_id`),
  KEY `booking_id` (`booking_id`),
  KEY `commission_tracking_id` (`commission_tracking_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add wallet field to tbl_user if it doesn't exist
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

-- Add user_type field to tbl_user if it doesn't exist
SET @sql = (
  SELECT IF(
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = DATABASE() AND table_name = 'tbl_user' AND column_name = 'user_type') = 0,
    'ALTER TABLE `tbl_user` ADD COLUMN `user_type` enum("customer","property_owner","admin") DEFAULT "customer" AFTER `wallet`',
    'SELECT "user_type column already exists" as info'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create platform earnings summary table
CREATE TABLE IF NOT EXISTS `tbl_platform_earnings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `total_bookings` int(11) DEFAULT 0,
  `total_booking_amount` decimal(12,2) DEFAULT 0.00,
  `total_commission` decimal(12,2) DEFAULT 0.00,
  `total_payouts` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add foreign key constraints only if referenced tables exist
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_book') > 0,
  'ALTER TABLE `tbl_commission_tracking` ADD CONSTRAINT `fk_commission_booking` FOREIGN KEY (`booking_id`) REFERENCES `tbl_book`(`id`) ON DELETE CASCADE',
  'SELECT "tbl_book table not found, skipping foreign key constraint" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'ALTER TABLE `tbl_commission_tracking` ADD CONSTRAINT `fk_commission_owner` FOREIGN KEY (`property_owner_id`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE',
  'SELECT "tbl_user table not found, skipping foreign key constraint" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_user') > 0,
  'ALTER TABLE `tbl_property_owner_payouts` ADD CONSTRAINT `fk_payout_owner` FOREIGN KEY (`property_owner_id`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE',
  'SELECT "tbl_user table not found, skipping foreign key constraint" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_book') > 0,
  'ALTER TABLE `tbl_property_owner_payouts` ADD CONSTRAINT `fk_payout_booking` FOREIGN KEY (`booking_id`) REFERENCES `tbl_book`(`id`) ON DELETE CASCADE',
  'SELECT "tbl_book table not found, skipping foreign key constraint" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add constraint between commission tables
ALTER TABLE `tbl_property_owner_payouts` ADD CONSTRAINT `fk_payout_commission` FOREIGN KEY (`commission_tracking_id`) REFERENCES `tbl_commission_tracking`(`id`) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_commission_date` ON `tbl_commission_tracking` (`created_at`);
CREATE INDEX IF NOT EXISTS `idx_payout_date` ON `tbl_property_owner_payouts` (`created_at`);
CREATE INDEX IF NOT EXISTS `idx_owner_payouts` ON `tbl_property_owner_payouts` (`property_owner_id`, `status`);

-- Create a view for commission analytics (only if all tables exist)
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'tbl_commission_tracking') > 0,
  'CREATE OR REPLACE VIEW `v_commission_analytics` AS
   SELECT 
       DATE(ct.created_at) as booking_date,
       COUNT(ct.id) as total_bookings,
       SUM(ct.booking_amount) as total_booking_amount,
       SUM(ct.commission_amount) as total_commission,
       SUM(ct.owner_payout) as total_owner_payouts,
       AVG(ct.commission_rate) as avg_commission_rate
   FROM tbl_commission_tracking ct
   GROUP BY DATE(ct.created_at)
   ORDER BY booking_date DESC',
  'SELECT "Commission tracking table not found, skipping view creation" as warning'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Commission System setup completed successfully!' as Status;