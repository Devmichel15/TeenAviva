import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function StreakHero({ streak, weekDays }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.number}>{streak}</Text>
        <Text style={styles.label}>dias de Chama</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.weekLabel}>esta semana</Text>
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
                  styles.dayText,
                  (day.completed || day.isToday) && styles.dayTextActive,
                ]}
              >
                {day.label.charAt(0)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(201,151,58,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.25)',
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  number: {
    fontSize: 32,
    fontWeight: '200',
    color: colors.gold,
    fontFamily: 'ManropeLight',
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'ManropeRegular',
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  weekLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(201,151,58,0.6)',
    fontFamily: 'ManropeSemiBold',
  },
  dayRow: {
    flexDirection: 'row',
    gap: 3,
  },
  day: {
    width: 22,
    height: 22,
    borderRadius: 6,
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
  dayText: {
    fontSize: 7,
    fontWeight: '500',
    fontFamily: 'ManropeSemiBold',
  },
  dayTextActive: {
    color: colors.background,
  },
});
