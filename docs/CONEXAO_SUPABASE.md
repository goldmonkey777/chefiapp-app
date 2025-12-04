# 🔌 ChefIApp - Conexão com Supabase

> **Última Atualização:** Dezembro 2024
> **Status de Segurança:** ✅ 90% dos avisos resolvidos

---

## 📊 Informações do Projeto

| Campo | Valor |
|-------|-------|
| **Nome** | ChefIApp |
| **Project ID** | `mcmxniuokmvzuzqfnpnn` |
| **URL da API** | `https://mcmxniuokmvzuzqfnpnn.supabase.co` |
| **Região** | (verificar no dashboard) |

---

## 🔧 Configuração Local

### 1. Variáveis de Ambiente

O projeto usa **Vite**, então as variáveis precisam do prefixo `VITE_`.

Crie ou atualize o arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

> ⚠️ **Importante:** A chave anônima (`anon key`) é diferente da "publishable key". 
> Encontre-a em: **Settings → API → Project API keys → anon public**

### 2. Onde Encontrar a Chave Anônima

1. Acesse: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/settings/api
2. Role até "Project API keys"
3. Copie a chave `anon` (public)
4. Cole no `.env` como `VITE_SUPABASE_ANON_KEY`

### 3. Cliente Supabase

O cliente já está configurado em `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais (19 total)

| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `profiles` | Perfis de usuários | ✅ |
| `companies` | Empresas/Restaurantes | ✅ |
| `orders` | Pedidos | ✅ |
| `order_items` | Itens dos pedidos | ✅ |
| `products` | Produtos/Menu | ✅ |
| `restaurant_tables` | Mesas | ✅ |
| `positions` | Cargos/Funções | ✅ |
| `sectors` | Setores do restaurante | ✅ |
| `shifts` | Turnos de trabalho | ✅ |
| `tasks` | Tarefas | ✅ |
| `achievements` | Conquistas disponíveis | ✅ |
| `user_achievements` | Conquistas do usuário | ✅ |
| `activities` | Registro de atividades | ✅ |
| `check_ins` | Check-ins de funcionários | ✅ |
| `checkins` | (alias) | ✅ |
| `notifications` | Notificações | ✅ |
| `kv_store_*` | Armazenamento key-value | ✅ |

---

## 🔒 Segurança

### Status Atual
- ✅ **RLS ativo** em todas as tabelas
- ✅ **Anonymous sign-ins desabilitado**
- ✅ Apenas usuários autenticados têm acesso

### Avisos Restantes (Opcionais)
1. Leaked Password Protection - Pode ser habilitado
2. Postgres Updates - Upgrade de infraestrutura

---

## 🧪 Testar Conexão

```typescript
// Em qualquer componente React
import { supabase } from '@/lib/supabase';

const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Conectado ao Supabase ChefIApp!');
    console.log('Project URL:', supabase.supabaseUrl);
  } catch (err) {
    console.error('❌ Erro de conexão:', err);
  }
};
```

---

## 🔗 Links Úteis

- [Dashboard do Projeto](https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn)
- [Configurações de API](https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/settings/api)
- [Authentication Settings](https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/auth/providers)
- [Table Editor](https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/editor)
- [SQL Editor](https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/sql/new)
- [Security Advisor](https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/advisors/security)

---

## 📱 OAuth Redirect URLs

Configuradas em Authentication → URL Configuration:

```
chefiapp://auth/callback
com.chefiapp.app://auth/callback
com-chefiapp-app://auth/callback
http://localhost:5173/auth/callback
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

---

**Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)**

