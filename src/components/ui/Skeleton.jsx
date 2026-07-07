import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors } from '../../constants/theme';

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width,
          height,
          borderRadius,
          backgroundColor: colors.white08,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <>
      <Skeleton height={18} style={{ marginBottom: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? '60%' : '100%'}
          style={{ marginBottom: 8 }}
        />
      ))}
    </>
  );
}

export function SkeletonStreakCard() {
  return (
    <Skeleton height={100} borderRadius={18} style={{ marginBottom: 12 }} />
  );
}

export function SkeletonVerseCard() {
  return (
    <Skeleton height={130} borderRadius={18} style={{ marginBottom: 12 }} />
  );
}
