import { View, StyleSheet } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { borderRadius } from '../../constants/theme';

export default function PerfilSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={20} width="30%" style={{ marginBottom: 24 }} />
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 20 }}>
        <Skeleton width={64} height={64} borderRadius={borderRadius.card} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton height={18} width="60%" />
          <Skeleton height={10} width="40%" />
          <Skeleton height={10} width="70%" />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={{ flex: 1 }}><Skeleton height={60} borderRadius={borderRadius.card} /></View>
        ))}
      </View>
      <Skeleton height={60} borderRadius={borderRadius.card} style={{ marginBottom: 16 }} />
      <Skeleton height={14} width="30%" style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={{ flex: 1 }}><Skeleton height={70} borderRadius={borderRadius.card} /></View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingTop: 30,
    flex: 1,
  },
});
