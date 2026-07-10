import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Book, Check, ChevronRight } from 'lucide-react-native';
import { colors, borderRadius } from '../constants/theme';
import useAuth from '../hooks/useAuth';
import useReadingPlan from '../hooks/useReadingPlan';
import { getCategories } from '../data/readingPlans';
import ChamaSkeleton from '../components/skeleton/OfensivaSkeleton';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import FadeIn from '../components/ui/FadeIn';

export default function ChamaScreen({ onContinuePlan, onSelectPlan }) {
  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const {
    activePlan,
    progress,
    flameCount,
    loading,
    allPlans,
    startPlan,
    switchPlan,
    refresh,
  } = useReadingPlan();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = getCategories();

  const filteredPlans = selectedCategory
    ? allPlans.filter((p) => p.category === selectedCategory)
    : allPlans;

  const handleSelectPlan = useCallback((planId) => {
    if (activePlan) {
      switchPlan(planId);
    } else {
      startPlan(planId);
    }
    onSelectPlan?.();
  }, [activePlan, startPlan, switchPlan, onSelectPlan]);

  const handleContinue = useCallback(() => {
    if (activePlan) {
      onContinuePlan?.();
    }
  }, [activePlan, onContinuePlan]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ChamaSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chamas da Fé</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={50}>
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Flame size={28} color={colors.gold} />
            </View>
            <Text style={styles.heroNumber}>{flameCount}</Text>
            <Text style={styles.heroLabel}>Chamas da Fé</Text>
            <Text style={styles.heroSub}>
              Dias de leitura concluídos
            </Text>
          </View>
        </FadeIn>

        {activePlan && progress && (
          <FadeIn delay={100}>
            <View style={styles.activePlanCard}>
              <View style={styles.activePlanHeader}>
                <View style={styles.activePlanInfo}>
                  <Text style={styles.activePlanName}>{activePlan.title}</Text>
                  <Text style={styles.activePlanProgress}>
                    {progress.completedDays.length} de {progress.totalDays} dias concluídos
                  </Text>
                </View>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressPercent}>{progress.progressPercent}%</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress.progressPercent}%` }]} />
              </View>

              <AnimatedPressable onPress={handleContinue} scaleTo={0.96}>
                <View style={styles.continueBtn}>
                  <Text style={styles.continueBtnText}>Continuar leitura</Text>
                  <ChevronRight size={14} color={colors.background} />
                </View>
              </AnimatedPressable>
            </View>
          </FadeIn>
        )}

        {!activePlan && (
          <FadeIn delay={100}>
            <View style={styles.emptyPlan}>
              <Text style={styles.emptyTitle}>Nenhum plano ativo</Text>
              <Text style={styles.emptySub}>Escolhe um plano abaixo para começares a tua jornada de leitura.</Text>
            </View>
          </FadeIn>
        )}

        <FadeIn delay={150}>
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Planos de Leitura</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContent}
            >
              <AnimatedPressable
                onPress={() => setSelectedCategory(null)}
                scaleTo={0.95}
              >
                <View style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}>
                  <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
                    Todos
                  </Text>
                </View>
              </AnimatedPressable>
              {categories.map((cat) => (
                <AnimatedPressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  scaleTo={0.95}
                >
                  <View style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}>
                    <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                      {cat}
                    </Text>
                  </View>
                </AnimatedPressable>
              ))}
            </ScrollView>

            <View style={styles.plansGrid}>
              {filteredPlans.map((plan) => {
                const isActive = activePlan?.id === plan.id;
                return (
                  <FadeIn key={plan.id} delay={50}>
                    <AnimatedPressable
                      onPress={() => handleSelectPlan(plan.id)}
                      scaleTo={0.97}
                    >
                      <View style={[styles.planCard, isActive && styles.planCardActive]}>
                        <View style={[styles.planIcon, { backgroundColor: plan.color + '22' }]}>
                          <Book size={16} color={plan.color} />
                        </View>
                        <View style={styles.planCardInfo}>
                          <Text style={styles.planCardTitle}>{plan.title}</Text>
                          <Text style={styles.planCardDesc} numberOfLines={1}>
                            {plan.description}
                          </Text>
                          <View style={styles.planCardMeta}>
                            <Text style={styles.planCardDays}>{plan.totalDays} dias</Text>
                            {isActive && (
                              <View style={styles.activeBadge}>
                                <Check size={8} color={colors.sage} />
                                <Text style={styles.activeBadgeText}>Ativo</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </AnimatedPressable>
                  </FadeIn>
                );
              })}
            </View>
          </View>
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
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.white06,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.85)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 14,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroNumber: {
    fontSize: 48,
    fontFamily: 'ManropeLight',
    color: colors.gold,
    lineHeight: 48,
  },
  heroLabel: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroSub: {
    fontSize: 10,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.25)',
  },
  activePlanCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.card,
    padding: 16,
    gap: 12,
  },
  activePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activePlanInfo: {
    flex: 1,
  },
  activePlanName: {
    fontSize: 14,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.85)',
  },
  activePlanProgress: {
    fontSize: 11,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sageBg,
    borderWidth: 1,
    borderColor: colors.sageBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: colors.sage,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.white06,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.sage,
    borderRadius: 2,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.sage,
  },
  continueBtnText: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: colors.background,
    letterSpacing: 0.3,
  },
  emptyPlan: {
    backgroundColor: colors.white04,
    borderWidth: 1,
    borderColor: colors.white06,
    borderRadius: borderRadius.card,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.5)',
  },
  emptySub: {
    fontSize: 11,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 16,
  },
  categoriesSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categoryScroll: {
    marginHorizontal: -18,
  },
  categoryContent: {
    paddingHorizontal: 18,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white06,
  },
  categoryChipActive: {
    backgroundColor: colors.sage,
  },
  categoryChipText: {
    fontSize: 10,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.5)',
  },
  categoryChipTextActive: {
    color: colors.background,
  },
  plansGrid: {
    gap: 8,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white04,
    borderWidth: 1,
    borderColor: colors.white06,
    borderRadius: borderRadius.card,
    padding: 14,
  },
  planCardActive: {
    borderColor: colors.sageBorder,
    backgroundColor: colors.sageBg,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCardInfo: {
    flex: 1,
  },
  planCardTitle: {
    fontSize: 13,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.85)',
  },
  planCardDesc: {
    fontSize: 10,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  planCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  planCardDays: {
    fontSize: 9,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.3)',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  activeBadgeText: {
    fontSize: 8,
    fontFamily: 'ManropeSemiBold',
    color: colors.sage,
  },
});
