import { supabase } from '../supabase/client';

function mapAchievement(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    requirement: row.requirement,
    requirementValue: row.requirement_value,
  };
}

function mapUserAchievement(row) {
  return {
    id: row.id,
    userId: row.user_id,
    achievementId: row.achievement_id,
    earned: row.earned,
    createdAt: row.created_at,
  };
}

export const AchievementService = {
  async getAll() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapAchievement);
  },

  async getUserAchievements(uid) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', uid);

    if (error) throw error;
    return (data || []).map(mapUserAchievement);
  },
};
