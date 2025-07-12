# Property Owner Fapshi Payout System

## Overview
This system enables property owners to request payouts of their earnings directly to their mobile money accounts (MTN MoMo or Orange Money) through the Fapshi payment gateway. Property owners can manage their payouts from their user dashboard, while administrators can monitor and manage all payouts from the admin panel.

## System Architecture

### User Flow
1. **Property owners earn commission** from completed bookings (after platform commission is deducted)
2. **Earnings accumulate** in their property owner account 
3. **Property owners request payouts** through the API to their mobile money accounts
4. **Fapshi processes** the payout to MTN MoMo or Orange Money
5. **Webhooks update** payout status automatically
6. **Notifications sent** to property owners about payout status

### Admin Flow
1. **Monitor all payouts** through the admin dashboard
2. **View payout statistics** and summaries
3. **Manually process** or cancel payouts if needed
4. **Configure Fapshi settings** and commission rates
5. **Track payout fees** and transaction costs

## Database Schema

### New Tables Created

#### `tbl_fapshi_payouts`
Stores all property owner payout requests and their status.

```sql
- id (Primary Key)
- payout_id (Unique identifier)
- property_owner_id (References tbl_user.id)
- payout_amount (Requested amount)
- mobile_number (Recipient mobile number)
- payment_method (mtn_momo/orange_money)
- description (Payout description)
- status (pending/processing/completed/failed/cancelled)
- fapshi_transaction_id (Fapshi's transaction reference)
- fapshi_response (Full Fapshi API response)
- error_message (Error details if failed)
- created_at, updated_at (Timestamps)
```

#### `tbl_property_owner_payout_settings`
Stores property owner payout preferences and settings.

```sql
- id (Primary Key)
- property_owner_id (References tbl_user.id)
- preferred_payment_method (Default payment method)
- default_mobile_number (Default payout mobile number)
- auto_payout_enabled (Enable automatic payouts)
- auto_payout_threshold (Minimum amount for auto payout)
- created_at, updated_at (Timestamps)
```

#### `tbl_fapshi_payout_fees`
Tracks fees and charges for each payout transaction.

```sql
- id (Primary Key)
- payout_id (References tbl_fapshi_payouts.payout_id)
- payout_amount (Original amount)
- fee_amount (Fapshi fees)
- fee_percentage (Fee percentage)
- net_amount (Amount after fees)
- created_at (Timestamp)
```

### Database Views

#### `v_property_owner_earnings_summary`
Provides a comprehensive view of property owner earnings and available balances.

#### `v_fapshi_payout_details`
Combines payout information with user details and fee information.

## API Endpoints

### Property Owner APIs

#### 1. Request Payout (`u_property_owner_payout_request.php`)
**Method:** POST  
**Purpose:** Allow property owners to request payouts to their mobile money accounts

**Request Parameters:**
```json
{
    "amount": 50000,
    "mobile_number": "237690123456",
    "payment_method": "mtn_momo",
    "description": "Property earnings payout"
}
```

**Response:**
```json
{
    "ResponseCode": "200",
    "Result": "true",
    "ResponseMsg": "Payout request submitted successfully!",
    "payout_id": "PAYOUT_1640995200_123",
    "transaction_id": "fapshi_tx_456789",
    "amount": "50,000.00",
    "currency": "FCFA"
}
```

**Validations:**
- User must own properties
- Amount must meet minimum payout threshold
- Sufficient balance must be available
- Valid payment method (mtn_momo/orange_money)
- Valid mobile number format

#### 2. Payout History (`u_property_owner_payout_history.php`)
**Method:** POST  
**Purpose:** Retrieve property owner's payout history and earnings summary

**Request Parameters:**
```json
{
    "limit": 20,
    "offset": 0,
    "status": "completed"
}
```

**Response:**
```json
{
    "ResponseCode": "200",
    "Result": "true",
    "earnings_summary": {
        "total_earnings": "250,000.00",
        "pending_earnings": "50,000.00",
        "available_balance": "200,000.00",
        "total_withdrawn": "100,000.00",
        "today_earnings": "5,000.00",
        "month_earnings": "75,000.00"
    },
    "payout_history": [...],
    "settings": {
        "min_payout_amount": "1,000.00",
        "preferred_payment_method": "mtn_momo"
    }
}
```

### Webhook Handler

#### Fapshi Payout Webhook (`fapshi_payout_webhook.php`)
**Method:** POST  
**Purpose:** Receive payout status updates from Fapshi

**Webhook Security:**
- Signature verification using HMAC-SHA256
- IP whitelisting (if supported by Fapshi)
- Duplicate request handling

**Status Mapping:**
- Fapshi "pending" → "processing"
- Fapshi "completed"/"successful" → "completed"
- Fapshi "failed"/"error" → "failed"
- Fapshi "cancelled" → "cancelled"

## Admin Integration

### Admin Dashboard Enhancements
The existing admin dashboard now includes:

#### New Menu Items (in sidebar)
- **Commission Management**
  - Property Owner Payouts (`admin_property_owner_payouts.php`)
  
- **Wallet Management**  
  - Fapshi Configuration (`admin_fapshi_settings.php`)

#### New Dashboard Statistics (in main dashboard)
- Total Property Owner Payouts
- Pending Payout Requests
- Failed Payout Count
- Today's Payout Volume

