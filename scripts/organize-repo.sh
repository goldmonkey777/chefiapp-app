#!/bin/bash

# ============================================================
# CHEFIAPP - Script de Organização do Repositório
# Execute: chmod +x scripts/organize-repo.sh && ./scripts/organize-repo.sh
# ============================================================

echo "🔧 Organizando estrutura do repositório ChefIApp..."
echo ""

# Criar estrutura de diretórios
mkdir -p docs/troubleshooting/oauth
mkdir -p docs/troubleshooting/capacitor
mkdir -p docs/troubleshooting/supabase
mkdir -p docs/setup/legacy
mkdir -p docs/archived

# Contar arquivos antes
FILES_BEFORE=$(ls *.md 2>/dev/null | wc -l)

# Mover arquivos OAuth para docs/troubleshooting/oauth/
echo "📁 Movendo arquivos OAuth..."
mv OAUTH_*.md docs/troubleshooting/oauth/ 2>/dev/null
mv *GOOGLE_OAUTH*.md docs/troubleshooting/oauth/ 2>/dev/null
mv *APPLE_OAUTH*.md docs/troubleshooting/oauth/ 2>/dev/null
mv OBTER_CREDENCIAIS_GOOGLE.md docs/troubleshooting/oauth/ 2>/dev/null
mv CRIAR_KEY_APPLE.md docs/troubleshooting/oauth/ 2>/dev/null
mv COMO_COLAR_KEY_APPLE_SUPABASE.md docs/troubleshooting/oauth/ 2>/dev/null
mv FIX_SAFARI_OAUTH_ERROR.md docs/troubleshooting/oauth/ 2>/dev/null
mv SOLUCAO_OAUTH_QUERY_PARAMETER.md docs/troubleshooting/oauth/ 2>/dev/null
mv PROBLEMA_OAUTH_COMPLETO.md docs/troubleshooting/oauth/ 2>/dev/null
mv SOLUCAO_FINAL_OAUTH.md docs/troubleshooting/oauth/ 2>/dev/null
mv DEBUG_OAUTH.md docs/troubleshooting/oauth/ 2>/dev/null

# Mover arquivos de teste OAuth
mv TESTAR*.md docs/troubleshooting/oauth/ 2>/dev/null
mv TESTE*.md docs/troubleshooting/oauth/ 2>/dev/null

# Mover arquivos Capacitor para docs/troubleshooting/capacitor/
echo "📁 Movendo arquivos Capacitor..."
mv ERROS_CAPACITOR_SAO_WARNINGS.md docs/troubleshooting/capacitor/ 2>/dev/null
mv IGNORAR_ERROS_CAPACITOR.md docs/troubleshooting/capacitor/ 2>/dev/null
mv IGNORAR_ERROS_VERIFYMODULE.md docs/troubleshooting/capacitor/ 2>/dev/null
mv SOLUCAO_FINAL_CAPACITOR.md docs/troubleshooting/capacitor/ 2>/dev/null
mv WARNINGS_CAPACITOR_FINAL.md docs/troubleshooting/capacitor/ 2>/dev/null
mv FIX_SEARCH_PATH_ISSUE.md docs/troubleshooting/capacitor/ 2>/dev/null

# Mover arquivos Supabase para docs/troubleshooting/supabase/
echo "📁 Movendo arquivos Supabase..."
mv ATUALIZAR_POSTGRES.md docs/troubleshooting/supabase/ 2>/dev/null
mv ATUALIZAR_SUPABASE_REDIRECT_URLS.md docs/troubleshooting/supabase/ 2>/dev/null
mv COLAR_NO_SUPABASE_AGORA.md docs/troubleshooting/supabase/ 2>/dev/null
mv HABILITAR_PROTECAO_SENHAS.md docs/troubleshooting/supabase/ 2>/dev/null
mv HABILITAR_SIGNUPS_SUPABASE.md docs/troubleshooting/supabase/ 2>/dev/null
mv CREDENCIAIS_INCORRETAS.md docs/troubleshooting/supabase/ 2>/dev/null
mv FIX_PROVIDER_NOT_ENABLED.md docs/troubleshooting/supabase/ 2>/dev/null

# Mover arquivos de redirect/deep link para docs/troubleshooting/
echo "📁 Movendo arquivos de redirect..."
mv CORRIGIR_REDIRECT_URI_AGORA.md docs/troubleshooting/ 2>/dev/null
mv CORRIGIR_REDIRECT_URI_FINAL.md docs/troubleshooting/ 2>/dev/null
mv FIX_REDIRECT_URI_MISMATCH.md docs/troubleshooting/ 2>/dev/null
mv VERIFICAR_CALLBACK_URL.md docs/troubleshooting/ 2>/dev/null
mv VERIFICAR_REDIRECT_URI_EXATA.md docs/troubleshooting/ 2>/dev/null
mv CONFIGURAR_DEEP_LINK_SUPABASE.md docs/troubleshooting/ 2>/dev/null
mv DEBUG_DEEP_LINK.md docs/troubleshooting/ 2>/dev/null
mv FIX_SUPABASE_DEEP_LINK_REDIRECT.md docs/troubleshooting/ 2>/dev/null

# Mover arquivos de setup legado para docs/setup/legacy/
echo "📁 Movendo arquivos de setup legado..."
mv SETUP_RAPIDO.md docs/setup/legacy/ 2>/dev/null
mv CRIAR_REPOSITORIO_GITHUB.md docs/setup/legacy/ 2>/dev/null

# Mover arquivos de análise para docs/
echo "📁 Movendo arquivos de análise..."
mv ANALISE_*.md docs/ 2>/dev/null
mv ENTENDIMENTO_PROJETO.md docs/ 2>/dev/null

# Contar arquivos depois
FILES_AFTER=$(ls *.md 2>/dev/null | wc -l)
FILES_MOVED=$((FILES_BEFORE - FILES_AFTER))

echo ""
echo "✅ Organização concluída!"
echo ""
echo "📊 Estatísticas:"
echo "   • Arquivos .md na raiz antes: $FILES_BEFORE"
echo "   • Arquivos .md na raiz depois: $FILES_AFTER"
echo "   • Arquivos movidos: $FILES_MOVED"
echo ""
echo "📁 Nova estrutura:"
echo "   docs/troubleshooting/oauth/     - Problemas OAuth"
echo "   docs/troubleshooting/capacitor/ - Problemas Capacitor"
echo "   docs/troubleshooting/supabase/  - Problemas Supabase"
echo "   docs/setup/legacy/              - Guias de setup antigos"
echo ""
echo "🎯 Próximo passo:"
echo "   git add . && git commit -m 'chore: organize repository structure' && git push"
echo ""

