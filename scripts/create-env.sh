#!/bin/bash

# ChefIApp™ - Script para criar/atualizar .env.local

echo "🔐 ChefIApp™ - Configuração de Variáveis de Ambiente"
echo "====================================================="
echo ""

ENV_FILE=".env.local"

# Verificar se .env.local já existe
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  Arquivo .env.local já existe!"
    read -p "Deseja sobrescrever? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Operação cancelada"
        exit 1
    fi
fi

echo ""
echo "📋 Vamos configurar suas variáveis de ambiente:"
echo ""

# Solicitar Supabase URL
read -p "1. VITE_SUPABASE_URL (ex: https://xxxxx.supabase.co): " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ URL do Supabase é obrigatória!"
    exit 1
fi

# Solicitar Supabase Anon Key
read -p "2. VITE_SUPABASE_ANON_KEY (chave longa começando com eyJ...): " SUPABASE_KEY
if [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Chave do Supabase é obrigatória!"
    exit 1
fi

# Solicitar Gemini API Key (opcional)
read -p "3. GEMINI_API_KEY (opcional, pressione Enter para pular): " GEMINI_KEY

# Criar arquivo .env.local
cat > "$ENV_FILE" << EOF
# ChefIApp™ - Environment Variables
# Gerado automaticamente em $(date)

# Supabase Configuration (OBRIGATÓRIO)
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY

# Gemini AI Configuration (OPCIONAL)
EOF

if [ ! -z "$GEMINI_KEY" ]; then
    echo "GEMINI_API_KEY=$GEMINI_KEY" >> "$ENV_FILE"
else
    echo "# GEMINI_API_KEY=[ADICIONE_SE_NECESSARIO]" >> "$ENV_FILE"
fi

echo ""
echo "✅ Arquivo .env.local criado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure Redirect URLs no Supabase Dashboard"
echo "2. Configure Google OAuth (veja SETUP_OAUTH.md)"
echo "3. Execute: npm run build && npx cap sync ios"
echo ""

