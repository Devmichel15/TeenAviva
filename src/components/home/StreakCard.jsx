import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';
import FadeIn from '../ui/FadeIn';

export default function StreakCard({ streak, activePlan, onContinue }) {
  const weekDays = streak?.weeklyLog ?? [];

  return (
    <FadeIn delay={200}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.left}>
            <Text style={styles.number}>{streak?.currentStreak ?? 0}</Text>
            <View style={styles.unitRow}>
              <Text style={styles.unit}>dias de Chama</Text>
              <Flame size={10} color="rgba(255,255,255,0.4)" />
            </View>
          </View>
          <AnimatedPressable onPress={onContinue}>
            <View style={styles.continueBtn}>
              <Text style={styles.continueText}>Continuar →</Text>
            </View>
          </AnimatedPressable>
        </View>

        {activePlan && (
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{activePlan.planTitle}</Text>
            <Text style={styles.planProgress}>
              Dia {activePlan.currentDay} de {activePlan.planDuration}
            </Text>
          </View>
        )}

        <View style={styles.dayRow}>
          {weekDays.map((day, i) => (
            <View
              key={i}
              style={[
                styles.day,
                day.completed && styles.dayDone,
                day.isToday && styles.dayToday,
                !day.completed && !day.isToday && styles.dayOff,
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  (day.completed || day.isToday) && styles.dayLabelActive,
                ]}
              >
                {day.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brownCardBg,
    borderWidth: 1,
    borderColor: colors.brownCardBorder,
    borderRadius: borderRadius.card,
    padding: 13,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  number: {
    fontSize: 28,
    fontWeight: '200',
    color: colors.gold,
    lineHeight: 28,
    fontFamily: 'ManropeLight',
  },
  unit: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'ManropeRegular',
  },
  continueBtn: {
    backgroundColor: colors.sage,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  continueText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: 0.5,
    fontFamily: 'ManropeSemiBold',
  },
  planInfo: {
    marginBottom: 8,
  },
  planName: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'ManropeRegular',
  },
  planProgress: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'ManropeRegular',
  },
  dayRow: {
    flexDirection: 'row',
    gap: 4,
  },
  day: {
    flex: 1,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDone: {
    backgroundColor: colors.sage,
  },
  dayToday: {
    backgroundColor: colors.gold,
  },
  dayOff: {
    backgroundColor: colors.white06,
  },
  dayLabel: {
    fontSize: 8,
    fontWeight: '500',
    fontFamily: 'ManropeSemiBold',
  },
  dayLabelActive: {
    color: colors.background,
  },
});
