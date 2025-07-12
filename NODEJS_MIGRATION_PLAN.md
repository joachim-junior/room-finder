# Hotel Booking Platform Migration Plan: PHP/MySQL → Node.js/Express/MongoDB

## 📋 Migration Overview

This document outlines the complete migration plan for your hotel booking platform from PHP/MySQL to Node.js/Express/MongoDB stack.

### Current Platform Analysis
- **Backend**: PHP with custom ORM-like functions
- **Database**: MySQL with structured tables
- **Features**: User management, property management, booking system, wallet integration, commission system, Fapshi payments, admin dashboard
- **Architecture**: Traditional server-side rendered PHP with API endpoints

### Target Architecture
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with JWT authentication
- **Frontend**: React.js or Vue.js (SPA) + Admin Dashboard
- **Payment**: Fapshi integration maintained
- **Deployment**: Docker containerization

## 🏗️ Migration Strategy

### Phase 1: Foundation Setup (Week 1-2)
1. **Project Structure & Dependencies**
2. **Database Schema Design**
3. **Authentication System**
4. **Basic API Framework**

### Phase 2: Core Features (Week 3-4)
1. **User Management**
2. **Property Management**
3. **Booking System**
4. **Wallet Integration**

### Phase 3: Advanced Features (Week 5-6)
1. **Commission System**
2. **Fapshi Payment Integration**
3. **Property Owner Payouts**
4. **Notification System**

### Phase 4: Admin & Frontend (Week 7-8)
1. **Admin Dashboard**
2. **User Frontend**
3. **Testing & Optimization**
4. **Deployment**

## 🗄️ Database Schema Migration

### MongoDB Collection Design

