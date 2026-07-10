import { useState, useEffect, useCallback } from 'react';
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
  const [activePlan, setActivePlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [flameCount, setFlameCount] = useState(0);
  const [daysSinceLastRead, setDaysSinceLastRead] = useState(999);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const plan = await getActivePlan();
      setActivePlan(plan);

      if (plan) {
        const p = await getPlanProgress(plan.id);
        setProgress(p);
      } else {
        setProgress(null);
      }

      const flames = await getFlameCount();
      setFlameCount(flames);

      const days = await getDaysSinceLastRead();
      setDaysSinceLastRead(days);
    } catch (e) {
      console.warn('Erro ao carregar plano:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleStartPlan = useCallback(async (planId) => {
    await startPlan(planId);
    await loadAll();
  }, [loadAll]);

  const handleCompleteDay = useCallback(async (planId, dayNumber) => {
    const newProgress = await completeDay(planId, dayNumber);
    setProgress(newProgress);
    const flames = await getFlameCount();
    setFlameCount(flames);
    const plan = await getActivePlan();
    setActivePlan(plan);
    const days = await getDaysSinceLastRead();
    setDaysSinceLastRead(days);
    return newProgress;
  }, []);

  const handleSwitchPlan = useCallback(async (newPlanId) => {
    await switchPlan(newPlanId);
    await loadAll();
  }, [loadAll]);

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
