#!/bin/bash

# ChefIApp™ - Fix Capacitor Build Errors
# Este script limpa completamente o cache e reinstala tudo

set -e

echo "🔧 Corrigindo erros de build do Capacitor..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd "$(dirname "$0")/.."

echo -e "${BLUE}📦 Passo 1/6: Limpando cache do CocoaPods...${NC}"
cd ios/App
pod deintegrate 2>/dev/null || true
pod cache clean --all 2>/dev/null || true
rm -rf Pods Podfile.lock .symlinks
echo -e "${GREEN}✅ Cache do CocoaPods limpo${NC}"
echo ""

echo -e "${BLUE}📦 Passo 2/6: Limpando DerivedData do Xcode...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/*
echo -e "${GREEN}✅ DerivedData limpo${NC}"
echo ""

echo -e "${BLUE}📦 Passo 3/6: Limpando build folder do Xcode...${NC}"
cd ../..
xcodebuild clean -workspace ios/App/App.xcworkspace -scheme App 2>/dev/null || true
rm -rf ios/App/build
echo -e "${GREEN}✅ Build folder limpo${NC}"
echo ""

echo -e "${BLUE}📦 Passo 4/6: Reinstalando CocoaPods...${NC}"
cd ios/App
pod install --repo-update
echo -e "${GREEN}✅ CocoaPods reinstalado${NC}"
echo ""

echo -e "${BLUE}📦 Passo 5/6: Sincronizando Capacitor...${NC}"
cd ../..
npx cap sync ios
echo -e "${GREEN}✅ Capacitor sincronizado${NC}"
echo ""

echo -e "${BLUE}📦 Passo 6/6: Verificando instalação...${NC}"
if [ -f "ios/App/Pods/Manifest.lock" ] && [ -d "ios/App/Pods/Target Support Files/Capacitor" ]; then
    echo -e "${GREEN}✅ Capacitor instalado corretamente${NC}"
    echo -e "${GREEN}✅ Pods configurados e prontos${NC}"
elif [ -f "ios/App/Pods/Manifest.lock" ]; then
    echo -e "${YELLOW}⚠️  Pods instalados, mas estrutura pode estar diferente${NC}"
    echo -e "${GREEN}✅ Continuando...${NC}"
else
    echo -e "${RED}❌ Erro: Pods não foram instalados corretamente${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ LIMPEZA COMPLETA FINALIZADA!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Feche o Xcode completamente (Cmd+Q)"
echo ""
echo "2. Abra o projeto novamente:"
echo "   ${BLUE}npx cap open ios${NC}"
echo ""
echo "3. No Xcode:"
echo "   - Product → Clean Build Folder (Cmd+Shift+K)"
echo "   - Product → Build (Cmd+B)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

