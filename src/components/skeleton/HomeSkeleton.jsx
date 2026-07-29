import { View, StyleSheet } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { borderRadius } from '../../constants/theme';

export default function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={36} borderRadius={borderRadius.button} style={{ marginBottom: 20 }} />
      <Skeleton height={14} width="50%" style={{ marginBottom: 16 }} />
      <Skeleton height={130} borderRadius={borderRadius.card} style={{ marginBottom: 12 }} />
      <Skeleton height={100} borderRadius={borderRadius.card} style={{ marginBottom: 12 }} />
      <Skeleton height={14} width="40%" style={{ marginBottom: 12 }} />
      <View style={styles.chips}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            width={i % 2 === 0 ? 90 : 70}
            height={28}
            borderRadius={borderRadius.chip}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingTop: 30,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