### Admin Payout Management (`admin_property_owner_payouts.php`)
**Features:**
- View all property owner payout requests
- Filter by status, payment method, or property owner
- Manually mark payouts as completed or cancelled
- View detailed payout information and property owner details
- Pagination for large datasets
- Real-time payout statistics

**Manual Actions:**
- **Complete Payout:** Mark as completed (for failed automatic processing)
- **Cancel Payout:** Cancel pending/processing payouts
- **View Details:** Full transaction and property owner information

## Fapshi API Integration

### API Structure
The system is designed to work with standard Fapshi payout API patterns:

**Base URLs:**
- Production: `https://api.fapshi.com`
- Sandbox: `https://sandbox.fapshi.com`

**Payout Endpoint:** `POST /v1/payouts`

**Request Structure:**
```json
{
    "amount": 50000,
    "currency": "XAF",
    "recipient": {
        "phone": "237690123456",
        "method": "mtn_momo"
    },
    "external_reference": "PAYOUT_1640995200_123",
    "description": "Property earnings payout",
    "callback_url": "https://yourdomain.com/user_api/fapshi_payout_webhook.php"
}
```

**Authentication:**
- Bearer token in Authorization header
- API secret in X-API-Secret header

### Supported Payment Methods
1. **MTN Mobile Money** (`mtn_momo`)
   - Cameroon MTN network
   - Mobile number format validation
   
2. **Orange Money** (`orange_money`)
   - Cameroon Orange network
   - Mobile number format validation

## Security Features

### API Security
- **Session validation** for all property owner requests
- **Property ownership verification** before allowing payouts
- **Balance validation** to prevent overpayments
- **Rate limiting** to prevent abuse
- **Input sanitization** and SQL injection prevention

### Webhook Security
- **HMAC signature verification** using webhook secret
- **Request logging** for audit trails
- **Duplicate prevention** using transaction IDs
- **Error handling** with proper HTTP status codes

### Database Security
- **Prepared statements** for all database queries
- **Transaction management** for data consistency
- **Index optimization** for performance
- **Foreign key constraints** for referential integrity

## Revenue Model Integration

### Commission Flow with Payouts
1. **Customer books property** → Wallet deducted
2. **Platform commission calculated** → Based on admin settings
3. **Property owner earnings recorded** → Amount minus commission
4. **Property owner requests payout** → Using this system
5. **Fapshi processes payout** → To mobile money account
6. **Platform retains commission** → Tracked in admin dashboard

### Example Transaction Flow
```
Booking Amount: 100,000 FCFA
Platform Commission (10%): 10,000 FCFA
Property Owner Earning: 90,000 FCFA

Property Owner Requests Payout: 50,000 FCFA
Fapshi Fee (estimated): 500 FCFA
Property Owner Receives: 49,500 FCFA
Remaining Balance: 40,000 FCFA
```

## Configuration Requirements

### 1. Database Setup
Run the SQL file: `fapshi_payout_setup.sql`

### 2. Fapshi Configuration
Configure in Admin Panel → Wallet Management → Fapshi Configuration:
- API Key (from Fapshi dashboard)
- API Secret (from Fapshi dashboard)  
- Webhook Secret (for security)
- Environment (sandbox/production)
- Status (active/inactive)

### 3. Commission Settings
Configure in Admin Panel → Commission Management → Commission Settings:
- Commission rate
- Minimum payout amount
- Payout timing
- Auto payout settings

### 4. Webhook URL Configuration
Set in Fapshi dashboard:
```
Webhook URL: https://yourdomain.com/user_api/fapshi_payout_webhook.php
```

## Testing Procedures

### 1. Sandbox Testing
- Use Fapshi sandbox environment
- Test with sandbox mobile numbers
- Verify webhook delivery
- Test all payout scenarios (success, failure, cancellation)

### 2. Integration Testing
- Test payout request flow
- Verify balance calculations
- Test webhook status updates
- Test admin manual processing

### 3. Security Testing
- Test signature verification
- Test invalid requests
- Test SQL injection prevention
- Test session management

## Monitoring and Maintenance

### Key Metrics to Monitor
- **Payout Success Rate** → Should be >95%
- **Average Processing Time** → Track webhook delivery delays
- **Failed Payout Reasons** → Identify common issues
- **Fee Tracking** → Monitor Fapshi charges

### Regular Maintenance Tasks
- **Review failed payouts** → Investigate and resolve issues
- **Update webhook secrets** → Regular security rotation  
- **Monitor API rate limits** → Ensure compliance with Fapshi limits
- **Database optimization** → Regular index maintenance

### Error Handling
- **Failed payouts logged** → For admin investigation
- **Automatic retry logic** → For temporary failures
- **User notifications** → About payout status changes
- **Admin alerts** → For failed webhook deliveries

## Deployment Checklist

### Pre-Deployment
- [ ] Run database setup SQL
- [ ] Configure Fapshi API credentials
- [ ] Set up webhook URL in Fapshi dashboard
- [ ] Test in sandbox environment
- [ ] Verify commission system integration

### Post-Deployment
- [ ] Test end-to-end payout flow
- [ ] Monitor webhook delivery
- [ ] Verify admin panel functionality
- [ ] Test notification system
- [ ] Monitor error logs

### Production Considerations
- [ ] Switch to production API endpoints
- [ ] Update webhook URL to production domain
- [ ] Monitor transaction volumes
- [ ] Set up automated monitoring
- [ ] Implement backup procedures

This system provides a complete, secure, and user-friendly way for property owners to withdraw their earnings while maintaining full administrative control and monitoring capabilities.