#### Users Collection
```javascript
// users
{
  _id: ObjectId,
  email: String,
  password: String, // hashed
  name: String,
  mobile: String,
  userType: String, // 'customer', 'property_owner', 'admin', 'staff'
  wallet: Number,
  status: String,
  isEmailVerified: Boolean,
  profile: {
    avatar: String,
    bio: String,
    address: String,
    city: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Properties Collection
```javascript
// properties
{
  _id: ObjectId,
  title: String,
  description: String,
  ownerId: ObjectId, // reference to users
  category: String,
  address: {
    street: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pricing: {
    basePrice: Number,
    currency: String,
    discounts: [{
      type: String, // 'weekly', 'monthly'
      percentage: Number
    }]
  },
  amenities: [String],
  images: [String],
  availability: {
    calendar: [{
      date: Date,
      isAvailable: Boolean,
      price: Number
    }],
    minStay: Number,
    maxStay: Number
  },
  stats: {
    totalBookings: Number,
    averageRating: Number,
    totalReviews: Number
  },
  status: String, // 'active', 'inactive', 'suspended'
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection
```javascript
// bookings
{
  _id: ObjectId,
  bookingId: String, // unique booking reference
  userId: ObjectId,
  propertyId: ObjectId,
  ownerId: ObjectId,
  dateRange: {
    checkIn: Date,
    checkOut: Date,
    nights: Number
  },
  pricing: {
    baseAmount: Number,
    taxes: Number,
    discounts: Number,
    totalAmount: Number,
    currency: String
  },
  payment: {
    method: String,
    walletAmount: Number,
    transactionId: String,
    status: String
  },
  commission: {
    rate: Number,
    amount: Number,
    ownerPayout: Number
  },
  guests: {
    adults: Number,
    children: Number,
    guestDetails: [{
      name: String,
      email: String,
      phone: String
    }]
  },
  status: String, // 'pending', 'confirmed', 'cancelled', 'completed'
  notifications: [{
    type: String,
    sentAt: Date,
    status: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Wallet Transactions Collection
```javascript
// walletTransactions
{
  _id: ObjectId,
  userId: ObjectId,
  transactionId: String,
  type: String, // 'topup', 'booking', 'commission', 'payout'
  amount: Number,
  currency: String,
  status: String,
  metadata: {
    bookingId: ObjectId,
    paymentMethod: String,
    fapshiChargeId: String,
    description: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Commission Tracking Collection
```javascript
// commissionTracking
{
  _id: ObjectId,
  bookingId: ObjectId,
  propertyId: ObjectId,
  ownerId: ObjectId,
  booking: {
    amount: Number,
    currency: String
  },
  commission: {
    rate: Number,
    amount: Number
  },
  ownerPayout: {
    amount: Number,
    status: String, // 'pending', 'paid', 'failed'
    paidAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Node.js Project Structure

```
hotel-booking-platform/
├── server/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── fapshi.js
│   │   └── app.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   ├── WalletTransaction.js
│   │   └── CommissionTracking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── properties.js
│   │   ├── bookings.js
│   │   ├── wallet.js
│   │   ├── admin.js
│   │   └── webhooks.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── walletController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── fapshiService.js
│   │   ├── notificationService.js
│   │   ├── emailService.js
│   │   └── commissionService.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── app.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── admin/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🔧 Key Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1",
  "express-rate-limit": "^6.10.0",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.40.0",
  "node-cron": "^3.0.2",
  "axios": "^1.5.0",
  "joi": "^17.9.2",
  "moment": "^2.29.4",
  "nodemailer": "^6.9.4",
  "onesignal-node": "^3.4.0"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "axios": "^1.5.0",
  "react-query": "^3.39.3",
  "react-hook-form": "^7.45.4",
  "react-toastify": "^9.1.3",
  "tailwindcss": "^3.3.3",
  "antd": "^5.8.6",
  "recharts": "^2.8.0"
}
```

## 🔄 API Endpoints Mapping

### Authentication
```javascript
// PHP → Node.js
POST /user_api/u_login_user.php → POST /api/auth/login
POST /user_api/u_reg_user.php → POST /api/auth/register
POST /user_api/u_forget_password.php → POST /api/auth/forgot-password
```

### Properties
```javascript
// PHP → Node.js
GET /user_api/u_property_list.php → GET /api/properties
POST /user_api/u_property_add.php → POST /api/properties
PUT /user_api/u_property_edit.php → PUT /api/properties/:id
GET /user_api/u_property_details.php → GET /api/properties/:id
```

### Bookings
```javascript
// PHP → Node.js
POST /user_api/u_book.php → POST /api/bookings
GET /user_api/u_my_book.php → GET /api/bookings/user/:userId
GET /user_api/u_book_details.php → GET /api/bookings/:id
PUT /user_api/u_book_cancle.php → PUT /api/bookings/:id/cancel
```

### Wallet
```javascript
// PHP → Node.js
POST /user_api/u_wallet_topup_fapshi.php → POST /api/wallet/topup
GET /user_api/u_wallet_report.php → GET /api/wallet/transactions
POST /user_api/fapshi_webhook.php → POST /api/webhooks/fapshi
```

## 🎯 Migration Implementation

### Step 1: Project Setup
```bash
# Create new Node.js project
mkdir hotel-booking-platform
cd hotel-booking-platform

# Initialize backend
mkdir server
cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors helmet morgan dotenv

# Initialize frontend
npx create-react-app client
cd client
npm install react-router-dom axios react-query react-hook-form

# Initialize admin panel
npx create-react-app admin
cd admin
npm install antd recharts
```

### Step 2: Database Connection
```javascript
// server/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Step 3: User Model
```javascript
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['customer', 'property_owner', 'admin', 'staff'],
    default: 'customer'
  },
  wallet: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    avatar: String,
    bio: String,
    address: String,
    city: String,
    country: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Step 4: Authentication Controller
```javascript
// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, userType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    const newUser = await User.create({
      name,
      email,
      mobile,
      password,
      userType
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
```

### Step 5: Booking Controller with Commission
```javascript
// server/controllers/bookingController.js
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const CommissionTracking = require('../models/CommissionTracking');
const commissionService = require('../services/commissionService');

exports.createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      totalAmount,
      guests,
      paymentMethod
    } = req.body;

    const userId = req.user.id;

    // Get user and property
    const user = await User.findById(userId).session(session);
    const property = await Property.findById(propertyId).session(session);

    if (!user || !property) {
      await session.abortTransaction();
      return res.status(404).json({
        status: 'error',
        message: 'User or property not found'
      });
    }

    // Check wallet balance
    if (user.wallet < totalAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient wallet balance'
      });
    }

    // Calculate commission
    const commissionData = await commissionService.calculateCommission(
      totalAmount,
      property.ownerId
    );

    // Create booking
    const booking = await Booking.create([{
      userId,
      propertyId,
      ownerId: property.ownerId,
      dateRange: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights: Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
      },
      pricing: {
        baseAmount: totalAmount,
        totalAmount,
        currency: 'FCFA'
      },
      payment: {
        method: paymentMethod,
        walletAmount: totalAmount,
        status: 'completed'
      },
      commission: commissionData,
      guests,
      status: 'confirmed'
    }], { session });

    // Update user wallet
    await User.findByIdAndUpdate(
      userId,
      { $inc: { wallet: -totalAmount } },
      { session }
    );

    // Create wallet transaction
    await WalletTransaction.create([{
      userId,
      transactionId: `BOOKING_${booking[0]._id}`,
      type: 'booking',
      amount: -totalAmount,
      currency: 'FCFA',
      status: 'completed',
      metadata: {
        bookingId: booking[0]._id,
        description: `Booking payment for ${property.title}`
      }
    }], { session });

    // Process commission
    await commissionService.processCommission(
      booking[0]._id,
      commissionData,
      session
    );

    await session.commitTransaction();

    res.status(201).json({
      status: 'success',
      data: {
        booking: booking[0]
      }
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
```

## 🔧 Data Migration Scripts

### PHP to MongoDB Migration Script
```javascript
// server/scripts/migratData.js
const mongoose = require('mongoose');
const mysql = require('mysql2');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'room-finder'
});

