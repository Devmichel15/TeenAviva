-- Fix devotionals schema: migrate from legacy (title, published, created_by) to current (content, author_id)
-- This migration handles the case where the old schema from 001 is still in place

-- Step 1: Drop old policies that reference old schema
drop policy if exists "devotionals_insert_public" on public.devotionals;
drop policy if exists "devotionals_select_public" on public.devotionals;
drop policy if exists "devotionals_update_own" on public.devotionals;
drop policy if exists "devotionals_delete_own" on public.devotionals;

-- Step 2: Drop old triggers and functions
drop trigger if exists trg_devotionals_updated on public.devotionals;
drop trigger if exists trg_set_devotionals_updated_at on public.devotionals;
drop function if exists public.update_devotionals_updated_at();

-- Step 3: Drop old constraints and indexes
alter table public.devotionals disable row level security;

-- Step 4: Migrate data: copy title → content if title exists and content doesn't
do $$
begin
  if exists(
    select 1 from information_schema.columns 
    where table_name = 'devotionals' and column_name = 'title'
  ) then
    -- If content column doesn't exist yet, create it and migrate data
    if not exists(
      select 1 from information_schema.columns 
      where table_name = 'devotionals' and column_name = 'content'
    ) then
      alter table public.devotionals add column content text;
      update public.devotionals set content = title where content is null;
    end if;
  end if;
end $$;

-- Step 5: Ensure author_id column exists and is properly set
do $$
begin
  if not exists(
    select 1 from information_schema.columns 
    where table_name = 'devotionals' and column_name = 'author_id'
  ) then
    alter table public.devotionals add column author_id uuid;
  end if;
  
  -- If created_by exists but author_id doesn't have data, migrate it
  if exists(
    select 1 from information_schema.columns 
    where table_name = 'devotionals' and column_name = 'created_by'
  ) then
    update public.devotionals set author_id = created_by where author_id is null and created_by is not null;
  end if;
end $$;

-- Step 6: Ensure timestamps
alter table public.devotionals
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Step 7: Make columns non-null and add constraints
alter table public.devotionals
  alter column author_id set not null,
  alter column content set not null,
  alter column created_at set default now(),
  alter column updated_at set default now();

-- Step 8: Add content length check
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'devotionals_content_length_check'
      and conrelid = 'public.devotionals'::regclass
  ) then
    alter table public.devotionals
      add constraint devotionals_content_length_check
      check (char_length(content) between 1 and 600);
  end if;
end $$;

-- Step 9: Add foreign key constraint if needed
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'devotionals_author_id_fk'
      and conrelid = 'public.devotionals'::regclass
  ) then
    alter table public.devotionals
      add constraint devotionals_author_id_fk
      foreign key (author_id) references public.profiles(id) on delete cascade;
  end if;
end $$;

-- Step 10: Create proper indexes
create index if not exists idx_devotionals_author on public.devotionals(author_id);
create index if not exists idx_devotionals_created_at on public.devotionals(created_at desc);

-- Step 11: Create updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Step 12: Apply updated_at trigger
drop trigger if exists trg_devotionals_updated on public.devotionals;
create trigger trg_devotionals_updated
  before update on public.devotionals
  for each row execute function public.set_updated_at();

-- Step 13: Enable RLS
alter table public.devotionals enable row level security;

-- Step 14: Create new policies
drop policy if exists "devotionals_select_authenticated" on public.devotionals;
create policy "devotionals_select_authenticated"
  on public.devotionals for select
  using (auth.role() = 'authenticated');

drop policy if exists "devotionals_insert_own" on public.devotionals;
create policy "devotionals_insert_own"
  on public.devotionals for insert
  with check (author_id = auth.uid());

drop policy if exists "devotionals_update_own_new" on public.devotionals;
create policy "devotionals_update_own_new"
  on public.devotionals for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "devotionals_delete_own_new" on public.devotionals;
create policy "devotionals_delete_own_new"
  on public.devotionals for delete
  using (author_id = auth.uid());

-- Step 15: Clean up old columns if they exist (keep for reference, can remove later)
-- Note: Do NOT drop old columns yet in case we need them for rollback.
-- Comment them out for now to preserve historical data.

comment on column public.devotionals.title is 'LEGACY: Use content instead. Kept for data reference.';
comment on column public.devotionals.published is 'LEGACY: Not used in current schema.';
comment on column public.devotionals.created_by is 'LEGACY: Use author_id instead.';
