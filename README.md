# LuckyBag Admin Portal

A comprehensive admin dashboard for managing the LuckyBag gaming platform with role-based access control.

## Demo Mode

This application is currently running in **demo mode** with mock data for UI demonstration purposes.

### Quick Start

1. **Login**: Visit the login page and use any email/password combination, or click "Quick Login"
   - Demo credentials: `admin@luckybag.com` / `admin123`
   - All logins will authenticate successfully in demo mode

2. **Navigation**: Use the sidebar to explore all pages:
   - **Dashboard**: Overview with metrics, charts, and recent activity
   - **Games**: Manage games with card-based layout
   - **Users**: User management with detailed user profiles
   - **Transactions**: Transaction history with filtering
   - **Admins**: Admin account management
   - **Settings**: Platform configuration and RBAC permissions

### Features

#### Dashboard
- Key metrics cards (Total Users, Active Users, Revenue, etc.)
- Interactive charts (Game Participation, Transaction Volume)
- Recent activity feed with transaction details

#### Games Management
- Create new games with modal form
- View all games in card grid layout
- Start/Stop games based on status
- Search functionality

#### Users Management
- Searchable user table
- Detailed user profiles with tabs:
  - Profile: Basic user information
  - KYC: Verification status management
  - Balance: Credit/Debit operations with OTP confirmation
  - Games: Participation history
- Filter by KYC status

#### Transactions
- Comprehensive transaction table
- Filter by type (Credit/Debit) and status
- Summary cards showing totals
- Search by user or transaction ID

#### Admin Management
- Create new admin accounts with role selection
- Activate/Deactivate admin accounts
- Role-based badges (Super Admin, Game Manager, etc.)
- Last login tracking

#### Settings
- General: Platform configuration
- Security: 2FA, session timeout, password policies
- Notifications: Email and alert preferences
- Permissions: RBAC matrix showing all role permissions

### Design System

- **Font**: Plus Jakarta Sans
- **Theme**: Dark mode with professional color palette
- **Components**: Built with shadcn/ui
- **Layout**: Card-based, responsive design
- **Charts**: Recharts for data visualization

### Role-Based Access Control (RBAC)

Five admin roles with different permission levels:
1. **Super Admin**: Full access to all features
2. **Game Manager**: Manage games and view users/transactions
3. **User Manager**: Manage users and view transactions
4. **Finance Admin**: Manage transactions and view users
5. **Support Admin**: View-only access to dashboard, users, games, and transactions

### Mock Data

All data is currently mocked for demonstration:
- 6 sample users with different KYC statuses
- 5 games in various states (upcoming, live, completed)
- 8 transactions with different types and statuses
- 5 admin accounts with different roles
- Dashboard metrics and chart data

### Next Steps for Production

To convert this to a production-ready application:

1. **Backend Integration**:
   - Replace mock data with actual API calls
   - Implement authentication with JWT tokens
   - Add real-time data updates

2. **Database**:
   - Set up database schema for users, games, transactions, admins
   - Implement data persistence

3. **Security**:
   - Enable actual middleware authentication
   - Implement proper RBAC enforcement
   - Add API rate limiting

4. **Features**:
   - Add pagination for large datasets
   - Implement real-time notifications
   - Add export functionality for reports
   - Implement audit logging

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Project Structure

\`\`\`
app/
├── (auth)/
│   └── login/          # Login page
├── (dashboard)/
│   ├── dashboard/      # Main dashboard
│   ├── games/          # Games management
│   ├── users/          # Users management
│   │   └── [id]/       # User detail page
│   ├── transactions/   # Transactions page
│   ├── admins/         # Admin management
│   └── settings/       # Settings page
components/
├── ui/                 # shadcn/ui components
├── sidebar.tsx         # Navigation sidebar
├── navbar.tsx          # Top navigation bar
└── [modals]/          # Various modal components
lib/
├── mock-data.ts        # Mock data for demo
├── rbac.ts            # Role-based access control
└── api.ts             # API helper functions
store/
└── use-auth-store.ts  # Authentication state
types/
└── index.ts           # TypeScript type definitions
\`\`\`

### Demo Tips

- All interactive features work with mock data
- Forms validate but don't persist data
- Modals and dialogs are fully functional
- Charts are interactive with hover tooltips
- Search and filter functions work on mock data
- All navigation and routing is functional

Enjoy exploring the LuckyBag Admin Portal!
