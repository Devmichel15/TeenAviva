import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, BookOpen, Sparkles, ChevronRight } from 'lucide-react-native';
import { colors, borderRadius } from '../constants/theme';
import useReadingPlan from '../hooks/useReadingPlan';
import { buildReadingPlanPrompt } from '../utils/readingPlanPrompt';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import FadeIn from '../components/ui/FadeIn';

export default function PlanDayScreen({ onBack, onOpenGuide }) {
  const insets = useSafeAreaInsets();
  const { activePlan, currentPlanData, currentDayData, progress, completeDay, refresh } = useReadingPlan();
  const [justCompleted, setJustCompleted] = useState(false);

  const plan = currentPlanData;
  const day = currentDayData;

  const handleComplete = useCallback(async () => {
    if (!activePlan || !day) return;
    setJustCompleted(true);
    await completeDay(activePlan.id, day.day);
    await refresh();
  }, [activePlan, day, completeDay, refresh]);

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

  if (!activePlan || !plan || !day) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <AnimatedPressable onPress={onBack} scaleTo={0.9}>
            <View style={styles.backBtn}>
              <ArrowLeft size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
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
            <ArrowLeft size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
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
            <View style={[styles.planIcon, { backgroundColor: plan.color + '22' }]}>
              <BookOpen size={16} color={plan.color} />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planProgress}>
                Dia {day.day} de {plan.totalDays}
              </Text>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={100}>
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{day.title}</Text>
            <View style={styles.passagesList}>
              {day.passages.map((passage, idx) => (
                <View key={idx} style={styles.passageItem}>
                  <View style={styles.passageDot} />
                  <Text style={styles.passageText}>{passage}</Text>
                </View>
              ))}
            </View>
          </View>
        </FadeIn>

        {isDayCompleted && !justCompleted && (
          <FadeIn delay={150}>
            <View style={styles.completedBanner}>
              <Check size={16} color={colors.sage} />
              <Text style={styles.completedText}>Leitura concluída</Text>
            </View>
          </FadeIn>
        )}

        <FadeIn delay={150}>
          {!isDayCompleted || justCompleted ? (
            <View style={styles.actions}>
              {!isDayCompleted && (
                <AnimatedPressable onPress={handleComplete} scaleTo={0.96}>
                  <View style={styles.completeBtn}>
                    <Check size={18} color={colors.background} strokeWidth={2.5} />
                    <Text style={styles.completeBtnText}>Marcar como concluído</Text>
                  </View>
                </AnimatedPressable>
              )}

              <AnimatedPressable onPress={handleOpenGuide} scaleTo={0.96}>
                <View style={styles.guideBtn}>
                  <Sparkles size={16} color={colors.gold} strokeWidth={1.5} />
                  <View style={styles.guideBtnTextWrap}>
                    <Text style={styles.guideBtnTitle}>Estudar com o Guia + IA</Text>
                    <Text style={styles.guideBtnSub}>
                      Aprofunda as tuas leituras com o Guia Bíblico
                    </Text>
                  </View>
                  <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.white06,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
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
    color: 'rgba(255,255,255,0.82)',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    gap: 14,
    paddingBottom: 40,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 14,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.85)',
  },
  planProgress: {
    fontSize: 11,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  dayCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.card,
    padding: 18,
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 14,
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
    backgroundColor: colors.gold,
  },
  passageText: {
    fontSize: 13,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    flex: 1,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(163, 177, 138, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163, 177, 138, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  completedText: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: colors.sage,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.sage,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
  },
  completeBtnText: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: colors.background,
    letterSpacing: 0.3,
  },
  guideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  guideBtnTextWrap: {
    flex: 1,
  },
  guideBtnTitle: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: colors.gold,
  },
  guideBtnSub: {
    fontSize: 10,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'ManropeRegular',
  },
});
