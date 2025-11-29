#!/bin/bash

# ChefIApp™ - Abrir SQL para copiar no Supabase
# Este script abre o arquivo SQL e mostra instruções

echo "🚀 Abrindo SQL para executar no Supabase..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SQL_FILE="supabase/COMPLETE_SETUP.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Arquivo $SQL_FILE não encontrado!"
    exit 1
fi

# Contar linhas
LINES=$(wc -l < "$SQL_FILE")
echo -e "${GREEN}✅ Arquivo encontrado: $SQL_FILE${NC}"
echo -e "${BLUE}   Total de linhas: $LINES${NC}"
echo ""

# Abrir arquivo no editor padrão
echo "📝 Abrindo arquivo SQL..."
if command -v code &> /dev/null; then
    code "$SQL_FILE"
elif command -v nano &> /dev/null; then
    nano "$SQL_FILE"
elif command -v vim &> /dev/null; then
    vim "$SQL_FILE"
else
    open "$SQL_FILE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 INSTRUÇÕES:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. No arquivo que abriu, selecione TODO o conteúdo:"
echo "   ${BLUE}Cmd+A${NC} (Mac) ou ${BLUE}Ctrl+A${NC} (Windows/Linux)"
echo ""
echo "2. Copie o conteúdo:"
echo "   ${BLUE}Cmd+C${NC} (Mac) ou ${BLUE}Ctrl+C${NC} (Windows/Linux)"
echo ""
echo "3. Acesse o Supabase Dashboard:"
echo "   ${GREEN}https://supabase.com/dashboard${NC}"
echo ""
echo "4. Vá em: ${BLUE}SQL Editor${NC} → ${BLUE}New query${NC}"
echo ""
echo "5. Cole o SQL:"
echo "   ${BLUE}Cmd+V${NC} (Mac) ou ${BLUE}Ctrl+V${NC} (Windows/Linux)"
echo ""
echo "6. Execute:"
echo "   Clique em ${BLUE}Run${NC} ou pressione ${BLUE}Cmd+Enter${NC}"
echo ""
echo "7. Verifique se funcionou:"
echo "   Vá em ${BLUE}Table Editor${NC} e veja se as tabelas foram criadas"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

