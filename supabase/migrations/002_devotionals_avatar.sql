-- TeenAviva: devotionals + avatar support

alter table public.profiles
  add column if not exists avatar_url text;

create table if not exists public.devotionals (
  id uuid primary key default gen_random_uuid(),
  author_id uuid,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.devotionals
  add column if not exists author_id uuid,
  add column if not exists content text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.devotionals
set content = coalesce(content, '')
where content is null;

update public.devotionals
set author_id = auth.uid()
where author_id is null and auth.uid() is not null;

alter table public.devotionals
  alter column author_id set not null,
  alter column content set not null,
  alter column created_at set default now(),
  alter column updated_at set default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'devotionals_content_length_check'
      and conrelid = 'public.devotionals'::regclass
  ) then
    alter table public.devotionals
      add constraint devotionals_content_length_check
      check (char_length(content) between 1 and 600);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'devotionals_author_id_fk'
      and conrelid = 'public.devotionals'::regclass
  ) then
    alter table public.devotionals
      add constraint devotionals_author_id_fk
      foreign key (author_id) references public.profiles(id) on delete cascade;
  end if;
end $$;

create index if not exists idx_devotionals_author on public.devotionals(author_id);
create index if not exists idx_devotionals_created_at on public.devotionals(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_devotionals_updated on public.devotionals;
create trigger trg_devotionals_updated
  before update on public.devotionals
  for each row execute function public.set_updated_at();

alter table public.devotionals enable row level security;

drop policy if exists "devotionals_select_authenticated" on public.devotionals;
create policy "devotionals_select_authenticated"
  on public.devotionals for select
  using (auth.role() = 'authenticated');

drop policy if exists "devotionals_insert_own" on public.devotionals;
create policy "devotionals_insert_own"
  on public.devotionals for insert
  with check (author_id = auth.uid());

drop policy if exists "devotionals_update_own" on public.devotionals;
create policy "devotionals_update_own"
  on public.devotionals for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "devotionals_delete_own" on public.devotionals;
create policy "devotionals_delete_own"
  on public.devotionals for delete
  using (author_id = auth.uid());

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or auth.role() = 'authenticated');

drop policy if exists "profiles_avatar_update_own" on public.profiles;
create policy "profiles_avatar_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_avatar_select_auth" on public.profiles;
create policy "profiles_avatar_select_auth"
  on public.profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "profiles_avatar_insert_own" on public.profiles;
create policy "profiles_avatar_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own_folder" on storage.objects;
create policy "avatars_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatars_update_own_folder" on storage.objects;
create policy "avatars_update_own_folder"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatars_delete_own_folder" on storage.objects;
create policy "avatars_delete_own_folder"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatars_update_own_path" on storage.objects;
create policy "avatars_update_own_path"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;