const migrateUsers = async () => {
  const [rows] = await mysqlConnection.promise().query('SELECT * FROM tbl_user');
  
  for (const row of rows) {
    await User.create({
      email: row.email,
      password: row.password, // Will be hashed by pre-save hook
      name: row.name,
      mobile: row.mobile,
      userType: row.rtype || 'customer',
      wallet: parseFloat(row.wallet) || 0,
      status: row.status === '1' ? 'active' : 'inactive',
      profile: {
        address: row.address,
        city: row.city,
        country: row.country
      }
    });
  }
  
  console.log('Users migrated successfully');
};

const migrateProperties = async () => {
  const [rows] = await mysqlConnection.promise().query('SELECT * FROM tbl_property');
  
  for (const row of rows) {
    const owner = await User.findOne({ email: row.owner_email });
    
    await Property.create({
      title: row.title,
      description: row.description,
      ownerId: owner._id,
      category: row.category,
      address: {
        street: row.address,
        city: row.city,
        country: row.country
      },
      pricing: {
        basePrice: parseFloat(row.price),
        currency: 'FCFA'
      },
      amenities: row.amenities ? row.amenities.split(',') : [],
      images: row.images ? row.images.split(',') : [],
      status: row.status === '1' ? 'active' : 'inactive'
    });
  }
  
  console.log('Properties migrated successfully');
};

const migrateBookings = async () => {
  const [rows] = await mysqlConnection.promise().query('SELECT * FROM tbl_book');
  
  for (const row of rows) {
    const user = await User.findOne({ /* match by ID or email */ });
    const property = await Property.findOne({ /* match by ID or title */ });
    
    await Booking.create({
      userId: user._id,
      propertyId: property._id,
      ownerId: property.ownerId,
      dateRange: {
        checkIn: new Date(row.check_in),
        checkOut: new Date(row.check_out),
        nights: parseInt(row.total_day)
      },
      pricing: {
        baseAmount: parseFloat(row.subtotal),
        totalAmount: parseFloat(row.total),
        currency: 'FCFA'
      },
      payment: {
        method: 'wallet',
        walletAmount: parseFloat(row.wall_amt),
        status: 'completed'
      },
      status: row.book_status.toLowerCase()
    });
  }
  
  console.log('Bookings migrated successfully');
};

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Starting data migration...');
    await migrateUsers();
    await migrateProperties();
    await migrateBookings();
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
```

## 🎨 Frontend Architecture

### React Components Structure
```javascript
// client/src/components/layout/
├── Header.js
├── Footer.js
├── Sidebar.js
└── Layout.js

// client/src/components/property/
├── PropertyList.js
├── PropertyCard.js
├── PropertyDetail.js
├── PropertyForm.js
└── PropertySearch.js

// client/src/components/booking/
├── BookingForm.js
├── BookingList.js
├── BookingDetail.js
└── BookingCalendar.js

// client/src/components/wallet/
├── WalletDashboard.js
├── TopupForm.js
├── TransactionHistory.js
└── WalletBalance.js
```

### State Management with React Query
```javascript
// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Auth API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile')
};

