# Wealth Sprint Game

## Overview

Wealth Sprint is a financial simulation game built with React and TypeScript, designed to provide a gamified experience for achieving wealth and financial independence. It integrates real-time financial scenarios, team management, and strategic decision-making within an engaging dashboard-style interface. The project aims to offer a comprehensive, interactive platform for players to navigate financial challenges and build their virtual wealth, focusing on business vision, market potential, and project ambitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript.
- **State Management**: Zustand.
- **Styling**: Tailwind CSS with a custom design system.
- **UI Components**: Radix UI primitives and shadcn/ui.
- **Build Tool**: Vite.
- **Visuals**: React Three Fiber for 3D elements and Chart.js for financial data visualization.

### Backend
- **Server**: Express.js with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **Storage**: Hybrid in-memory for development, PostgreSQL for production.

### Full-Stack Integration
- **Monorepo**: Client and server code in a single repository, sharing TypeScript interfaces.
- **API**: RESTful API with Express.js.

### Core Features
- **Game Engine**: Includes Scenario Engine, Financial Engine, and Time Engine.
- **Team Management**: Simulates employee dynamics, hiring, and skill development, with dynamic sector assignments and performance metrics.
- **State Management Stores**: Dedicated stores for game state, financial data, team management, and audio.
- **UI Sections**: Dashboard, Financial Management (combining Cashflow and Assets), Stocks/Bonds, Team, Business Deals, and Settings.
- **Mobile Build System**: Automated Android APK building via GitHub and Expo EAS.
- **Advanced Financial Management**: Consolidated interface with six-category navigation (Cashflow Overview, Income Sources, Expense Breakdown, Assets Management, Liabilities, Financial Health), including asset portfolio management and liability prepayment options.
- **Automatic Purchase Categorization**: Intelligent asset/liability categorization for purchases based on monthly cashflow impact.
- **Blockchain Integration**: Daily decision system with scenarios affecting player stats, featuring a blockchain simulation for storing decision hashes with IPFS integration.
- **Credit Card System**: Comprehensive credit card payment system with automatic fallback for store purchases and a dedicated management interface.
- **Store Redesign**: Premium beige-themed UI with a three-column layout for product display, transactions, and inventory.
- **Dynamic Sector Assignment**: Connects employee sector assignments to purchased business sectors, providing sector-specific team management and performance tracking.

### UI/UX Decisions
- **Color Scheme**: Soft beige palette (`#faf8f3`, `#e8dcc6`, `#FAF4E6`) with dark gray (`#3a3a3a`) and gold accents (`#d4af37`).
- **Component Design**: Leverages Radix UI and shadcn/ui for accessibility and customizability.
- **Icons**: Uses employee-style emojis for roles for visual consistency.
- **3D Meeting Room System**: Professional Canvas-based 3D rendering for executive boardroom visualization, integrating team data.

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