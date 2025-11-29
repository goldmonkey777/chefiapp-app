-- ============================================
-- CHEFIAPP™ - SEED DATA (OPCIONAL)
-- Dados de teste para desenvolvimento
-- Execute SOMENTE em ambiente de desenvolvimento
-- ============================================

-- ⚠️ ATENÇÃO: NÃO EXECUTE EM PRODUÇÃO!

-- ============================================
-- SEED: Empresa de Teste
-- ============================================

INSERT INTO companies (name, invite_code, logo)
VALUES
  ('Hotel Sunrise', 'HOTEL1', null),
  ('Resort Paradise', 'RESORT', null),
  ('Pousada Vista Mar', 'POUSAD', null)
ON CONFLICT (invite_code) DO NOTHING;

-- Obter IDs das empresas (salve para usar abaixo)
-- SELECT id, name, invite_code FROM companies;

-- ============================================
-- SEED: Usuários de Teste
-- ============================================

-- ⚠️ Substitua os UUIDs abaixo pelos IDs reais dos seus usuários
-- Para criar usuários de teste, use o Supabase Auth:
-- 1. Vá em Authentication > Users
-- 2. Clique em "Add user"
-- 3. Crie os usuários
-- 4. Copie os IDs e substitua abaixo

-- Exemplo (NÃO EXECUTAR - apenas referência):
-- UPDATE profiles
-- SET
--   company_id = 'uuid-da-empresa-aqui',
--   role = 'ADMIN',
--   sector = 'MANAGEMENT',
--   xp = 1000
-- WHERE id = 'uuid-do-usuario-aqui';

-- ============================================
-- SEED: Tarefas de Exemplo
-- ============================================

-- ⚠️ Substitua os UUIDs pelos IDs reais
-- company_id: ID da empresa
-- assigned_to: ID do usuário que vai receber
-- created_by: ID do usuário que criou

-- Exemplo (NÃO EXECUTAR - apenas referência):
-- INSERT INTO tasks (
--   title,
--   description,
--   company_id,
--   assigned_to,
--   created_by,
--   status,
--   priority,
--   xp_reward
-- )
-- VALUES
--   (
--     'Limpar Cozinha',
--     'Fazer limpeza profunda da cozinha incluindo fogões e geladeiras',
--     'uuid-empresa',
--     'uuid-staff',
--     'uuid-manager',
--     'PENDING',
--     'HIGH',
--     50
--   ),
--   (
--     'Organizar Recepção',
--     'Organizar documentos e materiais da recepção',
--     'uuid-empresa',
--     'uuid-staff',
--     'uuid-manager',
--     'PENDING',
--     'MEDIUM',
--     30
--   );

-- ============================================
-- QUERIES ÚTEIS PARA DESENVOLVIMENTO
-- ============================================

-- Ver todas as empresas
-- SELECT * FROM companies;

-- Ver todos os usuários
-- SELECT
--   id,
--   name,
--   email,
--   role,
--   company_id,
--   xp,
--   level
-- FROM profiles;

-- Ver todas as tarefas
-- SELECT
--   t.title,
--   t.status,
--   t.priority,
--   t.xp_reward,
--   p.name as assigned_to_name,
--   c.name as company_name
-- FROM tasks t
-- LEFT JOIN profiles p ON t.assigned_to = p.id
-- LEFT JOIN companies c ON t.company_id = c.id;

-- Estatísticas por empresa
-- SELECT
--   c.name as company,
--   COUNT(DISTINCT p.id) as total_users,
--   COUNT(DISTINCT t.id) as total_tasks,
--   COUNT(DISTINCT CASE WHEN t.status = 'DONE' THEN t.id END) as completed_tasks,
--   SUM(CASE WHEN t.status = 'DONE' THEN t.xp_reward ELSE 0 END) as total_xp_earned
-- FROM companies c
-- LEFT JOIN profiles p ON p.company_id = c.id
-- LEFT JOIN tasks t ON t.company_id = c.id
-- GROUP BY c.id, c.name;

-- Top 10 usuários por XP
-- SELECT
--   name,
--   email,
--   xp,
--   level,
--   streak
-- FROM profiles
-- ORDER BY xp DESC
-- LIMIT 10;
