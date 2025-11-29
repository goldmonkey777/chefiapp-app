# ChefIApp™ – Modelos de Email (Supabase Auth)

Copie/cole estes modelos em **Supabase Dashboard → Authentication → Templates**.  
Mantenha as variáveis `{{ .Email }}` e `{{ .ConfirmationURL }}` exatamente como estão.

## 1) Login/Signup por Magic Link
**Subject:** ChefIApp • Acesse sua conta  
Use também para o template de confirmação de email.

```html
<!doctype html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#0b132b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b132b;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;">
          <tr><td align="center" style="font-size:24px;font-weight:700;color:#0b132b;">ChefIApp</td></tr>
          <tr><td style="padding-top:12px;font-size:16px;color:#0b132b;">Olá, {{ .Email }}!</td></tr>
          <tr><td style="padding:12px 0 20px;font-size:14px;color:#243b53;">Clique no botão abaixo para entrar com segurança.</td></tr>
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#ff7f11;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;">Entrar agora</a>
            </td>
          </tr>
          <tr><td style="font-size:13px;color:#516b8b;">Se o botão não funcionar, copie e cole este link:<br/>{{ .ConfirmationURL }}</td></tr>
          <tr><td style="padding-top:20px;font-size:12px;color:#9fb3c8;">Se você não solicitou este acesso, ignore este email.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## 2) Redefinir Senha
**Subject:** ChefIApp • Redefina sua senha

```html
<!doctype html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#0b132b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b132b;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;">
          <tr><td align="center" style="font-size:24px;font-weight:700;color:#0b132b;">Redefinir senha</td></tr>
          <tr><td style="padding:12px 0;font-size:14px;color:#243b53;">Recebemos uma solicitação para atualizar sua senha. Clique em resetar:</td></tr>
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#ef476f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;">Resetar senha</a>
            </td>
          </tr>
          <tr><td style="font-size:13px;color:#516b8b;">Ou copie e cole este link:<br/>{{ .ConfirmationURL }}</td></tr>
          <tr><td style="padding-top:20px;font-size:12px;color:#9fb3c8;">Se você não pediu isso, nenhuma ação é necessária.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## 3) Convite para Equipe/Empresa
**Subject:** ChefIApp • Você foi convidado para a equipe

```html
<!doctype html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#0b132b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b132b;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;">
          <tr><td align="center" style="font-size:24px;font-weight:700;color:#0b132b;">Convite ChefIApp</td></tr>
          <tr><td style="padding:12px 0;font-size:14px;color:#243b53;">Você foi convidado para acessar o ChefIApp. Conecte-se para completar seu perfil.</td></tr>
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#118ab2;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;">Aceitar convite</a>
            </td>
          </tr>
          <tr><td style="font-size:13px;color:#516b8b;">Link direto: {{ .ConfirmationURL }}</td></tr>
          <tr><td style="padding-top:20px;font-size:12px;color:#9fb3c8;">Se não reconhece este convite, ignore este email.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## 4) Alteração de Email
**Subject:** ChefIApp • Confirme seu novo email

```html
<!doctype html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#0b132b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b132b;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;">
          <tr><td align="center" style="font-size:24px;font-weight:700;color:#0b132b;">Confirmar novo email</td></tr>
          <tr><td style="padding:12px 0;font-size:14px;color:#243b53;">Clique abaixo para confirmar a alteração do seu email para {{ .Email }}.</td></tr>
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#06d6a0;color:#0b132b;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;">Confirmar email</a>
            </td>
          </tr>
          <tr><td style="font-size:13px;color:#516b8b;">Link direto: {{ .ConfirmationURL }}</td></tr>
          <tr><td style="padding-top:20px;font-size:12px;color:#9fb3c8;">Se você não pediu essa alteração, ignore este email.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Dicas
- Sempre teste cada template com "Send test email" no Supabase.  
- Deixe o logo opcional; você pode trocar o texto “ChefIApp” pela URL do logo público.  
- Garanta que `Site URL` e `Redirect URLs` no Supabase correspondem ao ambiente (localhost, chefiapp.com e os deep links `chefiapp://auth/callback`).
