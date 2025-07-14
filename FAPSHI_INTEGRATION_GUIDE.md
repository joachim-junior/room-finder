# Fapshi Payment Gateway Integration Guide

This guide provides comprehensive instructions for integrating Fapshi payment gateway into your application. Fapshi is a popular payment solution in Cameroon that supports Direct Pay, Payout, and Webhook functionality.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Endpoints](#api-endpoints)
6. [Webhook Handling](#webhook-handling)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

## Overview

Fapshi provides a comprehensive payment solution with the following features:

- **Direct Pay**: Initiate payments from customers
- **Payment Status**: Check payment status
- **Payout**: Send money to users
- **Webhooks**: Real-time payment notifications
- **Sandbox Mode**: Testing environment

## Prerequisites

Before integrating Fapshi, ensure you have:

1. **Fapshi Account**: Register at [Fapshi Dashboard](https://dashboard.fapshi.com)
2. **API Credentials**: Obtain your API User and API Key from the dashboard
3. **Webhook Secret**: Configure webhook secret in your Fapshi dashboard
4. **SSL Certificate**: Your webhook endpoint must be HTTPS
5. **PHP Requirements**: PHP 7.4+ with cURL extension

## Installation

### 1. Database Setup

Create the required database tables:

```sql
-- Payment settings table
CREATE TABLE IF NOT EXISTS `tbl_payment_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gateway` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `api_user` varchar(255) DEFAULT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `webhook_secret` varchar(255) DEFAULT NULL,
  `sandbox_mode` tinyint(1) DEFAULT 1,
  `callback_url` varchar(500) DEFAULT NULL,
  `return_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gateway` (`gateway`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS `tbl_wallet_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'XOF',
  `payment_method` varchar(50) DEFAULT 'fapshi',
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `fapshi_payment_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payouts table
CREATE TABLE IF NOT EXISTS `tbl_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payout_id` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'XOF',
  `recipient_phone` varchar(20) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `fapshi_payout_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payout_id` (`payout_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2. File Structure

Ensure the following files are in place:

```
dashboard/
├── admin_fapshi_settings.php          # Admin configuration panel
├── user_api/
│   ├── fapshi_direct_pay.php         # Direct Pay API endpoint
│   ├── u_payment_status.php           # Payment status endpoint
│   ├── fapshi_payout.php             # Payout API endpoint
│   └── fapshi_webhook.php            # Webhook handler
├── test_fapshi_complete.php          # Test suite
└── FAPSHI_INTEGRATION_GUIDE.md       # This guide
```

## Configuration

### 1. Admin Panel Configuration

1. Access the admin panel: `admin_fapshi_settings.php`
2. Configure the following settings:

   - **Enable Fapshi**: Toggle to enable/disable the gateway
   - **API User**: Your unique API user identifier from Fapshi
   - **API Key**: Your secret API key for authentication
   - **Webhook Secret**: Secret configured in your Fapshi dashboard (separate from API key)
   - **Environment Mode**: Sandbox (testing) or Production (live)
   - **Webhook URL**: URL for receiving payment notifications
   - **Return URL**: URL where users are redirected after payment

### 2. Fapshi Dashboard Configuration

1. **API Credentials**: Note your API User and API Key
2. **Webhook Secret**: Configure a webhook secret in your Fapshi dashboard
3. **Webhook URL**: Set your webhook URL in the Fapshi dashboard
4. **Environment**: Switch between sandbox and production modes

## API Endpoints

### 1. Direct Pay

**Endpoint**: `POST /user_api/fapshi_direct_pay.php`

**Request**:

```json
{
  "uid": 123,
  "amount": 1000,
  "phone": "+237123456789",
  "description": "Wallet topup"
}
```

**Response**:

```json
{
  "Result": "true",
  "transaction_id": "PAY_123456789",
  "payment_url": "https://fapshi.com/pay/PAY_123456789",
  "message": "Payment initiated successfully"
}
```

### 2. Payment Status

**Endpoint**: `POST /user_api/u_payment_status.php`

**Request**:

```json
{
  "uid": 123,
  "transaction_id": "PAY_123456789"
}
```

**Response**:

```json
{
  "Result": "true",
  "status": "completed",
  "amount": 1000,
  "message": "Payment completed successfully"
}
```

### 3. Payout

**Endpoint**: `POST /user_api/fapshi_payout.php`

**Request**:

```json
{
  "uid": 123,
  "amount": 500,
  "phone": "+237123456789",
  "description": "Withdrawal"
}
```

**Response**:

```json
{
  "Result": "true",
  "payout_id": "PAYOUT_123456789",
  "message": "Payout initiated successfully"
}
```

## Webhook Handling

### Webhook Events

The webhook handler (`fapshi_webhook.php`) processes the following events:

- `payment.success` - Payment completed successfully
- `payment.failed` - Payment failed
- `payment.cancelled` - Payment cancelled
- `direct-pay.success` - Direct pay completed
- `direct-pay.failed` - Direct pay failed
- `direct-pay.cancelled` - Direct pay cancelled
- `payout.success` - Payout completed
- `payout.failed` - Payout failed
- `payout.cancelled` - Payout cancelled

### Webhook Security

Webhook signatures are verified using HMAC-SHA256:

```php
// Verify webhook signature
$expected_signature = hash_hmac('sha256', $payload, $webhook_secret);
$is_valid = hash_equals($expected_signature, $received_signature);
```

**Important**: The webhook secret is configured separately in your Fapshi dashboard and is different from your API key.

### Webhook Processing

1. **Signature Verification**: Verify the webhook signature
2. **Event Processing**: Handle different event types
3. **Database Updates**: Update transaction/payout status
4. **User Notifications**: Send notifications to users
5. **Wallet Updates**: Update user wallet balance (for payments)

## Testing

### 1. Test Suite

Use the comprehensive test suite: `test_fapshi_complete.php`

The test suite includes:

- **Configuration Test**: Verify API credentials and settings
- **Direct Pay Test**: Test payment initiation
- **Payment Status Test**: Test status checking
- **Payout Test**: Test money transfer
- **Webhook Test**: Test signature verification and endpoint accessibility

### 2. Manual Testing

1. **Sandbox Mode**: Always test in sandbox mode first
2. **Small Amounts**: Use small amounts for testing
3. **Webhook Testing**: Use tools like ngrok for local testing
4. **Error Handling**: Test various error scenarios

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Verify API User and API Key are correct
   - Ensure headers are properly set: `apiuser` and `apikey`

2. **Webhook Not Receiving**

   - Check webhook URL is publicly accessible
   - Verify webhook secret is correctly configured
   - Check server logs for errors

3. **Payment Failures**

   - Verify phone numbers are in correct format (+237XXXXXXXXX)
   - Check amount limits and currency
   - Ensure user exists in database

4. **Database Errors**
   - Verify all required tables exist
   - Check database connection
   - Ensure proper permissions

### Debug Mode

Enable debug logging by adding to your PHP files:

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
error_log("Fapshi Debug: " . $message);
```

### Log Files

Check these locations for logs:

- PHP error log: `/var/log/php_errors.log`
- Web server log: `/var/log/apache2/error.log`
- Application log: Check your application's log directory

## Security Considerations

### 1. API Credentials

- **Never expose API credentials** in client-side code
- **Store credentials securely** in database with encryption
- **Rotate credentials regularly** for security
- **Use environment variables** in production

### 2. Webhook Security

- **Always verify webhook signatures** before processing
- **Use HTTPS** for all webhook endpoints
- **Configure webhook secret** in Fapshi dashboard
- **Log all webhook requests** for debugging

### 3. Data Validation

- **Validate all input data** before processing
- **Sanitize user inputs** to prevent injection attacks
- **Check amount limits** and currency validation
- **Verify user permissions** before operations

### 4. Error Handling

- **Don't expose sensitive information** in error messages
- **Log errors securely** without exposing credentials
- **Implement proper HTTP status codes**
- **Handle timeouts and network errors**

## API Reference

### Fapshi API Base URLs

- **Sandbox**: `https://sandbox.fapshi.com`
- **Production**: `https://api.fapshi.com`

### Authentication

All API requests require these headers:

```
apiuser: YOUR_API_USER
apikey: YOUR_API_KEY
Content-Type: application/json
```

### Direct Pay API

**Endpoint**: `POST /api/v1/direct-pay`

**Request Body**:

```json
{
  "amount": 1000,
  "currency": "XOF",
  "description": "Payment description",
  "customer_email": "customer@example.com",
  "customer_name": "Customer Name",
  "customer_phone": "+237123456789",
  "return_url": "https://yoursite.com/success",
  "cancel_url": "https://yoursite.com/cancel",
  "metadata": {
    "transaction_id": "TXN_123",
    "user_id": 123
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "payment_id": "PAY_123456789",
    "payment_url": "https://fapshi.com/pay/PAY_123456789",
    "amount": 1000,
    "currency": "XOF"
  }
}
```

### Payment Status API

**Endpoint**: `GET /api/v1/payment-status/{payment_id}`

**Response**:

```json
{
  "success": true,
  "data": {
    "payment_id": "PAY_123456789",
    "status": "completed",
    "amount": 1000,
    "currency": "XOF",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### Payout API

**Endpoint**: `POST /api/v1/payout`

**Request Body**:

```json
{
  "amount": 500,
  "currency": "XOF",
  "recipient_phone": "+237123456789",
  "description": "Payout description",
  "metadata": {
    "payout_id": "PAYOUT_123",
    "user_id": 123
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "payout_id": "PAYOUT_123456789",
    "amount": 500,
    "currency": "XOF",
    "status": "pending"
  }
}
```

## Support

For technical support:

1. **Fapshi Documentation**: [https://docs.fapshi.com](https://docs.fapshi.com)
2. **Fapshi Support**: Contact Fapshi support team
3. **Integration Issues**: Check this guide and test suite
4. **Database Issues**: Verify table structure and permissions

## Changelog

- **v1.0.0**: Initial implementation with Direct Pay, Payment Status, Payout, and Webhook support
- **v1.1.0**: Added comprehensive test suite and improved error handling
- **v1.2.0**: Updated webhook secret handling and security improvements

---

**Note**: This integration guide is based on Fapshi's official API documentation. For the most up-to-date information, always refer to the official Fapshi documentation.
