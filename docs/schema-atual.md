# Schema atual do Supabase (contrato oficial da app)

## Visão geral

Este documento consolida o contrato atual usado pela app TeenAviva. Qualquer código que diverge deste esquema deve ser tratado como defeito de persistência.

## Tabela: public.profiles

Colunas:

| coluna                   | tipo        | nullable | descrição                                                                  |
| ------------------------ | ----------- | -------- | -------------------------------------------------------------------------- |
| id                       | uuid        | no       | chave primária; referencia `auth.users(id)`                                |
| name                     | text        | no       | nome principal do utilizador; fonte de verdade para o display name         |
| email                    | text        | no       | email do utilizador                                                        |
| age                      | integer     | yes      | idade                                                                      |
| favorite_verse           | text        | yes      | verso favorito                                                             |
| avatar_url               | text        | yes      | URL pública do avatar                                                      |
| onboarding_completed     | boolean     | no       | default `false`                                                            |
| notification_preferences | jsonb       | no       | default `{"dailyReminder": true, "streakAlert": true, "verseOfDay": true}` |
| created_at               | timestamptz | no       | default `now()`                                                            |
| updated_at               | timestamptz | no       | default `now()`                                                            |

Relações:

- `id` -> `auth.users(id)` via FK

Policies ativas:

- `profiles_select_own` -> `select` para `auth.uid() = id`
- `profiles_select_auth` -> `select` para `auth.role() = 'authenticated'`
- `profiles_insert_own` -> `insert` com `auth.uid() = id`
- `profiles_update_own` -> `update` com `auth.uid() = id`

Trigger / function:

- `public.handle_new_user()` -> insere em `public.profiles` quando um `auth.users` é criado
- `trg_profiles_updated` -> atualiza `updated_at` em cada update

## Tabela: public.devotionals

Colunas:

| coluna     | tipo        | nullable | descrição                                     |
| ---------- | ----------- | -------- | --------------------------------------------- |
| id         | uuid        | no       | chave primária                                |
| author_id  | uuid        | no       | id do autor; referencia `public.profiles(id)` |
| content    | text        | no       | conteúdo do devocional                        |
| created_at | timestamptz | no       | default `now()`                               |
| updated_at | timestamptz | no       | default `now()`                               |

Relações:

- `author_id` -> `public.profiles(id)` via FK

Restrições:

- `devotionals_content_length_check` -> `char_length(content) between 1 and 600`

Policies ativas:

- `devotionals_select_authenticated` -> `select` com `auth.role() = 'authenticated'`
- `devotionals_insert_own` -> `insert` com `author_id = auth.uid()`
- `devotionals_update_own` -> `update` com `author_id = auth.uid()`
- `devotionals_delete_own` -> `delete` com `author_id = auth.uid()`

Trigger / function:

- `trg_devotionals_updated` -> atualiza `updated_at` em cada update

## Storage bucket: avatars

Bucket:

- `avatars` (public = true)

Policies ativas:

- `avatars_select_public` -> leitura pública do bucket
- `avatars_insert_own_folder` -> upload apenas para a pasta do utilizador (`auth.uid()` na path)
- `avatars_update_own_folder` -> atualização apenas na pasta do utilizador
- `avatars_delete_own_folder` -> delete apenas da pasta do utilizador

## Função de autenticação: public.handle_new_user

Assinatura:

- function `public.handle_new_user()`

Comportamento:

- é chamado por trigger `on_auth_user_created` após insert em `auth.users`
- tenta inserir em `public.profiles` com `id`, `name`, `email`
- usa `coalesce(new.raw_user_meta_data ->> 'name', '')` para preencher o nome

Importante:

- `profiles.name` é a fonte de verdade para display name da app. Não existe `profiles.full_name` neste schema.
- O client deve usar `profiles.name` e não uma coluna inexistente.

## Conclusão

O contrato oficial atualmente usado pela app é:

- `profiles.name` para nome
- `profiles.avatar_url` para avatar
- `devotionals.author_id` para autor
- `devotionals.content` para mensagem

Qualquer código que use `full_name`, `user_id` em `devotionals`, ou `profiles.full_name` está divergente do schema atual.
