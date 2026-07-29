import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';

export default function ActivePlan({ plan, onContinue }) {
  if (!plan) return null;

  const progressPercent = Math.min(
    (plan.currentDay / plan.planDuration) * 100,
    100
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tag}>Plano activo</Text>
      <Text style={styles.name}>{plan.planTitle}</Text>
      <Text style={styles.progressText}>
        Dia {plan.currentDay} de {plan.planDuration}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
      <AnimatedPressable onPress={onContinue}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Continuar leitura →</Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brownCardBg,
    borderWidth: 1.5,
    borderColor: colors.brownCardBorder,
    borderRadius: borderRadius.card,
    padding: 16,
  },
  tag: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.sage,
    marginBottom: 6,
    fontFamily: 'ManropeSemiBold',
  },
  name: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 3,
    fontFamily: 'ManropeLight',
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
    fontFamily: 'ManropeRegular',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.white08,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.sage,
    borderRadius: 2,
  },
  button: {
    marginTop: 14,
    height: 42,
    borderRadius: borderRadius.button,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: 0.5,
    fontFamily: 'ManropeSemiBold',
  },
});
