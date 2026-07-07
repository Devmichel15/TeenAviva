import { View, StyleSheet } from 'react-native';
import Skeleton from '../ui/Skeleton';

export default function IASkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={44} borderRadius={12} style={{ marginBottom: 20 }} />
      <Skeleton height={60} borderRadius={14} style={{ marginBottom: 16 }} />
      <View style={styles.messages}>
        <Skeleton
          width="70%"
          height={50}
          borderRadius={12}
          style={{ alignSelf: 'flex-end', marginBottom: 12 }}
        />
        <Skeleton width="88%" height={80} borderRadius={12} />
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
  messages: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
