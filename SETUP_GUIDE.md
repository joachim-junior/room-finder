# Room Finder Dashboard Setup Guide

## Issues Fixed

### 1. Missing Files Created

The following files were missing and have been created:

- `admin_wallet_settings.php` - Wallet system configuration
- `admin_commission_reports.php` - Commission tracking and reports
- `admin_fapshi_settings.php` - Fapshi payment gateway configuration

### 2. Database Tables Required

The new files require additional database tables. Run the following SQL files in order:

#### Step 1: Run Commission System Setup

```sql
-- Run this first
source commission_system_setup_fixed.sql
```

#### Step 2: Run Fapshi Payment Setup

```sql
-- Run this second
source fapshi_setup_fixed.sql
```

#### Step 3: Run Wallet Settings Setup

```sql
-- Run this third
source wallet_settings_setup.sql
```

#### Step 4: Run Fapshi Settings Setup

```sql
-- Run this fourth
source fapshi_settings_setup.sql
```

### 3. Syntax Verification

All PHP files have been syntax-checked and are error-free:

- ✅ `dashboard.php` - No syntax errors
- ✅ `admin_wallet_transactions.php` - No syntax errors
- ✅ `admin_wallet_settings.php` - No syntax errors
- ✅ `admin_commission_reports.php` - No syntax errors
- ✅ `admin_fapshi_settings.php` - No syntax errors

## Database Schema Overview

### New Tables Created:

1. **tbl_wallet_settings** - Wallet system configuration

   - min_deposit, max_deposit
   - wallet_enabled, auto_approve_deposits
   - commission_rate

2. **tbl_fapshi_settings** - Fapshi payment gateway settings

   - fapshi_enabled, merchant_id, secret_key
   - api_url, webhook_url, commission_rate

3. **tbl_commission_tracking** - Commission tracking

   - booking_id, property_owner_id
   - commission_amount, status

4. **tbl_property_owner_payouts** - Property owner payouts
   - property_owner_id, booking_id
   - amount, status, payout_method

### Updated Tables:

1. **tbl_wallet_transactions** - Enhanced with new columns:

   - user_id, transaction_type
   - payment_gateway, external_transaction_id
   - description

2. **tbl_user** - Enhanced with:
   - wallet column (decimal)
   - user_type column (enum)

## File Structure

```
dashboard/
├── admin_wallet_settings.php      # ✅ Created
├── admin_commission_reports.php   # ✅ Created
├── admin_fapshi_settings.php      # ✅ Created
├── admin_wallet_transactions.php  # ✅ Exists
├── wallet_settings_setup.sql      # ✅ Created
├── fapshi_settings_setup.sql      # ✅ Created
└── SETUP_GUIDE.md                # ✅ This file
```

## Navigation Menu

The sidebar navigation (`include/sidebar.php`) includes:

### Wallet Section:

- Wallet Settings (`admin_wallet_settings.php`)
- Transaction History (`admin_wallet_transactions.php`)
- Fapshi Configuration (`admin_fapshi_settings.php`)

### Commissions Section:

- Commission Settings (`admin_commission_settings.php`)
- Commission Reports (`admin_commission_reports.php`) - Commented out
- Property Owner Payouts (`admin_property_owner_payouts.php`)

## Features Available

### 1. Wallet Management

- Configure minimum/maximum deposit amounts
- Enable/disable wallet system
- Auto-approve deposits setting
- Commission rate configuration
- Transaction history with filtering
- Wallet statistics dashboard

### 2. Commission System

- Commission rate configuration
- Commission tracking per booking
- Property owner payout management
- Commission reports and analytics
- Payout status tracking

### 3. Fapshi Payment Integration

- Fapshi gateway configuration
- Merchant ID and secret key setup
- Webhook URL configuration
- Commission rate for Fapshi transactions
- Transaction statistics

## Troubleshooting

### If you get database errors:

1. **Table doesn't exist errors**: Run the SQL setup files in the order listed above
2. **Column doesn't exist errors**: The setup files include ALTER TABLE statements to add missing columns
3. **Foreign key constraint errors**: The setup files handle missing tables gracefully

### If you get PHP errors:

1. **Syntax errors**: All files have been syntax-checked and are error-free
2. **Include errors**: Make sure all include files exist in the `include/` directory
3. **Session errors**: Check that sessions are properly started

### If the dashboard doesn't load:

1. Check database connection in `include/reconfig.php`
2. Verify all required tables exist
3. Check PHP error logs for specific error messages

## Testing

After setup, test the following:

1. **Dashboard**: Visit `dashboard.php` - should load without errors
2. **Wallet Settings**: Visit `admin_wallet_settings.php` - should show configuration form
3. **Wallet Transactions**: Visit `admin_wallet_transactions.php` - should show transaction list
4. **Fapshi Settings**: Visit `admin_fapshi_settings.php` - should show Fapshi configuration
5. **Commission Reports**: Visit `admin_commission_reports.php` - should show commission data

## Security Notes

1. **Database credentials**: Update `include/reconfig.php` with your database credentials
2. **Fapshi credentials**: Update Fapshi settings with your actual API credentials
3. **File permissions**: Ensure proper file permissions for security
4. **HTTPS**: Use HTTPS in production for secure transactions

## Next Steps

1. Run the SQL setup files in order
2. Test all the new pages
3. Configure your Fapshi credentials
4. Set up commission rates
5. Test the wallet functionality

All compilation errors have been resolved and the missing files have been created with proper functionality.
