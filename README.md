<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ChefIApp™ - Hospitality Intelligence Platform

**Modern team management platform for hospitality with gamification, real-time tracking, and intelligent performance insights.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7-119eff.svg)](https://capacitorjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)

---

## ⚡ Quick Start

Get up and running in **5 minutes**:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your Supabase credentials to .env

# 3. Run the app
npm run dev
```

**Full setup guide:** [docs/QUICKSTART.md](docs/QUICKSTART.md)

---

## 🎯 What is ChefIApp?

ChefIApp is a comprehensive team management platform designed specifically for hospitality businesses. It combines:

- **Task Management** - Create, assign, and track operational tasks
- **Gamification** - XP, levels, streaks, and achievements to boost engagement
- **Real-time Tracking** - Check-in/out, live task updates via Supabase Realtime
- **Role-based Dashboards** - Customized views for Employees, Managers, and Owners
- **Mobile-first** - Native iOS and Android apps via Capacitor
- **Multi-language** - i18n support for 6+ languages

---

## 📚 Documentation

### Getting Started
- **[Quick Start Guide](docs/QUICKSTART.md)** - 5-minute setup
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and data flow
- **[Development Guide](docs/DEVELOPMENT.md)** - Developer workflow and standards

### Setup & Configuration
- **[Supabase Complete Setup](docs/SUPABASE_SETUP_COMPLETO.md)** - 🆕 **Complete Supabase configuration guide (30-45 min)**
- **[Supabase SQL Scripts](supabase/README.md)** - 🆕 **Ready-to-run SQL scripts for database setup**
- **[OAuth Analysis](docs/OAUTH_ANALYSIS.md)** - 🆕 **Complete OAuth implementation analysis**
- **[Supabase Setup](docs/setup/SUPABASE_CONFIG.md)** - Database and backend configuration
- **[OAuth Setup](docs/setup/OAUTH_AUTO_FILL_GUIDE.md)** - Google and Apple authentication
- **[Mobile Build](docs/mobile/APP_STORE.md)** - iOS and Android deployment

### Features
- **[Onboarding Flow](docs/features/ONBOARDING.md)** - User onboarding experience
- **[i18n Implementation](docs/features/I18N.md)** - Internationalization guide

### Help & Support
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Complete Docs Index](docs/README.md)** - Full documentation catalog

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + TailwindCSS 4 |
| **Mobile** | Capacitor 7 (iOS/Android) |
| **Backend** | Supabase (PostgreSQL + Realtime + Storage + Auth) |
| **State** | Zustand with persist middleware |
| **i18n** | react-i18next |
| **Build** | Vite 6 |

---

## 📱 Platforms

- **Web** - Progressive Web App (PWA)
- **iOS** - Native app via Capacitor
- **Android** - Native app via Capacitor

---

## 🚀 Features

### For Employees
- ✅ Check-in/out with location tracking
- ✅ View and complete assigned tasks
- ✅ Earn XP and level up
- ✅ Track streaks and achievements
- ✅ Real-time notifications

### For Managers
- ✅ Create and assign tasks to team members
- ✅ Monitor team performance
- ✅ View sector-specific analytics
- ✅ Approve task completions

### For Owners
- ✅ Complete company overview
- ✅ Multi-sector management
- ✅ Advanced analytics and reporting
- ✅ QR code employee invitations
- ✅ Company-wide gamification leaderboards

---

## 🛠️ Development

```bash
# Web development
npm run dev

# iOS development
npm run build
npx cap sync ios
npx cap open ios

# Android development
npm run build
npx cap sync android
npx cap open android
```

**See [Development Guide](docs/DEVELOPMENT.md) for detailed workflows.**

---

## 📊 Project Status

- **Production Ready:** ~70%
- **Core Features:** ✅ Complete
- **Mobile Apps:** ✅ Complete
- **Testing:** 🟡 In Progress
- **i18n:** ✅ Complete

**See [Implementation Status](docs/architecture/STATUS.md) for details.**

---

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](docs/DEVELOPMENT.md) for:
- Code standards
- Development workflow
- Testing guidelines
- Commit conventions

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🆘 Support

- **Documentation:** [docs/README.md](docs/README.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Quick Start:** [docs/QUICKSTART.md](docs/QUICKSTART.md)

---

## 🌟 Key Highlights

- **Real-time Sync** - Changes propagate instantly via Supabase Realtime
- **Offline-first** - Zustand persist for local caching
- **Type-safe** - Full TypeScript coverage
- **Secure** - Row Level Security (RLS) on all tables
- **Scalable** - Modular architecture with separation of concerns
- **International** - Built-in support for 6+ languages

---

**Built with ❤️ for the hospitality industry**

View app in AI Studio: https://ai.studio/apps/drive/15EM2mr-qItNckI7q4IG8DUnyjrJ0mCxZ
