import { supabase } from '../supabase/client';

function mapStreak(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    currentStreak: row.current_streak,
    weeklyLog: row.weekly_log || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const StreakService = {
  async get(uid) {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', uid)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return mapStreak(data);
  },

  async upsert(uid, data) {
    const { error } = await supabase
      .from('streaks')
      .upsert(
        {
          user_id: uid,
          current_streak: data.currentStreak ?? 0,
          weekly_log: data.weeklyLog ?? [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;
  },

  subscribe(uid, cb) {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', uid)
        .limit(1)
        .maybeSingle();

      if (!cancelled && !error) cb(mapStreak(data));
    };

    load();

    const channel = supabase
      .channel(`streaks:${uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'streaks',
          filter: `user_id=eq.${uid}`,
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
