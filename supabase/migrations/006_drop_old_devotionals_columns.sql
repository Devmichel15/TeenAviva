-- CRITICAL FIX: devotionals table has BOTH old and new columns, both required
-- This migration drops the old columns completely and cleans up the schema

-- Step 1: Disable RLS temporarily
alter table public.devotionals disable row level security;

-- Step 2: Drop all policies
do $$
declare
  policy_name text;
begin
  for policy_name in
    select policyname from pg_policies 
    where schemaname = 'public' and tablename = 'devotionals'
  loop
    execute 'drop policy if exists ' || quote_ident(policy_name) || ' on public.devotionals';
  end loop;
end $$;

-- Step 3: Drop all triggers
drop trigger if exists trg_devotionals_updated on public.devotionals;
drop trigger if exists trg_set_devotionals_updated_at on public.devotionals;

-- Step 4: Drop all indexes
drop index if exists idx_devotionals_author;
drop index if exists idx_devotionals_created_at;
drop index if exists idx_devotionals_author_id;
drop index if exists idx_devotionals_created_by;

-- Step 5: Drop foreign keys and constraints
alter table public.devotionals drop constraint if exists devotionals_author_id_fk;
alter table public.devotionals drop constraint if exists devotionals_created_by_fk;
alter table public.devotionals drop constraint if exists devotionals_content_length_check;

-- Step 6: Drop old columns if they exist
alter table public.devotionals drop column if exists title cascade;
alter table public.devotionals drop column if exists published cascade;
alter table public.devotionals drop column if exists created_by cascade;

-- Step 7: Ensure the columns we need exist
alter table public.devotionals add column if not exists author_id uuid;
alter table public.devotionals add column if not exists content text;
alter table public.devotionals add column if not exists created_at timestamptz default now();
alter table public.devotionals add column if not exists updated_at timestamptz default now();

-- Step 8: Ensure columns are NOT NULL
alter table public.devotionals
  alter column author_id set not null,
  alter column content set not null,
  alter column created_at set not null,
  alter column updated_at set not null;

-- Step 9: Set default values for timestamps
alter table public.devotionals
  alter column created_at set default now(),
  alter column updated_at set default now();

-- Step 10: Add content length check
alter table public.devotionals add constraint devotionals_content_length_check
  check (char_length(content) between 1 and 600);

-- Step 11: Add foreign key constraint
alter table public.devotionals add constraint devotionals_author_id_fk
  foreign key (author_id) references public.profiles(id) on delete cascade;

-- Step 12: Create indexes
create index idx_devotionals_author on public.devotionals(author_id);
create index idx_devotionals_created_at on public.devotionals(created_at desc);

-- Step 13: Create/recreate trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Step 14: Apply trigger
create trigger trg_devotionals_updated
  before update on public.devotionals
  for each row execute function public.set_updated_at();

-- Step 15: Enable RLS
alter table public.devotionals enable row level security;

-- Step 16: Create correct RLS policies
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
