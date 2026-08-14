-- =============================================================================
-- TeenAviva — Supabase migration 001: initial schema (Firebase -> Supabase)
--
-- Migration of the previous Firebase/Firestore data model into PostgreSQL:
--   users            -> profiles
--   userPlans        -> user_plans + user_plan_daily_logs (normalized dailyLogs)
--   streaks          -> streaks
--   achievements     -> achievements            (catalog, seeded)
--   userAchievements -> user_achievements
--   dailyVerse       -> daily_verses            (catalog — client fetches the
--                                                daily verse from bible.service,
--                                                table kept for parity/future)
--   plans            -> reading_plans           (catalog — plans ship in-app,
--                                                table kept for parity/future)
--   notifications    -> notifications           (parity — prefs live on profiles)
--   messages         -> messages                (parity — IA chat is stateless)
--   emotionalLogs    -> emotional_logs          (parity — not yet written)
--
-- Future social / devotional features (architecture only, no UI):
--   categories, devotionals, devotional_comments,
--   devotional_likes, devotional_bookmarks, reports
--
-- RLS is enabled on every table. Policies restrict access per behaviour.
-- Justification for "public" (authenticated) reads: catalog/reference tables.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions & enums
-- -----------------------------------------------------------------------------
create extension if not exists pgcrypto;

create type public.plan_status as enum ('active', 'completed');
create type public.report_status as enum ('pending', 'reviewed', 'resolved');
create type public.report_type as enum ('devotional', 'comment', 'user', 'other');

-- -----------------------------------------------------------------------------
-- updated_at helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- PROFILES (was: Firestore `users`)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  age integer,
  favorite_verse text,
  onboarding_completed boolean not null default false,
  notification_preferences jsonb not null default '{"dailyReminder": true, "streakAlert": true, "verseOfDay": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile whenever an auth user is created (sign up).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- READING PLANS catalog (was: Firestore `plans`) — populated in-app for now.
-- Catalog/reference data: readable by any authenticated user.
-- -----------------------------------------------------------------------------
create table public.reading_plans (
  id text primary key,
  title text not null,
  description text,
  category text,
  icon text,
  color text,
  total_days integer not null,
  created_at timestamptz not null default now()
);

alter table public.reading_plans enable row level security;

create policy "reading_plans_select_auth"
  on public.reading_plans for select
  using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- DAILY VERSES catalog (was: Firestore `dailyVerse`) — client-side fetch today.
-- Catalog/reference data: readable by any authenticated user.
-- -----------------------------------------------------------------------------
create table public.daily_verses (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reference text not null,
  text text,
  display_date text,
  created_at timestamptz not null default now()
);

alter table public.daily_verses enable row level security;

create policy "daily_verses_select_auth"
  on public.daily_verses for select
  using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- USER PLANS (was: Firestore `userPlans`)
-- -----------------------------------------------------------------------------
create table public.user_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null,
  plan_title text not null,
  plan_duration integer not null,
  plan_icon text,
  plan_icon_color text,
  current_day integer not null default 1,
  started_at timestamptz not null default now(),
  status public.plan_status not null default 'active',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create index idx_user_plans_user on public.user_plans(user_id);
create index idx_user_plans_status on public.user_plans(status);

create trigger trg_user_plans_updated
  before update on public.user_plans
  for each row execute function public.set_updated_at();

alter table public.user_plans enable row level security;

create policy "user_plans_select_own"
  on public.user_plans for select
  using (auth.uid() = user_id);

create policy "user_plans_insert_own"
  on public.user_plans for insert
  with check (auth.uid() = user_id);

create policy "user_plans_update_own"
  on public.user_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_plans_delete_own"
  on public.user_plans for delete
  using (auth.uid() = user_id);

-- Normalized daily logs (was: Firestore `userPlans.dailyLogs[]`)
-- `user_id` is denormalized (in addition to `user_plan_id`) so RLS and
-- Realtime filtering can scope directly to the owning user.
create table public.user_plan_daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_plan_id uuid not null references public.user_plans(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  day integer not null,
  completed_at timestamptz not null default now(),
  unique (user_plan_id, day)
);

create index idx_daily_logs_plan on public.user_plan_daily_logs(user_plan_id);
create index idx_daily_logs_user on public.user_plan_daily_logs(user_id);

alter table public.user_plan_daily_logs enable row level security;

create policy "daily_logs_select_own"
  on public.user_plan_daily_logs for select
  using (auth.uid() = user_id);

create policy "daily_logs_insert_own"
  on public.user_plan_daily_logs for insert
  with check (auth.uid() = user_id);

create policy "daily_logs_update_own"
  on public.user_plan_daily_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "daily_logs_delete_own"
  on public.user_plan_daily_logs for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- STREAKS (was: Firestore `streaks`)
-- -----------------------------------------------------------------------------
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  current_streak integer not null default 0,
  weekly_log jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_streaks_updated
  before update on public.streaks
  for each row execute function public.set_updated_at();

alter table public.streaks enable row level security;

create policy "streaks_select_own"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "streaks_insert_own"
  on public.streaks for insert
  with check (auth.uid() = user_id);

create policy "streaks_update_own"
  on public.streaks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "streaks_delete_own"
  on public.streaks for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- ACHIEVEMENTS catalog (was: Firestore `achievements`) — seeded to match the
