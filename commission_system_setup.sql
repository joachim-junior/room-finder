-- Commission System Setup for Property Booking Platform
-- Run this SQL to create commission-related tables and settings

-- Create commission settings table
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
  `payout_timing` = VALUES(`payout_timing`),
  `minimum_payout` = VALUES(`minimum_payout`),
  `auto_payout` = VALUES(`auto_payout`);

-- Create commission tracking table compatible with existing tbl_book structure
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

-- Update existing payout_setting table to be compatible with commission system
ALTER TABLE `payout_setting` 
ADD COLUMN IF NOT EXISTS `commission_tracking_id` int(11) DEFAULT NULL AFTER `id`,
ADD COLUMN IF NOT EXISTS `booking_id` int(11) DEFAULT NULL AFTER `commission_tracking_id`,
ADD COLUMN IF NOT EXISTS `commission_amount` decimal(10,2) DEFAULT 0.00 AFTER `amt`,
ADD COLUMN IF NOT EXISTS `net_payout` decimal(10,2) DEFAULT 0.00 AFTER `commission_amount`;

-- Add indexes to existing payout_setting table
ALTER TABLE `payout_setting` ADD INDEX IF NOT EXISTS `idx_commission_tracking` (`commission_tracking_id`);
ALTER TABLE `payout_setting` ADD INDEX IF NOT EXISTS `idx_booking_id` (`booking_id`);
ALTER TABLE `payout_setting` ADD INDEX IF NOT EXISTS `idx_owner_status` (`owner_id`, `status`);

-- Create property owner earnings summary table
CREATE TABLE IF NOT EXISTS `tbl_property_owner_earnings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) NOT NULL,
  `total_bookings` int(11) DEFAULT 0,
  `total_earnings` decimal(12,2) DEFAULT 0.00,
  `total_commission` decimal(12,2) DEFAULT 0.00,
  `total_payouts` decimal(12,2) DEFAULT 0.00,
  `pending_amount` decimal(12,2) DEFAULT 0.00,
  `last_booking_date` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

-- Update tbl_book table to include commission tracking
ALTER TABLE `tbl_book` 
ADD COLUMN IF NOT EXISTS `commission_calculated` tinyint(1) DEFAULT 0 AFTER `is_rate`,
ADD COLUMN IF NOT EXISTS `commission_amount` decimal(10,2) DEFAULT 0.00 AFTER `commission_calculated`,
ADD COLUMN IF NOT EXISTS `owner_payout` decimal(10,2) DEFAULT 0.00 AFTER `commission_amount`;

-- Add indexes to tbl_book for commission tracking
ALTER TABLE `tbl_book` ADD INDEX IF NOT EXISTS `idx_commission_calculated` (`commission_calculated`);
ALTER TABLE `tbl_book` ADD INDEX IF NOT EXISTS `idx_book_status_commission` (`book_status`, `commission_calculated`);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_commission_date` ON `tbl_commission_tracking` (`created_at`);
CREATE INDEX IF NOT EXISTS `idx_owner_earnings` ON `tbl_property_owner_earnings` (`owner_id`);

-- Create a view for commission analytics compatible with existing structure
CREATE OR REPLACE VIEW `v_commission_analytics` AS
SELECT 
    DATE(ct.created_at) as booking_date,
    COUNT(ct.id) as total_bookings,
    SUM(ct.booking_amount) as total_booking_amount,
    SUM(ct.commission_amount) as total_commission,
    SUM(ct.owner_payout) as total_owner_payouts,
    AVG(ct.commission_rate) as avg_commission_rate
FROM tbl_commission_tracking ct
GROUP BY DATE(ct.created_at)
ORDER BY booking_date DESC;

-- Create a view for property owner earnings summary
CREATE OR REPLACE VIEW `v_property_owner_earnings` AS
SELECT 
    ps.owner_id,
    COUNT(DISTINCT ps.id) as total_payout_requests,
    SUM(CASE WHEN ps.status = 'pending' THEN ps.amt ELSE 0 END) as pending_amount,
    SUM(CASE WHEN ps.status = 'completed' THEN ps.amt ELSE 0 END) as completed_amount,
    SUM(ps.amt) as total_requested,
    MAX(ps.r_date) as last_request_date,
    COALESCE(ct_summary.total_earnings, 0) as total_earnings,
    COALESCE(ct_summary.total_commission, 0) as total_commission_deducted
FROM payout_setting ps
LEFT JOIN (
    SELECT 
        property_owner_id,
        SUM(booking_amount) as total_earnings,
        SUM(commission_amount) as total_commission
    FROM tbl_commission_tracking
    GROUP BY property_owner_id
) ct_summary ON ps.owner_id = ct_summary.property_owner_id
GROUP BY ps.owner_id;

-- Create trigger to automatically calculate commission when booking is confirmed
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS `tr_calculate_commission_after_booking` 
AFTER UPDATE ON `tbl_book`
FOR EACH ROW
BEGIN
    DECLARE commission_rate_val DECIMAL(5,2);
    DECLARE commission_amt DECIMAL(10,2);
    DECLARE owner_payout_amt DECIMAL(10,2);
    
    -- Only calculate commission when booking status changes to confirmed and commission not yet calculated
    IF NEW.book_status = 'confirmed' AND OLD.book_status != 'confirmed' AND NEW.commission_calculated = 0 THEN
        -- Get current commission rate
        SELECT commission_rate INTO commission_rate_val FROM tbl_commission_settings LIMIT 1;
        
        -- Calculate commission and owner payout
        SET commission_amt = (NEW.total * commission_rate_val / 100);
        SET owner_payout_amt = (NEW.total - commission_amt);
        
        -- Update booking with commission info
        UPDATE tbl_book SET 
            commission_calculated = 1,
            commission_amount = commission_amt,
            owner_payout = owner_payout_amt
        WHERE id = NEW.id;
        
        -- Insert into commission tracking
        INSERT INTO tbl_commission_tracking (
            booking_id, property_owner_id, booking_amount, 
            commission_rate, commission_amount, owner_payout, status
        ) VALUES (
            NEW.id, NEW.uid, NEW.total, 
            commission_rate_val, commission_amt, owner_payout_amt, 'pending'
        );
    END IF;
END$$
DELIMITER ;

-- Add foreign key constraints (optional but recommended)
-- Note: Uncomment these if your tables support foreign keys
-- ALTER TABLE `tbl_commission_tracking` 
--   ADD CONSTRAINT `fk_commission_booking` FOREIGN KEY (`booking_id`) REFERENCES `tbl_book`(`id`) ON DELETE CASCADE;

-- ALTER TABLE `payout_setting` 
--   ADD CONSTRAINT `fk_payout_commission` FOREIGN KEY (`commission_tracking_id`) REFERENCES `tbl_commission_tracking`(`id`) ON DELETE SET NULL;

SELECT 'Commission System setup completed successfully!' as Status;