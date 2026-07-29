import { View, Text, StyleSheet } from 'react-native';
import { Book } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';

export default function OtherPlans({ plans, onSelect }) {
  if (!plans || plans.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>outros planos</Text>
      <View style={styles.row}>
        {plans.slice(0, 2).map((plan) => (
          <AnimatedPressable key={plan.id} onPress={() => onSelect(plan)}>
            <View style={styles.card}>
              <Book size={16} color="rgba(255,255,255,0.5)" />
              <Text style={styles.name}>{plan.title}</Text>
              <Text style={styles.duration}>{plan.duration} dias</Text>
            </View>
          </AnimatedPressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: 'ManropeSemiBold',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white04,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.card,
    padding: 14,
  },
  name: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16,
    fontFamily: 'ManropeRegular',
    marginTop: 6,
  },
  duration: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
    marginTop: 2,
    fontFamily: 'ManropeRegular',
  },
});
