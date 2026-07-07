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
    borderWidth: 1,
    borderColor: colors.brownCardBorder,
    borderRadius: 16,
    padding: 13,
  },
  tag: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.sage,
    marginBottom: 5,
    fontFamily: 'ManropeSemiBold',
  },
  name: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 3,
    fontFamily: 'ManropeLight',
  },
  progressText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
    fontFamily: 'ManropeRegular',
  },
  progressBar: {
    height: 3,
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
    marginTop: 12,
    height: 40,
    borderRadius: borderRadius.pill,
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
