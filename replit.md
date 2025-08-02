# Wealth Sprint Game

## Overview

Wealth Sprint is a financial simulation game built with React and TypeScript. It's a gamified experience where players make financial decisions to achieve wealth and financial independence. The game combines real-time financial scenarios, team management, and strategic decision-making in an engaging dashboard-style interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand with subscriptions for reactive state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds
- **3D Graphics**: React Three Fiber for potential 3D visualizations
- **Charts**: Chart.js for financial data visualization

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage**: Hybrid approach with in-memory storage for development and PostgreSQL for production
- **Mobile Build System**: Complete APK build automation with GitHub integration and Expo EAS builds

### Full-Stack Integration
- **Monorepo Structure**: Client and server code in the same repository
- **Shared Types**: Common TypeScript interfaces in `/shared` directory
- **API Layer**: RESTful API with Express routes
- **Development**: Vite dev server with Express backend integration

## Key Components

### Game Engine
- **Scenario Engine**: Generates dynamic financial scenarios based on player stats
- **Financial Engine**: Calculates net worth, cash flow, and financial independence
- **Time Engine**: Background time progression at 24× speed with automatic triggers
- **Team Management**: Simulates team dynamics and employee relationships
- **Audio System**: Background music and sound effects with mute controls

### State Management Stores
- **Game State**: Core game logic, time progression, and phase management
- **Financial Data**: Stock prices, bonds, bank accounts, and portfolio management
- **Team Management**: Employee stats, loyalty, and team synergy
- **Audio**: Sound effects and music control

### UI Sections
- **Dashboard**: Overview of financial status and game progress
- **Cashflow**: Income and expense tracking
- **Stocks/Bonds**: Investment portfolio management
- **Team**: Employee management and team dynamics
- **Business Deals**: Strategic business opportunities
- **Settings**: Game preferences, audio controls, and mobile app build system

### Mobile App Build System
- **APK Builder**: Complete automation for building and downloading Android APKs
- **GitHub Integration**: Automatic repository creation and code push to GitHub
- **Expo EAS Build**: Real-time build monitoring with 15-second polling intervals
- **Build Status Tracking**: Live progress updates through server-sent events
- **Error Handling**: Comprehensive error reporting for GitHub and Expo API issues
- **Authentication**: Uses GitHub personal access tokens and Expo EAS tokens
- **Final Output**: Real APK download links with "Build Complete" confirmation

## Data Flow

1. **Game Initialization**: Load initial scenarios, financial data, and team members
2. **Time Progression**: Advance game time, triggering new scenarios and market updates
3. **Decision Making**: Player selects scenario options, affecting stats and finances
4. **Financial Calculations**: Real-time updates to net worth, cash flow, and portfolio values
5. **Team Dynamics**: Employee satisfaction and productivity calculations
6. **Progress Tracking**: Monitor path to financial independence

## External Dependencies

### Frontend Libraries
- **UI Framework**: React with extensive Radix UI component library
- **State Management**: Zustand for predictable state updates
- **Styling**: Tailwind CSS with custom theme variables
- **3D Graphics**: React Three Fiber ecosystem for potential 3D features
- **Charts**: Chart.js for financial data visualization
- **Audio**: Native HTML5 Audio API

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle with type-safe queries
- **Server**: Express.js with TypeScript support
- **Session Management**: Connect-pg-simple for PostgreSQL sessions

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across client and server
- **Code Quality**: ESLint and Prettier (implied by project structure)

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React app to `/dist/public`
2. **Server Build**: esbuild bundles Express server to `/dist`
3. **Database**: Drizzle migrations applied to PostgreSQL

