# API Response Reference

This document lists the expected response data for each API endpoint in the `user_api/` directory.

---

## Authentication

## u_login_user.php

**Request:**

```json
{
  "mobile": "string",
  "password": "string",
  "ccode": "string"
}
```

**Response (Success):**

```json
{
  "UserLogin": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "237690123456",
    "ccode": "+237",
    "wallet": 5000,
    "user_type": "customer",
    "status": 1,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  },
  "currency": "XAF",
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Login successfully!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Invalid Mobile Number Or Email Address or Password!!!"
}
```

## u_reg_user.php

**Request:**

```json
{
  "name": "string",
  "email": "string",
  "mobile": "string",
  "password": "string",
  "ccode": "string",
  "refercode": "string (optional)"
}
```

**Response (Success):**

```json
{
  "UserLogin": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "237690123456",
    "ccode": "+237",
    "wallet": 100,
    "user_type": "customer",
    "status": 1,
    "refercode": "123456",
    "parentcode": "789012",
    "reg_date": "2023-10-27T10:00:00Z",
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  },
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Sign Up Done Successfully!"
}
```

**Response (Error - Mobile Already Used):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Mobile Number Already Used!"
}
```

**Response (Error - Email Already Used):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Email Address Already Used!"
}
```

**Response (Error - Invalid Refer Code):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Refer Code Not Found Please Try Again!!"
}
```

## u_forget_password.php

**Request:**

```json
{
  "mobile": "237690123456",
  "password": "newpassword123",
  "ccode": "+237"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Password Changed Successfully!!!!!"
}
```

**Response (Error - Mobile Not Matched):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "mobile Not Matched!!!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went wrong  try again !"
}
```

## mobile_check.php

**Request:**

```json
{
  "mobile": "237690123456",
  "ccode": "+237"
}
```

