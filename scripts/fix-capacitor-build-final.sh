#!/bin/bash

# Script para corrigir erros de build do Capacitor
# Executa limpeza completa e reinstala pods

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Corrigindo Build do Capacitor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$(dirname "$0")/.."

# 1. Limpar DerivedData
echo -e "${YELLOW}1. Limpando DerivedData...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/*
echo -e "${GREEN}✅ DerivedData limpo${NC}"
echo ""

# 2. Limpar Pods
echo -e "${YELLOW}2. Limpando Pods...${NC}"
cd ios/App
rm -rf Pods Podfile.lock
echo -e "${GREEN}✅ Pods limpo${NC}"
echo ""

# 3. Limpar cache do CocoaPods
echo -e "${YELLOW}3. Limpando cache do CocoaPods...${NC}"
pod cache clean --all 2>/dev/null || true
echo -e "${GREEN}✅ Cache limpo${NC}"
echo ""

# 4. Reinstalar Pods
echo -e "${YELLOW}4. Reinstalando Pods...${NC}"
pod install
echo -e "${GREEN}✅ Pods reinstalados${NC}"
echo ""

# 5. Sincronizar Capacitor
echo -e "${YELLOW}5. Sincronizando Capacitor...${NC}"
cd ../..
npx cap sync ios
echo -e "${GREEN}✅ Capacitor sincronizado${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Limpeza completa concluída!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Abra o Xcode:"
echo "   npx cap open ios"
echo ""
echo "2. No Xcode:"
echo "   • Product → Clean Build Folder (Cmd+Shift+K)"
echo "   • Product → Build (Cmd+B)"
echo ""
echo "⚠️  Nota sobre erros de módulos:"
echo "   Se ainda aparecerem erros de 'could not build module',"
echo "   eles podem ser apenas warnings que não impedem o build."
echo "   Verifique se o build completa com sucesso mesmo com os erros."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

