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

## Recent Implementation Changes

- August 12, 2025. Wallet System Removal & Banking Redesign: Completely removed wallet balance (inHandCash) and all wallet-related functionality from the game architecture. Eliminated transferToWallet, transferFromWallet, and spendFromWallet functions from the game store. Updated BankSection to remove wallet UI components and transaction interfaces. Renamed "Transfer" tab to "Credit card" featuring premium credit card management interface with gradient card design, available credit display, and high-interest rate warnings. Simplified banking architecture to single account system with bank balance as primary financial source. Updated financial data interface to remove inHandCash property and related transaction types. This creates a unified banking-centered architecture where all financial operations flow through the main bank account.
- August 11, 2025. Complete Store Redesign: Rebuilt entire store section with premium beige-themed UI (#F5F5DC background) following detailed mockup specifications. Implemented three-column layout: left category bar (20%), middle scrollable product cards (60%), right transaction/inventory panel (20%). Features include: 12 premium items with exact pricing and monthly cashflow (Small Apartment ₹45K +₹500/mo, Luxury Villa ₹250K +₹5K/mo, etc.), elegant serif typography for product titles, deep green buy buttons (#2E7D4A), gold accent info buttons (#D4AF37), monthly cashflow pills with coin icons, purchase confirmation modals, recent transactions display, and inventory thumbnail grid. Removed old grid-based store interface in favor of mobile-focused card-list design with warm premium aesthetic.
- August 10, 2025. Implemented Dynamic Sector Assignment System: Connected employee sector assignments to purchased business sectors from Industry Sectors section, replacing static sector list with dynamic mapping (Fast Food, Tech Startups, E-commerce, Healthcare). Added sector status display showing current employee assignments with income boost percentages, fixed experience display to show "0 year" in single row format, created new "Team Performance" section with comprehensive employee performance metrics including sector roles, monthly contributions, company growth impact, and detailed performance tracking. Integrated navigation between Team Performance and Team Management sections, enabling seamless workflow from viewing performance to managing assignments and hiring.
- August 10, 2025. Created Sector-Specific Team Management: Removed global team performance overview and unassigned member displays from business sector Team tabs. Built new SectorTeamSection component that shows only employees assigned to specific sectors (e.g., Fast Food sector shows only Fast Food employees). Each business sector now has its own dedicated Team tab displaying sector-specific metrics: team size, average performance, monthly contribution, and detailed employee cards with sector-specific roles and performance data. This provides focused team management per sector, eliminating cross-sector confusion and enabling targeted sector workforce optimization.