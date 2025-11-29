# 📦 Criar Bucket no Supabase Storage

**Tempo:** 2 minutos

---

## 🎯 Passo a Passo

### 1. Acesse o Supabase Dashboard
- URL: https://supabase.com/dashboard
- Selecione seu projeto

### 2. Vá em Storage
- No menu lateral esquerdo, clique em **Storage**

### 3. Criar Novo Bucket
- Clique no botão **New bucket** (geralmente no canto superior direito)

### 4. Configurar Bucket
- **Name:** `company-assets`
- **Public bucket:** ❌ **DESMARCADO** (deixe privado)
- Clique em **Create bucket**

### 5. Verificar
- Você deve ver o bucket `company-assets` na lista de buckets

---

## ✅ Configuração Correta

```
Nome: company-assets
Tipo: Private (não público)
Status: ✅ Criado
```

---

## 🔐 Políticas de Acesso (Opcional)

Se precisar configurar políticas de acesso depois:

1. Clique no bucket `company-assets`
2. Vá em **Policies**
3. Adicione políticas conforme necessário

**Por enquanto, deixe como está (privado).**

---

## ✅ Próximo Passo

Depois de criar o bucket, configure as Redirect URLs:
- Authentication → URL Configuration
- Adicione: `chefiapp://auth/callback`

