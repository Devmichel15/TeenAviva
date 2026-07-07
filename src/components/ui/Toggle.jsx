import { useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function Toggle({ value, onValueChange, style }) {
  const translateX = useRef(new Animated.Value(value ? 14 : 0)).current;

  function handlePress() {
    const newValue = !value;
    Animated.spring(translateX, {
      toValue: newValue ? 14 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 180,
    }).start();
    onValueChange(newValue);
  }

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.toggle,
        { backgroundColor: value ? colors.sage : colors.white08 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 34,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 0,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginLeft: 3,
  },
});
