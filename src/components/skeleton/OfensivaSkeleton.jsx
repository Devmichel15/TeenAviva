import { View, StyleSheet } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { borderRadius } from '../../constants/theme';

export default function ChamaSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={36} borderRadius={borderRadius.button} style={{ marginBottom: 16 }} />
      <Skeleton height={80} borderRadius={borderRadius.card} style={{ marginBottom: 16 }} />
      <Skeleton height={60} borderRadius={borderRadius.card} style={{ marginBottom: 12 }} />
      <Skeleton height={120} borderRadius={borderRadius.card} style={{ marginBottom: 16 }} />
      <Skeleton height={14} width="30%" style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}><Skeleton height={80} borderRadius={borderRadius.card} /></View>
        <View style={{ flex: 1 }}><Skeleton height={80} borderRadius={borderRadius.card} /></View>
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
