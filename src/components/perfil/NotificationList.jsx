import { View, Text, StyleSheet } from 'react-native';
import { Bell, Zap, BookOpen } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';
import Toggle from '../ui/Toggle';

const SETTINGS = [
  { key: 'dailyReminder', label: 'Lembrete diário', sub: 'Notifica para ler todos os dias', icon: Bell },
  { key: 'streakAlert', label: 'Alerta de Chama', sub: 'Avisa quando a chama está fraca', icon: Zap },
  { key: 'verseOfDay', label: 'Versículo do dia', sub: 'Envia o versículo todas as manhãs', icon: BookOpen },
];

export default function NotificationList({ preferences, onToggle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Notificações</Text>
      <View style={styles.card}>
        {SETTINGS.map((setting, i) => {
          const IconComponent = setting.icon;
          return (
            <View
              key={setting.key}
              style={[styles.row, i < SETTINGS.length - 1 && styles.rowBorder]}
            >
              <View style={styles.left}>
                <View style={styles.iconWrap}>
                  <IconComponent size={14} color={colors.primaryBrown} />
                </View>
                <View>
                  <Text style={styles.label}>{setting.label}</Text>
                  <Text style={styles.sub}>{setting.sub}</Text>
                </View>
              </View>
              <Toggle
                value={preferences?.[setting.key] ?? true}
                onValueChange={(v) => onToggle(setting.key, v)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: 'ManropeSemiBold',
  },
  card: {
    backgroundColor: colors.white04,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white06,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 30,
    height: 30,
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
    fontFamily: 'ManropeRegular',
    marginTop: 1,
  },
});
