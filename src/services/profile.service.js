import { supabase } from "../supabase/client";

const SELECT_COLUMNS =
  "id, name, email, age, favorite_verse, avatar_url, onboarding_completed, notification_preferences, created_at, updated_at";
const profileSubscriptions = new Map();

function mapProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    age: row.age,
    favoriteVerse: row.favorite_verse,
    avatarUrl: row.avatar_url,
    onboardingCompleted: row.onboarding_completed,
    notificationPreferences: row.notification_preferences,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProfileRow(data) {
  const map = {
    favoriteVerse: "favorite_verse",
    avatarUrl: "avatar_url",
    onboardingCompleted: "onboarding_completed",
    notificationPreferences: "notification_preferences",
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
      .from("profiles")
      .select(SELECT_COLUMNS)
      .eq("id", uid)
      .maybeSingle();

    if (error) throw error;
    return mapProfile(data);
  },

  async update(uid, data) {
    const { error } = await supabase
      .from("profiles")
      .update(toProfileRow(data))
      .eq("id", uid);

    if (error) throw error;
  },

  subscribe(uid, cb) {
    if (!uid) return () => {};

    const channelName = `profiles:${uid}`;
    const existing = profileSubscriptions.get(channelName);
    const listeners = existing ? existing.listeners : new Set();

    if (existing) {
      listeners.add(cb);
      profileSubscriptions.set(channelName, {
        listeners,
        channel: existing.channel,
      });
    } else {
      const state = { listeners: new Set([cb]), channel: null };
      profileSubscriptions.set(channelName, state);

      const load = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select(SELECT_COLUMNS)
          .eq("id", uid)
          .maybeSingle();

        if (error) return;

        for (const listener of [...state.listeners]) {
          listener(mapProfile(data));
        }
      };

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${uid}`,
          },
          load,
        )
        .subscribe();

      state.channel = channel;
    }

    return () => {
      const state = profileSubscriptions.get(channelName);
      if (!state) return;

      state.listeners.delete(cb);

      if (state.listeners.size === 0) {
        supabase.removeChannel(state.channel);
        profileSubscriptions.delete(channelName);
      }
    };
  },
};