**Response (Success - New Number):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "New Number!"
}
```

**Response (Error - Already Exist):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Already Exist Mobile Number!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## msg_otp.php

**Request:**

```json
{
  "mobile": "237690123456"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Balance Get Successfully!!",
  "otp": 123456
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## twilio_otp.php

**Request:**

```json
{
  "mobile": "237690123456"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Balance Get Successfully!!",
  "otp": 123456
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## sms_type.php

**Request:**

```json
{}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "type Get Successfully!!",
  "SMS_TYPE": "otp",
  "otp_auth": "sms"
}
```

## User Profile

## u_profile_edit.php

**Request:**

```json
{
  "name": "John Doe",
  "password": "newpassword123",
  "uid": "1",
  "lname": "Doe"
}
```

**Response (Success):**

```json
{
  "UserLogin": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "237690123456",
    "ccode": "+237",
    "wallet": 5000,
    "user_type": "customer",
    "status": 1,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  },
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Profile Update successfully!"
}
```

**Response (Error - User Not Exist):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "User Not Exist!!!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## acc_delete.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Account Delete Successfully!!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Property Management

## u_property_list.php

**Response (Success):**

```json
{
  "proplist": [
    {
      "id": 1,
      "name": "Example Property 1",
      "description": "Description for Example Property 1",
      "price": 100000,
      "location": "Example Location 1",
      "property_type": "apartment",
      "facilities": ["wifi", "parking"],
      "owner_id": 1,
      "status": "available",
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property  List Founded!"
}
```

**Response (Error):**

```json
{
  "proplist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Property List Not Founded!"
}
```

## u_property_add.php

**Request:**

```json
{
  "status": "1",
  "title": "Luxury Apartment",
  "address": "123 Main Street",
  "description": "Beautiful apartment with modern amenities",
  "ccount": "Douala",
  "facility": "1,2,3",
  "ptype": "1",
  "beds": "2",
  "bathroom": "1",
  "sqft": "1200",
  "rate": "4",
  "latitude": "4.0511",
  "longtitude": "9.7679",
  "mobile": "237690123456",
  "price": "50000",
  "plimit": "4",
  "country_id": "1",
  "pbuysell": "rent",
  "uid": "1",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Add Successfully"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_property_edit.php

**Request:**

```json
{
  "status": "1",
  "title": "Luxury Apartment",
  "address": "123 Main Street",
  "description": "Beautiful apartment with modern amenities",
  "ccount": "Douala",
  "facility": "1,2,3",
  "ptype": "1",
  "beds": "2",
  "bathroom": "1",
  "sqft": "1200",
  "rate": "4",
  "latitude": "4.0511",
  "longtitude": "9.7679",
  "mobile": "237690123456",
  "price": "50000",
  "uid": "1",
  "prop_id": "1",
  "plimit": "4",
  "country_id": "1",
  "pbuysell": "rent",
  "img": "0"
}
```

**Request (With Image):**

```json
{
  "status": "1",
  "title": "Luxury Apartment",
  "address": "123 Main Street",
  "description": "Beautiful apartment with modern amenities",
  "ccount": "Douala",
  "facility": "1,2,3",
  "ptype": "1",
  "beds": "2",
  "bathroom": "1",
  "sqft": "1200",
  "rate": "4",
  "latitude": "4.0511",
  "longtitude": "9.7679",
  "mobile": "237690123456",
  "price": "50000",
  "uid": "1",
  "prop_id": "1",
  "plimit": "4",
  "country_id": "1",
  "pbuysell": "rent",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Update Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Edit Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_property_details.php

**Request:**

```json
{
  "pro_id": "1",
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "propetydetails": {
    "id": 1,
    "user_id": 1,
    "title": "Luxury Apartment",
    "rate": 4.5,
    "city": "Douala",
    "image": [
      {
        "image": "images/property/1.jpg",
        "is_panorama": "0"
      }
    ],
    "property_type": 1,
    "property_title": "Apartment",
    "price": 50000,
    "buyorrent": "rent",
    "is_enquiry": 0,
    "address": "123 Main Street, Douala",
    "beds": 2,
    "owner_image": "images/property/owner.jpg",
    "owner_name": "John Doe",
    "bathroom": 1,
    "sqrft": 1200,
    "description": "Beautiful apartment with modern amenities",
    "latitude": "4.0511",
    "mobile": "237690123456",
    "plimit": 4,
    "longtitude": "9.7679",
    "IS_FAVOURITE": 1
  },
  "facility": [
    {
      "img": "images/facility/wifi.png",
      "title": "Wifi"
    }
  ],
  "gallery": ["images/gallery/1.jpg", "images/gallery/2.jpg"],
  "reviewlist": [
    {
      "user_img": "images/profile/user1.jpg",
      "user_title": "Jane Doe",
      "user_rate": 5,
      "user_desc": "Great property, highly recommended!"
    }
  ],
  "total_review": 5,
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Details Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_cat_wise_property.php

**Request:**

```json
{
  "uid": "1",
  "cid": "1",
  "country_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Category Data Get Successfully!",
  "Property_cat": [
    {
      "id": 1,
      "title": "Luxury Apartment",
      "buyorrent": "rent",
      "plimit": 4,
      "rate": 4,
      "city": "Douala",
      "property_type": 1,
      "beds": 2,
      "bathroom": 1,
      "sqrft": 1200,
      "image": "images/property/1.jpg",
      "price": 50000,
      "IS_FAVOURITE": 1
    }
  ]
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_sale_prop.php

**Request:**

```json
{
  "uid": "1",
  "prop_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Selled Successfully!"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Own Property Try To Sell!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_search_property.php

**Request:**

```json
{
  "keyword": "apartment",
  "uid": "1",
  "country_id": "1"
}
```

**Response (Success):**

```json
{
  "search_propety": [
    {
      "id": 1,
      "title": "Luxury Apartment",
      "rate": 4,
      "buyorrent": "rent",
      "plimit": 4,
      "city": "Douala",
      "image": "images/property/1.jpg",
      "property_type": 1,
      "price": 50000,
      "IS_FAVOURITE": 1
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property List Founded!"
}
```

**Response (No Results):**

```json
{
  "search_propety": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Search Property Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_package.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Package Data Get Successfully!",
  "PackageData": [
    {
      "id": 1,
      "title": "Basic Plan",
      "price": 5000,
      "day": 30,
      "description": "Basic subscription plan",
      "image": "images/package/basic.png",
      "status": 1
    }
  ],
  "is_subscribe": 1
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_package_purchase.php

**Request:**

```json
{
  "uid": "1",
  "plan_id": "1",
  "transaction_id": "TXN123456789",
  "pname": "Mobile Money"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Package Purchase Successfully!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Booking

## u_book.php

**Request:**

```json
{
  "prop_id": "1",
  "uid": "1",
  "check_in": "2023-12-01",
  "check_out": "2023-12-03",
  "subtotal": "20000",
  "total": "23800",
  "tax": "3800",
  "p_method_id": "1",
  "book_for": "self",
  "prop_price": "10000",
  "total_day": "2",
  "noguest": "2",
  "add_note": "Early check-in if possible",
  "transaction_id": "TXN123456789",
  "cou_amt": "0",
  "wall_amt": "5000"
}
```

**Request (For Others):**

```json
{
  "prop_id": "1",
  "uid": "1",
  "check_in": "2023-12-01",
  "check_out": "2023-12-03",
  "subtotal": "20000",
  "total": "23800",
  "tax": "3800",
  "p_method_id": "1",
  "book_for": "other",
  "prop_price": "10000",
  "total_day": "2",
  "noguest": "2",
  "add_note": "Early check-in if possible",
  "transaction_id": "TXN123456789",
  "cou_amt": "0",
  "wall_amt": "5000",
  "fname": "Jane",
  "lname": "Doe",
  "gender": "female",
  "email": "jane@example.com",
  "mobile": "237690123457",
  "ccode": "+237",
  "country": "Cameroon"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Booking Confirmed Successfully!!!",
  "wallet": 4500,
  "book_id": 123
}
```

**Response (Error - Date Already Booked):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "That Date Range Already Booked!"
}
```

**Response (Error - Insufficient Wallet Balance):**

```json
{
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Wallet Balance Not There As Per Booking Amount Refresh One Time Screen!!!",
  "wallet": 1000
}
```

**Response (Error - Invalid Book For Option):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Not Try Other Options!!"
}
```

## u_book_with_commission.php

**Request:**

```json
{
  "prop_id": "1",
  "uid": "1",
  "check_in": "2023-12-01",
  "check_out": "2023-12-03",
  "subtotal": "20000",
  "total": "23800",
  "tax": "3800",
  "p_method_id": "1",
  "book_for": "self",
  "prop_price": "10000",
  "total_day": "2",
  "noguest": "2",
  "add_note": "Early check-in if possible",
  "transaction_id": "TXN123456789",
  "cou_amt": "0",
  "wall_amt": "5000"
}
```

**Request (For Others):**

```json
{
  "prop_id": "1",
  "uid": "1",
  "check_in": "2023-12-01",
  "check_out": "2023-12-03",
  "subtotal": "20000",
  "total": "23800",
  "tax": "3800",
  "p_method_id": "1",
  "book_for": "other",
  "prop_price": "10000",
  "total_day": "2",
  "noguest": "2",
  "add_note": "Early check-in if possible",
  "transaction_id": "TXN123456789",
  "cou_amt": "0",
  "wall_amt": "5000",
  "fname": "Jane",
  "lname": "Doe",
  "gender": "female",
  "email": "jane@example.com",
  "mobile": "237690123457",
  "ccode": "+237",
  "country": "Cameroon"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Booking Confirmed Successfully!!!",
  "wallet": 4500,
  "book_id": 123
}
```

**Response (Error - Date Already Booked):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "That Date Range Already Booked!"
}
```

**Response (Error - Insufficient Wallet Balance):**

```json
{
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Wallet Balance Not There As Per Booking Amount Refresh One Time Screen!!!",
  "wallet": 1000
}
```

**Response (Error - Invalid Book For Option):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Not Try Other Options!!"
}
```

## u_book_details.php

**Request:**

```json
{
  "book_id": "1",
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "bookdetails": {
    "book_id": 1,
    "prop_id": 1,
    "uid": 1,
    "book_date": "2023-12-01",
    "check_in": "2023-12-01",
    "check_out": "2023-12-03",
    "payment_title": "Mobile Money",
    "subtotal": 20000,
    "total": 23800,
    "tax": 3800,
    "cou_amt": 0,
    "wall_amt": 5000,
    "transaction_id": "TXN123456789",
    "p_method_id": 1,
    "add_note": "Early check-in if possible",
    "book_status": "Confirmed",
    "check_intime": "14:00",
    "noguest": 2,
    "check_outtime": "12:00",
    "book_for": "self",
    "is_rate": 1,
    "total_rate": 5,
    "rate_text": "Great stay!",
    "prop_price": 10000,
    "total_day": 2,
    "cancle_reason": "",
    "fname": "",
    "lname": "",
    "gender": "",
    "email": "",
    "mobile": "",
    "ccode": "",
    "country": ""
  },
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Book Property Details Founded!"
}
```

**Response (Success, For Others):**

```json
{
  "bookdetails": {
    "book_id": 1,
    "prop_id": 1,
    "uid": 1,
    "book_date": "2023-12-01",
    "check_in": "2023-12-01",
    "check_out": "2023-12-03",
    "payment_title": "Mobile Money",
    "subtotal": 20000,
    "total": 23800,
    "tax": 3800,
    "cou_amt": 0,
    "wall_amt": 5000,
    "transaction_id": "TXN123456789",
    "p_method_id": 1,
    "add_note": "Early check-in if possible",
    "book_status": "Confirmed",
    "check_intime": "14:00",
    "noguest": 2,
    "check_outtime": "12:00",
    "book_for": "other",
    "is_rate": 1,
    "total_rate": 5,
    "rate_text": "Great stay!",
    "prop_price": 10000,
    "total_day": 2,
    "cancle_reason": "",
    "fname": "Jane",
    "lname": "Doe",
    "gender": "female",
    "email": "jane@example.com",
    "mobile": "237690123457",
    "ccode": "+237",
    "country": "Cameroon"
  },
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Book Property Details Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_my_book.php

**Request:**

```json
{
  "uid": "1",
  "status": "active"
}
```

**Response (Success):**

```json
{
  "statuswise": [
    {
      "book_id": 1,
      "prop_id": 1,
      "prop_img": "images/property/1.jpg",
      "prop_title": "Luxury Apartment",
      "p_method_id": 1,
      "prop_price": 50000,
      "total_day": 2,
      "rate": 4,
      "book_status": "Confirmed"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Status Wise Property Details Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_my_book_cancle.php

**Request:**

```json
{
  "uid": "1",
  "book_id": "1",
  "cancle_reason": "Change of plans"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Booking  Cancelled Successfully!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_book_cancle.php

**Request:**

```json
{
  "uid": "1",
  "book_id": "1",
  "cancle_reason": "Change of plans"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Booking  Cancelled Successfully!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_book_status_wise.php

**Request:**

```json
{
  "uid": "1",
  "status": "active"
}
```

**Response (Success):**

```json
{
  "statuswise": [
    {
      "book_id": 1,
      "prop_id": 1,
      "prop_img": "images/property/1.jpg",
      "prop_title": "Luxury Apartment",
      "book_status": "Confirmed",
      "prop_price": 50000,
      "p_method_id": 1,
      "total_day": 2,
      "total_rate": 4
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Status Wise Property Details Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_check_in.php

**Request:**

```json
{
  "uid": "1",
  "book_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Check In Successfully!"
}
```

**Response (Error - Not Confirmed):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Property Confirmed First Required!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_check_out.php

**Request:**

```json
{
  "uid": "1",
  "book_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Check Out Successfully!"
}
```

**Response (Error - Not Checked In):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Property Check In First Required!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_confim.php

**Request:**

```json
{
  "uid": "1",
  "book_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Booking Confirmed Successfully!"
}
```

**Response (Error - Not Booked):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Property Booked Status First Required!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## my_book_details.php

**Request:**

```json
{
  "book_id": "1",
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "bookdetails": {
    "book_id": 1,
    "prop_id": 1,
    "uid": 1,
    "book_date": "2023-12-01",
    "check_in": "2023-12-01",
    "check_out": "2023-12-03",
    "payment_title": "Mobile Money",
    "subtotal": 20000,
    "total": 23800,
    "tax": 3800,
    "cou_amt": 0,
    "noguest": 2,
    "wall_amt": 5000,
    "transaction_id": "TXN123456789",
    "p_method_id": 1,
    "add_note": "Early check-in if possible",
    "book_status": "Confirmed",
    "check_intime": "14:00",
    "check_outtime": "12:00",
    "book_for": "self",
    "is_rate": 1,
    "total_rate": 5,
    "rate_text": "Great stay!",
    "prop_price": 10000,
    "total_day": 2,
    "cancle_reason": "",
    "customer_name": "John Doe",
    "customer_mobile": "+237690123456"
  },
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Book Property Details Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Wallet & Payments

## u_wallet_up.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Wallet Balance Get Successfully!",
  "code": "ABC123",
  "signupcredit": 100,
  "refercredit": 50,
  "tax": 19.25
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Not Exist User!"
}
```

## u_wallet_topup_fapshi.php

**Response (Success):**

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

**Response (Error):**

```json
{
  "ResponseCode": "500",
  "Result": "false",
  "ResponseMsg": "Payment system configuration error!"
}
```

## u_wallet_report.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "Walletitem": [
    {
      "message": "Sign up Credit Added!!",
      "status": "Credit",
      "amt": 100,
      "tdate": "27th October, 10:00 AM"
    },
    {
      "message": "Wallet Used in Booking Id#123",
      "status": "Debit",
      "amt": 5000,
      "tdate": "27th October, 09:30 AM"
    }
  ],
  "wallet": 4500,
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Wallet Report Get Successfully!"
}
```

**Response (Error - User Not Exist):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Request To Update Own Device!!!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_transaction_history.php

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Transaction history fetched successfully!",
  "transactions": [
    {
      "id": 1,
      "user_id": 1,
      "type": "topup",
      "amount": 1000,
      "status": "completed",
      "transaction_id": "WALLET_1234567890_123",
      "created_at": "2023-10-27T10:00:00Z"
    }
  ]
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Missing user ID!"
}
```

## u_payment_status.php

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payment completed!",
  "status": "completed",
  "amount": 5000,
  "transaction_id": "WALLET_1234567890_123"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "404",
  "Result": "false",
  "ResponseMsg": "Transaction not found!"
}
```

## fapshi_webhook.php

**Request:**

Webhook POST from Fapshi (Content-Type: application/json)

Example payload:

```json
{
  "event_type": "payment.success",
  "data": {
    "id": "fapshi_payment_id_123",
    "amount": 10000,
    "metadata": {
      "transaction_id": "PAY_1700000000_1",
      "user_id": 1
    }
  }
}
```

**Response (Success):**

```json
{
  "status": "success"
}
```

**Response (Error - Invalid Signature):**

```json
{
  "error": "Invalid signature"
}
```

**Response (Error - Invalid Data):**

```json
{
  "error": "Invalid webhook data"
}
```

## fapshi_payout_webhook.php

**Request:**

Webhook POST from Fapshi (Content-Type: application/json)

Example payload:

```json
{
  "transaction_id": "fapshi_transaction_id_123",
  "external_reference": "PAYOUT_1700000000_1",
  "status": "completed",
  "amount": 1000,
  "fees": 50
}
```

**Response (Success - Status Updated):**

```json
{
  "success": true,
  "message": "Payout status updated successfully",
  "payout_id": "PAYOUT_1700000000_1",
  "new_status": "completed"
}
```

**Response (Success - No Status Change):**

```json
{
  "success": true,
  "message": "No status change required",
  "payout_id": "PAYOUT_1700000000_1"
}
```

**Response (Error - Invalid JSON):**

```json
{
  "error": "Invalid JSON payload"
}
```

**Response (Error - Invalid Signature):**

```json
{
  "error": "Invalid signature"
}
```

**Response (Error - Missing Transaction Identifier):**

```json
{
  "error": "Missing transaction identifier"
}
```

**Response (Error - Payout Record Not Found):**

```json
{
  "error": "Payout record not found"
}
```

**Response (Error - Database Error):**

```json
{
  "error": "Database error"
}
```

**Response (Error - Internal Server Error):**

```json
{
  "error": "Internal server error"
}
```

## Payouts

## u_property_owner_earnings.php

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Earnings data retrieved successfully",
  "current_wallet_balance": 12345.67,
  "earning_stats": {
    "total_earnings": 10000,
    "total_payouts": 5000,
    "pending_payouts": 1000,
    "total_transactions": 100,
    "average_transaction_value": 100
  },
  "recent_payouts": [
    {
      "id": 1,
      "amount": 1000,
      "status": "completed",
      "payout_method": "bank_transfer",
      "bank_name": "Example Bank",
      "account_number": "1234567890",
      "account_name": "John Doe",
      "created_at": "2023-10-27T10:00:00Z"
    }
  ],
  "total_payouts_count": 10,
  "current_page": 1,
  "total_pages": 2
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Missing user ID!"
}
```

## u_property_owner_payout_history.php

**Request:**

```json
{
  "uid": "1",
  "page": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payout history retrieved successfully",
  "payouts": [
    {
      "id": 1,
      "amount": 5000,
      "status": "completed",
      "payout_method": "bank_transfer",
      "bank_name": "Example Bank",
      "account_number": "1234567890",
      "account_name": "John Doe",
      "created_at": "2023-10-27T10:00:00Z"
    }
  ],
  "total_payouts": 10,
  "current_page": 1,
  "total_pages": 2
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Missing user ID!"
}
```

## u_property_owner_payout_request.php

**Request:**

```json
{
  "uid": "1",
  "amount": "5000",
  "bank_name": "Example Bank",
  "account_number": "1234567890",
  "account_name": "John Doe",
  "phone": "237690123456"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payout request submitted successfully!",
  "payout_id": "PAYOUT_1234567890_1",
  "amount": 5000,
  "status": "pending"
}
```

**Response (Error - Insufficient Balance):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Insufficient wallet balance for payout!"
}
```

**Response (Error - Below Minimum):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Payout amount is below minimum threshold!"
}
```

## request_withdraw.php

**Request:**

```json
{
  "owner_id": "1",
  "amt": "5000",
  "r_type": "bank_transfer",
  "acc_number": "1234567890",
  "bank_name": "Example Bank",
  "acc_name": "John Doe",
  "ifsc_code": "EXBK0001234",
  "upi_id": "",
  "paypal_id": ""
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payout Request Submit Successfully!!"
}
```

**Response (Error - Above Withdraw Limit):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "You can't Withdraw Above Your Withdraw Limit!"
}
```

**Response (Error - Above Earnings):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "You can't Withdraw Above Your Earning!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## payout_list.php

**Request:**

```json
{
  "owner_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payout List Get Successfully!!!",
  "Payoutlist": [
    {
      "payout_id": 1,
      "amt": 5000,
      "status": "pending",
      "proof": "images/proof/1.jpg",
      "r_date": "2023-10-27T10:00:00Z",
      "r_type": "bank_transfer",
      "acc_number": "1234567890",
      "bank_name": "Example Bank",
      "acc_name": "John Doe",
      "ifsc_code": "EXBK0001234",
      "upi_id": "",
      "paypal_id": ""
    }
  ]
}
```

**Response (No Data):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payout List Not Found!!",
  "Payoutlist": []
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went wrong  try again !"
}
```

## Gallery & Media

## gallery_list.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "gallerylist": [
    {
      "id": 1,
      "property_title": "Luxury Apartment",
      "property_id": 1,
      "category_title": "Interior",
      "category_id": 1,
      "image": "images/gallery/1.jpg",
      "status": 1
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Image  List Founded!"
}
```

**Response (No Data):**

```json
{
  "gallerylist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Gallery Image List Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## add_gallery.php

**Request:**

```json
{
  "status": "1",
  "prop_id": "1",
  "cat_id": "1",
  "uid": "1",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Image Add Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Gallery Image Add On Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## update_gallery.php

**Request:**

```json
{
  "status": "1",
  "prop_id": "1",
  "cat_id": "1",
  "uid": "1",
  "record_id": "1",
  "img": "0"
}
```

**Request (With Image):**

```json
{
  "status": "1",
  "prop_id": "1",
  "cat_id": "1",
  "uid": "1",
  "record_id": "1",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Image Update Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Gallery Image Update On Your Own Property!"
}
```

**Response (Error - Record Not Found):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Gallery Image Update On Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## view_gallery.php

**Request:**

```json
{
  "prop_id": "1"
}
```

**Response (Success):**

```json
{
  "gallerydata": [
    {
      "title": "Interior",
      "imglist": ["images/gallery/1.jpg", "images/gallery/2.jpg"]
    },
    {
      "title": "Exterior",
      "imglist": ["images/gallery/3.jpg", "images/gallery/4.jpg"]
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Photos Get Successfully!!!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_gallery_cat_list.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "galcatlist": [
    {
      "id": 1,
      "cat_title": "Interior",
      "property_title": "Luxury Apartment",
      "property_id": 1,
      "status": 1
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Category  List Founded!"
}
```

**Response (No Data):**

```json
{
  "galcatlist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Gallery Category List Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_gal_cat_add.php

**Request:**

```json
{
  "status": "1",
  "prop_id": "1",
  "uid": "1",
  "title": "Interior"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Category Add Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Gallery Category Add On Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_gal_cat_edit.php

**Request:**

```json
{
  "status": "1",
  "prop_id": "1",
  "uid": "1",
  "title": "Interior",
  "record_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Category Update Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Gallery Category Update On Your Own Property!"
}
```

**Response (Error - Record Not Found):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Gallery Category Update On Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## property_wise_galcat.php

**Request:**

```json
{
  "uid": "1",
  "prop_id": "1"
}
```

**Response (Success):**

```json
{
  "galcatlist": [
    {
      "id": 1,
      "cat_title": "Interior",
      "property_title": "Luxury Apartment",
      "property_id": 1,
      "status": 1
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Gallery Category   List Founded!"
}
```

**Response (No Data):**

```json
{
  "galcatlist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Gallery Category List Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## pro_image.php

**Request:**

```json
{
  "uid": "1",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "UserLogin": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "237690123456",
    "ccode": "+237",
    "wallet": 5000,
    "user_type": "customer",
    "status": 1,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  },
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Profile Image Upload Successfully!!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_sub_details.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "Subscribedetails": [
    {
      "id": 1,
      "uid": 1,
      "plan_id": 1,
      "p_name": "Mobile Money",
      "t_date": "2023-12-01 10:00:00",
      "amount": 5000,
      "day": 30,
      "plan_title": "Basic Plan",
      "plan_description": "Basic subscription plan",
      "expire_date": "2024-01-01",
      "start_date": "2023-12-01",
      "trans_id": "TXN123456789",
      "plan_image": "images/package/basic.png"
    }
  ],
  "is_subscribe": 1,
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Subscibe Information Get Successfully!!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## estate.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Estate Data Get Successfully!",
  "EstateData": {
    "Catlist": [
      {
        "id": "0",
        "title": "All",
        "img": "images/category/grid-circle.png",
        "status": "1"
      },
      {
        "id": 1,
        "title": "Apartment",
        "img": "images/category/apartment.png",
        "status": "1"
      }
    ],
    "currency": "XAF",
    "wallet": 5000,
    "Featured_Property": [
      {
        "id": 1,
        "title": "Luxury Apartment",
        "buyorrent": "rent",
        "latitude": "4.0511",
        "longtitude": "9.7679",
        "plimit": 4,
        "rate": 4,
        "city": "Douala",
        "property_type": 1,
        "beds": 2,
        "bathroom": 1,
        "sqrft": 1200,
        "image": "images/property/1.jpg",
        "price": 50000,
        "IS_FAVOURITE": 1
      }
    ],
    "cate_wise_property": [
      {
        "id": 1,
        "title": "Luxury Apartment",
        "buyorrent": "rent",
        "latitude": "4.0511",
        "longtitude": "9.7679",
        "plimit": 4,
        "rate": 4,
        "city": "Douala",
        "beds": 2,
        "bathroom": 1,
        "sqrft": 1200,
        "property_type": 1,
        "image": "images/property/1.jpg",
        "price": 50000,
        "IS_FAVOURITE": 1
      }
    ],
    "show_add_property": 1
  }
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Favorites & Reviews

## u_fav.php

**Request:**

```json
{
  "uid": "1",
  "pid": "1",
  "property_type": "1"
}
```

**Response (Success - Added to Favorites):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Successfully Saved In Favourite List!!!"
}
```

**Response (Success - Removed from Favorites):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Successfully Removed In Favourite List !!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went wrong  try again !"
}
```

## u_favlist.php

**Request:**

```json
{
  "uid": "1",
  "property_type": "0",
  "country_id": "1"
}
```

**Response (Success):**

```json
{
  "propetylist": [
    {
      "id": 1,
      "title": "Luxury Apartment",
      "rate": 4.5,
      "city": "Douala",
      "buyorrent": "rent",
      "plimit": 4,
      "property_type": 1,
      "image": "images/property/1.jpg",
      "price": 50000,
      "IS_FAVOURITE": 1
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Faviourite Property List Founded!"
}
```

**Response (No Data):**

```json
{
  "propetylist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Faviourite Property Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## review_list.php

**Request:**

```json
{
  "orag_id": "1"
}
```

**Response (Success):**

```json
{
  "reviewlist": [
    {
      "total_rate": 5,
      "rate_text": "Great property!"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Reviews List Founded!"
}
```

**Response (No Data):**

```json
{
  "reviewlist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Reviews Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Notifications & Enquiries

## notification.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "NotificationData": [
    {
      "id": 1,
      "uid": 1,
      "datetime": "2023-12-01 10:00:00",
      "title": "Booking Confirmed",
      "description": "Your booking #123 has been confirmed."
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Notification List Get Successfully!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_enquiry.php

**Request:**

```json
{
  "uid": "1",
  "prop_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Enquiry Sent Successfully!!"
}
```

**Response (Error - Already Sent):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Enquiry Already Send!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_my_enquiry.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Enquiry List Get Successfully!",
  "EnquiryData": [
    {
      "title": "Luxury Apartment",
      "image": "images/property/1.jpg",
      "name": "John Doe",
      "mobile": "+237690123456",
      "is_sell": 0
    }
  ]
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Extras

## u_extra_list.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "extralist": [
    {
      "id": 1,
      "property_title": "Luxury Apartment",
      "property_id": 1,
      "image": "images/extra/1.jpg",
      "pano": "0",
      "status": 1
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Extra Image  List Founded!"
}
```

**Response (No Data):**

```json
{
  "extralist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Extra Image List Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_extra_edit.php

**Request:**

```json
{
  "status": "1",
  "prop_id": "1",
  "uid": "1",
  "record_id": "1",
  "is_panorama": "0",
  "img": "0"
}
```

**Request (With Image):**

```json
{
  "status": "1",
  "prop_id": "1",
  "uid": "1",
  "record_id": "1",
  "is_panorama": "0",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Extra Image Update Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Extra Image Update On Your Own Property!"
}
```

**Response (Error - Record Not Found):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Extra Image Update On Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_add_exra.php

**Request:**

```json
{
  "status": "1",
  "prop_id": "1",
  "uid": "1",
  "is_panorama": "0",
  "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Extra Image Add Successfully"
}
```

**Response (Error - Not Owner):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Extra Image Add On Your Own Property!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Calendar & Availability

## calendar.php

**Request:**

```json
{
  "uid": 1,
  "property_id": 123
}
```

**Response (Success):**

```json
{
  "datelist": ["2024-06-01", "2024-06-02", "2024-06-03"],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Book Date List Founded!"
}
```

**Response (No Bookings):**

```json
{
  "datelist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Book Date List Not Founded!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_calnder.php

**Request:**

```json
{
  "pro_id": "1"
}
```

**Response (Success):**

```json
{
  "datelist": [
    {
      "check_in": "2023-12-01",
      "check_out": "2023-12-03"
    },
    {
      "check_in": "2023-12-05",
      "check_out": "2023-12-07"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "date List Founded!"
}
```

**Response (No Data):**

```json
{
  "datelist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "date Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Coupons & Offers

## u_couponlist.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "couponlist": [
    {
      "id": 1,
      "c_img": "images/coupons/1.jpg",
      "cdate": "2023-12-31",
      "c_desc": "10% off on all bookings",
      "c_value": 10,
      "coupon_code": "NEWYEAR10",
      "coupon_title": "New Year Offer",
      "min_amt": 10000
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Coupon List Founded!"
}
```

**Response (No Data):**

```json
{
  "couponlist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Coupon Not Founded!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_check_coupon.php

**Request:**

```json
{
  "uid": "1",
  "cid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Coupon Applied Successfully!!"
}
```

**Response (Error - Coupon Not Exist):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Coupon Not Exist!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## Static Data & Info

## u_country.php

**Response (Success):**

```json
{
  "CountryData": [
    {
      "id": 1,
      "name": "Cameroon",
      "code": "+237",
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Country List Get Successfully!!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_facility.php

**Request:**

```json
{}
```

**Response (Success):**

```json
{
  "facilitylist": [
    {
      "id": 1,
      "title": "Wifi",
      "img": "images/facility/wifi.png"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Type List Founded!"
}
```

**Response (No Data):**

```json
{
  "facilitylist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Property Type Not Founded!"
}
```

## u_property_type.php

**Request:**

```json
{}
```

**Response (Success):**

```json
{
  "typelist": [
    {
      "id": 1,
      "title": "Apartment"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Property Type List Founded!"
}
```

**Response (No Data):**

```json
{
  "typelist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Property Type Not Founded!"
}
```

## u_pagelist.php

**Response (Success):**

```json
{
  "pagelist": [
    {
      "id": 1,
      "name": "Home",
      "slug": "home",
      "content": "Welcome to our website.",
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Pages List Founded!"
}
```

**Response (Error):**

```json
{
  "pagelist": [],
  "ResponseCode": "200",
  "Result": "false",
  "ResponseMsg": "Pages Not Founded!"
}
```

## u_faq.php

**Response (Success):**

```json
{
  "FaqData": [
    {
      "id": 1,
      "question": "What is this app?",
      "answer": "This is a property listing and booking app.",
      "category": "general",
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Faq List Get Successfully!!"
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_getdata.php

**Request:**

```json
{
  "uid": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Wallet Balance Get Successfully!",
  "code": "ABC123",
  "signupcredit": 100,
  "refercredit": 50,
  "tax": 19.25
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Not Exist User!"
}
```

## u_paymentgateway.php

**Request:**

```json
{}
```

**Response (Success):**

```json
{
  "paymentdata": [
    {
      "id": 1,
      "title": "Mobile Money",
      "status": 1,
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Bank Transfer",
      "status": 1,
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    }
  ],
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Payment Gateway List Founded!"
}
```

## Utility/Other

## sms_type.php

**Request:**

```json
{}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "type Get Successfully!!",
  "SMS_TYPE": "otp",
  "otp_auth": "sms"
}
```

## u_check.php

**Request:**

```json
{
  "pro_id": "1",
  "check_in": "2023-12-01",
  "check_out": "2023-12-03"
}
```

**Response (Success - Available):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "That Date Range Available!"
}
```

**Response (Error - Already Booked):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "That Date Range Already Booked!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_rate_update.php

**Request:**

```json
{
  "uid": "1",
  "book_id": "1",
  "total_rate": 5,
  "rate_text": "Great stay!"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Rate Updated Successfully!!!"
}
```

**Response (Error - Missing Parameters):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_dashboard.php

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Dashboard data fetched successfully!",
  "dashboard": {
    "total_properties": 10,
    "total_users": 50,
    "total_earnings": 50000,
    "total_transactions": 1000,
    "recent_activity": [
      {
        "id": 1,
        "user_id": 1,
        "type": "login",
        "created_at": "2023-10-27T10:00:00Z"
      }
    ]
  }
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```

## u_home_data.php

**Request:**

```json
{
  "uid": "1",
  "country_id": "1"
}
```

**Response (Success):**

```json
{
  "ResponseCode": "200",
  "Result": "true",
  "ResponseMsg": "Home Data Get Successfully!",
  "HomeData": {
    "Catlist": [
      {
        "id": "0",
        "title": "All",
        "img": "images/category/grid-circle.png",
        "status": "1"
      },
      {
        "id": 1,
        "title": "Apartment",
        "img": "images/category/apartment.png",
        "status": "1"
      }
    ],
    "currency": "XAF",
    "wallet": 5000,
    "Featured_Property": [
      {
        "id": 1,
        "title": "Luxury Apartment",
        "buyorrent": "rent",
        "latitude": "4.0511",
        "longtitude": "9.7679",
        "plimit": 4,
        "rate": 4,
        "city": "Douala",
        "property_type": 1,
        "beds": 2,
        "bathroom": 1,
        "sqrft": 1200,
        "image": "images/property/1.jpg",
        "price": 50000,
        "IS_FAVOURITE": 1
      }
    ],
    "cate_wise_property": [
      {
        "id": 1,
        "title": "Luxury Apartment",
        "buyorrent": "rent",
        "latitude": "4.0511",
        "longtitude": "9.7679",
        "plimit": 4,
        "rate": 4,
        "city": "Douala",
        "beds": 2,
        "bathroom": 1,
        "sqrft": 1200,
        "property_type": 1,
        "image": "images/property/1.jpg",
        "price": 50000,
        "IS_FAVOURITE": 1
      }
    ],
    "show_add_property": 1
  }
}
```

**Response (Error):**

```json
{
  "ResponseCode": "401",
  "Result": "false",
  "ResponseMsg": "Something Went Wrong!"
}
```
