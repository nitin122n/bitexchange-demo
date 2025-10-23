# bit_exchange - Admin CRM Dashboard

A full-stack demo project showcasing an admin CRM-style dashboard web application for cryptocurrency exchange management. Built with Next.js, TypeScript, TailwindCSS, and MySQL with Prisma ORM.

## 🚀 Features

- **Role-based Authentication**: JWT-based auth with Super Admin, Admin, and Co Admin roles
- **Dashboard**: Summary cards, pending deposits table, and real-time market ticker
- **Master Access Management**: Create, view, and delete master access users
- **Payment Gateway**: TRC20 wallet generation with QR codes for deposits
- **Market Ticker**: Real-time cryptocurrency price display (mock data)
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Modern UI**: Soft/pale color palette with gradients and animations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, JWT Authentication
- **Database**: MySQL with Prisma ORM
- **Styling**: TailwindCSS with custom pale color palette
- **QR Generation**: qrcode library for wallet QR codes
- **Icons**: Heroicons (SVG icons)

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd bit_exchange
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/bit_exchange"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Optional: NextAuth (if using NextAuth instead of custom JWT)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with demo data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔐 Demo Credentials

The seed script creates three demo accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Super Admin** | `owner@bit_exchange.com` | `OwnerPass@2025` | Full access including user management |
| **Admin** | `admin@bit_exchange.com` | `AdminPass@2025` | Full access except creating admins |
| **Co Admin** | `coadmin@bit_exchange.com` | `CoAdminPass@2025` | Limited access, view-only for some sections |

## 📁 Project Structure

```
bit_exchange/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── market/        # Market data endpoints
│   │   ├── payment/       # Payment processing
│   │   └── master-access/ # Master access management
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── master-access/    # Master access page
│   ├── payment-gateway/  # Payment gateway page
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   ├── Layout.tsx        # Main layout wrapper
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── TopMarketTicker.tsx # Market ticker component
│   ├── Card.tsx          # Card components
│   ├── Table.tsx         # Table components
│   ├── Modal.tsx         # Modal components
│   └── QRViewer.tsx      # QR code display
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seed script
└── tailwind.config.js    # TailwindCSS configuration
```

## 🎨 Design System

### Color Palette

The application uses a soft/pale color palette defined in `tailwind.config.js`:

- **Pale Blue**: `#f0f9ff` to `#0c4a6e`
- **Pale Teal**: `#f0fdfa` to `#134e4a`
- **Soft Indigo**: `#eef2ff` to `#312e81`
- **Muted Gray**: `#f9fafb` to `#111827`

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Tables**: Clean design with alternating row colors
- **Modals**: Centered with backdrop blur
- **Forms**: Clean inputs with focus states

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Market Data
- `GET /api/market/ticker` - Get market ticker data

### Payment Processing
- `POST /api/payment/trc20/generate` - Generate TRC20 wallet and QR
- `GET /api/payment/trc20/status/:tradeId` - Check deposit status

### Master Access
- `GET /api/master-access` - List master access users
- `POST /api/master-access` - Create master access user
- `DELETE /api/master-access/:id` - Delete master access user

### Deposits
- `GET /api/deposits` - List deposits with filtering
- `PUT /api/deposits/:id/status` - Update deposit status

## 🗄 Database Schema

### Users Table
```sql
- id: String (Primary Key)
- email: String (Unique)
- passwordHash: String
- role: Enum (SUPER_ADMIN, ADMIN, CO_ADMIN)
- name: String?
- createdAt: DateTime
- updatedAt: DateTime
```

### MasterAccess Table
```sql
- id: String (Primary Key)
- email: String (Unique)
- password: String (Plain text for demo)
- category: String
- createdAt: DateTime
- updatedAt: DateTime
```

### Deposits Table
```sql
- id: String (Primary Key)
- userEmail: String
- tradeId: String (Unique)
- method: String
- amount: Float
- currency: String
- date: DateTime
- status: Enum (PENDING, APPROVED, REJECTED, COMPLETED)
- walletAddress: String?
- qrDataUrl: String?
- createdAt: DateTime
- updatedAt: DateTime
```

## 🔒 Role-Based Access Control

### Super Admin
- ✅ Full access to all features
- ✅ Create/edit/delete master access users
- ✅ Approve/reject deposits
- ✅ View all data and export functionality

### Admin
- ✅ Full access except user management
- ✅ Approve/reject deposits
- ✅ View all data and export functionality
- ❌ Cannot create/delete master access users

### Co Admin
- ✅ View dashboard and basic data
- ✅ Limited access to most features
- ❌ Cannot approve deposits
- ❌ Cannot manage users or master access

## 🚀 Production Deployment

### Environment Variables
```env
# Production database
DATABASE_URL="mysql://user:password@host:3306/bit_exchange"

# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-production-jwt-secret"

# Optional: NextAuth
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

### Security Considerations

1. **Password Hashing**: Currently using bcryptjs with 12 salt rounds
2. **JWT Security**: Use strong secrets and consider shorter expiration times
3. **Database**: Use connection pooling and proper indexing
4. **CORS**: Configure appropriate CORS policies
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Input Validation**: Add comprehensive input validation
7. **Error Handling**: Implement proper error logging and monitoring

### Real Blockchain Integration

To integrate with real blockchain networks:

1. **Replace Demo Wallet Generation**:
   ```typescript
   // Replace generateDemoTRC20Address() in lib/utils.ts
   // Use proper wallet libraries like:
   // - TronWeb for TRON/TRC20
   // - Web3.js for Ethereum/ERC20
   ```

2. **Real Market Data**:
   ```typescript
   // Replace mock data in app/api/market/ticker/route.ts
   // Use APIs like:
   // - CoinGecko API
   // - TradingView Widget
   // - Alpha Vantage
   ```

3. **Transaction Monitoring**:
   ```typescript
   // Add blockchain monitoring services:
   // - TronGrid API for TRON
   // - Infura/Alchemy for Ethereum
   // - WebSocket connections for real-time updates
   ```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for demonstration purposes. Please ensure proper licensing for production use.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify MySQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Authentication Issues**:
   - Clear localStorage: `localStorage.clear()`
   - Check JWT_SECRET is set
   - Verify user exists in database

3. **Build Errors**:
   - Run `npm run db:generate`
   - Clear `.next` folder
   - Reinstall dependencies

4. **QR Code Not Displaying**:
   - Check qrcode library installation
   - Verify API response format
   - Check browser console for errors

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Ensure database is properly seeded
- Review API endpoint responses

---

**Note**: This is a demo application. For production use, implement proper security measures, real blockchain integration, and comprehensive testing.
# bit-demo
# bitexchange-demo
