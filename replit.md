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

- August 25, 2025. Section Removal: Removed "5-Year Revenue" and "Data Hub" sections completely from the navigation menu and deleted their associated component files (RevenueSection.tsx and NewDataSection.tsx). Cleaned up all references in the game state store and navigation system. This streamlines the app by removing redundant analytics sections and focusing on core financial management features.
- August 19, 2025. Professional 3D Meeting Room System Implementation: Created comprehensive executive boardroom visualization system featuring six dynamically generated 3D meeting room models (0-5 executives plus founder). Implemented professional Canvas-based 3D rendering with React Three Fiber, automatic team integration from Team Management section, and real-time board composition updates. Features include interactive 3D controls (rotate, zoom, explore), professional executive cards with role-based color coding and share percentages, comprehensive board composition display with founder positioning, and executive summary statistics. System automatically loads appropriate meeting room model based on actual hired executives, replacing previous image-based approach with sophisticated 3D visualization. Includes export functionality and professional status overlays for enhanced business presentation capabilities.
- August 17, 2025. Complete Deals Section Redesign: Replaced entire BusinessDealsSection with comprehensive new DealsSection featuring professional blue header design matching other sections (Stock Market, Banking, Revenue). Implemented four-category navigation (Overview, Opportunities, Global Business, Financials) with portfolio-based deal unlocking logic: 0 sectors = entry-level deals, 1 sector = expansion deals, 2+ sectors = synergy deals. Created sector-specific opportunities (Fast Food, Tech Startups, Healthcare, E-commerce, Real Estate, Renewable Energy) and global business deals (stocks, acquisitions, joint ventures, banking/crypto). Features comprehensive deal cards with three UI states: normal view, expanded view with terms/benefits/risks, and deep dive financial analysis. Includes AI-style interpretations, ROI tracking, cashflow timelines, risk analysis, and professional tooltip design with proper grid lines and structured layouts.
- August 15, 2025. Codebase Cleanup and Optimization: Removed unused and obsolete files to optimize project structure and reduce maintenance overhead. Deleted entire `/api` directory containing Vercel-specific endpoints (build-apk.ts, github/push-batch.ts, sage chat handlers, ai/chat.ts), removed `vite.config.vercel.ts`, `vercel.json`, and `build-vercel.js` deployment configs, cleaned up `attached_assets` directory with numerous development screenshots and temporary images, removed unused service worker `/client/public/sw.js`, and deleted temporary backup files. Fixed port conflict issue preventing server startup by restarting workflow. Project now runs cleanly with focused Replit-specific architecture eliminating Vercel deployment artifacts.
- August 14, 2025. Blockchain-Integrated Decision System Implementation: Built comprehensive daily decision system for Wealth Sprint featuring unique scenarios across 10 categories (real estate, business, transport, technology, lifestyle, unexpected events, partnerships, investments, relationships, support systems). Implemented progressive decision structure: Day 1-2 decisions, Day 2-3 decisions, Day 3-2 decisions, Day 4+ random 2-5 decisions. Created 100% unique decision scenarios for first 10 days covering realistic financial and personal challenges with specific consequences affecting player stats (emotion, stress, karma, logic, reputation, energy) and financial data. Built blockchain simulation system for storing decision hashes with IPFS integration placeholder. Features modern UI with modal decision cards showing "About — Day X" labels, clean option selection with radio buttons, comprehensive result screens with consequence visualization, and incremental stat updates. Integrated with main game loop through DecisionManager component that auto-triggers on new days. All decisions affect game state with proper consequence application and transaction logging.
- August 14, 2025. Complete Dashboard and Decision UI Redesign: Completely rebuilt dashboard with mobile-first approach using white background container to prevent overlap with beige background. Created compact layout with blue gradient financial card, 2x3 colorful stat grid (Pink Emotion, Orange Stress, Blue Logic, Purple Karma, Yellow Reputation, Green Energy), and clean status insight cards with colored left borders. Redesigned business decision interface with modern radio-button style options, colorful consequence badges, and clean white card design. Removed old beige-heavy decision modal in favor of interactive button-based selection with hover effects and visual feedback. All existing game data preserved while achieving fresh visual approach.
- August 12, 2025. Complete Credit Card System Implementation: Set default liabilities to 0 as requested. Created futuristic credit card UI with navy blue/gold gradients, holographic effects, 3D chip design, and shimmer animations following user specifications. Implemented comprehensive credit card payment system throughout banking architecture with chargeToCredit() and payCreditCardBill() functions. Added automatic credit card fallback for store purchases when bank balance insufficient, with smart payment method detection and display. Enhanced store purchase modal to show payment method (Bank Account vs Credit Card) and updated transaction flows. Added credit card payment interface in banking section with minimum and full payment options. Credit card has ₹5 lakh limit with 3.5% monthly interest rate and automatic debt tracking through liabilities system.
- August 12, 2025. Wallet System Removal & Banking Redesign: Completely removed wallet balance (inHandCash) and all wallet-related functionality from the game architecture. Eliminated transferToWallet, transferFromWallet, and spendFromWallet functions from the game store. Updated BankSection to remove wallet UI components and transaction interfaces. Renamed "Transfer" tab to "Credit card" featuring premium credit card management interface with gradient card design, available credit display, and high-interest rate warnings. Simplified banking architecture to single account system with bank balance as primary financial source. Updated financial data interface to remove inHandCash property and related transaction types. This creates a unified banking-centered architecture where all financial operations flow through the main bank account.
- August 11, 2025. Complete Store Redesign: Rebuilt entire store section with premium beige-themed UI (#F5F5DC background) following detailed mockup specifications. Implemented three-column layout: left category bar (20%), middle scrollable product cards (60%), right transaction/inventory panel (20%). Features include: 12 premium items with exact pricing and monthly cashflow (Small Apartment ₹45K +₹500/mo, Luxury Villa ₹250K +₹5K/mo, etc.), elegant serif typography for product titles, deep green buy buttons (#2E7D4A), gold accent info buttons (#D4AF37), monthly cashflow pills with coin icons, purchase confirmation modals, recent transactions display, and inventory thumbnail grid. Removed old grid-based store interface in favor of mobile-focused card-list design with warm premium aesthetic.
- August 10, 2025. Implemented Dynamic Sector Assignment System: Connected employee sector assignments to purchased business sectors from Industry Sectors section, replacing static sector list with dynamic mapping (Fast Food, Tech Startups, E-commerce, Healthcare). Added sector status display showing current employee assignments with income boost percentages, fixed experience display to show "0 year" in single row format, created new "Team Performance" section with comprehensive employee performance metrics including sector roles, monthly contributions, company growth impact, and detailed performance tracking. Integrated navigation between Team Performance and Team Management sections, enabling seamless workflow from viewing performance to managing assignments and hiring.
- August 10, 2025. Created Sector-Specific Team Management: Removed global team performance overview and unassigned member displays from business sector Team tabs. Built new SectorTeamSection component that shows only employees assigned to specific sectors (e.g., Fast Food sector shows only Fast Food employees). Each business sector now has its own dedicated Team tab displaying sector-specific metrics: team size, average performance, monthly contribution, and detailed employee cards with sector-specific roles and performance data. This provides focused team management per sector, eliminating cross-sector confusion and enabling targeted sector workforce optimization.