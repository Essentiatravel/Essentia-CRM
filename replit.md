# TourGuide CRM - Replit Setup

## Overview
TourGuide CRM is a comprehensive Customer Relationship Management system for tourism companies, built with modern web technologies. The system enables tour operators to manage bookings, clients, guides, and tours through an intuitive Kanban-style interface.

## Architecture
- **Monorepo Structure**: Uses Turborepo for managing multiple packages
- **Frontend**: Next.js 15 with React 19, running on port 5000
- **Backend**: tRPC API integrated within Next.js, running on port 3000
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect) with session management
- **UI**: Tailwind CSS with shadcn/ui components

## Recent Changes (2025-09-18)
- ✅ Configured for Replit environment
- ✅ Fixed port configuration (frontend on 5000, backend on 3000)
- ✅ Updated Next.js config for Replit proxy compatibility
- ✅ Migrated from SQLite to PostgreSQL with Neon integration
- ✅ Integrated Replit Auth (OpenID Connect) authentication system
- ✅ Created authentication API routes and user context
- ✅ Updated React components to use new auth system
- ✅ Configured production deployment for autoscale
- ⚠️ Authentication system partially implemented (requires environment fixes)

## Project Structure
```
turguide/
├── apps/
│   ├── web/          # Next.js frontend (port 5000)
│   └── server/       # tRPC API backend (port 3000)
├── scripts/          # Database scripts
├── docs/             # Documentation
└── package.json      # Monorepo root
```

## Development Commands
- `npm run dev:web` - Start frontend only (port 5000)
- `npm run dev:server` - Start backend only (port 3000) 
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run start` - Start production server

## Database Commands
- `npm run db:generate` - Generate migrations
- `npm run db:push` - Apply schema changes to database (recommended)
- `npm run db:seed` - Populate with sample data
- `npm run db:studio` - Open database GUI

## Authentication Commands
- Login: Navigate to `/api/login` (will redirect to Replit Auth)
- Logout: Navigate to `/api/logout` (clears session and redirects)
- User Status: Check `/api/auth/user` (returns user data or 401)

## Key Features
- 🎯 Kanban-style booking management
- 👥 Multi-user system with Replit Auth integration
- 📊 Real-time dashboard with metrics
- 🗺️ Tour management with categories
- 💰 Financial tracking and commission system
- 📱 Responsive mobile-first design
- 🔄 Drag-and-drop task management
- 🔐 Secure OAuth authentication with Google, GitHub, Apple, email
- 🗄️ PostgreSQL database with automatic user management

## User Preferences
- Language: Portuguese (Brazilian)
- Authentication: Replit Auth integration for secure login
- Database: PostgreSQL for production-ready scalability
- UI: Modern dark/light theme support

## Authentication System Status

### ✅ Completed Implementation
- **Database Migration**: Successfully migrated from SQLite to PostgreSQL with Neon
- **Schema Update**: Added users and sessions tables for Replit Auth
- **API Routes**: Created `/api/login`, `/api/logout`, `/api/callback`, `/api/auth/user` endpoints
- **Authentication Context**: Updated React context to use React Query with Replit Auth
- **Integration Setup**: Installed and configured OpenID Connect with memoization
- **UI Integration**: Updated components and providers for new auth system

### ⚠️ Critical Issues to Resolve

#### 1. Environment Configuration (BLOCKING)
- **Issue**: DATABASE_URL and other environment variables not accessible to Next.js runtime
- **Impact**: `/api/auth/user` returns 500 error, blocking user authentication
- **Solution**: Set environment variables in Replit Secrets:
  ```
  DATABASE_URL=<neon-database-url>
  REPL_ID=<your-repl-id>
  REPLIT_DOMAINS=<your-repl-domain>
  ISSUER_URL=https://replit.com/oidc
  SESSION_SECRET=<secure-random-string>
  ```

#### 2. Database Schema Application
- **Issue**: Need to ensure migrations are applied to production database
- **Solution**: Run `cd apps/server && npm run db:push` to apply schema changes

#### 3. Security Vulnerabilities (CRITICAL)
- **OAuth Flow**: Missing state/nonce/PKCE protection (CSRF vulnerability)
- **Session Storage**: Using unsigned cookies with raw tokens (impersonation risk)
- **Token Management**: Not using sessions table for server-side session storage

### 🔧 Next Steps
1. **Fix Environment**: Configure Replit Secrets with required variables
2. **Apply Migrations**: Ensure database schema is up-to-date
3. **Security Hardening**: Implement proper OAuth flow with state verification
4. **Session Management**: Use signed cookies and server-side session storage
5. **Testing**: Verify complete authentication flow works end-to-end

### 🔐 Authentication Flow (Once Fixed)
1. User clicks login → redirects to `/api/login`
2. Replit Auth handles OAuth flow with Google/GitHub/Apple/Email
3. Callback to `/api/callback` creates/updates user in database
4. Session stored securely and user redirected to dashboard
5. Protected routes check authentication via `/api/auth/user`

## Deployment Configuration
- Type: Autoscale (stateless web application)
- Build: `npm run build`
- Start: `npm start`
- Port: 5000 (frontend), 3000 (backend)