#!/bin/bash

# ChefIApp™ - Setup Completo Automatizado
# Este script ajuda a configurar tudo de uma vez

set -e

echo "🚀 ChefIApp™ - Setup Completo"
echo "=============================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto!${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Checklist de Setup:${NC}"
echo ""

# 1. Verificar .env.local
echo -n "1. Verificando .env.local... "
if [ -f ".env.local" ]; then
    if grep -q "VITE_SUPABASE_URL" .env.local && grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${YELLOW}⚠️  Arquivo existe mas falta variáveis${NC}"
        echo "   Execute: ./scripts/create-env.sh"
    fi
else
    echo -e "${RED}❌ Não encontrado${NC}"
    echo "   Execute: ./scripts/create-env.sh"
fi

# 2. Verificar node_modules
echo -n "2. Verificando dependências... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  Instalando...${NC}"
    npm install
fi

# 3. Build
echo -n "3. Fazendo build... "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Erro no build${NC}"
    exit 1
fi

# 4. Sync Capacitor
echo -n "4. Sincronizando Capacitor... "
if npx cap sync ios > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  Erro no sync (pode ser normal)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup local completo!${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos passos manuais:${NC}"
echo ""
echo "1. Execute o SQL no Supabase:"
echo "   Arquivo: supabase/COMPLETE_SETUP.sql"
echo "   URL: https://supabase.com/dashboard → SQL Editor"
echo ""
echo "2. Crie o bucket no Storage:"
echo "   Nome: company-assets"
echo "   Public: false"
echo "   MIME types: image/*"
echo ""
echo "3. Teste no simulador:"
echo "   npx cap open ios"
echo ""
echo -e "${GREEN}🎉 Pronto para usar!${NC}"

