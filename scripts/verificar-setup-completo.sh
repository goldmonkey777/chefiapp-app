#!/bin/bash

# ChefIApp™ - Verificação Completa do Setup
# Este script verifica todas as configurações importantes

set -e

echo "🔍 ChefIApp™ - Verificação Completa do Setup"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd "$(dirname "$0")/.."

ERRORS=0
WARNINGS=0

# 1. Verificar variáveis de ambiente
echo -e "${BLUE}1️⃣ Verificando variáveis de ambiente...${NC}"
echo ""

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Arquivo .env.local encontrado${NC}"
    
    if grep -q "VITE_SUPABASE_URL" .env.local && grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✅ Variáveis Supabase configuradas${NC}"
        
        SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d'=' -f2)
        if [[ $SUPABASE_URL == *"supabase.co"* ]]; then
            echo -e "${GREEN}   URL: ${SUPABASE_URL}${NC}"
        else
            echo -e "${YELLOW}⚠️  URL pode estar incorreta${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${RED}❌ Variáveis Supabase não encontradas${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "SUPABASE_SERVICE_KEY" .env.local; then
        echo -e "${GREEN}✅ Service Key configurada${NC}"
    else
        echo -e "${YELLOW}⚠️  Service Key não encontrada (opcional para scripts)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

echo ""

# 2. Verificar arquivo SQL
echo -e "${BLUE}2️⃣ Verificando arquivo SQL de migrations...${NC}"
echo ""

if [ -f "supabase/COMPLETE_SETUP.sql" ]; then
    echo -e "${GREEN}✅ Arquivo COMPLETE_SETUP.sql encontrado${NC}"
    
    # Verificar se RLS está habilitado
    RLS_COUNT=$(grep -c "ENABLE ROW LEVEL SECURITY" supabase/COMPLETE_SETUP.sql || echo "0")
    if [ "$RLS_COUNT" -gt "0" ]; then
        echo -e "${GREEN}✅ RLS habilitado em $RLS_COUNT tabelas${NC}"
    else
        echo -e "${YELLOW}⚠️  RLS não encontrado no SQL${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Verificar se policies estão criadas
    POLICY_COUNT=$(grep -c "CREATE POLICY" supabase/COMPLETE_SETUP.sql || echo "0")
    if [ "$POLICY_COUNT" -gt "0" ]; then
        echo -e "${GREEN}✅ $POLICY_COUNT políticas RLS encontradas${NC}"
    else
        echo -e "${YELLOW}⚠️  Políticas RLS não encontradas${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ Arquivo COMPLETE_SETUP.sql não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 3. Verificar configuração do Capacitor
echo -e "${BLUE}3️⃣ Verificando configuração do Capacitor...${NC}"
echo ""

if [ -f "capacitor.config.ts" ]; then
    echo -e "${GREEN}✅ capacitor.config.ts encontrado${NC}"
    
    if grep -q "chefiapp" capacitor.config.ts; then
        echo -e "${GREEN}✅ URL scheme 'chefiapp' configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  URL scheme pode não estar configurado${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ capacitor.config.ts não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 4. Verificar build
echo -e "${BLUE}4️⃣ Verificando build...${NC}"
echo ""

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Pasta dist encontrada (build realizado)${NC}"
    
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✅ index.html encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  index.html não encontrado${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Pasta dist não encontrada (execute: npm run build)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# 5. Verificar iOS config
echo -e "${BLUE}5️⃣ Verificando configuração iOS...${NC}"
echo ""

if [ -f "ios/App/App/Info.plist" ]; then
    echo -e "${GREEN}✅ Info.plist encontrado${NC}"
    
    if grep -q "chefiapp" ios/App/App/Info.plist; then
        echo -e "${GREEN}✅ URL scheme configurado no Info.plist${NC}"
    else
        echo -e "${YELLOW}⚠️  URL scheme pode não estar no Info.plist${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Info.plist não encontrado (normal se não sincronizou iOS)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RESUMO DA VERIFICAÇÃO${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Tudo verificado! Nenhum problema encontrado.${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Verificar RLS Policies no Supabase Dashboard"
    echo "   2. Configurar OAuth Providers (opcional)"
    echo "   3. Personalizar Email Templates"
    echo "   4. Testar o app"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Verificação concluída com $WARNINGS aviso(s)${NC}"
    echo ""
    echo "📋 Verifique os avisos acima e corrija se necessário."
    exit 0
else
    echo -e "${RED}❌ Verificação encontrou $ERRORS erro(s) e $WARNINGS aviso(s)${NC}"
    echo ""
    echo "📋 Corrija os erros acima antes de continuar."
    exit 1
fi

