import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDot = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 150);
    const anim3 = animateDot(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sig}>
        <View style={styles.dot} />
        <Animated.Text style={[styles.name, { opacity: dot1 }]}>guia</Animated.Text>
      </View>
      <View style={styles.bubble}>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot1, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot2, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot3, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    alignItems: 'flex-start',
    maxWidth: '92%',
  },
  sig: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.sage,
  },
  name: {
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.sage,
    fontFamily: 'ManropeSemiBold',
  },
  bubble: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot1: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  dot2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  dot3: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
});
