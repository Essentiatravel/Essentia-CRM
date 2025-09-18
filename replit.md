# TourGuide CRM - Replit Setup

## Overview
TourGuide CRM is a comprehensive Customer Relationship Management system for tourism companies, built with modern web technologies. The system enables tour operators to manage bookings, clients, guides, and tours through an intuitive Kanban-style interface.

## Architecture
- **Monorepo Structure**: Uses Turborepo for managing multiple packages
- **Frontend**: Next.js 15 with React 19, running on port 5000
- **Backend**: tRPC API integrated within Next.js, running on port 3000
- **Database**: SQLite with Drizzle ORM for local development
- **UI**: Tailwind CSS with shadcn/ui components

## Recent Changes (2025-09-18)
- ✅ Configured for Replit environment
- ✅ Fixed port configuration (frontend on 5000, backend on 3000)
- ✅ Updated Next.js config for Replit proxy compatibility
- ✅ Set up SQLite database with migrations and sample data
- ✅ Configured production deployment for autoscale
- ✅ Set up development workflow

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
- `npm run db:migrate` - Apply migrations
- `npm run db:seed` - Populate with sample data
- `npm run db:studio` - Open database GUI

## Key Features
- 🎯 Kanban-style booking management
- 👥 Multi-user system (Admin, Guide, Client)
- 📊 Real-time dashboard with metrics
- 🗺️ Tour management with categories
- 💰 Financial tracking and commission system
- 📱 Responsive mobile-first design
- 🔄 Drag-and-drop task management

## User Preferences
- Language: Portuguese (Brazilian)
- Default admin credentials: admin@turguide.com / admin123
- Database: SQLite for simplicity in development
- UI: Modern dark/light theme support

## Deployment Configuration
- Type: Autoscale (stateless web application)
- Build: `npm run build`
- Start: `npm start`
- Port: 5000 (frontend), 3000 (backend)