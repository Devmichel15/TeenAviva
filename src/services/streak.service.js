import { supabase } from "../supabase/client";

const streakSubscriptions = new Map();

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
      .from("streaks")
      .select("*")
      .eq("user_id", uid)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return mapStreak(data);
  },

  async upsert(uid, data) {
    const { error } = await supabase.from("streaks").upsert(
      {
        user_id: uid,
        current_streak: data.currentStreak ?? 0,
        weekly_log: data.weeklyLog ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) throw error;
  },

  subscribe(uid, cb) {
    if (!uid) return () => {};

    const channelName = `streaks:${uid}`;
    const existing = streakSubscriptions.get(channelName);
    const listeners = existing ? existing.listeners : new Set();

    if (existing) {
      listeners.add(cb);
      streakSubscriptions.set(channelName, {
        listeners,
        channel: existing.channel,
      });
    } else {
      const state = { listeners: new Set([cb]), channel: null };
      streakSubscriptions.set(channelName, state);

      const load = async () => {
        const { data, error } = await supabase
          .from("streaks")
          .select("*")
          .eq("user_id", uid)
          .limit(1)
          .maybeSingle();

        if (error) return;

        for (const listener of [...state.listeners]) {
          listener(mapStreak(data));
        }
      };

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "streaks",
            filter: `user_id=eq.${uid}`,
          },
          load,
        )
        .subscribe();

      state.channel = channel;
    }

    return () => {
      const state = streakSubscriptions.get(channelName);
      if (!state) return;

      state.listeners.delete(cb);

      if (state.listeners.size === 0) {
        supabase.removeChannel(state.channel);
        streakSubscriptions.delete(channelName);
      }
    };
  },
};
