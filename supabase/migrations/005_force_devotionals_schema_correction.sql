-- Direct schema fix: unconditionally migrate devotionals table structure
-- This migration forcefully applies the correct schema

-- First, disable RLS to allow modifications
alter table public.devotionals disable row level security;

-- Remove all existing policies
drop policy if exists "devotionals_insert_public" on public.devotionals;
drop policy if exists "devotionals_select_public" on public.devotionals;
drop policy if exists "devotionals_update_own" on public.devotionals;
drop policy if exists "devotionals_delete_own" on public.devotionals;
drop policy if exists "devotionals_select_authenticated" on public.devotionals;
drop policy if exists "devotionals_insert_own" on public.devotionals;
drop policy if exists "devotionals_update_own_new" on public.devotionals;
drop policy if exists "devotionals_delete_own_new" on public.devotionals;

-- Drop all indexes
drop index if exists idx_devotionals_author;
drop index if exists idx_devotionals_created_at;
drop index if exists idx_devotionals_author_id;
drop index if exists idx_devotionals_created_by;

-- Drop triggers
drop trigger if exists trg_devotionals_updated on public.devotionals;
drop trigger if exists trg_set_devotionals_updated_at on public.devotionals;

-- Drop foreign keys
alter table public.devotionals drop constraint if exists devotionals_author_id_fk;
alter table public.devotionals drop constraint if exists devotionals_created_by_fk;

-- Drop constraints
alter table public.devotionals drop constraint if exists devotionals_content_length_check;

-- Now ensure the new columns exist and old data is migrated
-- Add new columns if they don't exist
alter table public.devotionals
  add column if not exists author_id uuid,
  add column if not exists content text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Migrate data from old columns to new (if old columns exist)
update public.devotionals
set
  content = coalesce(content, title, ''),
  author_id = coalesce(author_id, created_by, auth.uid()),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where true;

-- Make columns NOT NULL
alter table public.devotionals
  alter column author_id set not null,
  alter column content set not null,
  alter column created_at set not null,
  alter column updated_at set not null;

-- Add constraints back
alter table public.devotionals
  add constraint devotionals_content_length_check
    check (char_length(content) between 1 and 600),
  add constraint devotionals_author_id_fk
    foreign key (author_id) references public.profiles(id) on delete cascade;

-- Create indexes
create index idx_devotionals_author on public.devotionals(author_id);
create index idx_devotionals_created_at on public.devotionals(created_at desc);

-- Create trigger function for updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply trigger
create trigger trg_devotionals_updated
  before update on public.devotionals
  for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.devotionals enable row level security;

-- Create new RLS policies
create policy "devotionals_select_authenticated"
  on public.devotionals for select
  using (auth.role() = 'authenticated');

create policy "devotionals_insert_own"
  on public.devotionals for insert
  with check (author_id = auth.uid());

create policy "devotionals_update_own"
  on public.devotionals for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "devotionals_delete_own"
  on public.devotionals for delete
  using (author_id = auth.uid());
