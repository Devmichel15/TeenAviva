import { useRef } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function NavItem({ icon: Icon, isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
      damping: 12,
      stiffness: 250,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 10,
      stiffness: 180,
    }).start();
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
        <View style={[isActive ? styles.activeBox : styles.inactiveBox]}>
          <Icon
            size={22}
            color={isActive ? colors.brownDeep : colors.gold}
            strokeWidth={isActive ? 2 : 1.8}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.brownDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
