# Frontend Implementation Guide

## Project Structure Overview

This guide covers **two separate frontend projects**:

1. **Property Website** (`property-website/`) - Airbnb-like guest house booking platform
2. **Admin Dashboard** (`admin-dashboard/`) - Administrative interface for managing the platform

## Project 1: Property Website (`property-website/`)

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Zustand
- **Authentication**: NextAuth.js
- **Maps**: Mapbox or Google Maps
- **Payment**: Fapshi integration
- **Deployment**: Vercel

### Project Structure

```
property-website/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (property)/
│   │   │   ├── properties/
│   │   │   ├── property/[id]/
│   │   │   └── search/
│   │   ├── (user)/
│   │   │   ├── profile/
│   │   │   ├── bookings/
│   │   │   ├── wallet/
│   │   │   └── notifications/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── property/
│   │   ├── booking/
│   │   └── common/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   └── store/
├── public/
├── package.json
└── tailwind.config.js
```

### Key Features

- **Homepage**: Hero section, featured properties, search functionality
- **Property Listings**: Grid/list view, filters, sorting, pagination
- **Property Details**: Image gallery, amenities, reviews, booking calendar
- **Search & Filters**: Location, dates, price, property type, amenities
- **User Authentication**: Login, register, profile management
- **Booking System**: Calendar selection, payment integration, confirmation
- **User Dashboard**: Bookings history, wallet, notifications
- **Reviews & Ratings**: Property reviews, user ratings
- **Responsive Design**: Mobile-first approach

## Project 2: Admin Dashboard (`admin-dashboard/`)

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Zustand
- **Authentication**: NextAuth.js
- **Charts**: Recharts or Chart.js
- **Tables**: TanStack Table
- **Deployment**: Vercel

### Project Structure

```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── properties/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── tables/
│   │   └── charts/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   └── store/
├── public/
├── package.json
└── tailwind.config.js
```

### Key Features

- **Dashboard Overview**: Key metrics, charts, recent activity
- **User Management**: User list, details, verification, role management
- **Property Management**: Property listings, verification, approval workflow
- **Booking Management**: Booking overview, status updates, refunds
- **Payment Management**: Transaction history, payment status, refunds
- **Analytics**: Revenue charts, booking trends, user growth
- **System Settings**: Platform configuration, notifications, fees
- **Content Management**: Property types, amenities, locations
- **Reports**: Financial reports, user reports, property reports

## Implementation Phases

### Phase 1: Project Setup

1. Create both projects using `create-next-app`
2. Set up shadcn/ui in both projects
3. Configure TypeScript and ESLint
4. Set up project structure and routing

### Phase 2: Authentication & Core Setup

1. Implement authentication system
2. Set up API integration layer
3. Create basic layouts and navigation
4. Implement protected routes

### Phase 3: Property Website Development

1. Homepage and property listings
2. Property detail pages
3. Search and filtering
4. Booking system
5. User dashboard

### Phase 4: Admin Dashboard Development

1. Dashboard overview
2. User management
3. Property management
4. Booking management
5. Analytics and reports

### Phase 5: Integration & Testing

1. API integration testing
2. Payment system integration
3. Notification system
4. Performance optimization
5. Deployment preparation

## API Integration

Both projects will use the same backend API endpoints documented in `API_DOCUMENTATION.md`. The main differences are:

- **Property Website**: Focuses on user-facing features (browsing, booking, user profile)
- **Admin Dashboard**: Focuses on administrative features (management, analytics, system settings)

## Development Workflow

1. **Start with Property Website**: Build the main user-facing application first
2. **Then Admin Dashboard**: Build the administrative interface
3. **Parallel Development**: Both projects can be developed simultaneously once core structure is in place
4. **Shared Components**: Consider creating a shared component library if there's overlap

## Deployment Strategy

- **Property Website**: Deploy to Vercel for optimal performance and SEO
- **Admin Dashboard**: Deploy to Vercel with restricted access
- **Environment Variables**: Separate environment configurations for each project
- **Domain Strategy**:
  - Property Website: `roomfinder.com` (main domain)
  - Admin Dashboard: `admin.roomfinder.com` (subdomain)

## Next Steps

1. Create the Property Website project first
2. Set up the basic structure and authentication
3. Implement core property browsing features
4. Then create the Admin Dashboard project
5. Implement administrative features
6. Integrate both with the backend API

This approach ensures a clean separation of concerns and allows for independent development and deployment of each application.