// Properties API
export const propertyAPI = {
  getProperties: (params) => API.get('/properties', { params }),
  getProperty: (id) => API.get(`/properties/${id}`),
  createProperty: (data) => API.post('/properties', data),
  updateProperty: (id, data) => API.put(`/properties/${id}`, data),
  deleteProperty: (id) => API.delete(`/properties/${id}`)
};

// Bookings API
export const bookingAPI = {
  createBooking: (data) => API.post('/bookings', data),
  getBookings: (params) => API.get('/bookings', { params }),
  getBooking: (id) => API.get(`/bookings/${id}`),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`)
};

// Wallet API
export const walletAPI = {
  getBalance: () => API.get('/wallet/balance'),
  topup: (data) => API.post('/wallet/topup', data),
  getTransactions: (params) => API.get('/wallet/transactions', { params })
};
```

## 🔒 Security Implementation

### JWT Authentication Middleware
```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
```

## 📊 Performance Optimization

### Database Indexing
```javascript
// server/models/User.js
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'profile.city': 1 });

// server/models/Property.js
propertySchema.index({ ownerId: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ 'address.coordinates': '2dsphere' });
propertySchema.index({ status: 1 });
propertySchema.index({ 'pricing.basePrice': 1 });

// server/models/Booking.js
bookingSchema.index({ userId: 1 });
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ ownerId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'dateRange.checkIn': 1, 'dateRange.checkOut': 1 });
bookingSchema.index({ createdAt: -1 });
```

### Caching Strategy
```javascript
// server/middleware/cache.js
const redis = require('redis');
const client = redis.createClient();

const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    
    try {
      const cached = await client.get(key);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;
```

## 🐳 Docker Configuration

### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/hotel_booking
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  mongo_data:
```

## 🚀 Deployment Strategy

### Environment Configuration
```javascript
// server/config/config.js
module.exports = {
  development: {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking_dev',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    FAPSHI_API_KEY: process.env.FAPSHI_API_KEY,
    FAPSHI_SECRET: process.env.FAPSHI_SECRET,
    FAPSHI_SANDBOX: true
  },
  production: {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    FAPSHI_API_KEY: process.env.FAPSHI_API_KEY,
    FAPSHI_SECRET: process.env.FAPSHI_SECRET,
    FAPSHI_SANDBOX: false
  }
};
```

## 📈 Benefits of Migration

### Technical Benefits
1. **Modern Stack**: Latest technologies and practices
2. **Scalability**: Better horizontal scaling with Node.js
3. **Performance**: Faster API responses, non-blocking I/O
4. **Developer Experience**: Better tooling and debugging
5. **Mobile-First**: Better API design for mobile apps

### Business Benefits
1. **Faster Development**: More rapid feature development
2. **Better Maintenance**: Easier to maintain and update
3. **Team Productivity**: More developers familiar with Node.js
4. **Cost Effective**: Better resource utilization
5. **Future-Proof**: Modern architecture for growth

## 🕐 Migration Timeline

### Week 1-2: Foundation
- [ ] Set up Node.js/Express project structure
- [ ] Configure MongoDB connection
- [ ] Implement authentication system
- [ ] Create basic API framework

### Week 3-4: Core Features
- [ ] Migrate user management
- [ ] Implement property management
- [ ] Build booking system
- [ ] Integrate wallet functionality

### Week 5-6: Advanced Features
- [ ] Commission system implementation
- [ ] Fapshi payment integration
- [ ] Property owner payout system
- [ ] Notification system

### Week 7-8: Frontend & Deployment
- [ ] Build React frontend
- [ ] Create admin dashboard
- [ ] Testing and optimization
- [ ] Production deployment

### Week 9-10: Testing & Launch
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Go live with migration

## 🎯 Success Metrics

### Technical Metrics
- **API Response Time**: < 200ms average
- **Database Query Performance**: < 50ms average
- **System Uptime**: > 99.9%
- **Error Rate**: < 0.1%

### Business Metrics
- **User Experience**: Improved page load times
- **Development Speed**: 50% faster feature development
- **Maintenance Cost**: 40% reduction in maintenance time
- **Scalability**: Handle 10x more concurrent users

The migration to Node.js/Express/MongoDB is not only possible but highly recommended for your hotel booking platform. This modern stack will provide better performance, scalability, and developer experience while maintaining all your existing features including the Fapshi payment integration and commission system.

Would you like me to start implementing any specific part of this migration plan?