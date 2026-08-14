import { supabase } from '../supabase/client';

const SELECT_COLUMNS =
  'id, name, email, age, favorite_verse, onboarding_completed, notification_preferences, created_at, updated_at';

function mapProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    age: row.age,
    favoriteVerse: row.favorite_verse,
    onboardingCompleted: row.onboarding_completed,
    notificationPreferences: row.notification_preferences,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProfileRow(data) {
  const map = {
    favoriteVerse: 'favorite_verse',
    onboardingCompleted: 'onboarding_completed',
    notificationPreferences: 'notification_preferences',
  };
  const row = {};
  for (const [key, value] of Object.entries(data)) {
    row[map[key] || key] = value;
  }
  return row;
}

export const ProfileService = {
  async get(uid) {
    const { data, error } = await supabase
      .from('profiles')
      .select(SELECT_COLUMNS)
      .eq('id', uid)
      .maybeSingle();

    if (error) throw error;
    return mapProfile(data);
  },

  async update(uid, data) {
    const { error } = await supabase
      .from('profiles')
      .update(toProfileRow(data))
      .eq('id', uid);

    if (error) throw error;
  },

  subscribe(uid, cb) {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(SELECT_COLUMNS)
        .eq('id', uid)
        .maybeSingle();

      if (!cancelled && !error) cb(mapProfile(data));
    };

    load();

    const channel = supabase
      .channel(`profiles:${uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${uid}`,
        },
        load
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  },
};
