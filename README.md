# Influencify

MVP de uma plataforma onde influenciadores divulgam cupons/vouchers de marcas em um perfil público
(estilo link-in-bio). O visitante deixa nome, e-mail e/ou telefone para resgatar o desconto, e esse
lead fica salvo, rastreado por origem (influenciador, campanha, UTM, referral code) e disponível
para a marca usar em remarketing.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Auth + Postgres + RLS)
- Server Actions para toda escrita, Server Components para leitura
- Deploy alvo: Vercel

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um projeto em [supabase.com](https://supabase.com) e copie a URL e a `anon key` em
   **Project Settings → API**.
3. Copie `.env.example` para `.env.local` e preencha:
   ```bash
   cp .env.example .env.local
   ```
4. Rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) inteiro no **SQL Editor** do seu
   projeto Supabase. Isso cria todas as tabelas, os triggers de contagem de cliques/leads e as
   políticas de RLS.
5. (Recomendado para testar rápido) Em **Authentication → Providers → Email**, desative
   "Confirm email" para não precisar confirmar e-mail a cada cadastro de teste.
6. Rode o projeto:
   ```bash
   npm run dev
   ```

## Fluxo para testar o MVP de ponta a ponta

1. Crie uma conta **marca** em `/register`, complete o perfil em `/brand/profile` e crie uma
   campanha em `/brand/campaigns/new` (com cupom, desconto e link de destino).
2. Crie uma conta **influenciador** em `/register` e complete o perfil em `/influencer/profile`
   (isso gera o slug público, ex: `/i/seu-nome`).
3. Volte com a conta da marca em `/brand/ambassadors` e vincule o influenciador pelo slug dele.
4. Com a conta do influenciador, vá em `/influencer/campaigns`, encontre a campanha da marca e
   clique em **Gerar meu link**.
5. Acesse o link público `/i/seu-nome` (sem estar logado) — a oferta aparece na lista. Clique nela,
   preencha o formulário e veja o cupom sendo revelado.
6. Volte para os dashboards: o influenciador vê o lead em `/influencer/leads`, a marca vê o mesmo
   lead em `/brand/leads` (com exportação em CSV) e o admin (ver abaixo) vê tudo em `/admin/leads`.

## Conta de administrador

Cadastro de admin não é público por design. Para criar uma:

1. Crie o usuário normalmente pela tela de login/cadastro do Supabase Auth (ou pelo dashboard do
   Supabase, em **Authentication → Users → Add user**).
2. No **SQL Editor**, insira o perfil manualmente:
   ```sql
   insert into profiles (user_id, account_type, name, email)
   values ('<uuid do usuário em auth.users>', 'admin', 'Admin', 'admin@seudominio.com');
   ```
3. Faça login normalmente em `/login` — o middleware redireciona automaticamente para
   `/admin/dashboard`.

## Estrutura de rastreamento (como o link vira lead)

- `campaign_influencers` liga um influenciador a uma campanha específica e guarda o
  `referral_code` único dessa combinação — é isso que gera o link `/i/slug/oferta/offerSlug?ref=CODE`.
- Ao abrir a página da oferta, um registro é criado em `clicks` e o trigger `bump_referral_clicks`
  incrementa `referrals.clicks`.
- Ao enviar o formulário, um registro é criado em `leads` (associado a campanha, marca e
  influenciador) e o trigger `bump_referral_leads` incrementa `referrals.leads_count`.
- `/r/[referralCode]` é um redirecionador genérico: resolve o código para a URL certa da oferta,
  útil para compartilhar um link curto preservando o rastreio.

## Planos e pagamento (Stripe)

Contas gratuitas captam leads normalmente, mas **não veem o contato** (a lista fica bloqueada
com CTA de upgrade, e o CSV retorna 403). Para ativar os planos pagos:

1. Crie uma conta em [stripe.com](https://stripe.com) e pegue a chave secreta em
   **Developers → API keys** (use a chave de teste `sk_test_...` para desenvolver).
2. Em **Product catalog**, crie dois produtos com preço recorrente mensal:
   "Influenciador Pro" (ex: R$ 49,90) e "Marca Pro" (ex: R$ 199,90).
3. Copie o **price ID** de cada um (`price_...`) e preencha no `.env.local`:
   `STRIPE_SECRET_KEY`, `STRIPE_PRICE_INFLUENCER`, `STRIPE_PRICE_BRAND`.
4. O fluxo: `/upgrade` → Stripe Checkout → `/upgrade/success` confirma o pagamento na API do
   Stripe e ativa o plano no perfil. Em modo teste, use o cartão `4242 4242 4242 4242`.

Sem as chaves configuradas, o botão de assinatura mostra um aviso amigável em vez de quebrar.

O plano Pro inclui **7 dias de teste grátis** e o assinante gerencia (troca de cartão,
cancelamento) pelo portal do Stripe, no botão "Gerenciar assinatura" em `/upgrade`. Para manter o
plano sincronizado em renovações/cancelamentos, cadastre um webhook em **Developers → Webhooks**
apontando para `https://seudominio.com/api/stripe/webhook` (eventos `checkout.session.completed`,
`customer.subscription.updated` e `customer.subscription.deleted`) e preencha
`STRIPE_WEBHOOK_SECRET` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente.

## E-mails transacionais (Resend)

Com `RESEND_API_KEY` configurada, ao captar um lead o sistema envia automaticamente:
o **cupom por e-mail para o visitante** (valida o contato) e um **aviso de novo lead** para a
marca/influenciador dono da campanha (sem expor o contato do lead, respeitando o plano). Crie a
conta gratuita em [resend.com](https://resend.com); para produção, verifique seu domínio e ajuste
`EMAIL_FROM`. O aviso ao dono requer também `SUPABASE_SERVICE_ROLE_KEY` (para localizar o e-mail
do dono com segurança).

## Meta Pixel

Se a campanha tiver `Meta Pixel ID` preenchido, a página pública da oferta injeta o pixel e
dispara `PageView`, `ViewContent` e — no envio do formulário — o evento `Lead`, pronto para
públicos de remarketing.

## Redefinição de senha

`/forgot-password` envia o e-mail de recuperação via Supabase; o link passa por `/auth/confirm`
(que troca o código por sessão) e cai em `/reset-password`. Para funcionar fora do localhost,
configure em **Authentication → URL Configuration** no Supabase a Site URL e adicione
`https://seudominio.com/auth/confirm` nas Redirect URLs.

## O que é MVP de propósito (não implementado ainda)

- Disparo real de eventos de pixel (Meta/TikTok/Google) — os campos `meta_pixel_id`,
  `tiktok_pixel_id` e `google_tag_id` já existem na campanha, prontos para a integração.
- Envio automático do cupom por e-mail/WhatsApp — hoje o cupom é revelado na tela.
- Webhook do Stripe para renovação/cancelamento automático da assinatura — hoje a ativação
  acontece na página de sucesso do checkout.
- Fluxo de convite/aceite para embaixadores: hoje a marca vincula o influenciador diretamente pelo
  slug público dele, sem etapa de aprovação.

## Deploy

```bash
vercel
```

Configure as mesmas variáveis de `.env.example` nas Environment Variables do projeto na Vercel.
