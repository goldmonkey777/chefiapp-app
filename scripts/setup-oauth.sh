#!/bin/bash

# ChefIApp™ - Script de Setup OAuth
# Este script ajuda a verificar se tudo está configurado corretamente

echo "🔐 ChefIApp™ - Verificação de Setup OAuth"
echo "=========================================="
echo ""

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    echo "   Crie o arquivo .env.local baseado em .env.example"
    echo ""
    exit 1
else
    echo "✅ Arquivo .env.local encontrado"
fi

# Verificar variáveis no .env.local
source .env.local

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL não definido no .env.local"
    exit 1
else
    echo "✅ VITE_SUPABASE_URL definido"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ VITE_SUPABASE_ANON_KEY não definido no .env.local"
    exit 1
else
    echo "✅ VITE_SUPABASE_ANON_KEY definido"
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Configure Redirect URLs no Supabase Dashboard"
echo "2. Configure Google OAuth no Google Cloud Console"
echo "3. Ative Google OAuth no Supabase Dashboard"
echo "4. (Opcional) Configure Apple Sign-In"
echo ""
echo "📖 Veja o guia completo em: SETUP_OAUTH.md"
echo ""

