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

## O que é MVP de propósito (não implementado ainda)

- Cobrança real dos planos (`plans` já existe como catálogo, mas não há checkout).
- Disparo real de eventos de pixel (Meta/TikTok/Google) — os campos `meta_pixel_id`,
  `tiktok_pixel_id` e `google_tag_id` já existem na campanha, prontos para a integração.
- Envio automático do cupom por e-mail/WhatsApp — hoje o cupom é revelado na tela.
- Upload de imagem (avatar/logo/oferta): os campos aceitam apenas URL por enquanto.
- Fluxo de convite/aceite para embaixadores: hoje a marca vincula o influenciador diretamente pelo
  slug público dele, sem etapa de aprovação.

## Deploy

```bash
vercel
```

Configure as mesmas variáveis de `.env.example` nas Environment Variables do projeto na Vercel.
