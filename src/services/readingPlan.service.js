import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanById } from '../data/readingPlans';

const KEYS = {
  ACTIVE_PLAN: 'reading_plan_active',
  COMPLETED_DAYS: 'reading_plan_completed',
  DAILY_LOGS: 'reading_plan_logs',
  FLAME_COUNT: 'reading_plan_flames',
};

export async function startPlan(planId) {
  const plan = getPlanById(planId);
  if (!plan) throw new Error('Plano não encontrado');

  const existing = await AsyncStorage.getItem(KEYS.ACTIVE_PLAN);
  if (existing) {
    const parsed = JSON.parse(existing);
    if (parsed.id === planId) return parsed;
  }

  const activePlan = {
    id: planId,
    title: plan.title,
    description: plan.description,
    icon: plan.icon,
    color: plan.color,
    category: plan.category,
    totalDays: plan.totalDays,
    startedAt: new Date().toISOString(),
    currentDay: 1,
    status: 'active',
  };

  await AsyncStorage.setItem(KEYS.ACTIVE_PLAN, JSON.stringify(activePlan));
  return activePlan;
}

export async function getActivePlan() {
  const data = await AsyncStorage.getItem(KEYS.ACTIVE_PLAN);
  return data ? JSON.parse(data) : null;
}

export async function getPlanProgress(planId) {
  const completedStr = await AsyncStorage.getItem(KEYS.COMPLETED_DAYS);
  const logsStr = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
  const flamesStr = await AsyncStorage.getItem(KEYS.FLAME_COUNT);

  const completedDays = completedStr ? JSON.parse(completedStr) : [];
  const dailyLogs = logsStr ? JSON.parse(logsStr) : [];
  const flameCount = flamesStr ? parseInt(flamesStr, 10) : 0;

  const plan = getPlanById(planId);
  const totalDays = plan ? plan.totalDays : 0;
  const progressPercent = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;
  const isCompleted = completedDays.length >= totalDays;

  return {
    completedDays,
    dailyLogs,
    flameCount,
    totalDays,
    progressPercent,
    isCompleted,
  };
}

export async function completeDay(planId, dayNumber) {
  const completedStr = await AsyncStorage.getItem(KEYS.COMPLETED_DAYS);
  const completedDays = completedStr ? JSON.parse(completedStr) : [];

  if (completedDays.includes(dayNumber)) {
    const progress = await getPlanProgress(planId);
    return progress;
  }

  completedDays.push(dayNumber);
  completedDays.sort((a, b) => a - b);
  await AsyncStorage.setItem(KEYS.COMPLETED_DAYS, JSON.stringify(completedDays));

  const logsStr = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
  const dailyLogs = logsStr ? JSON.parse(logsStr) : [];
  dailyLogs.push({
    day: dayNumber,
    completedAt: new Date().toISOString(),
  });
  await AsyncStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(dailyLogs));

  const flamesStr = await AsyncStorage.getItem(KEYS.FLAME_COUNT);
  let flameCount = flamesStr ? parseInt(flamesStr, 10) : 0;
  flameCount += 1;
  await AsyncStorage.setItem(KEYS.FLAME_COUNT, flameCount.toString());

  const activePlan = await getActivePlan();
  if (activePlan && activePlan.id === planId) {
    const nextDay = Math.max(...completedDays) + 1;
    if (nextDay <= activePlan.totalDays) {
      activePlan.currentDay = nextDay;
    }
    await AsyncStorage.setItem(KEYS.ACTIVE_PLAN, JSON.stringify(activePlan));
  }

  const progress = await getPlanProgress(planId);
  if (progress.isCompleted) {
    const updated = { ...activePlan, status: 'completed' };
    await AsyncStorage.setItem(KEYS.ACTIVE_PLAN, JSON.stringify(updated));
  }

  return progress;
}

export async function getDaysSinceLastRead() {
  const logsStr = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
  if (!logsStr) return 999;

  const logs = JSON.parse(logsStr);
  if (logs.length === 0) return 999;

  const lastLog = logs[logs.length - 1];
  const lastDate = new Date(lastLog.completedAt);
  const now = new Date();
  const diffTime = now.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function getAllCompletedDays() {
  const completedStr = await AsyncStorage.getItem(KEYS.COMPLETED_DAYS);
  return completedStr ? JSON.parse(completedStr) : [];
}

export async function getFlameCount() {
  const flamesStr = await AsyncStorage.getItem(KEYS.FLAME_COUNT);
  return flamesStr ? parseInt(flamesStr, 10) : 0;
}

export async function isDayCompleted(planId, dayNumber) {
  const completed = await getAllCompletedDays();
  return completed.includes(dayNumber);
}

export async function resetPlanProgress(planId) {
  await AsyncStorage.multiRemove([
    KEYS.ACTIVE_PLAN,
    KEYS.COMPLETED_DAYS,
    KEYS.DAILY_LOGS,
    KEYS.FLAME_COUNT,
  ]);
}

export async function switchPlan(newPlanId) {
  await resetPlanProgress(null);
  return startPlan(newPlanId);
}
