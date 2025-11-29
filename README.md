<div align="center">
  <img width="1200" height="475" alt="ChefIApp Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  # ChefIApp™ - Hospitality Workforce Intelligence Platform
  
  **Modern team management platform for hospitality with gamification, real-time tracking, and intelligent performance insights.**
  
  Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-7-119eff.svg)](https://capacitorjs.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)
  [![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
  
  [🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [🏗️ Architecture](#️-architecture) • [🤝 Contributing](#-contributing)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Architecture](#️-architecture)
- [Platforms](#-platforms)
- [Documentation](#-documentation)
- [Development](#-development)
- [Project Status](#-project-status)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

**ChefIApp™** is a comprehensive workforce management platform designed specifically for the hospitality industry. It combines task management, gamification, real-time tracking, and intelligent analytics to help restaurants, hotels, and hospitality businesses manage their teams more effectively.

### Key Highlights

- 🎮 **Gamification System** - XP, levels, streaks, and achievements to boost employee engagement
- 📱 **Multi-Platform** - Native iOS and Android apps + Progressive Web App
- ⚡ **Real-time Updates** - Live task updates and notifications via Supabase Realtime
- 🌍 **International** - Built-in support for 6+ languages (PT, EN, ES, FR, DE, IT)
- 🔐 **Secure Authentication** - OAuth (Google, Apple) + Magic Link + Email/Password
- 📊 **Role-based Dashboards** - Customized views for Employees, Managers, and Owners
- 🏢 **Company Onboarding** - Complete 8-screen onboarding flow for business setup
- 📈 **Analytics & Insights** - Performance tracking and intelligent reporting

---

## ✨ Features

### 👤 For Employees

- ✅ **Check-in/Check-out** - Location-based shift tracking with geofencing
- ✅ **Task Management** - View, accept, and complete assigned tasks
- ✅ **Gamification** - Earn XP, level up, maintain streaks, unlock achievements
- ✅ **Real-time Notifications** - Instant updates on new tasks and assignments
- ✅ **Profile Management** - Track your progress, achievements, and statistics
- ✅ **QR Code Scanning** - Quick company joining via QR code
- ✅ **Multi-language Support** - Use the app in your preferred language

### 👔 For Managers

- ✅ **Task Creation** - Create and assign tasks to team members
- ✅ **Team Monitoring** - Track team performance and productivity
- ✅ **Sector Analytics** - View sector-specific insights and metrics
- ✅ **Task Approval** - Review and approve task completions
- ✅ **Shift Management** - Monitor employee check-ins and check-outs
- ✅ **Performance Reports** - Generate detailed performance reports

### 👑 For Owners

- ✅ **Company Overview** - Complete business dashboard with all metrics
- ✅ **Multi-sector Management** - Manage multiple business sectors
- ✅ **Advanced Analytics** - Comprehensive reporting and insights
- ✅ **Employee Invitations** - Generate QR codes for employee onboarding
- ✅ **Company Settings** - Configure company details, sectors, positions
- ✅ **Gamification Leaderboards** - Company-wide rankings and competitions
- ✅ **Legal Compliance** - Automatic configuration based on country (HACCP, ServSafe, etc.)

---

## 🏗️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **TypeScript** | 5.8.2 | Type Safety |
| **Vite** | 6.2.0 | Build Tool & Dev Server |
| **TailwindCSS** | 4.1.17 | Styling Framework |
| **Zustand** | 5.0.8 | State Management |
| **react-i18next** | 16.3.5 | Internationalization |
| **Lucide React** | 0.555.0 | Icon Library |
| **Recharts** | 3.5.0 | Charts & Analytics |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.86.0 | Backend-as-a-Service |
| **PostgreSQL** | 15+ | Primary Database |
| **Supabase Realtime** | - | Real-time Updates |
| **Supabase Storage** | - | File Storage |
| **Supabase Auth** | - | Authentication |

### Mobile

| Technology | Version | Purpose |
|------------|---------|---------|
| **Capacitor** | 7.4.4 | Mobile Framework |
| **Capacitor iOS** | 7.4.4 | iOS Native App |
| **Capacitor Android** | 7.4.4 | Android Native App |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | 1.1.0 | Testing Framework |
| **@testing-library/react** | 14.1.2 | Component Testing |
| **patch-package** | 8.0.0 | Dependency Patching |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** (free tier works)
- **iOS Development** (optional): Xcode 15+ for iOS builds
- **Android Development** (optional): Android Studio for Android builds

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/goldmonkey777/chefiapp-hospitality-intelligence.git
cd chefiapp-hospitality-intelligence

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Run the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run SQL migrations:**
   - Execute `supabase/COMPLETE_SETUP.sql` in Supabase SQL Editor
   - This creates all tables, RLS policies, and triggers
3. **Configure OAuth:**
   - Follow guides in `docs/setup/` for Google and Apple OAuth
4. **Create Storage bucket:**
   - Create `company-assets` bucket in Supabase Storage

**Full setup guide:** [docs/QUICKSTART.md](docs/QUICKSTART.md)

---

## 🏛️ Architecture

### Project Structure

```
chefiapp-hospitality-intelligence/
├── src/
│   ├── components/          # React components
│   │   ├── Onboarding/      # Onboarding flow
│   │   ├── CompanyOnboarding/ # Company setup (8 screens)
│   │   ├── TaskManagement/  # Task components
│   │   └── ...
│   ├── pages/               # Main dashboards
│   │   ├── EmployeeDashboard.tsx
│   │   ├── ManagerDashboard.tsx
│   │   └── OwnerDashboard.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication
│   │   ├── useTasks.ts      # Task management
│   │   ├── useCheckin.ts    # Check-in/out
│   │   └── ...
│   ├── stores/              # Zustand state management
│   │   └── useAppStore.ts   # Main application store
│   ├── services/            # External services
│   │   └── geminiService.ts # AI integration
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts      # Supabase client
│   │   └── types.ts         # TypeScript types
│   └── locales/             # i18n translations
│       ├── pt/              # Portuguese
│       ├── en/              # English
│       └── ...
├── supabase/                # Database migrations
│   ├── COMPLETE_SETUP.sql  # Complete database setup
│   └── migrations/          # Individual migrations
├── ios/                     # iOS native project
├── android/                 # Android native project
├── docs/                    # Documentation
└── scripts/                 # Utility scripts
```

### Key Architectural Decisions

1. **State Management:** Zustand with persist middleware for offline-first approach
2. **Real-time Updates:** Supabase Realtime subscriptions for live data
3. **Authentication:** Supabase Auth with OAuth providers (Google, Apple)
4. **Mobile:** Capacitor for native iOS/Android apps
5. **Styling:** TailwindCSS 4 with utility-first approach
6. **Type Safety:** Full TypeScript coverage with strict mode

**Detailed architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 📱 Platforms

### Web (PWA)

- **Progressive Web App** with offline support
- Responsive design for all screen sizes
- Installable on desktop and mobile browsers

### iOS

- **Native iOS app** via Capacitor
- Deep linking configured (`com-chefiapp-app://`)
- App Store ready (requires Apple Developer account)

### Android

- **Native Android app** via Capacitor
- Deep linking configured
- Google Play ready (requires Google Play Developer account)

**Mobile setup:** [docs/mobile/APP_STORE.md](docs/mobile/APP_STORE.md)

---

## 📚 Documentation

### Getting Started

- **[Quick Start Guide](docs/QUICKSTART.md)** - 5-minute setup tutorial
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and data flow
- **[Development Guide](docs/DEVELOPMENT.md)** - Developer workflow and standards

### Setup & Configuration

- **[Complete Supabase Setup](docs/SUPABASE_SETUP_COMPLETO.md)** - Full Supabase configuration (30-45 min)
- **[Supabase SQL Scripts](supabase/README.md)** - Database setup scripts
- **[OAuth Setup Guide](docs/setup/OAUTH_AUTO_FILL_GUIDE.md)** - Google and Apple authentication
- **[Mobile Build Guide](docs/mobile/APP_STORE.md)** - iOS and Android deployment

### Features

- **[Onboarding Flow](docs/features/ONBOARDING.md)** - User onboarding experience
- **[Company Onboarding](docs/features/COMPANY_ONBOARDING.md)** - 8-screen company setup
- **[i18n Implementation](docs/features/I18N.md)** - Internationalization guide
- **[Gamification System](docs/features/GAMIFICATION.md)** - XP, levels, achievements

### Help & Support

- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Complete Docs Index](docs/README.md)** - Full documentation catalog
- **[Project Status](docs/PROJETO_ESTADO_ATUAL.md)** - Current implementation status

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Mobile
npm run mobile:build     # Build and sync Capacitor
npm run mobile:open:ios # Open iOS project in Xcode
npm run mobile:open:android # Open Android project in Android Studio
```

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

**See [Development Guide](docs/DEVELOPMENT.md) for detailed workflows.**

---

## 📊 Project Status

### Implementation Status: **95% Complete** ✅

| Category | Status | Progress |
|----------|--------|----------|
| **Core Features** | ✅ Complete | 100% |
| **Authentication** | ✅ Complete | 100% |
| **OAuth Integration** | ✅ Complete | 100% |
| **Company Onboarding** | ✅ Complete | 100% |
| **Dashboards** | ✅ Complete | 100% |
| **Gamification** | ✅ Complete | 100% |
| **Mobile Apps** | ✅ Complete | 100% |
| **i18n** | ✅ Complete | 100% |
| **Testing** | 🟡 In Progress | 60% |
| **Documentation** | ✅ Complete | 95% |

**Detailed status:** [docs/PROJETO_ESTADO_ATUAL.md](docs/PROJETO_ESTADO_ATUAL.md)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Contribution Process

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our code standards
4. **Write tests** for new features
5. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Standards

- **TypeScript:** Strict mode enabled, full type coverage
- **React:** Functional components with hooks
- **Styling:** TailwindCSS utility classes
- **Commits:** Conventional commits format
- **Tests:** Write tests for new features

**See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.**

---

## 📄 License

This project is **proprietary software**. All rights reserved.

**Copyright © 2025 ChefIApp™**

See [LICENSE](LICENSE) for details.

---

## 🆘 Support

### Documentation

- **Main Docs:** [docs/README.md](docs/README.md)
- **Quick Start:** [docs/QUICKSTART.md](docs/QUICKSTART.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/goldmonkey777/chefiapp-hospitality-intelligence/issues)
- **Discussions:** [GitHub Discussions](https://github.com/goldmonkey777/chefiapp-hospitality-intelligence/discussions)

---

## 🌟 Key Highlights

- ⚡ **Real-time Sync** - Changes propagate instantly via Supabase Realtime
- 💾 **Offline-first** - Zustand persist for local caching
- 🔒 **Type-safe** - Full TypeScript coverage with strict mode
- 🛡️ **Secure** - Row Level Security (RLS) on all database tables
- 📈 **Scalable** - Modular architecture with separation of concerns
- 🌍 **International** - Built-in support for 6+ languages
- 🎮 **Gamification** - Complete XP, levels, streaks, and achievements system
- 📱 **Mobile-first** - Native iOS and Android apps
- 🔐 **OAuth Ready** - Google and Apple authentication configured
- 🏢 **Company Management** - Complete onboarding and management system

---

## 📈 Roadmap

### Current Version: 1.0.0

- ✅ Core features implemented
- ✅ OAuth authentication
- ✅ Company onboarding
- ✅ Role-based dashboards
- ✅ Gamification system
- ✅ Mobile apps

### Upcoming Features

- 🔄 **Advanced Analytics** - More detailed reporting
- 🔄 **AI Integration** - Enhanced AI features
- 🔄 **Push Notifications** - Native push notifications
- 🔄 **Offline Mode** - Enhanced offline capabilities
- 🔄 **Multi-company Support** - Users can belong to multiple companies

---

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Capacitor** - Mobile framework
- **React Team** - UI framework
- **TailwindCSS** - Styling framework
- **All Contributors** - Thank you for your contributions!

---

<div align="center">

**Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)**

Built for the hospitality industry

[Website](https://chefiapp.com) • [Documentation](docs/README.md) • [Issues](https://github.com/goldmonkey777/chefiapp-hospitality-intelligence/issues)

</div>
