# Wealth Sprint Game

## Overview

Wealth Sprint is a financial simulation game built with React and TypeScript, designed to provide a gamified experience for achieving wealth and financial independence. It integrates real-time financial scenarios, team management, and strategic decision-making within an engaging dashboard-style interface. The project aims to offer a comprehensive, interactive platform for players to navigate financial challenges and build their virtual wealth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript.
- **State Management**: Zustand for reactive state management.
- **Styling**: Tailwind CSS with a custom design system.
- **UI Components**: Radix UI primitives and shadcn/ui components for a consistent design language.
- **Build Tool**: Vite for optimized development and production builds.
- **Visuals**: React Three Fiber for potential 3D elements and Chart.js for financial data visualization.

### Backend
- **Server**: Express.js with TypeScript.
- **Database**: PostgreSQL managed with Drizzle ORM for type-safe queries and schema management.
- **Storage**: Hybrid in-memory for development, PostgreSQL for production.

### Full-Stack Integration
- **Monorepo**: Client and server code reside in a single repository, sharing TypeScript interfaces.
- **API**: RESTful API built with Express.js.

### Core Features
- **Game Engine**: Includes a Scenario Engine for dynamic financial events, a Financial Engine for calculations, and a Time Engine for background progression.
- **Team Management**: Simulates employee dynamics and relationships.
- **State Management Stores**: Dedicated stores for game state, financial data, team management, and audio.
- **UI Sections**: Dashboard, Cashflow, Stocks/Bonds, Team, Business Deals, and Settings.
- **Mobile Build System**: Automated Android APK building via GitHub and Expo EAS, including real-time build monitoring and error handling.
- **Advanced Team Management**: Consolidated interface for team overview, hiring, and skill development, featuring dynamic sector assignments and performance metrics.

### UI/UX Decisions
- **Color Scheme**: Predominantly uses a soft beige color palette (`#faf8f3`, `#e8dcc6`, `#FAF4E6`) with complementary dark gray (`#3a3a3a`) and gold accents (`#d4af37`) for a minimalist and consistent aesthetic.
- **Component Design**: Leverages Radix UI and shadcn/ui for accessible and customizable components.
- **Icons**: Uses employee-style emojis for roles and maintains visual consistency across sections.

## External Dependencies

### Frontend
- **UI Framework**: React
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **3D Graphics**: React Three Fiber
- **Charts**: Chart.js
- **Audio**: Native HTML5 Audio API

### Backend
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle
- **Server**: Express.js
- **Session Management**: Connect-pg-simple

### Development Tools
- **Build System**: Vite
- **Language**: TypeScript