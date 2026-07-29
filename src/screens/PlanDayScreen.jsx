import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, BookOpen, Sparkles, ChevronRight } from 'lucide-react-native';
import { readingColors, borderRadius } from '../constants/theme';
import useAuth from '../hooks/useAuth';
import useReadingPlan from '../hooks/useReadingPlan';
import { getPlanById } from '../data/readingPlans';
import { UserPlanService, StreakService } from '../services/firestore.service';
import { buildReadingPlanPrompt } from '../utils/readingPlanPrompt';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import FadeIn from '../components/ui/FadeIn';

function generateWeeklyLog(dailyLogs) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayLabel = days[date.getDay()];
    const completed = dailyLogs.some((log) => {
      const logDate = new Date(log.completedAt).toISOString().split('T')[0];
      return logDate === dateStr;
    });
    weekDays.push({ label: dayLabel, completed, isToday: i === 0 });
  }
  return weekDays;
}

export default function PlanDayScreen({ onBack, onOpenGuide }) {
  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { activePlan, currentPlanData, currentDayData, progress, completeDay, refresh, loading } = useReadingPlan();
  const [justCompleted, setJustCompleted] = useState(false);

  const plan = currentPlanData;
  const day = currentDayData;

  const handleComplete = useCallback(async () => {
    if (!activePlan || !day || !authUser) return;
    setJustCompleted(true);
    try {
      const newProgress = await completeDay(activePlan.id, day.day);
      if (authUser.uid) {
        let userPlan = await UserPlanService.findByPlanId(authUser.uid, activePlan.id);
        if (!userPlan) {
          const planData = getPlanById(activePlan.id);
          if (planData) {
            await UserPlanService.create(authUser.uid, activePlan.id, planData);
          }
          userPlan = await UserPlanService.findByPlanId(authUser.uid, activePlan.id);
        }
        if (userPlan) {
          const nextDay = Math.min(day.day + 1, activePlan.totalDays);
          await UserPlanService.updateProgress(userPlan.id, nextDay);
          await UserPlanService.appendDailyLog(userPlan.id, {
            day: day.day,
            completedAt: new Date().toISOString(),
          });
        }
        await StreakService.upsert(authUser.uid, {
          currentStreak: newProgress.flameCount,
          weeklyLog: generateWeeklyLog(newProgress.dailyLogs),
        });
      }
    } catch (e) {
      console.warn('Erro ao sincronizar progresso com Firebase:', e);
    }
    await refresh();
  }, [activePlan, day, authUser, completeDay, refresh]);

  const handleOpenGuide = useCallback(() => {
    if (!plan || !day) return;
    const prompt = buildReadingPlanPrompt(plan.title, day.title, day.passages);
    onOpenGuide?.({
      prefill: prompt,
      context: {
        planTitle: plan.title,
        dayTitle: day.title,
        passages: day.passages,
      },
    });
  }, [plan, day, onOpenGuide]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <AnimatedPressable onPress={onBack} scaleTo={0.9}>
            <View style={styles.backBtn}>
              <ArrowLeft size={18} color={readingColors.textSecondary} strokeWidth={1.5} />
            </View>
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Plano de Leitura</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (!activePlan || !plan || !day) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <AnimatedPressable onPress={onBack} scaleTo={0.9}>
            <View style={styles.backBtn}>
              <ArrowLeft size={18} color={readingColors.textSecondary} strokeWidth={1.5} />
            </View>
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Plano de Leitura</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Nenhum plano ativo.</Text>
        </View>
      </View>
    );
  }

  const completedDays = progress?.completedDays || [];
  const isDayCompleted = completedDays.includes(day.day);
  const canContinue = !isDayCompleted || justCompleted;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AnimatedPressable onPress={onBack} scaleTo={0.9}>
          <View style={styles.backBtn}>
            <ArrowLeft size={18} color={readingColors.textSecondary} strokeWidth={1.5} />
          </View>
        </AnimatedPressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Plano de Leitura</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={50}>
          <View style={styles.planHeader}>
            <View style={[styles.planIconII, { backgroundColor: plan.color + '18' }]}>
              <BookOpen size={16} color={plan.color} />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitleR}>{plan.title}</Text>
              <Text style={styles.planProgressR}>
                Dia {day.day} de {plan.totalDays}
              </Text>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={100}>
          <View style={styles.dayCard}>
            <Text style={styles.dayTitleR}>{day.title}</Text>
            <View style={styles.passagesList}>
              {day.passages.map((passage, idx) => (
                <View key={idx} style={styles.passageItem}>
                  <View style={styles.passageDot} />
                  <Text style={styles.passageTextR}>{passage}</Text>
                </View>
              ))}
            </View>
          </View>
        </FadeIn>

        {isDayCompleted && !justCompleted && (
          <FadeIn delay={150}>
            <View style={styles.completedBannerR}>
              <Check size={16} color={readingColors.accent} />
              <Text style={styles.completedTextR}>Leitura concluída</Text>
            </View>
          </FadeIn>
        )}

        <FadeIn delay={150}>
          {!isDayCompleted || justCompleted ? (
            <View style={styles.actions}>
              {!isDayCompleted && (
                <AnimatedPressable onPress={handleComplete} scaleTo={0.96}>
                  <View style={styles.completeBtnR}>
                    <Check size={18} color={readingColors.surface} strokeWidth={2.5} />
                    <Text style={styles.completeBtnTextR}>Marcar como concluído</Text>
                  </View>
                </AnimatedPressable>
              )}

              <AnimatedPressable onPress={handleOpenGuide} scaleTo={0.96}>
                <View style={styles.guideBtnR}>
                  <Sparkles size={16} color={readingColors.highlight} strokeWidth={1.5} />
                  <View style={styles.guideBtnTextWrap}>
                    <Text style={styles.guideBtnTitleR}>Estudar com o Guia + IA</Text>
                    <Text style={styles.guideBtnSubR}>
                      Aprofunda as tuas leituras com o Guia Bíblico
                    </Text>
                  </View>
                  <ChevronRight size={16} color={readingColors.textMuted} />
                </View>
              </AnimatedPressable>
            </View>
          ) : null}
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: readingColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: readingColors.divider,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.button,
    backgroundColor: readingColors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'ManropeSemiBold',
    color: readingColors.text,
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
  },
  planIconII: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planTitleR: {
    fontSize: 14,
    fontFamily: 'ManropeSemiBold',
    color: readingColors.text,
  },
  planProgressR: {
    fontSize: 11,
    fontFamily: 'ManropeRegular',
    color: readingColors.textSecondary,
    marginTop: 2,
  },
  dayCard: {
    backgroundColor: readingColors.surface,
    borderWidth: 1.5,
    borderColor: readingColors.border,
    borderRadius: borderRadius.card,
    padding: 20,
  },
  dayTitleR: {
    fontSize: 18,
    fontFamily: 'ManropeSemiBold',
    color: readingColors.text,
    marginBottom: 14,
    lineHeight: 24,
  },
  passagesList: {
    gap: 10,
  },
  passageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: readingColors.accent,
  },
  passageTextR: {
    fontSize: 14,
    fontFamily: 'ManropeRegular',
    color: readingColors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  completedBannerR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: readingColors.accent + '14',
    borderWidth: 1.5,
    borderColor: readingColors.accent + '30',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
  },
  completedTextR: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: readingColors.accentText,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
  completeBtnR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: readingColors.accent,
    borderRadius: borderRadius.button,
    paddingVertical: 14,
  },
  completeBtnTextR: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: readingColors.surface,
    letterSpacing: 0.3,
  },
  guideBtnR: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: readingColors.highlight + '0A',
    borderWidth: 1.5,
    borderColor: readingColors.highlight + '20',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  guideBtnTextWrap: {
    flex: 1,
  },
  guideBtnTitleR: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: readingColors.text,
  },
  guideBtnSubR: {
    fontSize: 10,
    fontFamily: 'ManropeRegular',
    color: readingColors.textSecondary,
    marginTop: 2,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: readingColors.textMuted,
    fontFamily: 'ManropeRegular',
  },
});
