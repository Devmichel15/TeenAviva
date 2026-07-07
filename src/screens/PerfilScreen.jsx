import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import useAuth from '../hooks/useAuth';
import {
  UserService,
  StreakService,
  UserPlanService,
  AchievementService,
  NotificationService,
} from '../services/firestore.service';
import AvatarZone from '../components/perfil/AvatarZone';
import StatsRow from '../components/perfil/StatsRow';
import StreakHero from '../components/perfil/StreakHero';
import BadgesGrid from '../components/perfil/BadgesGrid';
import NotificationList from '../components/perfil/NotificationList';
import PerfilSkeleton from '../components/skeleton/PerfilSkeleton';
import FadeIn from '../components/ui/FadeIn';
import AnimatedPressable from '../components/ui/AnimatedPressable';

function getMockAchievements() {
  return [
    { id: '1', title: '7 dias seguidos', description: 'Completa 7 dias de leitura consecutivos', icon: 'fire', requirement: 'streak', requirementValue: 7, earned: true },
    { id: '2', title: '1º plano completo', description: 'Completa o teu primeiro plano', icon: 'book', requirement: 'plans', requirementValue: 1, earned: true },
    { id: '3', title: '30 dias de Chama', description: 'Alcança 30 dias de Chama', icon: 'star', requirement: 'streak', requirementValue: 30, earned: false },
    { id: '4', title: '5 planos feitos', description: 'Completa 5 planos de leitura', icon: 'heart', requirement: 'plans', requirementValue: 5, earned: false },
  ];
}

export default function PerfilScreen() {
  const { user: authUser, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState(null);
  const [streak, setStreak] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [plansCompleted, setPlansCompleted] = useState(0);
  const [chaptersRead, setChaptersRead] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = authUser?.uid;
    if (!uid) return;

    const unsubUser = UserService.subscribe(uid, setUserData);
    const unsubStreak = StreakService.subscribe(uid, setStreak);
    const unsubPlans = UserPlanService.subscribe(uid, (plans) => {
      const completed = plans.filter((p) => p.status === 'completed');
      setPlansCompleted(completed.length);
    });

    async function fetchAchievements() {
      try {
        const [allAchievements, userAch] = await Promise.all([
          AchievementService.getAll(),
          AchievementService.getUserAchievements(uid),
        ]);

        const earnedIds = new Set(userAch.filter((a) => a.earned).map((a) => a.achievementId));
        const merged = allAchievements.map((a) => ({
          ...a,
          earned: earnedIds.has(a.id),
        }));

        setAchievements(merged);
      } catch (e) {
        setAchievements(getMockAchievements());
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();

    return () => {
      unsubUser();
      unsubStreak();
      unsubPlans();
    };
  }, [authUser?.uid]);

  const handleToggleNotification = useCallback(
    async (key, value) => {
      if (!authUser?.uid) return;
      const currentPrefs = userData?.notificationPreferences ?? {
        dailyReminder: true,
        streakAlert: true,
        verseOfDay: true,
      };
      await NotificationService.updatePreferences(authUser.uid, {
        ...currentPrefs,
        [key]: value,
      });
    },
    [authUser?.uid, userData]
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PerfilSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <AnimatedPressable onPress={logout}>
          <View style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </View>
        </AnimatedPressable>
      </View>

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
          <AvatarZone user={userData} />
        </FadeIn>

        <FadeIn delay={100}>
          <StatsRow
            streak={streak?.currentStreak ?? 0}
            chaptersRead={chaptersRead}
            plansCompleted={plansCompleted}
          />
        </FadeIn>

        <FadeIn delay={150}>
          <StreakHero
            streak={streak?.currentStreak ?? 0}
            weekDays={streak?.weeklyLog ?? []}
          />
        </FadeIn>

        <FadeIn delay={200}>
          <BadgesGrid achievements={achievements} />
        </FadeIn>

        <FadeIn delay={250}>
          <NotificationList
            preferences={
              userData?.notificationPreferences ?? {
                dailyReminder: true,
                streakAlert: true,
                verseOfDay: true,
              }
            }
            onToggle={handleToggleNotification}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 30,
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    fontFamily: 'ManropeLight',
  },
  logoutBtn: {
    backgroundColor: 'rgba(201, 59, 59, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201, 59, 59, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  logoutText: {
    fontSize: 10,
    color: 'rgba(255, 100, 100, 0.8)',
    letterSpacing: 0.5,
    fontFamily: 'ManropeSemiBold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
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
});
