import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from './AnimatedPressable';

export default function StreakPill({ streak, onPress }) {
  return (
    <AnimatedPressable onPress={onPress}>
      <View style={styles.pill}>
        <Flame size={11} color={colors.gold} />
        <Text style={styles.number}>{streak}</Text>
        <Text style={styles.label}>dias</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201,151,58,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.28)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  number: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
    fontFamily: 'ManropeSemiBold',
  },
  label: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'ManropeRegular',
  },
});
