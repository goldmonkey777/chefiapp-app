#!/bin/bash

# ========================================
# ChefIApp™ - Setup Script
# ========================================
# One-click setup for development environment
#
# Usage: ./scripts/setup.sh
# ========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ========================================
# START
# ========================================

print_header "🚀 ChefIApp™ Setup Script"

echo "This script will set up your development environment."
echo ""

# ========================================
# CHECK PREREQUISITES
# ========================================

print_header "📋 Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js $NODE_VERSION found"
    
    # Check version >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | tr -d 'v')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_error "Node.js 18+ required. You have $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js not found. Install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION found"
else
    print_error "npm not found"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_success "Git $GIT_VERSION found"
else
    print_warning "Git not found (optional but recommended)"
fi

# ========================================
# INSTALL DEPENDENCIES
# ========================================

print_header "📦 Installing Dependencies"

echo "Running npm install..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# ========================================
# SETUP ENVIRONMENT
# ========================================

print_header "🔧 Setting Up Environment"

# Create .env if not exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
        print_warning "Edit .env with your Supabase credentials"
    else
        print_warning ".env.example not found, creating basic .env"
        cat > .env << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=development
EOF
        print_warning "Edit .env with your Supabase credentials"
    fi
else
    print_info ".env already exists, skipping"
fi

# ========================================
# VERIFY BUILD
# ========================================

print_header "🏗️ Verifying Build"

echo "Running type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript errors found (you may need to configure .env)"
fi

# ========================================
# SUPABASE SETUP REMINDER
# ========================================

print_header "🗄️ Supabase Setup"

echo "To complete setup, you need to:"
echo ""
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Copy your project URL and anon key to .env"
echo "3. Run the SQL setup script in Supabase SQL Editor:"
echo "   - File: supabase/COMPLETE_SETUP.sql"
echo ""
print_info "See docs/CONEXAO_SUPABASE.md for detailed instructions"

# ========================================
# DONE
# ========================================

print_header "✅ Setup Complete!"

echo "Your ChefIApp development environment is ready!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your Supabase credentials"
echo "  2. Run the SQL setup in Supabase Dashboard"
echo "  3. Start development server: npm run dev"
echo ""
echo "Available commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run preview  - Preview production build"
echo "  npm run lint     - Run linter"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""
echo "Made with ❤️ by goldmonkey.studio"

