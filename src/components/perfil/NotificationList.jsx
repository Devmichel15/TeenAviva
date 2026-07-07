import { View, Text, StyleSheet } from 'react-native';
import { Bell, Flame, Book } from 'lucide-react-native';
import { colors } from '../../constants/theme';
import Toggle from '../ui/Toggle';

const NOTIFICATIONS = [
  {
    id: 'daily',
    label: 'Lembrete diário',
    sublabel: 'Todos os dias às 20:00',
    key: 'dailyReminder',
  },
  {
    id: 'streak',
    label: 'Alerta de Chama',
    sublabel: 'Quando estás prestes a perder',
    key: 'streakAlert',
  },
  {
    id: 'verse',
    label: 'Versículo do dia',
    sublabel: 'Todos os dias às 08:00',
    key: 'verseOfDay',
  },
];

export default function NotificationList({ preferences, onToggle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>notificações</Text>
      <View style={styles.card}>
        {NOTIFICATIONS.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.left}>
              <View style={styles.iconWrap}>
                {item.id === 'daily' && <Bell size={14} color={colors.primaryBrown} />}
                {item.id === 'streak' && <Flame size={14} color={colors.primaryBrown} />}
                {item.id === 'verse' && <Book size={14} color={colors.primaryBrown} />}
              </View>
              <View>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.sub}>{item.sublabel}</Text>
              </View>
            </View>
            <Toggle
              value={Boolean(preferences?.[item.key] ?? true)}
              onValueChange={(v) => onToggle(item.key, v)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: 'ManropeSemiBold',
  },
  card: {
    backgroundColor: colors.white04,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.white06,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(140,94,60,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'ManropeRegular',
  },
  sub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 1,
    fontFamily: 'ManropeRegular',
  },
});
