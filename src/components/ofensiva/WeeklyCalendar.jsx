import { View, Text, StyleSheet } from 'react-native';
import { Flame, Check } from 'lucide-react-native';
import { colors } from '../../constants/theme';

export default function WeeklyCalendar({ weekDays }) {
  return (
    <View style={styles.grid}>
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
              styles.label,
              (day.completed || day.isToday) && styles.labelActive,
            ]}
          >
            {day.label}
          </Text>
          {day.completed && <Check size={12} color={colors.sage} />}
          {day.isToday && !day.completed && <Flame size={12} color={colors.gold} />}
          {!day.completed && !day.isToday && (
            <Text style={styles.empty}>—</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 4,
  },
  day: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    gap: 3,
  },
  dayDone: {
    backgroundColor: 'rgba(163,177,138,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(163,177,138,0.3)',
  },
  dayToday: {
    backgroundColor: 'rgba(201,151,58,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.4)',
  },
  dayOff: {
    backgroundColor: colors.white04,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  label: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'ManropeSemiBold',
  },
  labelActive: {
    color: colors.sage,
  },
  empty: {
    fontSize: 12,
    opacity: 0.2,
    color: '#fff',
  },
});
