-- Fix profile visibility so devotional feed can join author profile data.
drop policy if exists "profiles_select_auth" on public.profiles;
create policy "profiles_select_auth"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Keep the existing own-profile access intact as well.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);
