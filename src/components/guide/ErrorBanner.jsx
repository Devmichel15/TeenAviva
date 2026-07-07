import { View, Text, StyleSheet } from 'react-native';
import AnimatedPressable from '../ui/AnimatedPressable';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <AnimatedPressable onPress={onDismiss} scaleTo={0.95}>
          <Text style={styles.dismiss}>OK</Text>
        </AnimatedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(201, 59, 59, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201, 59, 59, 0.25)',
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 8,
    padding: 10,
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 11,
    color: 'rgba(255, 150, 150, 0.85)',
    fontFamily: 'ManropeLight',
    lineHeight: 16,
  },
  dismiss: {
    fontSize: 11,
    color: 'rgba(255, 150, 150, 0.7)',
    fontFamily: 'ManropeSemiBold',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
