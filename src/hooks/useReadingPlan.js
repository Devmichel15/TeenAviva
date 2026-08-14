import { useState, useEffect, useCallback } from 'react';
import useAuth from './useAuth';
import {
  getActivePlan,
  getPlanProgress,
  startPlan,
  completeDay,
  getDaysSinceLastRead,
  getFlameCount,
  switchPlan,
} from '../services/readingPlan.service';
import { getPlanById, getAllPlans } from '../data/readingPlans';

export default function useReadingPlan() {
  const { user } = useAuth();
  const uid = user?.id ?? null;

  const [activePlan, setActivePlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [flameCount, setFlameCount] = useState(0);
  const [daysSinceLastRead, setDaysSinceLastRead] = useState(999);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const plan = await getActivePlan(uid);
      setActivePlan(plan);

      if (plan) {
        const p = await getPlanProgress(uid, plan.id);
        setProgress(p);
      } else {
        setProgress(null);
      }

      const flames = await getFlameCount(uid);
      setFlameCount(flames);

      const days = await getDaysSinceLastRead(uid);
      setDaysSinceLastRead(days);
    } catch (e) {
      console.warn('Erro ao carregar plano:', e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleStartPlan = useCallback(
    async (planId) => {
      await startPlan(uid, planId);
      await loadAll();
    },
    [uid, loadAll]
  );

  const handleCompleteDay = useCallback(
    async (planId, dayNumber) => {
      const newProgress = await completeDay(uid, planId, dayNumber);
      setProgress(newProgress);
      const flames = await getFlameCount(uid);
      setFlameCount(flames);
      const plan = await getActivePlan(uid);
      setActivePlan(plan);
      const days = await getDaysSinceLastRead(uid);
      setDaysSinceLastRead(days);
      return newProgress;
    },
    [uid]
  );

  const handleSwitchPlan = useCallback(
    async (newPlanId) => {
      await switchPlan(uid, newPlanId);
      await loadAll();
    },
    [uid, loadAll]
  );

  const handleRefresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const currentPlanData = activePlan ? getPlanById(activePlan.id) : null;
  const currentDayData = currentPlanData && activePlan
    ? currentPlanData.days.find((d) => d.day === activePlan.currentDay) || null
    : null;

  const allPlans = getAllPlans();

  return {
    activePlan,
    progress,
    flameCount,
    daysSinceLastRead,
    loading,
    currentPlanData,
    currentDayData,
    allPlans,
    startPlan: handleStartPlan,
    completeDay: handleCompleteDay,
    switchPlan: handleSwitchPlan,
    refresh: handleRefresh,
  };
}