-- achievements previously shown by the app. Catalog: readable by authenticated.
-- -----------------------------------------------------------------------------
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  requirement text,
  requirement_value integer,
  created_at timestamptz not null default now()
);

insert into public.achievements (title, description, icon, requirement, requirement_value) values
  ('7 dias seguidos', 'Completa 7 dias de leitura consecutivos', 'fire', 'streak', 7),
  ('1º plano completo', 'Completa o teu primeiro plano', 'book', 'plans', 1),
  ('30 dias de Chama', 'Alcança 30 dias de Chama', 'star', 'streak', 30),
  ('5 planos feitos', 'Completa 5 planos de leitura', 'heart', 'plans', 5);

alter table public.achievements enable row level security;

create policy "achievements_select_auth"
  on public.achievements for select
  using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- USER ACHIEVEMENTS (was: Firestore `userAchievements`)
-- -----------------------------------------------------------------------------
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index idx_user_achievements_user on public.user_achievements(user_id);

alter table public.user_achievements enable row level security;

create policy "user_achievements_select_own"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "user_achievements_insert_own"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

create policy "user_achievements_update_own"
  on public.user_achievements for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- NOTIFICATIONS (parity — notification preferences live on `profiles`)
-- -----------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text,
  title text,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on public.notifications(user_id);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_insert_own"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_delete_own"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- MESSAGES (parity — IA chat is currently stateless)
-- -----------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_messages_user on public.messages(user_id);

alter table public.messages enable row level security;

create policy "messages_select_own"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "messages_delete_own"
  on public.messages for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- EMOTIONAL LOGS (parity — not yet written by the client)
-- -----------------------------------------------------------------------------
create table public.emotional_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  state text,
  verse text,
  created_at timestamptz not null default now()
);

create index idx_emotional_logs_user on public.emotional_logs(user_id);

alter table public.emotional_logs enable row level security;

create policy "emotional_logs_select_own"
  on public.emotional_logs for select
  using (auth.uid() = user_id);

create policy "emotional_logs_insert_own"
  on public.emotional_logs for insert
  with check (auth.uid() = user_id);

create policy "emotional_logs_delete_own"
  on public.emotional_logs for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- FUTURE SOCIAL / DEVOTIONALS (architecture only)
-- -----------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null default 'devotional',
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_select_auth"
  on public.categories for select
  using (auth.role() = 'authenticated');

create table public.devotionals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  reference text,
  day integer,
  category_id uuid references public.categories(id) on delete set null,
  published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_devotionals_category on public.devotionals(category_id);
create index idx_devotionals_published on public.devotionals(published);

alter table public.devotionals enable row level security;

create policy "devotionals_select_published"
  on public.devotionals for select
  using (published and auth.role() = 'authenticated');

create policy "devotionals_insert_author"
  on public.devotionals for insert
  with check (auth.uid() = created_by);

create policy "devotionals_update_author"
  on public.devotionals for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create table public.devotional_comments (
  id uuid primary key default gen_random_uuid(),
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_devotional_comments_devotional on public.devotional_comments(devotional_id);

alter table public.devotional_comments enable row level security;

create policy "devotional_comments_select_auth"
  on public.devotional_comments for select
  using (auth.role() = 'authenticated');

create policy "devotional_comments_insert_own"
  on public.devotional_comments for insert
  with check (auth.uid() = user_id);

create policy "devotional_comments_delete_own"
  on public.devotional_comments for delete
  using (auth.uid() = user_id);

create table public.devotional_likes (
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (devotional_id, user_id)
);

alter table public.devotional_likes enable row level security;

create policy "devotional_likes_select_auth"
  on public.devotional_likes for select
  using (auth.role() = 'authenticated');

create policy "devotional_likes_insert_own"
  on public.devotional_likes for insert
  with check (auth.uid() = user_id);

create policy "devotional_likes_delete_own"
  on public.devotional_likes for delete
  using (auth.uid() = user_id);

create table public.devotional_bookmarks (
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (devotional_id, user_id)
);

alter table public.devotional_bookmarks enable row level security;

create policy "devotional_bookmarks_select_own"
  on public.devotional_bookmarks for select
  using (auth.uid() = user_id);

create policy "devotional_bookmarks_insert_own"
  on public.devotional_bookmarks for insert
  with check (auth.uid() = user_id);

create policy "devotional_bookmarks_delete_own"
  on public.devotional_bookmarks for delete
  using (auth.uid() = user_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  report_type public.report_type not null default 'other',
  target_devotional_id uuid references public.devotionals(id) on delete set null,
  target_comment_id uuid references public.devotional_comments(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  content text,
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index idx_reports_status on public.reports(status);

alter table public.reports enable row level security;

create policy "reports_insert_any_auth"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "reports_select_own"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- -----------------------------------------------------------------------------
-- REALTIME
-- -----------------------------------------------------------------------------
alter table public.profiles replica identity full;
alter table public.user_plans replica identity full;
alter table public.streaks replica identity full;
alter table public.user_plan_daily_logs replica identity full;
alter table public.notifications replica identity full;
alter table public.messages replica identity full;

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.user_plans;
alter publication supabase_realtime add table public.streaks;
alter publication supabase_realtime add table public.user_plan_daily_logs;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.messages;
