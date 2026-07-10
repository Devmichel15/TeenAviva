import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';
import { getRandomMessage, shouldShowMotivation } from '../../data/readingPlans/motivationalMessages';
import FadeIn from '../ui/FadeIn';
import AnimatedPressable from '../ui/AnimatedPressable';

export default function MotivationalBanner({ daysSinceLastRead, flameCount, onGoToPlan }) {
  if (!shouldShowMotivation(daysSinceLastRead)) return null;

  const message = getRandomMessage(daysSinceLastRead);

  return (
    <FadeIn delay={150}>
      <AnimatedPressable onPress={onGoToPlan} scaleTo={0.98}>
        <View style={styles.banner}>
          <View style={styles.iconWrap}>
            <Flame size={18} color={colors.gold} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.message}>{message}</Text>
            {flameCount > 0 && (
              <Text style={styles.flameCount}>
                {flameCount} Chamas da Fé
              </Text>
            )}
          </View>
        </View>
      </AnimatedPressable>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: borderRadius.card,
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,151,58,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  message: {
    fontSize: 11,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 16,
  },
  flameCount: {
    fontSize: 9,
    fontFamily: 'ManropeSemiBold',
    color: colors.gold,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
