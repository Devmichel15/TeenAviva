import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import useAuth from '../hooks/useAuth';
import { StreakService, UserPlanService, PlanService } from '../services/firestore.service';
import Header from '../components/home/Header';
import WeeklyCalendar from '../components/ofensiva/WeeklyCalendar';
import ActivePlan from '../components/ofensiva/ActivePlan';
import OtherPlans from '../components/ofensiva/OtherPlans';
import ChamaSkeleton from '../components/skeleton/OfensivaSkeleton';
import FadeIn from '../components/ui/FadeIn';

export default function ChamaScreen() {
  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [streak, setStreak] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [otherPlans, setOtherPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = authUser?.uid;
    if (!uid) return;

    const unsubStreak = StreakService.subscribe(uid, setStreak);
    const unsubPlans = UserPlanService.subscribe(uid, (plans) => {
      const active = plans.find((p) => p.status === 'active');
      setActivePlan(active ?? null);
    });

    async function fetchPlans() {
      try {
        const allPlans = await PlanService.getAll();
        setOtherPlans(allPlans.filter((p) => p.id !== activePlan?.planId));
      } catch (e) {
        setOtherPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();

    return () => {
      unsubStreak();
      unsubPlans();
    };
  }, [authUser?.uid]);

  const handleContinue = useCallback(() => {
    // TODO: navigate to reading view
  }, []);

  const handleSelectPlan = useCallback((plan) => {
    // TODO: create user plan
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ChamaSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header streak={streak?.currentStreak ?? 0} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <FadeIn>
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </FadeIn>
        )}

        <FadeIn delay={50}>
          <View style={styles.hero}>
            <Text style={styles.heroNumber}>
              {streak?.currentStreak ?? 0}
            </Text>
            <Text style={styles.heroLabel}>dias de Chama</Text>
          </View>
        </FadeIn>

        <FadeIn delay={100}>
          <WeeklyCalendar weekDays={streak?.weeklyLog ?? []} />
        </FadeIn>

        <FadeIn delay={150}>
          {activePlan ? (
            <ActivePlan plan={activePlan} onContinue={handleContinue} />
          ) : (
            <View style={styles.emptyPlan}>
              <Text style={styles.emptyText}>
                Nenhum plano ativo. Escolhe um abaixo para começar.
              </Text>
            </View>
          )}
        </FadeIn>

        <FadeIn delay={200}>
          <OtherPlans plans={otherPlans} onSelect={handleSelectPlan} />
        </FadeIn>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 12,
  },
  errorBox: {
    backgroundColor: 'rgba(201, 59, 59, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201, 59, 59, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    fontSize: 11,
    color: 'rgba(255, 150, 150, 0.8)',
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  heroNumber: {
    fontSize: 52,
    fontWeight: '200',
    color: colors.gold,
    lineHeight: 52,
    fontFamily: 'ManropeLight',
  },
  heroLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginTop: 4,
    fontFamily: 'ManropeSemiBold',
  },
  emptyPlan: {
    backgroundColor: colors.brownCardBg,
    borderWidth: 1,
    borderColor: colors.brownCardBorder,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontFamily: 'ManropeLight',
    fontStyle: 'italic',
  },
});
