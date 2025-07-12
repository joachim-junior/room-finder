# Fapshi Payment Integration for Hotel Booking Platform

This integration allows users to fund their wallet using Fapshi payment gateway, supporting MTN MoMo and Orange Money payments in Cameroon.

## Overview

The integration follows this flow:
1. User initiates wallet top-up
2. System creates a payment charge with Fapshi
3. User completes payment via MTN MoMo or Orange Money
4. Fapshi sends webhook confirmation
5. System credits user wallet and sends notification

## Setup Instructions

### 1. Database Setup

Run the SQL script to create necessary tables:

```sql
-- Execute the contents of fapshi_setup.sql
```

### 2. Fapshi Account Configuration

1. Create a Fapshi account at https://fapshi.com
2. Get your API keys from the dashboard
3. Set up webhook URL: `https://yoursite.com/user_api/fapshi_webhook.php`
4. Update the payment settings in your database:

```sql
UPDATE tbl_payment_settings SET 
    api_key = 'your_actual_api_key',
    secret_key = 'your_actual_secret_key',
    callback_url = 'https://yoursite.com/user_api/fapshi_webhook.php',
    return_url = 'https://yoursite.com/wallet_success.php'
WHERE gateway = 'fapshi';
```

### 3. File Permissions

Ensure the following files have proper permissions:
- `user_api/u_wallet_topup_fapshi.php` - 644
- `user_api/fapshi_webhook.php` - 644
- `user_api/u_payment_status.php` - 644
- `user_api/u_transaction_history.php` - 644

## API Endpoints

### 1. Initialize Wallet Top-up

**Endpoint:** `POST /user_api/u_wallet_topup_fapshi.php`

**Request:**
```json
{
    "uid": "123",
    "amount": 5000
}
```

**Response:**
```json
{
    "ResponseCode": "200",
    "Result": "true",
    "ResponseMsg": "Payment initialized successfully!",
    "payment_url": "https://checkout.fapshi.com/...",
    "transaction_id": "WALLET_1234567890_123",
    "amount": 5000
}
```

### 2. Check Payment Status

**Endpoint:** `POST /user_api/u_payment_status.php`

**Request:**
```json
{
    "uid": "123",
    "transaction_id": "WALLET_1234567890_123"
}
```

**Response:**
```json
{
    "ResponseCode": "200",
    "Result": "true",
    "ResponseMsg": "Transaction status retrieved successfully",
    "transaction_id": "WALLET_1234567890_123",
    "amount": 5000,
    "status": "completed",
    "status_message": "Payment completed successfully",
    "payment_method": "fapshi",
    "created_at": "1st January 2024, 10:30 AM",
    "completed_at": "1st January 2024, 10:35 AM"
}
```

### 3. Get Transaction History

**Endpoint:** `POST /user_api/u_transaction_history.php`

**Request:**
```json
{
    "uid": "123",
    "limit": 10,
    "offset": 0,
    "status": "completed"
}
```

**Response:**
```json
{
    "ResponseCode": "200",
    "Result": "true",
    "ResponseMsg": "Transaction history retrieved successfully",
    "transactions": [...],
    "total_count": 25,
    "current_page": 1,
    "total_pages": 3
}
```

### 4. Webhook Endpoint

**Endpoint:** `POST /user_api/fapshi_webhook.php`

This endpoint receives webhook notifications from Fapshi. It's automatically called when:
- Payment is successful
- Payment fails
- Payment is cancelled

## Testing

### 1. Sandbox Testing

1. Set `sandbox_mode = 1` in your payment settings
2. Use Fapshi sandbox API keys
3. Test with sandbox MTN MoMo/Orange Money numbers

### 2. Testing Flow

1. Call the wallet top-up endpoint with test user ID and amount
2. Complete payment using the returned payment URL
3. Verify webhook is called and wallet is credited
4. Check transaction status using status endpoint

### 3. Test Cases

- **Successful Payment:** Amount: 1000 FCFA
- **Failed Payment:** Amount: 1 FCFA (usually fails in sandbox)
- **Cancelled Payment:** Start payment but don't complete

## Security Features

1. **Webhook Signature Verification:** All webhooks are verified using HMAC SHA256
2. **Transaction Idempotency:** Each transaction has a unique ID to prevent duplicates
3. **Amount Validation:** Minimum amount validation (500 FCFA)
4. **User Authentication:** All endpoints verify user existence
5. **Database Transactions:** Atomic operations for wallet updates

## Error Handling

### Common Errors

1. **"Payment system configuration error"**
   - Check if Fapshi settings exist in database
   - Verify API keys are correct

2. **"Minimum top-up amount is 500 FCFA"**
   - Ensure amount is at least 500 FCFA
   - Adjust minimum amount in code if needed

3. **"Network error occurred"**
   - Check internet connection
   - Verify Fapshi API endpoints are accessible

4. **"Invalid signature" (Webhook)**
   - Verify webhook secret key is correct
   - Check webhook URL in Fapshi dashboard

## Monitoring and Logs

### Log Files
- Check PHP error logs for webhook processing errors
- Monitor database for failed transactions
- Track successful wallet credits

### Database Monitoring
```sql
-- Check recent transactions
SELECT * FROM tbl_wallet_transactions ORDER BY created_at DESC LIMIT 10;

-- Check failed transactions
SELECT * FROM tbl_wallet_transactions WHERE status = 'failed';

-- Check pending transactions (might be stuck)
SELECT * FROM tbl_wallet_transactions WHERE status = 'pending' AND created_at < NOW() - INTERVAL 30 MINUTE;
```

## Troubleshooting

### Issue: Webhook not being called
**Solution:**
1. Check webhook URL in Fapshi dashboard
2. Ensure webhook endpoint is accessible from external networks
3. Check server logs for incoming requests

### Issue: Payment successful but wallet not credited
**Solution:**
1. Check webhook logs for signature verification errors
2. Verify transaction exists in database
3. Check if webhook processing completed successfully

### Issue: Payment fails immediately
**Solution:**
1. Verify API keys are correct
2. Check if account is activated on Fapshi
3. Ensure sufficient balance in test mode

## Production Deployment

### Before Going Live:

1. **Switch to Live Mode:**
```sql
UPDATE tbl_payment_settings SET 
    sandbox_mode = 0,
    api_key = 'live_api_key',
    secret_key = 'live_secret_key'
WHERE gateway = 'fapshi';
```

2. **Update URLs:**
   - Update webhook URL in Fapshi dashboard
   - Update return URL for user redirects

3. **Test Thoroughly:**
   - Test with small amounts first
   - Verify webhook processing
   - Test with different phone numbers

4. **Monitor:**
   - Set up monitoring for failed transactions
   - Monitor webhook response times
   - Track success rates

## Support

For issues related to:
- **Fapshi API:** Contact Fapshi support
- **Integration Issues:** Check logs and database
- **Payment Failures:** Verify user phone numbers and network

## Changelog

- **v1.0.0:** Initial Fapshi integration
- **v1.0.1:** Added transaction history endpoint
- **v1.0.2:** Enhanced error handling and logging

## License

This integration is part of your hotel booking platform and follows the same licensing terms.