### Production Setup
- **Environment Variables**: `DATABASE_URL` for PostgreSQL connection
- **Static Assets**: Served from `/dist/public`
- **API Routes**: Express server handles `/api/*` routes
- **Database**: Neon Database provides serverless PostgreSQL

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **API Proxy**: Development server proxies API calls to Express
- **Database**: In-memory storage for development, PostgreSQL for production

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
- July 07, 2025. Fixed React import issues, added PWA support, created icons and manifest
- July 09, 2025. Added background time engine with 24× speed for game progression
- July 12, 2025. Major cleanup: restored GameDashboard UI, removed unused files and stores, fixed console errors
- July 14, 2025. Upgraded APK automation system: Fixed deprecated expo login, added EAS CLI support, improved security with proper environment variable handling
- July 14, 2025. Transformed Sage AI into real-time multilingual chat assistant: Added conversation storage, chat history, language support (9 languages), emotional financial guidance, compact responsive design with dark theme integration
- July 14, 2025. Implemented GORK AI Advanced Learning System: Created sophisticated emotional intelligence engine with Supabase integration, game state access, multilingual support (English/Hindi/Hinglish), contextual responses based on XP/mood/financial status, conversation learning and player profiling. AI now provides personalized emotional financial guidance with real-time adaptation.
- July 14, 2025. Fixed critical startup error: Made Supabase initialization conditional and graceful, preventing app crashes when database is unavailable. Added null-safety for all database operations.
- July 14, 2025. Resolved APK build compatibility issues: Created mobile-specific package.json without vite-plugin-glsl (Node.js incompatibility), added automatic yarn.lock generation, EAS configuration with Node.js 18.18.0 compatibility, and mobile-optimized vite config for successful Expo builds.
- July 15, 2025. Fixed GitHub push error and updated APK build system: Resolved "src refspec main does not match any" error by adding explicit main branch creation, implemented proper EAS project initialization with automatic project ID creation, updated to latest Expo SDK 52.0.0 with React Native 0.76.3, added comprehensive error handling and fallback mechanisms, created automatic mobile app icon generation, and improved build status polling with better error messages.
- July 19, 2025. Fixed critical APK build directory issue: Resolved "can't cd to ./temp-deploy" error by adding directory existence validation, preventing premature cleanup of temp directory before EAS build access, improved GitHub operation logging with step-by-step confirmation messages, and standardized all directory path references to prevent inconsistencies.
- July 31, 2025. Added "Push to GitHub" functionality: Implemented complete GitHub integration in Settings > Data & Privacy section with automatic repository creation, game data export to JSON format, secure authentication using environment GITHUB_TOKEN, comprehensive error handling, and user-friendly success/failure notifications.
- July 31, 2025. Enhanced GitHub integration with repository cleanup: Added automatic .gitignore creation to prevent unwanted files, README.md generation for proper documentation, repository cleanup function to remove ghost/config files, separate cleanup button for existing repositories, and improved file management to only commit essential game data in clean structure.
- July 31, 2025. Implemented full project GitHub push: Created complete project upload functionality that pushes entire Replit codebase to GitHub, including client, server, and configuration files, with intelligent file filtering to exclude node_modules and sensitive files, batch uploading to handle rate limits, and comprehensive progress tracking with success/failure statistics.
- July 31, 2025. Fixed GitHub push reliability: Replaced complex file filtering with whitelist approach that specifically includes essential project directories (client/, server/, shared/, database/) and configuration files, improved upload reliability with proper rate limiting, enhanced error handling and logging, and ensured all important project files are successfully committed to GitHub repository.
- July 31, 2025. Implemented single-commit GitHub push: Created batch upload system using GitHub Tree API to commit all project files in one atomic operation, eliminating infinite commit loops, removing ghost files from uploads, and ensuring complete project structure is uploaded in a single commit with proper file filtering.
- July 31, 2025. Added password protection and improved file inclusion: Implemented admin password authentication (Ak@github123) with secure UI dialog, included package-lock.json and other essential dependency files, enhanced file filtering to capture all important project files while excluding cache/temp directories, and created user-friendly password input interface with proper validation.
- July 31, 2025. Created Vercel deployment compatibility: Built complete Vercel deployment system with serverless API functions, optimized Vite configuration for static hosting, separated client/server dependencies, created vercel.json configuration, converted Express endpoints to Vercel functions, and provided comprehensive deployment documentation with step-by-step instructions for hosting on Vercel platform.
- August 02, 2025. Completely rebuilt Elite Hiring section: Removed old TeamHiringDashboard and created new Bond Investment-style UI with horizontal department scrolling, clickable candidate cards, detailed resume modals with unique random names from candidate pool, full-screen beige theme interface matching game design, comprehensive candidate profiles including education/skills/experience/companies/personal notes, and seamless hiring functionality with stat bonuses.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```