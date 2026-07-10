import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import useAuth from '../hooks/useAuth';
import useDailyVerse from '../hooks/useDailyVerse';
import useReadingPlan from '../hooks/useReadingPlan';
import { UserService, StreakService, UserPlanService } from '../services/firestore.service';
import { getGreeting } from '../utils/greeting';
import Header from '../components/home/Header';
import VerseCard from '../components/home/VerseCard';
import StreakCard from '../components/home/StreakCard';
import EmotionalStateChips from '../components/home/EmotionalState';
import MotivationalBanner from '../components/home/MotivationalBanner';
import HomeSkeleton from '../components/skeleton/HomeSkeleton';
import FadeIn from '../components/ui/FadeIn';

export default function HomeScreen({ onNavigate }) {
  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { verse: dailyVerse, loading: verseLoading, error: verseError, retry: verseRetry } = useDailyVerse();

  const [userData, setUserData] = useState(null);
  const [streak, setStreak] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { flameCount, daysSinceLastRead } = useReadingPlan();

  useEffect(() => {
    const uid = authUser?.uid;
    if (!uid) return;

    const unsubUser = UserService.subscribe(uid, setUserData);
    const unsubStreak = StreakService.subscribe(uid, setStreak);
    const unsubPlans = UserPlanService.subscribe(uid, (plans) => {
      const active = plans.find((p) => p.status === 'active');
      setActivePlan(active ?? null);
    });

    setLoading(false);

    return () => {
      unsubUser();
      unsubStreak();
      unsubPlans();
    };
  }, [authUser?.uid]);

  const handleMeditate = useCallback(() => {
    onNavigate?.('ia', { verse: dailyVerse });
  }, [onNavigate, dailyVerse]);

  const handleContinueStreak = useCallback(() => {
    onNavigate?.('chama');
  }, [onNavigate]);

  const handleGoToPlan = useCallback(() => {
    onNavigate?.('chama');
  }, [onNavigate]);

  const handleEmotionalState = useCallback(
    (state) => {
      onNavigate?.('ia', { emotionalState: state, verse: dailyVerse });
    },
    [onNavigate, dailyVerse]
  );

  const handleStreakPress = useCallback(() => {
    onNavigate?.('chama');
  }, [onNavigate]);

  const greeting = getGreeting();
  const userName = userData?.name?.split(' ')[0] ?? '';

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header streak={streak?.currentStreak ?? 0} onStreakPress={handleStreakPress} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={50}>
          <Text style={styles.greeting}>
            {greeting},{'\n'}
            <Text style={styles.name}>{userName}</Text>
          </Text>
        </FadeIn>

        {dailyVerse || verseLoading || verseError ? (
          <VerseCard
            verse={dailyVerse}
            loading={verseLoading}
            error={verseError}
            onRetry={verseRetry}
            onPress={handleMeditate}
          />
        ) : (
          <FadeIn>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Versículo do dia em breve</Text>
            </View>
          </FadeIn>
        )}

        <MotivationalBanner
          daysSinceLastRead={daysSinceLastRead}
          flameCount={flameCount}
          onGoToPlan={handleGoToPlan}
        />

        <StreakCard
          streak={streak}
          activePlan={activePlan}
          onContinue={handleContinueStreak}
        />

        <EmotionalStateChips onSelect={handleEmotionalState} />

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
    paddingTop: 14,
    gap: 10,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    fontFamily: 'ManropeLight',
  },
  name: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'ManropeLight',
  },
  emptyCard: {
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'ManropeLight',
    fontStyle: 'italic',
  },
});
