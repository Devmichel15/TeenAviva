# Auditoria de persistência

## Resumo executivo

Este relatório identifica divergências entre o schema atual da app e os acessos de dados no código. A maior causa raiz é a mistura entre dois modelos de dados:

- `001_initial_schema.sql`: modelo antigo com `devotionals` de arquitetura (título, published, created_by, etc.)
- `002_devotionals_avatar.sql`: modelo de devocionais usado pela UI atual com `author_id`, `content`, etc.

As entradas abaixo foram validadas contra `docs/schema-atual.md`.

## 1) Signup / trigger de criação de perfil

### 1.1 `supabase/migrations/001_initial_schema.sql`

- Arquivo: `supabase/migrations/001_initial_schema.sql`
- Linhas: 65-83
- Referência: `public.handle_new_user()` / trigger `on_auth_user_created`
- Uso do schema atual: insere em `public.profiles (id, name, email)`
- Status: coerente com `docs/schema-atual.md`

Observação:

- O trigger não preenche `avatar_url`, `onboarding_completed`, etc. porque essas colunas têm default ou são opcionais.
- O trigger usa `name` e `email` corretamente. A coluna `full_name` não existe.

### 1.2 `src/services/auth.service.js`

- Arquivo: `src/services/auth.service.js`
- Linhas: 62-76
- Referência: `supabase.auth.signUp({ email, password, options: { data: { name } } })`
- Uso do schema atual: correto em relação a `auth.users.raw_user_meta_data` e ao trigger `handle_new_user`
- Status: coerente

## 2) Devocionais

### 2.1 `src/hooks/useDevotionals.js`

- Arquivo: `src/hooks/useDevotionals.js`
- Linhas: 41-49, 122-126
- Referência: `.from("devotionals").select("id, content, author_id, created_at, updated_at, profiles!author_id(name, avatar_url)")`
- Uso do schema atual: correto para a tabela `public.devotionals` e a relação `profiles!author_id`
- Status: coerente

### 2.2 `src/hooks/useDevotionals.js`

- Arquivo: `src/hooks/useDevotionals.js`
- Linhas: 119-138
- Referência: `.insert({ author_id: authData.user.id, content: trimmed })`
- Uso do schema atual: correto para `public.devotionals.author_id` e `public.devotionals.content`
- Status: coerente

### 2.3 `supabase/migrations/001_initial_schema.sql`

- Arquivo: `supabase/migrations/001_initial_schema.sql`
- Linhas: 419-446
- Referência: tabela antiga `public.devotionals` com campos `title`, `content`, `published`, `created_by`
- Uso do schema atual: divergente do contrato atual da app
- Status: legado; não deve ser usado pela UI atual

## 3) Nome do user / profile

### 3.1 `src/hooks/useDevotionals.js`

- Arquivo: `src/hooks/useDevotionals.js`
- Linhas: 9-18
- Referência: `author.name || author.full_name || "TeenAviva"`
- Uso do schema atual: incorreto; `profiles.full_name` não existe
- Status: divergente

### 3.2 `src/hooks/useDevotionals.js`

- Arquivo: `src/hooks/useDevotionals.js`
- Linhas: 108-116
- Referência: `authData.user.user_metadata?.name || "Tu"`
- Uso do schema atual: fallback aceitável para UI, mas não é a fonte de verdade oficial
- Status: aceitável como fallback temporário; a fonte oficial é `profiles.name`

### 3.3 `src/services/profile.service.js`

- Arquivo: `src/services/profile.service.js`
- Linhas: 1-19, 38-80
- Referência: `SELECT_COLUMNS = "id, name, email, ..."`
- Uso do schema atual: correto
- Status: coerente

## 4) Storage / avatar

### 4.1 `src/hooks/useAvatarUpload.js`

- Arquivo: `src/hooks/useAvatarUpload.js`
- Linhas: 49-92
- Referência: `supabase.storage.from("avatars")` e `profiles.avatar_url`
- Uso do schema atual: correto para bucket `avatars` e coluna `profiles.avatar_url`
- Status: coerente

## 5) Problemas conhecidos resolvidos / a verificar

### Signup

- Trigger/insert em `profiles` está coerente com o schema atual.
- Ainda assim, o client deve tratar `error` e timeouts explícitos para não travar a UI.

### Devocionais

- O insert em `public.devotionals` está coerente com o schema atual.
- O erro real do cliente é a ausência do schema real no projeto Supabase e/ou políticas de acesso inconsistentes na base alvo.

### Nome do user

- Fallback `user_metadata.name` pode aparecer, mas a fonte oficial é `profiles.name`.
- A referência a `author.full_name` é inválida e deve ser removida.

## Status final da auditoria

- `profiles.name` => correta
- `profiles.avatar_url` => correta
- `devotionals.author_id` => correta
- `devotionals.content` => correta
- `profiles.full_name` => inexistente na base real
- `devotionals.user_id` => inexistente no contrato atual
- `devotionals.created_by` => legado; não usado no schema atual
