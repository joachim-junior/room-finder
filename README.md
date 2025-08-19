# Room Finder Admin Dashboard

A modern, responsive admin dashboard for the Room Finder platform built with Next.js 14, TypeScript, and shadcn/ui.

## Features

- **🔐 Authentication**: Secure admin login with JWT tokens
- **📊 Dashboard Overview**: Key metrics and platform statistics
- **👥 User Management**: View, filter, and manage users
- **🏠 Property Management**: Monitor and verify property listings
- **📅 Booking Management**: Track and manage bookings (coming soon)
- **📈 Analytics**: Platform performance insights (coming soon)
- **⚙️ Settings**: System configuration (coming soon)
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, minimal design with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Tables**: Custom implementation with shadcn/ui
- **Charts**: Recharts (ready for implementation)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd admin-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Default Login Credentials

Use the credentials from your backend API:

- Email: `admin@roomfinder.com`
- Password: `admin123`

## Project Structure

```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/          # Login page
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── users/          # User management
│   │   │   ├── properties/     # Property management
│   │   │   ├── bookings/       # Booking management
│   │   │   ├── analytics/      # Analytics & reports
│   │   │   └── settings/       # System settings
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   ├── tables/             # Data table components
│   │   └── charts/             # Chart components
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── store/                  # Zustand stores
├── public/
└── package.json
```

## API Integration

The dashboard connects to your backend API with the following endpoints:

### Authentication

- `POST /auth/login` - Admin login

### User Management

- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user by ID
- `PUT /admin/users/:id` - Update user
- `PUT /admin/users/:id/suspend` - Suspend user

### Property Management

- `GET /admin/properties` - Get all properties
- `PUT /admin/properties/:id/verify` - Verify property
- `DELETE /admin/properties/:id` - Delete property

### Analytics

- `GET /admin/analytics/overview` - Platform overview
- `GET /admin/analytics/revenue` - Revenue analytics

## Key Components

### Dashboard Layout

- Responsive sidebar navigation
- Mobile-friendly design
- User authentication state management

### User Management

- Search and filter users
- Role-based filtering (Admin, Host, Guest)
- Verification status management
- User statistics

### Property Management

- Property listing with verification status
- Host information display
- Property statistics

## Development

### Adding New Features

1. **New Page**: Create a new route in `src/app/(dashboard)/`
2. **New Component**: Add to appropriate folder in `src/components/`
3. **API Integration**: Extend `src/lib/api.ts`
4. **State Management**: Add to Zustand store if needed

### Styling Guidelines

- Use Tailwind CSS classes
- Follow shadcn/ui design patterns
- Maintain consistent spacing and typography
- Use semantic color variables

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
