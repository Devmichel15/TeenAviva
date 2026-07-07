import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function StatsRow({ streak, chaptersRead, plansCompleted }) {
  return (
    <View style={styles.row}>
      <StatCard value={streak} label="dias de Chama" />
      <StatCard value={chaptersRead} label="caps lidos" />
      <StatCard value={plansCompleted} label="planos feitos" />
    </View>
  );
}

function StatCard({ value, label }) {
  return (
    <View style={styles.card}>
      <Text style={styles.number}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white04,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 3,
  },
  number: {
    fontSize: 22,
    fontWeight: '200',
    color: colors.gold,
    fontFamily: 'ManropeLight',
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    fontFamily: 'ManropeSemiBold',
  },
});
