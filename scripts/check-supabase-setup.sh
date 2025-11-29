#!/bin/bash

# ChefIApp™ - Verificador de Setup do Supabase
# Verifica se tudo está configurado corretamente

echo "🔍 Verificando configuração do Supabase..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar .env.local
echo "1️⃣ Verificando .env.local..."
if [ -f ".env.local" ]; then
    if grep -q "VITE_SUPABASE_URL" .env.local && grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✅ .env.local existe e tem variáveis${NC}"
        
        # Verificar se não são placeholders
        if grep -q "\[SEU_PROJECT\]" .env.local || grep -q "\[SUA_ANON_KEY\]" .env.local; then
            echo -e "${YELLOW}⚠️  .env.local tem placeholders - precisa preencher valores reais${NC}"
        else
            SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d '=' -f2)
            echo -e "${GREEN}   URL: ${SUPABASE_URL}${NC}"
        fi
    else
        echo -e "${RED}❌ .env.local existe mas está incompleto${NC}"
    fi
else
    echo -e "${RED}❌ .env.local não existe${NC}"
    echo "   Crie o arquivo com:"
    echo "   VITE_SUPABASE_URL=https://[PROJECT].supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=[ANON_KEY]"
fi

echo ""
echo "2️⃣ Verificando arquivo SQL de migrations..."
if [ -f "supabase/COMPLETE_SETUP.sql" ]; then
    echo -e "${GREEN}✅ COMPLETE_SETUP.sql existe${NC}"
    LINES=$(wc -l < supabase/COMPLETE_SETUP.sql)
    echo "   Arquivo tem $LINES linhas"
else
    echo -e "${RED}❌ COMPLETE_SETUP.sql não encontrado${NC}"
fi

echo ""
echo "3️⃣ Verificando build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build funciona${NC}"
else
    echo -e "${YELLOW}⚠️  Build tem problemas (pode ser normal se Supabase não configurado)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Se .env.local não está completo:"
echo "   → Edite .env.local e adicione suas credenciais Supabase"
echo ""
echo "2. Executar migrations SQL:"
echo "   → Abra: supabase/COMPLETE_SETUP.sql"
echo "   → Copie TODO o conteúdo"
echo "   → Supabase Dashboard → SQL Editor → Cole e execute"
echo ""
echo "3. Criar storage bucket:"
echo "   → Supabase Dashboard → Storage → New bucket"
echo "   → Nome: company-assets"
echo "   → Privado (não público)"
echo ""
echo "4. Configurar Redirect URLs:"
echo "   → Supabase Dashboard → Authentication → URL Configuration"
echo "   → Adicione: chefiapp://auth/callback"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

