import { supabase } from '../supabase/client';

export const NotificationService = {
  async updatePreferences(uid, prefs) {
    const { error } = await supabase
      .from('profiles')
      .update({ notification_preferences: prefs })
      .eq('id', uid);

    if (error) throw error;
  },
};
