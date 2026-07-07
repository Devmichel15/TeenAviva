import { useRef } from 'react';
import { Pressable, Animated } from 'react-native';

export default function AnimatedPressable({
  children,
  scaleTo = 0.96,
  style,
  ...props
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
