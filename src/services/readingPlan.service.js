import { supabase } from '../supabase/client';
import { getPlanById } from '../data/readingPlans';
import { StreakService } from './streak.service';

const PLAN_SELECT = '*, user_plan_daily_logs(day, completed_at)';

function mapPlan(row) {
  if (!row) return null;
  const dailyLogs = (row.user_plan_daily_logs || []).map((log) => ({
    day: log.day,
    completedAt: log.completed_at,
  }));
  const plan = getPlanById(row.plan_id);
  return {
    id: row.plan_id,
    title: row.plan_title,
    description: plan?.description ?? '',
    icon: row.plan_icon,
    color: row.plan_icon_color,
    category: plan?.category ?? '',
    totalDays: row.plan_duration,
    startedAt: row.started_at,
    currentDay: row.current_day,
    status: row.status,
    dailyLogs,
  };
}

function generateWeeklyLog(dailyLogs) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayLabel = days[date.getDay()];
    const completed = (dailyLogs || []).some((log) => {
      const logDate = new Date(log.completedAt).toISOString().split('T')[0];
      return logDate === dateStr;
    });
    weekDays.push({ label: dayLabel, completed, isToday: i === 0 });
  }
  return weekDays;
}

export async function startPlan(uid, planId) {
  if (!uid) throw new Error('Utilizador não autenticado');

  const plan = getPlanById(planId);
  if (!plan) throw new Error('Plano não encontrado');

  const { data: existing, error: findError } = await supabase
    .from('user_plans')
    .select(PLAN_SELECT)
    .eq('user_id', uid)
    .eq('plan_id', planId)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return mapPlan(existing);

  const { data, error } = await supabase
    .from('user_plans')
    .insert({
      user_id: uid,
      plan_id: planId,
      plan_title: plan.title,
      plan_duration: plan.totalDays,
      plan_icon: plan.icon,
      plan_icon_color: plan.color,
    })
    .select(PLAN_SELECT)
    .maybeSingle();

  if (error) throw error;
  return mapPlan(data);
}

export async function getActivePlan(uid) {
  if (!uid) return null;

  const { data, error } = await supabase
    .from('user_plans')
    .select(PLAN_SELECT)
    .eq('user_id', uid)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return mapPlan(data);
}

export async function getPlanProgress(uid, planId) {
  if (!uid) return null;

  const { data, error } = await supabase
    .from('user_plans')
    .select(PLAN_SELECT)
    .eq('user_id', uid)
    .eq('plan_id', planId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const dailyLogs = (data.user_plan_daily_logs || []).map((log) => ({
    day: log.day,
    completedAt: log.completed_at,
  }));
  const completedDays = dailyLogs.map((log) => log.day).sort((a, b) => a - b);
  const totalDays = data.plan_duration || 0;
  const progressPercent =
    totalDays > 0
      ? Math.round((completedDays.length / totalDays) * 100)
      : 0;
  const isCompleted = completedDays.length >= totalDays;

  return {
    completedDays,
    dailyLogs,
    flameCount: completedDays.length,
    totalDays,
    progressPercent,
    isCompleted,
  };
}

export async function completeDay(uid, planId, dayNumber) {
  if (!uid) throw new Error('Utilizador não autenticado');

  const { data: planRow, error: findError } = await supabase
    .from('user_plans')
    .select(PLAN_SELECT)
    .eq('user_id', uid)
    .eq('plan_id', planId)
    .maybeSingle();

  if (findError) throw findError;
  if (!planRow) throw new Error('Plano não encontrado');

  await supabase.from('user_plan_daily_logs').upsert(
    {
      user_plan_id: planRow.id,
      user_id: uid,
      day: dayNumber,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_plan_id,day' }
  );

  const progress = await getPlanProgress(uid, planId);
  if (!progress) throw new Error('Erro ao calcular o progresso');

  const nextDay = Math.min(
    Math.max(...progress.completedDays) + 1,
    planRow.plan_duration
  );
  const status = progress.isCompleted ? 'completed' : 'active';

  const { error: updateError } = await supabase
    .from('user_plans')
    .update({
      current_day: nextDay,
      progress: progress.completedDays.length,
      status,
    })
    .eq('id', planRow.id);

  if (updateError) throw updateError;

  await StreakService.upsert(uid, {
    currentStreak: progress.flameCount,
    weeklyLog: generateWeeklyLog(progress.dailyLogs),
  });

  return progress;
}

export async function getDaysSinceLastRead(uid) {
  if (!uid) return 999;

  const { data, error } = await supabase
    .from('user_plan_daily_logs')
    .select('completed_at')
    .eq('user_id', uid)
    .order('completed_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) return 999;

  const lastDate = new Date(data[0].completed_at);
  const now = new Date();
  const diffTime = now.getTime() - lastDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export async function getFlameCount(uid) {
  if (!uid) return 0;

  const { count, error } = await supabase
    .from('user_plan_daily_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', uid);

  if (error) throw error;
  return count ?? 0;
}

export async function switchPlan(uid, planId) {
  return startPlan(uid, planId);
}
